import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, BookOpen, FileText, CheckCircle, XCircle, Send, Play, Layers, Trophy, RotateCcw } from 'lucide-react';
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

// ─── Letter labels for answer options ────────────────────────────────────────
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ─── Multiple-Choice Quiz Component ──────────────────────────────────────────
const MultipleChoiceQuiz = ({ cards }) => {
    const [qIndex, setQIndex] = useState(0);
    const [selected, setSelected] = useState(null);   // index of chosen option
    const [revealed, setRevealed] = useState(false);  // answer revealed?
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const total = cards.length;
    const card = cards[qIndex];

    const handleSelect = (optIdx) => {
        if (revealed) return;
        setSelected(optIdx);
    };

    const handleConfirm = () => {
        if (selected === null || revealed) return;
        setRevealed(true);
        if (selected === card.correct) setScore(s => s + 1);
    };

    const handleNext = () => {
        if (qIndex < total - 1) {
            setQIndex(i => i + 1);
            setSelected(null);
            setRevealed(false);
        } else {
            setFinished(true);
        }
    };

    const handleRestart = () => {
        setQIndex(0);
        setSelected(null);
        setRevealed(false);
        setScore(0);
        setFinished(false);
    };

    if (finished) {
        const pct = Math.round((score / total) * 100);
        const passed = pct >= 70;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm mx-auto flex flex-col items-center gap-6 pt-8"
            >
                {/* Score ring */}
                <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg ${passed ? 'bg-sage-green text-white' : 'bg-rust-red text-white'}`}>
                    <Trophy size={32} className="mb-1 opacity-80" />
                    <span className="text-4xl font-black">{pct}%</span>
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-black text-matte-indigo mb-1">
                        {passed ? 'Well done!' : 'Keep studying'}
                    </h3>
                    <p className="text-slate-gray font-medium">
                        {score} of {total} correct
                    </p>
                </div>

                {/* Per-question breakdown */}
                <div className="w-full space-y-2">
                    {cards.map((c, i) => (
                        <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-gray/10">
                            <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${c._userAnswer === c.correct ? 'bg-sage-green text-white' : 'bg-rust-red text-white'}`}>
                                {c._userAnswer === c.correct ? '✓' : '✗'}
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-charcoal leading-snug">{c.q}</p>
                                {c._userAnswer !== c.correct && (
                                    <p className="text-xs text-rust-red mt-1 font-medium">
                                        Correct: {c.options[c.correct]}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleRestart}
                    className="w-full py-5 bg-matte-indigo text-white font-black text-lg rounded-2xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                    <RotateCcw size={22} />
                    RETAKE QUIZ
                </button>
            </motion.div>
        );
    }

    // Track user answers for the breakdown page
    card._userAnswer = selected !== null && revealed ? selected : card._userAnswer;

    return (
        <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-md mx-auto flex flex-col gap-5 pb-10"
        >
            {/* Progress bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-gray/15 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-matte-indigo"
                        initial={{ width: `${(qIndex / total) * 100}%` }}
                        animate={{ width: `${((qIndex + 1) / total) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <span className="text-xs font-black text-slate-gray whitespace-nowrap">
                    {qIndex + 1} / {total}
                </span>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-gray/20">
                <span className="text-safety-orange font-black text-xs uppercase tracking-widest mb-3 block">
                    Question {qIndex + 1}
                </span>
                <h3 className="text-xl font-black text-matte-indigo leading-snug">
                    {card.q}
                </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {card.options.map((opt, i) => {
                    const isCorrect = i === card.correct;
                    const isSelected = i === selected;

                    let bg = 'bg-white hover:bg-slate-gray/5 border-slate-gray/20 text-charcoal';
                    if (revealed) {
                        if (isCorrect) {
                            bg = 'bg-sage-green/15 border-sage-green text-sage-green';
                        } else if (isSelected && !isCorrect) {
                            bg = 'bg-rust-red/15 border-rust-red text-rust-red';
                        } else {
                            bg = 'bg-white border-slate-gray/15 text-slate-gray opacity-60';
                        }
                    } else if (isSelected) {
                        bg = 'bg-matte-indigo/10 border-matte-indigo text-matte-indigo';
                    }

                    return (
                        <motion.button
                            key={i}
                            whileTap={!revealed ? { scale: 0.97 } : {}}
                            onClick={() => handleSelect(i)}
                            className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all font-medium ${bg}`}
                        >
                            {/* Letter badge */}
                            <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-colors
                                ${revealed && isCorrect ? 'bg-sage-green text-white' :
                                    revealed && isSelected && !isCorrect ? 'bg-rust-red text-white' :
                                        isSelected ? 'bg-matte-indigo text-white' :
                                            'bg-slate-gray/10 text-slate-gray'
                                }`}
                            >
                                {OPTION_LABELS[i]}
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                            {revealed && isCorrect && <CheckCircle size={22} className="flex-shrink-0 text-sage-green" />}
                            {revealed && isSelected && !isCorrect && <XCircle size={22} className="flex-shrink-0 text-rust-red" />}
                        </motion.button>
                    );
                })}
            </div>

            {/* Action buttons */}
            <AnimatePresence mode="wait">
                {!revealed ? (
                    <motion.button
                        key="confirm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={handleConfirm}
                        disabled={selected === null}
                        className="w-full py-5 bg-matte-indigo text-white font-black text-lg rounded-2xl shadow-md active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        CONFIRM ANSWER
                    </motion.button>
                ) : (
                    <motion.button
                        key="next"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={handleNext}
                        className="w-full py-5 bg-safety-orange text-white font-black text-lg rounded-2xl shadow-md active:scale-95 transition-transform"
                    >
                        {qIndex < total - 1 ? 'NEXT QUESTION →' : 'SEE RESULTS'}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Live score chip */}
            <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-slate-gray font-medium">Score so far:</span>
                <span className="text-sm font-black text-matte-indigo">
                    {score} / {qIndex + (revealed ? 1 : 0)}
                </span>
            </div>
        </motion.div>
    );
};

// ─── Main Academy Screen ──────────────────────────────────────────────────────
const Academy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useAppContext();

    const [view, setView] = useState('overview');
    const [activeSection, setActiveSection] = useState(null);
    const [studyMode, setStudyMode] = useState('summary');
    const [expandedUnits, setExpandedUnits] = useState({});

    // Learn Mode State
    const [curCard, setCurCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Marshall AI Chat State
    const [chatInput, setChatInput] = useState('');
    const [chatLog, setChatLog] = useState([]);

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
                                    { id: 'learn', icon: BookOpen, label: 'Learn' },
                                    { id: 'test', icon: Play, label: 'Test' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setStudyMode(tab.id)}
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

{studyMode === 'learn' && activeSection.learnCards && activeSection.learnCards.length > 0 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm flex flex-col items-center h-full justify-center pb-20">
                                        <div className="text-sm font-bold text-slate-gray mb-8 uppercase tracking-widest">
                                            Card {curCard + 1} of {activeSection.learnCards.length}
                                        </div>

                                        {/* Flashcard Container */}
                                        <div
                                            onClick={() => setIsFlipped(!isFlipped)}
                                            className="w-full aspect-[4/5] relative rounded-[2rem] cursor-pointer perspective-1000 mb-8"
                                        >
                                            <motion.div
                                                initial={false}
                                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                                                className="w-full h-full relative preserve-3d shadow-xl rounded-[2rem]"
                                            >
                                                {/* Front Side */}
                                                <div
                                                    className="w-full h-full absolute inset-0 backface-hidden bg-white text-matte-indigo rounded-[2rem] p-8 flex items-center justify-center text-center border-2 border-slate-gray/10"
                                                    style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                                                >
                                                    <h3 className="text-3xl font-black leading-tight">{activeSection.learnCards[curCard].q}</h3>
                                                </div>

                                                {/* Back Side */}
                                                <div
                                                    className="w-full h-full absolute inset-0 backface-hidden bg-matte-indigo text-white rounded-[2rem] p-8 flex items-center justify-center text-center shadow-lg"
                                                    style={{
                                                        transform: 'rotateY(180deg)',
                                                        WebkitBackfaceVisibility: 'hidden',
                                                        backfaceVisibility: 'hidden'
                                                    }}
                                                >
                                                    <p className="text-2xl font-medium leading-relaxed">
                                                        {activeSection.learnCards[curCard].a}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Action Button - Only visible when card is flipped */}
                                        <div className="w-full h-20"> {/* Fixed height container to prevent layout jump */}
                                            <AnimatePresence>
                                                {isFlipped && (
                                                    <motion.button
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent the card from flipping back immediately
                                                            setIsFlipped(false);
                                                            setTimeout(() => {
                                                                if (curCard < activeSection.learnCards.length - 1) setCurCard(c => c + 1);
                                                                else setCurCard(0);
                                                            }, 150); // Small delay to let the card flip back before content changes
                                                        }}
                                                        className="w-full py-5 bg-safety-orange text-white font-black text-xl rounded-2xl shadow-md active:scale-95 transition-transform"
                                                    >
                                                        {curCard < activeSection.learnCards.length - 1 ? 'NEXT CARD' : 'RESTART DECK'}
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Multiple-Choice Test Tab ── */}
                                {studyMode === 'test' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full max-w-md"
                                    >
                                        {activeSection.learnCards && activeSection.learnCards.length > 0 ? (
                                            <>
                                                {/* Header banner */}
                                                <div className="bg-white rounded-[2rem] p-5 mb-6 border border-slate-gray/20 shadow-sm flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-matte-indigo/10 flex items-center justify-center flex-shrink-0">
                                                        <Trophy size={24} className="text-matte-indigo" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-matte-indigo text-base leading-tight">Knowledge Check</h4>
                                                        <p className="text-slate-gray text-xs mt-0.5">
                                                            {activeSection.learnCards.length} multiple-choice questions · pass at 70%
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* The quiz engine — key forces a full remount when section changes */}
                                                <MultipleChoiceQuiz
                                                    key={activeSection.id}
                                                    cards={activeSection.learnCards}
                                                />
                                            </>
                                        ) : (
                                            <div className="text-center text-slate-gray mt-10 font-medium">
                                                No quiz questions available for this section yet.
                                            </div>
                                        )}
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
