import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { machineDB } from '../data/mockData';

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const formatDate = () =>
    new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

// Extract short display name from full model string (e.g. "Volvo L70H / L90H" → "Volvo L90H")
const shortName = (model) => {
    const parts = model.split('/');
    return parts[parts.length - 1].trim();
};

const SiteSelector = () => {
    const { workerId, sites, setActiveSite } = useAppContext();
    const navigate = useNavigate();
    const [selectedSite, setSelectedSite] = useState(null);

    const totalAlerts = sites.reduce((sum, s) => sum + s.alerts, 0);

    const siteMachines = selectedSite
        ? machineDB.filter(m => selectedSite.machines.includes(m.id))
        : [];

    const handleStartShift = () => {
        setActiveSite(selectedSite);
        navigate('/permissions');
    };

    return (
        <div className="min-h-full flex flex-col bg-gray-50">
            {/* Orange header */}
            <div className="px-5 pt-10 pb-8 flex items-start justify-between" style={{ backgroundColor: '#E67E22' }}>
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-white"
                    >
                        {getGreeting()}, {workerId}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/75 text-sm mt-0.5"
                    >
                        {formatDate()}
                    </motion.p>
                </div>

                {totalAlerts > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
                    >
                        <span className="text-safety-orange font-bold text-base">{totalAlerts}</span>
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-6 pb-32">
                <p className="text-xs font-bold text-safety-orange tracking-widest uppercase mb-4 border border-safety-orange/30 rounded-full py-1 px-3 inline-block bg-orange-50">
                    Select Today's Site
                </p>

                {/* Site list */}
                <div className="flex flex-col gap-3">
                    {sites.map((site, i) => {
                        const isSelected = selectedSite?.id === site.id;
                        return (
                            <motion.button
                                key={site.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.07 }}
                                onClick={() => setSelectedSite(site)}
                                className={`w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border-2 shadow-sm transition-all text-left ${
                                    isSelected
                                        ? 'border-safety-orange shadow-md'
                                        : 'border-transparent shadow-sm hover:border-safety-orange/30'
                                }`}
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                                    style={{ backgroundColor: isSelected ? '#FFF0E6' : '#EEF2F7' }}
                                >
                                    <MapPin size={20} className="text-safety-orange" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-base leading-tight ${isSelected ? 'text-safety-orange' : 'text-gray-900'}`}>
                                        {site.name}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-0.5">{site.location}</p>
                                </div>

                                {isSelected
                                    ? <CheckCircle2 size={20} className="text-safety-orange shrink-0" />
                                    : <ChevronRight size={18} className="text-gray-300 shrink-0" />
                                }
                            </motion.button>
                        );
                    })}
                </div>

                {/* Machines Today */}
                <AnimatePresence>
                    {selectedSite && siteMachines.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.25 }}
                            className="mt-6"
                        >
                            <p className="text-xs font-bold text-safety-orange tracking-widest uppercase mb-3">
                                Machines Today
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {siteMachines.map(machine => (
                                    <span
                                        key={machine.id}
                                        className="px-4 py-1.5 rounded-full border border-safety-orange text-safety-orange text-sm font-semibold bg-white"
                                    >
                                        {shortName(machine.model)}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Start Shift button */}
            <AnimatePresence>
                {selectedSite && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50/90 backdrop-blur-sm border-t border-gray-200"
                    >
                        <button
                            onClick={handleStartShift}
                            className="w-full text-white font-bold text-lg py-4 rounded-full hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#E67E22' }}
                        >
                            Start Shift
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SiteSelector;
