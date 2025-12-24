import React, { useEffect, useContext } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ImageContext } from '../../context/ImageContext';

const OnboardingTour = () => {
    const { selectedImage } = useContext(ImageContext);

    useEffect(() => {
        // Check if user has completed the tour before
        const hasCompletedTour = localStorage.getItem('fixpix_tour_completed');

        // Only show tour if:
        // 1. User hasn't completed it
        // 2. There's no image loaded (i.e., fresh session)
        if (hasCompletedTour || selectedImage) return;

        // Small delay to let the page render
        const timeoutId = setTimeout(() => {
            const driverObj = driver({
                showProgress: true,
                animate: true,
                allowClose: true,
                overlayColor: 'rgba(0, 0, 0, 0.8)',
                stagePadding: 10,
                stageRadius: 12,
                popoverClass: 'fixpix-tour-popover',
                onDestroyStarted: () => {
                    localStorage.setItem('fixpix_tour_completed', 'true');
                    driverObj.destroy();
                },
                steps: [
                    {
                        element: '[data-tour="upload-zone"]',
                        popover: {
                            title: '👋 Welcome to FixPix!',
                            description: 'Start by uploading an old or damaged photo here. Drag & drop or click to browse.',
                            side: 'bottom',
                            align: 'center'
                        }
                    },
                    {
                        element: '[data-tour="tools-panel"]',
                        popover: {
                            title: '🛠️ Your AI Toolbox',
                            description: 'Enable powerful features like Face Restoration, Colorization, and Background Removal.',
                            side: 'left',
                            align: 'center'
                        }
                    },
                    {
                        element: '[data-tour="generate-button"]',
                        popover: {
                            title: '⚡ Generate Magic',
                            description: 'Click "Generate" to apply your selected enhancements. Watch your photo transform!',
                            side: 'top',
                            align: 'center'
                        }
                    },
                    {
                        element: '[data-tour="floating-dock"]',
                        popover: {
                            title: '🎛️ Quick Controls',
                            description: 'Access zoom, undo/redo, theme toggle, and download options from this floating dock.',
                            side: 'top',
                            align: 'center'
                        }
                    },
                    {
                        popover: {
                            title: '🚀 You\'re Ready!',
                            description: 'That\'s it! Start restoring your memories. Have fun!',
                        }
                    }
                ]
            });

            driverObj.drive();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [selectedImage]);

    return null; // This component doesn't render anything visible
};

export default OnboardingTour;
