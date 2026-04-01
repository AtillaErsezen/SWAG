import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Volume2, Wind, Sun } from 'lucide-react';

const mockData = [
    { icon: Thermometer, label: 'Temp', value: '33°C', warn: true, threshold: '> 35°C = Mandatory Break' },
    { icon: Volume2, label: 'Noise', value: '82 dB', warn: false, threshold: '> 85 dB = Hearing Protection' },
    { icon: Wind, label: 'Wind', value: '14 km/h', warn: false, threshold: '> 40 km/h = Cease Crane Ops' },
    { icon: Sun, label: 'UV', value: '7 (High)', warn: true, threshold: '> 8 = Sunscreen & Shade Breaks' },
];

const EnvironmentalWidget = () => {
    return (
        <div className="grid grid-cols-4 gap-2">
            {mockData.map((item, idx) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-white rounded-xl p-2 text-center shadow-sm border ${item.warn ? 'border-safety-orange/40' : 'border-slate-gray/20'
                        }`}
                    title={item.threshold}
                >
                    <item.icon size={16} className={`mx-auto mb-1 ${item.warn ? 'text-safety-orange' : 'text-slate-gray'}`} />
                    <div className={`text-xs font-black ${item.warn ? 'text-safety-orange' : 'text-charcoal'}`}>{item.value}</div>
                    <div className="text-[8px] font-bold text-slate-gray uppercase tracking-widest">{item.label}</div>
                </motion.div>
            ))}
        </div>
    );
};

export default EnvironmentalWidget;
