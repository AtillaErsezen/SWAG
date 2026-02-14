# SWAG Flask API

Safe Walk Augmented Generation - Flask Backend API

## Overview

This Flask application provides a RESTful API for the SWAG safety intelligence system, featuring:

- **Voice & Text Queries**: Process safety questions via voice or text
- **Multi-language Support**: Translation for 9 languages
- **AI Pipeline**: Whisper STT → NLLB Translation → RAG (ChromaDB) → Llama3 LLM
- **Text-to-Speech**: Audio responses in user's language
- **Training Audit**: SQLite database tracking verified training sessions

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure Ollama is running with llama3 model:
```bash
ollama pull llama3
ollama serve
```

3. Place your safety documents in the configured paths (see Configuration section)

## Running the Application

### Development Mode
```bash
python app.py
```

### Production Mode
```bash
flask run --host=0.0.0.0 --port=5000
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and loaded models.

### User Login
```
POST /api/login
Content-Type: application/json

{
  "user_id": "OP-1234"
}
```

### Text Query
```
POST /api/query/text
Content-Type: application/json

{
  "text": "What is the safe distance from excavator swing radius?",
  "user_id": "OP-1234",
  "language": "eng_Latn"
}
```

Returns:
```json
{
  "success": true,
  "question": "What is the safe distance...",
  "answer": "The minimum safe distance...",
  "category": "OPERATIONAL_PROCEDURE",
  "confidence": 0.87,
  "log_id": 123,
  "audio": "base64_encoded_audio"
}
```

### Voice Query
```
POST /api/query/voice
Content-Type: multipart/form-data

audio: <audio_file.wav>
user_id: "OP-1234"
language: "eng_Latn"
```

Returns same structure as text query plus:
```json
{
  "transcription": "What is the safe distance...",
  "detected_language": "eng_Latn"
}
```

### Verify Training
```
POST /api/verify/<log_id>
```

Marks a training log entry as verified.

### Get Training Count
```
GET /api/training/count/<user_id>
```

Returns the number of verified training sessions for a user.

## Configuration

Edit the following constants in `app.py`:

```python
SWAG_MATRIX_PATH = "/path/to/classified/all_classified.json"
SWAG_ARCHIVES_PATH = "/path/to/markdown"
SWAG_BRAIN_PATH = "./swag_db"
SWAG_MODELS_PATH = "./swag_models"
TRAINING_DB_PATH = "./training_audit.db"
OLLAMA_MODEL = "llama3"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
WHISPER_MODEL = "large-v3"
CONFIDENCE_THRESHOLD = 0.4
```

## Supported Languages

- English (EN)
- Dutch (NL)
- French (FR)
- German (DE)
- Polish (PL)
- Turkish (TR)
- Romanian (RO)
- Portuguese (PT)
- Spanish (ES)

## Frontend Integration

The API serves `swag_ui.html` at the root URL. To integrate with the HTML frontend:

1. Ensure `swag_ui.html` is in the same directory as `app.py`
2. Update the HTML to make API calls to the endpoints above
3. Handle audio recording in the browser using Web Audio API

## Model Loading

Models are lazy-loaded on first request to reduce startup time:

- **Whisper**: Loaded on first audio transcription
- **NLLB Translator**: Loaded on first translation request
- **Embeddings**: Loaded when building/accessing vector store
- **ChromaDB**: Loaded on first similarity search
- **Llama3**: Loaded on first answer generation

## Database Schema

Training logs are stored in SQLite:

```sql
CREATE TABLE training_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    user_id TEXT NOT NULL,
    language TEXT,
    question TEXT,
    answer TEXT,
    category TEXT,
    confidence_score REAL,
    verified INTEGER DEFAULT 0,
    verified_at TEXT
)
```

## Error Handling

All endpoints return JSON error messages:

```json
{
  "error": "Error description"
}
```

HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters)
- `404`: Resource not found
- `500`: Server error

## CORS

CORS is enabled by default to allow frontend applications from different origins.

## Production Deployment

For production deployment, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## License

Internal use only - Heavy machinery safety training system
