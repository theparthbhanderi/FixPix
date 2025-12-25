import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import MaterialCard from '../components/ui/MaterialCard';
import { Sun, Moon, Bell, BellOff, Eye, Download, Trash2, User, Mail, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
    const { user, logoutUser } = useContext(AuthContext);

    // Settings state
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [highQualityExport, setHighQualityExport] = useState(true);

    // Theme toggle
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // Setting toggle component
    const SettingToggle = ({ icon: Icon, title, description, enabled, onToggle }) => (
        <div className="flex items-center justify-between py-4 border-b border-border-light last:border-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h4 className="font-medium text-text-main">{title}</h4>
                    <p className="text-sm text-text-secondary">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-primary' : 'bg-gray-600'
                    }`}
            >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${enabled ? 'left-7' : 'left-1'
                    }`} />
            </button>
        </div>
    );

    return (
        <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-text-main mb-8"
            >
                Settings
            </motion.h1>

            <div className="space-y-6">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <MaterialCard>
                        <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Profile
                        </h3>

                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {user ? user.username[0].toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-text-main">
                                    {user ? user.username : 'Guest'}
                                </h2>
                                <p className="text-text-secondary flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {user ? user.email : 'guest@example.com'}
                                </p>
                                <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                                    Free Plan
                                </span>
                            </div>
                        </div>
                    </MaterialCard>
                </motion.div>

                {/* Appearance Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <MaterialCard>
                        <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-primary" />
                            Appearance
                        </h3>

                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {theme === 'dark' ? (
                                        <Moon className="w-5 h-5 text-primary" />
                                    ) : (
                                        <Sun className="w-5 h-5 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-text-main">Theme</h4>
                                    <p className="text-sm text-text-secondary">
                                        Currently using {theme} mode
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-primary/20 transition-colors flex items-center gap-2 text-text-main"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                            </button>
                        </div>
                    </MaterialCard>
                </motion.div>

                {/* Preferences Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <MaterialCard>
                        <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Preferences
                        </h3>

                        <SettingToggle
                            icon={notifications ? Bell : BellOff}
                            title="Notifications"
                            description="Get notified when processing is complete"
                            enabled={notifications}
                            onToggle={() => setNotifications(!notifications)}
                        />

                        <SettingToggle
                            icon={Download}
                            title="Auto-save Projects"
                            description="Automatically save your work"
                            enabled={autoSave}
                            onToggle={() => setAutoSave(!autoSave)}
                        />

                        <SettingToggle
                            icon={Eye}
                            title="High Quality Export"
                            description="Export images at maximum resolution"
                            enabled={highQualityExport}
                            onToggle={() => setHighQualityExport(!highQualityExport)}
                        />
                    </MaterialCard>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <MaterialCard className="border border-red-500/30">
                        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Danger Zone
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 text-red-400 border-red-400/50 hover:bg-red-500/10"
                                onClick={logoutUser}
                            >
                                Logout
                            </Button>
                        </div>
                    </MaterialCard>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage;
