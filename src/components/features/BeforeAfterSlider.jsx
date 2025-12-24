import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const BeforeAfterSlider = ({ before, after, className }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (event) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
            const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
            setSliderPosition(percent);
        }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (isDragging) handleMove(e);
        };

        const handleGlobalUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [isDragging]);

    const handleInteraction = (e) => {
        // Support click to jump
        handleMove(e);
    }

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-full overflow-hidden select-none cursor-ew-resize group", className)}
            onMouseDown={handleMouseDown}
            onClick={handleInteraction}
        >
            {/* After Image (Background - Right Side) */}
            <img
                src={after}
                alt="After"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Label After */}
            <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold z-10 pointer-events-none shadow-neon border border-white/10">
                AFTER
            </div>

            {/* Before Image (Foreground - Clipped - Left Side) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={before}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-contain"
                />
                {/* Label Before */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold z-10 border border-white/10">
                    BEFORE
                </div>
            </div>

            {/* Draggable Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-primary transform hover:scale-110 transition-transform">
                    <div className="flex gap-0.5">
                        <ChevronLeft className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
            {/* Input Range Overlay for Accessibility / Touch */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Comparison slider"
            />
        </div>
    );
};

export default BeforeAfterSlider;
