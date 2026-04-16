import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Send, Home, Award, AlertTriangle, Settings, CameraOff, X, MicOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { startRecording, transcribeAudio, queryText, playAudio } from '../services/api';

// ─── Camera Viewfinder ────────────────────────────────────────────────────────
const CameraViewfinder = ({ onClose }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: false,
                });
                if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => { videoRef.current.play(); setReady(true); };
                }
            } catch (err) {
                if (!cancelled) setError(
                    err.name === 'NotAllowedError'
                        ? 'Camera permission denied. Please allow camera access.'
                        : `Camera unavailable: ${err.message}`
                );
            }
        })();
        return () => {
            cancelled = true;
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, []);

    const handleShutter = useCallback(() => {
        if (!videoRef.current || !ready) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        setFlash(true);
        setTimeout(() => setFlash(false), 180);
        // Stop stream then close — parent can handle the captured frame if needed
        streamRef.current?.getTracks().forEach(t => t.stop());
        onClose();
    }, [ready, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col"
        >
            {/* Video feed */}
            <div className="relative flex-1 overflow-hidden">
                <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Shutter flash */}
                <AnimatePresence>
                    {flash && (
                        <motion.div
                            initial={{ opacity: 0.85 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="absolute inset-0 bg-white z-10 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Scan brackets */}
                {ready && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-3/4 aspect-square max-w-xs">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-safety-orange" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-safety-orange" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-safety-orange" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-safety-orange" />
                            <p className="absolute -bottom-7 left-0 right-0 text-center text-white/40 text-xs tracking-widest font-mono">
                                FRAME MACHINE
                            </p>
                        </div>
                    </div>
                )}

                {/* Initialising spinner */}
                {!ready && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-10 h-10 rounded-full border-2 border-white/20 border-t-safety-orange"
                        />
                        <p className="text-white/50 text-sm font-mono">Starting camera…</p>
                    </div>
                )}

                {/* Permission error */}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <CameraOff size={40} className="text-white/30" />
                        <p className="text-white font-semibold">{error}</p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold"
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Shutter row */}
            <div className="bg-black py-6 flex items-center justify-center">
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={handleShutter}
                    disabled={!ready}
                    className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${
                        ready
                            ? 'border-safety-orange bg-white active:bg-safety-orange'
                            : 'border-white/20 bg-white/10 cursor-not-allowed'
                    }`}
                >
                    <div className={`w-14 h-14 rounded-full ${ready ? 'bg-safety-orange/20' : 'bg-white/5'}`} />
                </motion.button>
            </div>
        </motion.div>
    );
};

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { label: 'Home',     icon: Home,          path: '/scanner'  },
    { label: 'My Certs', icon: Award,         path: '/academy'  },
    { label: 'Incident', icon: AlertTriangle, path: '/incident' },
    { label: 'Settings', icon: Settings,      path: '/settings' },
];

const BottomNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <div className="flex items-center bg-white border-t border-gray-100 shrink-0">
            {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
                const active = pathname === path;
                return (
                    <button
                        key={label}
                        onClick={() => navigate(path)}
                        className="flex-1 flex flex-col items-center py-3 gap-1"
                    >
                        <Icon size={22} className={active ? 'text-safety-orange' : 'text-gray-400'} />
                        <span className={`text-xs font-semibold ${active ? 'text-safety-orange' : 'text-gray-400'}`}>
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

// ─── Recording Timer ──────────────────────────────────────────────────────────
const useRecordingTimer = (active) => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        if (!active) { setSeconds(0); return; }
        const id = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(id);
    }, [active]);
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
};

// ─── Waveform Bars ────────────────────────────────────────────────────────────
const BARS = 28;
const WaveformBars = () => (
    <div className="flex items-center gap-[3px] h-8">
        {Array.from({ length: BARS }).map((_, i) => (
            <motion.div
                key={i}
                className="w-[3px] rounded-full"
                style={{ backgroundColor: '#E67E22' }}
                animate={{ scaleY: [0.25, 1, 0.25] }}
                transition={{
                    duration: 0.8 + (i % 5) * 0.12,
                    repeat: Infinity,
                    delay: i * 0.035,
                    ease: 'easeInOut',
                }}
            />
        ))}
    </div>
);

// ─── Scanner Page ─────────────────────────────────────────────────────────────
const ScannerPage = () => {
    const { workerId, currentLang } = useAppContext();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false); // STT only
    const [isQuerying, setIsQuerying] = useState(false);         // RAG + LLM
    const [showCamera, setShowCamera] = useState(false);
    const recorderRef = useRef(null);
    const timer = useRecordingTimer(isListening);

    // Stop recording → transcribe → populate text field (no AI call yet)
    const handleRecordingStop = useCallback(async () => {
        if (!recorderRef.current) { setIsListening(false); return; }
        setIsListening(false);
        setIsTranscribing(true);
        try {
            const audioBlob = await recorderRef.current.stop();
            recorderRef.current = null;
            const res = await transcribeAudio(audioBlob);
            if (res.transcription) setQuestion(res.transcription);
        } catch (err) {
            console.error('Transcription error:', err);
        } finally {
            setIsTranscribing(false);
        }
    }, []);

    const handleMicCancel = useCallback(async () => {
        if (recorderRef.current) {
            try { await recorderRef.current.stop(); } catch (_) {}
            recorderRef.current = null;
        }
        setIsListening(false);
    }, []);

    const handleMicStart = useCallback(async () => {
        setIsListening(true);
        try {
            recorderRef.current = await startRecording();
        } catch (err) {
            console.error('Microphone access denied:', err);
            setIsListening(false);
        }
    }, []);

    // Send text to AI (called by send button in the input bar)
    const handleSend = useCallback(async () => {
        if (!question.trim()) return;
        setIsQuerying(true);
        try {
            const res = await queryText(question.trim(), workerId ?? 'anonymous', currentLang);
            if (res.answer) setAnswer(res.answer);
            if (res.audio)  playAudio(res.audio);
        } catch (err) {
            console.error('Query error:', err);
        } finally {
            setIsQuerying(false);
        }
    }, [question, workerId, currentLang]);

    const handleDismissAnswer = useCallback(() => {
        setAnswer(null);
        setQuestion('');
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0D1B2A' }}>

            {/* Camera viewfinder overlay */}
            <AnimatePresence>
                {showCamera && (
                    <CameraViewfinder onClose={() => setShowCamera(false)} />
                )}
            </AnimatePresence>

            {/* ── Answer modal overlay ── */}
            <AnimatePresence>
                {answer && (
                    <>
                        {/* Dark scrim — tap to dismiss */}
                        <motion.div
                            key="scrim"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 z-30 bg-black/70"
                            onClick={handleDismissAnswer}
                        />

                        {/* Answer card */}
                        <motion.div
                            key="answer-card"
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                            className="absolute inset-x-5 top-[12%] z-40 bg-white rounded-3xl shadow-2xl overflow-hidden"
                            style={{ maxHeight: '65vh' }}
                        >
                            {/* Card header */}
                            <div className="flex items-start justify-between px-5 pt-5 pb-3">
                                <div className="flex-1 pr-3">
                                    <p className="text-[11px] font-bold text-safety-orange tracking-widest uppercase mb-1">
                                        Safety Response
                                    </p>
                                    {question && (
                                        <p className="text-gray-500 text-sm font-medium leading-snug">
                                            {question}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleDismissAnswer}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="h-px bg-gray-100 mx-5" />

                            {/* Scrollable answer body */}
                            <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(65vh - 100px)' }}>
                                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                    {answer}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Camera placeholder (always present behind modal) ── */}
            <div className="flex-1 flex items-center justify-center">
                {isTranscribing || isQuerying ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-12 h-12 rounded-full border-2 border-white/10 border-t-safety-orange"
                        />
                        <p className="text-white/40 text-sm font-mono tracking-widest">
                            {isTranscribing ? 'TRANSCRIBING…' : 'PROCESSING…'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="relative w-56 h-44">
                        <div className="absolute top-0 left-0 w-9 h-9 border-t-[3px] border-l-[3px] border-safety-orange" />
                        <div className="absolute top-0 right-0 w-9 h-9 border-t-[3px] border-r-[3px] border-safety-orange" />
                        <div className="absolute bottom-0 left-0 w-9 h-9 border-b-[3px] border-l-[3px] border-safety-orange" />
                        <div className="absolute bottom-0 right-0 w-9 h-9 border-b-[3px] border-r-[3px] border-safety-orange" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CameraOff size={42} className="text-gray-600" />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom sheet ── */}
            <AnimatePresence mode="wait">
                {isListening ? (
                    /* ── Recording panel ── */
                    <motion.div
                        key="recording"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="bg-white rounded-t-3xl shrink-0"
                    >
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-200" />
                        </div>

                        <div className="px-5 pt-2 pb-5">
                            <div className="flex items-center gap-2 mb-4">
                                <motion.div
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                                />
                                <span className="text-red-500 font-mono font-bold text-sm tracking-widest">
                                    {timer}
                                </span>
                                <span className="text-gray-400 text-xs font-semibold ml-1">Recording…</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.88 }}
                                    onClick={handleMicCancel}
                                    className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                                >
                                    <X size={20} className="text-gray-500" />
                                </motion.button>

                                <div className="flex-1 overflow-hidden flex items-center justify-center">
                                    <WaveformBars />
                                </div>

                                {/* Stop → transcribe only */}
                                <motion.button
                                    whileTap={{ scale: 0.88 }}
                                    onClick={handleRecordingStop}
                                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                                    style={{ backgroundColor: '#E67E22' }}
                                >
                                    <Mic size={20} className="text-white" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* ── Normal input panel ── */
                    <motion.div
                        key="input"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="bg-white rounded-t-3xl shrink-0"
                    >
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-200" />
                        </div>

                        <div className="px-4 pt-3 pb-5">
                            <p className="text-xs font-bold text-safety-orange tracking-widest uppercase mb-4">
                                Ask anything about this machine
                            </p>

                            <div
                                className="flex items-center gap-2 rounded-full px-4 py-3"
                                style={{ backgroundColor: '#EEF2F7' }}
                            >
                                <input
                                    type="text"
                                    value={question}
                                    onChange={e => setQuestion(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a question…"
                                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
                                />

                                <button
                                    onClick={() => setShowCamera(true)}
                                    className="p-1 text-gray-400 hover:text-safety-orange transition-colors"
                                >
                                    <Camera size={21} />
                                </button>

                                <motion.button
                                    onClick={handleMicStart}
                                    whileTap={{ scale: 0.85 }}
                                    disabled={isTranscribing || isQuerying}
                                    className={`p-1 transition-colors ${isTranscribing || isQuerying ? 'text-safety-orange/50' : 'text-gray-400 hover:text-safety-orange'}`}
                                >
                                    <Mic size={21} />
                                </motion.button>

                                {/* Send — calls AI */}
                                <AnimatePresence>
                                    {question.trim() && !isQuerying && (
                                        <motion.button
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={handleSend}
                                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: '#E67E22' }}
                                        >
                                            <Send size={15} className="text-white translate-x-px" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Bottom Nav ── */}
            <BottomNav />
        </div>
    );
};

export default ScannerPage;
