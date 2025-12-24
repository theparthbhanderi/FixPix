import React from 'react';
import { motion } from 'framer-motion';
import MaterialCard from '../ui/MaterialCard';

const TESTIMONIALS = [
    {
        name: "Sarah Jenkins",
        role: "Photographer",
        content: "I recovered photos from my grandmother's wedding that we thought were lost forever. The colorization is magic.",
        avatar: "S"
    },
    {
        name: "Mark Thompson",
        role: "Historian",
        content: "The level of detail FixPix recovers from century-old documents is simply unprecedented. A game changer.",
        avatar: "M"
    },
    {
        name: "Jessica Chen",
        role: "Designer",
        content: "I use this tool daily to upscale low-res assets from clients. It saves me hours of manual reconstruction time.",
        avatar: "J"
    },
    {
        name: "David Wilson",
        role: "Archivist",
        content: "Finally, an AI tool that respects the original grain while removing damage. Highly recommended.",
        avatar: "D"
    }
];

const Testimonials = () => {
    return (
        <section id="testimonials" className="py-24 px-6 bg-surface overflow-hidden">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-main">
                    Loved by Early Adopters
                </h2>
            </div>

            {/* Horizontal Scroll / Marquee */}
            <div className="flex overflow-hidden relative">
                <div className="flex gap-6 animate-marquee">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <MaterialCard key={i} className="min-w-[350px] flex-shrink-0">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main">{t.name}</h4>
                                    <p className="text-sm text-text-secondary">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-text-secondary italic">"{t.content}"</p>
                        </MaterialCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
