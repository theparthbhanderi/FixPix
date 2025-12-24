import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const MaterialCard = ({ children, className, hoverEffect = true }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "material-card p-6 glass-panel text-text-main",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default MaterialCard;
