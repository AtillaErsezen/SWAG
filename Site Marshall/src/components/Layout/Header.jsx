import React from 'react';
import { Home, Menu, UserCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import OfflineIndicator from '../OfflineIndicator';

// Routes that manage their own full-screen layout — hide the shared header.
const HEADERLESS_ROUTES = ['/scanner'];

const Header = () => {
    const { workerId, toggleSidebar } = useAppContext();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    if (HEADERLESS_ROUTES.includes(pathname)) return null;

    return (
        <header className="h-16 bg-matte-indigo text-app-bg flex items-center justify-between px-4 shadow-md sticky top-0 z-40">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-deep-concrete rounded-md transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>
                <div className="font-bold text-lg">Site Marshall</div>
            </div>

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
