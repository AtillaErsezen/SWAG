<div align="center">

```
███████╗██╗    ██╗ █████╗  ██████╗
██╔════╝██║    ██║██╔══██╗██╔════╝
███████╗██║ █╗ ██║███████║██║  ███╗
╚════██║██║███╗██║██╔══██║██║   ██║
███████║╚███╔███╔╝██║  ██║╚██████╔╝
╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝
```

### Safe Walk Augmented Generation
**Multilingual AI safety co-pilot for heavy machinery operators**

<!-- Stack badges -->
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-RAG-FF6B35?style=for-the-badge)
![LangChain](https://img.shields.io/badge/LangChain-Pipeline-1C3C3C?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

<!-- Model badges -->
![Claude](https://img.shields.io/badge/Claude-LLM-D97706?style=for-the-badge)
![Whisper](https://img.shields.io/badge/Whisper-STT-412991?style=for-the-badge&logo=openai&logoColor=white)
![NLLB](https://img.shields.io/badge/NLLB--200-Translation-0064E0?style=for-the-badge&logo=meta&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-Detection-00FFFF?style=for-the-badge)

<!-- Status badges -->
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-9-blueviolet?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-PWA%20%7C%20API%20%7C%20CLI-orange?style=for-the-badge)

</div>

---

## What It Does

SWAG delivers real-time, context-aware safety guidance to field operators working with heavy machinery. Workers ask questions by **voice or text in their native language** and receive classified safety responses backed by a RAG pipeline over ingested safety manuals.

---

## Safety Tiers

| Tier | Symbol | Meaning |
|------|--------|---------|
| 🔴 **DANGER** | `[ !! ]` | Immediate life-threatening hazard — stop all activity |
| 🟠 **WARNING** | `[ !  ]` | Potential injury risk — proceed with caution |
| 🔵 **INSTRUCTION** | `[  i ]` | Standard operating procedure or informational guidance |

---

## Architecture

```
  [User Input]  voice / text / image
       │
       ▼
  [Whisper STT]  ──────────────────────  raw transcript
       │
       ▼
  [NLLB-200]  ────────────────────────  → English
       │
       ▼
  [ChromaDB RAG]  ─────────────────────  top-k safety chunks
       │
       ▼
  [Claude LLM]  ───────────────────────  grounded response
       │
       ▼
  [Classifier]  ───────────────────────  DANGER / WARNING / INSTRUCTION
       │
       ▼
  [NLLB-200]  ────────────────────────  → operator's language
       │
       ▼
  [gTTS + UI]  ────────────────────────  voice + text output
```
---

## Screenshots

<div align="center">

| Camera / Query | Manager Dashboard | Checklist |
|:-:|:-:|:-:|
| ![Camera](assets/kamera.jpeg) | ![Manager](assets/manager.jpeg) | ![Checklist](assets/checklist.jpeg) |

| Machine Page | Academy | Quiz |
|:-:|:-:|:-:|
| ![Machine](assets/machine_page.jpeg) | ![Academy](assets/academy.jpeg) | ![Quiz](assets/quiz.jpeg) |

| Issue Report | Register | Summary |
|:-:|:-:|:-:|
| ![Issue](assets/issue.jpeg) | ![Register](assets/register.jpeg) | ![Summary](assets/summary.jpeg) |

</div>

---

## Demo

<div align="center">

![Demo]([assets/text_cropped.mp4](https://github.com/user-attachments/assets/2af78c7d-7a59-48bc-8a67-c482fe09912b))

</div>

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **LLM** | Anthropic Claude (answers + translation) |
| **STT** | OpenAI Whisper |
| **Translation** | Meta NLLB-200 (9 languages) |
| **Embeddings** | HuggingFace sentence-transformers |
| **Vector DB** | ChromaDB (persistent) |
| **Object Detection** | YOLO via Roboflow |
| **Video Generation** | Wan 2.2 (Diffusers) |
| **TTS** | Google Gemini Flash TTS |
| **Backend** | Flask 3.0+ + LangChain |
| **Frontend** | React 19 + Tailwind CSS 4 + Vite |
| **Auth / DB** | Supabase |

---

## Quick Start

### 1 — Backend (Flask API)

```bash
pip install -r requirements.txt
python app.py
```

### 2 — Frontend (React PWA)

```bash
cd "Site Marshall"
npm install
npm run dev
```

> Both need to run together. The React frontend calls the Flask API.

### First-time setup

```bash
# Populate the vector database from safety manuals
python init_rag_db.py
```

### Environment

Copy `.env` and fill in your keys:

```
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GOOGLE_API_KEY=...
```

---

## Project Structure

```
SWAG/
├── assets/                  ← README media (screenshots + demo video)
├── pipeline/                ← classifier, director, ingestion
├── swag_db/                 ← ChromaDB vector store (persisted)
├── output/                  ← classified rules (JSON) + manuals (MD)
├── Site Marshall/           ← React + Tailwind frontend (PWA)
├── dataset/                 ← training images
├── weights/                 ← fine-tuned model weights
├── app.py                   ← Flask API entry point
└── init_rag_db.py           ← vector DB initializer
```

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

Made by [@AtillaErsezen](https://github.com/AtillaErsezen)

</div>
