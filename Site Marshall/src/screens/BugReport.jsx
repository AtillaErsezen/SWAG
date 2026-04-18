import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { submitBugReport } from '../services/api';

const BugReport = () => {
    const navigate = useNavigate();
    const { workerId } = useAppContext();

    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);

    const handleSubmit = async () => {
        if (!description.trim() || !emailValid) return;
        try {
            await submitBugReport({ description, steps, userId: workerId ?? 'unknown', userEmail });
        } catch (err) {
            console.error('Bug report failed:', err);
        }
        setSubmitted(true);
        setTimeout(() => navigate('/scanner'), 2200);
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="bg-white p-8 rounded-3xl flex flex-col items-center shadow-2xl">
                    <CheckCircle size={72} className="text-green-500 mb-4" />
                    <p className="text-2xl font-black text-gray-800">Report Sent</p>
                    <p className="text-sm text-gray-500 mt-2">Thanks, we'll look into it.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-lg rounded-[28px] overflow-hidden flex flex-col relative shadow-2xl"
                style={{ maxHeight: '90vh' }}
            >
                <div className="flex justify-center pt-3 pb-2 shrink-0">
                    <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }} />
                </div>

                <div className="px-6 pb-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    <div className="pb-4 pt-1 flex items-center justify-between">
                        <h1 className="text-2xl font-black text-slate-800">Report a Bug</h1>
                        <button onClick={() => navigate('/scanner')}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-all">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="mb-5">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>
                            Your email *
                        </p>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={e => setUserEmail(e.target.value)}
                            onBlur={() => setEmailTouched(true)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 text-sm font-medium placeholder-gray-400 focus:outline-none"
                            style={{
                                backgroundColor: '#EEF2F7', color: '#333',
                                border: emailTouched && !emailValid ? '1.5px solid #ef4444' : 'none',
                                borderRadius: '14px',
                            }}
                        />
                        {emailTouched && !emailValid && (
                            <p className="text-red-500 text-[11px] font-semibold mt-1.5 pl-1">Enter a valid email address.</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>
                            What went wrong? *
                        </p>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the bug…"
                            className="w-full px-4 py-3.5 text-sm font-medium placeholder-gray-400 resize-none focus:outline-none"
                            style={{ backgroundColor: '#EEF2F7', color: '#333', border: 'none', borderRadius: '14px', minHeight: '100px' }}
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>
                            Steps to reproduce <span className="text-gray-400 normal-case font-semibold">(optional)</span>
                        </p>
                        <textarea
                            value={steps}
                            onChange={e => setSteps(e.target.value)}
                            placeholder="1. I tapped… 2. Then…"
                            className="w-full px-4 py-3.5 text-sm font-medium placeholder-gray-400 resize-none focus:outline-none"
                            style={{ backgroundColor: '#EEF2F7', color: '#333', border: 'none', borderRadius: '14px', minHeight: '72px' }}
                        />
                    </div>

                    <p className="text-[10px] text-gray-400 font-medium mb-4">
                        Submitted by: <span className="font-bold text-gray-600">{workerId ?? 'unknown'}</span>
                    </p>

                    <button onClick={handleSubmit} disabled={!description.trim() || !emailValid}
                        className="w-full py-3.5 rounded-full text-white font-black text-sm transition-all active:scale-[0.98] disabled:opacity-40"
                        style={{ backgroundColor: '#E67E22' }}>
                        Submit Bug Report
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default BugReport;
