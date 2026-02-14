# SWAG System Architecture Design

## Overview

**SWAG (Safe Walk Augmented Generation)** is a comprehensive AI-powered safety intelligence system for heavy machinery operations. It combines multi-modal AI (speech, text, vision) with a RAG (Retrieval-Augmented Generation) pipeline to provide multilingual safety guidance for industrial equipment operators.

---

## System Architecture Diagram

```mermaid
graph TB
    subgraph "User Interfaces"
        UI1[Web UI - HTML/JS<br/>swag_ui.html]
        UI2[Mobile PWA - Streamlit<br/>swag_app.py]
        UI3[Terminal CLI<br/>swag_core.py]
        UI4[Flask REST API<br/>app.py]
    end

    subgraph "API Layer"
        FLASK[Flask Backend<br/>Port 5000]
        ROUTES{API Routes}
    end

    subgraph "AI Pipeline - Input Processing"
        STT[Speech-to-Text<br/>OpenAI Whisper API<br/>faster-whisper local]
        TRANS[Translation<br/>NLLB-200<br/>Multi-language]
        IMG[Object Detection<br/>Roboflow API<br/>YOLO]
    end

    subgraph "RAG Intelligence Core"
        EMB[Embeddings<br/>HuggingFace<br/>all-MiniLM-L6-v2]
        VDB[(Vector Database<br/>ChromaDB<br/>swag_db/)]
        LLM[Language Model<br/>Ollama Llama3<br/>Local Inference]
        RETRIEVER[Semantic Retrieval<br/>k=5 docs<br/>confidence scoring]
    end

    subgraph "Knowledge Base"
        MATRIX[Safety Matrix<br/>JSON Rules<br/>all_classified.json]
        ARCHIVES[Safety Manuals<br/>Markdown Docs<br/>output/markdown/]
        INIT[DB Initializer<br/>init_rag_db.py]
    end

    subgraph "Safety Intelligence Pipeline"
        CLASS[Semantic Classifier<br/>classifier.py<br/>3 Categories]
        DIRECTOR[Visual Director<br/>director.py<br/>Scene Generation]
        VIDGEN[Video Generator<br/>swag_video.py<br/>Wan 2.2 / Diffusers]
    end

    subgraph "AI Pipeline - Output Processing"
        TTS[Text-to-Speech<br/>gTTS<br/>Multi-language Audio]
        PROMPT[Visual Prompts<br/>3D Scene Descriptions]
    end

    subgraph "Data Storage"
        TRAINDB[(Training Audit DB<br/>SQLite<br/>training_audit.db)]
        CACHE[Model Cache<br/>In-memory<br/>models_cache]
    end

    subgraph "User Management"
        AUTH[Login System<br/>Operator IDs]
        TRAIN[Training Tracker<br/>Verified Queries]
    end

    %% User flow connections
    UI1 --> FLASK
    UI2 --> FLASK
    UI3 --> VDB
    UI4 --> FLASK
    FLASK --> ROUTES

    %% Route handling
    ROUTES -->|/query/text| TRANS
    ROUTES -->|/query/voice| STT
    ROUTES -->|/detect| IMG
    ROUTES -->|/video/generate| CLASS
    ROUTES -->|/login| AUTH

    %% Speech processing flow
    STT --> TRANS
    IMG --> CLASS

    %% Translation to RAG
    TRANS --> EMB
    
    %% RAG pipeline
    EMB --> VDB
    VDB --> RETRIEVER
    RETRIEVER --> LLM
    LLM --> TTS
    LLM --> TRAINDB

    %% Knowledge base initialization
    MATRIX --> INIT
    ARCHIVES --> INIT
    INIT --> VDB

    %% Safety intelligence flow
    CLASS --> DIRECTOR
    DIRECTOR --> PROMPT
    PROMPT --> VIDGEN
    VIDGEN --> UI1
    VIDGEN --> UI2

    %% Training tracking
    AUTH --> TRAINDB
    TRAIN --> TRAINDB

    %% Model caching
    STT -.->|cached| CACHE
    EMB -.->|cached| CACHE
    LLM -.->|cached| CACHE
    TRANS -.->|cached| CACHE

    %% Styling
    classDef uiStyle fill:#0057B8,stroke:#333,stroke-width:2px,color:#fff
    classDef aiStyle fill:#FF6700,stroke:#333,stroke-width:2px,color:#fff
    classDef dbStyle fill:#333E48,stroke:#333,stroke-width:2px,color:#fff
    classDef pipelineStyle fill:#A0AAB5,stroke:#333,stroke-width:2px,color:#000

    class UI1,UI2,UI3,UI4 uiStyle
    class STT,TRANS,LLM,EMB,TTS,IMG aiStyle
    class VDB,TRAINDB,MATRIX,ARCHIVES dbStyle
    class CLASS,DIRECTOR,VIDGEN,RETRIEVER pipelineStyle
```

---

## Data Flow Diagrams

### 1. Voice Query Processing Flow

```mermaid
sequenceDiagram
    actor User as Operator
    participant UI as Mobile/Web UI
    participant API as Flask API
    participant Whisper as Speech-to-Text
    participant NLLB as Translator
    participant RAG as RAG Pipeline
    participant Chroma as Vector DB
    participant Llama as LLM
    participant TTS as Text-to-Speech
    participant DB as Training DB

    User->>UI: Record voice query (audio/webm)
    UI->>API: POST /query/voice {audio_bytes, user_id, lang}
    
    API->>Whisper: Transcribe audio
    Whisper-->>API: Detected text + language
    
    API->>NLLB: Translate to English
    NLLB-->>API: English query
    
    API->>RAG: Query with English text
    RAG->>Chroma: Semantic search (k=5)
    Chroma-->>RAG: Top 5 documents + scores
    
    RAG->>RAG: Calculate confidence score
    RAG->>Llama: Generate answer with context
    Llama-->>RAG: Safety guidance response
    
    RAG->>NLLB: Translate back to user language
    NLLB-->>RAG: Localized response
    
    RAG->>TTS: Convert to audio
    TTS-->>RAG: Audio bytes (mp3)
    
    RAG->>DB: Log interaction
    DB-->>RAG: log_id
    
    RAG-->>API: Response package
    API-->>UI: {answer, audio, confidence, category, log_id}
    UI-->>User: Display + Play audio
    
    User->>UI: Confirm training
    UI->>API: POST /verify/{log_id}
    API->>DB: Mark as verified
    DB-->>API: Success
    API-->>UI: Training count updated
```

### 2. Text Query Processing Flow

```mermaid
sequenceDiagram
    actor User as Operator
    participant UI as Web/Mobile UI
    participant API as Flask API
    participant NLLB as Translator
    participant Embed as Embeddings Model
    participant VDB as ChromaDB
    participant LLM as Llama3
    
    User->>UI: Type question in native language
    UI->>API: POST /query/text {question, lang, user_id}
    
    API->>NLLB: Translate to English (if not English)
    NLLB-->>API: English query
    
    API->>Embed: Generate query embedding
    Embed-->>API: Vector representation
    
    API->>VDB: Similarity search with confidence
    VDB-->>API: Top 5 docs + similarity scores
    
    API->>API: Calculate confidence<br/>(avg similarity * 100)
    
    API->>LLM: Generate answer with context
    Note over LLM: Prompt includes:<br/>- Context docs<br/>- Chat history<br/>- Operator query
    LLM-->>API: Professional safety response
    
    API->>NLLB: Translate response back
    NLLB-->>API: Localized answer
    
    API-->>UI: {answer, category, confidence, sources}
    UI-->>User: Display formatted response
```

### 3. Safety Video Generation Flow

```mermaid
sequenceDiagram
    actor User as Safety Manager
    participant UI as Web UI
    participant API as Flask API
    participant Classifier as Safety Classifier
    participant Director as Visual Director
    participant VidGen as Video Generator
    participant Diffusers as AI Video Model
    
    User->>UI: Input safety instruction text
    UI->>API: POST /video/generate {text, category, machine}
    
    API->>Classifier: Classify safety category
    Note over Classifier: Rule-based or ML<br/>DANGER/WARNING/INSTRUCTION
    Classifier-->>API: Category + confidence
    
    API->>Director: Create visual prompt
    Note over Director: Template or LLM-based<br/>3D scene description
    Director-->>API: Wan 2.2 visual prompt
    
    API->>VidGen: Generate video
    VidGen->>Diffusers: Text-to-video inference
    Note over Diffusers: Low poly 3D style<br/>Isometric view<br/>Yellow machinery
    Diffusers-->>VidGen: Video frames
    VidGen-->>API: Video file path
    
    API-->>UI: {video_url, prompt, category}
    UI-->>User: Display video preview
```

### 4. Knowledge Base Initialization Flow

```mermaid
flowchart TD
    START([Start: init_rag_db.py]) --> LOAD_EMB[Load Embeddings Model<br/>all-MiniLM-L6-v2]
    
    LOAD_EMB --> DOCS_INIT[Initialize documents list]
    
    DOCS_INIT --> MATRIX_CHECK{Safety Matrix<br/>exists?}
    MATRIX_CHECK -->|Yes| LOAD_MATRIX[Load all_classified.json]
    MATRIX_CHECK -->|No| SKIP_MATRIX[Skip matrix]
    
    LOAD_MATRIX --> PARSE_MATRIX[Parse JSON entries]
    PARSE_MATRIX --> CREATE_MATRIX_DOCS[Create Documents:<br/>MACHINE + LABEL + RULE]
    
    CREATE_MATRIX_DOCS --> ARCHIVES_CHECK{Markdown archives<br/>exist?}
    SKIP_MATRIX --> ARCHIVES_CHECK
    
    ARCHIVES_CHECK -->|Yes| LOAD_MD[Load .md files]
    ARCHIVES_CHECK -->|No| SKIP_MD[Skip archives]
    
    LOAD_MD --> SPLIT_MD[Text Splitter<br/>chunk_size=1000<br/>overlap=200]
    SPLIT_MD --> CREATE_MD_DOCS[Create chunked Documents]
    
    CREATE_MD_DOCS --> CREATE_VDB[Create ChromaDB<br/>from all documents]
    SKIP_MD --> DOC_CHECK{Documents<br/>exist?}
    
    CREATE_VDB --> PERSIST[Persist to swag_db/]
    DOC_CHECK -->|Yes| CREATE_VDB
    DOC_CHECK -->|No| ERROR[ERROR: No documents]
    
    PERSIST --> TEST[Test query:<br/>excavator safety procedures]
    TEST --> SUCCESS([SUCCESS: RAG Ready])
    ERROR --> FAIL([FAILED])
    
    style START fill:#A0AAB5
    style SUCCESS fill:#28a745,color:#fff
    style FAIL fill:#dc3545,color:#fff
    style CREATE_VDB fill:#FF6700,color:#fff
    style LOAD_EMB fill:#FF6700,color:#fff
```

---

## Component Architecture

### Core Components

#### 1. **Flask REST API** (`app.py`)
- **Purpose**: Central backend server for all SWAG interfaces
- **Port**: 5000
- **Key Routes**:
  - `GET /` - Serve HTML UI
  - `POST /login` - User authentication
  - `POST /query/text` - Text query processing
  - `POST /query/voice` - Voice query processing
  - `POST /detect` - Object detection (Roboflow)
  - `POST /video/generate` - Safety video generation
  - `POST /verify/<log_id>` - Training verification
  - `GET /training/<user_id>` - Training count
- **Features**:
  - CORS enabled for frontend
  - Lazy model loading (cached)
  - Multi-language support (9 languages)
  - Training audit logging

#### 2. **Mobile PWA** (`swag_app.py`)
- **Framework**: Streamlit
- **Purpose**: Touch-optimized mobile interface
- **Features**:
  - Large touch buttons (80px min height)
  - Voice recording with visual feedback
  - Multi-language selector
  - Training progress tracking
  - Offline PWA capabilities
  - Custom CSS with safety color palette

#### 3. **Terminal CLI** (`swag_core.py`)
- **Purpose**: Developer/admin command-line interface
- **Features**:
  - Direct RAG pipeline access
  - Chat history management
  - Source citation display
  - Military-grade professional responses
  - Color-coded terminal UI (Rich library)

#### 4. **Safety Intelligence Pipeline** (`pipeline/`)

##### a. **Classifier** (`classifier.py`)
- **Purpose**: Categorize safety sentences into 3 types
- **Categories**:
  - `DANGER` - Critical hazards, death/injury risk
  - `WARNING` - Important cautions, damage risk
  - `INSTRUCTION` - Operational procedures
- **Methods**:
  - **Rule-based**: Multi-factor sentiment analysis
    - Keyword density scoring
    - Severity assessment
    - Imperative language detection
    - Urgency and specificity bonuses
  - **ML-based**: Zero-shot classification (BART)
- **Output**: Category + confidence score

##### b. **Visual Director** (`director.py`)
- **Purpose**: Convert safety text → visual prompts for video generation
- **Methods**:
  - **Template-based**: Fast, offline, structured prompts
  - **LLM-based**: Creative prompts via Ollama
- **Style Rules**:
  - Low poly 3D Blender renders
  - Isometric view, minimalist white background
  - Yellow heavy machinery
  - Orange crash test dummies
  - Holographic UI elements
- **Output**: Wan 2.2 compatible video generation prompts

##### c. **Video Generator** (`swag_video.py`)
- **Purpose**: Generate safety training videos from prompts
- **Technology**: Diffusers library (Hugging Face)
- **Model**: Wan 2.2 text-to-video
- **Output**: MP4 safety demonstration videos

---

## AI Models & Technologies

### Speech & Audio
| Component | Model/Library | Purpose |
|-----------|---------------|---------|
| Speech-to-Text | OpenAI Whisper API (cloud)<br/>faster-whisper (local) | Transcribe operator voice queries |
| Text-to-Speech | gTTS (Google Text-to-Speech) | Generate multilingual audio responses |
| Audio Processing | PyAudio | Microphone input handling |

### Language & Translation
| Component | Model/Library | Purpose |
|-----------|---------------|---------|
| Translation | NLLB-200 (Meta) | Translate 9 languages ↔ English |
| Embeddings | all-MiniLM-L6-v2 (HuggingFace) | Convert text → 384-dim vectors |
| LLM | Llama3 (Ollama) | Generate contextual safety answers |
| Text Splitting | RecursiveCharacterTextSplitter | Chunk documents (1000 chars, 200 overlap) |

### Vision & Video
| Component | Model/Library | Purpose |
|-----------|---------------|---------|
| Object Detection | Roboflow API + YOLO | Detect machinery/hazards in images |
| Video Generation | Wan 2.2 (Diffusers) | Text-to-video for safety demonstrations |
| Classification | BART-large-mnli (HuggingFace) | Zero-shot safety categorization |

### Data Storage
| Component | Technology | Purpose |
|-----------|------------|---------|
| Vector Database | ChromaDB | Semantic similarity search for RAG |
| Training Audit | SQLite | Track user queries & verified training |
| Knowledge Base | JSON + Markdown | Safety rules and manual archives |

---

## Supported Languages

```mermaid
graph LR
    EN[English]
    DE[German - Deutsch]
    ES[Spanish - Español]
    FR[French - Français]
    IT[Italian - Italiano]
    PL[Polish - Polski]
    TR[Turkish - Türkçe]
    AR[Arabic - العربية]
    RU[Russian - Русский]
    
    subgraph "SWAG Translation Engine"
        NLLB[NLLB-200 Model]
    end
    
    EN <--> NLLB
    DE <--> NLLB
    ES <--> NLLB
    FR <--> NLLB
    IT <--> NLLB
    PL <--> NLLB
    TR <--> NLLB
    AR <--> NLLB
    RU <--> NLLB
    
    NLLB -.->|All translations<br/>via English pivot| RAG[RAG Pipeline]
```

**Translation Flow**: User Language → English → RAG → English → User Language

---

## Safety Categories & Confidence Scoring

### Category Definitions

```mermaid
graph TD
    INPUT[Safety Sentence] --> CLASS{Classifier}
    
    CLASS -->|High severity<br/>Death/injury keywords| DANGER[🔴 DANGER<br/>Critical hazards]
    CLASS -->|Medium severity<br/>Warning keywords| WARNING[🟠 WARNING<br/>Important cautions]
    CLASS -->|Low severity<br/>Procedural keywords| INSTRUCTION[🔵 INSTRUCTION<br/>Operational steps]
    
    DANGER --> CONF1[Confidence Score<br/>0.0 - 1.0]
    WARNING --> CONF2[Confidence Score<br/>0.0 - 1.0]
    INSTRUCTION --> CONF3[Confidence Score<br/>0.0 - 1.0]
    
    CONF1 --> THRESHOLD{Score ≥ 0.4?}
    CONF2 --> THRESHOLD
    CONF3 --> THRESHOLD
    
    THRESHOLD -->|Yes| ACCEPT[✅ Accept Response<br/>Show to operator]
    THRESHOLD -->|No| REJECT[⚠️ Low Confidence<br/>Suggest manual check]
    
    style DANGER fill:#dc3545,color:#fff
    style WARNING fill:#FF6700,color:#fff
    style INSTRUCTION fill:#0057B8,color:#fff
    style ACCEPT fill:#28a745,color:#fff
    style REJECT fill:#ffc107,color:#000
```

### Confidence Calculation

**Rule-Based Classifier**:
```
confidence = weighted_average(
    keyword_density,      # 40% weight
    severity_score,       # 30% weight
    imperative_score      # 30% weight
) + urgency_bonus + specificity_bonus
```

**RAG Pipeline**:
```
confidence = average(top_5_similarity_scores) * 100
threshold = 0.4 (40%)
```

---

## Technology Stack Summary

### Backend
- **Python 3.x**
- **Flask 3.0+** - REST API server
- **Streamlit 1.30+** - Mobile PWA framework
- **SQLite** - Training audit database

### AI/ML Libraries
- **LangChain 0.1+** - RAG orchestration framework
- **ChromaDB 0.4+** - Vector database
- **Transformers 4.40+** - HuggingFace models
- **faster-whisper 1.0+** - Local STT
- **Ollama 0.2+** - Local LLM inference
- **sentence-transformers 2.6+** - Embeddings
- **Diffusers** - Video generation

### Frontend
- **HTML5/CSS3/JavaScript** - Web UI
- **Web Audio API** - Audio recording/playback
- **Fetch API** - REST client

### DevOps
- **PyTorch 2.2+** (CPU optimized)
- **NumPy** - Numerical computing
- **Rich** - Terminal UI formatting
- **tqdm** - Progress bars

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Cloud/Server Deployment"
        FLASK_PROD[Flask App<br/>Gunicorn/uWSGI<br/>Port 5000]
        OLLAMA_SERV[Ollama Server<br/>Port 11434]
        CHROMA_DB[(ChromaDB<br/>Persistent Storage)]
        SQLITE_DB[(SQLite<br/>training_audit.db)]
    end
    
    subgraph "External APIs"
        OPENAI[OpenAI Whisper API<br/>Speech-to-Text]
        ROBOFLOW[Roboflow API<br/>Object Detection]
    end
    
    subgraph "Client Devices"
        BROWSER[Web Browser<br/>Desktop/Mobile]
        PWA[PWA App<br/>Installed Mobile]
        CLI[Terminal CLI<br/>Admin/Dev]
    end
    
    BROWSER --> FLASK_PROD
    PWA --> FLASK_PROD
    CLI --> CHROMA_DB
    
    FLASK_PROD --> OLLAMA_SERV
    FLASK_PROD --> CHROMA_DB
    FLASK_PROD --> SQLITE_DB
    FLASK_PROD --> OPENAI
    FLASK_PROD --> ROBOFLOW
    
    style FLASK_PROD fill:#0057B8,color:#fff
    style OLLAMA_SERV fill:#FF6700,color:#fff
    style CHROMA_DB fill:#333E48,color:#fff
    style SQLITE_DB fill:#333E48,color:#fff
```

---

## Design Patterns & Principles

### 1. **Lazy Loading Pattern**
- Models loaded on first request, then cached
- Reduces startup time
- Optimizes memory usage

### 2. **Multi-Modal Interface**
- Single backend serving multiple frontends
- Consistent API across CLI, Web, Mobile
- Shared business logic

### 3. **RAG Pipeline**
- Retrieval: ChromaDB semantic search
- Augmentation: Context injection into prompts
- Generation: Llama3 with grounded responses

### 4. **Confidence-Based Responses**
- All answers include confidence scores
- Threshold filtering (40%)
- User verification for low-confidence queries

### 5. **Training Feedback Loop**
- Operators verify responses
- Logged interactions improve system
- Gamification (training count tracking)

### 6. **Multilingual First**
- Translation at boundaries (input/output)
- English as internal processing language
- Consistent experience across languages

---

## File Structure

```
SWAG/
├── app.py                      # Flask REST API (main backend)
├── swag_app.py                 # Streamlit Mobile PWA
├── swag_core.py                # Terminal CLI
├── swag_ui.html                # Web UI (66KB single file)
├── init_rag_db.py              # Vector DB initializer
├── requirements.txt            # Python dependencies
├── training_audit.db           # SQLite database
│
├── pipeline/                   # Safety Intelligence Pipeline
│   ├── __init__.py
│   ├── classifier.py           # Category classification
│   ├── director.py             # Visual prompt generation
│   ├── ingestion.py            # Document processing
│   └── main.py                 # Pipeline orchestration
│
├── output/                     # Generated data
│   ├── classified/
│   │   └── all_classified.json # Categorized safety rules
│   └── markdown/               # Safety manual archives
│
└── swag_db/                    # ChromaDB vector database
    └── [vector data]
```

---

## Security & Privacy

### Data Handling
- **Local Processing**: Most AI runs on local hardware (Ollama, Whisper)
- **Cloud APIs**: OpenAI Whisper (optional), Roboflow (images only)
- **No PII Storage**: User IDs are pseudonymous operator codes
- **Audit Trail**: All queries logged for compliance

### Authentication
- Simple operator ID login (no passwords)
- Session-based tracking
- Training verification system

---

## Performance Considerations

### Optimization Strategies
1. **Model Caching**: In-memory storage of loaded models
2. **CPU-Optimized PyTorch**: Uses CPU wheel for smaller footprint
3. **Lazy Loading**: Models loaded only when needed
4. **Batch Processing**: Classifier supports batch inference
5. **Chunking**: Documents split for efficient retrieval
6. **Index Persistence**: ChromaDB persists to disk

### Resource Requirements
- **RAM**: 8GB+ recommended (models in memory)
- **Storage**: 5GB+ (models + vector DB)
- **CPU**: Multi-core for faster inference
- **GPU**: Optional (significantly speeds up video generation)

---

## Future Enhancements

### Planned Features
- [ ] Fine-tuned safety classification model (SetFit)
- [ ] Real-time video object detection
- [ ] Offline mode (full local processing)
- [ ] Multi-user authentication system
- [ ] Advanced analytics dashboard
- [ ] Integration with machinery IoT sensors
- [ ] AR overlay for safety instructions

---

## Color Palette (Brand Identity)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Concrete Mist | `#F0F2F5` | Backgrounds, light surfaces |
| Carbon Steel | `#333E48` | Dark backgrounds, text |
| Safety Orange | `#FF6700` | Warnings, CTAs, highlights |
| Trust Cobalt | `#0057B8` | Primary actions, links |
| Brushed Aluminum | `#A0AAB5` | Secondary elements, borders |

---

## Conclusion

SWAG is a production-ready, enterprise-grade safety intelligence system that combines:
- **Multi-modal AI** (voice, text, vision)
- **Multilingual support** (9 languages)
- **Context-aware responses** (RAG pipeline)
- **Safety-focused design** (confidence scoring, categorization)
- **Flexible deployment** (API, PWA, CLI, Web)

The architecture is modular, scalable, and designed for industrial environments where accuracy and reliability are critical.
