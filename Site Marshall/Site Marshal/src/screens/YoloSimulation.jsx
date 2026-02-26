import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { machineDB } from '../data/mockData';
import { AlertTriangle, Upload, RefreshCw, Camera, X, ZapIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { detectImage } from '../services/api';

// No hardcoded detections. Only real API results will be displayed.

// ─────────────────────────────────────────────────────────────────────────────
// Camera Viewfinder Overlay
// Uses getUserMedia for cross-platform camera access (desktop + mobile).
// ─────────────────────────────────────────────────────────────────────────────
const CameraViewfinder = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [camError, setCamError] = useState(null);
    const [shutterFlash, setShutterFlash] = useState(false);

    // Start the camera stream when the overlay mounts
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
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setReady(true);
                    };
                }
            } catch (err) {
                if (!cancelled) setCamError(err.name === 'NotAllowedError'
                    ? 'Camera permission denied. Please allow camera access and try again.'
                    : `Camera unavailable: ${err.message}`);
            }
        })();
        return () => {
            cancelled = true;
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, []);

    // Capture current video frame → Blob → hand off to parent
    const handleShutter = useCallback(() => {
        if (!videoRef.current || !ready) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        // Shutter flash animation
        setShutterFlash(true);
        setTimeout(() => setShutterFlash(false), 200);

        canvas.toBlob((blob) => {
            // Stop the camera stream before handing off
            streamRef.current?.getTracks().forEach(t => t.stop());
            onCapture(blob);
        }, 'image/jpeg', 0.92);
    }, [ready, onCapture]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col"
        >
            {/* Live video feed */}
            <div className="relative flex-1 overflow-hidden">
                <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Shutter flash */}
                <AnimatePresence>
                    {shutterFlash && (
                        <motion.div
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-white z-10 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Corner guides — YOLO scanner feel */}
                {ready && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-3/4 aspect-square max-w-sm">
                            {/* Top-left */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-electric-cyan" />
                            {/* Top-right */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-electric-cyan" />
                            {/* Bottom-left */}
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-electric-cyan" />
                            {/* Bottom-right */}
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-electric-cyan" />
                            <p className="absolute -bottom-8 left-0 right-0 text-center text-white/50 text-xs font-mono tracking-widest">
                                FRAME MACHINE
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading spinner while camera initialises */}
                {!ready && !camError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-10 h-10 rounded-full border-2 border-white/20 border-t-electric-cyan"
                        />
                        <p className="text-white/50 text-sm font-mono">Starting camera…</p>
                    </div>
                )}

                {/* Permission / error message */}
                {camError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <Camera size={40} className="text-white/30" />
                        <p className="text-white font-bold">{camError}</p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold"
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {/* Status bar overlay */}
                <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-black/50">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${ready ? 'bg-electric-cyan animate-pulse' : 'bg-white/30'}`} />
                        <span className="text-white text-xs font-mono tracking-wider">
                            {ready ? 'LIVE' : 'INIT'}
                        </span>
                    </div>
                    <span className="text-white/40 text-xs font-mono">MARSHALL CV</span>
                </div>
            </div>

            {/* Controls row */}
            <div className="flex-none bg-black py-6 flex items-center justify-between px-10">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
                >
                    <X size={24} />
                </button>

                {/* Shutter */}
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={handleShutter}
                    disabled={!ready}
                    className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${ready
                        ? 'border-electric-cyan bg-white shadow-[0_0_20px_rgba(0,200,200,0.4)] active:bg-electric-cyan'
                        : 'border-white/20 bg-white/10 cursor-not-allowed'
                        }`}
                >
                    <div className={`w-14 h-14 rounded-full ${ready ? 'bg-electric-cyan/20' : 'bg-white/5'}`} />
                </motion.button>

                {/* Spacer to balance layout */}
                <div className="w-14 h-14" />
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
const YoloSimulation = () => {
    const [phase, setPhase] = useState('idle'); // idle -> scanning -> detected -> results
    const [showCamera, setShowCamera] = useState(false);
    const [proximityAlert, setProximityAlert] = useState(false);
    const [detectedBoxes, setDetectedBoxes] = useState([]);
    const [frameCount, setFrameCount] = useState(0);
    const [detections, setDetections] = useState([]);
    const [isAmbiguous, setIsAmbiguous] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const frameIntervalRef = useRef(null);

    const navigate = useNavigate();
    const { setActiveMachineId, workerId } = useAppContext();

    // Cleanup on unmount
    useEffect(() => () => {
        clearInterval(frameIntervalRef.current);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, []);

    // ─── Start Scan Flow ───────────────────────────────────────────────────────
    const startScan = async (fileOrBlob) => {
        setError(null);
        setDetections([]);
        setDetectedBoxes([]);
        setIsAmbiguous(false);
        setShowCamera(false);

        // Show image preview
        const url = URL.createObjectURL(fileOrBlob);
        setPreviewUrl(url);

        // Begin frame counter
        setPhase('scanning');
        frameIntervalRef.current = setInterval(() => setFrameCount(prev => prev + 1), 33);

        try {
            // Real API call — runs concurrently with the animation
            const res = await detectImage(fileOrBlob, workerId ?? 'anonymous');

            // Wait until at least 3.2s of "scanning" animation before showing results
            setTimeout(() => {
                clearInterval(frameIntervalRef.current);
                setPhase('detected');

                if (res.success && res.detections?.length > 0) {
                    setDetections(res.detections);
                    setIsAmbiguous(res.ambiguous ?? false);

                    // Specific logic: if 'person' is found with high confidence, show proximity alert
                    const hasPerson = res.detections.some(d => d.class.toLowerCase() === 'person' && d.confidence > 0.8);
                    if (hasPerson) {
                        setProximityAlert(true);
                        setTimeout(() => setProximityAlert(false), 3000);
                    }
                } else {
                    setDetections([]);
                }
                setTimeout(() => setPhase('results'), 700);
            }, 3200);

        } catch (err) {
            clearInterval(frameIntervalRef.current);
            setError('Backend unavailable');
            setTimeout(() => {
                setPhase('idle');
            }, 2000);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) startScan(file);
        // Reset so the same file can be selected again
        e.target.value = '';
    };

    const handleReset = () => {
        setPhase('idle');
        setDetections([]);
        setDetectedBoxes([]);
        setPreviewUrl(null);
        setError(null);
        setFrameCount(0);
    };

    // ─── Machine Selection ─────────────────────────────────────────────────────
    // Each machine id IS the YOLO class name — navigate directly, no lookup needed.
    const handleSelect = (classLabel) => {
        setActiveMachineId(classLabel);
        navigate(`/machine/${classLabel}`);
    };

    // ─── Background ───────────────────────────────────────────────────────────
    const bgStyle = previewUrl
        ? { backgroundImage: `url('${previewUrl}')`, filter: 'brightness(0.85) saturate(0.9)' }
        : {
            backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200')`,
            filter: 'brightness(0.5) saturate(0.6)',
        };

    return (
        <div className="flex flex-col h-full bg-[#111] absolute inset-0 overflow-hidden">

            {/* Camera Feed */}
            <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={bgStyle} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

            {/* Top Status Bar */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${phase === 'scanning' ? 'bg-electric-cyan animate-pulse' : phase === 'idle' ? 'bg-white/40' : 'bg-sage-green'}`} />
                    <span className="text-white text-xs font-mono tracking-wider">
                        {phase === 'idle' ? 'WAITING FOR IMAGE' : phase === 'scanning' ? 'DETECTING...' : 'DETECTION COMPLETE'}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/60 tracking-wider">
                    <span>MARSHALL CV v3.1</span>
                    {phase !== 'idle' && <span>{frameCount} frames</span>}
                    {error && <span className="text-safety-orange">OFFLINE MODE</span>}
                </div>
            </div>

            {/* Model Info */}
            <div className="absolute bottom-4 left-4 z-20 text-[9px] font-mono text-white/40 leading-relaxed tracking-wider">
                <div>model: yolov8x-construction</div>
                <div>conf_threshold: 0.50</div>
                <div>nms_iou: 0.45</div>
                <div>classes: 12</div>
            </div>

            {/* Bounding Boxes Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Dynamic detections from API */}
                {detections.map((det, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === 'detected' || phase === 'results' ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute"
                        style={{
                            // Anchor main detection in center, spread others? 
                            // Since API doesn't provide coords, we use this styled placeholder spot for the top match
                            left: i === 0 ? '20%' : '10%',
                            top: i === 0 ? '18%' : `${30 + i * 15}%`,
                            width: i === 0 ? '55%' : '20%',
                            height: i === 0 ? '55%' : '15%'
                        }}
                    >
                        <div className="absolute inset-0 border-2" style={{ borderColor: i === 0 ? '#00e5ff' : '#E67E22' }} />
                        <div
                            className="absolute -top-6 left-0 text-[11px] font-mono font-bold px-2 py-0.5"
                            style={{ backgroundColor: i === 0 ? '#00e5ff' : '#E67E22', color: '#000' }}
                        >
                            {det.class} {(det.confidence * 100).toFixed(0)}%
                        </div>
                    </motion.div>
                ))}

                {/* Scanning sweep line */}
                {phase === 'scanning' && (
                    <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                        className="absolute left-0 right-0 h-[1px] bg-white/30"
                    />
                )}
            </div>

            {/* Proximity Alert */}
            <AnimatePresence>
                {proximityAlert && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-[55] pointer-events-none flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-rust-red/20 animate-pulse" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-black/90 px-6 py-4 rounded-lg border border-rust-red/80 flex items-center gap-3 z-10"
                        >
                            <AlertTriangle size={28} className="text-rust-red" />
                            <div>
                                <div className="text-rust-red font-bold text-sm font-mono tracking-wider">PROXIMITY ALERT</div>
                                <div className="text-white/50 text-[10px] font-mono">person detected in swing radius -- 2.3m</div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* IDLE STATE — Two button prompt */}
            <AnimatePresence>
                {phase === 'idle' && !showCamera && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 gap-6"
                    >
                        <div className="text-center">
                            <p className="text-white/60 font-mono text-xs tracking-widest uppercase mb-2">MARSHALL CV</p>
                            <h2 className="text-white font-black text-2xl">Identify a Machine</h2>
                            <p className="text-white/50 text-sm mt-1">Take a photo or select one from your library</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                            {/* Take Photo — uses getUserMedia viewfinder */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowCamera(true)}
                                className="flex-1 flex flex-col items-center gap-3 bg-electric-cyan text-black font-black text-base px-6 py-5 rounded-2xl shadow-lg hover:brightness-110 transition-all"
                            >
                                <Camera size={32} />
                                TAKE PHOTO
                            </motion.button>

                            {/* Upload from library */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex flex-col items-center gap-3 bg-white/10 border border-white/20 text-white font-black text-base px-6 py-5 rounded-2xl hover:bg-white/20 transition-all"
                            >
                                <Upload size={32} />
                                UPLOAD
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Library file input (no capture attribute — opens file picker) */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Camera Viewfinder Overlay */}
            <AnimatePresence>
                {showCamera && (
                    <CameraViewfinder
                        onCapture={(blob) => startScan(blob)}
                        onClose={() => setShowCamera(false)}
                    />
                )}
            </AnimatePresence>

            {/* Results Panel */}
            <AnimatePresence>
                {phase === 'results' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                        className="absolute bottom-0 inset-x-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-30 pb-8"
                    >
                        <div className="p-4 pb-2">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sage-green" />
                                    <span className="text-white/60 text-[10px] font-mono tracking-widest uppercase">
                                        {isAmbiguous ? 'MULTIPLE MATCHES — select one' : `${detections.length} match${detections.length !== 1 ? 'es' : ''} — tap to open`}
                                    </span>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="text-white/40 hover:text-white p-1 transition-colors"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-52 overflow-y-auto">
                                {detections.map((det, idx) => {
                                    // Machine id === YOLO class name, direct lookup
                                    const machine = machineDB.find(m => m.id === det.class) ?? null;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(det.class)}
                                            className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-electric-cyan/50 hover:bg-white/5 transition-all active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded bg-cover bg-center flex-shrink-0"
                                                    style={{ backgroundImage: `url(${machine?.image})` }}
                                                />
                                                <div className="text-left">
                                                    <div className="text-white font-medium text-sm">
                                                        {machine ? machine.model : det.class}
                                                    </div>
                                                    <div className="text-white/40 text-[10px] font-mono">
                                                        {machine ? machine.type : 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${det.confidence > 0.85 ? 'bg-sage-green' : det.confidence > 0.7 ? 'bg-electric-cyan' : 'bg-safety-orange'}`}
                                                        style={{ width: `${(det.confidence ?? 0.75) * 100}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-mono font-bold ${det.confidence > 0.85 ? 'text-sage-green' : det.confidence > 0.7 ? 'text-electric-cyan' : 'text-safety-orange'}`}>
                                                    {((det.confidence ?? 0.75) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default YoloSimulation;
