import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic, Camera, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { machineDB } from '../data/mockData';
import { startRecording, transcribeAudio } from '../services/api';

const REPORT_TYPES = ['Near-Miss', 'Incident', 'Unsafe Condition'];

const now = () => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const IncidentReport = () => {
    const navigate = useNavigate();
    const { workerId, activeSite } = useAppContext();

    const [reportType, setReportType] = useState('Incident');
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
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                    <CheckCircle size={72} className="text-sage-green" />
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="text-xl font-black text-charcoal">Report Submitted</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-sm text-slate-gray">Visible to your KAM coordinator only.</motion.p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-6 pb-4 shrink-0">
                <button onClick={() => navigate('/scanner')}
                    className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
                    <ChevronLeft size={24} className="text-charcoal" />
                </button>
                <h1 className="text-2xl font-black text-charcoal">Report Issue</h1>
            </div>

            <div className="px-4 pb-32 space-y-6">

                {/* Report Type */}
                <div>
                    <p className="text-[11px] font-black tracking-widest uppercase text-safety-orange mb-2">Report Type</p>
                    <div className="flex gap-2">
                        {REPORT_TYPES.map(type => (
                            <button key={type} onClick={() => setReportType(type)}
                                className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all active:scale-95"
                                style={{
                                    backgroundColor: reportType === type ? '#E67E22' : 'white',
                                    borderColor: reportType === type ? '#E67E22' : '#e5e7eb',
                                    color: reportType === type ? 'white' : '#374151',
                                }}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Machine / Equipment */}
                <div>
                    <p className="text-[11px] font-black tracking-widest uppercase text-safety-orange mb-2">
                        Machine / Equipment <span className="text-slate-gray normal-case font-semibold">(Optional)</span>
                    </p>
                    <div className="relative">
                        <select
                            value={machineId}
                            onChange={e => setMachineId(e.target.value)}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-600 focus:outline-none focus:border-safety-orange"
                        >
                            <option value="">Select machine</option>
                            {machineDB.map(m => (
                                <option key={m.id} value={m.id}>{m.model}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <p className="text-[11px] font-black tracking-widest uppercase text-safety-orange mb-2">Description</p>
                    <div className="flex gap-2 items-start">
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe exactly what happened..."
                            rows={4}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-safety-orange"
                        />
                        <motion.button
                            onPointerDown={handleMicDown}
                            onPointerUp={handleMicUp}
                            onPointerLeave={handleMicUp}
                            whileTap={{ scale: 0.9 }}
                            disabled={isTranscribing}
                            className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{
                                borderColor: isRecording ? '#E67E22' : '#e5e7eb',
                                backgroundColor: isRecording ? '#FFF5EC' : 'white',
                            }}>
                            {isTranscribing
                                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-safety-orange" />
                                : <Mic size={22} className={isRecording ? 'text-safety-orange' : 'text-gray-400'} />
                            }
                        </motion.button>
                    </div>
                </div>

                {/* Timestamp + Site */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{now()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        <span>{activeSite?.name ?? 'Unknown Site'}</span>
                    </div>
                </div>

                {/* Photo */}
                <div>
                    <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
                        className="hidden" onChange={handlePhoto} />
                    <button onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded-2xl border-2 border-dashed py-6 flex flex-col items-center gap-2 transition-all active:scale-[0.98]"
                        style={{ borderColor: '#E67E22' }}>
                        {photo
                            ? <img src={photo} alt="attached" className="w-full h-40 object-cover rounded-xl" />
                            : <>
                                <Camera size={28} className="text-safety-orange" />
                                <span className="text-sm font-bold text-safety-orange">Tap to attach a photo</span>
                              </>
                        }
                    </button>
                </div>
            </div>

            {/* Submit */}
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white/90 backdrop-blur-sm">
                <button onClick={handleSubmit} disabled={!description.trim()}
                    className="w-full py-4 rounded-full text-white font-black text-base transition-all active:scale-[0.98] disabled:opacity-40"
                    style={{ backgroundColor: '#E67E22' }}>
                    Submit Report
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                    Submitted reports are visible to your KAM coordinator only.
                </p>
            </div>
        </div>
    );
};

export default IncidentReport;
