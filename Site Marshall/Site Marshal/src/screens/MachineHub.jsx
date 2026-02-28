import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { machineDB } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, GraduationCap, ChevronLeft, Keyboard, Send, ClipboardCheck, CheckCircle, AlertTriangle } from 'lucide-react';
import EnvironmentalWidget from '../components/EnvironmentalWidget';
import { queryText, queryVoice, verifyLog, playAudio, startRecording } from '../services/api';

// Custom Minimalist Text Reveal
const SplitText = ({ text }) => {
    return (
        <div className="flex overflow-hidden">
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.33, 1, 0.68, 1] }}
                    className="inline-block"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </div>
    );
};

const CATEGORY_ICONS = {
    PROHIBITED_ACTION: '⛔',
    HAZARD_WARNING: '⚠️',
};

const MachineHub = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, workerId, currentLang, setTrainingCount, tMachine } = useAppContext();

    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingLogId, setPendingLogId] = useState(null);

    const chatEndRef = useRef(null);
    const recorderRef = useRef(null);
    const machine = machineDB.find(m => m.id === id);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    if (!machine) return <div className="p-8">Machine Not Found</div>;

    // ─── Text Query ────────────────────────────────────────────────────────────
    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (!textInput.trim() || isLoading) return;

        const query = textInput.trim();
        setTextInput('');
        setIsTyping(false);
        await processQuery(query, 'text');
    };

    // ─── Voice Query ──────────────────────────────────────────────────────────
    const handleTalkStart = useCallback(async () => {
        setIsListening(true);
        try {
            recorderRef.current = await startRecording();
        } catch (err) {
            console.error('Microphone access denied:', err);
            setIsListening(false);
        }
    }, []);

    const handleTalkEnd = useCallback(async () => {
        if (!recorderRef.current) { setIsListening(false); return; }
        setIsListening(false);

        try {
            const audioBlob = await recorderRef.current.stop();
            recorderRef.current = null;
            await processQuery(audioBlob, 'voice');
        } catch (err) {
            console.error('Recording error:', err);
        }
    }, []);

    // ─── Shared Processing ─────────────────────────────────────────────────────
    const processQuery = async (queryOrBlob, mode) => {
        // Add user bubble immediately
        const userText = mode === 'text' ? queryOrBlob : '🎤 Voice query';
        setChatHistory(prev => [...prev, { type: 'user', text: userText }]);
        setIsLoading(true);
        setPendingLogId(null);

        try {
            let res;
            if (mode === 'text') {
                res = await queryText(queryOrBlob, workerId ?? 'anonymous', currentLang);
            } else {
                res = await queryVoice(queryOrBlob, workerId ?? 'anonymous', currentLang);
            }

            const icon = CATEGORY_ICONS[res.category] ?? 'ℹ️';
            const aiText = `${icon} ${res.answer}`;

            setChatHistory(prev => [...prev, {
                type: 'ai',
                text: aiText,
                logId: res.log_id,
                category: res.category,
                confidence: res.confidence,
                transcription: res.transcription ?? null,
            }]);

            // Check if backend reported confidence < 0.4 OR if LLM manually triggered 'Information not found'
            const lowerAiText = aiText.toLowerCase();
            const isInformationNotFound = lowerAiText.includes('information not found') ||
                lowerAiText.includes('not found in safety manuals') ||
                lowerAiText.includes('no matching safety procedure found') ||
                lowerAiText.includes('keine passende sicherheitsvorschrift') ||
                lowerAiText.includes('informationen nicht gefunden') ||
                lowerAiText.includes('nicht in den sicherheitshandbüchern') ||
                lowerAiText.includes('information nicht in den handbüchern');

            // Only show the Confirmation button if confidence >= 0.4 AND it didn't trigger a 'not found' message
            if (res.confidence >= 0.4 && !isInformationNotFound) {
                setPendingLogId(res.log_id);
            }

            // If voice query, show transcription as first bubble
            if (mode === 'voice' && res.transcription) {
                // Update the user bubble with the actual transcribed text
                setChatHistory(prev => prev.map((msg, i) =>
                    i === prev.length - 2 // second-to-last is the "voice query" bubble
                        ? { ...msg, text: `🎤 "${res.transcription}"` }
                        : msg
                ));
            }

            // Play TTS audio
            playAudio(res.audio);

        } catch (err) {
            setChatHistory(prev => [...prev, {
                type: 'ai',
                text: `⛔ Error: ${err.message}. Please check the backend is running.`,
                logId: null,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Training Verification ─────────────────────────────────────────────────
    const handleVerify = async () => {
        if (!pendingLogId) return;
        try {
            await verifyLog(pendingLogId);
            setPendingLogId(null);
            setTrainingCount(prev => prev + 1);
            setChatHistory(prev => [...prev, {
                type: 'system',
                text: `✅ ${t('training_verified')}`,
            }]);
        } catch (err) {
            console.error('Verify error:', err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-app-bg text-charcoal absolute inset-0 overflow-hidden">

            {/* 1. Header & Quick Actions */}
            <div className="flex-none bg-matte-indigo shadow-md z-30">
                <div className="p-4 flex items-center justify-between relative">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-app-bg p-2 rounded-full hover:bg-slate-gray/20 transition-colors active:scale-95"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 font-bold text-app-bg text-lg tracking-widest hidden sm:block">
                        MARSHALL AI
                    </div>
                </div>

                {/* Pinned Action Buttons */}
                <div className="px-4 pb-4 flex gap-3">
                    <button
                        onClick={() => navigate(`/machine/${id}/checklist`)}
                        className="flex-1 h-14 bg-white text-matte-indigo border-2 border-matte-indigo/20 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-matte-indigo/5 active:scale-95 transition-all"
                    >
                        <ClipboardCheck size={20} />
                        {t('pre_shift')}
                    </button>
                    <button
                        onClick={() => navigate(`/machine/${id}/academy`)}
                        className="flex-[2] h-14 bg-safety-orange text-app-bg rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-md hover:brightness-110 active:scale-95 transition-all"
                    >
                        <GraduationCap size={24} />
                        {t('academy_title')}
                    </button>
                </div>
            </div>

            {/* 2. Scrollable Body (Hero + Chat) */}
            <div className="flex-1 overflow-y-auto pb-44">

                {/* Hero Image */}
                <div className="h-[35vh] min-h-[250px] w-full relative overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${machine.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-app-bg via-app-bg/10 to-transparent z-10" />

                    <div className="absolute bottom-6 left-6 z-20">
                        <div className="text-4xl sm:text-5xl font-black text-charcoal drop-shadow-md tracking-tighter">
                            <SplitText text={machine.model} />
                        </div>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-matte-indigo font-bold uppercase tracking-widest text-sm mt-1"
                        >
                            {tMachine(machine.type)}
                        </motion.p>
                    </div>
                </div>

                {/* Environmental Hazard Widget */}
                <div className="px-4 pt-4">
                    <EnvironmentalWidget />
                </div>

                {/* Chat Interface */}
                <div className="p-4 sm:p-8 space-y-4">
                    {chatHistory.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col items-center justify-center py-10 text-slate-gray space-y-4"
                        >
                            <Mic size={48} className="opacity-50" />
                            <p className="text-center max-w-xs font-bold text-lg leading-snug">
                                {t('marshall_ai_greeting')}
                            </p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {chatHistory.map((chat, idx) => {
                                if (chat.type === 'system') {
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex justify-center"
                                        >
                                            <div className="px-4 py-2 bg-sage-green/20 border border-sage-green text-charcoal rounded-full text-sm font-bold flex items-center gap-2">
                                                <CheckCircle size={16} className="text-sage-green" />
                                                {chat.text}
                                            </div>
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-4 rounded-3xl ${chat.type === 'user'
                                                ? 'bg-deep-concrete text-app-bg rounded-br-sm'
                                                : 'bg-white shadow-md border border-slate-gray/20 text-charcoal rounded-bl-sm font-medium leading-relaxed whitespace-pre-line'
                                                }`}
                                        >
                                            {chat.text}
                                            {/* Confidence badge for AI messages */}
                                            {chat.type === 'ai' && chat.confidence !== undefined && (
                                                <div className="mt-2 text-xs text-slate-gray font-bold">
                                                    Confidence: {Math.round(chat.confidence * 100)}%
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}

                    {/* Loading indicator */}
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white shadow-md border border-slate-gray/20 px-5 py-4 rounded-3xl rounded-bl-sm flex gap-2 items-center">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-matte-indigo"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* 3. Bottom Controls Layer */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none">

                {/* I CONFIRM UNDERSTANDING — slides up above controls */}
                <AnimatePresence>
                    {pendingLogId && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="px-4 pb-2 pointer-events-auto"
                        >
                            <button
                                onClick={handleVerify}
                                className="w-full max-w-lg mx-auto flex h-14 items-center justify-center gap-2 bg-sage-green text-white font-black text-base rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                                <CheckCircle size={20} />
                                {t('confirm_understanding')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="p-4 pointer-events-auto">
                    <div className="relative w-full h-full max-w-lg mx-auto">

                        {/* Typing Mode Input Box */}
                        <AnimatePresence>
                            {isTyping && (
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    onSubmit={handleTextSubmit}
                                    className="absolute bottom-24 left-0 w-full bg-white p-2 rounded-full shadow-2xl border border-slate-gray/30 flex items-center pr-2"
                                >
                                    <input
                                        type="text"
                                        autoFocus
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder={t('ask_marshall_ai')}
                                        className="w-full bg-transparent px-4 py-2 text-lg font-medium focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!textInput.trim() || isLoading}
                                        className="p-3 bg-matte-indigo text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons Row */}
                        <div className="flex justify-between items-end w-full px-2">
                            {/* Bottom-Left: Keyboard Trigger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsTyping(!isTyping)}
                                className="w-16 h-16 bg-white border border-slate-gray/20 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 text-matte-indigo hover:bg-slate-gray/10"
                            >
                                <Keyboard size={28} />
                            </motion.button>

                            {/* Bottom-Right: Big Push-to-Talk */}
                            <motion.button
                                onPointerDown={handleTalkStart}
                                onPointerUp={handleTalkEnd}
                                onPointerLeave={handleTalkEnd}
                                whileTap={{ scale: 0.9 }}
                                disabled={isLoading}
                                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4 border-app-bg ${isListening ? 'bg-safety-orange scale-110' : isLoading ? 'bg-slate-gray' : 'bg-matte-indigo text-white'
                                    }`}
                            >
                                <Mic size={32} className={isListening ? 'text-white' : ''} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listening indicator — orange strip at top */}
            {isListening && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-0 left-0 w-full h-1 bg-safety-orange shadow-[0_0_15px_#E67E22] z-50 animate-pulse"
                />
            )}
        </div>
    );
};

export default MachineHub;
