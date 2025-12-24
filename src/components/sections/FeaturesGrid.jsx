import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Zap, MonitorPlay, Maximize2 } from 'lucide-react';
import MaterialCard from '../ui/MaterialCard';

const features = [
    {
        title: "Auto Colorization",
        description: "Automatically add color to black and white photos using deep learning.",
        icon: Wand2,
        color: "text-primary",
        bg: "bg-primary/10",
        colSpan: "col-span-12 md:col-span-8",
        rowSpan: "row-span-1"
    },
    {
        title: "Face Enhancement",
        description: "Restore facial details with incredible precision.",
        icon: Zap,
        color: "text-accent-yellow",
        bg: "bg-accent-yellow/10",
        colSpan: "col-span-12 md:col-span-4",
        rowSpan: "row-span-2"
    },
    {
        title: "Scratch Removal",
        description: "Intelligently fill in scratches and tears.",
        icon: MonitorPlay,
        color: "text-secondary",
        bg: "bg-secondary/10",
        colSpan: "col-span-12 md:col-span-4",
        rowSpan: "row-span-1"
    },
    {
        title: "4K Upscaling",
        description: "Increase resolution up to 4x without quality loss.",
        icon: Maximize2,
        color: "text-accent-red",
        bg: "bg-accent-red/10",
        colSpan: "col-span-12 md:col-span-8",
        rowSpan: "row-span-1"
    }
];

const FeaturesGrid = () => {
    return (
        <section id="features" className="py-24 px-6 bg-surface">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-main">
                        Powerful Tools in One Click
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Our AI engine understands your photos to apply the perfect restoration steps.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6 md:auto-rows-[200px]">
                    {features.map((feature, index) => (
                        <MaterialCard
                            key={index}
                            className={`relative overflow-hidden group ${feature.colSpan} ${feature.rowSpan}`}
                        >
                            <div className={`p-4 rounded-full w-fit mb-4 ${feature.bg}`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-text-main">{feature.title}</h3>
                            <p className="text-text-secondary">{feature.description}</p>

                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-primary text-sm font-medium flex items-center gap-1">
                                    Try Now <Wand2 className="w-3 h-3" />
                                </span>
                            </div>
                        </MaterialCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
