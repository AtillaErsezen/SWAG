"""Phase I: Data Ingestion (The Cleaner)
Load existing markdown files or convert PDF manuals to structured Markdown.
Now primarily works with pre-converted markdown files.
"""

import os
from pathlib import Path
from typing import Optional, List
from tqdm import tqdm


def load_existing_markdowns(markdown_dir: str = "output/markdown") -> List[str]:
    """
    Load all existing markdown files from a directory.
    
    Args:
        markdown_dir: Directory containing markdown files
        
    Returns:
        List of paths to markdown files
    """
    markdown_dir = Path(markdown_dir)
    
    if not markdown_dir.exists():
        print(f"⚠️ Markdown directory not found: {markdown_dir}")
        return []
    
    md_files = list(markdown_dir.glob("*.md"))
    
    if not md_files:
        print(f"⚠️ No markdown files found in {markdown_dir}")
        return []
    
    print(f"📂 Loading {len(md_files)} markdown files:")
    for md in md_files:
        size_kb = md.stat().st_size / 1024
        print(f"   - {md.name} ({size_kb:.1f} KB)")
    print()
    
    return [str(f) for f in md_files]


# Legacy PDF conversion functions (kept for reference if needed)
try:
    import pymupdf4llm
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False


def convert_pdf_to_markdown(
    pdf_path: str,
    output_dir: str = "output/markdown",
    page_chunks: bool = False,
    _legacy: bool = True  # Mark as legacy function
) -> str:
    """[LEGACY] Convert a PDF file to structured Markdown.
    
    NOTE: Markdown files are already pre-converted. Use load_existing_markdowns() instead.
    
    Args:
        pdf_path: Path to the source PDF file
        output_dir: Directory to save the .md output
        page_chunks: If True, separate pages with markers
        
    Returns:
        Path to the generated Markdown file
    """
    if not HAS_PYMUPDF:
        raise ImportError("pymupdf4llm is required for PDF conversion. Use pre-converted markdown files instead.")
    
    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate output filename
    output_file = output_dir / f"{pdf_path.stem}.md"
    
    print(f"📄 Converting: {pdf_path.name}")
    print(f"   Size: {pdf_path.stat().st_size / 1024 / 1024:.1f} MB")
    
    # Convert using PyMuPDF4LLM
    try:
        md_text = pymupdf4llm.to_markdown(
            str(pdf_path),
            page_chunks=page_chunks,
            write_images=False,  # Skip embedded images
            show_progress=True
        )
        
        # Handle page_chunks output (returns list)
        if isinstance(md_text, list):
            md_text = "\n\n---\n\n".join(
                chunk.get("text", "") if isinstance(chunk, dict) else str(chunk)
                for chunk in md_text
            )
        
        # Write to file
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(md_text)
        
        print(f"✅ Saved: {output_file}")
        print(f"   Characters: {len(md_text):,}")
        
        return str(output_file)
        
    except Exception as e:
        print(f"❌ Error converting {pdf_path.name}: {e}")
        raise


def batch_convert_pdfs(
    input_dir: str = "manuals",
    output_dir: str = "output/markdown"
) -> list[str]:
    """
    Convert all PDFs in a directory to Markdown.
    
    Args:
        input_dir: Directory containing PDF files
        output_dir: Directory to save .md outputs
        
    Returns:
        List of paths to generated Markdown files
    """
    input_dir = Path(input_dir)
    pdf_files = list(input_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"⚠️ No PDF files found in {input_dir}")
        return []
    
    print(f"🔍 Found {len(pdf_files)} PDF files:")
    for pdf in pdf_files:
        print(f"   - {pdf.name} ({pdf.stat().st_size / 1024 / 1024:.1f} MB)")
    print()
    
    output_files = []
    for pdf_path in tqdm(pdf_files, desc="Converting PDFs"):
        try:
            output_path = convert_pdf_to_markdown(str(pdf_path), output_dir)
            output_files.append(output_path)
        except Exception as e:
            print(f"⚠️ Skipping {pdf_path.name}: {e}")
    
    print(f"\n✨ Converted {len(output_files)}/{len(pdf_files)} PDFs")
    return output_files


def extract_safety_sentences(markdown_path: str) -> list[dict]:
    """
    Extract sentences containing safety-related keywords from Markdown.
    
    Args:
        markdown_path: Path to the Markdown file
        
    Returns:
        List of dicts with 'text', 'context', and 'keywords'
    """
    import re
    
    SAFETY_KEYWORDS = [
        # Prohibitions
        r"\bnever\b", r"\bdo not\b", r"\bdon't\b", r"\bforbidden\b",
        r"\bprohibited\b", r"\bmust not\b", r"\bavoid\b",
        # Warnings
        r"\bdanger\b", r"\bwarning\b", r"\bcaution\b", r"\bhazard\b",
        r"\brisk\b", r"\binjury\b", r"\bdeath\b", r"\bcritical\b",
        # Operational
        r"\bensure\b", r"\bstep\b", r"\bengage\b", r"\bactivate\b",
        r"\blower\b", r"\braise\b", r"\bstart\b", r"\bstop\b"
    ]
    
    with open(markdown_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', content)
    
    # Track current section header
    current_section = "Unknown"
    results = []
    
    for sentence in sentences:
        # Check for header
        header_match = re.match(r'^#+\s*(.+)$', sentence.strip(), re.MULTILINE)
        if header_match:
            current_section = header_match.group(1).strip()
            continue
        
        # Check for safety keywords
        found_keywords = []
        sentence_lower = sentence.lower()
        
        for keyword_pattern in SAFETY_KEYWORDS:
            if re.search(keyword_pattern, sentence_lower):
                found_keywords.append(keyword_pattern.replace(r"\b", ""))
        
        if found_keywords:
            # Clean the sentence
            clean_sentence = re.sub(r'\s+', ' ', sentence).strip()
            clean_sentence = re.sub(r'\*+', '', clean_sentence)  # Remove markdown bold/italic
            
            if len(clean_sentence) > 20:  # Skip very short fragments
                results.append({
                    "text": clean_sentence,
                    "context": current_section,
                    "keywords": found_keywords
                })
    
    return results


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Convert PDFs to Markdown")
    parser.add_argument("--input", "-i", default="manuals", help="Input directory or PDF file")
    parser.add_argument("--output", "-o", default="output/markdown", help="Output directory")
    parser.add_argument("--extract", "-e", action="store_true", help="Extract safety sentences after conversion")
    
    args = parser.parse_args()
    
    input_path = Path(args.input)
    
    if input_path.is_file():
        md_path = convert_pdf_to_markdown(str(input_path), args.output)
        if args.extract:
            sentences = extract_safety_sentences(md_path)
            print(f"\n📋 Found {len(sentences)} safety-related sentences")
    else:
        md_paths = batch_convert_pdfs(str(input_path), args.output)
        if args.extract:
            total = 0
            for md_path in md_paths:
                sentences = extract_safety_sentences(md_path)
                total += len(sentences)
                print(f"   {Path(md_path).name}: {len(sentences)} sentences")
            print(f"\n📋 Total: {total} safety-related sentences")
