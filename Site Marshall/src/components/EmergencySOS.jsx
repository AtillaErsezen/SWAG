import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, MapPin, Radio } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const EmergencySOS = () => {
    const { t } = useAppContext();
    const [isHolding, setIsHolding] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [triggered, setTriggered] = useState(false);
    const [intervalRef, setIntervalRef] = useState(null);

    const startHold = () => {
        setIsHolding(true);
        setHoldProgress(0);
        let progress = 0;
        const id = setInterval(() => {
            progress += 5;
            setHoldProgress(progress);
            if (progress >= 100) {
                clearInterval(id);
                setTriggered(true);
                setIsHolding(false);
            }
        }, 100);
        setIntervalRef(id);
    };

    const cancelHold = () => {
        if (intervalRef) clearInterval(intervalRef);
        setIsHolding(false);
        setHoldProgress(0);
    };

    const dismiss = () => {
        setTriggered(false);
        setHoldProgress(0);
    };

    return (
        <>
            {/* Floating SOS Button */}
            <motion.button
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                whileTap={{ scale: 0.95 }}
                className={`fixed top-20 right-4 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors ${isHolding ? 'bg-rust-red animate-pulse' : 'bg-rust-red/80'
                    }`}
                style={{
                    background: isHolding
                        ? `conic-gradient(#C0392B ${holdProgress}%, #4F5B66 ${holdProgress}%)`
                        : undefined
                }}
            >
                <Phone size={24} className="text-white" />
            </motion.button>

            {/* Triggered Overlay */}
            <AnimatePresence>
                {triggered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-rust-red flex flex-col items-center justify-center text-white p-8"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <Radio size={80} />
                        </motion.div>

                        <h1 className="text-4xl font-black mt-8 tracking-wider">{t('sos_transmitted')}</h1>
                        <p className="text-lg font-medium mt-4 text-center max-w-sm opacity-80">
                            {t('sos_desc')}
                        </p>

                        <div className="mt-8 bg-white/10 rounded-2xl p-6 w-full max-w-sm space-y-3">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} />
                                <span className="font-mono text-sm">40.7128° N, 74.0060° W</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Radio size={18} className="animate-pulse" />
                                <span className="text-sm font-bold">{t('sos_broadcasting')}</span>
                            </div>
                        </div>

                        <button
                            onClick={dismiss}
                            className="mt-12 px-8 py-4 bg-white text-rust-red font-black rounded-2xl text-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                        >
                            <X size={20} /> {t('sos_cancel')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EmergencySOS;
