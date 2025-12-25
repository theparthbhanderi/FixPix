import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 text-center max-w-lg">
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="mb-8"
                >
                    <h1 className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent select-none">
                        404
                    </h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl md:text-3xl font-bold text-text-main">
                            Page Not Found
                        </h2>
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>

                    <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off into the digital void. Let's get you back on track.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/">
                        <Button size="lg" className="w-full sm:w-auto">
                            <Home className="w-5 h-5 mr-2" />
                            Go Home
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </Button>
                </motion.div>

                {/* Fun Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-6xl"
                >
                    <motion.span
                        animate={{
                            rotate: [0, 10, -10, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                        className="inline-block"
                    >
                        🔍
                    </motion.span>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
