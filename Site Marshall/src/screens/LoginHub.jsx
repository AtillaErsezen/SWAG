import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertCircle, IdCard } from 'lucide-react';
import { login as apiLogin } from '../services/api';

const SiteMarshallLogo = () => (
    <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hexagon */}
        <polygon
            points="32,3 57,17.5 57,46.5 32,61 7,46.5 7,17.5"
            stroke="#E67E22"
            strokeWidth="3"
            fill="none"
        />
        {/* Central dot */}
        <circle cx="32" cy="32" r="3.5" fill="#E67E22" />
        {/* Inner arcs */}
        <path d="M24.5,24.5 A10.5,10.5 0 0,1 39.5,24.5" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M24.5,39.5 A10.5,10.5 0 0,0 39.5,39.5" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Outer arcs */}
        <path d="M20,20 A17,17 0 0,1 44,20" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M20,44 A17,17 0 0,0 44,44" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
);

const LoginHub = () => {
    const { login, currentLang, changeLanguage, availableLanguages, t } = useAppContext();
    const navigate = useNavigate();
    const [operatorId, setOperatorId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [langOpen, setLangOpen] = useState(false);

    const currentLangData = availableLanguages.find(l => l.code === currentLang);

    const handleLogin = async () => {
        if (operatorId.trim().length < 3) {
            setError(t('login_error_length'));
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await apiLogin(operatorId.trim());
            if (res.success) {
                login(operatorId.trim(), res.training_count ?? 0);
                navigate('/site-selector');
            } else {
                setError(t('login_failed'));
            }
        } catch (err) {
            console.warn('Backend unreachable, logging in offline:', err.message);
            login(operatorId.trim(), 0);
            navigate('/site-selector');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: '#0D1B2A' }}
            onClick={() => setLangOpen(false)}
        >
            {/* Language button — top right */}
            <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                <div className="relative">
                    <button
                        onClick={() => setLangOpen(v => !v)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                    >
                        <Globe size={15} />
                        <span>{currentLang.toUpperCase()}</span>
                    </button>

                    <AnimatePresence>
                        {langOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-36 z-50"
                            >
                                {availableLanguages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${currentLang === lang.code ? 'text-safety-orange' : 'text-gray-700'}`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Centered content */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 gap-5">

                {/* Logo card */}
                <motion.div
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl px-10 py-7 flex flex-col items-center gap-3 shadow-2xl"
                >
                    <SiteMarshallLogo />
                    <p className="text-base text-gray-700 tracking-wide">
                        Site <strong className="text-gray-900">Marshall</strong>
                    </p>
                </motion.div>

                {/* Login card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12, duration: 0.4 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('clock_in')}</h1>
                    <p className="text-gray-400 text-sm mb-7">{t('enter_operator_id')}</p>

                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        {t('operator_id_label')}
                    </label>
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 mb-2" style={{ backgroundColor: '#EEF2F7' }}>
                        <IdCard size={20} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={operatorId}
                            onChange={e => { setOperatorId(e.target.value); setError(null); }}
                            onKeyDown={handleKeyDown}
                            placeholder={t('operator_id_placeholder')}
                            autoFocus
                            className="bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full text-base"
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-red-500 text-sm mb-3 mt-1"
                            >
                                <AlertCircle size={15} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full mt-4 text-white font-bold text-base py-4 rounded-full flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: '#E67E22' }}
                    >
                        <span>👷</span>
                        <span>{loading ? t('logging_in') : t('clock_in')}</span>
                    </button>
                </motion.div>

                {/* Footer hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-center"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                    {t('first_time_contact')}
                </motion.p>
            </div>
        </div>
    );
};

export default LoginHub;
