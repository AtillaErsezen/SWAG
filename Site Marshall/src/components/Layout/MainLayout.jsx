import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col bg-app-bg text-charcoal overflow-hidden relative">
            <Header />
            <main className="flex-1 relative overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
