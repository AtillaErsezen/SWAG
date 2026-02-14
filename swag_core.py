#!/usr/bin/env python3
"""
SWAG CORE TERMINAL v1.0
Safety Warning & Analytics Guard - Heavy Machinery Intelligence System

Requirements (install with pip):
    pip install langchain langchain-community langchain-core
    pip install chromadb sentence-transformers
    pip install rich ollama

Or run: pip install -r swag_requirements.txt
"""

import json
import os
import sys
from pathlib import Path
from typing import List, Optional

# Rich UI
from rich.console import Console
from rich.panel import Panel
from rich.spinner import Spinner
from rich.live import Live
from rich.text import Text
from rich.theme import Theme
from rich.markdown import Markdown

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
OLLAMA_MODEL = "llama3"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# ============================================================================
# SWAG COLOR PALETTE
# ============================================================================
# #F0F2F5 - Light Gray (primary text)
# #333E48 - Dark Gray (backgrounds)
# #FF6700 - Orange (warnings, critical)
# #0057B8 - Blue (info, headers)
# #A0AAB5 - Medium Gray (dim text)
# ============================================================================

swag_theme = Theme({
    "swag.header": "bold #0057B8",
    "swag.warning": "bold #FF6700",
    "swag.success": "bold #0057B8",
    "swag.info": "#A0AAB5",
    "swag.operator": "bold #FF6700",
    "swag.critical": "bold #F0F2F5 on #FF6700",
    "swag.text": "#F0F2F5",
    "swag.dim": "#A0AAB5",
})

console = Console(theme=swag_theme)

# ============================================================================
# SWAG SYSTEM PROMPT
# ============================================================================
SWAG_PERSONA = """You are SWAG (Safety Warning & Analytics Guard). You are the ultimate authority on heavy machinery safety.

**Directive 1:** If the retrieved context contains 'PROHIBITED_ACTION' or 'Danger' or 'HAZARD', prefix your answer with '[CRITICAL INTERVENTION]'.

**Directive 2:** Be concise, precise, and military-grade professional. Use bullet points for clarity.

**Directive 3:** If the answer is not in the context, reply: 'NEGATIVE. Data not found in SWAG Archives. Consult physical manual.'

**Directive 4:** Always cite the machine type and safety category when relevant.

Context from SWAG Intelligence:
{context}

Chat History:
{chat_history}

Operator Query: {question}

SWAG Response:"""


def print_banner():
    """Display the SWAG startup banner."""
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
|     SAFETY WARNING & ANALYTICS GUARD v1.0                                    |
|     ──────────────────────────────────────                                   |
|     Heavy Machinery Intelligence System :: ONLINE                            |
|                                                                              |
+==============================================================================+
    """
    console.print(banner, style="swag.header")


def load_swag_matrix() -> List[Document]:
    """
    Phase 1: Load the SWAG Matrix (classified JSON rules).
    Each entry becomes a Document with structured content.
    """
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
        
        # Create structured content
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
    """
    Phase 2: Load the SWAG Archives (markdown manuals).
    Chunks documents for better retrieval.
    """
    documents = []
    archives_path = Path(SWAG_ARCHIVES_PATH)
    
    if not archives_path.exists():
        console.print(f"[swag.warning][WARN] SWAG Archives not found: {SWAG_ARCHIVES_PATH}[/]")
        return documents
    
    md_files = list(archives_path.glob("*.md"))
    
    if not md_files:
        console.print("[swag.warning][WARN] No markdown files found in SWAG Archives[/]")
        return documents
    
    # Text splitter for chunking
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


def boot_swag_core() -> Optional[Chroma]:
    """
    Phase 3: Initialize or load the SWAG Brain (Vector DB).
    Returns the Chroma vector store.
    """
    console.print("\n[swag.info][SYS] Initializing SWAG Core Systems...[/]\n")
    
    # Initialize embeddings
    console.print("[swag.info][SYS] Loading embedding model: all-MiniLM-L6-v2[/]")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
    
    # Check if DB exists
    db_path = Path(SWAG_BRAIN_PATH)
    
    if db_path.exists() and any(db_path.iterdir()):
        console.print("[swag.success][OK] SWAG Brain detected. Loading existing index...[/]")
        vectorstore = Chroma(
            persist_directory=SWAG_BRAIN_PATH,
            embedding_function=embeddings
        )
        console.print(f"[swag.success][OK] SWAG Brain: {vectorstore._collection.count()} vectors loaded[/]")
        return vectorstore
    
    # Build new index
    console.print("[swag.info][SYS] Building new SWAG Brain index...[/]")
    
    # Load all documents
    all_documents = []
    
    with Live(Spinner("dots", text="Loading SWAG Matrix..."), console=console):
        matrix_docs = load_swag_matrix()
        all_documents.extend(matrix_docs)
    
    with Live(Spinner("dots", text="Loading SWAG Archives..."), console=console):
        archive_docs = load_swag_archives()
        all_documents.extend(archive_docs)
    
    if not all_documents:
        console.print("[swag.warning][WARN] No documents to index. SWAG Brain empty.[/]")
        return None
    
    console.print(f"\n[swag.info][SYS] Total documents: {len(all_documents)}[/]")
    console.print("[swag.info][SYS] Generating embeddings (this may take a moment)...[/]")
    
    # Create and persist vector store
    vectorstore = Chroma.from_documents(
        documents=all_documents,
        embedding=embeddings,
        persist_directory=SWAG_BRAIN_PATH
    )
    
    console.print(f"[swag.success][OK] SWAG Brain indexed: {len(all_documents)} vectors stored[/]")
    return vectorstore


def format_sources(source_docs: List[Document]) -> str:
    """Format source citations for display."""
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


def run_swag_terminal():
    """Main SWAG terminal loop."""
    
    # Print startup banner
    print_banner()
    
    # Boot SWAG Core
    vectorstore = boot_swag_core()
    
    if vectorstore is None:
        console.print("\n[swag.warning][ERR] SWAG Core failed to initialize. Exiting.[/]")
        sys.exit(1)
    
    # Initialize Ollama LLM
    console.print(f"\n[swag.info][SYS] Connecting to Ollama ({OLLAMA_MODEL})...[/]")
    
    try:
        llm = Ollama(
            model=OLLAMA_MODEL,
            temperature=0.1  # Strict Factual Mode
        )
        # Test connection
        llm.invoke("test")
        console.print("[swag.success][OK] Ollama connection established[/]")
    except Exception as e:
        console.print(f"[swag.warning][ERR] Ollama connection failed: {e}[/]")
        console.print("[swag.info][TIP] Make sure Ollama is running: ollama serve[/]")
        sys.exit(1)
    
    # Initialize conversation memory
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer"
    )
    
    # Create retrieval chain
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5}
    )
    
    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        return_source_documents=True,
        verbose=False
    )
    
    # System ready
    console.print("\n" + "=" * 80)
    console.print("[swag.success][ONLINE] SWAG SAFETY INTELLIGENCE v1.0 :: FULLY OPERATIONAL[/]")
    console.print("[swag.dim]Type 'exit' or 'quit' to terminate. Type 'clear' to reset memory.[/]")
    console.print("=" * 80 + "\n")
    
    # Main chat loop
    while True:
        try:
            # Get user input
            user_input = console.input("[swag.operator][SWAG_OPERATOR] > [/]").strip()
            
            if not user_input:
                continue
            
            # Handle commands
            if user_input.lower() in ["exit", "quit", "q"]:
                console.print("\n[swag.info][SYS] SWAG Core shutting down. Stay safe, Operator.[/]\n")
                break
            
            if user_input.lower() == "clear":
                memory.clear()
                console.print("[swag.success][OK] Conversation memory cleared.[/]\n")
                continue
            
            if user_input.lower() == "status":
                count = vectorstore._collection.count()
                console.print(f"[swag.info][STATUS] SWAG: {count} vectors indexed[/]\n")
                continue
            
            # Process query with spinner
            with Live(Spinner("dots", text="[swag.info]Decrypting Safety Protocols...[/]"), console=console):
                result = chain.invoke({"question": user_input})
            
            # Extract response and sources
            answer = result.get("answer", "NEGATIVE. System error.")
            source_docs = result.get("source_documents", [])
            
            # Check for critical content
            is_critical = any(
                "PROHIBITED" in doc.page_content.upper() or 
                "DANGER" in doc.page_content.upper() or
                "HAZARD" in doc.page_content.upper()
                for doc in source_docs
            )
            
            # Format answer panel
            if is_critical and "CRITICAL" not in answer.upper():
                answer = f"[CRITICAL INTERVENTION]\n\n{answer}"
            
            panel_style = "#FF6700" if is_critical else "#0057B8"
            
            # Display response
            console.print()
            console.print(Panel(
                Markdown(answer),
                title="[bold]SWAG INTELLIGENCE[/bold]",
                border_style=panel_style,
                padding=(1, 2)
            ))
            
            # Display sources
            if source_docs:
                sources_text = format_sources(source_docs)
                console.print(f"[swag.dim][SOURCE] {sources_text}[/dim]\n")
            
        except KeyboardInterrupt:
            console.print("\n\n[swag.info][SYS] SWAG Core interrupted. Stay safe, Operator.[/]\n")
            break
        except Exception as e:
            console.print(f"[swag.warning][ERR] System Error: {e}[/]\n")


if __name__ == "__main__":
    run_swag_terminal()
