import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Users, BookOpen, Award, RefreshCw, AlertTriangle, ClipboardList } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const fmt = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const SEVERITY_STYLE = {
    low:    { bg: '#f0fdf4', color: '#16a34a' },
    medium: { bg: '#FFF5EC', color: '#E67E22' },
    high:   { bg: '#fef2f2', color: '#ef4444' },
};

const SUBTYPE_LABEL = {
    near_miss:        'Near Miss',
    incident:         'Incident',
    unsafe_condition: 'Unsafe Condition',
};

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFF5EC' }}>
            <Icon size={18} style={{ color: '#E67E22' }} />
        </div>
        <div>
            <p className="text-2xl font-black text-gray-800 leading-none">{value}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">{label}</p>
        </div>
    </div>
);

const Spinner = () => (
    <div className="flex justify-center py-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-safety-orange" />
    </div>
);

// ── Trainings Tab ─────────────────────────────────────────────────────────────
const TrainingsTab = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [filter, setFilter]       = useState('all');

    const fetch = async () => {
        setLoading(true); setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await window.fetch('/api/manager/trainings', {
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            if (!res.ok) throw new Error(`${res.status}`);
            setTrainings(await res.json());
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    const workers  = [...new Set(trainings.map(r => r.profiles?.full_name ?? r.user_id))];
    const filtered = filter === 'all' ? trainings : trainings.filter(r => (r.profiles?.full_name ?? r.user_id) === filter);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
                <StatCard icon={Users}    label="Workers"  value={workers.length} />
                <StatCard icon={BookOpen} label="Sessions" value={trainings.length} />
                <StatCard icon={Award}    label="Quizzes"  value={trainings.filter(r => r.training_type === 'quiz').length} />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {['all', ...workers].map(w => (
                    <button key={w} onClick={() => setFilter(w)}
                        className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
                        style={{
                            backgroundColor: filter === w ? '#E67E22' : 'white',
                            color: filter === w ? 'white' : '#64748b',
                            border: filter === w ? '1px solid #E67E22' : '1px solid #e2e8f0',
                        }}>
                        {w === 'all' ? 'All Workers' : w}
                    </button>
                ))}
            </div>

            <button onClick={fetch} disabled={loading}
                className="flex items-center gap-2 self-end text-xs font-bold text-gray-400 hover:text-safety-orange transition-colors">
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>

            {error ? <p className="text-red-500 text-sm text-center py-8">{error}</p>
            : loading ? <Spinner />
            : filtered.length === 0 ? <p className="text-gray-400 text-sm text-center py-12">No training records yet.</p>
            : (
                <div className="flex flex-col gap-2">
                    {filtered.map((r, i) => (
                        <motion.div key={r.training_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-sm truncate">{r.profiles?.full_name ?? r.user_id}</p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{r.machine}</p>
                                <p className="text-[11px] text-gray-300 mt-0.5">{fmt(r.completed_at)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                                    style={{ backgroundColor: r.training_type === 'quiz' ? '#FFF5EC' : '#EEF2F7', color: r.training_type === 'quiz' ? '#E67E22' : '#64748b' }}>
                                    {r.training_type}
                                </span>
                                {r.quiz_result != null && (
                                    <span className="font-black text-sm"
                                        style={{ color: r.quiz_result >= 80 ? '#22c55e' : r.quiz_result >= 60 ? '#E67E22' : '#ef4444' }}>
                                        {r.quiz_result}%
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Incidents Tab ─────────────────────────────────────────────────────────────
const IncidentsTab = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [filter, setFilter]       = useState('all');

    const fetch = async () => {
        setLoading(true); setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { data, error: e } = await supabase
                .from('messages')
                .select('*, profiles!messages_sender_id_fkey(full_name)')
                .eq('message_type', 'incident')
                .eq('recipient_id', session.user.id)
                .order('created_at', { ascending: false });
if (e) throw new Error(e.message);
            setIncidents(data ?? []);
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    const severities = ['all', 'high', 'medium', 'low'];
    const filtered   = filter === 'all' ? incidents : incidents.filter(r => r.severity === filter);
    const highCount  = incidents.filter(r => r.severity === 'high').length;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
                <StatCard icon={AlertTriangle} label="Total"    value={incidents.length} />
                <StatCard icon={AlertTriangle} label="High"     value={highCount} />
                <StatCard icon={Users}         label="Workers"  value={[...new Set(incidents.map(r => r.sender_id))].length} />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {severities.map(s => {
                    const style = s !== 'all' ? SEVERITY_STYLE[s] : null;
                    const active = filter === s;
                    return (
                        <button key={s} onClick={() => setFilter(s)}
                            className="shrink-0 px-4 py-2 rounded-full text-xs font-bold capitalize transition-all"
                            style={{
                                backgroundColor: active ? (style?.bg ?? '#E67E22') : 'white',
                                color: active ? (style?.color ?? 'white') : '#64748b',
                                border: active ? `1px solid ${style?.color ?? '#E67E22'}` : '1px solid #e2e8f0',
                            }}>
                            {s === 'all' ? 'All' : s}
                        </button>
                    );
                })}
            </div>

            <button onClick={fetch} disabled={loading}
                className="flex items-center gap-2 self-end text-xs font-bold text-gray-400 hover:text-safety-orange transition-colors">
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>

            {error ? <p className="text-red-500 text-sm text-center py-8">{error}</p>
            : loading ? <Spinner />
            : filtered.length === 0 ? <p className="text-gray-400 text-sm text-center py-12">No incident reports yet.</p>
            : (
                <div className="flex flex-col gap-2">
                    {filtered.map((r, i) => {
                        const sev = SEVERITY_STYLE[r.severity] ?? SEVERITY_STYLE.medium;
                        return (
                            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="bg-white rounded-2xl px-4 py-3.5 shadow-sm"
                                style={{ borderLeft: `3px solid ${sev.color}` }}>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <p className="font-bold text-gray-800 text-sm">{r.profiles?.full_name ?? r.sender_id}</p>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold capitalize"
                                            style={{ backgroundColor: sev.bg, color: sev.color }}>
                                            {r.severity}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">
                                            {SUBTYPE_LABEL[r.subtype] ?? r.subtype}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-snug">{r.content}</p>
                                <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                                    {r.machine && <span>🔧 {r.machine}</span>}
                                    {r.site    && <span>📍 {r.site}</span>}
                                    <span className="ml-auto">{fmt(r.created_at)}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Dashboard Shell ───────────────────────────────────────────────────────────
const TABS = [
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'trainings', label: 'Trainings', icon: ClipboardList },
];

const ManagerDashboard = () => {
    const { workerId, activeSite, logout } = useAppContext();
    const navigate = useNavigate();
    const [tab, setTab] = useState('incidents');

    const handleLogout = async () => { await logout(); navigate('/'); };

    return (
        <div className="min-h-full flex flex-col bg-gray-50">
            <div className="px-5 pt-10 pb-6 flex items-start justify-between" style={{ backgroundColor: '#E67E22' }}>
                <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Manager Dashboard</p>
                    <h1 className="text-2xl font-black text-white">{workerId}</h1>
                    {activeSite && <p className="text-white/70 text-sm mt-0.5">{activeSite.name}</p>}
                </div>
                <button onClick={handleLogout}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <LogOut size={18} className="text-white" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white px-4">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className="flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b-2 transition-colors"
                        style={{
                            borderColor: tab === id ? '#E67E22' : 'transparent',
                            color: tab === id ? '#E67E22' : '#94a3b8',
                        }}>
                        <Icon size={15} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="px-4 pt-5 pb-24">
                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                        {tab === 'incidents' ? <IncidentsTab /> : <TrainingsTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManagerDashboard;
