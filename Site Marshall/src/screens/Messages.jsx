import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

const Spinner = () => (
    <div className="flex justify-center py-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-safety-orange" />
    </div>
);

const Messages = () => {
    const navigate = useNavigate();
    const { session } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        setLoading(true); setError(null);
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const userId = currentSession?.user?.id || session?.user?.id;
            
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

    return (
        <div className="min-h-full flex flex-col bg-gray-50">
            <div className="px-5 pt-10 pb-6 flex items-center gap-3" style={{ backgroundColor: '#0D1B2A' }}>
                <button onClick={() => navigate(-1)}
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
                    : messages.map((msg, i) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageCircle size={16} className="text-safety-orange" />
                                <span className="font-bold text-xs text-gray-700">
                                    {msg.profiles?.full_name || 'Manager'}
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">{msg.content || msg.message}</p>
                        </motion.div>
                    ))
                }
            </div>
        </div>
    );
};

export default Messages;
