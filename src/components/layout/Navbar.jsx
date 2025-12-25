
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ImageContext } from '../../context/ImageContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logoutUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ImageContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
                scrolled ? "bg-background/90 backdrop-blur-md border-border-light shadow-google-sm py-2" : "bg-background border-transparent py-4"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/">
                    <Logo />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">How it works</a>
                    <a href="#testimonials" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Testimonials</a>
                    <Link to="/about" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">About Dev</Link>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {/* Theme Toggle with Animation */}
                    <motion.button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-surface-elevated hover:bg-primary/20 text-text-secondary hover:text-primary transition-colors border border-border-light"
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            key={theme}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </motion.div>
                    </motion.button>

                    {user ? (
                        <>
                            <span className="text-sm text-text-secondary">Hi, {user.username}</span>
                            <Button variant="ghost" size="sm" onClick={logoutUser}>Logout</Button>
                            <Button variant="primary" size="sm" onClick={() => navigate('/app')}>Dashboard</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Log In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary" size="sm">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
