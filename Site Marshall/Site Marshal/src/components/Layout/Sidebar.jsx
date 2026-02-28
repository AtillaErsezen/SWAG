import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { X, ChevronRight, Tractor, Settings, ShieldAlert, Award, UserCircle } from 'lucide-react';
import { machineDB } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { sidebarOpen, toggleSidebar, t, workerId, setActiveMachineId, tMachine } = useAppContext();
    const navigate = useNavigate();

    const handleMachineSelect = (id) => {
        setActiveMachineId(id);
        toggleSidebar();
        navigate(`/machine/${id}`);
    };

    return (
        <AnimatePresence>
            {sidebarOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-charcoal z-40 lg:hidden"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 left-0 h-full w-80 bg-matte-indigo text-app-bg z-50 shadow-2xl flex flex-col"
                    >
                        <div className="p-4 flex items-center justify-between border-b border-deep-concrete">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="text-safety-orange" />
                                <h2 className="text-xl font-bold">{t('fleet_drawer')}</h2>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 hover:bg-deep-concrete rounded-md transition-colors lg:hidden"
                                aria-label="Close menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {workerId ? (
                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="px-4 text-xs font-semibold text-slate-gray uppercase tracking-wider mb-2">
                                    {t('sidebar_active_machines')}
                                </div>
                                <ul className="space-y-1">
                                    {machineDB.map((machine) => (
                                        <li key={machine.id}>
                                            <button
                                                onClick={() => handleMachineSelect(machine.id)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-deep-concrete transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Tractor className="text-sage-green" size={20} />
                                                    <div>
                                                        <div className="font-medium text-app-bg">{machine.model}</div>
                                                        <div className="text-[10px] text-slate-gray uppercase tracking-widest mt-0.5">{tMachine(machine.type)}</div>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${machine.trainingProgress === 100 ? 'bg-sage-green' : 'bg-safety-orange'}`}
                                                                    style={{ width: `${machine.trainingProgress}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[9px] font-bold text-slate-gray">{machine.trainingProgress}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} className="text-slate-gray" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Gamification Badges */}
                                <div className="px-4 py-4 mt-2 border-t border-deep-concrete">
                                    <div className="text-xs font-semibold text-slate-gray uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Award size={14} /> {t('sidebar_earned_certs')}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {machineDB.flatMap(m =>
                                            (m.units || []).filter(u => u.completed).map(u => (
                                                <div key={`${m.id}-${u.id}`} className="bg-ind-yellow/10 text-ind-yellow px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                                    <Award size={12} />
                                                    {u.title}
                                                </div>
                                            ))
                                        )}
                                        {machineDB.flatMap(m => (m.units || []).filter(u => u.completed)).length === 0 && (
                                            <p className="text-[10px] text-slate-gray italic">{t('sidebar_cert_instruction')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-gray">
                                {t('sidebar_login_prompt')}
                            </div>
                        )}

                        <div className="p-4 border-t border-deep-concrete">
                            <button
                                onClick={() => {
                                    toggleSidebar();
                                    navigate('/settings');
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-deep-concrete rounded-md transition-colors text-left"
                            >
                                <Settings size={20} className="text-slate-gray" />
                                <span>{t('sidebar_settings')}</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
