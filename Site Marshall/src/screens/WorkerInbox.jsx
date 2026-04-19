import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SEVERITY_STYLE = {
    low:    { bg: '#f0fdf4', color: '#16a34a' },
    medium: { bg: '#FFF5EC', color: '#E67E22' },
    high:   { bg: '#fef2f2', color: '#ef4444' },
};

const fmt = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const Spinner = () => (
    <div className="flex justify-center py-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-safety-orange" />
    </div>
);

const WorkerInbox = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    const fetchMessages = async () => {
        setLoading(true); setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { data, error: e } = await supabase
                .from('messages')
                .select('*, profiles!messages_sender_id_fkey(full_name)')
                .eq('recipient_id', session.user.id)
                .eq('message_type', 'broadcast')
                .order('created_at', { ascending: false });
            if (e) throw new Error(e.message);
            setMessages(data ?? []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMessages(); }, []);

    return (
        <div className="min-h-full flex flex-col bg-gray-50">
            <div className="px-5 pt-10 pb-6 flex items-center gap-3" style={{ backgroundColor: '#0D1B2A' }}>
                <button onClick={() => navigate('/scanner')}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <div className="flex-1">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Inbox</p>
                    <h1 className="text-xl font-black text-white">Manager Messages</h1>
                </div>
                <button onClick={fetchMessages} disabled={loading}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <RefreshCw size={16} className={`text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="px-4 pt-5 pb-24 flex flex-col gap-2">
                {error   ? <p className="text-red-500 text-sm text-center py-8">{error}</p>
                : loading ? <Spinner />
                : messages.length === 0
                    ? <p className="text-gray-400 text-sm text-center py-12">No messages from managers yet.</p>
                    : messages.map((msg, i) => {
                        const sev = SEVERITY_STYLE[msg.severity] ?? SEVERITY_STYLE.medium;
                        return (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-white rounded-2xl px-4 py-3.5 shadow-sm"
                                style={{ borderLeft: `3px solid ${sev.color}` }}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-xs font-bold text-gray-400">
                                        From: {msg.profiles?.full_name ?? 'Manager'}
                                    </p>
                                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold capitalize"
                                        style={{ backgroundColor: sev.bg, color: sev.color }}>
                                        {msg.severity}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-snug">{msg.content}</p>
                                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                                    {msg.machine && <span>🔧 {msg.machine}</span>}
                                    {msg.site    && <span>📍 {msg.site}</span>}
                                    <span className="ml-auto">{fmt(msg.created_at)}</span>
                                </div>
                            </motion.div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default WorkerInbox;
