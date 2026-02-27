#!/usr/bin/env python3
"""
SWAG IRONCLAD v4.0
Safe Walk Augmented Generation - Safety-Hardened Edition

Fixes from ISO-12100 Audit:
1. Silero VAD - Noise gating (construction noise rejection)
2. Confidence Cliff - No answer if manual doesn't contain info
3. Glossary Guard - Technical term translation protection
4. Black Box Recorder - Full audit trail in SQLite

Requirements:
    pip install -r swag_ironclad_requirements.txt
"""

import json
import os
import sys
import wave
import threading
import sqlite3
import hashlib
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Tuple
import io

# Audio
import pyaudio
import numpy as np

# Keyboard
from pynput import keyboard

# Rich UI
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.live import Live
from rich.text import Text
from rich.markdown import Markdown
from rich.prompt import Prompt
from rich.theme import Theme

# Whisper STT
from faster_whisper import WhisperModel

# Translation
import ctranslate2
import sentencepiece as spm
from huggingface_hub import snapshot_download

# Fuzzy matching for glossary
from rapidfuzz import fuzz, process

# LangChain
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.memory import ConversationBufferMemory

# VAD
import torch

# ============================================================================
# HARDCODED PATHS
# ============================================================================
SWAG_MATRIX_PATH = "/Users/pc/polderr/output/classified/all_classified.json"
SWAG_ARCHIVES_PATH = "/Users/pc/polderr/output/markdown"
SWAG_BRAIN_PATH = "./swag_db"
SWAG_MODELS_PATH = "./swag_models"
SWAG_CONFIG_PATH = "./swag_config.json"
SWAG_AUDIT_DB_PATH = "./swag_audit.db"
SWAG_GLOSSARY_PATH = "./swag_glossary.json"
TEMP_AUDIO_PATH = "swag_temp.wav"
AZERION_MODEL = "gpt-oss-20b"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
WHISPER_MODEL = "large-v3"
NLLB_MODEL = "facebook/nllb-200-distilled-600M"

# Safety Thresholds
VAD_THRESHOLD = 0.6  # Minimum speech probability
CONFIDENCE_THRESHOLD = 0.4  # Minimum similarity score (lower = more similar for cosine)
GLOSSARY_FUZZY_THRESHOLD = 80  # RapidFuzz similarity threshold

# Audio settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

# ============================================================================
# SUPPORTED LANGUAGES
# ============================================================================
SUPPORTED_LANGUAGES: Dict[str, Dict] = {
    "eng_Latn": {"name": "English", "flag": "🇬🇧", "native": "English"},
    "nld_Latn": {"name": "Dutch", "flag": "🇳🇱", "native": "Nederlands"},
    "fra_Latn": {"name": "French", "flag": "🇫🇷", "native": "Français"},
    "deu_Latn": {"name": "German", "flag": "🇩🇪", "native": "Deutsch"},
    "pol_Latn": {"name": "Polish", "flag": "🇵🇱", "native": "Polski"},
    "ukr_Cyrl": {"name": "Ukrainian", "flag": "🇺🇦", "native": "Українська"},
    "tur_Latn": {"name": "Turkish", "flag": "🇹🇷", "native": "Türkçe"},
    "ron_Latn": {"name": "Romanian", "flag": "🇷🇴", "native": "Română"},
    "bul_Cyrl": {"name": "Bulgarian", "flag": "🇧🇬", "native": "Български"},
    "por_Latn": {"name": "Portuguese", "flag": "🇵🇹", "native": "Português"},
    "hin_Deva": {"name": "Hindi", "flag": "🇮🇳", "native": "हिन्दी"},
    "spa_Latn": {"name": "Spanish", "flag": "🇨🇴", "native": "Español"},
    "ary_Arab": {"name": "Arabic (Maghreb)", "flag": "🇲🇦", "native": "العربية"},
}

WHISPER_TO_NLLB = {
    "en": "eng_Latn", "nl": "nld_Latn", "fr": "fra_Latn", "de": "deu_Latn",
    "pl": "pol_Latn", "uk": "ukr_Cyrl", "tr": "tur_Latn", "ro": "ron_Latn",
    "bg": "bul_Cyrl", "pt": "por_Latn", "hi": "hin_Deva", "es": "spa_Latn",
    "ar": "ary_Arab",
}

# ============================================================================
# DEFAULT GLOSSARY (Created if not exists)
# ============================================================================
DEFAULT_GLOSSARY = {
    "boom": {
        "eng_Latn": "boom",
        "fra_Latn": "flèche",
        "pol_Latn": "wysięgnik",
        "deu_Latn": "Ausleger",
        "spa_Latn": "pluma"
    },
    "hydraulic": {
        "eng_Latn": "hydraulic",
        "fra_Latn": "hydraulique",
        "pol_Latn": "hydrauliczny",
        "deu_Latn": "hydraulisch",
        "spa_Latn": "hidráulico"
    },
    "rops": {
        "eng_Latn": "ROPS (Rollover Protective Structure)",
        "fra_Latn": "ROPS (Structure de Protection au Retournement)",
        "pol_Latn": "ROPS (Konstrukcja Ochronna przy Przewróceniu)",
        "deu_Latn": "ROPS (Überrollschutzstruktur)",
        "spa_Latn": "ROPS (Estructura de Protección contra Vuelcos)"
    },
    "outrigger": {
        "eng_Latn": "outrigger",
        "fra_Latn": "stabilisateur",
        "pol_Latn": "podpory boczne",
        "deu_Latn": "Abstützung",
        "spa_Latn": "estabilizador"
    },
    "pto": {
        "eng_Latn": "PTO (Power Take-Off)",
        "fra_Latn": "PDF (Prise de Force)",
        "pol_Latn": "WOM (Wał Odbioru Mocy)",
        "deu_Latn": "Zapfwelle",
        "spa_Latn": "TDF (Toma de Fuerza)"
    }
}

# ============================================================================
# SWAG THEME
# ============================================================================
swag_theme = Theme({
    "swag.header": "bold #0057B8",
    "swag.warning": "bold #FF6700",
    "swag.danger": "bold red",
    "swag.success": "bold green",
    "swag.info": "#A0AAB5",
    "swag.recording": "bold red",
    "swag.lang": "bold cyan",
    "swag.shield": "bold #00FF00",
    "swag.noise": "dim yellow",
})

console = Console(theme=swag_theme)

# ============================================================================
# GLOBAL STATE
# ============================================================================
recording = False
audio_frames: List[bytes] = []
audio_stream = None
audio_instance = None
current_language = "eng_Latn"
whisper_model: Optional[WhisperModel] = None
translator = None
tokenizer = None
vectorstore = None
vad_model = None
glossary: Dict = {}
llm = None
db_conn = None


def print_banner():
    """Display the SWAG Ironclad startup banner."""
    banner = """
+==============================================================================+
|                                                                              |
|     ███████╗██╗    ██╗ █████╗  ██████╗                                       |
|     ██╔════╝██║    ██║██╔══██╗██╔════╝                                       |
|     ███████╗██║ █╗ ██║███████║██║  ███╗                                      |
|     ╚════██║██║███╗██║██╔══██║██║   ██║                                      |
|     ███████║╚███╔███╔╝██║  ██║╚██████╔╝                                      |
|     ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝                                       |
|                                                                              |
|     SWAG IRONCLAD v4.0 - SAFETY-HARDENED EDITION                             |
|     ───────────────────────────────────────────────                          |
|     🛡️  SAFETY SHIELD: ACTIVE                                                |
|     VAD Noise Gate | Confidence Cliff | Audit Logger                         |
|                                                                              |
+==============================================================================+
    """
    console.print(banner, style="swag.header")


# ============================================================================
# AUDIT DATABASE (Black Box Recorder)
# ============================================================================
def init_audit_db():
    """Initialize SQLite audit database."""
    global db_conn
    
    db_conn = sqlite3.connect(SWAG_AUDIT_DB_PATH, check_same_thread=False)
    cursor = db_conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incident_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            user_id TEXT DEFAULT 'operator',
            detected_language TEXT,
            raw_query TEXT,
            english_query TEXT,
            ai_response TEXT,
            safety_score REAL,
            audio_hash TEXT,
            confidence_check TEXT,
            vad_passed INTEGER,
            glossary_terms_used TEXT
        )
    """)
    db_conn.commit()
    console.print("[swag.success][OK] Audit database initialized[/]")


def log_incident(
    detected_language: str,
    raw_query: str,
    english_query: str,
    ai_response: str,
    safety_score: float,
    audio_hash: str = None,
    confidence_check: str = "PASSED",
    vad_passed: bool = True,
    glossary_terms: List[str] = None
):
    """Log incident to audit database."""
    global db_conn
    
    if db_conn is None:
        return
    
    cursor = db_conn.cursor()
    cursor.execute("""
        INSERT INTO incident_log 
        (timestamp, detected_language, raw_query, english_query, ai_response, 
         safety_score, audio_hash, confidence_check, vad_passed, glossary_terms_used)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().isoformat(),
        detected_language,
        raw_query,
        english_query,
        ai_response,
        safety_score,
        audio_hash,
        confidence_check,
        1 if vad_passed else 0,
        json.dumps(glossary_terms or [])
    ))
    db_conn.commit()


# ============================================================================
# GLOSSARY GUARD
# ============================================================================
def load_glossary():
    """Load or create glossary."""
    global glossary
    
    if Path(SWAG_GLOSSARY_PATH).exists():
        with open(SWAG_GLOSSARY_PATH, "r", encoding="utf-8") as f:
            glossary = json.load(f)
    else:
        glossary = DEFAULT_GLOSSARY
        with open(SWAG_GLOSSARY_PATH, "w", encoding="utf-8") as f:
            json.dump(glossary, f, indent=2, ensure_ascii=False)
        console.print("[swag.info][SYS] Created default glossary with 5 terms[/]")
    
    console.print(f"[swag.success][OK] Glossary loaded: {len(glossary)} terms[/]")


def find_glossary_terms(text: str) -> List[Tuple[str, str]]:
    """Find glossary terms in text using fuzzy matching."""
    found_terms = []
    words = text.lower().split()
    
    for word in words:
        for term in glossary.keys():
            score = fuzz.ratio(word, term.lower())
            if score >= GLOSSARY_FUZZY_THRESHOLD:
                found_terms.append((term, word))
    
    return found_terms


def get_glossary_context(terms: List[Tuple[str, str]], target_lang: str) -> str:
    """Generate glossary context for translation."""
    if not terms:
        return ""
    
    context_parts = []
    for term, _ in terms:
        if term in glossary and target_lang in glossary[term]:
            eng_term = glossary[term].get("eng_Latn", term)
            target_term = glossary[term].get(target_lang, term)
            context_parts.append(f"{eng_term} = {target_term}")
    
    if context_parts:
        return f"Technical terms: {'; '.join(context_parts)}. "
    return ""


# ============================================================================
# SILERO VAD (Noise Gate)
# ============================================================================
def load_vad():
    """Load Silero VAD model."""
    global vad_model
    
    console.print("[swag.info][SYS] Loading Silero VAD...[/]")
    vad_model, utils = torch.hub.load(
        repo_or_dir='snakers4/silero-vad',
        model='silero_vad',
        force_reload=False,
        onnx=True
    )
    console.print("[swag.success][OK] Silero VAD loaded (Noise Gate Active)[/]")


def check_vad(audio_bytes: bytes) -> Tuple[bool, float]:
    """Check if audio contains speech using Silero VAD."""
    global vad_model
    
    if vad_model is None:
        return True, 1.0  # Bypass if VAD not loaded
    
    try:
        # Convert bytes to numpy array
        audio_np = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        
        # Silero expects 16kHz
        audio_tensor = torch.from_numpy(audio_np)
        
        # Get speech probability
        speech_prob = vad_model(audio_tensor, RATE).item()
        
        return speech_prob >= VAD_THRESHOLD, speech_prob
        
    except Exception as e:
        console.print(f"[swag.warning][VAD] Error: {e}[/]")
        return True, 1.0  # Bypass on error


# ============================================================================
# CONFIG
# ============================================================================
def load_config() -> dict:
    """Load or create user config."""
    if Path(SWAG_CONFIG_PATH).exists():
        with open(SWAG_CONFIG_PATH, "r") as f:
            return json.load(f)
    return {"preferred_language": "eng_Latn"}


def save_config(config: dict):
    """Save user config."""
    with open(SWAG_CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)


# ============================================================================
# TRANSLATION (NLLB-200)
# ============================================================================
def download_nllb_model():
    """Download and convert NLLB model."""
    model_path = Path(SWAG_MODELS_PATH) / "nllb-200-ct2"
    
    if model_path.exists():
        return str(model_path)
    
    console.print("[swag.info][SYS] Downloading NLLB-200 translation model...[/]")
    
    hf_model_path = snapshot_download(
        repo_id="facebook/nllb-200-distilled-600M",
        local_dir=str(Path(SWAG_MODELS_PATH) / "nllb-200-hf")
    )
    
    console.print("[swag.info][SYS] Converting model for ctranslate2...[/]")
    os.system(f"ct2-transformers-converter --model {hf_model_path} --output_dir {model_path} --quantization int8")
    
    return str(model_path)


def load_translator():
    """Load NLLB translator."""
    global translator, tokenizer
    
    model_path = download_nllb_model()
    
    console.print(f"[swag.info][SYS] Loading NLLB-200 translator...[/]")
    translator = ctranslate2.Translator(model_path, device="cpu", compute_type="int8")
    
    tokenizer_path = Path(SWAG_MODELS_PATH) / "nllb-200-hf" / "sentencepiece.bpe.model"
    if tokenizer_path.exists():
        tokenizer = spm.SentencePieceProcessor(str(tokenizer_path))
    else:
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained(NLLB_MODEL)
    
    console.print("[swag.success][OK] NLLB-200 translator loaded[/]")


def translate_text(text: str, source_lang: str, target_lang: str, glossary_context: str = "") -> str:
    """Translate text using NLLB-200 with glossary context."""
    global translator, tokenizer
    
    if source_lang == target_lang:
        return text
    
    if translator is None:
        return text
    
    try:
        # Prepend glossary context if available
        text_with_context = glossary_context + text if glossary_context else text
        
        if hasattr(tokenizer, 'encode'):
            tokens = tokenizer.encode(text_with_context, out_type=str)
        else:
            tokens = tokenizer.tokenize(text_with_context)
        
        source_prefix = [source_lang]
        target_prefix = [[target_lang]]
        
        results = translator.translate_batch(
            [source_prefix + tokens],
            target_prefix=target_prefix,
            beam_size=4,
            max_decoding_length=256,
        )
        
        output_tokens = results[0].hypotheses[0]
        
        if hasattr(tokenizer, 'decode'):
            translated = tokenizer.decode(output_tokens)
        else:
            translated = tokenizer.convert_tokens_to_string(output_tokens)
        
        return translated.strip()
        
    except Exception as e:
        console.print(f"[swag.warning][WARN] Translation failed: {e}[/]")
        return text


# ============================================================================
# VECTOR STORE & RAG
# ============================================================================
def load_swag_matrix() -> List[Document]:
    """Load SWAG Matrix."""
    documents = []
    
    if not Path(SWAG_MATRIX_PATH).exists():
        return documents
    
    with open(SWAG_MATRIX_PATH, "r", encoding="utf-8") as f:
        matrix_data = json.load(f)
    
    for entry in matrix_data:
        machine = entry.get("machine", "UNKNOWN")
        category = entry.get("category", "UNCLASSIFIED")
        original_text = entry.get("original_text", "")
        
        page_content = f"MACHINE: {machine}\nLABEL: {category}\nRULE: {original_text}"
        
        doc = Document(
            page_content=page_content,
            metadata={"source": "SWAG_MATRIX", "type": "critical", "label": category, "machine": machine}
        )
        documents.append(doc)
    
    return documents


def load_swag_archives() -> List[Document]:
    """Load SWAG Archives."""
    documents = []
    archives_path = Path(SWAG_ARCHIVES_PATH)
    
    if not archives_path.exists():
        return documents
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    
    for md_file in archives_path.glob("*.md"):
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            for chunk in splitter.split_text(content):
                doc = Document(page_content=chunk, metadata={"source": md_file.name, "type": "manual"})
                documents.append(doc)
        except:
            pass
    
    return documents


def similarity_search_with_confidence(query: str, k: int = 3) -> Tuple[List[Document], float, bool]:
    """
    Search with confidence scoring.
    Returns: (documents, best_score, passed_threshold)
    """
    global vectorstore
    
    if vectorstore is None:
        return [], 0.0, False
    
    results = vectorstore.similarity_search_with_score(query, k=k)
    
    if not results:
        return [], 0.0, False
    
    # ChromaDB returns (doc, distance) where lower distance = more similar
    docs = [r[0] for r in results]
    scores = [r[1] for r in results]
    best_score = min(scores)  # Lower is better for distance
    
    # Convert distance to similarity (0-1 scale, higher = better)
    # For L2 distance, we can use: similarity = 1 / (1 + distance)
    similarity = 1 / (1 + best_score)
    
    passed = similarity >= CONFIDENCE_THRESHOLD
    
    return docs, similarity, passed


# ============================================================================
# AUDIO UTILITIES
# ============================================================================
def save_audio(frames: List[bytes], filename: str) -> str:
    """Save audio and return hash."""
    wf = wave.open(filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(2)
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    
    # Generate hash for audit
    audio_hash = hashlib.sha256(b''.join(frames)).hexdigest()[:16]
    return audio_hash


# ============================================================================
# BOOT SEQUENCE
# ============================================================================
def boot_swag():
    """Initialize all SWAG Ironclad systems."""
    global whisper_model, vectorstore, llm_client, current_language
    
    print_banner()
    
    # Load config
    config = load_config()
    current_language = config.get("preferred_language", "eng_Latn")
    lang_info = SUPPORTED_LANGUAGES.get(current_language, SUPPORTED_LANGUAGES["eng_Latn"])
    console.print(f"[swag.lang]Active Language: {lang_info['flag']} {lang_info['native']}[/]\n")
    
    console.print("[swag.info][SYS] Booting SWAG Ironclad Systems...[/]\n")
    
    # Initialize audit database
    init_audit_db()
    
    # Load glossary
    load_glossary()
    
    # Load VAD
    load_vad()
    
    # Load embeddings and vector store
    console.print("[swag.info][SYS] Loading embedding model...[/]")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL, model_kwargs={"device": "cpu"})
    
    db_path = Path(SWAG_BRAIN_PATH)
    if db_path.exists() and any(db_path.iterdir()):
        vectorstore = Chroma(persist_directory=SWAG_BRAIN_PATH, embedding_function=embeddings)
        console.print(f"[swag.success][OK] SWAG Brain: {vectorstore._collection.count()} vectors[/]")
    else:
        console.print("[swag.info][SYS] Building SWAG Brain...[/]")
        all_docs = load_swag_matrix() + load_swag_archives()
        if all_docs:
            vectorstore = Chroma.from_documents(all_docs, embeddings, persist_directory=SWAG_BRAIN_PATH)
            console.print(f"[swag.success][OK] SWAG Brain indexed: {len(all_docs)} vectors[/]")
    
    # Load Whisper
    console.print(f"[swag.info][SYS] Loading Whisper {WHISPER_MODEL}...[/]")
    whisper_model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
    console.print("[swag.success][OK] Whisper STT loaded[/]")
    
    # Load translator
    load_translator()
    
    # Load OpenAI API Client
    console.print(f"[swag.info][SYS] Connecting to Azerion AI ({AZERION_MODEL})...[/]")
    try:
        from openai import OpenAI
        import os
        llm_client = OpenAI(
            api_key=os.environ.get("AZERION_VEO3"),
            base_url="https://api.azerion.ai/v1"
        )
        console.print("[swag.success][OK] Azerion API loaded[/]")
    except Exception as e:
        console.print(f"[swag.danger][ERR] Azerion API failed: {e}[/]")
        return False
    
    return True


# ============================================================================
# PROCESSING LOGIC
# ============================================================================
def process_query(query: str, detected_lang: str, audio_hash: str = None) -> str:
    """Process query through the safety pipeline."""
    global current_language, llm_client
    
    glossary_terms = []
    
    # Step 1: Translate to English if needed
    if detected_lang != "eng_Latn":
        console.print(f"[swag.info][TRANSLATE] {SUPPORTED_LANGUAGES.get(detected_lang, {}).get('flag', '')} -> 🇬🇧[/]")
        english_query = translate_text(query, detected_lang, "eng_Latn")
    else:
        english_query = query
    
    # Step 2: Find glossary terms
    found_terms = find_glossary_terms(english_query)
    glossary_terms = [t[0] for t in found_terms]
    
    # Step 3: Refine query
    console.print("[swag.info][REFINE] Cleaning technical terms...[/]")
    refine_prompt = f"Fix technical terms for heavy machinery. Output ONLY cleaned text.\nInput: {english_query}\nCleaned:"
    
    refine_response = llm_client.chat.completions.create(
        model=AZERION_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that refines technical queries."},
            {"role": "user", "content": refine_prompt}
        ],
        max_tokens=100,
        temperature=0.1,
        stream=False
    )
    refined = refine_response.choices[0].message.content.strip()
    
    if len(refined) > len(english_query) * 2:
        refined = english_query
    
    # Step 4: CONFIDENCE CLIFF - Search with threshold
    console.print("[swag.info][SEARCH] Querying SWAG Brain...[/]")
    docs, confidence, passed = similarity_search_with_confidence(refined, k=5)
    
    if not passed:
        # SAFETY LOCK - Do NOT proceed to LLM
        safety_response = """🛑 **SAFETY LOCK ACTIVATED**

No matching procedure found in the safety manuals.

**WARNING:** The AI cannot provide guidance on this topic.

**REQUIRED ACTION:** Consult the physical documentation or contact your safety supervisor.

*This interaction has been logged for audit purposes.*"""
        
        log_incident(
            detected_language=detected_lang,
            raw_query=query,
            english_query=refined,
            ai_response="SAFETY_LOCK_ACTIVATED",
            safety_score=confidence,
            audio_hash=audio_hash,
            confidence_check="FAILED",
            glossary_terms=glossary_terms
        )
        
        return safety_response
    
    # Step 5: Generate answer (confidence passed)
    console.print(f"[swag.success][CONFIDENCE] Score: {confidence:.2f} (Threshold: {CONFIDENCE_THRESHOLD})[/]")
    
    context = "\n\n".join([d.page_content for d in docs])
    
    answer_response = llm_client.chat.completions.create(
        model=AZERION_MODEL,
        messages=[
            {"role": "system", "content": "You are a heavy machinery safety expert. Answer ONLY using the provided context."},
            {"role": "user", "content": f"If the context doesn't contain the answer, say 'Information not found in manuals.'\n\nContext:\n{context}\n\nQuestion: {refined}\n\nSafety Answer:"}
        ],
        max_tokens=1024,
        temperature=0.1,
        stream=False
    )
    english_answer = answer_response.choices[0].message.content.strip()
    
    # Step 6: Translate response to user's language
    if current_language != "eng_Latn":
        console.print(f"[swag.info][TRANSLATE] 🇬🇧 -> {SUPPORTED_LANGUAGES.get(current_language, {}).get('flag', '')}[/]")
        glossary_context = get_glossary_context(found_terms, current_language)
        final_answer = translate_text(english_answer, "eng_Latn", current_language, glossary_context)
    else:
        final_answer = english_answer
    
    # Log to audit database
    log_incident(
        detected_language=detected_lang,
        raw_query=query,
        english_query=refined,
        ai_response=final_answer[:500],
        safety_score=confidence,
        audio_hash=audio_hash,
        confidence_check="PASSED",
        glossary_terms=glossary_terms
    )
    
    return final_answer


def process_voice_query():
    """Process voice query with VAD gating."""
    global audio_frames, current_language
    
    if not audio_frames:
        return
    
    audio_bytes = b''.join(audio_frames)
    
    # Step 1: VAD Check (Silero Gate)
    console.print("[swag.info][VAD] Checking for speech...[/]")
    is_speech, speech_prob = check_vad(audio_bytes)
    
    if not is_speech:
        console.print(f"[swag.noise][NOISE IGNORED] Speech probability: {speech_prob:.2f} (Threshold: {VAD_THRESHOLD})[/]")
        audio_frames = []
        return
    
    console.print(f"[swag.success][VAD] Speech detected: {speech_prob:.2f}[/]")
    
    # Save audio and get hash
    audio_hash = save_audio(audio_frames, TEMP_AUDIO_PATH)
    audio_frames = []
    
    try:
        # Step 2: Transcribe
        console.print("[swag.info][TRANSCRIBE] Processing audio...[/]")
        segments, info = whisper_model.transcribe(TEMP_AUDIO_PATH, beam_size=5)
        raw_text = " ".join([s.text for s in segments]).strip()
        detected_lang = WHISPER_TO_NLLB.get(info.language, "eng_Latn")
        
        console.print(f"[swag.info]Detected: {SUPPORTED_LANGUAGES.get(detected_lang, {}).get('flag', '')} \"{raw_text[:60]}...\"[/]")
        
        if not raw_text:
            return
        
        # Process through safety pipeline
        answer = process_query(raw_text, detected_lang, audio_hash)
        
        # Display result
        display_answer(answer)
        
    except Exception as e:
        console.print(f"[swag.danger][ERR] {e}[/]")
    finally:
        if Path(TEMP_AUDIO_PATH).exists():
            os.remove(TEMP_AUDIO_PATH)


def process_text_query(text: str):
    """Process text query."""
    global current_language
    
    answer = process_query(text, current_language)
    display_answer(answer)


def display_answer(answer: str):
    """Display answer with appropriate styling."""
    is_safety_lock = "SAFETY LOCK" in answer.upper()
    is_critical = any(term in answer.upper() for term in ["NEVER", "DANGER", "PROHIBITED", "FATAL"])
    
    if is_safety_lock:
        style = "red"
        title = "🛑 SAFETY LOCK"
    elif is_critical:
        style = "#FF6700"
        title = "⚠️ SWAG INTELLIGENCE"
    else:
        style = "#0057B8"
        title = "🛡️ SWAG INTELLIGENCE"
    
    console.print()
    console.print(Panel(
        Markdown(answer),
        title=f"[bold]{title}[/bold]",
        border_style=style,
        padding=(1, 2)
    ))
    console.print()


# ============================================================================
# LANGUAGE MENU
# ============================================================================
def show_language_menu():
    """Display language selection menu."""
    global current_language
    
    console.clear()
    
    table = Table(title="🌐 LANGUAGE SELECTION", border_style="cyan")
    table.add_column("#", style="bold")
    table.add_column("Flag", justify="center")
    table.add_column("Language")
    table.add_column("Native")
    
    lang_list = list(SUPPORTED_LANGUAGES.items())
    for i, (code, info) in enumerate(lang_list, 1):
        marker = " ✓" if code == current_language else ""
        table.add_row(str(i), info["flag"], info["name"] + marker, info["native"])
    
    console.print(table)
    console.print()
    
    choice = Prompt.ask("Enter number to select language", default="1")
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(lang_list):
            new_lang = lang_list[idx][0]
            current_language = new_lang
            save_config({"preferred_language": new_lang})
            
            lang_info = SUPPORTED_LANGUAGES[new_lang]
            console.print(f"\n[swag.success][OK] Language: {lang_info['flag']} {lang_info['native']}[/]\n")
    except:
        pass
    
    console.clear()
    print_banner()
    lang_info = SUPPORTED_LANGUAGES.get(current_language, SUPPORTED_LANGUAGES["eng_Latn"])
    console.print(f"[swag.lang]Active Language: {lang_info['flag']} {lang_info['native']}[/]\n")


# ============================================================================
# MAIN LOOP
# ============================================================================
def run_swag_ironclad():
    """Main SWAG Ironclad loop."""
    global recording, audio_frames, audio_stream, audio_instance
    
    if not boot_swag():
        sys.exit(1)
    
    audio_instance = pyaudio.PyAudio()
    
    console.print("\n" + "=" * 80)
    console.print("[swag.shield][ONLINE] SWAG IRONCLAD v4.0 :: SAFETY SHIELD ACTIVE[/]")
    console.print("[swag.info]Hold [SPACEBAR] to speak, type ':lang' for menu, ':audit' for logs, ':quit' to exit[/]")
    console.print("=" * 80 + "\n")
    
    def on_press(key):
        global recording, audio_frames, audio_stream
        
        if key == keyboard.Key.space and not recording:
            recording = True
            audio_frames = []
            console.print("[swag.recording][RECORDING] Speak now... (Release SPACE to finish)[/]")
            
            try:
                audio_stream = audio_instance.open(
                    format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK
                )
                
                def record():
                    while recording:
                        try:
                            data = audio_stream.read(CHUNK, exception_on_overflow=False)
                            audio_frames.append(data)
                        except:
                            break
                
                threading.Thread(target=record, daemon=True).start()
            except Exception as e:
                console.print(f"[swag.danger][ERR] Audio: {e}[/]")
                recording = False
    
    def on_release(key):
        global recording, audio_stream
        
        if key == keyboard.Key.space and recording:
            recording = False
            if audio_stream:
                try:
                    audio_stream.stop_stream()
                    audio_stream.close()
                except:
                    pass
            
            process_voice_query()
        
        if key == keyboard.Key.esc:
            return False
    
    listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    listener.start()
    
    try:
        while listener.is_alive():
            try:
                user_input = console.input("[swag.shield][SWAG] > [/]").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() in [":quit", ":exit", ":q"]:
                    break
                
                if user_input.lower() == ":lang":
                    show_language_menu()
                    continue
                
                if user_input.lower() == ":audit":
                    show_audit_log()
                    continue
                
                process_text_query(user_input)
                
            except KeyboardInterrupt:
                break
            except EOFError:
                break
    finally:
        listener.stop()
        if audio_instance:
            audio_instance.terminate()
        if db_conn:
            db_conn.close()
        console.print("\n[swag.info][SYS] SWAG Ironclad shutdown complete. All incidents logged.[/]\n")


def show_audit_log():
    """Display recent audit log entries."""
    global db_conn
    
    if db_conn is None:
        console.print("[swag.warning]Audit database not available[/]")
        return
    
    cursor = db_conn.cursor()
    cursor.execute("SELECT timestamp, detected_language, raw_query, confidence_check, safety_score FROM incident_log ORDER BY id DESC LIMIT 10")
    rows = cursor.fetchall()
    
    table = Table(title="📋 AUDIT LOG (Last 10)", border_style="blue")
    table.add_column("Time", style="dim")
    table.add_column("Lang")
    table.add_column("Query")
    table.add_column("Status")
    table.add_column("Score")
    
    for row in rows:
        status_style = "green" if row[3] == "PASSED" else "red"
        table.add_row(
            row[0][:19],
            row[1] or "-",
            (row[2] or "")[:40] + "...",
            f"[{status_style}]{row[3]}[/]",
            f"{row[4]:.2f}" if row[4] else "-"
        )
    
    console.print(table)
    console.print()


if __name__ == "__main__":
    run_swag_ironclad()
