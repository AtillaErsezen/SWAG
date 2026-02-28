#!/usr/bin/env python3
"""
Initialize SWAG Vector Database
This script creates the RAG vector database from your safety documents.
"""

import json
import argparse
import shutil
from pathlib import Path
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Configuration
BASE_DIR = Path(__file__).parent
SWAG_MATRIX_PATH = BASE_DIR / "output" / "classified" / "all_classified.json"
SWAG_ARCHIVES_PATH = BASE_DIR / "output" / "markdown"
SWAG_BRAIN_PATH = BASE_DIR / "swag_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

def init_vector_db(single_file: str = None, reset: bool = False):   
    """Initialize or update vector database from safety documents."""
    print("🚀 Initializing SWAG Vector Database...")
    
    if reset and SWAG_BRAIN_PATH.exists():
        print("🗑️ Resetting existing vector database...")
        shutil.rmtree(SWAG_BRAIN_PATH)
    
    # Load embeddings model
    print(f"📥 Loading embeddings model: {EMBEDDING_MODEL}...")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"}
    )
    
    # Collect documents
    documents = []
    
    # 1. Load classified safety matrix
    if SWAG_MATRIX_PATH.exists():
        print(f"📄 Loading safety matrix from: {SWAG_MATRIX_PATH}")
        with open(SWAG_MATRIX_PATH, "r", encoding="utf-8") as f:
            matrix_data = json.load(f)
        
        for entry in matrix_data:
            machine = entry.get("machine", "UNKNOWN")
            category = entry.get("category", "UNCLASSIFIED")
            text = entry.get("original_text", "")
            
            doc = Document(
                page_content=f"MACHINE: {machine}\nLABEL: {category}\nRULE: {text}",
                metadata={
                    "source": "SWAG_MATRIX",
                    "category": category,
                    "machine": machine
                }
            )
            documents.append(doc)
        
        print(f"   ✅ Loaded {len(documents)} safety rules from matrix")
    elif not single_file:
        print(f"   ⚠️  Matrix not found at: {SWAG_MATRIX_PATH}")
    
    # 2. Load markdown safety archives
    if single_file:
        single_path = Path(single_file)
        if single_path.exists():
            print(f"📚 Loading single markdown file: {single_path}")
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            try:
                content = single_path.read_text(encoding="utf-8")
                chunks = splitter.split_text(content)
                for chunk in chunks:
                    documents.append(Document(page_content=chunk, metadata={"source": single_path.name}))
                print(f"   ✅ Loaded {len(chunks)} chunks from {single_path.name}")
            except Exception as e:
                print(f"   ⚠️  Error loading {single_path.name}: {e}")
        else:
            print(f"   ⚠️  File not found: {single_path}")
    elif SWAG_ARCHIVES_PATH.exists():
        print(f"📚 Loading markdown archives from: {SWAG_ARCHIVES_PATH}")
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        md_count = 0
        
        for md_file in SWAG_ARCHIVES_PATH.glob("*.md"):
            try:
                content = md_file.read_text(encoding="utf-8")
                chunks = splitter.split_text(content)
                
                for chunk in chunks:
                    doc = Document(
                        page_content=chunk,
                        metadata={"source": md_file.name}
                    )
                    documents.append(doc)
                
                md_count += 1
            except Exception as e:
                print(f"   ⚠️  Error loading {md_file.name}: {e}")
        
        print(f"   ✅ Loaded {md_count} markdown files")
    else:
        print(f"   ⚠️  Archives not found at: {SWAG_ARCHIVES_PATH}")
    
    # 3. Create vector database
    if documents:
        print(f"\n💾 Creating vector database with {len(documents)} documents...")
        
        # Create directory if it doesn't exist
        SWAG_BRAIN_PATH.mkdir(parents=True, exist_ok=True)
        
        vectorstore = Chroma.from_documents(
            documents,
            embeddings,
            persist_directory=str(SWAG_BRAIN_PATH)
        )
        
        print(f"   ✅ Vector database created at: {SWAG_BRAIN_PATH}")
        print(f"\n✨ SUCCESS! RAG database is ready for voice queries!")
        
        # Test query
        print("\n🧪 Testing with sample query...")
        results = vectorstore.similarity_search("excavator safety procedures", k=3)
        print(f"   Found {len(results)} relevant documents")
        if results:
            print(f"   Top result: {results[0].page_content[:100]}...")
    else:
        print("\n❌ ERROR: No documents found!")
        print("\nTo fix this, you need safety documents in one of these locations:")
        print(f"   1. Safety matrix: {SWAG_MATRIX_PATH}")
        print(f"   2. Markdown files: {SWAG_ARCHIVES_PATH}")
        print("\nPlease add safety documents and run this script again.")
        return False
    
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Initialize or update the SWAG Vector Database")
    parser.add_argument("--file", "-f", type=str, help="Add a single markdown file instead of reloading everything")
    parser.add_argument("--reset", "-r", action="store_true", help="Delete the existing database before rebuilding (prevents duplicates when reloading all)")
    args = parser.parse_args()
    
    success = init_vector_db(single_file=args.file, reset=args.reset)
    exit(0 if success else 1)
