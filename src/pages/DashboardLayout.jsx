import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-surface overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex relative h-full overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
