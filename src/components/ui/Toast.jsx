/**
 * Toast Notification System for FixPix
 * Provides app-wide toast notifications with different variants
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Toast Context
const ToastContext = createContext(null);

// Toast variants configuration
const VARIANTS = {
    success: {
        icon: CheckCircle,
        className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        iconClass: 'text-emerald-400'
    },
    error: {
        icon: AlertCircle,
        className: 'bg-red-500/10 border-red-500/30 text-red-400',
        iconClass: 'text-red-400'
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        iconClass: 'text-amber-400'
    },
    info: {
        icon: Info,
        className: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        iconClass: 'text-blue-400'
    }
};

// Single Toast Component
const Toast = ({ toast, onDismiss }) => {
    const variant = VARIANTS[toast.type] || VARIANTS.info;
    const Icon = variant.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
                "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg max-w-sm w-full",
                variant.className
            )}
        >
            <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", variant.iconClass)} />
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="font-semibold text-sm">{toast.title}</p>
                )}
                <p className={cn("text-sm", toast.title ? "opacity-80" : "")}>{toast.message}</p>
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-white/50 hover:text-white transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Toast Container Component
const ToastContainer = ({ toasts, dismissToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast toast={toast} onDismiss={dismissToast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, options = {}) => {
        const id = Date.now() + Math.random();
        const toast = {
            id,
            message,
            type: options.type || 'info',
            title: options.title || null,
            duration: options.duration || 4000
        };

        setToasts((prev) => [...prev, toast]);

        // Auto dismiss
        if (toast.duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, toast.duration);
        }

        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Convenience methods
    const toast = useCallback((message, options) => addToast(message, options), [addToast]);
    toast.success = (message, options) => addToast(message, { ...options, type: 'success' });
    toast.error = (message, options) => addToast(message, { ...options, type: 'error' });
    toast.warning = (message, options) => addToast(message, { ...options, type: 'warning' });
    toast.info = (message, options) => addToast(message, { ...options, type: 'info' });

    return (
        <ToastContext.Provider value={{ toast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} dismissToast={dismissToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
};

export default ToastProvider;
