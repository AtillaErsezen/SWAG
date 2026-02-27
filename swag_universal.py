#!/usr/bin/env python3
"""
SWAG UNIVERSAL v3.0
Safe Walk Augmented Generation - Multi-Language Safety Intelligence Terminal

Requirements:
    pip install -r swag_universal_requirements.txt

Supports 13+ languages with automatic detection and manual selection.
"""

import json
import os
import sys
import wave
import threading
from pathlib import Path
from typing import List, Optional, Tuple, Dict

# Audio
import pyaudio

# Keyboard
from pynput import keyboard

# Rich UI
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.live import Live
from rich.spinner import Spinner
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

# LangChain
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# ============================================================================
# HARDCODED PATHS
# ============================================================================
SWAG_MATRIX_PATH = "/Users/pc/polderr/output/classified/all_classified.json"
SWAG_ARCHIVES_PATH = "/Users/pc/polderr/output/markdown"
SWAG_BRAIN_PATH = "./swag_db"
SWAG_MODELS_PATH = "./swag_models"
SWAG_CONFIG_PATH = "./swag_config.json"
TEMP_AUDIO_PATH = "swag_temp.wav"
AZERION_MODEL = "gpt-oss-20b"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
WHISPER_MODEL = "large-v3"
NLLB_MODEL = "facebook/nllb-200-distilled-600M"

# Audio settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

# ============================================================================
# SUPPORTED LANGUAGES (NLLB-200 Codes)
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

# Whisper language code to NLLB mapping
WHISPER_TO_NLLB = {
    "en": "eng_Latn", "nl": "nld_Latn", "fr": "fra_Latn", "de": "deu_Latn",
    "pl": "pol_Latn", "uk": "ukr_Cyrl", "tr": "tur_Latn", "ro": "ron_Latn",
    "bg": "bul_Cyrl", "pt": "por_Latn", "hi": "hin_Deva", "es": "spa_Latn",
    "ar": "ary_Arab",
}

# UI Translations
UI_STRINGS = {
    "eng_Latn": {
        "hold_space": "Hold [SPACEBAR] to speak, type ':lang' for language menu, ':quit' to exit",
        "recording": "[RECORDING] Speak now... (Release SPACE to finish)",
        "transcribing": "Transcribing audio...",
        "translating_in": "Translating to English...",
        "refining": "Refining query...",
        "analyzing": "Analyzing safety protocols...",
        "translating_out": "Translating response...",
        "panel_title": "SWAG INTELLIGENCE",
        "source": "SOURCE",
        "language_menu": "LANGUAGE SELECTION",
        "select_lang": "Enter number to select language",
    },
    "fra_Latn": {
        "hold_space": "Maintenez [ESPACE] pour parler, tapez ':lang' pour le menu, ':quit' pour quitter",
        "recording": "[ENREGISTREMENT] Parlez maintenant... (Relâchez ESPACE pour finir)",
        "transcribing": "Transcription audio...",
        "translating_in": "Traduction vers l'anglais...",
        "refining": "Affinage de la requête...",
        "analyzing": "Analyse des protocoles de sécurité...",
        "translating_out": "Traduction de la réponse...",
        "panel_title": "INTELLIGENCE SWAG",
        "source": "SOURCE",
        "language_menu": "SÉLECTION DE LA LANGUE",
        "select_lang": "Entrez le numéro pour sélectionner la langue",
    },
}

# ============================================================================
# SWAG THEME
# ============================================================================
swag_theme = Theme({
    "swag.header": "bold #0057B8",
    "swag.warning": "bold #FF6700",
    "swag.success": "bold #0057B8",
    "swag.info": "#A0AAB5",
    "swag.recording": "bold red",
    "swag.lang": "bold cyan",
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
rag_chain = None
llm_client = None # New global for OpenAI client


def print_banner():
    """Display the SWAG Universal startup banner."""
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
|     SWAG UNIVERSAL v3.0 - MULTI-LANGUAGE EDITION                             |
|     ──────────────────────────────────────────────                           |
|     Voice-Activated Safety Intelligence :: 13+ Languages                     |
|                                                                              |
+==============================================================================+
    """
    console.print(banner, style="swag.header")


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


def get_ui_string(key: str) -> str:
    """Get UI string in current language, fallback to English."""
    if current_language in UI_STRINGS:
        return UI_STRINGS[current_language].get(key, UI_STRINGS["eng_Latn"].get(key, key))
    return UI_STRINGS["eng_Latn"].get(key, key)


def download_nllb_model():
    """Download and convert NLLB model for ctranslate2."""
    model_path = Path(SWAG_MODELS_PATH) / "nllb-200-ct2"
    
    if model_path.exists():
        return str(model_path)
    
    console.print("[swag.info][SYS] Downloading NLLB-200 translation model (first run only)...[/]")
    
    # Download from HuggingFace
    hf_model_path = snapshot_download(
        repo_id="facebook/nllb-200-distilled-600M",
        local_dir=str(Path(SWAG_MODELS_PATH) / "nllb-200-hf")
    )
    
    console.print("[swag.info][SYS] Converting model for ctranslate2...[/]")
    
    # Convert to ctranslate2 format
    os.system(f"ct2-transformers-converter --model {hf_model_path} --output_dir {model_path} --quantization int8")
    
    return str(model_path)


def load_translator():
    """Load NLLB translator."""
    global translator, tokenizer
    
    model_path = download_nllb_model()
    
    console.print(f"[swag.info][SYS] Loading NLLB-200 translator...[/]")
    
    translator = ctranslate2.Translator(model_path, device="cpu", compute_type="int8")
    
    # Load tokenizer
    tokenizer_path = Path(SWAG_MODELS_PATH) / "nllb-200-hf" / "sentencepiece.bpe.model"
    if tokenizer_path.exists():
        tokenizer = spm.SentencePieceProcessor(str(tokenizer_path))
    else:
        # Fallback: download tokenizer separately
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained(NLLB_MODEL)
    
    console.print("[swag.success][OK] NLLB-200 translator loaded[/]")


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate text using NLLB-200."""
    global translator, tokenizer
    
    if source_lang == target_lang:
        return text
    
    if translator is None:
        console.print("[swag.warning][WARN] Translator not loaded, returning original text[/]")
        return text
    
    try:
        # Tokenize
        if hasattr(tokenizer, 'encode'):
            # SentencePiece
            tokens = tokenizer.encode(text, out_type=str)
        else:
            # HuggingFace tokenizer
            tokens = tokenizer.tokenize(text)
        
        # Add language tokens
        source_prefix = [source_lang]
        target_prefix = [[target_lang]]
        
        # Translate
        results = translator.translate_batch(
            [source_prefix + tokens],
            target_prefix=target_prefix,
            beam_size=4,
            max_decoding_length=256,
        )
        
        # Decode
        output_tokens = results[0].hypotheses[0]
        
        if hasattr(tokenizer, 'decode'):
            # SentencePiece
            translated = tokenizer.decode(output_tokens)
        else:
            # HuggingFace tokenizer
            translated = tokenizer.convert_tokens_to_string(output_tokens)
        
        return translated.strip()
        
    except Exception as e:
        console.print(f"[swag.warning][WARN] Translation failed: {e}[/]")
        return text


def load_swag_matrix() -> List[Document]:
    """Load the SWAG Matrix."""
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
    """Load the SWAG Archives."""
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


def boot_swag() -> Tuple[Optional[Chroma], Optional[WhisperModel], Optional['OpenAI']]:
    """Initialize all SWAG systems."""
    global whisper_model, vectorstore, rag_chain, current_language, llm_client
    
    print_banner()
    
    # Load config
    config = load_config()
    current_language = config.get("preferred_language", "eng_Latn")
    lang_info = SUPPORTED_LANGUAGES.get(current_language, SUPPORTED_LANGUAGES["eng_Latn"])
    console.print(f"[swag.lang]Active Language: {lang_info['flag']} {lang_info['native']}[/]\n")
    
    console.print("[swag.info][SYS] Booting SWAG Universal Systems...[/]\n")
    
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
        # Test connection structure
        # Note: LangChain's ConversationalRetrievalChain expects an LLM object, not a raw client.
        # For direct client usage, the RAG chain logic needs to be re-implemented.
        # The provided diff implies direct client usage for refinement and RAG.
        console.print("[swag.success][OK] Azerion API loaded[/]")
    except Exception as e:
        console.print(f"[swag.warning][ERR] Azerion API failed: {e}[/]")
        return None, None, None # Return None for all if client fails
    
    # Create RAG chain (This part will be handled manually in process_voice_query and process_text_query)
    # The original LangChain ConversationalRetrievalChain is not directly compatible with raw OpenAI client.
    # We will use the vectorstore for retrieval and the llm_client for generation.
    
    return vectorstore, whisper_model, llm_client


def process_voice_query(llm_client_instance): # Renamed llm to llm_client_instance
    """Process voice query through the translation sandwich."""
    global audio_frames, current_language, vectorstore, llm_client
    
    if not audio_frames:
        return
    
    save_audio(audio_frames, TEMP_AUDIO_PATH)
    audio_frames = []
    
    try:
        # Step A: Transcribe
        console.print(f"[swag.info][{get_ui_string('transcribing')}][/]")
        segments, info = whisper_model.transcribe(TEMP_AUDIO_PATH, beam_size=5)
        raw_text = " ".join([s.text for s in segments]).strip()
        detected_lang = WHISPER_TO_NLLB.get(info.language, "eng_Latn")
        
        console.print(f"[swag.info]Detected: {SUPPORTED_LANGUAGES.get(detected_lang, {}).get('flag', '')} {raw_text[:50]}...[/]")
        
        if not raw_text:
            return
        
        # Step B: Inbound Translation (to English)
        if detected_lang != "eng_Latn":
            console.print(f"[swag.info][{get_ui_string('translating_in')}][/]")
            english_query = translate_text(raw_text, detected_lang, "eng_Latn")
        else:
            english_query = raw_text
        
        # Step C: Refine
        console.print(f"[swag.info][{get_ui_string('refining')}][/]")
        refine_prompt = f"Fix technical terms for heavy machinery. Output ONLY cleaned text.\nInput: {english_query}\nCleaned:"
        
        # Use llm_client for refinement
        refine_response = llm_client_instance.chat.completions.create(
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
        
        if len(refined) > len(english_query) * 2: # Simple heuristic to prevent over-refinement
            refined = english_query
        
        # Step D: RAG - Manual implementation using vectorstore and llm_client
        console.print(f"[swag.info][{get_ui_string('analyzing')}][/]")
        
        # Retrieve relevant documents
        docs = vectorstore.similarity_search(refined, k=5)
        
        # We format context simply for API consumption
        context = "\n\n".join([d.page_content for d in docs])
        system_prompt = "You are a heavy machinery safety expert. Answer the user's question using the provided context. Be concise and professional. Do not offer information not found in the context."
        user_prompt = f"Context:\n{context}\n\nQuestion: {refined}"

        response = llm_client_instance.chat.completions.create(
            model=AZERION_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1024,
            temperature=0.1,
            stream=False
        )
        english_answer = response.choices[0].message.content.strip()
        source_docs = docs # Use retrieved docs as source_docs
        
        # Step E: Outbound Translation (to user's language)
        if current_language != "eng_Latn":
            console.print(f"[swag.info][{get_ui_string('translating_out')}][/]")
            final_answer = translate_text(english_answer, "eng_Latn", current_language)
        else:
            final_answer = english_answer
        
        # Display
        is_critical = any("PROHIBITED" in d.page_content.upper() or "DANGER" in d.page_content.upper() for d in source_docs)
        panel_style = "#FF6700" if is_critical else "#0057B8"
        
        console.print()
        console.print(Panel(
            Markdown(final_answer),
            title=f"[bold]{get_ui_string('panel_title')}[/bold]",
            border_style=panel_style,
            padding=(1, 2)
        ))
        
        if source_docs:
            sources = set(d.metadata.get("source", "Unknown") for d in source_docs)
            console.print(f"[swag.info][{get_ui_string('source')}] {' | '.join(sources)}[/]\n")
        
    except Exception as e:
        console.print(f"[swag.warning][ERR] {e}[/]")
    finally:
        if Path(TEMP_AUDIO_PATH).exists():
            os.remove(TEMP_AUDIO_PATH)


def process_text_query(text: str, llm_client_instance): # Renamed llm to llm_client_instance
    """Process text query."""
    global current_language, vectorstore, llm_client
    
    try:
        # Translate to English if needed
        if current_language != "eng_Latn":
            console.print(f"[swag.info][{get_ui_string('translating_in')}][/]")
            english_query = translate_text(text, current_language, "eng_Latn")
        else:
            english_query = text
        
        # RAG - Manual implementation using vectorstore and llm_client
        console.print(f"[swag.info][{get_ui_string('analyzing')}][/]")
        
        # Retrieve relevant documents
        docs = vectorstore.similarity_search(english_query, k=5)
        
        context = "\n\n".join([d.page_content for d in docs])
        system_prompt = "You are a heavy machinery safety expert. Answer the user's question using the provided context. Be concise and professional. Do not offer information not found in the context."
        user_prompt = f"Context:\n{context}\n\nQuestion: {english_query}"

        response = llm_client_instance.chat.completions.create(
            model=AZERION_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1024,
            temperature=0.1,
            stream=False
        )
        english_answer = response.choices[0].message.content.strip()
        source_docs = docs # Use retrieved docs as source_docs
        
        # Translate back
        if current_language != "eng_Latn":
            console.print(f"[swag.info][{get_ui_string('translating_out')}][/]")
            final_answer = translate_text(english_answer, "eng_Latn", current_language)
        else:
            final_answer = english_answer
        
        # Display
        is_critical = any("PROHIBITED" in d.page_content.upper() or "DANGER" in d.page_content.upper() for d in source_docs)
        panel_style = "#FF6700" if is_critical else "#0057B8"
        
        console.print()
        console.print(Panel(
            Markdown(final_answer),
            title=f"[bold]{get_ui_string('panel_title')}[/bold]",
            border_style=panel_style,
            padding=(1, 2)
        ))
        
        if source_docs:
            sources = set(d.metadata.get("source", "Unknown") for d in source_docs)
            console.print(f"[swag.info][{get_ui_string('source')}] {' | '.join(sources)}[/]\n")
        
    except Exception as e:
        console.print(f"[swag.warning][ERR] {e}[/]")


def run_swag_universal():
    """Main SWAG Universal loop."""
    global recording, audio_frames, audio_stream, audio_instance, llm_client
    
    _, _, llm_client = boot_swag() # Unpack the tuple, assign to global llm_client
    if llm_client is None:
        sys.exit(1)
    
    audio_instance = pyaudio.PyAudio()
    
    console.print("\n" + "=" * 80)
    console.print("[swag.success][ONLINE] SWAG UNIVERSAL v3.0 :: FULLY OPERATIONAL[/]")
    console.print(f"[swag.info]{get_ui_string('hold_space')}[/]")
    console.print("=" * 80 + "\n")
    
    # Voice recording handlers
    def on_press(key):
        global recording, audio_frames, audio_stream
        
        if key == keyboard.Key.space and not recording:
            recording = True
            audio_frames = []
            console.print(f"[swag.recording]{get_ui_string('recording')}[/]")
            
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
                console.print(f"[swag.warning][ERR] Audio: {e}[/]")
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
            
            process_voice_query(llm)
            console.print(f"[swag.info]{get_ui_string('hold_space')}[/]\n")
        
        if key == keyboard.Key.esc:
            return False
    
    # Start keyboard listener in background
    listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    listener.start()
    
    # Text input loop
    try:
        while listener.is_alive():
            try:
                user_input = console.input("[swag.lang][SWAG] > [/]").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() in [":quit", ":exit", ":q"]:
                    break
                
                if user_input.lower() == ":lang":
                    show_language_menu()
                    console.print(f"[swag.info]{get_ui_string('hold_space')}[/]\n")
                    continue
                
                process_text_query(user_input, llm)
                console.print(f"[swag.info]{get_ui_string('hold_space')}[/]\n")
                
            except KeyboardInterrupt:
                break
            except EOFError:
                break
    finally:
        listener.stop()
        if audio_instance:
            audio_instance.terminate()
        console.print("\n[swag.info][SYS] SWAG Universal shutting down. Stay safe, Operator.[/]\n")


if __name__ == "__main__":
    run_swag_universal()
