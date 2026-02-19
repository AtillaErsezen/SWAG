#!/usr/bin/env python3
"""
SWAG MOBILE PWA v5.0
Safe Walk Augmented Generation - Mobile-First Progressive Web App

Features:
- Mobile-optimized touch UI (Streamlit)
- Operator login with ID tracking
- Training verification with "I CONFIRM UNDERSTANDING" button
- Text-to-Speech audio output (gTTS)
- Full AI pipeline (Whisper + NLLB + Llama3 + ChromaDB)
- Training audit log (SQLite)

Run:
    streamlit run swag_app.py --server.port 8501
"""

import streamlit as st
import sqlite3
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

import io
import tempfile
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Tuple
import base64

# Audio
from gtts import gTTS

# Mic Recorder
from streamlit_mic_recorder import mic_recorder

# Whisper STT
from faster_whisper import WhisperModel

# Translation
import ctranslate2
import sentencepiece as spm
from huggingface_hub import snapshot_download

# LangChain
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama

# ============================================================================
# HARDCODED PATHS
# ============================================================================
SWAG_MATRIX_PATH = "/Users/pc/polderr/output/classified/all_classified.json"
SWAG_ARCHIVES_PATH = "/Users/pc/polderr/output/markdown"
SWAG_BRAIN_PATH = "./swag_db"
SWAG_MODELS_PATH = "./swag_models"
TRAINING_DB_PATH = "./training_audit.db"
OLLAMA_MODEL = "llama3"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
WHISPER_MODEL = "large-v3"
CONFIDENCE_THRESHOLD = 0.4

# ============================================================================
# SWAG COLOR PALETTE (CSS)
# ============================================================================
SWAG_CSS = """
<style>
    /* Root Variables */
    :root {
        --concrete-mist: #F0F2F5;
        --carbon-steel: #333E48;
        --safety-orange: #FF6700;
        --trust-cobalt: #0057B8;
        --brushed-aluminum: #A0AAB5;
    }
    
    /* Main Background */
    .stApp {
        background-color: #F0F2F5 !important;
    }
    
    /* Headers */
    h1, h2, h3, h4, h5, h6 {
        color: #333E48 !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    
    /* Primary Buttons */
    .stButton > button {
        background-color: #0057B8 !important;
        color: white !important;
        border-radius: 12px !important;
        padding: 16px 32px !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(0, 87, 184, 0.3) !important;
        transition: all 0.2s ease !important;
    }
    
    .stButton > button:hover {
        background-color: #004a9e !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px rgba(0, 87, 184, 0.4) !important;
    }
    
    /* Confirm Button (Green) */
    .confirm-btn > button {
        background-color: #28a745 !important;
        font-size: 24px !important;
        padding: 24px 48px !important;
    }
    
    /* Danger Elements */
    .danger-card {
        border: 3px solid #FF6700 !important;
        border-radius: 12px !important;
        padding: 20px !important;
        background: linear-gradient(135deg, #fff5f0, #fff) !important;
    }
    
    /* Info Elements */
    .info-card {
        border: 3px solid #0057B8 !important;
        border-radius: 12px !important;
        padding: 20px !important;
        background: linear-gradient(135deg, #f0f5ff, #fff) !important;
    }
    
    /* Text */
    p, div, span, label {
        color: #333E48 !important;
        font-family: 'Inter', sans-serif !important;
    }
    
    /* Input Fields */
    .stTextInput > div > div > input {
        font-size: 20px !important;
        padding: 16px !important;
        border-radius: 8px !important;
        border: 2px solid #A0AAB5 !important;
    }
    
    /* Select Box */
    .stSelectbox > div > div {
        font-size: 18px !important;
    }
    
    /* Sidebar */
    [data-testid="stSidebar"] {
        background-color: #333E48 !important;
    }
    
    [data-testid="stSidebar"] h1, 
    [data-testid="stSidebar"] h2,
    [data-testid="stSidebar"] p,
    [data-testid="stSidebar"] label {
        color: #F0F2F5 !important;
    }
    
    /* Toast Messages */
    .stSuccess {
        background-color: #d4edda !important;
        border-color: #28a745 !important;
    }
    
    /* Large Touch Target */
    .touch-button {
        min-height: 80px !important;
        min-width: 200px !important;
    }
    
    /* Recording Indicator */
    .recording-active {
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
</style>
"""

# ============================================================================
# SUPPORTED LANGUAGES
# ============================================================================
SUPPORTED_LANGUAGES: Dict[str, Dict] = {
    "eng_Latn": {"name": "English", "flag": "🇬🇧", "tts": "en"},
    "nld_Latn": {"name": "Dutch", "flag": "🇳🇱", "tts": "nl"},
    "fra_Latn": {"name": "French", "flag": "🇫🇷", "tts": "fr"},
    "deu_Latn": {"name": "German", "flag": "🇩🇪", "tts": "de"},
    "pol_Latn": {"name": "Polish", "flag": "🇵🇱", "tts": "pl"},
    "tur_Latn": {"name": "Turkish", "flag": "🇹🇷", "tts": "tr"},
    "ron_Latn": {"name": "Romanian", "flag": "🇷🇴", "tts": "ro"},
    "por_Latn": {"name": "Portuguese", "flag": "🇵🇹", "tts": "pt"},
    "spa_Latn": {"name": "Spanish", "flag": "🇪🇸", "tts": "es"},
}

WHISPER_TO_NLLB = {
    "en": "eng_Latn", "nl": "nld_Latn", "fr": "fra_Latn", "de": "deu_Latn",
    "pl": "pol_Latn", "tr": "tur_Latn", "ro": "ron_Latn", "pt": "por_Latn",
    "es": "spa_Latn",
}

# ============================================================================
# DATABASE FUNCTIONS
# ============================================================================

def init_database():
    """Initialize training audit database."""
    conn = sqlite3.connect(TRAINING_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS training_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            user_id TEXT NOT NULL,
            language TEXT,
            topic TEXT,
            question TEXT,
            answer TEXT,
            category TEXT,
            confidence_score REAL,
            verified INTEGER DEFAULT 0,
            verified_at TEXT
        )
    """)
    conn.commit()
    conn.close()


def log_training(user_id: str, language: str, question: str, answer: str, 
                 category: str, confidence: float) -> int:
    """Log training interaction and return log ID."""
    conn = sqlite3.connect(TRAINING_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO training_logs 
        (timestamp, user_id, language, question, answer, category, confidence_score, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    """, (
        datetime.now().isoformat(),
        user_id,
        language,
        question[:500],
        answer[:1000],
        category,
        confidence
    ))
    log_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return log_id


def verify_training(log_id: int):
    """Mark training as verified/confirmed."""
    conn = sqlite3.connect(TRAINING_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE training_logs 
        SET verified = 1, verified_at = ?
        WHERE id = ?
    """, (datetime.now().isoformat(), log_id))
    conn.commit()
    conn.close()


def get_user_training_count(user_id: str) -> int:
    """Get number of verified trainings for user."""
    conn = sqlite3.connect(TRAINING_DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT COUNT(*) FROM training_logs WHERE user_id = ? AND verified = 1",
        (user_id,)
    )
    count = cursor.fetchone()[0]
    conn.close()
    return count


# ============================================================================
# CACHED MODEL LOADING
# ============================================================================

@st.cache_resource
def load_whisper():
    """Load Whisper model (cached)."""
    return WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")


@st.cache_resource
def load_embeddings():
    """Load embedding model (cached)."""
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL, model_kwargs={"device": "cpu"})


@st.cache_resource
def load_vectorstore(_embeddings):
    """Load or create vector store (cached)."""
    db_path = Path(SWAG_BRAIN_PATH)
    
    if db_path.exists() and any(db_path.iterdir()):
        return Chroma(persist_directory=SWAG_BRAIN_PATH, embedding_function=_embeddings)
    
    # Build from documents
    documents = []
    
    # Load matrix
    if Path(SWAG_MATRIX_PATH).exists():
        with open(SWAG_MATRIX_PATH, "r", encoding="utf-8") as f:
            matrix_data = json.load(f)
        
        for entry in matrix_data:
            machine = entry.get("machine", "UNKNOWN")
            category = entry.get("category", "UNCLASSIFIED")
            text = entry.get("original_text", "")
            
            doc = Document(
                page_content=f"MACHINE: {machine}\nLABEL: {category}\nRULE: {text}",
                metadata={"source": "SWAG_MATRIX", "category": category, "machine": machine}
            )
            documents.append(doc)
    
    # Load archives
    archives_path = Path(SWAG_ARCHIVES_PATH)
    if archives_path.exists():
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        for md_file in archives_path.glob("*.md"):
            try:
                content = md_file.read_text(encoding="utf-8")
                for chunk in splitter.split_text(content):
                    doc = Document(page_content=chunk, metadata={"source": md_file.name})
                    documents.append(doc)
            except:
                pass
    
    if documents:
        return Chroma.from_documents(documents, _embeddings, persist_directory=SWAG_BRAIN_PATH)
    
    return None


@st.cache_resource
def load_llm():
    """Load Ollama LLM (cached)."""
    return Ollama(model=OLLAMA_MODEL, temperature=0.1)


@st.cache_resource
def load_translator():
    """Load NLLB translator (cached)."""
    model_path = Path(SWAG_MODELS_PATH) / "nllb-200-ct2"
    
    if not model_path.exists():
        st.info("Downloading translation model (first run only)...")
        hf_model_path = snapshot_download(
            repo_id="facebook/nllb-200-distilled-600M",
            local_dir=str(Path(SWAG_MODELS_PATH) / "nllb-200-hf")
        )
        os.system(f"ct2-transformers-converter --model {hf_model_path} --output_dir {model_path} --quantization int8")
    
    translator = ctranslate2.Translator(str(model_path), device="cpu", compute_type="int8")
    
    tokenizer_path = Path(SWAG_MODELS_PATH) / "nllb-200-hf" / "sentencepiece.bpe.model"
    if tokenizer_path.exists():
        tokenizer = spm.SentencePieceProcessor(str(tokenizer_path))
    else:
        tokenizer = None
    
    return translator, tokenizer


# ============================================================================
# AI PIPELINE FUNCTIONS
# ============================================================================

def transcribe_audio(audio_bytes: bytes) -> Tuple[str, str]:
    """Transcribe audio and detect language."""
    whisper = load_whisper()
    
    # Save to temp file
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(audio_bytes)
        temp_path = f.name
    
    try:
        segments, info = whisper.transcribe(temp_path, beam_size=5)
        text = " ".join([s.text for s in segments]).strip()
        lang = WHISPER_TO_NLLB.get(info.language, "eng_Latn")
        return text, lang
    finally:
        os.unlink(temp_path)


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate text using NLLB."""
    if source_lang == target_lang:
        return text
    
    translator, tokenizer = load_translator()
    
    if translator is None or tokenizer is None:
        return text
    
    try:
        tokens = tokenizer.encode(text, out_type=str)
        results = translator.translate_batch(
            [[source_lang] + tokens],
            target_prefix=[[target_lang]],
            beam_size=4,
            max_decoding_length=256
        )
        output_tokens = results[0].hypotheses[0]
        return tokenizer.decode(output_tokens).strip()
    except:
        return text


def search_with_confidence(query: str, k: int = 5) -> Tuple[List[Document], float, str]:
    """Search vectorstore with confidence scoring."""
    embeddings = load_embeddings()
    vectorstore = load_vectorstore(embeddings)
    
    if vectorstore is None:
        return [], 0.0, "UNKNOWN"
    
    results = vectorstore.similarity_search_with_score(query, k=k)
    
    if not results:
        return [], 0.0, "UNKNOWN"
    
    docs = [r[0] for r in results]
    scores = [r[1] for r in results]
    best_score = min(scores)
    similarity = 1 / (1 + best_score)
    
    # Determine category from top result
    category = docs[0].metadata.get("category", "OPERATIONAL_PROCEDURE") if docs else "UNKNOWN"
    
    return docs, similarity, category


def generate_answer(query: str, context_docs: List[Document]) -> str:
    """Generate answer using LLM."""
    llm = load_llm()
    
    context = "\n\n".join([d.page_content for d in context_docs[:3]])
    
    prompt = f"""You are a heavy machinery safety expert. Answer ONLY using the provided context.
If the context doesn't contain the answer, say "Information not found in safety manuals."

Context:
{context}

Question: {query}

Safety Answer:"""
    
    return llm.invoke(prompt).strip()


def text_to_speech(text: str, lang_code: str) -> bytes:
    """Convert text to speech audio."""
    lang_info = SUPPORTED_LANGUAGES.get(lang_code, SUPPORTED_LANGUAGES["eng_Latn"])
    tts_lang = lang_info.get("tts", "en")
    
    try:
        tts = gTTS(text=text, lang=tts_lang, slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        return audio_buffer.read()
    except:
        return None


def autoplay_audio(audio_bytes: bytes):
    """Autoplay audio in browser."""
    if audio_bytes:
        b64 = base64.b64encode(audio_bytes).decode()
        audio_html = f"""
            <audio autoplay>
                <source src="data:audio/mp3;base64,{b64}" type="audio/mp3">
            </audio>
        """
        st.markdown(audio_html, unsafe_allow_html=True)


# ============================================================================
# UI COMPONENTS
# ============================================================================

def render_login():
    """Render login screen."""
    st.markdown("## 👷 Operator Login")
    st.markdown("---")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown("### Enter Your Operator ID")
        
        user_id = st.text_input(
            "Operator ID",
            placeholder="e.g., OP-1234",
            label_visibility="collapsed"
        )
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        if st.button("🔐 CLOCK IN", use_container_width=True, type="primary"):
            if user_id.strip():
                st.session_state.user_id = user_id.strip()
                st.session_state.logged_in = True
                st.rerun()
            else:
                st.error("Please enter your Operator ID")


def render_header():
    """Render dashboard header."""
    col1, col2, col3 = st.columns([2, 3, 2])
    
    with col1:
        st.markdown("## 🛡️ SWAG")
    
    with col2:
        # Language selector
        lang_options = {f"{v['flag']} {v['name']}": k for k, v in SUPPORTED_LANGUAGES.items()}
        current_lang = st.session_state.get("lang", "eng_Latn")
        current_display = f"{SUPPORTED_LANGUAGES[current_lang]['flag']} {SUPPORTED_LANGUAGES[current_lang]['name']}"
        
        selected = st.selectbox(
            "Language",
            options=list(lang_options.keys()),
            index=list(lang_options.values()).index(current_lang) if current_lang in lang_options.values() else 0,
            label_visibility="collapsed"
        )
        st.session_state.lang = lang_options[selected]
    
    with col3:
        user_id = st.session_state.get("user_id", "Unknown")
        training_count = get_user_training_count(user_id)
        st.markdown(f"**{user_id}**")
        st.caption(f"✅ {training_count} verified trainings")


def render_answer_card(answer: str, category: str, question: str, confidence: float):
    """Render the answer card with verification button."""
    
    # Determine styling based on category
    is_danger = category in ["PROHIBITED_ACTION", "HAZARD_WARNING"]
    
    if is_danger:
        st.markdown("""
            <div style="border: 4px solid #FF6700; border-radius: 16px; padding: 24px; 
                        background: linear-gradient(135deg, #fff5f0, #ffffff); margin: 16px 0;">
        """, unsafe_allow_html=True)
        st.markdown(f"### 🛑 SAFETY ALERT")
    else:
        st.markdown("""
            <div style="border: 4px solid #0057B8; border-radius: 16px; padding: 24px; 
                        background: linear-gradient(135deg, #f0f5ff, #ffffff); margin: 16px 0;">
        """, unsafe_allow_html=True)
        st.markdown(f"### ℹ️ SAFETY INFORMATION")
    
    st.markdown(f"**Question:** {question}")
    st.markdown("---")
    st.markdown(answer)
    st.markdown(f"*Confidence: {confidence:.0%}*")
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Generate and play TTS
    current_lang = st.session_state.get("lang", "eng_Latn")
    audio_bytes = text_to_speech(answer, current_lang)
    if audio_bytes:
        autoplay_audio(audio_bytes)
    
    # Log to database (unverified)
    log_id = log_training(
        user_id=st.session_state.get("user_id", "unknown"),
        language=current_lang,
        question=question,
        answer=answer,
        category=category,
        confidence=confidence
    )
    st.session_state.pending_log_id = log_id
    
    # Verification button
    st.markdown("<br>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        if st.button("✅ I CONFIRM UNDERSTANDING", use_container_width=True, type="primary"):
            verify_training(log_id)
            st.success("✅ Training logged and verified!")
            st.balloons()
            st.session_state.show_answer = False
            st.session_state.pending_log_id = None


def render_dashboard():
    """Render main dashboard."""
    render_header()
    
    st.markdown("---")
    
    # Check if we have a pending answer to display
    if st.session_state.get("show_answer", False):
        render_answer_card(
            answer=st.session_state.current_answer,
            category=st.session_state.current_category,
            question=st.session_state.current_question,
            confidence=st.session_state.current_confidence
        )
        return
    
    # Main interaction area
    st.markdown("### 🎤 Voice Safety Query")
    st.markdown("Hold the button and speak your safety question")
    
    # Mic recorder
    audio = mic_recorder(
        start_prompt="🔴 HOLD TO SPEAK",
        stop_prompt="⏹️ RELEASE TO PROCESS",
        just_once=True,
        use_container_width=True
    )
    
    if audio:
        process_voice_query(audio["bytes"])
    
    st.markdown("---")
    
    # Text input alternative
    st.markdown("### ⌨️ Or Type Your Question")
    
    text_query = st.text_input(
        "Type your safety question",
        placeholder="e.g., What is the safe distance from excavator swing radius?",
        label_visibility="collapsed"
    )
    
    if st.button("🔍 SEARCH SAFETY DATABASE", use_container_width=True):
        if text_query.strip():
            process_text_query(text_query.strip())
        else:
            st.warning("Please enter a question")
    
    # Logout button
    st.markdown("---")
    if st.button("🚪 Clock Out", type="secondary"):
        st.session_state.logged_in = False
        st.session_state.user_id = None
        st.rerun()


def process_voice_query(audio_bytes: bytes):
    """Process voice query through AI pipeline."""
    current_lang = st.session_state.get("lang", "eng_Latn")
    
    with st.spinner("🧠 Accessing Safety Neural Net..."):
        # Step 1: Transcribe
        st.info("📝 Transcribing audio...")
        raw_text, detected_lang = transcribe_audio(audio_bytes)
        
        if not raw_text.strip():
            st.error("Could not understand audio. Please try again.")
            return
        
        st.success(f"Heard: \"{raw_text}\"")
        
        # Step 2: Translate to English
        if detected_lang != "eng_Latn":
            st.info(f"🌍 Translating {SUPPORTED_LANGUAGES.get(detected_lang, {}).get('flag', '')} → 🇬🇧...")
            english_query = translate_text(raw_text, detected_lang, "eng_Latn")
        else:
            english_query = raw_text
        
        # Step 3: Search with confidence check
        st.info("🔍 Searching safety database...")
        docs, confidence, category = search_with_confidence(english_query)
        
        # Step 4: Confidence check
        if confidence < CONFIDENCE_THRESHOLD:
            st.session_state.current_answer = """⛔ STOP WORK AUTHORITY

**No matching safety procedure found in the manuals.**

This query cannot be answered by the AI system.

**REQUIRED ACTIONS:**
1. Stop current operation
2. Consult your physical safety manual
3. Contact your Site Safety Supervisor
4. Do NOT proceed without proper guidance"""
            st.session_state.current_category = "HAZARD_WARNING"
            st.session_state.current_question = raw_text
            st.session_state.current_confidence = confidence
            st.session_state.show_answer = True
            st.rerun()
            return
        
        # Step 5: Generate answer
        st.info("💡 Generating safety guidance...")
        english_answer = generate_answer(english_query, docs)
        
        # Step 6: Translate answer to user's language
        if current_lang != "eng_Latn":
            st.info(f"🌍 Translating 🇬🇧 → {SUPPORTED_LANGUAGES.get(current_lang, {}).get('flag', '')}...")
            final_answer = translate_text(english_answer, "eng_Latn", current_lang)
        else:
            final_answer = english_answer
        
        # Store in session state
        st.session_state.current_answer = final_answer
        st.session_state.current_category = category
        st.session_state.current_question = raw_text
        st.session_state.current_confidence = confidence
        st.session_state.show_answer = True
        st.rerun()


def process_text_query(text: str):
    """Process text query through AI pipeline."""
    current_lang = st.session_state.get("lang", "eng_Latn")
    
    with st.spinner("🧠 Accessing Safety Neural Net..."):
        # Translate to English if needed
        if current_lang != "eng_Latn":
            st.info(f"🌍 Translating to English...")
            english_query = translate_text(text, current_lang, "eng_Latn")
        else:
            english_query = text
        
        # Search with confidence check
        st.info("🔍 Searching safety database...")
        docs, confidence, category = search_with_confidence(english_query)
        
        # Confidence check
        if confidence < CONFIDENCE_THRESHOLD:
            st.session_state.current_answer = """⛔ STOP WORK AUTHORITY

**No matching safety procedure found in the manuals.**

Please consult your physical safety manual or contact your Site Safety Supervisor."""
            st.session_state.current_category = "HAZARD_WARNING"
            st.session_state.current_question = text
            st.session_state.current_confidence = confidence
            st.session_state.show_answer = True
            st.rerun()
            return
        
        # Generate answer
        st.info("💡 Generating safety guidance...")
        english_answer = generate_answer(english_query, docs)
        
        # Translate answer
        if current_lang != "eng_Latn":
            final_answer = translate_text(english_answer, "eng_Latn", current_lang)
        else:
            final_answer = english_answer
        
        # Store in session state
        st.session_state.current_answer = final_answer
        st.session_state.current_category = category
        st.session_state.current_question = text
        st.session_state.current_confidence = confidence
        st.session_state.show_answer = True
        st.rerun()


# ============================================================================
# MAIN APP
# ============================================================================

def main():
    """Main application entry point."""
    # Page config
    st.set_page_config(
        page_title="SWAG Safety Intelligence",
        page_icon="🛡️",
        layout="centered",
        initial_sidebar_state="collapsed"
    )
    
    # Inject custom CSS
    st.markdown(SWAG_CSS, unsafe_allow_html=True)
    
    # Initialize database
    init_database()
    
    # Initialize session state
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False
    if "lang" not in st.session_state:
        st.session_state.lang = "eng_Latn"
    if "show_answer" not in st.session_state:
        st.session_state.show_answer = False
    
    # Render appropriate screen
    if not st.session_state.logged_in:
        render_login()
    else:
        render_dashboard()


if __name__ == "__main__":
    main()
