import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, Users, BarChart3, Globe, AlertTriangle, Clock, Shield, UserCircle, CheckCircle, XCircle, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { machineDB, workerRegistry } from '../data/mockData';

const SupervisorDashboard = () => {
    const navigate = useNavigate();
    const [expandedWorker, setExpandedWorker] = useState(null);

    const totalMachines = machineDB.length;
    const avgProgress = Math.round(machineDB.reduce((a, m) => a + m.trainingProgress, 0) / totalMachines);

    const toggleWorker = (workerId) => {
        setExpandedWorker(prev => prev === workerId ? null : workerId);
    };

    const getWorkerCompletionPercent = (worker) => {
        if (worker.totalSections === 0) return 0;
        return Math.round((worker.completedSections.length / worker.totalSections) * 100);
    };

    const getCompletionColor = (pct) => {
        if (pct >= 70) return 'text-sage-green';
        if (pct >= 40) return 'text-safety-orange';
        return 'text-rust-red';
    };

    const getCompletionBg = (pct) => {
        if (pct >= 70) return 'bg-sage-green';
        if (pct >= 40) return 'bg-safety-orange';
        return 'bg-rust-red';
    };

    const langMap = { tr: 'Turkish', pl: 'Polish', ar: 'Arabic', uk: 'Ukrainian', id: 'Indonesian', pt: 'Portuguese', en: 'English' };

    // Build language risk data from worker registry
    const langGroups = {};
    workerRegistry.forEach(w => {
        if (!langGroups[w.language]) langGroups[w.language] = { workers: 0, totalCompletion: 0 };
        langGroups[w.language].workers += 1;
        langGroups[w.language].totalCompletion += getWorkerCompletionPercent(w);
    });
    const langRiskData = Object.entries(langGroups).map(([lang, data]) => {
        const avgComp = Math.round(data.totalCompletion / data.workers);
        let risk = 'low';
        if (avgComp < 30) risk = 'critical';
        else if (avgComp < 50) risk = 'high';
        else if (avgComp < 70) risk = 'medium';
        return { lang: langMap[lang] || lang, workers: data.workers, avgCompletion: avgComp, riskLevel: risk };
    }).sort((a, b) => a.avgCompletion - b.avgCompletion);

    const getRiskColor = (level) => {
        switch (level) {
            case 'critical': return 'text-rust-red bg-rust-red/10';
            case 'high': return 'text-safety-orange bg-safety-orange/10';
            case 'medium': return 'text-ind-yellow bg-ind-yellow/10';
            case 'low': return 'text-sage-green bg-sage-green/10';
            default: return 'text-slate-gray bg-slate-gray/10';
        }
    };

    // Get section title by "m-1:1.1" format
    const getSectionTitle = (sectionKey) => {
        const [machineId, sectionId] = sectionKey.split(':');
        const machine = machineDB.find(m => m.id === machineId);
        if (!machine) return sectionKey;
        for (const unit of machine.units || []) {
            const section = unit.sections.find(s => s.id === sectionId);
            if (section) return section.title;
        }
        return sectionKey;
    };

    const getMachineName = (machineId) => {
        const m = machineDB.find(m => m.id === machineId);
        return m ? m.model : machineId;
    };

    return (
        <div className="flex flex-col h-full bg-app-bg text-charcoal absolute inset-0 overflow-hidden">
            <div className="bg-matte-indigo p-4 pt-6 pb-6 text-app-bg flex items-center shadow-lg relative flex-none">
                <button onClick={() => navigate('/dashboard')} className="p-3 hover:bg-slate-gray/20 rounded-2xl transition-all active:scale-95">
                    <ChevronLeft size={28} />
                </button>
                <div className="ml-2">
                    <h2 className="text-xl font-bold tracking-tight">Supervisor Analytics</h2>
                    <p className="text-xs text-slate-gray font-medium uppercase tracking-widest">Site Overview</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 space-y-6">

                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Workers', value: String(workerRegistry.length), icon: Users, color: 'text-electric-cyan' },
                        { label: 'Fleet Avg.', value: `${avgProgress}%`, icon: BarChart3, color: 'text-safety-orange' },
                        { label: 'Languages', value: String(Object.keys(langGroups).length), icon: Globe, color: 'text-ind-yellow' },
                    ].map((kpi, idx) => (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-gray/20 text-center"
                        >
                            <kpi.icon size={24} className={`mx-auto mb-2 ${kpi.color}`} />
                            <div className="text-2xl font-black text-matte-indigo">{kpi.value}</div>
                            <div className="text-[10px] font-bold text-slate-gray uppercase tracking-widest">{kpi.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Worker-by-Worker Inspection and Completion */}
                <div>
                    <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                        <UserCircle size={16} /> Worker Compliance Tracker
                    </h3>
                    <div className="space-y-3">
                        {workerRegistry.map((worker, idx) => {
                            const pct = getWorkerCompletionPercent(worker);
                            const isExpanded = expandedWorker === worker.id;
                            const preShiftDone = Object.values(worker.preShiftCompleted).filter(Boolean).length;
                            const preShiftTotal = Object.keys(worker.preShiftCompleted).length;

                            return (
                                <motion.div
                                    key={worker.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-gray/20 overflow-hidden"
                                >
                                    {/* Worker Header */}
                                    <button
                                        onClick={() => toggleWorker(worker.id)}
                                        className="w-full p-4 flex items-center justify-between text-left hover:bg-app-bg/50 transition-colors active:scale-[0.99]"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getCompletionBg(pct)}/10`}>
                                                <UserCircle size={24} className={getCompletionColor(pct)} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-base truncate">{worker.name}</div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-mono font-bold text-slate-gray">{worker.id}</span>
                                                    <span className="text-[10px] text-slate-gray">|</span>
                                                    <span className="text-[10px] text-slate-gray uppercase">{langMap[worker.language] || worker.language}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="text-right">
                                                <div className={`text-lg font-black ${getCompletionColor(pct)}`}>{pct}%</div>
                                                <div className="text-[9px] text-slate-gray font-bold uppercase">{worker.completedSections.length}/{worker.totalSections}</div>
                                            </div>
                                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                <ChevronDown size={18} className="text-slate-gray" />
                                            </motion.div>
                                        </div>
                                    </button>

                                    {/* Expanded Worker Detail */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden border-t border-slate-gray/10"
                                            >
                                                <div className="p-4 space-y-4">
                                                    {/* Pre-Shift Checklist Status */}
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-gray uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                            <ClipboardCheck size={12} /> Pre-Shift Inspections
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.entries(worker.preShiftCompleted).map(([machineId, done]) => (
                                                                <div
                                                                    key={machineId}
                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold ${done
                                                                            ? 'bg-sage-green/10 text-sage-green'
                                                                            : 'bg-rust-red/10 text-rust-red'
                                                                        }`}
                                                                >
                                                                    {done ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                                    {getMachineName(machineId)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Completed Sections */}
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-gray uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                            <Shield size={12} /> Completed Sections ({worker.completedSections.length})
                                                        </div>
                                                        {worker.completedSections.length === 0 ? (
                                                            <p className="text-[11px] text-slate-gray italic">No sections completed yet.</p>
                                                        ) : (
                                                            <div className="space-y-1.5">
                                                                {worker.completedSections.map(sectionKey => {
                                                                    const machineId = sectionKey.split(':')[0];
                                                                    return (
                                                                        <div key={sectionKey} className="flex items-center gap-2 text-[11px]">
                                                                            <CheckCircle size={14} className="text-sage-green flex-shrink-0" />
                                                                            <span className="font-bold text-charcoal truncate">{getSectionTitle(sectionKey)}</span>
                                                                            <span className="text-[9px] text-slate-gray flex-shrink-0 ml-auto">{getMachineName(machineId)}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Last Active */}
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-gray pt-1 border-t border-slate-gray/10">
                                                        <Clock size={12} />
                                                        Last active: {worker.lastActive}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Fleet Completion Heatmap */}
                <div>
                    <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BarChart3 size={16} /> Fleet Training Completion
                    </h3>
                    <div className="space-y-3">
                        {machineDB.map(machine => (
                            <div key={machine.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-gray/20">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <span className="font-bold text-base">{machine.model}</span>
                                        <span className="text-[10px] text-slate-gray ml-2 uppercase">{machine.type}</span>
                                    </div>
                                    <span className={`text-sm font-black ${machine.trainingProgress >= 70 ? 'text-sage-green' : machine.trainingProgress >= 40 ? 'text-safety-orange' : 'text-rust-red'}`}>
                                        {machine.trainingProgress}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-slate-gray/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${machine.trainingProgress}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className={`h-full ${machine.trainingProgress >= 70 ? 'bg-sage-green' : machine.trainingProgress >= 40 ? 'bg-safety-orange' : 'bg-rust-red'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Language Risk Matrix */}
                <div>
                    <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertTriangle size={16} /> Language Risk Matrix
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-gray/20 overflow-hidden">
                        <div className="grid grid-cols-4 gap-0 text-[10px] font-black text-slate-gray uppercase tracking-widest p-3 border-b border-slate-gray/10">
                            <span>Language</span>
                            <span className="text-center">Workers</span>
                            <span className="text-center">Avg %</span>
                            <span className="text-right">Risk</span>
                        </div>
                        {langRiskData.map(row => (
                            <div key={row.lang} className="grid grid-cols-4 gap-0 p-3 border-b border-slate-gray/5 items-center">
                                <span className="font-bold text-sm">{row.lang}</span>
                                <span className="text-center text-sm font-medium text-slate-gray">{row.workers}</span>
                                <span className="text-center text-sm font-bold">{row.avgCompletion}%</span>
                                <div className="flex justify-end">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${getRiskColor(row.riskLevel)}`}>
                                        {row.riskLevel}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SupervisorDashboard;
