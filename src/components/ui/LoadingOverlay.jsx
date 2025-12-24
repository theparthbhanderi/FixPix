import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = ({ isProcessing }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Initializing AI Engine...",
        "Analyzing Image Structure...",
        "Removing Noise & Artifacts...",
        "Enhancing Details & Colors...",
        "Finalizing Output..."
    ];

    useEffect(() => {
        let interval;
        if (isProcessing) {
            setStep(0);
            interval = setInterval(() => {
                setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
            }, 1000); // Change text every second roughly
        }
        return () => clearInterval(interval);
    }, [isProcessing]);

    if (!isProcessing) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
            <div className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                    {/* Glowing Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary/30"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Spinning Core */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-t-4 border-primary shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <div className="h-8 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={step}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-primary font-bold text-lg text-glow"
                        >
                            {steps[step]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
