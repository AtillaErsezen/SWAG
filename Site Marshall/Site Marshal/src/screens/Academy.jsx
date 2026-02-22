import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, BookOpen, BrainCircuit, FileText, CheckCircle, XCircle, Send, Play, Layers } from 'lucide-react';
import { machineDB } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

const getCriticalityStyle = (crit) => {
    switch (crit) {
        case 'rust-red': return { bg: 'bg-rust-red/10', text: 'text-rust-red', border: 'border-rust-red/30', label: 'CRITICAL' };
        case 'safety-orange': return { bg: 'bg-safety-orange/10', text: 'text-safety-orange', border: 'border-safety-orange/30', label: 'WARNING' };
        case 'sage-green': return { bg: 'bg-sage-green/10', text: 'text-sage-green', border: 'border-sage-green/30', label: 'STANDARD' };
        default: return { bg: 'bg-slate-gray/10', text: 'text-slate-gray', border: 'border-slate-gray/30', label: 'GENERAL' };
    }
};

const Academy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useAppContext();

    const [view, setView] = useState('overview'); // overview, study
    const [activeSection, setActiveSection] = useState(null);
    const [studyMode, setStudyMode] = useState('summary');
    const [expandedUnits, setExpandedUnits] = useState({});

    // Learn Mode State
    const [curCard, setCurCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Marshall AI Chat State
    const [chatInput, setChatInput] = useState('');
    const [chatLog, setChatLog] = useState([]);

    // Test State
    const [testInput, setTestInput] = useState('');
    const [testResult, setTestResult] = useState(null);

    const machine = machineDB.find(m => m.id === id);
    if (!machine) return <div className="p-8">Machine Not Found</div>;

    const units = machine.units || [];

    const toggleUnit = (unitId) => {
        setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
    };

    const handleSelectSection = (section) => {
        setActiveSection(section);
        setStudyMode('summary');
        setView('study');
        setCurCard(0);
        setIsFlipped(false);
        setTestInput('');
        setTestResult(null);
        setChatLog([{ type: 'ai', text: `Marshall AI: Welcome to your training session on "${section.title}". What aspect of this topic would you like to explore first?` }]);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const newLog = [...chatLog, { type: 'user', text: chatInput }];
        setChatLog(newLog);
        setChatInput('');
        setTimeout(() => {
            setChatLog([...newLog, { type: 'ai', text: `Marshall AI: That's an insightful question about ${activeSection.title}. ${activeSection.qChatContext} How does this affect your approach to safe machine operation?` }]);
        }, 1000);
    };

    const handleTestSubmit = () => {
        if (!testInput.trim()) return;
        setTestResult('grading');
        setTimeout(() => {
            const passed = testInput.length > 10;
            setTestResult(passed ? 'pass' : 'fail');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-app-bg text-charcoal">
            <div className="bg-matte-indigo p-4 pt-6 pb-6 text-app-bg flex items-center shadow-lg z-20 relative">
                <button
                    onClick={() => view === 'overview' ? navigate(`/machine/${id}`) : setView('overview')}
                    className="p-3 hover:bg-slate-gray/20 rounded-2xl transition-all active:scale-95"
                >
                    <ChevronLeft size={28} />
                </button>
                <div className="ml-2">
                    <h2 className="text-xl font-bold tracking-tight">The Academy</h2>
                    <p className="text-xs text-slate-gray font-medium uppercase tracking-widest">{machine.model}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative bg-app-bg">
                <AnimatePresence mode="wait">
                    {view === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-4 sm:p-6 pb-32 space-y-4"
                        >
                            {units.length === 0 && <p className="text-slate-gray text-center mt-10">No training modules available for this machine.</p>}
                            {units.map((unit) => {
                                const isExpanded = expandedUnits[unit.id] || false;
                                return (
                                    <div key={unit.id} className="space-y-2">
                                        {/* Unit Header (Collapsible Accordion) */}
                                        <button
                                            onClick={() => toggleUnit(unit.id)}
                                            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-gray/20 flex items-center justify-between hover:shadow-md transition-shadow active:scale-[0.99]"
                                        >
                                            <div className="flex items-center gap-3">
                                                {unit.completed ? <CheckCircle size={22} className="text-sage-green flex-shrink-0" /> : <Layers size={22} className="text-safety-orange flex-shrink-0" />}
                                                <div className="text-left">
                                                    <h3 className="text-lg font-black text-matte-indigo leading-tight">{unit.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-24 h-1.5 bg-slate-gray/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-700 ${unit.completed ? 'bg-sage-green' : 'bg-safety-orange'}`}
                                                                style={{ width: `${unit.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-gray">{unit.progress}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                <ChevronDown size={22} className="text-slate-gray" />
                                            </motion.div>
                                        </button>

                                        {/* Collapsible Sections */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className="overflow-hidden pl-4 space-y-3"
                                                >
                                                    {unit.sections.map(section => {
                                                        const style = getCriticalityStyle(section.criticality);
                                                        return (
                                                            <motion.button
                                                                key={section.id}
                                                                initial={{ opacity: 0, y: -5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => handleSelectSection(section)}
                                                                className={`w-full bg-white p-4 rounded-2xl shadow-sm border-l-4 ${style.border} flex flex-col gap-2 text-left hover:shadow-md transition-shadow`}
                                                            >
                                                                <div className="flex justify-between items-center w-full">
                                                                    <div className="flex items-center gap-2 pr-3 min-w-0">
                                                                        {section.completed && <CheckCircle size={16} className="text-sage-green flex-shrink-0" />}
                                                                        <span className={`font-bold text-base leading-snug truncate ${section.completed ? 'opacity-50' : ''}`}>{section.id} {section.title}</span>
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${style.bg} ${style.text}`}>
                                                                            {style.label}
                                                                        </span>
                                                                        <span className="text-[10px] font-black text-slate-gray">{section.progress}%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="w-full h-1 bg-slate-gray/10 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-matte-indigo/30" style={{ width: `${section.progress}%` }} />
                                                                </div>
                                                                <p className="text-slate-gray text-xs line-clamp-2 leading-relaxed">{section.content}</p>
                                                            </motion.button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {view === 'study' && activeSection && (
                        <motion.div
                            key="study"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col h-full absolute inset-0 bg-app-bg"
                        >
                            {/* Study Mode Tabs */}
                            <div className="flex bg-white shadow-sm border-b border-slate-gray/20 px-2 py-3 gap-2 overflow-x-auto hide-scrollbar sticky top-0 z-10">
                                {[
                                    { id: 'summary', icon: FileText, label: 'Summary' },
                                    { id: 'qchat', icon: BrainCircuit, label: 'Marshall AI' },
                                    { id: 'learn', icon: BookOpen, label: 'Learn' },
                                    { id: 'test', icon: Play, label: 'Test' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setStudyMode(tab.id); setTestResult(null); }}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-colors ${studyMode === tab.id
                                            ? 'bg-matte-indigo text-white shadow-md'
                                            : 'bg-app-bg text-slate-gray hover:bg-slate-gray/10'
                                            }`}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Study Content Area */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center">

                                {studyMode === 'summary' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
                                        <div className={`p-6 bg-white rounded-[2rem] shadow-sm border-2 ${getCriticalityStyle(activeSection.criticality).border}`}>
                                            <h4 className="font-black text-2xl mb-4 text-matte-indigo">Quick Summary</h4>
                                            <p className="text-charcoal font-medium text-lg leading-relaxed">{activeSection.summary}</p>
                                        </div>
                                        <div className="p-6 bg-deep-concrete/5 rounded-[2rem]">
                                            <h4 className="font-bold text-slate-gray mb-2 uppercase tracking-widest text-xs">Full Manual Excerpt</h4>
                                            <p className="text-charcoal leading-relaxed">{activeSection.content}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {studyMode === 'qchat' && (
                                    <div className="w-full max-w-md h-full flex flex-col relative pb-20">
                                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                            {chatLog.map((chat, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[85%] p-4 rounded-3xl ${chat.type === 'user' ? 'bg-matte-indigo text-white rounded-br-sm' : 'bg-white shadow-sm border border-slate-gray/20 rounded-tl-sm text-charcoal'
                                                        }`}>
                                                        {chat.text}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <form onSubmit={handleChatSubmit} className="absolute bottom-0 inset-x-0 bg-app-bg pt-2">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="text"
                                                    value={chatInput}
                                                    onChange={e => setChatInput(e.target.value)}
                                                    placeholder="Reply to Marshall AI..."
                                                    className="w-full bg-white border border-slate-gray/30 rounded-full px-6 py-4 pr-16 shadow-sm focus:outline-none focus:border-matte-indigo font-medium"
                                                />
                                                <button type="submit" className="absolute right-2 p-3 bg-safety-orange text-white rounded-full hover:bg-orange-600 transition-colors">
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {studyMode === 'learn' && activeSection.learnCards && activeSection.learnCards.length > 0 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm flex flex-col items-center h-full justify-center pb-20">
                                        <div className="text-sm font-bold text-slate-gray mb-8 uppercase tracking-widest">
                                            Card {curCard + 1} of {activeSection.learnCards.length}
                                        </div>
                                        <button
                                            onClick={() => setIsFlipped(!isFlipped)}
                                            className="w-full aspect-[4/5] relative rounded-[2rem] cursor-pointer perspective-1000 mb-8"
                                        >
                                            <motion.div
                                                initial={false}
                                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                                                className="w-full h-full absolute preserve-3d shadow-xl rounded-[2rem]"
                                            >
                                                <div className="w-full h-full absolute backface-hidden bg-white text-matte-indigo rounded-[2rem] p-8 flex items-center justify-center text-center border-2 border-slate-gray/10">
                                                    <h3 className="text-3xl font-black leading-tight">{activeSection.learnCards[curCard].q}</h3>
                                                </div>
                                                <div className="w-full h-full absolute backface-hidden bg-matte-indigo text-white rounded-[2rem] p-8 flex items-center justify-center text-center shadow-lg" style={{ transform: 'rotateY(180deg)' }}>
                                                    <p className="text-2xl font-medium leading-relaxed">{activeSection.learnCards[curCard].a}</p>
                                                </div>
                                            </motion.div>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsFlipped(false);
                                                if (curCard < activeSection.learnCards.length - 1) setCurCard(c => c + 1);
                                                else setCurCard(0);
                                            }}
                                            className="w-full py-5 bg-safety-orange text-white font-black text-xl rounded-2xl shadow-md active:scale-95 transition-transform"
                                        >
                                            {curCard < activeSection.learnCards.length - 1 ? 'NEXT CARD' : 'RESTART DECK'}
                                        </button>
                                    </motion.div>
                                )}

                                {studyMode === 'test' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md h-full flex flex-col pb-10">
                                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-gray/20 mb-6">
                                            <span className="text-safety-orange font-black text-xs uppercase tracking-widest mb-2 block">Smart Grading · Marshall AI</span>
                                            <h3 className="text-xl font-bold leading-snug">{activeSection.learnCards?.[0]?.q || "Explain this section in your own words."}</h3>
                                        </div>

                                        <textarea
                                            value={testInput}
                                            onChange={e => setTestInput(e.target.value)}
                                            placeholder="Type your answer here. Marshall AI will evaluate the meaning, not exact wording..."
                                            className="w-full flex-1 bg-white border border-slate-gray/30 rounded-3xl p-6 resize-none focus:outline-none focus:ring-2 focus:ring-matte-indigo text-lg font-medium shadow-inner mb-6"
                                        />

                                        <AnimatePresence>
                                            {testResult === 'grading' && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center mb-6">
                                                    <span className="text-slate-gray font-bold animate-pulse">Marshall AI analyzing semantics...</span>
                                                </motion.div>
                                            )}

                                            {testResult === 'pass' && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} className="bg-sage-green/10 text-sage-green border-2 border-sage-green p-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6">
                                                    <CheckCircle size={24} /> Semantic Match: Correct!
                                                </motion.div>
                                            )}

                                            {testResult === 'fail' && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} className="bg-rust-red/10 text-rust-red border-2 border-rust-red p-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6">
                                                    <XCircle size={24} /> Answer lacks key concepts. Review and try again.
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            onClick={handleTestSubmit}
                                            disabled={!testInput.trim() || testResult === 'grading'}
                                            className="w-full py-5 bg-matte-indigo text-white font-black text-xl rounded-2xl shadow-md active:scale-95 transition-transform disabled:opacity-50"
                                        >
                                            SUBMIT FOR GRADING
                                        </button>
                                    </motion.div>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Academy;
