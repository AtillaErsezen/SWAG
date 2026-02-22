import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle, Circle, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { machineDB } from '../data/mockData';

const checklistItems = {
    "Excavator": [
        { id: 'c1', label: 'Engine oil level verified', critical: true },
        { id: 'c2', label: 'Hydraulic fluid level verified', critical: true },
        { id: 'c3', label: 'Coolant level verified', critical: true },
        { id: 'c4', label: 'Tracks and undercarriage inspected', critical: false },
        { id: 'c5', label: 'All mirrors and cameras clean', critical: false },
        { id: 'c6', label: 'Fire extinguisher present and charged', critical: true },
        { id: 'c7', label: 'Seat belt functional', critical: true },
        { id: 'c8', label: 'Horn and backup alarm tested', critical: false },
        { id: 'c9', label: 'No visible hydraulic leaks', critical: true },
        { id: 'c10', label: 'PPE worn (hardhat, vest, boots)', critical: true },
    ],
    "Mobile Crane": [
        { id: 'c1', label: 'Outrigger pads and timber mats staged', critical: true },
        { id: 'c2', label: 'Load chart for planned lift reviewed', critical: true },
        { id: 'c3', label: 'Wind speed below operational limit', critical: true },
        { id: 'c4', label: 'Overhead power line survey complete', critical: true },
        { id: 'c5', label: 'All rigging and slings inspected', critical: true },
        { id: 'c6', label: 'Boom and jib visually inspected', critical: false },
        { id: 'c7', label: 'Anti-two-block device tested', critical: true },
        { id: 'c8', label: 'Ground conditions assessed', critical: true },
        { id: 'c9', label: 'Fire extinguisher present and charged', critical: true },
        { id: 'c10', label: 'PPE worn (hardhat, vest, boots)', critical: true },
    ]
};

const PreShiftChecklist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const machine = machineDB.find(m => m.id === id);
    const [checked, setChecked] = useState({});

    if (!machine) return <div className="p-8">Machine Not Found</div>;

    const items = checklistItems[machine.type] || checklistItems["Excavator"];
    const totalChecked = Object.values(checked).filter(Boolean).length;
    const allChecked = totalChecked === items.length;
    const criticalsMissing = items.filter(i => i.critical && !checked[i.id]).length;

    const toggle = (itemId) => {
        setChecked(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const handleSubmit = () => {
        if (allChecked) navigate(`/machine/${id}`);
    };

    return (
        <div className="flex flex-col h-full bg-app-bg text-charcoal absolute inset-0 z-50 overflow-hidden">
            <div className="bg-matte-indigo p-4 pt-6 pb-6 text-app-bg flex items-center shadow-lg relative">
                <button onClick={() => navigate('/dashboard')} className="p-3 hover:bg-slate-gray/20 rounded-2xl transition-all active:scale-95">
                    <ChevronLeft size={28} />
                </button>
                <div className="ml-2">
                    <h2 className="text-xl font-bold tracking-tight">Pre-Shift Inspection</h2>
                    <p className="text-xs text-slate-gray font-medium uppercase tracking-widest">{machine.model} · {machine.type}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-40">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-black text-slate-gray uppercase tracking-widest">{totalChecked} of {items.length} items verified</span>
                        <span className="text-sm font-black text-matte-indigo">{Math.round((totalChecked / items.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-gray/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${allChecked ? 'bg-sage-green' : 'bg-safety-orange'}`}
                            animate={{ width: `${(totalChecked / items.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {criticalsMissing > 0 && (
                    <div className="bg-rust-red/10 border border-rust-red/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
                        <AlertTriangle size={24} className="text-rust-red flex-shrink-0" />
                        <p className="text-rust-red font-bold text-sm">{criticalsMissing} critical item{criticalsMissing > 1 ? 's' : ''} remaining. Machine operation is prohibited until all critical items are verified.</p>
                    </div>
                )}

                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => toggle(item.id)}
                            className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all active:scale-[0.98] text-left ${checked[item.id]
                                    ? 'bg-sage-green/5 border-sage-green/30'
                                    : item.critical
                                        ? 'bg-white border-rust-red/20 shadow-sm'
                                        : 'bg-white border-slate-gray/20 shadow-sm'
                                }`}
                        >
                            {checked[item.id]
                                ? <CheckCircle size={28} className="text-sage-green flex-shrink-0" />
                                : <Circle size={28} className={`flex-shrink-0 ${item.critical ? 'text-rust-red' : 'text-slate-gray'}`} />
                            }
                            <div className="flex-1 min-w-0">
                                <span className={`font-bold text-base leading-tight ${checked[item.id] ? 'opacity-50 line-through' : ''}`}>
                                    {item.label}
                                </span>
                                {item.critical && !checked[item.id] && (
                                    <span className="block text-[10px] font-black text-rust-red uppercase tracking-widest mt-1">CRITICAL · MANDATORY</span>
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Fixed Submit Button */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-app-bg via-app-bg to-transparent">
                <button
                    onClick={handleSubmit}
                    disabled={!allChecked}
                    className={`w-full py-5 font-black text-xl rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 ${allChecked
                            ? 'bg-sage-green text-white'
                            : 'bg-slate-gray/20 text-slate-gray cursor-not-allowed'
                        }`}
                >
                    <ClipboardCheck size={24} />
                    {allChecked ? 'SIGN OFF & PROCEED' : `${items.length - totalChecked} ITEMS REMAINING`}
                </button>
            </div>
        </div>
    );
};

export default PreShiftChecklist;
