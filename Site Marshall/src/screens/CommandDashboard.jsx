import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Camera, Mic, Volume2, BarChart3, X, CheckCircle } from 'lucide-react';
import { queryVoice, verifyLog, playAudio, startRecording } from '../services/api';

const CommandDashboard = () => {
    const { t, workerId, currentLang } = useAppContext();
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null); // { answer, category, logId }
    const recorderRef = useRef(null);

    // ─── Wave Visualizer ───────────────────────────────────────────────────────
    const renderWave = () => (
        <div className="flex items-center justify-center gap-1 h-20 px-8">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-2 bg-electric-cyan rounded-full"
                    animate={{
                        height: isListening ? ['20%', `${Math.random() * 80 + 20}%`, '20%'] : '10%',
                    }}
                    transition={{
                        repeat: isListening ? Infinity : 0,
                        duration: 0.5 + Math.random() * 0.5,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );

    // ─── Push-to-Talk Handlers ────────────────────────────────────────────────
    const handleTalkStart = useCallback(async () => {
        setResult(null);
        setIsListening(true);
        try {
            recorderRef.current = await startRecording();
        } catch (err) {
            console.error('Mic access denied:', err);
            setIsListening(false);
        }
    }, []);

    const handleTalkEnd = useCallback(async () => {
        if (!recorderRef.current) { setIsListening(false); return; }
        setIsListening(false);
        setIsLoading(true);

        try {
            const audioBlob = await recorderRef.current.stop();
            recorderRef.current = null;
            const res = await queryVoice(audioBlob, workerId ?? 'anonymous', currentLang);
            setResult({
                answer: res.answer,
                category: res.category,
                logId: res.log_id,
                audio: res.audio,
                transcription: res.transcription ?? null,
            });
            playAudio(res.audio);
        } catch (err) {
            setResult({ answer: `Error: ${err.message}`, category: 'ERROR', logId: null });
        } finally {
            setIsLoading(false);
        }
    }, [workerId, currentLang]);

    // ─── Training Verify ──────────────────────────────────────────────────────
    const handleVerify = async () => {
        if (!result?.logId) return;
        await verifyLog(result.logId).catch(() => { });
        setResult(prev => ({ ...prev, verified: true }));
    };

    const isDanger = result?.category === 'PROHIBITED_ACTION' || result?.category === 'HAZARD_WARNING';

    return (
        <div className="flex flex-col h-full bg-app-bg absolute inset-0 text-app-bg overflow-hidden">
            {/* Top Half: Identify Button */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex-1 bg-deep-concrete p-4 flex flex-col items-center justify-center relative shadow-md z-10"
            >
                <button
                    onClick={() => navigate('/identify')}
                    className="w-full h-full max-w-lg min-h-[44px] rounded-3xl border-4 border-slate-gray/20 flex flex-col items-center justify-center gap-6 hover:bg-slate-gray/10 transition-colors group active:scale-[0.98]"
                >
                    <div className="w-32 h-32 rounded-full bg-matte-indigo flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <Camera size={64} className="text-electric-cyan" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-wide">{t('identify_machine')}</h2>
                </button>
            </motion.div>

            {/* Bottom Half: Push To Speak */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex-1 bg-matte-indigo p-4 flex flex-col items-center justify-center relative shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
            >
                <button
                    onPointerDown={handleTalkStart}
                    onPointerUp={handleTalkEnd}
                    onPointerLeave={handleTalkEnd}
                    disabled={isLoading}
                    className={`w-full h-full max-w-lg min-h-[44px] rounded-3xl flex flex-col items-center justify-center gap-6 transition-all duration-300 ${isListening ? 'bg-deep-concrete/50 border-electric-cyan border-2' : 'hover:bg-deep-concrete/20 bg-transparent'
                        }`}
                >
                    <div className="h-24 w-full flex items-center justify-center mb-4">
                        {isListening ? (
                            renderWave()
                        ) : isLoading ? (
                            <div className="flex gap-2 items-center">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-3 h-3 rounded-full bg-electric-cyan"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-safety-orange flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                                <Mic size={48} className="text-app-bg" />
                            </div>
                        )}
                    </div>
                    <h2 className={`text-2xl font-bold ${isListening ? 'text-electric-cyan' : 'text-slate-gray'}`}>
                        {isListening ? t('marshall_ai_listening') : isLoading ? t('processing') : t('push_to_speak')}
                    </h2>
                </button>

                {/* Marshall AI Active badge */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-4 right-4 bg-app-bg text-charcoal px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold shadow-md"
                        >
                            <Volume2 size={16} className="text-electric-cyan" />
                            {t('marshall_ai_active')}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Bottom: Supervisor Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-none p-3 bg-app-bg"
            >
                <button
                    onClick={() => navigate('/supervisor')}
                    className="w-full py-3 bg-white border border-slate-gray/20 rounded-2xl flex items-center justify-center gap-2 text-matte-indigo font-bold shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
                >
                    <BarChart3 size={20} />
                    {t('supervisor_analytics')}
                </button>
            </motion.div>

            {/* Result Overlay */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-charcoal/80 z-50 flex flex-col items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 60, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 60 }}
                            className={`w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 ${isDanger ? 'border-rust-red' : 'border-sage-green'}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`font-black text-xl ${isDanger ? 'text-rust-red' : 'text-matte-indigo'}`}>
                                    {isDanger ? t('safety_alert') : t('info_marshall_ai')}
                                </h3>
                                <button onClick={() => setResult(null)} className="text-slate-gray hover:text-charcoal">
                                    <X size={24} />
                                </button>
                            </div>
                            {result.transcription && (
                                <div className="bg-slate-gray/10 rounded-xl px-4 py-2 mb-4">
                                    <p className="text-xs font-semibold text-slate-gray uppercase tracking-wider mb-1">{t('you_said')}</p>
                                    <p className="text-charcoal/80 text-sm italic leading-snug">"{result.transcription}"</p>
                                </div>
                            )}
                            <p className="text-charcoal font-medium leading-relaxed whitespace-pre-line mb-6">
                                {result.answer}
                            </p>
                            {result.logId && !result.verified && (
                                <button
                                    onClick={handleVerify}
                                    className="w-full h-14 bg-sage-green text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
                                >
                                    <CheckCircle size={20} />
                                    {t('confirm_understanding')}
                                </button>
                            )}
                            {result.verified && (
                                <div className="flex items-center justify-center gap-2 text-sage-green font-black py-2">
                                    <CheckCircle size={20} />
                                    {t('training_verified')}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommandDashboard;
