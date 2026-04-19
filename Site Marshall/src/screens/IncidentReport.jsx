import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { machineDB } from '../data/mockData';
import { supabase } from '../lib/supabase';

const REPORT_TYPES = ['near_miss', 'incident', 'unsafe_condition'];
const SEVERITIES   = ['low', 'medium', 'high'];

const SEVERITY_STYLE = {
    low:    { bg: '#f0fdf4', color: '#16a34a', border: '#16a34a' },
    medium: { bg: '#FFF5EC', color: '#E67E22', border: '#E67E22' },
    high:   { bg: '#fef2f2', color: '#ef4444', border: '#ef4444' },
};

const now = () => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const IncidentReport = () => {
    const navigate = useNavigate();
    const { activeSite, t } = useAppContext();

    const [reportType, setReportType]   = useState('incident');
    const [severity, setSeverity]       = useState('medium');
    const [machineId, setMachineId]     = useState('');
    const [description, setDescription] = useState('');
    const [managerId, setManagerId]     = useState('');
    const [managers, setManagers]       = useState([]);
    const [submitting, setSubmitting]   = useState(false);
    const [submitted, setSubmitted]     = useState(false);
    const [error, setError]             = useState(null);

    useEffect(() => {
        supabase.from('profiles').select('id, full_name').eq('role', 'manager')
            .then(({ data }) => setManagers(data ?? []));
    }, []);

    const handleSubmit = async () => {
        if (!description.trim() || !managerId) return;
        setSubmitting(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const machine = machineId && machineId !== 'none'
                ? machineDB.find(m => m.id === machineId)?.model ?? null
                : null;

            const { error: dbError } = await supabase.from('messages').insert({
                sender_id:    session.user.id,
                message_type: 'incident',
                subtype:      reportType,
                severity,
                content:      description.trim(),
                machine,
                site:         activeSite?.name ?? null,
                recipient_id: managerId,
            });

            if (dbError) throw new Error(dbError.message);
            setSubmitted(true);
            setTimeout(() => navigate('/scanner'), 2200);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="bg-white p-8 rounded-3xl flex flex-col items-center shadow-2xl">
                    <CheckCircle size={72} className="text-green-500 mb-4" />
                    <p className="text-2xl font-black text-gray-800">{t('report_submitted')}</p>
                    <p className="text-sm text-gray-500 mt-2">{t('visible_to_kam')}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-lg rounded-[28px] overflow-hidden flex flex-col relative shadow-2xl"
                style={{ maxHeight: '90vh' }}>

                <div className="flex justify-center pt-3 pb-2 shrink-0">
                    <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }} />
                </div>

                <div className="px-6 pb-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

                    {/* Header */}
                    <div className="pb-4 pt-1 flex items-center justify-between">
                        <h1 className="text-2xl font-black text-slate-800">{t('report_issue')}</h1>
                        <button onClick={() => navigate('/scanner')}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-all">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Report Type */}
                    <div className="mb-5">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>{t('report_type')}</p>
                        <div className="flex gap-2">
                            {REPORT_TYPES.map(type => (
                                <button key={type} onClick={() => setReportType(type)}
                                    className="flex-1 py-3 font-bold text-xs transition-all active:scale-[0.98]"
                                    style={{
                                        borderRadius: '14px',
                                        backgroundColor: reportType === type ? '#E67E22' : '#F8FAFC',
                                        color: reportType === type ? 'white' : '#64748B',
                                        border: reportType === type ? '1px solid #E67E22' : '1px solid #E2E8F0',
                                    }}>
                                    {t(type)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Severity */}
                    <div className="mb-5">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>
                            Severity
                        </p>
                        <div className="flex gap-2">
                            {SEVERITIES.map(s => {
                                const style = SEVERITY_STYLE[s];
                                const active = severity === s;
                                return (
                                    <button key={s} onClick={() => setSeverity(s)}
                                        className="flex-1 py-3 font-bold text-xs capitalize transition-all active:scale-[0.98]"
                                        style={{
                                            borderRadius: '14px',
                                            backgroundColor: active ? style.bg : '#F8FAFC',
                                            color: active ? style.color : '#64748B',
                                            border: active ? `1px solid ${style.border}` : '1px solid #E2E8F0',
                                        }}>
                                        {s}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Manager */}
                    <div className="mb-5">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>
                            Send to Manager *
                        </p>
                        <div className="relative">
                            <select value={managerId} onChange={e => setManagerId(e.target.value)}
                                className="w-full appearance-none px-4 py-3.5 text-sm font-medium focus:outline-none"
                                style={{ backgroundColor: '#EEF2F7', color: managerId ? '#333' : '#9ca3af', border: 'none', borderRadius: '14px' }}>
                                <option value="" disabled>Select a manager…</option>
                                {managers.map(m => (
                                    <option key={m.id} value={m.id}>{m.full_name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</div>
                        </div>
                    </div>

                    {/* Machine */}
                    <div className="mb-5">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>
                            Machine <span className="text-gray-400 normal-case font-semibold">(optional)</span>
                        </p>
                        <div className="relative">
                            <select value={machineId} onChange={e => setMachineId(e.target.value)}
                                className="w-full appearance-none px-4 py-3.5 text-sm font-medium focus:outline-none"
                                style={{ backgroundColor: '#EEF2F7', color: machineId ? '#333' : '#9ca3af', border: 'none', borderRadius: '14px' }}>
                                <option value="" disabled className="text-gray-400">{t('report_select_machine')}</option>
                                <option value="none">{t('report_none')}</option>
                                {machineDB.map(m => (
                                    <option key={m.id} value={m.id} className="text-gray-800">{m.model}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>{t('report_desc')}</p>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            placeholder={t('report_desc_placeholder')}
                            className="w-full px-4 py-3.5 text-sm font-medium placeholder-gray-400 resize-none focus:outline-none"
                            style={{ backgroundColor: '#EEF2F7', color: '#333', border: 'none', borderRadius: '14px', minHeight: '100px' }} />
                        <div className="flex items-center gap-5 mt-3 text-[10px] font-semibold text-gray-500">
                            <div className="flex items-center gap-1.5 pl-1">
                                <Clock size={12} className="text-gray-400" />
                                <span>{now()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-gray-400" />
                                <span>{activeSite?.name ?? t('report_unknown_site')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-red-500 text-sm mb-3">
                                <AlertTriangle size={14} />{error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button onClick={handleSubmit} disabled={!description.trim() || !managerId || submitting}
                        className="w-full py-3.5 rounded-full text-white font-black text-sm transition-all active:scale-[0.98] disabled:opacity-40"
                        style={{ backgroundColor: '#E67E22' }}>
                        {submitting ? 'Submitting…' : t('submit_report')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default IncidentReport;
