"""
Phase II: The Semantic Classifier (The Brain)
Classify sentences into 3 safety categories using Zero-Shot or fine-tuned models.
"""

import json
import re
from pathlib import Path
from typing import Literal, Optional
from dataclasses import dataclass, asdict
from tqdm import tqdm


# Category definitions
CategoryType = Literal["PROHIBITED_ACTION", "HAZARD_WARNING", "OPERATIONAL_PROCEDURE"]

CATEGORY_LABELS = [
    "PROHIBITED_ACTION",
    "HAZARD_WARNING", 
    "OPERATIONAL_PROCEDURE"
]

# Keywords for rule-based pre-filtering
CATEGORY_KEYWORDS = {
    "PROHIBITED_ACTION": [
        r"\bnever\b", r"\bdo not\b", r"\bdon't\b", r"\bforbidden\b",
        r"\bprohibited\b", r"\bmust not\b", r"\bshall not\b",
        r"\bnot permitted\b", r"\bunder no circumstances\b"
    ],
    "HAZARD_WARNING": [
        r"\bdanger\b", r"\bwarning\b", r"\bcaution\b", r"\bhazard\b",
        r"\brisk\b", r"\binjury\b", r"\bdeath\b", r"\bserious\b",
        r"\bcrush\b", r"\belectric\b", r"\bfire\b", r"\bexplosion\b",
        r"\btip over\b", r"\brollover\b", r"\bstrike\b"
    ],
    "OPERATIONAL_PROCEDURE": [
        r"\bensure\b", r"\bverify\b", r"\bcheck\b", r"\binspect\b",
        r"\bstep\b", r"\bfirst\b", r"\bthen\b", r"\bbefore\b",
        r"\bafter\b", r"\bengage\b", r"\blower\b", r"\braise\b",
        r"\bstart\b", r"\bstop\b", r"\bactivate\b", r"\brelease\b"
    ]
}


@dataclass  
class ClassifiedSentence:
    """A classified safety sentence."""
    machine: str
    category: CategoryType
    original_text: str
    confidence: float
    source_file: str
    context: Optional[str] = None


class SafetyClassifier:
    """Zero-shot classifier for safety sentences."""
    
    def __init__(self, model_name: str = "facebook/bart-large-mnli"):
        """
        Initialize the classifier.
        
        Args:
            model_name: HuggingFace model for zero-shot classification
        """
        self.model_name = model_name
        self._classifier = None
    
    @property
    def classifier(self):
        """Lazy-load the classifier."""
        if self._classifier is None:
            from transformers import pipeline
            print(f"🧠 Loading classifier: {self.model_name}")
            self._classifier = pipeline(
                "zero-shot-classification",
                model=self.model_name,
                device=-1  # CPU
            )
        return self._classifier
    
    def classify_sentence(self, text: str) -> tuple[CategoryType, float]:
        """
        Classify a single sentence.
        
        Args:
            text: The sentence to classify
            
        Returns:
            Tuple of (category, confidence)
        """
        result = self.classifier(text, candidate_labels=CATEGORY_LABELS)
        return result["labels"][0], result["scores"][0]
    
    def classify_batch(
        self, 
        sentences: list[str],
        batch_size: int = 8
    ) -> list[tuple[CategoryType, float]]:
        """
        Classify a batch of sentences.
        
        Args:
            sentences: List of sentences
            batch_size: Processing batch size
            
        Returns:
            List of (category, confidence) tuples
        """
        results = []
        for i in tqdm(range(0, len(sentences), batch_size), desc="Classifying"):
            batch = sentences[i:i+batch_size]
            for sent in batch:
                try:
                    result = self.classify_sentence(sent)
                    results.append(result)
                except Exception as e:
                    print(f"⚠️ Error classifying: {sent[:50]}... - {e}")
                    results.append(("OPERATIONAL_PROCEDURE", 0.0))
        return results


class RuleBasedClassifier:
    """
    Advanced rule-based classifier using multi-factor sentiment analysis.
    
    Factors considered for confidence scoring:
    1. Keyword density (how many keywords matched)
    2. Severity level (CRITICAL > WARNING > CAUTION)
    3. Imperative strength (NEVER > DO NOT > AVOID)
    4. Consequence severity (death > serious injury > injury > damage)
    5. Specificity (specific machine parts mentioned)
    6. Urgency markers (immediately, always, must)
    """
    
    # Severity tiers for keywords (higher = more severe)
    SEVERITY_TIERS = {
        # CRITICAL TIER (weight: 1.0)
        "critical": [
            r"\bdeath\b", r"\bfatal\b", r"\bkill\b", r"\blethal\b",
            r"\bexplosion\b", r"\bexplode\b", r"\belectrocution\b",
            r"\bcrushed?\b", r"\bentrapment\b", r"\bsuffocation\b"
        ],
        # SEVERE TIER (weight: 0.85)
        "severe": [
            r"\bserious injury\b", r"\bsevere\b", r"\bpermanent\b",
            r"\bamputation\b", r"\bfracture\b", r"\bburn\b", r"\bfire\b",
            r"\brollover\b", r"\btip\s?over\b", r"\bcollapse\b"
        ],
        # MODERATE TIER (weight: 0.7)
        "moderate": [
            r"\binjury\b", r"\bharm\b", r"\bdamage\b", r"\bhazard\b",
            r"\bdanger\b", r"\brisk\b", r"\bcaution\b", r"\bwarning\b"
        ],
        # MINOR TIER (weight: 0.55)
        "minor": [
            r"\bcareful\b", r"\battention\b", r"\bnote\b", r"\bnotice\b"
        ]
    }
    
    SEVERITY_WEIGHTS = {
        "critical": 1.0,
        "severe": 0.85,
        "moderate": 0.7,
        "minor": 0.55
    }
    
    # Imperative strength markers
    IMPERATIVE_STRENGTH = {
        # ABSOLUTE (weight: 1.0)
        "absolute": [
            r"\bnever\b", r"\bunder no circumstances\b", r"\babsolutely\s+not\b",
            r"\bstrictly\s+prohibited\b", r"\bforbidden\b", r"\bprohibited\b"
        ],
        # STRONG (weight: 0.85)
        "strong": [
            r"\bdo not\b", r"\bdon't\b", r"\bmust not\b", r"\bshall not\b",
            r"\bnot permitted\b", r"\bnot allowed\b", r"\bcannot\b"
        ],
        # MODERATE (weight: 0.7)
        "moderate": [
            r"\bavoid\b", r"\bshould not\b", r"\bshouldn't\b",
            r"\bnot recommended\b", r"\brefrain\b"
        ],
        # WEAK (weight: 0.5)
        "weak": [
            r"\bbe careful\b", r"\buse caution\b", r"\bwatch\b"
        ]
    }
    
    IMPERATIVE_WEIGHTS = {
        "absolute": 1.0,
        "strong": 0.85,
        "moderate": 0.7,
        "weak": 0.5
    }
    
    # Urgency markers (additive bonus)
    URGENCY_PATTERNS = [
        (r"\bimmediately\b", 0.1),
        (r"\balways\b", 0.08),
        (r"\bmust\b", 0.08),
        (r"\brequired\b", 0.07),
        (r"\bensure\b", 0.05),
        (r"\bcritical\b", 0.1),
        (r"\bemergency\b", 0.1),
    ]
    
    # Machine-specific component mentions (increases specificity)
    COMPONENT_PATTERNS = [
        r"\bhydraulic\b", r"\bboom\b", r"\bbucket\b", r"\bblade\b",
        r"\bstabilizer\b", r"\boutrigger\b", r"\bcylinder\b", r"\bhose\b",
        r"\bPTO\b", r"\bROPS\b", r"\bFOPS\b", r"\btracks?\b", r"\btires?\b",
        r"\bengine\b", r"\bbrakes?\b", r"\bcab\b", r"\boperator\b"
    ]
    
    def calculate_keyword_density(self, text: str) -> dict:
        """Calculate keyword matches per category."""
        text_lower = text.lower()
        scores = {}
        
        for category, patterns in CATEGORY_KEYWORDS.items():
            matches = sum(1 for p in patterns if re.search(p, text_lower))
            density = matches / len(patterns) if patterns else 0
            scores[category] = {
                "matches": matches,
                "density": density,
                "patterns": len(patterns)
            }
        
        return scores
    
    def calculate_severity_score(self, text: str) -> float:
        """Determine severity level from consequence keywords."""
        text_lower = text.lower()
        
        for tier, patterns in self.SEVERITY_TIERS.items():
            if any(re.search(p, text_lower) for p in patterns):
                return self.SEVERITY_WEIGHTS[tier]
        
        return 0.4  # Default baseline
    
    def calculate_imperative_score(self, text: str) -> float:
        """Measure strength of imperative language."""
        text_lower = text.lower()
        
        for strength, patterns in self.IMPERATIVE_STRENGTH.items():
            if any(re.search(p, text_lower) for p in patterns):
                return self.IMPERATIVE_WEIGHTS[strength]
        
        return 0.3  # Default for non-imperative
    
    def calculate_urgency_bonus(self, text: str) -> float:
        """Calculate additive urgency bonus."""
        text_lower = text.lower()
        bonus = 0.0
        
        for pattern, weight in self.URGENCY_PATTERNS:
            if re.search(pattern, text_lower):
                bonus += weight
        
        return min(bonus, 0.2)  # Cap at 0.2
    
    def calculate_specificity_bonus(self, text: str) -> float:
        """Reward specific component mentions."""
        text_lower = text.lower()
        matches = sum(1 for p in self.COMPONENT_PATTERNS if re.search(p, text_lower))
        
        # 0.02 per component, max 0.1
        return min(matches * 0.02, 0.1)
    
    def classify_sentence(self, text: str) -> tuple[str, float]:
        """
        Classify using advanced multi-factor sentiment analysis.
        
        Final confidence = weighted_average(
            keyword_density,
            severity_score,
            imperative_score
        ) + urgency_bonus + specificity_bonus
        
        Returns:
            Tuple of (category, confidence)
        """
        text_lower = text.lower()
        
        # Factor 1: Keyword density per category
        keyword_scores = self.calculate_keyword_density(text)
        
        # Factor 2: Severity level
        severity = self.calculate_severity_score(text)
        
        # Factor 3: Imperative strength
        imperative = self.calculate_imperative_score(text)
        
        # Factor 4: Urgency bonus
        urgency = self.calculate_urgency_bonus(text)
        
        # Factor 5: Specificity bonus
        specificity = self.calculate_specificity_bonus(text)
        
        # Determine category (priority: PROHIBITED > HAZARD > OPERATIONAL)
        prohibited_density = keyword_scores["PROHIBITED_ACTION"]["density"]
        hazard_density = keyword_scores["HAZARD_WARNING"]["density"]
        operational_density = keyword_scores["OPERATIONAL_PROCEDURE"]["density"]
        
        # Category selection with weighted scoring
        if prohibited_density > 0:
            category = "PROHIBITED_ACTION"
            base_density = prohibited_density
        elif hazard_density > 0:
            category = "HAZARD_WARNING"
            base_density = hazard_density
        elif operational_density > 0:
            category = "OPERATIONAL_PROCEDURE"
            base_density = operational_density
        else:
            # Default fallback
            return "OPERATIONAL_PROCEDURE", 0.5
        
        # Calculate weighted confidence
        # Weights: density=0.25, severity=0.35, imperative=0.25, bonuses=0.15
        weighted_confidence = (
            (base_density * 0.25) +
            (severity * 0.35) +
            (imperative * 0.25) +
            (urgency * 0.5) +  # Urgency scaled
            (specificity * 0.5)  # Specificity scaled
        )
        
        # Normalize to 0.5-0.98 range
        confidence = 0.5 + (weighted_confidence * 0.48)
        
        # Category-specific adjustments
        if category == "PROHIBITED_ACTION":
            confidence = min(confidence + 0.05, 0.98)  # Boost prohibited
        elif category == "HAZARD_WARNING":
            confidence = min(confidence + 0.02, 0.95)
        else:
            confidence = min(confidence, 0.90)  # Cap operational
        
        return category, round(confidence, 4)



def detect_machine_from_path(file_path: str) -> str:
    """
    Detect machine type from file path.
    
    Args:
        file_path: Path to the markdown file
        
    Returns:
        Machine type string
    """
    path_lower = Path(file_path).stem.lower()
    
    if "excavator" in path_lower:
        return "excavator"
    elif "bulldozer" in path_lower or "bull_dozer" in path_lower:
        return "bulldozer"
    elif "backhoe" in path_lower:
        return "backhoe_loader"
    elif "dump_truck" in path_lower:
        return "dump_truck"
    else:
        return "general"


def extract_and_classify(
    markdown_path: str,
    classifier: Optional[SafetyClassifier] = None,
    use_rules_only: bool = True,
    min_length: int = 30,
    max_length: int = 500
) -> list[ClassifiedSentence]:
    """
    Extract and classify safety sentences from a Markdown file.
    
    Args:
        markdown_path: Path to the Markdown file
        classifier: SafetyClassifier instance (optional)
        use_rules_only: Use fast rule-based classification
        min_length: Minimum sentence length
        max_length: Maximum sentence length
        
    Returns:
        List of ClassifiedSentence objects
    """
    with open(markdown_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    machine = detect_machine_from_path(markdown_path)
    
    # Use rule-based classifier for speed
    if use_rules_only or classifier is None:
        clf = RuleBasedClassifier()
    else:
        clf = classifier
    
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', content)
    
    # Track current section
    current_section = "Unknown"
    results = []
    
    for sentence in sentences:
        # Check for headers
        header_match = re.match(r'^#+\s*(.+)$', sentence.strip(), re.MULTILINE)
        if header_match:
            current_section = header_match.group(1).strip()
            continue
        
        # Clean sentence
        clean = re.sub(r'\s+', ' ', sentence).strip()
        clean = re.sub(r'\*+', '', clean)  # Remove markdown formatting
        clean = re.sub(r'\[.*?\]\(.*?\)', '', clean)  # Remove links
        
        # Length filter
        if len(clean) < min_length or len(clean) > max_length:
            continue
            
        # Skip non-safety content
        if not any(
            re.search(pattern, clean.lower())
            for patterns in CATEGORY_KEYWORDS.values()
            for pattern in patterns
        ):
            continue
        
        # Classify
        category, confidence = clf.classify_sentence(clean)
        
        results.append(ClassifiedSentence(
            machine=machine,
            category=category,
            original_text=clean,
            confidence=confidence,
            source_file=Path(markdown_path).name,
            context=current_section
        ))
    
    return results


def process_all_markdowns(
    input_dir: str = "output/markdown",
    output_file: str = "output/classified/all_classified.json",
    use_rules_only: bool = True
) -> list[dict]:
    """
    Process all Markdown files and create classified dataset.
    
    Args:
        input_dir: Directory with Markdown files
        output_file: Output JSON file path
        use_rules_only: Use rule-based classification (faster)
        
    Returns:
        List of classified sentence dicts
    """
    input_dir = Path(input_dir)
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    md_files = list(input_dir.glob("*.md"))
    print(f"📁 Found {len(md_files)} Markdown files")
    
    all_results = []
    
    for md_file in tqdm(md_files, desc="Processing files"):
        results = extract_and_classify(str(md_file), use_rules_only=use_rules_only)
        all_results.extend(results)
        print(f"   {md_file.name}: {len(results)} sentences")
    
    # Convert to dicts for JSON
    output_data = [asdict(r) for r in all_results]
    
    # Save to JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Saved {len(output_data)} classified sentences to {output_path}")
    
    # Print summary
    from collections import Counter
    categories = Counter(r["category"] for r in output_data)
    machines = Counter(r["machine"] for r in output_data)
    
    print("\n📊 Category Distribution:")
    for cat, count in categories.most_common():
        print(f"   {cat}: {count}")
    
    print("\n🚜 Machine Distribution:")
    for machine, count in machines.most_common():
        print(f"   {machine}: {count}")
    
    return output_data


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Classify safety sentences")
    parser.add_argument("--input", "-i", default="output/markdown", help="Input directory")
    parser.add_argument("--output", "-o", default="output/classified/all_classified.json", help="Output JSON file")
    parser.add_argument("--ml", action="store_true", help="Use ML classifier (slower, more accurate)")
    
    args = parser.parse_args()
    
    process_all_markdowns(
        input_dir=args.input,
        output_file=args.output,
        use_rules_only=not args.ml
    )
