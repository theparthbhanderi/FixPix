import React from 'react';
import { cn } from '../../lib/utils';

const GlassCard = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                'glass rounded-2xl p-6 relative overflow-hidden',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
