import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import MaterialCard from '../components/ui/MaterialCard';
import Button from '../components/ui/Button';
import {
    Wand2, FolderOpen, Layers, Settings,
    Image, Clock, Sparkles, ArrowRight
} from 'lucide-react';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

    // Quick action cards
    const quickActions = [
        { icon: Wand2, title: 'Restore Photo', desc: 'AI-powered restoration', link: '/app/restoration', color: 'from-purple-500 to-indigo-600' },
        { icon: Layers, title: 'Batch Process', desc: 'Process multiple images', link: '/app/batch', color: 'from-blue-500 to-cyan-500' },
        { icon: FolderOpen, title: 'My Projects', desc: 'View saved work', link: '/app/projects', color: 'from-emerald-500 to-teal-500' },
        { icon: Settings, title: 'Settings', desc: 'Customize preferences', link: '/app/settings', color: 'from-orange-500 to-red-500' },
    ];

    // Stats (placeholder - can be connected to API)
    const stats = [
        { label: 'Images Restored', value: '24', icon: Image },
        { label: 'Time Saved', value: '3h', icon: Clock },
        { label: 'AI Enhancements', value: '156', icon: Sparkles },
    ];

    return (
        <div className="p-6 md:p-8 w-full h-full overflow-y-auto">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-text-main">
                    Good {timeOfDay}, {user?.username || 'there'}! 👋
                </h1>
                <p className="text-text-secondary mt-2 text-lg">
                    Ready to restore some memories?
                </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-8"
            >
                {stats.map((stat, i) => (
                    <MaterialCard key={i} className="text-center p-4">
                        <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-text-main">{stat.value}</div>
                        <div className="text-sm text-text-secondary">{stat.label}</div>
                    </MaterialCard>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-xl font-semibold text-text-main mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.link}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className="group cursor-pointer"
                            >
                                <MaterialCard className="relative overflow-hidden h-full">
                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg`}>
                                        <action.icon className="w-6 h-6 text-white" />
                                    </div>

                                    <h3 className="font-semibold text-text-main group-hover:text-primary transition-colors flex items-center gap-2">
                                        {action.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </h3>
                                    <p className="text-sm text-text-secondary mt-1">{action.desc}</p>
                                </MaterialCard>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* CTA Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
            >
                <MaterialCard className="bg-gradient-to-r from-primary/20 to-accent-purple/20 border border-primary/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-text-main">Start Restoring Now</h3>
                            <p className="text-text-secondary">Upload your old photos and let AI do the magic</p>
                        </div>
                        <Link to="/app/restoration">
                            <Button className="whitespace-nowrap">
                                <Wand2 className="w-4 h-4 mr-2" />
                                Open Editor
                            </Button>
                        </Link>
                    </div>
                </MaterialCard>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
