/**
 * useTouchGestures - Mobile touch gesture utilities
 * 
 * Provides pinch-to-zoom, swipe detection, and touch-friendly interactions.
 */

import { useRef, useEffect, useState, useCallback } from 'react';

export const useTouchGestures = (elementRef) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const lastTouchDistance = useRef(null);
    const lastTouchPosition = useRef(null);

    // Calculate distance between two touch points
    const getTouchDistance = (touches) => {
        if (touches.length < 2) return null;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Get center point of touches
    const getTouchCenter = (touches) => {
        if (touches.length < 2) {
            return { x: touches[0].clientX, y: touches[0].clientY };
        }
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    };

    useEffect(() => {
        const element = elementRef?.current;
        if (!element) return;

        const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                lastTouchDistance.current = getTouchDistance(e.touches);
                lastTouchPosition.current = getTouchCenter(e.touches);
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();

                // Pinch-to-zoom
                const currentDistance = getTouchDistance(e.touches);
                if (lastTouchDistance.current && currentDistance) {
                    const scaleDelta = currentDistance / lastTouchDistance.current;
                    setScale((prev) => Math.max(0.5, Math.min(5, prev * scaleDelta)));
                    lastTouchDistance.current = currentDistance;
                }

                // Pan while zoomed
                const currentCenter = getTouchCenter(e.touches);
                if (lastTouchPosition.current) {
                    const dx = currentCenter.x - lastTouchPosition.current.x;
                    const dy = currentCenter.y - lastTouchPosition.current.y;
                    setPosition((prev) => ({
                        x: prev.x + dx,
                        y: prev.y + dy
                    }));
                    lastTouchPosition.current = currentCenter;
                }
            }
        };

        const handleTouchEnd = () => {
            lastTouchDistance.current = null;
            lastTouchPosition.current = null;
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [elementRef]);

    // Reset zoom and position
    const reset = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    // Zoom controls
    const zoomIn = useCallback(() => {
        setScale((prev) => Math.min(5, prev * 1.2));
    }, []);

    const zoomOut = useCallback(() => {
        setScale((prev) => Math.max(0.5, prev / 1.2));
    }, []);

    return {
        scale,
        position,
        reset,
        zoomIn,
        zoomOut,
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
    };
};

/**
 * useSwipeGesture - Detect swipe direction
 */
export const useSwipeGesture = (onSwipe, threshold = 50) => {
    const startPos = useRef({ x: 0, y: 0 });

    const handleTouchStart = useCallback((e) => {
        startPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }, []);

    const handleTouchEnd = useCallback((e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const dx = endX - startPos.current.x;
        const dy = endY - startPos.current.y;

        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
            if (Math.abs(dx) > Math.abs(dy)) {
                onSwipe?.(dx > 0 ? 'right' : 'left');
            } else {
                onSwipe?.(dy > 0 ? 'down' : 'up');
            }
        }
    }, [onSwipe, threshold]);

    return { handleTouchStart, handleTouchEnd };
};

export default useTouchGestures;
