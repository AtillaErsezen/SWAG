import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Volume2, WifiOff, Layout, Bell, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Toggle = ({ label, icon: Icon, defaultChecked = false }) => {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <button
            onClick={() => setChecked(!checked)}
            className="w-full flex items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-slate-gray/20 hover:shadow-md transition-shadow active:scale-95 text-left"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${checked ? 'bg-matte-indigo text-white' : 'bg-slate-gray/10 text-slate-gray'}`}>
                    <Icon size={24} />
                </div>
                <span className="font-bold text-lg text-charcoal">{label}</span>
            </div>
            <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-sage-green' : 'bg-slate-gray/30'}`}>
                <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-sm"
                    animate={{ x: checked ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
        </button>
    );
};

const Settings = () => {
    const navigate = useNavigate();
    const { logout, t } = useAppContext();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex flex-col h-full bg-app-bg text-charcoal absolute inset-0 z-50 overflow-hidden">
            <div className="bg-matte-indigo p-4 pt-6 pb-6 text-app-bg flex items-center shadow-lg relative">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 hover:bg-slate-gray/20 rounded-2xl transition-all active:scale-95"
                >
                    <ChevronLeft size={28} />
                </button>
                <div className="ml-2">
                    <h2 className="text-xl font-bold tracking-tight">{t('settings_title')}</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-20">

                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest pl-2">{t('preferences')}</h3>
                    <Toggle label="Text-To-Speech Audio" icon={Volume2} defaultChecked={true} />
                    <Toggle label="Offline Mode Cache" icon={WifiOff} defaultChecked={false} />
                    <Toggle label="High Contrast Layout" icon={Layout} defaultChecked={false} />
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest pl-2">{t('notifications')}</h3>
                    <Toggle label="Push Alerts" icon={Bell} defaultChecked={true} />
                    <Toggle label="Safety Digests" icon={Shield} defaultChecked={true} />
                </div>

                <div className="pt-8 w-full max-w-sm mx-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full py-5 bg-rust-red/10 text-rust-red border-2 border-rust-red/30 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-sm hover:bg-rust-red hover:text-white transition-colors active:scale-95"
                    >
                        <LogOut size={24} />
                        {t('logout_worker')}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;
