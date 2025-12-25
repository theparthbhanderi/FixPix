import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin, Mail, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Github, href: 'https://github.com/theparthbhanderi', label: 'GitHub' },
        { icon: Instagram, href: 'https://www.instagram.com/theparthbhanderi/', label: 'Instagram' },
        { icon: Linkedin, href: 'https://www.linkedin.com/in/parth-bhanderi-366433330', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:theparthbhanderi@gmail.com', label: 'Email' },
    ];

    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'Get Started', to: '/app' },
        { label: 'Login', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
    ];

    return (
        <footer className="w-full border-t border-border-light bg-surface-elevated/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold text-text-main">FixPix</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            AI-powered photo restoration tool. Bring your old memories back to life with cutting-edge technology.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:text-center">
                        <h4 className="font-semibold text-text-main mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-text-secondary hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="md:text-right">
                        <h4 className="font-semibold text-text-main mb-4">Connect</h4>
                        <div className="flex gap-3 md:justify-end">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-surface-elevated hover:bg-primary/20 flex items-center justify-center text-text-secondary hover:text-primary transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-text-secondary text-sm">
                        © {currentYear} FixPix. All rights reserved.
                    </p>
                    <p className="text-text-secondary text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Parth Bhanderi
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
