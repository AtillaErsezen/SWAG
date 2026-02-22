import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col bg-app-bg text-charcoal overflow-hidden relative">
            <Header />
            <Sidebar />
            <main className="flex-1 relative overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
