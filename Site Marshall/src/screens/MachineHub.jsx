import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { machineDB, detailedChecklistDB } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, GraduationCap, ChevronLeft, Keyboard, Send,
    CheckCircle, Sparkles, X, ChevronUp, ChevronDown,
    AlertTriangle, Truck, Anchor, Zap, Building2, Hammer, Layers, Wrench, Ship,
    Thermometer, Volume2, Wind, Sun
} from 'lucide-react';
import { queryText, queryVoice, verifyLog, playAudio, startRecording } from '../services/api';

// ─── Machine type icons ────────────────────────────────────────────────────────

const MACHINE_ICONS = {
    "Wheel Loader": Truck,
    "Crawler Excavator": Wrench,
    "Asphalt Paver": Layers,
    "Piling Rig": Hammer,
    "Crawler Crane": Building2,
    "Tower Crane": Building2,
    "Three-Wheel Roller": Wrench,
    "Mobile Excavator": Truck,
    "Electric Paver": Zap,
    "Heavy Lift Vessel": Anchor,
};

// ─── Static per-type data ──────────────────────────────────────────────────────

const QUICK_SPECS = {
    "Wheel Loader": [
        { label: "Max Load", value: "9,500 kg" },
        { label: "Engine Volume", value: "7.1 L" },
        { label: "Rated Power", value: "148 kW" },
        { label: "Operating Weight", value: "12,700 kg" },
        { label: "Bucket Volume", value: "2.7 m³" },
        { label: "Fuel Capacity", value: "230 L" },
    ],
    "Crawler Excavator": [
        { label: "Max Dig Depth", value: "6.7 m" },
        { label: "Engine Volume", value: "4.4 L" },
        { label: "Rated Power", value: "122 kW" },
        { label: "Operating Weight", value: "23,400 kg" },
        { label: "Swing Torque", value: "55 kNm" },
        { label: "Fuel Capacity", value: "400 L" },
    ],
    "Asphalt Paver": [
        { label: "Lay Width", value: "Up to 9.0 m" },
        { label: "Engine Volume", value: "6.1 L" },
        { label: "Rated Power", value: "129 kW" },
        { label: "Hopper Capacity", value: "14,500 kg" },
        { label: "Mix Temp.", value: ">150 °C" },
        { label: "Fuel Capacity", value: "340 L" },
    ],
    "Piling Rig": [
        { label: "Mast Height", value: "20–25 m" },
        { label: "Engine Volume", value: "12.0 L" },
        { label: "Rated Power", value: "330 kW" },
        { label: "Operating Weight", value: "65,000 kg" },
        { label: "Max Pile Dia.", value: "1,200 mm" },
        { label: "Fuel Capacity", value: "600 L" },
    ],
    "Crawler Crane": [
        { label: "Max Load", value: "90 t" },
        { label: "Engine Volume", value: "12.4 L" },
        { label: "Rated Power", value: "450 kW" },
        { label: "Operating Weight", value: "89,500 kg" },
        { label: "Boom Length", value: "50 m" },
        { label: "Fuel Capacity", value: "1,150 L" },
    ],
    "Tower Crane": [
        { label: "Max Capacity", value: "18 t" },
        { label: "Jib Length", value: "Up to 80 m" },
        { label: "Rated Power", value: "75 kW" },
        { label: "Max Height", value: "310 m" },
        { label: "Tip Load", value: "3.8 t" },
        { label: "Hoist Speed", value: "100 m/min" },
    ],
    "Three-Wheel Roller": [
        { label: "Drum Width", value: "1,700 mm" },
        { label: "Engine Volume", value: "3.4 L" },
        { label: "Rated Power", value: "55 kW" },
        { label: "Operating Weight", value: "9,200 kg" },
        { label: "Top Speed", value: "12 km/h" },
        { label: "Fuel Capacity", value: "110 L" },
    ],
    "Mobile Excavator": [
        { label: "Max Dig Depth", value: "5.4 m" },
        { label: "Engine Volume", value: "4.8 L" },
        { label: "Rated Power", value: "95 kW" },
        { label: "Operating Weight", value: "14,300 kg" },
        { label: "Road Speed", value: "35 km/h" },
        { label: "Fuel Capacity", value: "220 L" },
    ],
    "Electric Paver": [
        { label: "Battery", value: "320 kWh" },
        { label: "Motor Power", value: "2× 55 kW" },
        { label: "Lay Width", value: "Up to 8.0 m" },
        { label: "Operating Weight", value: "17,500 kg" },
        { label: "Noise Level", value: "<72 dB(A)" },
        { label: "Charge Time", value: "~3.5 hrs" },
    ],
    "Heavy Lift Vessel": [
        { label: "Lift Capacity", value: "8,500 t" },
        { label: "Engine Volume", value: "4× MAN" },
        { label: "Rated Power", value: "4× 6,000 kW" },
        { label: "Crane Span", value: "102 m" },
        { label: "Water Depth", value: "Up to 70 m" },
        { label: "DP Class", value: "DP-2" },
    ],
};

const ENV_FIELDS = [
    { icon: Thermometer, label: 'Temp', value: '33°C', warn: true, threshold: '> 35°C = Mandatory Break' },
    { icon: Volume2, label: 'Noise', value: '82 dB', warn: false, threshold: '> 85 dB = Hearing Protection' },
    { icon: Wind, label: 'Wind', value: '14 km/h', warn: false, threshold: '> 40 km/h = Cease Crane Ops' },
    { icon: Sun, label: 'UV', value: '7 (High)', warn: true, threshold: '> 8 = Sunscreen & Shade Breaks' },
];

const AI_SUMMARIES = {
    "Wheel Loader": {
        text: "Hydraulic system pressure and bucket integrity are the primary operational concerns. Always confirm brake response and tire condition before commencing loading cycles.",
        tags: ["Hydraulics", "Braking", "Visibility"],
    },
    "Crawler Excavator": {
        text: "Swing-radius exclusion zones and underground utility verification are critical before breaking ground. Hydraulic hose condition must be checked before each shift.",
        tags: ["Swing Zone", "Hydraulics", "Undergrounds"],
    },
    "Asphalt Paver": {
        text: "Hot-mix asphalt exceeds 150°C — contact causes severe burns. Hopper and conveyor crushing zones require constant awareness during operation.",
        tags: ["Thermal Burns", "Crushing Hazard", "Screed Safety"],
    },
    "Piling Rig": {
        text: "Mast stability and ground-bearing capacity are paramount. LMI must never be overridden. Outrigger pads are mandatory on all surface types.",
        tags: ["LMI", "Ground Bearing", "Mast Stability"],
    },
    "Crawler Crane": {
        text: "Load chart adherence and anti-two-block protection are non-negotiable. Outrigger setup on rated bearing surfaces must precede every lift.",
        tags: ["Load Chart", "Rigging", "Ground Stability"],
    },
    "Tower Crane": {
        text: "Wind speed monitoring and hoist limit switch integrity govern safe tower crane operation. Slinging and communication protocols must be verified daily.",
        tags: ["Wind Limits", "Limit Switches", "Rigging"],
    },
    "Three-Wheel Roller": {
        text: "Rollers have significant blind spots at all four corners. Reverse alarm and camera functionality must be confirmed before operation begins.",
        tags: ["Blind Spots", "Reverse Alarm", "Compaction"],
    },
    "Mobile Excavator": {
        text: "Stabiliser deployment and steering axle lock must be confirmed before any lifting cycle. Road lighting and mirrors are critical when travelling between zones.",
        tags: ["Stabilisers", "Steering Lock", "Road Travel"],
    },
    "Electric Paver": {
        text: "High-voltage cable integrity and battery charge level (>80%) are pre-shift critical checks. Silent-mode operation increases pedestrian risk — beacon must be functional.",
        tags: ["High Voltage", "Battery", "Silent Zone"],
    },
    "Heavy Lift Vessel": {
        text: "Ballast management and DP system calibration govern offshore lift safety. Swell and wind limits must be monitored continuously throughout the operation.",
        tags: ["Ballast", "DP System", "Marine Stability"],
    },
};

const DEFAULT_SUMMARY = {
    text: "Review all pre-shift checks and safety protocols before operating this machine. Consult the OEM manual for specific hazard zones and operational limits.",
    tags: ["Pre-Shift", "Safety"],
};

const CATEGORY_ICONS = {
    PROHIBITED_ACTION: '⛔',
    HAZARD_WARNING: '⚠️',
};

// ─── Inline Pre-Op Checklist ──────────────────────────────────────────────────

const PreOpChecklist = ({ machineType }) => {
    const groups = detailedChecklistDB[machineType] ?? [];
    const allItems = groups.flatMap(g => g.items);
    const [checked, setChecked] = useState({});
    const [expanded, setExpanded] = useState(true);

    const completedCount = Object.values(checked).filter(Boolean).length;
    const totalCount = allItems.length;

    const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

    if (groups.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="bg-white rounded-2xl border border-slate-gray/10 shadow-sm overflow-hidden"
        >
            {/* Header row */}
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
            >
                <div>
                    <div className="font-black text-charcoal text-base">Pre-Op Checklist</div>
                    <div className="text-xs text-slate-gray mt-0.5">
                        {totalCount} items, {completedCount} completed
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {completedCount > 0 && (
                        <div className="text-xs font-black text-sage-green">
                            {Math.round((completedCount / totalCount) * 100)}%
                        </div>
                    )}
                    {expanded ? <ChevronUp size={18} className="text-slate-gray" /> : <ChevronDown size={18} className="text-slate-gray" />}
                </div>
            </button>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100 mx-4 rounded-full overflow-hidden -mt-2 mb-1">
                <motion.div
                    className={`h-full ${completedCount === totalCount ? 'bg-sage-green' : 'bg-safety-orange'}`}
                    animate={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 space-y-4">
                            {groups.map(group => (
                                <div key={group.category}>
                                    <div className="text-[10px] font-black tracking-widest uppercase text-safety-orange mb-2">
                                        {group.category}
                                    </div>
                                    <div className="space-y-2">
                                        {group.items.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggle(item.id)}
                                                className="w-full flex items-center gap-3 text-left"
                                            >
                                                <div className={`w-5 h-5 rounded flex-none border-2 flex items-center justify-center transition-colors ${checked[item.id] ? 'bg-sage-green border-sage-green' : 'border-slate-gray/40'}`}>
                                                    {checked[item.id] && <CheckCircle size={12} className="text-white" strokeWidth={3} />}
                                                </div>
                                                <span className={`text-sm leading-snug ${checked[item.id] ? 'line-through text-slate-gray' : 'text-charcoal'}`}>
                                                    {item.label}
                                                </span>
                                                {item.critical && !checked[item.id] && (
                                                    <AlertTriangle size={13} className="text-safety-orange flex-none ml-auto" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Chat Overlay ─────────────────────────────────────────────────────────────

const ChatOverlay = ({
    onClose, chatHistory, isLoading, isListening, isTyping, textInput,
    setTextInput, setIsTyping, handleTextSubmit, handleTalkStart, handleTalkEnd,
    pendingLogId, handleVerify, chatEndRef, machineName,
}) => (
    <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="fixed inset-0 z-50 flex flex-col bg-app-bg"
    >
        {/* Chat header */}
        <div className="flex-none bg-matte-indigo px-4 py-3 flex items-center gap-3 shadow-md">
            <button
                onClick={onClose}
                className="p-2 rounded-full text-app-bg hover:bg-white/10 active:scale-95 transition-all"
            >
                <X size={22} />
            </button>
            <div className="flex-1">
                <div className="font-bold text-app-bg text-base">Marshall AI</div>
                <div className="text-xs text-slate-400">{machineName}</div>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pb-48 space-y-4">
            {chatHistory.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    className="flex flex-col items-center justify-center py-16 text-slate-gray space-y-3"
                >
                    <Mic size={40} className="opacity-40" />
                    <p className="text-center max-w-xs font-medium text-base leading-snug">
                        Ask me anything about the {machineName}.
                    </p>
                </motion.div>
            )}

            <AnimatePresence>
                {chatHistory.map((chat, idx) => {
                    if (chat.type === 'system') {
                        return (
                            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
                                <div className="px-4 py-2 bg-sage-green/20 border border-sage-green text-charcoal rounded-full text-sm font-bold flex items-center gap-2">
                                    <CheckCircle size={14} className="text-sage-green" />
                                    {chat.text}
                                </div>
                            </motion.div>
                        );
                    }
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 14, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${chat.type === 'user'
                                ? 'bg-matte-indigo text-app-bg rounded-br-sm font-medium'
                                : 'bg-white shadow-md border border-slate-gray/20 text-charcoal rounded-bl-sm whitespace-pre-line'
                                }`}>
                                {chat.text}
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

            <AnimatePresence>
                {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                        <div className="bg-white shadow-md border border-slate-gray/20 px-5 py-4 rounded-3xl rounded-bl-sm flex gap-2 items-center">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} className="w-2 h-2 rounded-full bg-matte-indigo"
                                    animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div ref={chatEndRef} />
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
            <AnimatePresence>
                {pendingLogId && !isLoading && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="px-4 pb-2 pointer-events-auto">
                        <button onClick={handleVerify}
                            className="w-full max-w-lg mx-auto flex h-14 items-center justify-center gap-2 bg-sage-green text-white font-black text-base rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                            <CheckCircle size={20} />I CONFIRM UNDERSTANDING
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-4 pointer-events-auto">
                <div className="relative w-full max-w-lg mx-auto">
                    <AnimatePresence>
                        {isTyping && (
                            <motion.form
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                onSubmit={handleTextSubmit}
                                className="absolute bottom-24 left-0 w-full bg-white shadow-2xl border border-slate-gray/30 flex items-center pr-2 rounded-2xl overflow-hidden"
                            >
                                {/* Locked machine tag */}
                                <span className="shrink-0 ml-3 px-2.5 py-1 rounded-full text-xs font-black text-white select-none"
                                    style={{ backgroundColor: '#E67E22' }}>
                                    @{machineName.split('/').pop().trim()}
                                </span>
                                <input
                                    type="text"
                                    autoFocus
                                    value={textInput}
                                    onChange={e => setTextInput(e.target.value)}
                                    placeholder="Ask a question…"
                                    className="flex-1 bg-transparent px-3 py-3 text-base font-medium focus:outline-none"
                                />
                                <button type="submit" disabled={!textInput.trim() || isLoading}
                                    className="p-3 bg-matte-indigo text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 shrink-0 mr-1">
                                    <Send size={18} />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-end w-full px-2">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsTyping(!isTyping)}
                            className="w-16 h-16 bg-white border border-slate-gray/20 rounded-full flex items-center justify-center shadow-lg text-matte-indigo hover:bg-slate-gray/10">
                            <Keyboard size={26} />
                        </motion.button>
                        <motion.button
                            onPointerDown={handleTalkStart} onPointerUp={handleTalkEnd} onPointerLeave={handleTalkEnd}
                            whileTap={{ scale: 0.92 }} disabled={isLoading}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4 border-app-bg ${isListening ? 'bg-safety-orange scale-110' : isLoading ? 'bg-slate-gray' : 'bg-matte-indigo'}`}>
                            <Mic size={30} className="text-white" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>

        {isListening && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute top-0 left-0 w-full h-1 bg-safety-orange shadow-[0_0_15px_#E67E22] z-50 animate-pulse" />
        )}
    </motion.div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const MachineHub = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, workerId, currentLang, setTrainingCount } = useAppContext();

    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingLogId, setPendingLogId] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);

    const chatEndRef = useRef(null);
    const recorderRef = useRef(null);
    const machine = machineDB.find(m => m.id === id);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    if (!machine) return <div className="p-8">Machine Not Found</div>;

    const summary = AI_SUMMARIES[machine.type] ?? DEFAULT_SUMMARY;
    const specs = QUICK_SPECS[machine.type] ?? [];
    const shortModel = machine.model.split('/').pop().trim();

    const progressColor = machine.trainingProgress >= 70
        ? 'bg-sage-green text-white'
        : machine.trainingProgress >= 30
            ? 'bg-safety-orange text-white'
            : 'bg-rust-red text-white';

    // ─── Text Query ─────────────────────────────────────────────────────────
    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (!textInput.trim() || isLoading) return;
        const query = textInput.trim();
        setTextInput('');
        setIsTyping(false);
        await processQuery(query, 'text');
    };

    // ─── Voice Query ─────────────────────────────────────────────────────────
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

    // ─── Shared Processing ────────────────────────────────────────────────────
    const processQuery = async (queryOrBlob, mode) => {
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
            setChatHistory(prev => [...prev, {
                type: 'ai',
                text: `${icon} ${res.answer}`,
                logId: res.log_id,
                category: res.category,
                confidence: res.confidence,
                transcription: res.transcription ?? null,
            }]);
            setPendingLogId(res.log_id);

            if (mode === 'voice' && res.transcription) {
                setChatHistory(prev => prev.map((msg, i) =>
                    i === prev.length - 2 ? { ...msg, text: `🎤 "${res.transcription}"` } : msg
                ));
            }
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

    // ─── Training Verification ────────────────────────────────────────────────
    const handleVerify = async () => {
        if (!pendingLogId) return;
        try {
            await verifyLog(pendingLogId);
            setPendingLogId(null);
            setTrainingCount(prev => prev + 1);
            setChatHistory(prev => [...prev, { type: 'system', text: '✅ Training logged and verified!' }]);
        } catch (err) {
            console.error('Verify error:', err);
        }
    };

    const handleOpenChat = () => {
        setChatOpen(true);
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full bg-app-bg text-charcoal absolute inset-0 overflow-hidden">

            {/* Header */}
            <div className="flex-none bg-matte-indigo z-30 shadow-lg">
                <div className="px-3 pt-3 pb-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/scanner')}
                        className="p-2 rounded-full text-app-bg hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <ChevronLeft size={26} />
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="font-black text-app-bg text-lg leading-tight truncate">
                            {machine.model}
                        </div>
                        <div className="text-safety-orange font-bold text-xs uppercase tracking-widest">
                            {machine.type}
                        </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${progressColor}`}>
                        {machine.trainingProgress}%
                    </div>
                </div>

            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto pb-28">

                {/* Hero card */}
                {(() => {
                    const MachineIcon = MACHINE_ICONS[machine.type] ?? Wrench;
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mx-4 mt-4 rounded-2xl flex flex-col items-center justify-center py-10 gap-4"
                            style={{ backgroundColor: '#0D1B2A' }}
                        >
                            <MachineIcon size={52} className="text-white/90" strokeWidth={1.5} />
                            <div className="text-white font-black text-xl tracking-widest uppercase text-center px-4">
                                {machine.model}
                            </div>
                        </motion.div>
                    );
                })()}

                <div className="px-4 space-y-4 pt-2">

                    {/* AI Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-gray/10"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-safety-orange" />
                                <span className="font-black text-xs tracking-widest uppercase text-charcoal">AI Summary</span>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">
                                OEM Manual Only
                            </span>
                        </div>
                        <p className="text-sm text-charcoal/80 leading-relaxed mb-3">
                            {summary.text}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {summary.tags.map(tag => (
                                <span key={tag} className="text-[11px] font-bold bg-safety-orange/10 text-safety-orange border border-safety-orange/20 px-2.5 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Training button */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 }}
                    >
                        <button
                            onClick={() => navigate(`/machine/${id}/academy`)}
                            className="w-full h-14 bg-safety-orange text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
                        >
                            <GraduationCap size={20} />
                            Training
                        </button>
                    </motion.div>

                    {/* Quick Specs + Environmental Conditions */}
                    {specs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-xs font-black uppercase tracking-widest text-slate-gray mb-3">
                                Quick Specs
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {specs.map(spec => (
                                    <div key={spec.label} className="bg-white rounded-xl p-4 border border-slate-gray/10 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-gray uppercase tracking-wider mb-1">
                                            {spec.label}
                                        </div>
                                        <div className="font-black text-charcoal text-lg">
                                            {spec.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-xs font-black uppercase tracking-widest text-slate-gray mb-3 mt-5">
                                Site Conditions
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {ENV_FIELDS.map(env => (
                                    <div
                                        key={env.label}
                                        title={env.threshold}
                                        className={`bg-white rounded-xl p-4 border shadow-sm flex items-start gap-3 ${env.warn ? 'border-safety-orange/40' : 'border-slate-gray/10'}`}
                                    >
                                        <env.icon size={18} className={`mt-0.5 flex-none ${env.warn ? 'text-safety-orange' : 'text-slate-gray'}`} />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-gray uppercase tracking-wider mb-1">
                                                {env.label}
                                            </div>
                                            <div className={`font-black text-lg ${env.warn ? 'text-safety-orange' : 'text-charcoal'}`}>
                                                {env.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Inline Pre-Op Checklist */}
                    <PreOpChecklist machineType={machine.type} />
                </div>
            </div>

            {/* Bottom voice bar */}
            <div className="absolute bottom-0 left-0 w-full">
                <motion.button
                    onPointerDown={() => { handleOpenChat(); }}
                    className="w-full bg-safety-orange text-white flex items-center justify-center gap-3 py-5 font-black text-base shadow-2xl hover:brightness-110 active:brightness-95 transition-all"
                    whileTap={{ scale: 0.98 }}
                >
                    <Mic size={22} />
                    Ask about {shortModel}
                </motion.button>
            </div>

            {/* Chat overlay */}
            <AnimatePresence>
                {chatOpen && (
                    <ChatOverlay
                        onClose={() => setChatOpen(false)}
                        chatHistory={chatHistory}
                        isLoading={isLoading}
                        isListening={isListening}
                        isTyping={isTyping}
                        textInput={textInput}
                        setTextInput={setTextInput}
                        setIsTyping={setIsTyping}
                        handleTextSubmit={handleTextSubmit}
                        handleTalkStart={handleTalkStart}
                        handleTalkEnd={handleTalkEnd}
                        pendingLogId={pendingLogId}
                        handleVerify={handleVerify}
                        chatEndRef={chatEndRef}
                        machineName={machine.model}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MachineHub;
