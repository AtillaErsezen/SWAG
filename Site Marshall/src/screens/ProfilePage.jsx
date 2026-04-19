import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Shield, Calendar, BookOpen, Award, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const Spinner = () => (
    <div className="flex justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2 border-white/10 border-t-safety-orange" />
    </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFF5EC' }}>
            <Icon size={15} style={{ color: '#E67E22' }} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{value ?? '—'}</p>
        </div>
    </div>
);

const StatBadge = ({ label, value, color = '#E67E22', bg = '#FFF5EC' }) => (
    <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: bg }}>
        <p className="text-2xl font-black" style={{ color }}>{value}</p>
        <p className="text-[11px] font-bold text-gray-400 mt-0.5">{label}</p>
    </div>
);

const ProfilePage = () => {
    const navigate  = useNavigate();
    const { userRole, activeSite } = useAppContext();
    const [profile, setProfile]   = useState(null);
    const [stats, setStats]       = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) { navigate('/'); return; }

                const { data: prof, error: profErr } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profErr) throw new Error(profErr.message);
                setProfile({ ...prof, email: session.user.email, created_at: session.user.created_at });

                const { data: trainings } = await supabase
                    .from('trainings')
                    .select('quiz_result, training_type')
                    .eq('user_id', session.user.id);

                const quizzes  = (trainings ?? []).filter(t => t.training_type === 'quiz');
                const avgScore = quizzes.length
                    ? Math.round(quizzes.reduce((s, t) => s + (t.quiz_result ?? 0), 0) / quizzes.length)
                    : 0;
                setStats({ total: (trainings ?? []).length, quizzes: quizzes.length, avg: avgScore });
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const isManager = profile?.role === 'manager' || userRole === 'manager';
    const backPath  = isManager ? '/manager' : '/scanner';
    const initials  = (profile?.full_name ?? 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="min-h-full flex flex-col" style={{ backgroundColor: '#0D1B2A' }}>

            {/* Header */}
            <div className="px-5 pt-10 pb-8 flex flex-col items-center gap-1 relative shrink-0"
                style={{ backgroundColor: isManager ? '#E67E22' : '#0D1B2A' }}>
                <button onClick={() => navigate(backPath)}
                    className="absolute top-10 left-5 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: isManager ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
                    <ChevronLeft size={20} className="text-white" />
                </button>

                {/* Avatar */}
                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl mb-2 mt-2"
                    style={{ backgroundColor: isManager ? 'rgba(255,255,255,0.25)' : '#E67E22' }}>
                    <span className="text-white font-black text-2xl">{loading ? '?' : initials}</span>
                </motion.div>

                {loading ? (
                    <div className="h-6 w-32 rounded-full bg-white/10 animate-pulse" />
                ) : (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-center">
                        <h1 className="text-xl font-black text-white">{profile?.full_name ?? 'Unknown'}</h1>
                        <span className="mt-1 inline-block px-3 py-0.5 rounded-full text-xs font-bold capitalize"
                            style={{
                                backgroundColor: isManager ? 'rgba(255,255,255,0.25)' : 'rgba(230,126,34,0.2)',
                                color: isManager ? 'white' : '#E67E22',
                            }}>
                            {profile?.role ?? userRole}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 bg-gray-50 rounded-t-3xl -mt-4 px-4 pt-6 pb-24 flex flex-col gap-4">

                {loading ? <Spinner /> : error ? (
                    <p className="text-red-500 text-sm text-center py-8">{error}</p>
                ) : (
                    <>
                        {/* Worker stats */}
                        {!isManager && stats && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="flex gap-3">
                                <StatBadge label="Trainings" value={stats.total} />
                                <StatBadge label="Quizzes" value={stats.quizzes} color="#16a34a" bg="#f0fdf4" />
                                <StatBadge label="Avg Score" value={stats.avg + '%'} color={stats.avg >= 75 ? '#16a34a' : stats.avg >= 40 ? '#E67E22' : '#ef4444'} bg={stats.avg >= 75 ? '#f0fdf4' : stats.avg >= 40 ? '#FFF5EC' : '#fef2f2'} />
                            </motion.div>
                        )}

                        {/* Info card */}
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl px-4 shadow-sm">
                            <InfoRow icon={Mail}     label="Email"       value={profile?.email} />
                            <InfoRow icon={Shield}   label="Role"        value={profile?.role} />
                            <InfoRow icon={Calendar} label="Member Since" value={profile?.created_at ? fmt(profile.created_at) : null} />
                            {activeSite && <InfoRow icon={MapPin} label="Active Site" value={activeSite.name} />}
                            {!isManager && <InfoRow icon={BookOpen} label="Trainings Done" value={stats?.total ?? 0} />}
                            {!isManager && <InfoRow icon={Award}    label="Quiz Average"   value={stats ? stats.avg + '%' : '—'} />}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
