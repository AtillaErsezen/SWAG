import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertCircle, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SiteMarshallLogo = () => (
    <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,3 57,17.5 57,46.5 32,61 7,46.5 7,17.5" stroke="#E67E22" strokeWidth="3" fill="none" />
        <circle cx="32" cy="32" r="3.5" fill="#E67E22" />
        <path d="M24.5,24.5 A10.5,10.5 0 0,1 39.5,24.5" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M24.5,39.5 A10.5,10.5 0 0,0 39.5,39.5" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M20,20 A17,17 0 0,1 44,20" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M20,44 A17,17 0 0,0 44,44" stroke="#E67E22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
);

const Field = ({ icon: Icon, type, value, onChange, onKeyDown, placeholder, right }) => (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ backgroundColor: '#EEF2F7' }}>
        <Icon size={18} className="text-gray-400 shrink-0" />
        <input type={type} value={value} onChange={onChange} onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="bg-transparent outline-none text-gray-700 placeholder-gray-400 w-full text-base" />
        {right}
    </div>
);

const LoginHub = () => {
    const { currentLang, changeLanguage, availableLanguages, t, session, userRole, authLoading } = useAppContext();
    const navigate = useNavigate();

    if (!authLoading && session) {
        navigate(userRole === 'manager' ? '/manager' : '/scanner', { replace: true });
        return null;
    }

    const [mode, setMode]             = useState('login'); // 'login' | 'signup'
    const [role, setRole]             = useState('worker');
    const [fullName, setFullName]     = useState('');
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [confirmPw, setConfirmPw]   = useState('');
    const [showPw, setShowPw]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState(null);
    const [success, setSuccess]       = useState(null);
    const [langOpen, setLangOpen]     = useState(false);

    const currentLangData = availableLanguages.find(l => l.code === currentLang);
    const clearErrors = () => { setError(null); setSuccess(null); };

    const switchMode = (m) => { setMode(m); clearErrors(); };

    const handleLogin = async () => {
        if (!email.trim() || !password) return;
        setLoading(true); clearErrors();
        const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        setLoading(false);
        if (e) setError(e.message);
        else navigate('/site-selector');
    };

    const handleSignup = async () => {
        if (!fullName.trim() || !email.trim() || !password) return;
        if (password !== confirmPw) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true); clearErrors();
        const { error: e } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { full_name: fullName.trim(), role } },
        });
        setLoading(false);
        if (e) setError(e.message);
        else setSuccess('Account created! Check your email to confirm, then sign in.');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') mode === 'login' ? handleLogin() : handleSignup();
    };

    const eyeBtn = (show, toggle) => (
        <button type="button" onClick={toggle} className="text-gray-400 hover:text-gray-600 shrink-0">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0D1B2A' }}
            onClick={() => setLangOpen(false)}>

            {/* Language picker */}
            <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                <div className="relative">
                    <button onClick={() => setLangOpen(v => !v)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                        <Globe size={15} />
                        <span>{currentLangData?.code?.toUpperCase() ?? 'EN'}</span>
                    </button>
                    <AnimatePresence>
                        {langOpen && (
                            <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.95 }} transition={{ duration: 0.15 }}
                                className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-36 z-50">
                                {availableLanguages.map(lang => (
                                    <button key={lang.code} onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${currentLang === lang.code ? 'text-safety-orange' : 'text-gray-700'}`}>
                                        {lang.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-5 gap-5 overflow-y-auto py-8">

                {/* Logo */}
                <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl px-10 py-7 flex flex-col items-center gap-3 shadow-2xl shrink-0">
                    <SiteMarshallLogo />
                    <p className="text-base text-gray-700 tracking-wide">Site <strong className="text-gray-900">Marshall</strong></p>
                </motion.div>

                {/* Card */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, duration: 0.4 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

                    {/* Mode toggle */}
                    <div className="flex rounded-xl overflow-hidden mb-6" style={{ backgroundColor: '#EEF2F7' }}>
                        {['login', 'signup'].map(m => (
                            <button key={m} onClick={() => switchMode(m)}
                                className="flex-1 py-2.5 text-sm font-bold transition-all"
                                style={{
                                    backgroundColor: mode === m ? '#E67E22' : 'transparent',
                                    color: mode === m ? 'white' : '#94a3b8',
                                    borderRadius: '10px',
                                }}>
                                {m === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === 'login' ? (
                            <motion.div key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}
                                className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                    <Field icon={Mail} type="email" value={email} onChange={e => { setEmail(e.target.value); clearErrors(); }}
                                        onKeyDown={handleKeyDown} placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                                    <Field icon={Lock} type={showPw ? 'text' : 'password'} value={password}
                                        onChange={e => { setPassword(e.target.value); clearErrors(); }}
                                        onKeyDown={handleKeyDown} placeholder="••••••••"
                                        right={eyeBtn(showPw, () => setShowPw(v => !v))} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}
                                className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                    <Field icon={User} type="text" value={fullName} onChange={e => { setFullName(e.target.value); clearErrors(); }}
                                        onKeyDown={handleKeyDown} placeholder="John Smith" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Role</label>
                                    <div className="flex rounded-xl overflow-hidden" style={{ backgroundColor: '#EEF2F7' }}>
                                        {['worker', 'manager'].map(r => (
                                            <button key={r} type="button" onClick={() => setRole(r)}
                                                className="flex-1 py-3 text-sm font-bold transition-all capitalize"
                                                style={{
                                                    backgroundColor: role === r ? '#E67E22' : 'transparent',
                                                    color: role === r ? 'white' : '#94a3b8',
                                                    borderRadius: '10px',
                                                }}>
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                    <Field icon={Mail} type="email" value={email} onChange={e => { setEmail(e.target.value); clearErrors(); }}
                                        onKeyDown={handleKeyDown} placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                                    <Field icon={Lock} type={showPw ? 'text' : 'password'} value={password}
                                        onChange={e => { setPassword(e.target.value); clearErrors(); }}
                                        onKeyDown={handleKeyDown} placeholder="Min. 6 characters"
                                        right={eyeBtn(showPw, () => setShowPw(v => !v))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                                    <Field icon={Lock} type={showConfirm ? 'text' : 'password'} value={confirmPw}
                                        onChange={e => { setConfirmPw(e.target.value); clearErrors(); }}
                                        onKeyDown={handleKeyDown} placeholder="••••••••"
                                        right={eyeBtn(showConfirm, () => setShowConfirm(v => !v))} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-red-500 text-sm mt-3">
                                <AlertCircle size={15} />{error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="text-green-600 text-sm mt-3 font-medium">
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button onClick={mode === 'login' ? handleLogin : handleSignup}
                        disabled={loading || !email.trim() || !password || (mode === 'signup' && (!fullName.trim() || !confirmPw))}
                        className="w-full mt-5 text-white font-bold text-base py-4 rounded-full flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: '#E67E22' }}>
                        {loading ? 'Please wait…' : mode === 'login' ? t('clock_in') : 'Create Account'}
                    </button>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="text-sm text-center shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {t('first_time_contact')}
                </motion.p>
            </div>
        </div>
    );
};

export default LoginHub;
