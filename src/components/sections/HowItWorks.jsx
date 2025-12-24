import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Cpu, Download } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: UploadCloud,
            title: "Upload Photo",
            description: "Drag and drop your image. We support JPG, PNG, and HEIC formats."
        },
        {
            icon: Cpu,
            title: "AI Processing",
            description: "Our neural engine analyzes and restores your image in roughly 5-10 seconds."
        },
        {
            icon: Download,
            title: "Download Result",
            description: "Preview the comparison and download your 4K restored image instantly."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 px-6 bg-surface border-y border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-main">
                        Restoration in 3 Simple Steps
                    </h2>
                    <p className="text-text-secondary text-lg">
                        We made complex AI technology accessible to everyone.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-white/10 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-full glass-panel border border-primary/20 shadow-neon flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
                                    <step.icon className="w-10 h-10 text-primary" />
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-surface border border-white/10 px-3 py-1 rounded-full text-sm font-bold text-text-secondary">
                                    Step {index + 1}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-text-main">{step.title}</h3>
                            <p className="text-text-secondary leading-relaxed max-w-xs">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
