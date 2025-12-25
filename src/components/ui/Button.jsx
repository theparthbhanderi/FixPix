import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Button = ({
    variant = 'primary',
    size = 'md',
    icon: Icon,
    children,
    className,
    onClick,
    type,
    disabled,
    ...props
}) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-neon border border-transparent hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)]",
        secondary: "border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white bg-white dark:bg-white/5 hover:bg-gray-50 hover:dark:bg-white/10 hover:dark:border-white/30 hover:border-gray-300 backdrop-blur-sm",
        outline: "border border-primary text-primary hover:bg-primary/10",
        ghost: "text-text-secondary hover:text-text-main hover:bg-white/5",
        glow: "bg-accent-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:bg-accent-purple/80 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]",
        success: "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:bg-emerald-600 hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] border border-transparent",
    };

    const sizes = {
        sm: "px-4 py-1.5 text-xs font-semibold",
        md: "px-6 py-2.5 text-sm font-semibold",
        lg: "px-8 py-3.5 text-base font-bold",
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={cn(
                "rounded-xl flex items-center justify-center transition-all duration-300 select-none",
                variants[variant],
                sizes[size],
                disabled && "opacity-50 cursor-not-allowed grayscale pointer-events-none",
                className
            )}
            onClick={onClick}
            type={type}
            disabled={disabled}
            {...props}
        >
            {Icon && <Icon className={cn("mr-2", size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />}
            {children}
        </motion.button>
    );
};

export default Button;
