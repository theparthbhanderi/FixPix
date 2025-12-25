import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Lock, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../components/ui/Toast';

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const success = await loginUser(username, password);
        setIsLoading(false);

        if (success) {
            toast.success('Welcome back!', { title: 'Login Successful' });
            navigate('/app');
        } else {
            setError("Invalid credentials. Please try again.");
            toast.error('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-panel rounded-3xl p-10 shadow-neon relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <h2 className="h2 text-center mb-2 text-text-main">Welcome Back</h2>
                <p className="text-text-secondary text-center mb-8">Sign in to continue to FixPix.</p>

                {error && (
                    <div className="bg-red-50 text-accent-red text-sm p-3 rounded-lg mb-6 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">Username</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field pl-12"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button variant="primary" size="lg" className="w-full">
                        Log In
                    </Button>
                </form>

                <p className="text-center text-text-secondary mt-8 text-sm">
                    Don't have an account? <Link to="/signup" className="text-primary hover:text-primary-hover font-medium">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
