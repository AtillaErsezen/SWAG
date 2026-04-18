#!/usr/bin/env python3
"""
SWAG FLASK API v2.0
Safe Walk Augmented Generation - Flask Backend (API Edition)

AI Stack:
- STT  : OpenAI Whisper API (whisper-1)
- LLM  : Anthropic Claude  (answers + translation)
- TTS  : Google Gemini Flash TTS
- RAG  : ChromaDB + all-MiniLM-L6-v2 embeddings (local, lightweight)
- YOLO : local classification model (unchanged)
"""
import os
from dotenv import load_dotenv
load_dotenv()

import io
import wave
import json
import base64
import tempfile
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3

# ── API clients ───────────────────────────────────────────────────────────────
import anthropic
from openai import OpenAI
from google import genai
from google.genai import types as genai_types

# ── Vector store (local, lightweight) ─────────────────────────────────────────
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# ============================================================================
# CONFIGURATION
# ============================================================================
SWAG_MATRIX_PATH   = "./output/classified/all_classified.json"
SWAG_ARCHIVES_PATH = "./output/markdown"
SWAG_BRAIN_PATH    = "./swag_db"
TRAINING_DB_PATH   = "./training_audit.db"

CLAUDE_MODEL    = "claude-haiku-4-5-20251001"   # swap to claude-sonnet-4-6 for higher quality
GEMINI_TTS_MODEL = "gemini-2.5-flash-preview-tts"
EMBEDDING_MODEL  = "all-MiniLM-L6-v2"
CONFIDENCE_THRESHOLD = 0.4

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY    = os.getenv("OPENAI_API_KEY")
GOOGLE_API_KEY    = os.getenv("GOOGLE_API_KEY")

SUPPORTED_LANGUAGES: Dict[str, Dict] = {
    "eng_Latn": {"name": "English",    "flag": "EN"},
    "nld_Latn": {"name": "Dutch",      "flag": "NL"},
    "fra_Latn": {"name": "French",     "flag": "FR"},
    "deu_Latn": {"name": "German",     "flag": "DE"},
    "pol_Latn": {"name": "Polish",     "flag": "PL"},
    "tur_Latn": {"name": "Turkish",    "flag": "TR"},
    "ron_Latn": {"name": "Romanian",   "flag": "RO"},
    "por_Latn": {"name": "Portuguese", "flag": "PT"},
    "spa_Latn": {"name": "Spanish",    "flag": "ES"},
}

NLLB_TO_NAME = {k: v["name"] for k, v in SUPPORTED_LANGUAGES.items()}

# Whisper API returns ISO 639-1 short codes → map to NLLB
WHISPER_TO_NLLB = {
    "en": "eng_Latn", "nl": "nld_Latn", "fr": "fra_Latn", "de": "deu_Latn",
    "pl": "pol_Latn", "tr": "tur_Latn", "ro": "ron_Latn", "pt": "por_Latn",
    "es": "spa_Latn",
}

app = Flask(__name__)
CORS(app)

models_cache = {}
_yolo_lock   = threading.Lock()

# ── Lazy API clients ──────────────────────────────────────────────────────────
_anthropic_client = None
_openai_client    = None
_gemini_client    = None

def get_anthropic():
    global _anthropic_client
    if _anthropic_client is None:
        _anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    return _anthropic_client

def get_openai():
    global _openai_client
    if _openai_client is None:
        _openai_client = OpenAI(api_key=OPENAI_API_KEY)
    return _openai_client

def get_gemini():
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
    return _gemini_client

# ============================================================================
# DATABASE
# ============================================================================

def init_database():
    conn = sqlite3.connect(TRAINING_DB_PATH)
    conn.execute("""
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


def log_training(user_id, language, question, answer, category, confidence) -> int:
    conn = sqlite3.connect(TRAINING_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO training_logs
        (timestamp, user_id, language, question, answer, category, confidence_score, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    """, (datetime.now().isoformat(), user_id, language,
          question[:500], answer[:1000], category, confidence))
    log_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return log_id


def verify_training(log_id: int):
    conn = sqlite3.connect(TRAINING_DB_PATH)
    conn.execute("UPDATE training_logs SET verified=1, verified_at=? WHERE id=?",
                 (datetime.now().isoformat(), log_id))
    conn.commit()
    conn.close()


def get_user_training_count(user_id: str) -> int:
    conn = sqlite3.connect(TRAINING_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM training_logs WHERE user_id=? AND verified=1", (user_id,))
    count = cursor.fetchone()[0]
    conn.close()
    return count

# ============================================================================
# LOCAL MODEL LOADERS  (embeddings, vectorstore, YOLO — no LLM/STT/TTS)
# ============================================================================

def load_embeddings():
    if 'embeddings' not in models_cache:
        print(f"Loading embeddings: {EMBEDDING_MODEL}...")
        models_cache['embeddings'] = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL, model_kwargs={"device": "cpu"}
        )
    return models_cache['embeddings']


def load_vectorstore():
    if 'vectorstore' not in models_cache:
        print("Loading vector store...")
        embeddings = load_embeddings()
        db_path = Path(SWAG_BRAIN_PATH)
        assert db_path.exists(), f"Vector store not found at {SWAG_BRAIN_PATH}, run init_rag_db.py first"

        if any(db_path.iterdir()):
            models_cache['vectorstore'] = Chroma(
                persist_directory=SWAG_BRAIN_PATH, embedding_function=embeddings
            )
        else:
            documents = []
            if Path(SWAG_MATRIX_PATH).exists():
                with open(SWAG_MATRIX_PATH, "r", encoding="utf-8") as f:
                    for entry in json.load(f):
                        documents.append(Document(
                            page_content=(f"MACHINE: {entry.get('machine','UNKNOWN')}\n"
                                          f"LABEL: {entry.get('category','UNCLASSIFIED')}\n"
                                          f"RULE: {entry.get('original_text','')}"),
                            metadata={"source": "SWAG_MATRIX",
                                      "category": entry.get("category", ""),
                                      "machine":  entry.get("machine", "")}
                        ))
            archives = Path(SWAG_ARCHIVES_PATH)
            if archives.exists():
                splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                for md in archives.glob("*.md"):
                    try:
                        for chunk in splitter.split_text(md.read_text(encoding="utf-8")):
                            documents.append(Document(page_content=chunk, metadata={"source": md.name}))
                    except Exception:
                        pass
            models_cache['vectorstore'] = (
                Chroma.from_documents(documents, embeddings, persist_directory=SWAG_BRAIN_PATH)
                if documents else None
            )
    return models_cache['vectorstore']


def load_yolo():
    if 'yolo' not in models_cache:
        with _yolo_lock:
            if 'yolo' not in models_cache:
                from ultralytics import YOLO
                print("Loading YOLO model...")
                models_cache['yolo'] = YOLO("weights/best.pt")
    return models_cache['yolo']

# ============================================================================
# AI FUNCTIONS — API-BACKED
# ============================================================================

def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> Tuple[str, str]:
    """STT via OpenAI Whisper API."""
    temp_path = None
    try:
        ext = Path(filename).suffix or ".webm"
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as f:
            f.write(audio_bytes)
            temp_path = f.name

        with open(temp_path, "rb") as af:
            transcript = get_openai().audio.transcriptions.create(
                model="whisper-1",
                file=af,
                response_format="verbose_json"
            )

        text = transcript.text.strip()
        lang = WHISPER_TO_NLLB.get(transcript.language, "eng_Latn")
        return text, lang

    except Exception as e:
        print(f"[WHISPER] Error: {e}")
        return "", ""
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception:
                time.sleep(0.1)
                try:
                    os.unlink(temp_path)
                except Exception:
                    pass


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate via Claude."""
    if source_lang == target_lang or not text.strip():
        return text
    src = NLLB_TO_NAME.get(source_lang, "English")
    tgt = NLLB_TO_NAME.get(target_lang, "English")
    try:
        msg = get_anthropic().messages.create(
            model=CLAUDE_MODEL,
            max_tokens=512,
            messages=[{"role": "user", "content":
                f"Translate the following text from {src} to {tgt}. "
                f"Output only the translation, nothing else.\n\n{text}"}]
        )
        result = msg.content[0].text.strip()
        print(f"[CLAUDE] translate {src}→{tgt} | {msg.usage.input_tokens} in / {msg.usage.output_tokens} out tokens | '{text[:40]}' → '{result[:40]}'")
        return result
    except Exception as e:
        print(f"[CLAUDE] Translation error ({src}→{tgt}): {e}")
        return text


def search_with_confidence(query: str, k: int = 5,
                           machine_filter: str = None) -> Tuple[List[Document], float, str]:
    """RAG search with optional machine scoping and confidence scoring."""
    vectorstore = load_vectorstore()
    if vectorstore is None:
        return [], 0.0, "UNKNOWN"

    if machine_filter:
        try:
            filtered = vectorstore.similarity_search_with_score(
                query, k=k, filter={"machine": machine_filter}
            )
        except Exception:
            filtered = []
        results = filtered if filtered else vectorstore.similarity_search_with_score(query, k=k)
        tag = f"'{machine_filter}' → {len(filtered)} docs" if filtered else f"'{machine_filter}' empty → global"
        print(f"[RAG] Filter: {tag}")
    else:
        results = vectorstore.similarity_search_with_score(query, k=k)

    if not results:
        return [], 0.0, "UNKNOWN"

    docs   = [r[0] for r in results]
    scores = [r[1] for r in results]
    similarity = 1 / (1 + min(scores))
    category   = docs[0].metadata.get("category", "OPERATIONAL_PROCEDURE")
    return docs, similarity, category


def generate_answer(query: str, context_docs: List[Document],
                    respond_in_lang: str = "eng_Latn") -> str:
    """Generate safety answer via Claude in the requested language."""
    context = "\n\n".join([d.page_content for d in context_docs[:3]])
    lang_name = NLLB_TO_NAME.get(respond_in_lang, "English")
    lang_note = f" Respond in {lang_name}." if respond_in_lang != "eng_Latn" else ""

    prompt = f"""You are a heavy machinery safety expert. Answer the user's question using the provided context.{lang_note}

CRITICAL INSTRUCTION:
Begin every step with exactly one of these three emoji labels:
(✅) for normal operating steps
(⚠️) for warnings, cautions, and dangers
(⛔) for things that must NOT be done

FORMAT: one numbered step per line, emoji label at the beginning of that line.

Example:
1. (✅) Buckle your seatbelt before starting.
2. (⚠️) Keep hands away from moving parts.
3. (⛔) Do not jump from the machine.

If the context doesn't contain the answer, say "Information not found in safety manuals."

Context:
{context}

Question: {query}

Safety Answer:"""

    t0 = time.time()
    msg = get_anthropic().messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    answer = msg.content[0].text.strip()
    print(f"[CLAUDE] {time.time()-t0:.2f}s | "
          f"{msg.usage.input_tokens} in / {msg.usage.output_tokens} out tokens")
    return answer


def _pcm_to_wav(pcm: bytes, rate: int = 24000, channels: int = 1, width: int = 2) -> bytes:
    """Wrap raw PCM bytes (Gemini output) in a WAV container."""
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(width)
        wf.setframerate(rate)
        wf.writeframes(pcm)
    return buf.getvalue()


def text_to_speech(text: str, lang_code: str) -> bytes:
    """TTS via Gemini Flash. Returns WAV bytes."""
    try:
        response = get_gemini().models.generate_content(
            model=GEMINI_TTS_MODEL,
            contents=text,
            config=genai_types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=genai_types.SpeechConfig(
                    voice_config=genai_types.VoiceConfig(
                        prebuilt_voice_config=genai_types.PrebuiltVoiceConfig(voice_name="Aoede")
                    )
                ),
            ),
        )
        pcm = response.candidates[0].content.parts[0].inline_data.data
        return _pcm_to_wav(pcm)
    except Exception as e:
        print(f"[GEMINI TTS] Error: {e}")
        return None

# ============================================================================
# ROUTES
# ============================================================================

@app.route('/')
def index():
    html_path = Path(__file__).parent / 'swag_ui.html'
    if html_path.exists():
        return send_from_directory(Path(__file__).parent, 'swag_ui.html')
    return jsonify({"error": "UI file not found"}), 404


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": list(models_cache.keys()),
        "ai_stack": {
            "stt": "openai/whisper-1",
            "llm": f"anthropic/{CLAUDE_MODEL}",
            "tts": f"google/{GEMINI_TTS_MODEL}",
            "rag": "chromadb + all-MiniLM-L6-v2 (local)",
        }
    })


@app.route('/api/login', methods=['POST'])
def login():
    data    = request.json
    user_id = data.get('user_id', '').strip()
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    return jsonify({
        "success": True,
        "user_id": user_id,
        "training_count": get_user_training_count(user_id)
    })


@app.route('/api/query/text', methods=['POST'])
def query_text():
    t_total = time.time()
    data    = request.json
    text    = data.get('text', '').strip()
    user_id = data.get('user_id', 'unknown')
    lang    = data.get('language', 'eng_Latn')
    machine_filter = data.get('machine', None)

    if not text:
        return jsonify({"error": "Text query required"}), 400

    try:
        # Translate query to English for RAG if needed
        t0 = time.time()
        english_query = translate_text(text, lang, "eng_Latn") if lang != "eng_Latn" else text
        print(f"[TEXT] Query translation: {time.time()-t0:.2f}s")

        # RAG search
        t0 = time.time()
        docs, confidence, category = search_with_confidence(english_query, machine_filter=machine_filter)
        print(f"[TEXT] Vector search: {time.time()-t0:.2f}s | confidence={confidence:.3f}")

        if confidence < CONFIDENCE_THRESHOLD:
            answer   = ("⛔ STOP WORK AUTHORITY\n\n"
                        "No matching safety procedure found in the manuals.\n\n"
                        "Please consult your physical safety manual or contact your Site Safety Supervisor.")
            category = "HAZARD_WARNING"
        else:
            # Generate answer — Claude responds directly in the user's language
            t0 = time.time()
            answer = generate_answer(english_query, docs, respond_in_lang=lang)
            print(f"[TEXT] Answer generation: {time.time()-t0:.2f}s")

        log_id = log_training(user_id, lang, text, answer, category, confidence)

        # TTS
        t0 = time.time()
        audio_bytes  = text_to_speech(answer, lang)
        audio_base64 = base64.b64encode(audio_bytes).decode() if audio_bytes else None
        print(f"[TEXT] TTS: {time.time()-t0:.2f}s | total={time.time()-t_total:.2f}s")

        return jsonify({
            "success": True, "question": text, "answer": answer,
            "category": category, "confidence": confidence,
            "log_id": log_id, "audio": audio_base64
        })

    except Exception as e:
        print(f"[TEXT] FAILED after {time.time()-t_total:.2f}s: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/transcribe', methods=['POST'])
def transcribe_only():
    """STT only — no RAG, no LLM."""
    if 'audio' not in request.files:
        return jsonify({"error": "Audio file required"}), 400
    audio_file = request.files['audio']
    try:
        raw_text, detected_lang = transcribe_audio(
            audio_file.read(), filename=audio_file.filename or "audio.webm"
        )
        if not raw_text.strip():
            return jsonify({"error": "Could not understand audio"}), 400
        return jsonify({"success": True, "transcription": raw_text, "detected_language": detected_lang})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/query/voice', methods=['POST'])
def query_voice():
    t_total = time.time()
    if 'audio' not in request.files:
        return jsonify({"error": "Audio file required"}), 400

    audio_file    = request.files['audio']
    user_id       = request.form.get('user_id', 'unknown')
    target_lang   = request.form.get('language', 'eng_Latn')
    machine_filter = request.form.get('machine', None)

    try:
        # STT
        t0 = time.time()
        raw_text, detected_lang = transcribe_audio(
            audio_file.read(), filename=audio_file.filename or "audio.webm"
        )
        print(f"[VOICE] STT: {time.time()-t0:.2f}s | lang={detected_lang}")

        if not raw_text.strip():
            return jsonify({"error": "Could not understand audio"}), 400

        # Translate query to English for RAG
        t0 = time.time()
        english_query = translate_text(raw_text, detected_lang, "eng_Latn") if detected_lang != "eng_Latn" else raw_text
        print(f"[VOICE] Query translation: {time.time()-t0:.2f}s")

        # RAG search
        t0 = time.time()
        docs, confidence, category = search_with_confidence(english_query, machine_filter=machine_filter)
        print(f"[VOICE] Vector search: {time.time()-t0:.2f}s | confidence={confidence:.3f}")

        if confidence < CONFIDENCE_THRESHOLD:
            answer   = ("⛔ STOP WORK AUTHORITY\n\n"
                        "No matching safety procedure found in the manuals.\n\n"
                        "Stop current operation and consult your Site Safety Supervisor.")
            category = "HAZARD_WARNING"
        else:
            t0 = time.time()
            answer = generate_answer(english_query, docs, respond_in_lang=target_lang)
            print(f"[VOICE] Answer generation: {time.time()-t0:.2f}s")

        log_id = log_training(user_id, target_lang, raw_text, answer, category, confidence)

        # TTS
        t0 = time.time()
        audio_bytes  = text_to_speech(answer, target_lang)
        audio_base64 = base64.b64encode(audio_bytes).decode() if audio_bytes else None
        print(f"[VOICE] TTS: {time.time()-t0:.2f}s | total={time.time()-t_total:.2f}s")

        return jsonify({
            "success": True, "transcription": raw_text, "detected_language": detected_lang,
            "question": raw_text, "answer": answer, "category": category,
            "confidence": confidence, "log_id": log_id, "audio": audio_base64
        })

    except Exception as e:
        print(f"[VOICE] FAILED after {time.time()-t_total:.2f}s: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/verify/<int:log_id>', methods=['POST'])
def verify_log(log_id):
    try:
        verify_training(log_id)
        return jsonify({"success": True, "log_id": log_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/training/count/<user_id>', methods=['GET'])
def training_count(user_id):
    try:
        return jsonify({"user_id": user_id, "count": get_user_training_count(user_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/detect', methods=['POST'])
def detect_objects():
    """Image classification — local YOLO (unchanged)."""
    t_total = time.time()
    if 'image' not in request.files:
        return jsonify({"error": "Image file required"}), 400

    image_file = request.files['image']
    try:
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            image_file.save(f.name)
            temp_path = f.name

        model   = load_yolo()
        results = model.predict(temp_path, verbose=False)
        os.unlink(temp_path)

        AMBIGUITY_THRESHOLD = 0.25
        detections = []
        ambiguous  = False
        probs = results[0].probs

        if probs is not None:
            top5_idx   = probs.top5
            top5_conf  = probs.top5conf.tolist()
            names      = results[0].names

            if len(top5_conf) >= 2:
                gap       = top5_conf[0] - top5_conf[1]
                ambiguous = gap < AMBIGUITY_THRESHOLD
                print(f"[DETECT] Top-1: {names[top5_idx[0]]} ({top5_conf[0]:.3f}), "
                      f"Top-2: {names[top5_idx[1]]} ({top5_conf[1]:.3f}), gap={gap:.3f}")

            limit = 3 if ambiguous else 1
            for idx, conf in zip(top5_idx[:limit], top5_conf[:limit]):
                detections.append({"class": names[idx], "confidence": round(float(conf), 3)})

        print(f"[DETECT] Total: {time.time()-t_total:.2f}s")
        return jsonify({"success": True, "detections": detections,
                        "ambiguous": ambiguous, "count": len(detections)})

    except Exception as e:
        print(f"[DETECT] FAILED: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================================
# STARTUP
# ============================================================================

def preload_models():
    print("Preloading local models (embeddings, vectorstore, YOLO)...")
    t = time.time()
    for name, fn in [("Vectorstore", load_vectorstore), ("YOLO", load_yolo)]:
        try:
            t0 = time.time()
            fn()
            print(f"  ✓ {name} ({time.time()-t0:.2f}s)")
        except Exception as e:
            print(f"  ✗ {name}: {e}")
    print(f"Preload done in {time.time()-t:.2f}s")


if __name__ == '__main__':
    init_database()
    preload_models()
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
