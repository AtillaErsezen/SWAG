// ============================================================
// Site Marshall — API Service Layer
// All communication with the SWAG Flask backend goes here.
// The Vite dev server proxies /api → http://localhost:5000
// ============================================================

// Language code mapping: React short code → NLLB code (Flask backend)
export const LANG_MAP = {
    en: 'eng_Latn',
    nl: 'nld_Latn',
    fr: 'fra_Latn',
    de: 'deu_Latn',
    pl: 'pol_Latn',
    tr: 'tur_Latn',
    ro: 'ron_Latn',
    pt: 'por_Latn',
    es: 'spa_Latn',
};

/** Convert a React language code to the NLLB code the backend expects. */
export const toLang = (code) => LANG_MAP[code] ?? 'eng_Latn';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function POST(path, body) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? 'Request failed');
    }
    return res.json();
}

async function MULTIPART(path, blob, fileFieldName, fields = {}, filename = null) {
    const form = new FormData();
    form.append(fileFieldName, blob, filename ?? undefined);
    for (const [key, val] of Object.entries(fields)) {
        form.append(key, val);
    }
    const res = await fetch(path, { method: 'POST', body: form });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? 'Request failed');
    }
    return res.json();
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * Authenticate a worker and get their training count.
 * @param {string} workerId
 * @returns {{ success: boolean, user_id: string, training_count: number }}
 */
export const login = (workerId) =>
    POST('/api/login', { user_id: workerId });

/**
 * Send a text query through the RAG pipeline.
 * @returns {{ success, question, answer, category, confidence, log_id, audio }}
 */
export const queryText = (text, userId, langCode, machine = null) =>
    POST('/api/query/text', {
        text,
        user_id: userId,
        language: toLang(langCode),
        ...(machine ? { machine } : {}),
    });

/**
 * Transcribe audio to text only — no RAG, no LLM.
 * Use this to populate the text input before the user reviews and sends.
 * @param {Blob} audioBlob
 * @returns {{ success, transcription, detected_language }}
 */
export const transcribeAudio = (audioBlob) => {
    const mime = audioBlob.type.split(';')[0];
    const ext = mime.includes('webm') ? 'webm'
              : mime.includes('ogg')  ? 'ogg'
              : mime.includes('mp4')  ? 'mp4'
              : mime.includes('wav')  ? 'wav'
              : 'webm';
    return MULTIPART('/api/transcribe', audioBlob, 'audio', {}, `audio.${ext}`);
};

/**
 * Send a voice recording through the STT → RAG pipeline.
 * @param {Blob} audioBlob
 * @returns {{ success, transcription, answer, category, confidence, log_id, audio }}
 */
export const queryVoice = (audioBlob, userId, langCode, machine = null) => {
    // Derive a proper extension so the backend saves the file with the correct
    // container — Whisper relies on the extension to pick the right ffmpeg decoder.
    const mime = audioBlob.type.split(';')[0]; // strip codecs param
    const ext = mime.includes('webm') ? 'webm'
              : mime.includes('ogg')  ? 'ogg'
              : mime.includes('mp4')  ? 'mp4'
              : mime.includes('wav')  ? 'wav'
              : 'webm'; // safe default — Chrome/Edge always record webm
    return MULTIPART('/api/query/voice', audioBlob, 'audio', {
        user_id: userId,
        language: toLang(langCode),
        ...(machine ? { machine } : {}),
    }, `audio.${ext}`);
};

/**
 * Mark a training log entry as verified by the worker.
 * @param {number} logId
 * @returns {{ success: boolean, log_id: number }}
 */
export const verifyLog = (logId) =>
    POST(`/api/verify/${logId}`, {});

/**
 * Classify an image using the YOLO model.
 * @param {Blob|File} imageBlob
 * @returns {{ success, detections: [{class, confidence}], ambiguous, count }}
 */
export const detectImage = (imageBlob, userId) =>
    MULTIPART('/api/detect', imageBlob, 'image', { user_id: userId ?? 'anonymous' });

/**
 * Check if the Flask server is up.
 * @returns {{ status: string, models_loaded: string[] }}
 */
export const healthCheck = () =>
    fetch('/api/health').then(r => r.json());

// ─── Audio Utility ────────────────────────────────────────────────────────────

/**
 * Play a base64-encoded MP3 string returned by the backend.
 * @param {string|null} base64Audio
 */
export function playAudio(base64Audio) {
    if (!base64Audio) return;
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audio.play().catch(() => { /* autoplay may be blocked */ });
}

// ─── MediaRecorder Helper ─────────────────────────────────────────────────────

/**
 * Start recording from the microphone. Returns a controller object.
 * Call controller.stop() to get the recorded Blob.
 *
 * @returns {Promise<{ stop: () => Promise<Blob> }>}
 */
export async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: getSupportedMimeType() });
    const chunks = [];

    recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    });
    recorder.start();

    return {
        stop: () =>
            new Promise((resolve) => {
                recorder.addEventListener('stop', () => {
                    // Stop all mic tracks to release the indicator
                    stream.getTracks().forEach(t => t.stop());
                    resolve(new Blob(chunks, { type: recorder.mimeType }));
                });
                recorder.stop();
            }),
    };
}

function getSupportedMimeType() {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
    return candidates.find(t => MediaRecorder.isTypeSupported(t)) ?? '';
}
