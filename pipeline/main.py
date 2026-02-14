"""Main Pipeline Orchestrator
Run the complete 3-phase safety video generation pipeline.
Now works directly with markdown files (PDFs already converted).
"""

import argparse
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Optional

# Add pipeline to path
sys.path.insert(0, str(Path(__file__).parent))

# Define absolute output directory (SWAG/output)
OUTPUT_DIR = Path(__file__).parent.parent / "output"

from classifier import process_all_markdowns
from director import process_classified_file


def run_full_pipeline(
    output_base: Optional[str] = None,
    use_llm: bool = False,
    ollama_model: str = "llama3",
    limit: Optional[int] = None
) -> dict:
    """
    Run the complete 3-phase pipeline using existing markdown files.
    
    Args:
        output_base: Base output directory
        use_llm: Use Ollama LLM for prompt generation
        ollama_model: Ollama model name
        limit: Limit items for testing
        
    Returns:
        Summary statistics dict
    """
    # Use default output directory if not specified
    if output_base is None:
        output_base = str(OUTPUT_DIR)
    else:
        output_base = str(Path(output_base).resolve())
    
    print("=" * 60)
    print("🏭 SAFETY VIDEO GENERATION PIPELINE")
    print("=" * 60)
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Output Directory: {output_base}")
    print()
    
    stats = {
        "phase_2_sentences": 0,
        "phase_3_prompts": 0,
        "categories": {},
        "machines": {}
    }
    
    # Phase I is skipped - using existing markdown files from markdown_dir
    markdown_dir = f"{output_base}/markdown"

    # Phase II: Classification
    print("=" * 60)
    print("🧠 PHASE II: CLASSIFICATION (The Brain)")
    print("=" * 60)
    
    classified_file = f"{output_base}/classified/all_classified.json"
    classified_data = process_all_markdowns(
        input_dir=markdown_dir,
        output_file=classified_file,
        use_rules_only=True  # Fast rule-based classification
    )
    
    stats["phase_2_sentences"] = len(classified_data)
    
    # Count categories and machines
    for item in classified_data:
        cat = item["category"]
        machine = item["machine"]
        stats["categories"][cat] = stats["categories"].get(cat, 0) + 1
        stats["machines"][machine] = stats["machines"].get(machine, 0) + 1
    
    print()
    
    # Phase III: Visual Direction
    print("=" * 60)
    print("🎬 PHASE III: VISUAL DIRECTOR")
    print("=" * 60)
    
    prompts_file = f"{output_base}/prompts/wan_2_2_prompts.json"
    
    if limit:
        print(f"⚠️ Limited to {limit} prompts for testing")
    
    prompts_data = process_classified_file(
        input_file=classified_file,
        output_file=prompts_file,
        use_llm=use_llm,
        ollama_model=ollama_model,
        limit=limit
    )
    
    stats["phase_3_prompts"] = len(prompts_data)
    print()
    
    # Summary
    print("=" * 60)
    print("✨ PIPELINE COMPLETE")
    print("=" * 60)
    print(f"Ended: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    print("📊 Final Statistics:")
    print(f"   Sentences Classified: {stats['phase_2_sentences']}")
    print(f"   Prompts Generated: {stats['phase_3_prompts']}")
    print()
    print("📁 Output Files:")
    print(f"   Markdown Source: {markdown_dir}/")
    print(f"   Classified: {classified_file}")
    print(f"   Prompts: {prompts_file}")
    print()
    
    # Save stats
    stats_file = f"{output_base}/pipeline_stats.json"
    with open(stats_file, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2)
    print(f"📈 Stats saved: {stats_file}")
    
    return stats


def run_single_markdown(
    markdown_path: str,
    output_base: Optional[str] = None,
    use_llm: bool = False,
    ollama_model: str = "llama3"
) -> dict:
    """
    Run pipeline on a single markdown file.
    Run pipeline on a single markdown file.
    
    Args:
        markdown_path: Path to the markdown file
        output_base: Base output directory
        use_llm: Use Ollama LLM
        ollama_model: Model name
        
    Returns:
        Summary statistics
    """
    from classifier import extract_and_classify
    from director import create_visual_prompt_offline, create_visual_prompt_llm
    from dataclasses import asdict
    
    # Use default output directory if not specified
    if output_base is None:
        output_base = str(OUTPUT_DIR)
    else:
        output_base = str(Path(output_base).resolve())
    
    markdown_name = Path(markdown_path).stem
    
    print(f"🔧 Processing markdown file: {markdown_path}")
    print(f"Output Directory: {output_base}")
    
    # Use existing markdown file
    md_path = markdown_path
    
    # Phase II: Classification
    classified = extract_and_classify(md_path, use_rules_only=True)
    classified_file = f"{output_base}/classified/{markdown_name}_classified.json"
    Path(classified_file).parent.mkdir(parents=True, exist_ok=True)
    
    with open(classified_file, "w", encoding="utf-8") as f:
        json.dump([asdict(c) for c in classified], f, indent=2)
    
    print(f"   Classified: {len(classified)} sentences")
    
    # Phase III: Visual Direction
    prompts = []
    for item in classified:
        if use_llm:
            prompt = create_visual_prompt_llm(
                item.original_text, item.category, item.machine, ollama_model
            )
        else:
            prompt = create_visual_prompt_offline(
                item.original_text, item.category, item.machine
            )
        prompts.append(asdict(prompt))
    
    prompts_file = f"{output_base}/prompts/{markdown_name}_prompts.json"
    Path(prompts_file).parent.mkdir(parents=True, exist_ok=True)
    
    with open(prompts_file, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2)
    
    print(f"   Prompts: {len(prompts)} generated")
    print(f"   Output: {prompts_file}")
    
    return {"sentences": len(classified), "prompts": len(prompts)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Safety Video Generation Pipeline (Markdown-based)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run full pipeline on all existing markdowns
  python main.py --full
  
  # Process a single markdown file
  python main.py --markdown output/markdown/excavator_manual.md
  
  # Use Ollama LLM for prompt generation
  python main.py --full --llm --model llama3
  
  # Test with limited output
  python main.py --full --limit 10
        """
    )
    
    parser.add_argument("--full", action="store_true", help="Run full pipeline on existing markdown files")
    parser.add_argument("--markdown", type=str, help="Process a single markdown file")
    parser.add_argument("--output", default=None, help=f"Output directory (default: {OUTPUT_DIR})")
    parser.add_argument("--llm", action="store_true", help="Use Ollama LLM for prompt generation")
    parser.add_argument("--model", default="llama3", help="Ollama model name")
    parser.add_argument("--limit", type=int, help="Limit prompts for testing")
    
    args = parser.parse_args()
    
    if args.markdown:
        run_single_markdown(
            markdown_path=args.markdown,
            output_base=args.output,
            use_llm=args.llm,
            ollama_model=args.model
        )
    elif args.full:
        run_full_pipeline(
            output_base=args.output,
            use_llm=args.llm,
            ollama_model=args.model,
            limit=args.limit
        )
    else:
        parser.print_help()
        print("\nPlease specify --full or --markdown <path>")
