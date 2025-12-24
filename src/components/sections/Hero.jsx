import React, { useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import MaterialCard from '../ui/MaterialCard';
import { Sparkles, Upload } from 'lucide-react';
import { ImageContext } from '../../context/ImageContext';
import BeforeAfterSlider from '../features/BeforeAfterSlider';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const fileInputRef = useRef(null);
    const { uploadImage } = useContext(ImageContext);
    const navigate = useNavigate();

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await uploadImage(file);
            navigate('/app');
        }
    };

    const handleGalleryClick = () => {
        navigate('/app');
    };

    return (
        <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-surface">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div className="max-w-5xl mx-auto text-center space-y-8 z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        ✨ AI-Powered Photo Restoration
                    </span>
                    <h1 className="h1 text-text-main mb-6">
                        Restore. Enhance. <br />
                        <span className="text-primary text-glow">
                            Relive Your Memories.
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="p-large max-w-2xl mx-auto"
                >
                    FixPix uses advanced AI to unblur, colorize, and upscale your photos in seconds. Secure, private, and fast.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <Button size="lg" variant="primary" icon={Upload} onClick={handleUploadClick}>
                        Upload Image
                    </Button>
                    <Button size="lg" variant="outline" icon={Sparkles} onClick={handleGalleryClick}>
                        Explore Demo
                    </Button>
                </motion.div>

                {/* Hero Visual - Interactive Comparison */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mt-16 mx-auto w-full max-w-4xl"
                >
                    <div className="glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl relative">
                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl opacity-20 pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/30 rounded-full blur-3xl opacity-20 pointer-events-none" />

                        <div className="aspect-[4/3] md:aspect-video rounded-xl overflow-hidden relative shadow-inner">
                            <BeforeAfterSlider
                                before="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop&sat=-100&blur=50"
                                after="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                            />
                        </div>

                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-text-secondary">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>Drag slider to see the magic</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
