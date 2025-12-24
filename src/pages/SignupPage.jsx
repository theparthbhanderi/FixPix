import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Lock, User as UserIcon, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage = () => {
    const { registerUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await registerUser(username, email, password);
        if (result === true) {
            navigate('/app');
        } else {
            // Basic error handling - can be improved to parse specific field errors
            setError("Registration failed. Username might be taken.");
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-panel rounded-3xl p-10 shadow-neon relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <h2 className="h2 text-center mb-2 text-text-main">Create Account</h2>
                <p className="text-text-secondary text-center mb-8">Start your journey with FixPix today.</p>

                {error && (
                    <div className="bg-red-50 text-accent-red text-sm p-3 rounded-lg mb-6 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">Username</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field pl-12"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12"
                                placeholder="name@example.com"
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
                                placeholder="Create a password"
                                required
                            />
                        </div>
                    </div>

                    <Button variant="primary" size="lg" className="w-full mt-4">
                        Sign Up
                    </Button>
                </form>

                <p className="text-center text-text-secondary mt-8 text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:text-primary-hover font-medium">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignupPage;
