import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import ToolsPanel from '../components/layout/ToolsPanel';
import ImageWorkspace from '../components/features/ImageWorkspace';

const DashboardPage = () => {
    return (
        <div className="flex h-screen bg-surface overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex relative">
                <ImageWorkspace />
                <ToolsPanel />
            </main>
        </div>
    );
};

export default DashboardPage;
