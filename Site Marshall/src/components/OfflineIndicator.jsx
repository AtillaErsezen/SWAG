import React from 'react';
import { Wifi, WifiOff, CloudOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const OfflineIndicator = ({ isOnline = true }) => {
    const { t } = useAppContext();
    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isOnline
                ? 'bg-sage-green/10 text-sage-green'
                : 'bg-safety-orange/10 text-safety-orange'
            }`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isOnline ? t('online') : t('offline')}
        </div>
    );
};

export default OfflineIndicator;
