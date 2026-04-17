import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Send, CameraOff, X, Wrench, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { machineDB } from '../data/mockData';
import { startRecording, transcribeAudio, queryText, playAudio, detectImage } from '../services/api';

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
                transition={{ duration: 0.8 + (i % 5) * 0.12, repeat: Infinity, delay: i * 0.035, ease: 'easeInOut' }}
            />
        ))}
    </div>
);

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
                        ? 'Camera permission denied.'
                        : `Camera unavailable: ${err.message}`
                );
            }
        })();
        return () => { cancelled = true; streamRef.current?.getTracks().forEach(t => t.stop()); };
    }, []);

    const handleShutter = useCallback(() => {
        if (!videoRef.current || !ready) return;
        setFlash(true);
        setTimeout(() => setFlash(false), 180);

        // Capture current frame to a canvas, then blob
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        streamRef.current?.getTracks().forEach(t => t.stop());

        canvas.toBlob((blob) => {
            onClose(blob);
        }, 'image/jpeg', 0.9);
    }, [ready, onClose]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col">
            <div className="relative flex-1 overflow-hidden">
                <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                <AnimatePresence>
                    {flash && (
                        <motion.div initial={{ opacity: 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.18 }}
                            className="absolute inset-0 bg-white z-10 pointer-events-none" />
                    )}
                </AnimatePresence>
                {ready && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-3/4 aspect-square max-w-xs">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-safety-orange" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-safety-orange" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-safety-orange" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-safety-orange" />
                        </div>
                    </div>
                )}
                {!ready && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-10 h-10 rounded-full border-2 border-white/20 border-t-safety-orange" />
                        <p className="text-white/50 text-sm font-mono">Starting camera…</p>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <CameraOff size={40} className="text-white/30" />
                        <p className="text-white font-semibold">{error}</p>
                        <button onClick={onClose} className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold">Go Back</button>
                    </div>
                )}
                <button onClick={onClose} className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white">
                    <X size={20} />
                </button>
            </div>
            <div className="bg-black py-6 flex items-center justify-center">
                <motion.button whileTap={{ scale: 0.88 }} onClick={handleShutter} disabled={!ready}
                    className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${ready ? 'border-safety-orange bg-white active:bg-safety-orange' : 'border-white/20 bg-white/10 cursor-not-allowed'}`}>
                    <div className={`w-14 h-14 rounded-full ${ready ? 'bg-safety-orange/20' : 'bg-white/5'}`} />
                </motion.button>
            </div>
        </motion.div>
    );
};

// ─── Progress Ring ────────────────────────────────────────────────────────────
const ProgressRing = ({ value }) => {
    const r = 17;
    const circ = 2 * Math.PI * r;
    const fill = Math.min(Math.max(value, 0), 100) / 100;
    const color = value === 0 ? '#2d3f52' : value < 40 ? '#ef4444' : value < 75 ? '#E67E22' : '#22c55e';
    return (
        <div className="relative w-11 h-11 shrink-0">
            <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
                <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3"
                    strokeDasharray={`${circ * fill} ${circ}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold" style={{ fontSize: 10 }}>{value}%</span>
            </div>
        </div>
    );
};

// ─── Machine matching (module-level, stable reference) ───────────────────────

const CONFIDENCE_THRESHOLD = 0.75;

const normalize = (s) =>
    (s ?? '').toLowerCase().replace(/[_\-]/g, ' ').replace(/\s+/g, ' ').trim();

const findMachine = (detectedClass) => {
    const cls = normalize(detectedClass);
    if (!cls) return null;
    const clsTokens = cls.split(' ');
    return (
        // 1. exact type match
        machineDB.find(m => normalize(m.type) === cls) ??
        // 2. type contains all detected tokens
        machineDB.find(m => clsTokens.every(t => normalize(m.type).includes(t))) ??
        // 3. detected class contains all type tokens
        machineDB.find(m => normalize(m.type).split(' ').every(t => cls.includes(t))) ??
        // 4. any single token overlap
        machineDB.find(m => clsTokens.some(t => t.length > 3 && normalize(m.type).includes(t))) ??
        // 5. model name match
        machineDB.find(m => normalize(m.model).includes(cls) || cls.includes(normalize(m.model).split(' ')[0]))
    );
};

// ─── Fleet Drawer ─────────────────────────────────────────────────────────────
const FleetDrawer = ({ open, onClose, workerId, trainingCount, navigate }) => {
    const certified = machineDB.filter(m => m.trainingProgress === 100).length;
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div key="scrim"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="absolute inset-0 z-40 bg-black/60"
                        onClick={onClose}
                    />
                    <motion.div key="drawer"
                        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
                        className="absolute top-0 left-0 bottom-0 z-50 flex flex-col w-4/5 max-w-xs"
                        style={{ backgroundColor: '#0D1B2A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        {/* Profile header */}
                        <div className="px-5 pt-10 pb-5 shrink-0">
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg shrink-0"
                                        style={{ backgroundColor: '#E67E22' }}>
                                        <span className="text-white font-bold text-lg">{trainingCount || '1'}</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-xl leading-tight">{workerId ?? 'Operator'}</p>
                                        <p className="text-white/40 text-xs mt-0.5">Operator · Site Marshall</p>
                                    </div>
                                </div>
                                <button onClick={onClose}
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                                    <X size={16} className="text-white/50" />
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-xs font-semibold px-4 py-1 rounded-full border"
                                    style={{ borderColor: '#E67E22', color: '#E67E22' }}>
                                    {certified} machine{certified !== 1 ? 's' : ''} certified
                                </span>
                            </div>
                        </div>

                        <div className="h-px mx-5 shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />

                        {/* Machine list */}
                        <div className="flex-1 overflow-y-auto px-5 pt-3">
                            <p className="text-safety-orange text-[11px] font-bold tracking-widest uppercase mb-1">
                                Your Machines
                            </p>
                            {machineDB.map((machine, i) => (
                                <motion.button key={machine.id}
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.25 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { onClose(); navigate(`/machine/${machine.id}`); }}
                                    className="w-full flex items-center gap-3 py-3.5 border-b border-white/[0.06] text-left"
                                >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: 'rgba(230,126,34,0.15)' }}>
                                        <Wrench size={17} className="text-safety-orange" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold text-sm leading-tight truncate">{machine.model}</p>
                                        <p className="text-white/35 text-xs mt-0.5">{machine.type}</p>
                                    </div>
                                    <ProgressRing value={machine.trainingProgress} />
                                </motion.button>
                            ))}
                        </div>

                        {/* Add Machine */}
                        <div className="px-5 py-4 shrink-0">
                            <motion.button whileTap={{ scale: 0.97 }}
                                className="w-full py-3.5 rounded-full border font-bold text-sm flex items-center justify-center gap-2"
                                style={{ borderColor: '#E67E22', color: '#E67E22' }}>
                                <Plus size={15} />
                                Add Machine
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ─── Scanner Page ─────────────────────────────────────────────────────────────
const ScannerPage = () => {
    const { workerId, currentLang, trainingCount } = useAppContext();
    const navigate = useNavigate();

    const [question, setQuestion]       = useState('');
    const [answer, setAnswer]           = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isQuerying, setIsQuerying]   = useState(false);
    const [showCamera, setShowCamera]   = useState(false);
    const [drawerOpen, setDrawerOpen]   = useState(false);
    const [detections, setDetections]   = useState(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const recorderRef = useRef(null);
    const timer = useRecordingTimer(isListening);

    const handleCameraClose = useCallback(async (imageBlob) => {
        setShowCamera(false);
        if (!imageBlob) return;
        setIsDetecting(true);
        try {
            const res = await detectImage(imageBlob, workerId ?? 'anonymous');
            const top = res.detections?.[0];
            if (top && (top.confidence ?? 0) >= CONFIDENCE_THRESHOLD) {
                const match = findMachine(top.class);
                if (match) { navigate(`/machine/${match.id}`); return; }
            }
            setDetections(res);
        } catch (err) {
            console.error('Detection error:', err);
            setDetections({ error: err.message });
        } finally {
            setIsDetecting(false);
        }
    }, [workerId, navigate]);

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

    const handleDismissAnswer = useCallback(() => { setAnswer(null); setQuestion(''); }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0D1B2A' }}>

            {/* Fleet drawer */}
            <FleetDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                workerId={workerId}
                trainingCount={trainingCount}
                navigate={navigate}
            />

            {/* Camera viewfinder */}
            <AnimatePresence>
                {showCamera && <CameraViewfinder onClose={handleCameraClose} />}
            </AnimatePresence>

            {/* Answer modal */}
            <AnimatePresence>
                {answer && (
                    <>
                        <motion.div key="scrim"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 z-30 bg-black/70"
                            onClick={handleDismissAnswer}
                        />
                        <motion.div key="answer-card"
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                            className="absolute inset-x-5 top-[12%] z-40 bg-white rounded-3xl shadow-2xl overflow-hidden"
                            style={{ maxHeight: '65vh' }}
                        >
                            <div className="flex items-start justify-between px-5 pt-5 pb-3">
                                <div className="flex-1 pr-3">
                                    <p className="text-[11px] font-bold text-safety-orange tracking-widest uppercase mb-1">Safety Response</p>
                                    {question && <p className="text-gray-500 text-sm font-medium leading-snug">{question}</p>}
                                </div>
                                <button onClick={handleDismissAnswer}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="h-px bg-gray-100 mx-5" />
                            <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(65vh - 100px)' }}>
                                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Detections modal */}
            <AnimatePresence>
                {detections && (
                    <>
                        <motion.div key="det-scrim"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 z-30 bg-black/70"
                            onClick={() => setDetections(null)}
                        />
                        <motion.div key="det-card"
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                            className="absolute inset-x-5 top-[12%] z-40 bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                <p className="text-[11px] font-bold text-safety-orange tracking-widest uppercase">
                                    Machine Detected
                                </p>
                                <button onClick={() => setDetections(null)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="h-px bg-gray-100 mx-5" />
                            <div className="px-5 py-4 space-y-2">
                                {detections.error ? (
                                    <p className="text-red-500 text-sm">{detections.error}</p>
                                ) : detections.detections?.length > 0 ? (
                                    <>
                                        <p className="text-xs text-gray-400 mb-3">Select the correct machine:</p>
                                        {detections.detections.slice(0, 3).map((d, i) => {
                                            const match = findMachine(d.class);
                                            const pct = Math.round((d.confidence ?? 0) * 100);
                                            const isTop = i === 0;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setDetections(null);
                                                        if (match) navigate(`/machine/${match.id}`);
                                                    }}
                                                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all active:scale-[0.98]"
                                                    style={{
                                                        borderColor: isTop ? '#E67E22' : '#e5e7eb',
                                                        backgroundColor: isTop ? '#FFF5EC' : '#f9fafb',
                                                    }}
                                                >
                                                    <div className="text-left min-w-0">
                                                        <p className="font-bold text-gray-800 text-sm truncate">{d.class}</p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {match ? match.model : 'Unknown machine'}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-black shrink-0"
                                                        style={{ color: isTop ? '#E67E22' : '#9ca3af' }}>
                                                        {pct}%
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm">No machines detected. Try again with better lighting.</p>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Hamburger ── */}
            <div className="px-4 pt-5 pb-2 shrink-0">
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex flex-col gap-[5px] p-1 -ml-1"
                    aria-label="Open fleet menu"
                >
                    <span className="block w-[22px] h-[2px] rounded-full bg-white/60" />
                    <span className="block w-[22px] h-[2px] rounded-full bg-white/60" />
                    <span className="block w-[22px] h-[2px] rounded-full bg-white/60" />
                </button>
            </div>

            {/* ── Camera placeholder / spinner ── */}
            <div className="flex-1 flex items-center justify-center">
                {isTranscribing || isQuerying || isDetecting ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-12 h-12 rounded-full border-2 border-white/10 border-t-safety-orange" />
                        <p className="text-white/40 text-sm font-mono tracking-widest">
                            {isTranscribing ? 'TRANSCRIBING…' : isDetecting ? 'DETECTING…' : 'PROCESSING…'}
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
                    <motion.div key="recording"
                        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="bg-white rounded-t-3xl shrink-0"
                    >
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-200" />
                        </div>
                        <div className="px-5 pt-2 pb-5">
                            <div className="flex items-center gap-2 mb-4">
                                <motion.div animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                                    className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span className="text-red-500 font-mono font-bold text-sm tracking-widest">{timer}</span>
                                <span className="text-gray-400 text-xs font-semibold ml-1">Recording…</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <motion.button whileTap={{ scale: 0.88 }} onClick={handleMicCancel}
                                    className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <X size={20} className="text-gray-500" />
                                </motion.button>
                                <div className="flex-1 overflow-hidden flex items-center justify-center">
                                    <WaveformBars />
                                </div>
                                <motion.button whileTap={{ scale: 0.88 }} onClick={handleRecordingStop}
                                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                                    style={{ backgroundColor: '#E67E22' }}>
                                    <Mic size={20} className="text-white" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="input"
                        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
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
                            <div className="flex items-center gap-2 rounded-full px-4 py-3" style={{ backgroundColor: '#EEF2F7' }}>
                                <input
                                    type="text"
                                    value={question}
                                    onChange={e => setQuestion(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a question…"
                                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
                                />
                                <button onClick={() => setShowCamera(true)}
                                    className="p-1 text-gray-400 hover:text-safety-orange transition-colors">
                                    <Camera size={21} />
                                </button>
                                <motion.button onClick={handleMicStart} whileTap={{ scale: 0.85 }}
                                    disabled={isTranscribing || isQuerying}
                                    className={`p-1 transition-colors ${isTranscribing || isQuerying ? 'text-safety-orange/50' : 'text-gray-400 hover:text-safety-orange'}`}>
                                    <Mic size={21} />
                                </motion.button>
                                <AnimatePresence>
                                    {question.trim() && !isQuerying && (
                                        <motion.button
                                            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}
                                            onClick={handleSend}
                                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: '#E67E22' }}>
                                            <Send size={15} className="text-white translate-x-px" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScannerPage;
