import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ImageContext } from '../../context/ImageContext';
import { Undo, Redo, Download, ZoomIn, ZoomOut, Maximize, Sliders, ScanLine, Image as ImageIcon, Sun, Moon, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import ExportModal from '../features/ExportModal';
import ComparisonExport from '../features/ComparisonExport';

const DockItem = ({ icon: Icon, label, onClick, disabled, active, color }) => (
    <motion.button
        whileHover={{ scale: 1.2, y: -10 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "relative group p-3 rounded-2xl transition-all duration-300",
            active ? "bg-white/20 shadow-neon border border-white/20" : "hover:bg-white/10",
            disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:scale-100 hover:y-0"
        )}
        title={label}
    >
        <Icon className={cn("w-6 h-6", color || "text-white")} />

        {/* Tooltip */}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
        </span>

        {/* Active Indicator Dot */}
        {active && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_var(--primary-color)]" />
        )}
    </motion.button>
);

const FloatingDock = ({ togglePanel, isPanelOpen, zoomIn, zoomOut, resetTransform }) => {
    const {
        canUndo,
        canRedo,
        undoSettings,
        redoSettings,
        processedImage,
        originalImage,
        currentProject,
        isProcessing,
        selectedImage,
        theme,
        toggleTheme
    } = useContext(ImageContext);

    const [isExportOpen, setIsExportOpen] = React.useState(false);
    const [isComparisonOpen, setIsComparisonOpen] = React.useState(false);

    if (!selectedImage) return null;

    return (
        <>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40" data-tour="floating-dock">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-3xl glass-panel shadow-2xl backdrop-blur-xl"
                >
                    {/* History Controls */}
                    <div className="flex gap-1 border-r border-white/10 pr-2 mr-1">
                        <DockItem
                            icon={Undo}
                            label="Undo"
                            onClick={undoSettings}
                            disabled={!canUndo}
                        />
                        <DockItem
                            icon={Redo}
                            label="Redo"
                            onClick={redoSettings}
                            disabled={!canRedo}
                        />
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex gap-1 border-r border-white/10 pr-2 mr-1">
                        <DockItem icon={ZoomOut} label="Zoom Out" onClick={zoomOut} />
                        <DockItem icon={Maximize} label="Fit Screen" onClick={resetTransform} />
                        <DockItem icon={ZoomIn} label="Zoom In" onClick={zoomIn} />
                    </div>

                    {/* Main Actions */}
                    <div className="flex gap-1 pl-1">
                        <DockItem
                            icon={theme === 'dark' ? Sun : Moon}
                            label={theme === 'dark' ? "Light Mode" : "Dark Mode"}
                            onClick={toggleTheme}
                            color="text-yellow-400"
                        />
                        <DockItem
                            icon={Sliders}
                            label={isPanelOpen ? "Hide Tools" : "Show Tools"}
                            onClick={togglePanel}
                            active={isPanelOpen}
                            color="text-primary"
                        />

                        {processedImage && originalImage && (
                            <DockItem
                                icon={Share2}
                                label="Export Comparison"
                                onClick={() => setIsComparisonOpen(true)}
                                color="text-purple-400"
                            />
                        )}

                        {processedImage && (
                            <DockItem
                                icon={Download}
                                label="Download"
                                onClick={() => setIsExportOpen(true)}
                                color="text-green-400"
                            />
                        )}
                    </div>
                </motion.div>
            </div>

            <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
            <ComparisonExport isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} />
        </>
    );
};

export default FloatingDock;
