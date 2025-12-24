import React from 'react';
import { cn } from '../../lib/utils';

const Logo = () => {
    return (
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight select-none cursor-pointer">
            <span className="text-primary">Fix</span>
            <span className="text-secondary">Pix</span>
        </div>
    );
};

export default Logo;
