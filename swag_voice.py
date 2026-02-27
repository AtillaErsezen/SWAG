#!/usr/bin/env python3
"""
SWAG VOICE TERMINAL v2.0
Safe Walk Augmented Generation - Voice-Activated Safety Intelligence

Requirements (install with pip):
    pip install pynput pyaudio wave
    pip install faster-whisper
    pip install langchain langchain-community langchain-core
    pip install chromadb sentence-transformers
    pip install ollama rich

Or run: pip install -r swag_voice_requirements.txt

MacOS Note: Grant Terminal/iTerm "Input Monitoring" permission in:
    System Settings > Privacy & Security > Input Monitoring
"""

import json
import os
import time
import sys
import wave
import threading
import tempfile
from pathlib import Path
from typing import List, Optional, Tuple, Any

# Audio
import pyaudio

# Keyboard
from pynput import keyboard

# Rich UI
from rich.console import Console
from rich.panel import Panel
from rich.live import Live
from rich.text import Text
from rich.markdown import Markdown
from rich.theme import Theme

# Whisper STT
from faster_whisper import WhisperModel

# LangChain
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# ============================================================================
# HARDCODED PATHS - SWAG Configuration
# ============================================================================
SWAG_MATRIX_PATH = "/Users/pc/polderr/output/classified/all_classified.json"
SWAG_ARCHIVES_PATH = "/Users/pc/polderr/output/markdown"
SWAG_BRAIN_PATH = "./swag_db"
TEMP_AUDIO_PATH = "swag_temp.wav"
AZERION_MODEL = "gpt-oss-20b"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
WHISPER_MODEL = "large-v3"

# Audio settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

# ============================================================================
# SWAG COLOR PALETTE
# ============================================================================
swag_theme = Theme({
    "swag.header": "bold #0057B8",
    "swag.warning": "bold #FF6700",
    "swag.success": "bold #0057B8",
    "swag.info": "#A0AAB5",
    "swag.recording": "bold red",
    "swag.critical": "bold #F0F2F5 on #FF6700",
})

console = Console(theme=swag_theme)

# ============================================================================
# GLOBAL STATE
# ============================================================================
recording = False
audio_frames: List[bytes] = []
audio_stream = None
audio_instance = None
whisper_model: Optional[WhisperModel] = None
rag_chain = None
vectorstore = None


def print_banner():
    """Display the SWAG Voice startup banner."""
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
|     SAFE WALK AUGMENTED GENERATION v2.0                                      |
|     ──────────────────────────────────────                                   |
|     Voice-Activated Safety Intelligence :: ONLINE                            |
|                                                                              |
+==============================================================================+
    """
    console.print(banner, style="swag.header")


def load_swag_matrix() -> List[Document]:
    """Load the SWAG Matrix (classified JSON rules)."""
    documents = []
    
    if not Path(SWAG_MATRIX_PATH).exists():
        console.print(f"[swag.warning][WARN] SWAG Matrix not found: {SWAG_MATRIX_PATH}[/]")
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
            metadata={
                "source": "SWAG_MATRIX",
                "type": "critical",
                "label": category,
                "machine": machine
            }
        )
        documents.append(doc)
    
    console.print(f"[swag.success][OK] SWAG Matrix: {len(documents)} critical rules loaded[/]")
    return documents


def load_swag_archives() -> List[Document]:
    """Load the SWAG Archives (markdown manuals)."""
    documents = []
    archives_path = Path(SWAG_ARCHIVES_PATH)
    
    if not archives_path.exists():
        console.print(f"[swag.warning][WARN] SWAG Archives not found: {SWAG_ARCHIVES_PATH}[/]")
        return documents
    
    md_files = list(archives_path.glob("*.md"))
    
    if not md_files:
        console.print("[swag.warning][WARN] No markdown files found in SWAG Archives[/]")
        return documents
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    for md_file in md_files:
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            chunks = splitter.split_text(content)
            
            for chunk in chunks:
                doc = Document(
                    page_content=chunk,
                    metadata={
                        "source": md_file.name,
                        "type": "manual"
                    }
                )
                documents.append(doc)
                
        except Exception as e:
            console.print(f"[swag.warning][WARN] Failed to load {md_file.name}: {e}[/]")
    
    console.print(f"[swag.success][OK] SWAG Archives: {len(documents)} chunks from {len(md_files)} manuals[/]")
    return documents


def boot_swag() -> Tuple[Optional[Chroma], Optional[WhisperModel], Optional[Any]]:
    """
    Initialize all SWAG systems:
    1. Vector database (RAG)
    2. Whisper model (STT)
    3. Azerion API LLM Client
    """
    global whisper_model, vectorstore
    
    console.print("\n[swag.info][SYS] Booting SWAG Voice Systems...[/]\n")
    boot_start = time.time()
    
    # ========== PHASE 1: Vector Database ==========
    t0 = time.time()
    console.print("[swag.info][SYS] Loading embedding model: all-MiniLM-L6-v2[/]")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
    console.print(f"[swag.info][TIME] Embedding model loaded in {time.time() - t0:.2f}s[/]")
    
    db_path = Path(SWAG_BRAIN_PATH)
    
    if db_path.exists() and any(db_path.iterdir()):
        console.print("[swag.success][OK] SWAG Brain detected. Loading existing index...[/]")
        vectorstore = Chroma(
            persist_directory=SWAG_BRAIN_PATH,
            embedding_function=embeddings
        )
        console.print(f"[swag.success][OK] SWAG Brain: {vectorstore._collection.count()} vectors loaded ({time.time() - t0:.2f}s)[/]")
    else:
        console.print("[swag.info][SYS] Building new SWAG Brain index...[/]")
        
        all_documents = []
        matrix_docs = load_swag_matrix()
        all_documents.extend(matrix_docs)
        archive_docs = load_swag_archives()
        all_documents.extend(archive_docs)
        
        if not all_documents:
            console.print("[swag.warning][WARN] No documents to index.[/]")
            return None, None, None
        
        console.print(f"[swag.info][SYS] Generating embeddings for {len(all_documents)} documents...[/]")
        
        vectorstore = Chroma.from_documents(
            documents=all_documents,
            embedding=embeddings,
            persist_directory=SWAG_BRAIN_PATH
        )
        console.print(f"[swag.success][OK] SWAG Brain indexed: {len(all_documents)} vectors ({time.time() - t0:.2f}s)[/]")
    
    # ========== PHASE 2: Whisper STT ==========
    t0 = time.time()
    console.print(f"\n[swag.info][SYS] Loading Whisper model: {WHISPER_MODEL} (this may take a moment)...[/]")
    try:
        whisper_model = WhisperModel(
            WHISPER_MODEL,
            device="cpu",
            compute_type="int8"
        )
        console.print(f"[swag.success][OK] Whisper STT engine loaded ({time.time() - t0:.2f}s)[/]")
    except Exception as e:
        console.print(f"[swag.warning][ERR] Failed to load Whisper: {e}[/]")
        return vectorstore, None, None
    
    # ========== PHASE 3: Azerion LLM ==========
    t0 = time.time()
    console.print(f"\n[swag.info][SYS] Connecting to Azerion AI ({AZERION_MODEL})...[/]")
    try:
        from openai import OpenAI
        import os
        llm_client = OpenAI(
            api_key=os.environ.get("AZERION_VEO3"),
            base_url="https://api.azerion.ai/v1"
        )
        console.print(f"[swag.success][OK] Azerion connection established ({time.time() - t0:.2f}s)[/]")
    except Exception as e:
        console.print(f"[swag.warning][ERR] Azerion connection failed: {e}[/]")
        return vectorstore, whisper_model, None
    
    console.print(f"\n[swag.info][TIME] Total boot time: {time.time() - boot_start:.2f}s[/]")
    return vectorstore, whisper_model, llm_client


def save_audio(frames: List[bytes], filename: str):
    """Save recorded audio frames to WAV file."""
    wf = wave.open(filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(2)  # 16-bit audio
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()


def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio using Whisper (The Ear)."""
    global whisper_model
    
    if whisper_model is None:
        return "[ERROR] Whisper model not loaded"
    
    console.print("[swag.info][TRANSCRIBING] Processing audio...[/]")
    
    segments, info = whisper_model.transcribe(
        audio_path,
        beam_size=5,
        language=None  # Auto-detect
    )
    
    text = " ".join([segment.text for segment in segments])
    console.print(f"[swag.info][DETECTED] Language: {info.language} | Text: {text[:50]}...[/]")
    
    return text.strip()


def refine_query(raw_text: str, llm_client) -> str:
    """Refine transcribed text using OpenAI (The Refiner)."""
    console.print("[swag.info][REFINING] Cleaning up query...[/]")
    
    prompt = f"""Fix any grammar or speech recognition errors in this heavy machinery safety question.
Correct technical terms (e.g., "hydra lick" -> "hydraulic", "ex-cavator" -> "excavator").
Output ONLY the cleaned text, nothing else.

Input: {raw_text}
Cleaned:"""
    
    response = llm_client.chat.completions.create(
        model=AZERION_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that refines technical queries."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0.1,
        stream=False
    )
    cleaned = response.choices[0].message.content.strip()
    
    # If the LLM returned too much, just use original
    if len(cleaned) > len(raw_text) * 2:
        return raw_text
    
    console.print(f"[swag.info][REFINED] {cleaned}[/]")
    return cleaned


def query_swag_brain(question: str, llm_client, retriever) -> Tuple[str, List[Document]]:
    """Query the RAG system (The Brain)."""
    console.print("[swag.info][ANALYZING] Querying SWAG protocols...[/]")
    
    source_docs = retriever.get_relevant_documents(question)
    context_str = "\n\n".join([doc.page_content for doc in source_docs])
    
    system_msg = "You are a heavy machinery safety expert. Answer the user's question safely using the provided context."
    user_msg = f"Context:\n{context_str}\n\nQuestion: {question}\n\nSafety Answer:"
    
    try:
        response = llm_client.chat.completions.create(
            model=AZERION_MODEL,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            max_tokens=1024,
            temperature=0.1,
            stream=False
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        answer = f"NEGATIVE. System error: {e}"
        source_docs = []
    
    return answer, source_docs


def format_sources(source_docs: List[Document]) -> str:
    """Format source citations."""
    sources = set()
    for doc in source_docs:
        source = doc.metadata.get("source", "Unknown")
        label = doc.metadata.get("label", "")
        doc_type = doc.metadata.get("type", "")
        
        if doc_type == "critical":
            sources.add(f"SWAG_MATRIX [{label}]")
        else:
            sources.add(source)
    
    return " | ".join(sources)


def process_voice_query(llm_client, retriever):
    """Process the recorded audio through the Holy Trinity pipeline."""
    global audio_frames
    
    if not audio_frames:
        console.print("[swag.warning][WARN] No audio recorded[/]")
        return
    
    # Save audio
    save_audio(audio_frames, TEMP_AUDIO_PATH)
    audio_frames = []
    pipeline_start = time.time()
    
    try:
        # Step A: Transcribe (The Ear)
        t0 = time.time()
        raw_text = transcribe_audio(TEMP_AUDIO_PATH)
        console.print(f"[swag.info][TIME] Transcription: {time.time() - t0:.2f}s[/]")
        
        if not raw_text or len(raw_text) < 3:
            console.print("[swag.warning][WARN] Could not transcribe audio[/]")
            return
        
        # Step B: Refine (The Refiner)
        t0 = time.time()
        cleaned_text = refine_query(raw_text, llm_client)
        console.print(f"[swag.info][TIME] Refinement: {time.time() - t0:.2f}s[/]")
        
        # Step C: Answer (The Brain)
        t0 = time.time()
        answer, source_docs = query_swag_brain(cleaned_text, llm_client, retriever)
        console.print(f"[swag.info][TIME] RAG query: {time.time() - t0:.2f}s[/]")
        
        # Check for critical content
        is_critical = any(
            "PROHIBITED" in doc.page_content.upper() or 
            "DANGER" in doc.page_content.upper() or
            "HAZARD" in doc.page_content.upper()
            for doc in source_docs
        )
        
        if is_critical and "CRITICAL" not in answer.upper():
            answer = f"[CRITICAL WARNING]\n\n{answer}"
        
        panel_style = "#FF6700" if is_critical else "#0057B8"
        
        # Display response
        console.print()
        console.print(Panel(
            Markdown(answer),
            title=f"[bold]SWAG RESPONSE[/bold] | Query: {cleaned_text[:40]}...",
            border_style=panel_style,
            padding=(1, 2)
        ))
        
        if source_docs:
            sources_text = format_sources(source_docs)
            console.print(f"[swag.info][SOURCE] {sources_text}[/]")
        
        console.print(f"[swag.info][TIME] Total pipeline: {time.time() - pipeline_start:.2f}s[/]\n")
        
    except Exception as e:
        console.print(f"[swag.warning][ERR] Processing failed: {e}[/]")
    finally:
        # Cleanup temp audio
        if Path(TEMP_AUDIO_PATH).exists():
            os.remove(TEMP_AUDIO_PATH)


def run_swag_voice():
    """Main SWAG Voice terminal loop."""
    global recording, audio_frames, audio_stream, audio_instance, rag_chain
    
    print_banner()
    
    # Boot systems
    vectorstore, whisper, llm_client = boot_swag()
    
    if vectorstore is None or whisper is None or llm_client is None:
        console.print("\n[swag.warning][ERR] SWAG Voice failed to initialize. Exiting.[/]")
        sys.exit(1)
    
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5}
    )
    
    # Initialize PyAudio
    audio_instance = pyaudio.PyAudio()
    
    console.print("\n" + "=" * 80)
    console.print("[swag.success][ONLINE] SWAG VOICE v2.0 :: FULLY OPERATIONAL[/]")
    console.print("[swag.info]Hold [SPACEBAR] to speak. Press [ESC] to exit.[/]")
    console.print("=" * 80 + "\n")
    
    def on_press(key):
        global recording, audio_frames, audio_stream
        
        if key == keyboard.Key.space and not recording:
            recording = True
            audio_frames = []
            
            console.print("[swag.recording][RECORDING] Speak now... (Release SPACE to finish)[/]")
            
            try:
                audio_stream = audio_instance.open(
                    format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK
                )
                
                # Recording thread
                def record():
                    while recording:
                        try:
                            data = audio_stream.read(CHUNK, exception_on_overflow=False)
                            audio_frames.append(data)
                        except:
                            break
                
                threading.Thread(target=record, daemon=True).start()
                
            except Exception as e:
                console.print(f"[swag.warning][ERR] Audio error: {e}[/]")
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
            
            console.print("[swag.info][PROCESSING] Analyzing voice input...[/]")
            process_voice_query(llm_client, retriever)
            console.print("[swag.info]Hold [SPACEBAR] to speak...[/]\n")
        
        if key == keyboard.Key.esc:
            console.print("\n[swag.info][SYS] SWAG Voice shutting down. Stay safe, Operator.[/]\n")
            return False
    
    # Start keyboard listener
    try:
        with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
            listener.join()
    except Exception as e:
        console.print(f"\n[swag.warning][ERR] Keyboard listener failed: {e}[/]")
        console.print("[swag.info][TIP] On MacOS, grant Input Monitoring permission:[/]")
        console.print("[swag.info]      System Settings > Privacy & Security > Input Monitoring[/]")
        console.print("[swag.info]      Add Terminal or iTerm to the list.[/]\n")
    finally:
        if audio_instance:
            audio_instance.terminate()


if __name__ == "__main__":
    run_swag_voice()
