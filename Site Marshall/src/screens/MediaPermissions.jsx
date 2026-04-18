import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PermissionRow = ({ icon: Icon, title, description, status, onRequest }) => {
    const { t } = useAppContext();
    return (
        <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border-2 border-transparent shadow-sm">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFF0E6' }}>
                <Icon size={22} className="text-safety-orange" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-base">{title}</p>
                <p className="text-gray-400 text-sm mt-0.5">{description}</p>
            </div>

            <div className="shrink-0">
                {status === 'granted' && <CheckCircle2 size={22} className="text-green-500" />}
                {status === 'denied' && <XCircle size={22} className="text-red-400" />}
                {status === 'idle' && (
                    <button
                        onClick={onRequest}
                        className="text-xs font-bold text-white px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: '#E67E22' }}
                    >
                        {t('allow')}
                    </button>
                )}
            </div>
        </div>
    );
};

const MediaPermissions = () => {
    const { t } = useAppContext();
    const navigate = useNavigate();
    const [camera, setCamera] = useState('idle');
    const [mic, setMic] = useState('idle');

    const requestCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(t => t.stop());
            setCamera('granted');
        } catch {
            setCamera('denied');
        }
    };

    const requestMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(t => t.stop());
            setMic('granted');
        } catch {
            setMic('denied');
        }
    };

    const canContinue = camera !== 'idle' || mic !== 'idle';

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-5 py-10" style={{ backgroundColor: '#0D1B2A' }}>
            {/* Icon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg"
                style={{ backgroundColor: '#E67E22' }}
            >
                <ShieldCheck size={36} className="text-white" />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-white mb-2 text-center"
            >
                {t('permissions_needed')}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="text-sm text-center mb-8"
                style={{ color: 'rgba(255,255,255,0.45)' }}
            >
                {t('permissions_desc')}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="w-full max-w-md flex flex-col gap-3 mb-8"
            >
                <PermissionRow
                    icon={Camera}
                    title={t('camera_title')}
                    description={t('camera_desc')}
                    status={camera}
                    onRequest={requestCamera}
                />
                <PermissionRow
                    icon={Mic}
                    title={t('mic_title')}
                    description={t('mic_desc')}
                    status={mic}
                    onRequest={requestMic}
                />
            </motion.div>

            <AnimatePresence>
                {canContinue && (
                    <motion.button
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => navigate('/scanner')}
                        className="w-full max-w-md text-white font-bold text-lg py-4 rounded-full hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#E67E22' }}
                    >
                        {t('continue_to_dashboard')}
                    </motion.button>
                )}
            </AnimatePresence>

            {!canContinue && (
                <button
                    onClick={() => navigate('/scanner')}
                    className="mt-3 text-sm font-semibold"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                    {t('skip_for_now')}
                </button>
            )}
        </div>
    );
};

export default MediaPermissions;
