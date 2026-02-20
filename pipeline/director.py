"""
Phase III: The Visual Director
Translate classified safety text into visual prompts for Wan 2.2 video generation.
"""

import json
import re
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, asdict
from tqdm import tqdm


# Visual style constants
STYLE_GUIDELINES = {
    "base_style": "Low poly 3D render, isometric view, Blender 3D style, minimalist white background",
    "color_coding": {
        "PROHIBITED_ACTION": "Red ambient lighting, red warning holographic effects",
        "HAZARD_WARNING": "Amber/yellow glowing highlights, pulsing warning indicators",
        "OPERATIONAL_PROCEDURE": "Clean blue/white lighting, smooth professional motion"
    },
    "machine_styles": {
        "excavator": "A yellow Caterpillar-style excavator with articulated arm and bucket",
        "bulldozer": "A yellow Caterpillar-style bulldozer with front blade",
        "backhoe_loader": "A yellow backhoe loader with front bucket and rear excavator arm",
        "dump_truck": "A yellow mining dump truck with large rear bed",
        "general": "A yellow heavy construction machine"
    },
    "human_actor": "Generic orange crash test dummy",
    "quality_suffix": "High quality, 4k, clean render, no text, no watermark"
}

# System prompt for LLM translation
DIRECTOR_SYSTEM_PROMPT = """You are a 3D Technical Animator creating visual prompts for AI video generation.

Your task: Convert safety instructions into detailed visual scene descriptions.

STRICT STYLE RULES:
1. Art Style: Low poly 3D render, Blender style, isometric view
2. Background: Minimalist white with subtle shadows
3. Machine: Yellow heavy construction equipment
4. Humans: Generic orange crash test dummy (if needed)
5. NEVER include realistic gore or injury details

COLOR CODING BY CATEGORY:
- PROHIBITED_ACTION: Red ambient lighting, red holographic warning crosses, red glitch effects on impact
- HAZARD_WARNING: Amber/yellow glowing highlights, pulsing warning indicators
- OPERATIONAL_PROCEDURE: Clean blue/white lighting, smooth professional motion

OUTPUT FORMAT:
Return ONLY the visual prompt string (50-100 words). Focus on:
1. Camera angle and framing
2. The machine and its pose/motion
3. Lighting color based on category
4. Any holographic UI elements or warning symbols
5. The specific action being performed

DO NOT:
- Include quotation marks around the output
- Add explanations or commentary
- Repeat the original instruction verbatim
"""


@dataclass
class VisualPrompt:
    """A visual prompt ready for video generation."""
    machine: str
    category: str
    original_text: str
    visual_reasoning: str
    wan_2_2_prompt: str


def create_visual_prompt_offline(
    text: str,
    category: str,
    machine: str
) -> VisualPrompt:
    """
    Create visual prompt using template-based approach (no LLM required).
    
    Args:
        text: Original safety sentence
        category: Classification category
        machine: Machine type
        
    Returns:
        VisualPrompt object
    """
    style = STYLE_GUIDELINES
    machine_desc = style["machine_styles"].get(machine, style["machine_styles"]["general"])
    color_scheme = style["color_coding"][category]
    
    # Extract action keywords
    text_lower = text.lower()
    
    # Build visual reasoning
    if category == "PROHIBITED_ACTION":
        reasoning = "Visualizing the prohibited action to show the safety violation and its consequences."
        action_template = "The machine {action}, triggering {consequence}. Red holographic warning X symbol appears."
    elif category == "HAZARD_WARNING":
        reasoning = "Highlighting the hazard zone with glowing amber indicators to draw attention."
        action_template = "Close-up focus on {hazard_area}. Amber warning glow pulses around the danger zone."
    else:  # OPERATIONAL_PROCEDURE
        reasoning = "Demonstrating the correct operational procedure with clear, professional lighting."
        action_template = "The machine smoothly {action}. Green holographic checkmark confirms correct operation."
    
    # Extract key verbs and objects
    verbs = re.findall(r'\b(swing|lower|raise|move|operate|turn|engage|release|start|stop|drive|lift|dump|load|inspect|check)\w*\b', text_lower)
    objects = re.findall(r'\b(bucket|blade|arm|cab|engine|brake|tracks|wheels|bed|boom|hose|hydraulic|lever|pedal)\w*\b', text_lower)
    
    verb = verbs[0] if verbs else "operates"
    obj = objects[0] if objects else "component"
    
    # Build the prompt
    if category == "PROHIBITED_ACTION":
        if "worker" in text_lower or "person" in text_lower or "operator" in text_lower:
            specific_action = f"{verb}s the {obj} toward an orange crash test dummy standing nearby"
            consequence = "Red danger zone hologram"
        elif "over" in text_lower:
            specific_action = f"{verb}s the {obj} over a restricted zone"
            consequence = "red holographic barrier"
        elif "overload" in text_lower or "exceed" in text_lower:
            specific_action = f"has an overloaded {obj}, tipping forward slightly"
            consequence = "structural stress warning indicators"
        else:
            specific_action = f"performs an unsafe {verb} motion with the {obj}"
            consequence = "red warning hologram"
        
        prompt = f"{style['base_style']}. {machine_desc} {specific_action}. {consequence} flashes. {color_scheme}. {style['quality_suffix']}"
        
    elif category == "HAZARD_WARNING":
        if "hydraulic" in text_lower or "hose" in text_lower:
            hazard_focus = "hydraulic hoses with pulsing amber leak warning indicators"
        elif "electric" in text_lower or "power" in text_lower:
            hazard_focus = "electrical components with yellow lightning bolt warning symbols"
        elif "slope" in text_lower or "incline" in text_lower:
            hazard_focus = "the machine on an incline with amber stability warning indicators"
        else:
            hazard_focus = f"the {obj} area with pulsing amber hazard indicators"
        
        prompt = f"Close-up 3D render, detailed view. {machine_desc}. Focus on {hazard_focus}. {color_scheme}. Depth of field, {style['quality_suffix']}"
        
    else:  # OPERATIONAL_PROCEDURE
        if "brake" in text_lower or "park" in text_lower:
            action_desc = "smoothly engages the parking brake. A green 'P' hologram appears above the cab"
        elif "lower" in text_lower:
            action_desc = f"smoothly lowers the {obj} to the ground. Green checkmark indicator confirms"
        elif "start" in text_lower or "engine" in text_lower:
            action_desc = "starts up with the dashboard showing green indicators"
        else:
            action_desc = f"{verb}s the {obj} with precise, controlled motion"
        
        prompt = f"{style['base_style']}. {machine_desc} {action_desc}. {color_scheme}, professional studio lighting. {style['quality_suffix']}"
    
    return VisualPrompt(
        machine=machine,
        category=category,
        original_text=text,
        visual_reasoning=reasoning,
        wan_2_2_prompt=prompt
    )


def create_visual_prompt_llm(
    text: str,
    category: str,
    machine: str,
    ollama_model: str = "llama3.2:1b-instruct-q4_K_M"
) -> VisualPrompt:
    """
    Create visual prompt using Ollama LLM for more creative translations.
    
    Args:
        text: Original safety sentence
        category: Classification category
        machine: Machine type
        ollama_model: Ollama model name
        
    Returns:
        VisualPrompt object
    """
    try:
        import ollama
        
        machine_desc = STYLE_GUIDELINES["machine_styles"].get(machine, "yellow heavy machine")
        
        user_prompt = f"""Category: {category}
Machine: {machine_desc}
Safety Instruction: {text}

Create the visual scene description:"""
        
        response = ollama.chat(
            model=ollama_model,
            messages=[
                {"role": "system", "content": DIRECTOR_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        wan_prompt = response['message']['content'].strip()
        wan_prompt = wan_prompt.strip('"\'')  # Remove quotes if present
        
        reasoning = f"LLM-generated visual translation for {category} scenario."
        
        return VisualPrompt(
            machine=machine,
            category=category,
            original_text=text,
            visual_reasoning=reasoning,
            wan_2_2_prompt=wan_prompt
        )
        
    except ImportError:
        print("⚠️ Ollama not available, falling back to template-based generation")
        return create_visual_prompt_offline(text, category, machine)
    except Exception as e:
        print(f"⚠️ LLM error: {e}, falling back to template")
        return create_visual_prompt_offline(text, category, machine)


def process_classified_file(
    input_file: str = "output/classified/all_classified.json",
    output_file: str = "output/prompts/wan_2_2_prompts.json",
    use_llm: bool = False,
    ollama_model: str = "llama3",
    limit: Optional[int] = None
) -> list[dict]:
    """
    Process classified sentences and generate visual prompts.
    
    Args:
        input_file: Path to classified JSON
        output_file: Path for output prompts JSON
        use_llm: Use Ollama LLM for generation
        ollama_model: Model name if using LLM
        limit: Limit number of prompts (for testing)
        
    Returns:
        List of visual prompt dicts
    """
    input_path = Path(input_file)
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(input_path, "r", encoding="utf-8") as f:
        classified_data = json.load(f)
    
    if limit:
        classified_data = classified_data[:limit]
    
    print(f"🎬 Processing {len(classified_data)} classified sentences")
    print(f"   Mode: {'LLM (Ollama)' if use_llm else 'Template-based'}")
    
    results = []
    
    for item in tqdm(classified_data, desc="Generating prompts"):
        if use_llm:
            prompt = create_visual_prompt_llm(
                text=item["original_text"],
                category=item["category"],
                machine=item["machine"],
                ollama_model=ollama_model
            )
        else:
            prompt = create_visual_prompt_offline(
                text=item["original_text"],
                category=item["category"],
                machine=item["machine"]
            )
        
        results.append(asdict(prompt))
    
    # Save results
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Saved {len(results)} visual prompts to {output_path}")
    
    # Show sample
    print("\n📝 Sample Output:")
    if results:
        sample = results[0]
        print(f"   Machine: {sample['machine']}")
        print(f"   Category: {sample['category']}")
        print(f"   Original: {sample['original_text'][:80]}...")
        print(f"   Prompt: {sample['wan_2_2_prompt'][:100]}...")
    
    return results


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate visual prompts")
    parser.add_argument("--input", "-i", default="output/classified/all_classified.json")
    parser.add_argument("--output", "-o", default="output/prompts/wan_2_2_prompts.json")
    parser.add_argument("--llm", action="store_true", help="Use Ollama LLM")
    parser.add_argument("--model", default="llama3", help="Ollama model name")
    parser.add_argument("--limit", type=int, default=None, help="Limit for testing")
    
    args = parser.parse_args()
    
    process_classified_file(
        input_file=args.input,
        output_file=args.output,
        use_llm=args.llm,
        ollama_model=args.model,
        limit=args.limit
    )
