import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Globe, Code, User, Award, ExternalLink, Instagram } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import profileImg from '../assets/profile.jpg';

const AboutPage = () => {
    const developerInfo = {
        name: "Parth Bhanderi",
        title: "Full Stack Developer & AI Engineer",
        bio: "Passionate about building intuitive and powerful web applications. Creator of FixPix. Focused on bridging the gap between complex AI capabilities and accessible user experiences.",
        location: "Planet Earth",
        socials: [
            { icon: Github, link: "https://github.com/theparthbhanderi", label: "GitHub" },
            { icon: Linkedin, link: "https://www.linkedin.com/in/parth-bhanderi-366433330", label: "LinkedIn" },
            { icon: Instagram, link: "https://www.instagram.com/theparthbhanderi/", label: "Instagram" },
            { icon: Mail, link: "mailto:theparthbhanderi@gmail.com", label: "Email" },
            { icon: Globe, link: "https://parthbhanderi.in", label: "Website" }
        ],
        skills: [
            "React", "Node.js", "Python", "AI Integration", "UI/UX Design", "System Architecture"
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/30 overflow-hidden">
            <Navbar />

            <motion.main
                className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="text-center mb-16 space-y-6">
                    <div className="relative inline-block group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                        {/* Image Container */}
                        <div className="relative h-40 w-40 sm:h-48 sm:w-48 mx-auto rounded-full p-1.5 bg-background z-10 overflow-hidden ring-1 ring-border-light shadow-2xl">
                            <img
                                src={profileImg}
                                alt={developerInfo.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 max-w-3xl mx-auto">
                        <motion.h1
                            className="text-4xl sm:text-5xl font-bold tracking-tight text-text-main"
                        >
                            {developerInfo.name}
                        </motion.h1>
                        <p className="text-xl text-primary font-medium">{developerInfo.title}</p>
                        <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
                            {developerInfo.bio}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        {developerInfo.socials.map((social, index) => {
                            const Icon = social.icon;
                            return (
                                <motion.a
                                    key={index}
                                    href={social.link}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 rounded-xl bg-surface/50 border border-border-light/50 text-text-secondary hover:bg-surface hover:border-primary/30 hover:text-primary transition-all duration-300 shadow-sm backdrop-blur-sm"
                                    aria-label={social.label}
                                >
                                    <Icon size={24} />
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Skills Section */}
                    <motion.div variants={itemVariants} className="glass p-8 rounded-2xl hover:border-primary/30 transition-colors duration-300 group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                <Code size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main">Technical Arsenal</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {developerInfo.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-lg bg-surface/50 border border-border-light/50 text-text-secondary text-sm font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all duration-300 cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Philosophy Section */}
                    <motion.div variants={itemVariants} className="glass p-8 rounded-2xl hover:border-primary/30 transition-colors duration-300 group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                <Award size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main">Vision & Philosophy</h2>
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-6">
                            Believing in the intersection of technology and art. Every line of code is a brush stroke, and every application is a masterpiece layout waiting to be discovered. Focused on creating user-centric experiences that simplify complex problems.
                        </p>
                        <a href="https://parthbhanderi.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group/link">
                            View Portfolio <ExternalLink size={16} className="group-hover/link:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </motion.main>
            <Footer />
        </div>
    );
};

export default AboutPage;
