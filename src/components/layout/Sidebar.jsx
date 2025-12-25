import React, { useContext } from 'react';
import { ImageContext } from '../../context/ImageContext';
import Logo from '../ui/Logo';
import { Layers, Image as ImageIcon, Settings, SquareStack, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import AuthContext from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-r-full mr-4 cursor-pointer transition-all duration-200 text-sm font-medium",
            active
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-surface-highlight hover:text-text-main"
        )}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </div>
);

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const { uploadImage, theme, toggleTheme } = useContext(ImageContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to check active route
    const isActive = (path) => location.pathname.includes(path);

    return (
        <aside className="w-64 glass-panel border-r border-border-light h-full flex flex-col py-6">
            <div className="px-6 mb-10">
                <Logo />
            </div>

            <div className="flex-1 space-y-1">
                <div className="px-6 mb-6">
                    <label className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl cursor-pointer shadow-neon transition-all active:scale-95 font-medium border border-transparent hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)]">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    uploadImage(e.target.files[0]);
                                    navigate('/app/restoration'); // Switch to editor on upload
                                }
                            }}
                        />
                        <span className="text-xl">+</span> New Project
                    </label>
                </div>

                <div className="px-6 text-xs font-bold text-text-secondary mb-2 tracking-wider">WORKSPACE</div>
                <SidebarItem
                    icon={ImageIcon}
                    label="Restoration"
                    active={isActive('restoration')}
                    onClick={() => navigate('/app/restoration')}
                />
                <SidebarItem
                    icon={Layers}
                    label="My Projects"
                    active={isActive('projects')}
                    onClick={() => navigate('/app/projects')}
                />
                <SidebarItem
                    icon={SquareStack}
                    label="Batch Studio"
                    active={isActive('batch')}
                    onClick={() => navigate('/app/batch')}
                />
                <SidebarItem
                    icon={Settings}
                    label="Settings"
                    active={isActive('settings')}
                    onClick={() => navigate('/app/settings')}
                />
            </div>

            <div className="px-4 mt-auto space-y-3">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-text-secondary hover:bg-surface-highlight hover:text-text-main"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>{theme === 'dark' ? "Light Mode" : "Dark Mode"}</span>
                </button>

                <div className="bg-surface p-3 rounded-2xl flex items-center gap-3 border border-border-light">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-neon">
                        {user ? user.username[0].toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-text-main truncate">{user ? user.username : 'Guest'}</p>
                        <p className="text-xs text-text-secondary truncate">{user ? user.email : 'guest@example.com'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
