#!/usr/bin/env python3
"""
SWAG FLASK API v1.0
Safe Walk Augmented Generation - Flask Backend

Features:
- RESTful API for safety queries
- Audio processing (Whisper STT)
- Multi-language translation (NLLB)
- RAG pipeline (ChromaDB + Llama3)
- Training audit logging (SQLite)
- Text-to-Speech (gTTS)

- image classification display probs only when not so sure
- optimize llama3.2:1b answer generation
- make llama3 always output exactly 3 items, 1 for each category?
- better ui
- video generation with api
- test with real life images

Run:
    python app.py
    or
    flask run --host=0.0.0.0 --port=5000
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

import io
import json
import base64
import tempfile
import hashlib
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Tuple
from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import sqlite3
# text to speech
from gtts import gTTS
# speech to text
from faster_whisper import WhisperModel
# Translation
import ctranslate2
import sentencepiece as spm
from huggingface_hub import snapshot_download
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
# Video Generation (lazy import - only when needed)
# Moved imports inside generate_video() to avoid slow startup
# ============================================================================
# CONFIGURATION
# ============================================================================
SWAG_MATRIX_PATH = "/Users/pc/polderr/output/classified/all_classified.json"
SWAG_ARCHIVES_PATH = "/Users/pc/polderr/output/markdown"
SWAG_BRAIN_PATH = "./swag_db"
SWAG_MODELS_PATH = "./swag_models"
TRAINING_DB_PATH = "./training_audit.db"
OLLAMA_MODEL = "llama3.2:1b"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
WHISPER_MODEL = "large-v3"#FIXME faster-whisper?
CONFIDENCE_THRESHOLD = 0.4
SUPPORTED_LANGUAGES: Dict[str, Dict] = {
    "eng_Latn": {"name": "English", "flag": "EN", "tts": "en"},
    "nld_Latn": {"name": "Dutch", "flag": "NL", "tts": "nl"},
    "fra_Latn": {"name": "French", "flag": "FR", "tts": "fr"},
    "deu_Latn": {"name": "German", "flag": "DE", "tts": "de"},
    "pol_Latn": {"name": "Polish", "flag": "PL", "tts": "pl"},
    "tur_Latn": {"name": "Turkish", "flag": "TR", "tts": "tr"},
    "ron_Latn": {"name": "Romanian", "flag": "RO", "tts": "ro"},
    "por_Latn": {"name": "Portuguese", "flag": "PT", "tts": "pt"},
    "spa_Latn": {"name": "Spanish", "flag": "ES", "tts": "es"},
}

WHISPER_TO_NLLB = {
    "en": "eng_Latn", "nl": "nld_Latn", "fr": "fra_Latn", "de": "deu_Latn",
    "pl": "pol_Latn", "tr": "tur_Latn", "ro": "ron_Latn", "pt": "por_Latn",
    "es": "spa_Latn",
}
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication
# Global model cache
models_cache = {}
_yolo_lock = threading.Lock()
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

def load_whisper():
    """Load Whisper model (cached)."""
    if 'whisper' not in models_cache:
        # Using 'tiny' model for speed - can be changed to 'base', 'small', 'medium', 'large-v3'
        print(f"Loading Whisper model: tiny (fast startup)...")
        models_cache['whisper'] = WhisperModel("tiny", device="cpu", compute_type="int8")
    return models_cache['whisper']


def load_embeddings():
    """Load embedding model (cached)."""
    if 'embeddings' not in models_cache:
        print(f"Loading embeddings model: {EMBEDDING_MODEL}...")
        models_cache['embeddings'] = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL, 
            model_kwargs={"device": "cpu"}
        )
    return models_cache['embeddings']


def load_vectorstore():
    """Load or create vector store (cached)."""
    if 'vectorstore' not in models_cache:
        print("Loading vector store...")
        embeddings = load_embeddings()
        db_path = Path(SWAG_BRAIN_PATH)
        
        if db_path.exists() and any(db_path.iterdir()):
            models_cache['vectorstore'] = Chroma(
                persist_directory=SWAG_BRAIN_PATH, 
                embedding_function=embeddings
            )
        else:
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
                models_cache['vectorstore'] = Chroma.from_documents(
                    documents, embeddings, persist_directory=SWAG_BRAIN_PATH
                )
            else:
                models_cache['vectorstore'] = None
    
    return models_cache['vectorstore']


def load_llm():
    """Load Ollama LLM (cached)."""
    if 'llm' not in models_cache:
        print(f"Loading LLM: {OLLAMA_MODEL}...")
        models_cache['llm'] = Ollama(model=OLLAMA_MODEL, temperature=0.1)
    return models_cache['llm']


def load_yolo():
    """Load YOLO26n-cls TFLite classification model (cached, thread-safe)."""
    if 'yolo' not in models_cache:
        with _yolo_lock:
            if 'yolo' not in models_cache:  # double-check after acquiring lock
                from ultralytics import YOLO
                print("Loading YOLO26n-cls TFLite model...")
                models_cache['yolo'] = YOLO("weights/best.pt")
    return models_cache['yolo']


def load_translator():
    """Load NLLB translator (cached)."""
    if 'translator' not in models_cache:
        print("Loading translator...")
        model_path = Path(SWAG_MODELS_PATH) / "nllb-200-ct2"
        
        if not model_path.exists():
            print("Downloading translation model (first run only)...")
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
        
        models_cache['translator'] = (translator, tokenizer)
    
    return models_cache['translator']

#FIXME no more api, local model
#TODO may not require another model for translation, whisper can do it
def transcribe_audio(audio_bytes: bytes) -> Tuple[str, str]:
    """Transcribe audio using local Whisper model (tiny for speed)."""
    temp_path = None
    try:
        # Use cached Whisper model instead of creating new one each time
        model = load_whisper()
        
        # Save to temp file - Whisper needs file path
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            f.write(audio_bytes)
            temp_path = f.name
        # File is now closed and can be accessed by Whisper
        
        # Transcribe
        segments, info = model.transcribe(temp_path, beam_size=5)
        text = " ".join([s.text for s in segments]).strip()
        lang = WHISPER_TO_NLLB.get(info.language, "eng_Latn")
        
        return text, lang
        
    except Exception as e:
        print(f"Whisper transcription error: {e}")
        return "", ""
    finally:
        # Clean up temp file (Windows-safe deletion)
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except PermissionError:
                # Windows sometimes holds file locks briefly
                import time
                time.sleep(0.1)  # Wait 100ms
                try:
                    os.unlink(temp_path)
                except:
                    pass  # Give up if still locked
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
    vectorstore = load_vectorstore()
    
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
    
    prompt = f"""You are a heavy machinery safety expert. Answer the user's question using the provided context.
    
    CRITICAL INSTRUCTION:
    You must classify every single sentence or step of your answer into one of these three categories:
    1. (✅) - for normal operating steps
    2. (⚠️) - for warnings, cautions, and dangers
    3. (⛔) - for things that must NOT be done

    FORMAT YOUR ANSWER AS A LIST OF STEPS like this:
    1. [Step description] (CATEGORY)
    2. [Step description] (CATEGORY)

    Example:
    1. Buckle your seatbelt before starting. (✅)
    2. Keep hands away from moving parts. (⚠️)
    3. Do not jump from the machine. (⛔)

    If the context doesn't contain the answer, say "Information not found in safety manuals."

    Context:
    {context}

    Question: {query}

    Safety Answer:"""
    
    return llm.invoke(prompt).strip()


def text_to_speech(text: str, lang_code: str) -> bytes:
    """Convert text to speech audio for vocal feedback."""
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

@app.route('/')
def index():
    """Serve the main HTML page."""
    html_path = Path(__file__).parent / 'swag_ui.html'
    if html_path.exists():
        return send_from_directory(Path(__file__).parent, 'swag_ui.html')
    else:
        return jsonify({"error": "UI file not found"}), 404


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": list(models_cache.keys())
    })


@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint."""
    data = request.json
    user_id = data.get('user_id', '').strip()
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    training_count = get_user_training_count(user_id)
    
    return jsonify({
        "success": True,
        "user_id": user_id,
        "training_count": training_count
    })


@app.route('/api/query/text', methods=['POST'])
def query_text():
    """Process text query."""
    t_total = time.time()
    data = request.json
    text = data.get('text', '').strip()
    user_id = data.get('user_id', 'unknown')
    lang = data.get('language', 'eng_Latn')
    
    if not text:
        return jsonify({"error": "Text query required"}), 400
    
    try:
        # Translate to English if needed
        t0 = time.time()
        if lang != "eng_Latn":
            english_query = translate_text(text, lang, "eng_Latn")
        else:
            english_query = text
        print(f"[TEXT] Translation to English: {time.time() - t0:.2f}s")
        
        # Search with confidence check
        t0 = time.time()
        docs, confidence, category = search_with_confidence(english_query)
        print(f"[TEXT] Vector search: {time.time() - t0:.2f}s")
        
        # Confidence check
        if confidence < CONFIDENCE_THRESHOLD:
            answer = """[STOP] STOP WORK AUTHORITY

**No matching safety procedure found in the manuals.**

Please consult your physical safety manual or contact your Site Safety Supervisor."""
            category = "HAZARD_WARNING"
        else:
            # Generate answer
            t0 = time.time()
            english_answer = generate_answer(english_query, docs)
            print(f"[TEXT] LLM answer generation: {time.time() - t0:.2f}s")
            
            # Translate answer
            t0 = time.time()
            if lang != "eng_Latn":
                answer = translate_text(english_answer, "eng_Latn", lang)
            else:
                answer = english_answer
            print(f"[TEXT] Translation to target lang: {time.time() - t0:.2f}s")
        
        # Log to database
        t0 = time.time()
        log_id = log_training(user_id, lang, text, answer, category, confidence)
        print(f"[TEXT] Database logging: {time.time() - t0:.2f}s")
        
        # Generate TTS
        t0 = time.time()
        audio_bytes = text_to_speech(answer, lang)
        audio_base64 = base64.b64encode(audio_bytes).decode() if audio_bytes else None
        print(f"[TEXT] TTS generation: {time.time() - t0:.2f}s")
        
        print(f"[TEXT] === TOTAL query_text: {time.time() - t_total:.2f}s ===")
        return jsonify({
            "success": True,
            "question": text,
            "answer": answer,
            "category": category,
            "confidence": confidence,
            "log_id": log_id,
            "audio": audio_base64
        })
    
    except Exception as e:
        print(f"[TEXT] === FAILED after {time.time() - t_total:.2f}s ===")
        return jsonify({"error": str(e)}), 500


@app.route('/api/query/voice', methods=['POST'])
def query_voice():
    """Process voice query."""
    t_total = time.time()
    if 'audio' not in request.files:
        return jsonify({"error": "Audio file required"}), 400
    
    audio_file = request.files['audio']
    user_id = request.form.get('user_id', 'unknown')
    target_lang = request.form.get('language', 'eng_Latn')
    
    try:
        # Read audio bytes
        audio_bytes = audio_file.read()
        
        # Transcribe
        t0 = time.time()
        raw_text, detected_lang = transcribe_audio(audio_bytes)
        print(f"[VOICE] Transcription (Whisper): {time.time() - t0:.2f}s")
        
        if not raw_text.strip():
            return jsonify({"error": "Could not understand audio"}), 400
        
        # Translate to English
        t0 = time.time()
        if detected_lang != "eng_Latn":
            english_query = translate_text(raw_text, detected_lang, "eng_Latn")
        else:
            english_query = raw_text
        print(f"[VOICE] Translation to English: {time.time() - t0:.2f}s")
        
        # Search with confidence check
        t0 = time.time()
        docs, confidence, category = search_with_confidence(english_query)
        print(f"[VOICE] Vector search: {time.time() - t0:.2f}s")
        
        # Confidence check
        if confidence < CONFIDENCE_THRESHOLD:
            english_answer = """[STOP] STOP WORK AUTHORITY

**No matching safety procedure found in the manuals.**

This query cannot be answered by the AI system.

**REQUIRED ACTIONS:**
1. Stop current operation
2. Consult your physical safety manual
3. Contact your Site Safety Supervisor
4. Do NOT proceed without proper guidance"""
            category = "HAZARD_WARNING"
        else:
            # Generate answer
            t0 = time.time()
            english_answer = generate_answer(english_query, docs)
            print(f"[VOICE] LLM answer generation: {time.time() - t0:.2f}s")
        
        # Translate answer to user's language
        t0 = time.time()
        if target_lang != "eng_Latn":
            final_answer = translate_text(english_answer, "eng_Latn", target_lang)
        else:
            final_answer = english_answer
        print(f"[VOICE] Translation to target lang: {time.time() - t0:.2f}s")
        
        # Log to database
        t0 = time.time()
        log_id = log_training(user_id, target_lang, raw_text, final_answer, category, confidence)
        print(f"[VOICE] Database logging: {time.time() - t0:.2f}s")
        
        # Generate TTS
        t0 = time.time()
        audio_bytes = text_to_speech(final_answer, target_lang)
        audio_base64 = base64.b64encode(audio_bytes).decode() if audio_bytes else None
        print(f"[VOICE] TTS generation: {time.time() - t0:.2f}s")
        
        print(f"[VOICE] === TOTAL query_voice: {time.time() - t_total:.2f}s ===")
        return jsonify({
            "success": True,
            "transcription": raw_text,
            "detected_language": detected_lang,
            "question": raw_text,
            "answer": final_answer,
            "category": category,
            "confidence": confidence,
            "log_id": log_id,
            "audio": audio_base64
        })
    
    except Exception as e:
        print(f"[VOICE] === FAILED after {time.time() - t_total:.2f}s ===")
        return jsonify({"error": str(e)}), 500


@app.route('/api/verify/<int:log_id>', methods=['POST'])
def verify_log(log_id):
    """Verify training log."""
    try:
        verify_training(log_id)
        return jsonify({"success": True, "log_id": log_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/training/count/<user_id>', methods=['GET'])
def training_count(user_id):
    """Get training count for user."""
    try:
        count = get_user_training_count(user_id)
        return jsonify({"user_id": user_id, "count": count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect', methods=['POST'])
def detect_objects():
    """Image classification endpoint using local YOLO26n-cls TFLite model."""
    t_total = time.time()
    if 'image' not in request.files:
        return jsonify({"error": "Image file required"}), 400
    
    image_file = request.files['image']
    user_id = request.form.get('user_id', 'unknown')
    
    try:
        # Save image temporarily
        t0 = time.time()
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            image_file.save(f.name)
            temp_path = f.name
        print(f"[DETECT] Save temp image: {time.time() - t0:.2f}s")
        
        # Run classification using local YOLO26n-cls TFLite
        t0 = time.time()
        model = load_yolo()
        print(f"[DETECT] Load YOLO model: {time.time() - t0:.2f}s")
        
        t0 = time.time()
        results = model.predict(temp_path, verbose=False)
        print(f"[DETECT] YOLO prediction: {time.time() - t0:.2f}s")
        
        # Process classification results (probs, not boxes)
        AMBIGUITY_THRESHOLD = 0.25  # gap between #1 and #2 confidence
        detections = []
        ambiguous = False
        probs = results[0].probs
        if probs is not None:
            top5_indices = probs.top5
            top5_confs = probs.top5conf.tolist()
            names = results[0].names
            
            if len(top5_confs) >= 2:
                gap = top5_confs[0] - top5_confs[1]
                ambiguous = gap < AMBIGUITY_THRESHOLD
                print(f"[DETECT] Top-1: {names[top5_indices[0]]} ({top5_confs[0]:.3f}), "
                      f"Top-2: {names[top5_indices[1]]} ({top5_confs[1]:.3f}), "
                      f"Gap: {gap:.3f}, Ambiguous: {ambiguous}")
            
            if ambiguous:
                # Show top 3 when model is uncertain
                for idx, conf in zip(top5_indices[:3], top5_confs[:3]):
                    detections.append({
                        "class": names[idx],
                        "confidence": round(float(conf), 3)
                    })
            else:
                # Show only top 1 when model is confident
                detections.append({
                    "class": names[top5_indices[0]],
                    "confidence": round(float(top5_confs[0]), 3)
                })
        
        # Clean up
        os.unlink(temp_path)
        
        print(f"[DETECT] === TOTAL detect_objects: {time.time() - t_total:.2f}s ===")
        return jsonify({
            "success": True,
            "detections": detections,
            "ambiguous": ambiguous,
            "count": len(detections)
        })
    
    except Exception as e:
        print(f"[DETECT] === FAILED after {time.time() - t_total:.2f}s ===")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate_video', methods=['POST'])
def generate_video():
    """Generate safety video from query using Gemini Veo API."""
    t_total = time.time()
    data = request.json
    query = data.get('query', '')
    category = data.get('category', 'OPERATIONAL_PROCEDURE')
    machine = data.get('machine', 'general')
    
    if not query:
        return jsonify({"error": "Query required"}), 400
        
    try:
        # Lazy import - only load when this endpoint is called
        t0 = time.time()
        from swag_video_gemini import generate_video_gemini
        from pipeline.director import create_visual_prompt_offline
        print(f"[VIDEO] Lazy imports: {time.time() - t0:.2f}s")
        
        # 1. Create visual prompt (template-based, no LLM needed)
        t0 = time.time()
        visual_prompt_obj = create_visual_prompt_offline(query, category, machine)
        prompt = visual_prompt_obj.wan_2_2_prompt
        print(f"[VIDEO] Create visual prompt: {time.time() - t0:.2f}s")
        
        # 2. Generate video via Gemini Veo API
        t0 = time.time()
        video_path = generate_video_gemini(prompt)
        print(f"[VIDEO] Generate video (Gemini): {time.time() - t0:.2f}s")
        
        if not video_path:
            return jsonify({"error": "Video generation failed"}), 500
            
        print(f"[VIDEO] === TOTAL generate_video: {time.time() - t_total:.2f}s ===")
        return jsonify({
            "success": True,
            "video_url": video_path,
            "prompt": prompt
        })
        
    except Exception as e:
        print(f"[VIDEO] === FAILED after {time.time() - t_total:.2f}s ===")
        return jsonify({"error": str(e)}), 500


def preload_models():
    """Preload all models during startup."""
    t_total = time.time()
    print("Preloading SWAG models...")
    
    # 1. Load Whisper
    try:
        t0 = time.time()
        load_whisper()
        print(f"✓ Whisper model loaded ({time.time() - t0:.2f}s)")
    except Exception as e:
        print(f"✗ Failed to load Whisper: {e}")

    # 2. Load Embeddings and Vectorstore
    try:
        t0 = time.time()
        load_vectorstore()
        print(f"✓ Vectorstore loaded ({time.time() - t0:.2f}s)")
    except Exception as e:
        print(f"✗ Failed to load Vectorstore: {e}")

    # 3. Load LLM (lightweight connection check)
    try:
        t0 = time.time()
        load_llm()
        print(f"✓ LLM connection established ({time.time() - t0:.2f}s)")
    except Exception as e:
        print(f"✗ Failed to connect to LLM: {e}")

    # 4. Load YOLO
    try:
        t0 = time.time()
        load_yolo()
        print(f"✓ YOLO model loaded ({time.time() - t0:.2f}s)")
    except Exception as e:
        print(f"✗ Failed to load YOLO: {e}")

    # 5. Load Translator
    try:
        t0 = time.time()
        load_translator()
        print(f"✓ Translator loaded ({time.time() - t0:.2f}s)")
    except Exception as e:
        print(f"✗ Failed to load Translator: {e}")
    
    print(f"=== TOTAL preload_models: {time.time() - t_total:.2f}s ===")

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Preload models to prevent timeout on first request
    preload_models()
    
    # Run Flask app
    # use_reloader=False prevents double-startup from watchdog (faster development)
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=False  # Disable auto-reload to prevent slow double-startup
    )
