import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle, Circle, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { machineDB, checklistDB } from '../data/mockData';
import { useAppContext } from '../context/AppContext';


const PreShiftChecklist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useAppContext();
    const machine = machineDB.find(m => m.id === id);
    const [checked, setChecked] = useState({});

    if (!machine) return <div className="p-8">{t('machine_not_found')}</div>;

    const items = checklistDB[machine.type] || checklistDB["Crawler Excavator"];

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
                    <h2 className="text-xl font-bold tracking-tight">{t('pre_shift_inspection')}</h2>
                    <p className="text-xs text-slate-gray font-medium uppercase tracking-widest">{machine.model} · {machine.type}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-40">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-black text-slate-gray uppercase tracking-widest">{totalChecked} {t('of')} {items.length} {t('items_verified')}</span>
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
                        <p className="text-rust-red font-bold text-sm">{criticalsMissing} {t('critical_items_remaining_part1')} {criticalsMissing > 1 ? 's' : ''} {t('critical_items_remaining_part2')}</p>
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
                                    {t(item.label)}
                                </span>
                                {item.critical && !checked[item.id] && (
                                    <span className="block text-[10px] font-black text-rust-red uppercase tracking-widest mt-1">{t('critical_mandatory')}</span>
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
                    {allChecked ? t('sign_off_proceed') : `${items.length - totalChecked} ${t('items_remaining_caps')}`}
                </button>
            </div>
        </div>
    );
};

export default PreShiftChecklist;
