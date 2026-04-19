import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraOff, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CameraViewfinder = ({ onClose }) => {
    const { t } = useAppContext();
    const videoRef   = useRef(null);
    const streamRef  = useRef(null);
    const [ready, setReady]   = useState(false);
    const [error, setError]   = useState(null);
    const [flash, setFlash]   = useState(false);

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
                        ? t('camera_perm_denied')
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
        const video  = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        streamRef.current?.getTracks().forEach(t => t.stop());
        canvas.toBlob(blob => onClose(blob), 'image/jpeg', 0.9);
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
                        <p className="text-white/50 text-sm font-mono">{t('starting_camera_dots')}</p>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <CameraOff size={40} className="text-white/30" />
                        <p className="text-white font-semibold">{error}</p>
                        <button onClick={() => onClose(null)} className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold">{t('go_back')}</button>
                    </div>
                )}
                <button onClick={() => onClose(null)} className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white">
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

export default CameraViewfinder;
