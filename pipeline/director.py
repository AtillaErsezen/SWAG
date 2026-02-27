"""
Phase III: The Visual Director
Generate video prompts for AI video generation using the LLM, grounded in the RAG safety answer.
"""

import json
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, asdict
from tqdm import tqdm


# ── System prompt for video prompt generation ────────────────────────────────
DIRECTOR_SYSTEM_PROMPT = """You are a technical animator creating prompts for an AI video generation model.

Your job: given a safety answer about heavy construction machinery, write a single video generation prompt
that shows the most critical safety action described in the answer.

STRICT STYLE RULES (always apply):
- Art style: Low poly 3D render, Blender style, isometric view
- Background: Minimalist white with subtle shadows
- Machine: use the exact machine mentioned in the answer (e.g. forklift, excavator, bulldozer)
- Human actors: generic orange crash test dummy
- No text, no watermarks, no realistic gore

COLOR / MOOD based on the most critical step:
- If the most critical step is a WARNING (⚠️) or FORBIDDEN (⛔): amber or red lighting, pulsing danger indicators
- If the most critical step is a safe procedure (✅): clean blue/white lighting, smooth motion

OUTPUT FORMAT:
Return ONLY the video prompt (40-80 words). Be specific about:
1. The exact machine (use what the answer mentions)
2. The exact action from the answer (not a generic action)
3. The lighting color matching the safety category
4. Any visual warning symbols if needed

DO NOT include any explanation, preamble, or quotation marks. Just the prompt."""


@dataclass
class VisualPrompt:
    """A visual prompt ready for video generation."""
    machine: str
    category: str
    original_text: str
    visual_reasoning: str
    wan_2_2_prompt: str


def generate_video_prompt(
    query: str,
    rag_answer: str,
    category: str,
    machine: str,
    ollama_model: str = "llama3.2:1b-instruct-q4_K_M"
) -> str:
    """
    Generate a video prompt using the LLM, grounded entirely in the RAG answer.

    Args:
        query: Original user question
        rag_answer: Full RAG-retrieved safety answer with ✅/⚠️/⛔ steps
        category: Safety category (PROHIBITED_ACTION / HAZARD_WARNING / OPERATIONAL_PROCEDURE)
        machine: Machine type mentioned in the query/answer
        azerion_model: Azerion model to use

    Returns:
        Video generation prompt string
    """
    import ollama

    user_prompt = f"""User question: {query}
Machine involved: {machine}
Safety category: {category}

Safety answer from the manual:
{rag_answer}

Write the video generation prompt now:"""

    response = ollama.chat(
        model=ollama_model,
        messages=[
            {"role": "system", "content": DIRECTOR_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        options={"temperature": 0.3}
    )

    prompt = response["message"]["content"].strip().strip('"\'')
    return prompt


def create_visual_prompt_offline(
    text: str,
    category: str,
    machine: str,
    rag_answer: Optional[str] = None
) -> VisualPrompt:
    """
    Fallback: create a basic prompt without LLM.
    Used only when Ollama is unavailable.
    """
    color_map = {
        "PROHIBITED_ACTION": "Red ambient lighting, red holographic warning cross",
        "HAZARD_WARNING": "Amber glowing highlights, pulsing warning indicators",
        "OPERATIONAL_PROCEDURE": "Clean blue/white lighting, smooth professional motion"
    }
    color = color_map.get(category, "Clean lighting")
    source = rag_answer if rag_answer else text
    # Use first 120 chars of RAG answer as action description
    action = source[:120].split("\n")[0].strip()

    prompt = (
        f"Low poly 3D render, isometric view, Blender 3D style, minimalist white background. "
        f"A yellow {machine} construction machine. {action}. "
        f"{color}. High quality, 4k, clean render, no text, no watermark."
    )

    return VisualPrompt(
        machine=machine,
        category=category,
        original_text=text,
        visual_reasoning="Fallback template (Ollama unavailable).",
        wan_2_2_prompt=prompt
    )


def create_visual_prompt_llm(
    text: str,
    category: str,
    machine: str,
    azerion_model: str = "gpt-oss-20b",
    rag_answer: Optional[str] = None
) -> VisualPrompt:
    """
    Create video prompt using Azerion LLM, grounded in the RAG answer.
    Falls back to template if API is unavailable.
    """
    try:
        if rag_answer:
            prompt = generate_video_prompt(text, rag_answer, category, machine, azerion_model)
        else:
            # No RAG answer — use a simplified direct call
            from openai import OpenAI
            import os
            client = OpenAI(
                api_key=os.environ.get("AZERION_VEO3"),
                base_url="https://api.azerion.ai/v1"
            )
            response = client.chat.completions.create(
                model=azerion_model,
                messages=[
                    {"role": "system", "content": DIRECTOR_SYSTEM_PROMPT},
                    {"role": "user", "content": (
                        f"User question: {text}\nMachine: {machine}\nCategory: {category}\n"
                        "Write the video generation prompt now:"
                    )}
                ],
                temperature=0.3
            )
            prompt = response.choices[0].message.content.strip().strip('"\'')

        return VisualPrompt(
            machine=machine,
            category=category,
            original_text=text,
            visual_reasoning="LLM-generated prompt grounded in RAG answer.",
            wan_2_2_prompt=prompt
        )

    except ImportError:
        print("⚠️ Ollama not available, falling back to template")
        return create_visual_prompt_offline(text, category, machine, rag_answer=rag_answer)
    except Exception as e:
        print(f"⚠️ LLM director error: {e}, falling back to template")
        return create_visual_prompt_offline(text, category, machine, rag_answer=rag_answer)


def process_classified_file(
    input_file: str = "output/classified/all_classified.json",
    output_file: str = "output/prompts/wan_2_2_prompts.json",
    use_llm: bool = True,
    azerion_model: str = "gpt-oss-20b",
    limit: Optional[int] = None
) -> list[dict]:
    """Process classified sentences and generate visual prompts."""
    input_path = Path(input_file)
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(input_path, "r", encoding="utf-8") as f:
        classified_data = json.load(f)

    if limit:
        classified_data = classified_data[:limit]

    print(f"🎬 Processing {len(classified_data)} classified sentences")

    results = []

    for item in tqdm(classified_data, desc="Generating prompts"):
        vp = create_visual_prompt_llm(
            text=item["original_text"],
            category=item["category"],
            machine=item.get("machine", "general"),
            azerion_model=azerion_model,
            rag_answer=None  # No RAG answer in batch mode
        )
        results.append(asdict(vp))

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Saved {len(results)} visual prompts to {output_path}")
    if results:
        sample = results[0]
        print(f"   Machine: {sample['machine']}")
        print(f"   Category: {sample['category']}")
        print(f"   Prompt: {sample['wan_2_2_prompt'][:120]}...")

    return results


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate visual prompts")
    parser.add_argument("--input", "-i", default="output/classified/all_classified.json")
    parser.add_argument("--output", "-o", default="output/prompts/wan_2_2_prompts.json")
    parser.add_argument("--model", default="gpt-oss-20b", help="Azerion model name")
    parser.add_argument("--limit", type=int, default=None, help="Limit for testing")

    args = parser.parse_args()

    process_classified_file(
        input_file=args.input,
        output_file=args.output,
        use_llm=True,
        azerion_model=args.model,
        limit=args.limit
    )
