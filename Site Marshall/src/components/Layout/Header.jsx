import React from 'react';
import { Home, UserCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import OfflineIndicator from '../OfflineIndicator';

const HEADERLESS_PREFIXES = [
    '/scanner', '/machine/', '/site-selector', '/permissions',
    '/manager', '/incident', '/bug-report', '/inbox', '/profile',
    '/messages',
];

const Header = () => {
    const { workerId } = useAppContext();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    if (HEADERLESS_PREFIXES.some(p => pathname.startsWith(p))) return null;

    return (
        <header className="h-16 bg-matte-indigo text-app-bg flex items-center justify-between px-4 shadow-md sticky top-0 z-40">
            <div className="font-bold text-lg">Site Marshall</div>

            {workerId && (
                <div className="flex items-center gap-3">
                    <OfflineIndicator isOnline={true} />
                    <div className="flex items-center gap-2 bg-deep-concrete px-3 py-1 rounded-full text-sm">
                        <UserCircle size={18} className="text-sage-green" />
                        <span className="font-medium">ID: {workerId}</span>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-deep-concrete rounded-md transition-colors text-app-bg"
                        aria-label="Home"
                    >
                        <Home size={24} />
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
