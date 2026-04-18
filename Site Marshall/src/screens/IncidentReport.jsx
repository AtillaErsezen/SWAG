import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic, Camera, Clock, MapPin, CheckCircle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { machineDB } from '../data/mockData';
import { startRecording, transcribeAudio } from '../services/api';

const REPORT_TYPES = ['near_miss', 'incident', 'unsafe_condition'];

const now = () => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const IncidentReport = () => {
    const navigate = useNavigate();
    const { workerId, activeSite, t } = useAppContext();

    const [reportType, setReportType] = useState('incident');
    const [machineId, setMachineId] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const recorderRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleMicDown = async () => {
        setIsRecording(true);
        try {
            recorderRef.current = await startRecording();
        } catch {
            setIsRecording(false);
        }
    };

    const handleMicUp = async () => {
        if (!recorderRef.current) { setIsRecording(false); return; }
        setIsRecording(false);
        setIsTranscribing(true);
        try {
            const blob = await recorderRef.current.stop();
            recorderRef.current = null;
            const res = await transcribeAudio(blob);
            if (res.transcription) setDescription(prev => (prev ? prev + ' ' : '') + res.transcription);
        } catch (err) {
            console.error('Transcription error:', err);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handlePhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhoto(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        if (!description.trim()) return;
        setSubmitted(true);
        setTimeout(() => navigate('/scanner'), 2200);
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
            <motion.div
                initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-lg rounded-[28px] overflow-hidden flex flex-col relative shadow-2xl"
                style={{ maxHeight: '90vh' }}
            >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2 shrink-0">
                    <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }} />
                </div>

                <div className="px-6 pb-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {/* Header */}
                    <div className="pb-4 pt-1 flex items-center justify-between">
                        <h1 className="text-2xl font-black text-slate-800">{t('report_issue')}</h1>
                        <button 
                            onClick={() => navigate('/scanner')}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Report Type */}
                    <div className="mb-6">
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

                    {/* Machine / Equipment */}
                    <div className="mb-6">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>
                            {t('report_machine')} <span className="text-gray-400 normal-case font-semibold">({t('report_optional')})</span>
                        </p>
                        <div className="relative">
                            <select
                                value={machineId}
                                onChange={e => setMachineId(e.target.value)}
                                className="w-full appearance-none px-4 py-3.5 text-sm font-medium focus:outline-none"
                                style={{ backgroundColor: '#EEF2F7', color: machineId ? '#333' : '#9ca3af', border: 'none', borderRadius: '14px' }}
                            >
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
                    <div className="mb-6">
                        <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#E67E22' }}>{t('report_desc')}</p>
                        <div className="flex gap-2 items-stretch">
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder={t('report_desc_placeholder')}
                                className="flex-1 px-4 py-3.5 text-sm font-medium placeholder-gray-400 resize-none focus:outline-none"
                                style={{ backgroundColor: '#EEF2F7', color: '#333', border: 'none', borderRadius: '14px', minHeight: '100px' }}
                            />
                            <motion.button
                                onPointerDown={handleMicDown}
                                onPointerUp={handleMicUp}
                                onPointerLeave={handleMicUp}
                                whileTap={{ scale: 0.9 }}
                                disabled={isTranscribing}
                                className="w-14 flex flex-col items-center justify-center shrink-0 transition-all border-2"
                                style={{
                                    borderRadius: '14px',
                                    borderColor: '#E67E22',
                                    backgroundColor: isRecording ? '#FFF5EC' : 'white',
                                }}>
                                {isTranscribing
                                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-5 h-5 rounded-full border-2 border-safety-orange/30 border-t-safety-orange" />
                                    : <Mic size={20} style={{ color: '#E67E22' }} />
                                }
                            </motion.button>
                        </div>
                        
                        {/* Timestamp + Site */}
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

                    {/* Photo */}
                    <div className="mb-6">
                        <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
                            className="hidden" onChange={handlePhoto} />
                        <button onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed py-8 flex flex-col items-center gap-2 transition-all active:scale-[0.98]"
                            style={{ borderRadius: '14px', borderColor: '#E67E22', backgroundColor: 'white' }}>
                            {photo
                                ? <img src={photo} alt="attached" className="w-full h-32 object-cover rounded-xl mt-[-20px] mb-[-20px]" />
                                : <>
                                    <Camera size={26} style={{ color: '#E67E22' }} />
                                    <span className="text-xs font-bold" style={{ color: '#E67E22' }}>{t('report_tap_photo')}</span>
                                  </>
                            }
                        </button>
                    </div>

                    {/* Submit */}
                    <div className="pt-1">
                        <button onClick={handleSubmit} disabled={!description.trim()}
                            className="w-full py-3.5 rounded-full text-white font-black text-sm transition-all active:scale-[0.98] disabled:opacity-40"
                            style={{ backgroundColor: '#E67E22' }}>
                            {t('submit_report')}
                        </button>
                        <p className="text-center text-[10px] font-medium text-gray-400 mt-3 normally-case hidden sm:block">
                            {t('submitted_visible_kam')}
                        </p>
                        <p className="text-center text-[10px] font-medium text-gray-400 mt-3 normally-case sm:hidden">
                            {t('submitted_visible_kam')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default IncidentReport;
