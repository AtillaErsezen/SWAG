#!/usr/bin/env python3
"""
Quiz & Flashcard Generation Agent
Reads markdown documents from output/markdown/ and generates:
  - 5 quiz questions (4 options each, with correct answer + explanation)
  - 10 flashcards (term + definition)
per document, saved as JSON to output/quizzes/.
Uses the Anthropic Claude API with streaming and prompt caching.
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv
import anthropic

load_dotenv()

MARKDOWN_DIR = Path("output/markdown")
QUIZZES_DIR = Path("output/quizzes")
MODEL = "claude-opus-4-7"

SYSTEM_PROMPT = """You are an expert instructional designer who creates high-quality educational materials from technical documents.

Your task is to read the provided document and produce:
1. Exactly 5 multiple-choice quiz questions, each with 4 answer options (A, B, C, D), the correct answer letter, and a brief explanation.
2. Exactly 10 flashcards, each with a concise term and a clear definition.

Focus on the most important safety procedures, operational steps, key terminology, and critical facts in the document.

Respond ONLY with a valid JSON object matching this exact structure — no markdown fences, no extra text:
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correct_answer": "A",
      "explanation": "Brief explanation of why A is correct."
    }
  ],
  "flashcards": [
    {
      "term": "Term or concept",
      "definition": "Clear, concise definition."
    }
  ]
}"""


def load_markdown(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def generate_for_document(client: anthropic.Anthropic, doc_name: str, content: str) -> dict:
    print(f"  Generating quiz & flashcards for: {doc_name}")

    # Retry up to 3 times on connection errors (common after long-running requests).
    last_exc = None
    for attempt in range(1, 4):
        try:
            with client.messages.stream(
                model=MODEL,
                max_tokens=4096,
                thinking={"type": "adaptive"},
                system=[
                    {
                        "type": "text",
                        "text": SYSTEM_PROMPT,
                        "cache_control": {"type": "ephemeral"},
                    }
                ],
                messages=[
                    {
                        "role": "user",
                        "content": (
                            f"Document name: {doc_name}\n\n"
                            f"Document content:\n\n{content}"
                        ),
                    }
                ],
            ) as stream:
                final_message = stream.get_final_message()
            break  # success
        except anthropic.APIConnectionError as e:
            last_exc = e
            wait = 5 * attempt
            print(f"    Connection error (attempt {attempt}/3), retrying in {wait}s... ({e})")
            time.sleep(wait)
    else:
        raise last_exc

    # Extract the text block from the response
    raw_text = ""
    for block in final_message.content:
        if block.type == "text":
            raw_text = block.text.strip()
            break

    # Parse JSON — strip accidental markdown fences if present
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        raw_text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        print(f"    WARNING: JSON parse error for {doc_name}: {e}")
        data = {"quiz": [], "flashcards": [], "error": str(e), "raw": raw_text}

    usage = final_message.usage
    print(
        f"    Tokens — input: {usage.input_tokens}, "
        f"cache_read: {usage.cache_read_input_tokens}, "
        f"cache_write: {usage.cache_creation_input_tokens}, "
        f"output: {usage.output_tokens}"
    )

    return data


def validate_output(data: dict, doc_name: str) -> dict:
    """Ensure the output has exactly 5 quiz items and 10 flashcards."""
    quiz = data.get("quiz", [])
    flashcards = data.get("flashcards", [])

    if len(quiz) != 5:
        print(f"    WARNING: Expected 5 quiz items, got {len(quiz)} for {doc_name}")
    if len(flashcards) != 10:
        print(f"    WARNING: Expected 10 flashcards, got {len(flashcards)} for {doc_name}")

    return data


def main():
    # Optional argument: name of a single document to process (with or without .md)
    # Usage:
    #   python quiz_flashcard_agent.py                        # all documents
    #   python quiz_flashcard_agent.py backhoe_loader_manual  # one document
    target = sys.argv[1].removesuffix(".md") if len(sys.argv) > 1 else None

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY not set. Add it to your .env file:\n"
            "  ANTHROPIC_API_KEY=your-key-here"
        )

    client = anthropic.Anthropic(
        api_key=api_key,
        max_retries=2,
        timeout=anthropic.Timeout(connect=10.0, read=300.0, write=30.0, pool=10.0),
    )

    if target:
        md_path = MARKDOWN_DIR / f"{target}.md"
        if not md_path.exists():
            available = [f.stem for f in sorted(MARKDOWN_DIR.glob("*.md"))]
            print(f"Document '{target}.md' not found in {MARKDOWN_DIR}/")
            print(f"Available: {', '.join(available)}")
            sys.exit(1)
        md_files = [md_path]
    else:
        md_files = sorted(MARKDOWN_DIR.glob("*.md"))
        if not md_files:
            print(f"No markdown files found in {MARKDOWN_DIR}")
            return

    QUIZZES_DIR.mkdir(parents=True, exist_ok=True)

    label = f"1 document ({target})" if target else f"{len(md_files)} document(s)"
    print(f"Generating quizzes & flashcards for {label}...\n")

    results_summary = []

    for i, md_path in enumerate(md_files):
        doc_name = md_path.stem
        content = load_markdown(md_path)

        data = generate_for_document(client, doc_name, content)
        data = validate_output(data, doc_name)

        output = {
            "document": doc_name,
            "source_file": str(md_path),
            "quiz": data.get("quiz", []),
            "flashcards": data.get("flashcards", []),
        }
        if "error" in data:
            output["error"] = data["error"]

        out_path = QUIZZES_DIR / f"{doc_name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"    Saved → {out_path}\n")

        if i < len(md_files) - 1:
            time.sleep(2)

        results_summary.append(
            {
                "document": doc_name,
                "quiz_count": len(output["quiz"]),
                "flashcard_count": len(output["flashcards"]),
                "output_file": str(out_path),
            }
        )

    # Update the index file
    index_path = QUIZZES_DIR / "_index.json"
    existing = []
    if index_path.exists():
        with open(index_path, encoding="utf-8") as f:
            existing = json.load(f)
    # Replace entries for processed docs, keep the rest
    processed_names = {r["document"] for r in results_summary}
    merged = [e for e in existing if e["document"] not in processed_names] + results_summary
    merged.sort(key=lambda r: r["document"])
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2)

    print("=" * 60)
    print(f"Done. Generated materials for {len(results_summary)} document(s).")
    print(f"Index: {index_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
