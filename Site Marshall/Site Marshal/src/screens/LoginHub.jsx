import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, AlertCircle } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import Keypad from '../components/UI/Keypad';
import { login as apiLogin } from '../services/api';

// Custom React-Bits style BlurText Animation
const BlurText = ({ text, delay = 0, className = "" }) => {
    const words = text.split(" ");
    return (
        <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: delay + i * 0.1, ease: 'easeOut' }}
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
};

const LoginHub = () => {
    const { login, t, currentLang, changeLanguage, availableLanguages } = useAppContext();
    const navigate = useNavigate();
    const [workerInput, setWorkerInput] = useState("");
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currentLangData = availableLanguages.find(l => l.code === currentLang);

    const handleKeyPress = (val) => {
        if (workerInput.length < 6) {
            setWorkerInput(prev => prev + val);
        }
        setError(null);
    };

    const handleDelete = () => {
        setWorkerInput(prev => prev.slice(0, -1));
        setError(null);
    };

    const handleLogin = async () => {
        if (workerInput.length < 3) {
            setError('Enter at least 3 digits');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await apiLogin(workerInput);
            if (res.success) {
                login(workerInput, res.training_count ?? 0);
                navigate('/dashboard');
            } else {
                setError('Login failed. Try again.');
            }
        } catch (err) {
            // If the backend is unreachable, still allow login (offline-first)
            console.warn('Backend unreachable, logging in offline:', err.message);
            login(workerInput, 0);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-8 flex flex-col h-full items-center justify-center space-y-8 safe-area-pb"
        >
            <div className="text-center space-y-2 mt-8">
                <BlurText text={t('welcome')} className="text-3xl font-bold text-matte-indigo" />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-slate-gray"
                >
                    {t('enter_id')}
                </motion.p>
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
                className="w-full max-w-sm bg-app-bg rounded-2xl p-6 shadow-2xl border border-slate-gray/30 relative overflow-hidden"
            >
                <div className="absolute inset-x-0 -top-10 h-20 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none" />
                <div className="w-full h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-mono tracking-widest text-matte-indigo mb-4 border-b-2 border-slate-gray shadow-inner">
                    {workerInput || "---"}
                </div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-rust-red text-sm font-bold mb-3"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Keypad
                    onKeyPress={handleKeyPress}
                    onDelete={handleDelete}
                    onSubmit={handleLogin}
                    submitLabel={loading ? '...' : t('login')}
                    disabled={loading}
                />
            </motion.div>

            {/* Language Hub Dropdown */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-sm px-2 mt-auto pb-4 relative"
            >
                <div className="relative">
                    <button
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-gray/30 shadow-sm transition-colors hover:border-matte-indigo"
                    >
                        <div className="flex items-center gap-3">
                            {currentLangData ? React.createElement(Flags[currentLangData.flag], { title: currentLangData.name, className: "w-6 h-6 rounded-sm shadow-sm" }) : <Globe size={24} className="text-matte-indigo" />}
                            <span className="font-bold text-lg text-charcoal tracking-wide">
                                {currentLangData ? currentLangData.name : "Select Language"}
                            </span>
                        </div>
                        <motion.div animate={{ rotate: langDropdownOpen ? 180 : 0 }}>
                            <ChevronDown size={20} className="text-slate-gray" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {langDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-2xl border border-slate-gray/20 overflow-hidden z-50 max-h-64 overflow-y-auto"
                            >
                                {availableLanguages.map((lang) => {
                                    const Flag = Flags[lang.flag];
                                    const isActive = currentLang === lang.code;
                                    return (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                changeLanguage(lang.code);
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between p-4 hover:bg-slate-gray/10 transition-colors border-b border-slate-gray/10 last:border-0 ${isActive ? 'bg-deep-concrete/5 border-l-4 border-l-matte-indigo' : ''
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {Flag && <Flag title={lang.name} className="w-8 h-8 rounded-md shadow-sm border border-slate-gray/10" />}
                                                <span className={`font-bold text-lg ${isActive ? 'text-matte-indigo' : 'text-charcoal'}`}>
                                                    {lang.name}
                                                </span>
                                            </div>
                                            <span className="text-xs font-black text-slate-gray uppercase tracking-widest">{lang.flag}</span>
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LoginHub;
