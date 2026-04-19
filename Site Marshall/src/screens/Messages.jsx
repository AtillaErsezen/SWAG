import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RefreshCw, MessageCircle, Megaphone, CheckCircle, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

const SEVERITY_STYLE = {
    low:    { bg: '#f0fdf4', color: '#16a34a' },
    medium: { bg: '#FFF5EC', color: '#E67E22' },
    high:   { bg: '#fef2f2', color: '#ef4444' },
};

const Spinner = () => (
    <div className="flex justify-center py-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-safety-orange" />
    </div>
);

const Messages = () => {
    const navigate = useNavigate();
    const { session } = useAppContext();
    const [messages, setMessages]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [confirming, setConfirming] = useState(new Set());

    const fetchMessages = async () => {
        setLoading(true); setError(null);
        try {
            const { data: { session: s } } = await supabase.auth.getSession();
            const userId = s?.user?.id || session?.user?.id;
            const { data, error: e } = await supabase
                .from('messages')
                .select('*, profiles!messages_sender_id_fkey(full_name)')
                .eq('recipient_id', userId)
                .order('created_at', { ascending: false });
            if (e) throw new Error(e.message);
            setMessages(data ?? []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMessages(); }, []);

    const handleConfirm = async (msg) => {
        if (msg.confirmed || confirming.has(msg.id)) return;
        setConfirming(prev => new Set([...prev, msg.id]));
        try {
            await supabase.from('messages')
                .update({ confirmed: true, confirmed_at: new Date().toISOString() })
                .eq('id', msg.id);
            setMessages(prev => prev.map(m =>
                m.id === msg.id ? { ...m, confirmed: true, confirmed_at: new Date().toISOString() } : m
            ));
        } finally {
            setConfirming(prev => { const n = new Set(prev); n.delete(msg.id); return n; });
        }
    };

    return (
        <div className="min-h-full flex flex-col bg-gray-50">
            <div className="px-5 pt-10 pb-6 flex items-center gap-3" style={{ backgroundColor: '#0D1B2A' }}>
                <button onClick={() => navigate('/scanner')}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <div className="flex-1">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Worker</p>
                    <h1 className="text-xl font-black text-white">Messages</h1>
                </div>
                <button onClick={fetchMessages} disabled={loading}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <RefreshCw size={16} className={`text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="px-4 pt-5 pb-24 flex flex-col gap-3">
                {error ? <p className="text-red-500 text-sm text-center py-8">{error}</p>
                    : loading ? <Spinner />
                    : messages.length === 0
                        ? <p className="text-gray-400 text-sm text-center py-12">No messages found.</p>
                        : messages.map((msg, i) => {
                            const isCall      = msg.message_type === 'call' || msg.subtype === 'call';
                            const isConfirmed = msg.confirmed;
                            const isBusy      = confirming.has(msg.id);
                            const sev         = SEVERITY_STYLE[msg.severity] ?? SEVERITY_STYLE.medium;

                            return (
                                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={`rounded-2xl p-4 shadow-sm ${isCall ? 'border-2' : 'border'}`}
                                    style={{
                                        backgroundColor: isCall ? '#fff9f5' : 'white',
                                        borderColor: isCall ? '#E67E22' : '#f1f5f9',
                                    }}>

                                    {isCall ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-safety-orange flex items-center justify-center shrink-0 shadow-md">
                                                        <Megaphone size={16} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-sm text-safety-orange uppercase tracking-widest leading-none block">Summon</span>
                                                        <span className="font-bold text-xs text-gray-500 leading-none block mt-0.5">
                                                            {msg.profiles?.full_name || 'Manager'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <p className="text-base font-black text-gray-900 mt-1">{msg.content || msg.message}</p>

                                            <ConfirmButton confirmed={isConfirmed} busy={isBusy} onConfirm={() => handleConfirm(msg)} />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageCircle size={16} className="text-safety-orange" />
                                                <span className="font-bold text-xs text-gray-700">
                                                    {msg.profiles?.full_name || 'Manager'}
                                                </span>
                                                {msg.severity && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ml-1"
                                                        style={{ backgroundColor: sev.bg, color: sev.color }}>
                                                        {msg.severity}
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-400 ml-auto">
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-800 leading-relaxed">{msg.content || msg.message}</p>
                                            {msg.machine && <p className="text-xs text-gray-400 mt-1.5">🔧 {msg.machine}</p>}

                                            <ConfirmButton confirmed={isConfirmed} busy={isBusy} onConfirm={() => handleConfirm(msg)} />
                                        </>
                                    )}
                                </motion.div>
                            );
                        })
                }
            </div>
        </div>
    );
};

const ConfirmButton = ({ confirmed, busy, onConfirm }) => (
    <AnimatePresence mode="wait">
        {confirmed ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-2 flex items-center gap-1.5 text-green-600">
                <CheckCircle size={15} />
                <span className="text-xs font-bold">Confirmed</span>
            </motion.div>
        ) : (
            <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={onConfirm} disabled={busy}
                className="mt-2 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                style={{ backgroundColor: busy ? '#f1f5f9' : '#FFF5EC', color: busy ? '#94a3b8' : '#E67E22' }}>
                {busy ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-3.5 h-3.5 rounded-full border-2 border-orange-200 border-t-safety-orange" />
                ) : (
                    <><Check size={13} /> Confirm Receipt</>
                )}
            </motion.button>
        )}
    </AnimatePresence>
);

export default Messages;
