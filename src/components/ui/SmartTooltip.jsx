import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartTooltip = ({ children, title, description, mediaSrc, mediaType = 'image' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full ml-4 z-50 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-none"
                    >
                        {/* Media Preview Area */}
                        <div className="h-32 bg-surface-highlight flex items-center justify-center overflow-hidden relative">
                            {mediaSrc ? (
                                mediaType === 'video' ? (
                                    <video src={mediaSrc} autoPlay loop muted className="w-full h-full object-cover" />
                                ) : (
                                    <img src={mediaSrc} alt={title} className="w-full h-full object-cover" />
                                )
                            ) : (
                                // Fallback visual if no media provided
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                    <span className="text-4xl">✨</span>
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                        </div>

                        {/* Text Content */}
                        <div className="p-4 relative -mt-6">
                            <h4 className="text-white font-bold text-sm mb-1 shadow-black drop-shadow-md">{title}</h4>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartTooltip;
