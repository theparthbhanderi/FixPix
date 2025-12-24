import React, { useState, useContext } from 'react';
import { Sliders, Zap, Check, Wand2, Download, AlertCircle, Upload, Crop, Undo, Redo, RotateCcw, Sparkles, Eraser } from 'lucide-react';
import Button from '../ui/Button';
import SmartTooltip from '../ui/SmartTooltip';
import { cn } from '../../lib/utils';
import { ImageContext } from '../../context/ImageContext';

const ToolTab = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 text-sm font-medium gap-1",
            active
                ? "bg-primary/20 text-primary shadow-sm border border-primary/20"
                : "text-text-secondary hover:bg-white/5 hover:text-text-main"
        )}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const Toggle = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-sm font-medium text-text-main">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-200",
                enabled ? "bg-primary shadow-neon" : "bg-white/10"
            )}
        >
            <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                enabled ? "left-7" : "left-1"
            )} />
        </button>
    </div>
);

const RangeSlider = ({ label, value, min, max, step, onChange }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-text-secondary">
            <span>{label}</span>
            <span>{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
        />
    </div>
);

const ToolsPanel = () => {
    const {
        selectedImage,
        isProcessing,
        processImage,
        processedImage,
        settings,
        updateSettings,
        uploadImage,
        currentProject,
        isCropping,
        setIsCropping,
        isMasking,
        setIsMasking,
        undoSettings,
        redoSettings,
        canUndo,
        canRedo
    } = useContext(ImageContext);

    const [activeTab, setActiveTab] = useState('enhance');

    const handleDownload = () => {
        if (!currentProject?.id) return;
        const downloadUrl = `http://localhost:8000/api/images/${currentProject.id}/download/`;
        window.open(downloadUrl, '_blank');
    };

    return (
        <aside className="w-80 glass-panel h-[calc(100vh-2rem)] fixed right-4 top-4 rounded-3xl z-20 shadow-neon flex flex-col overflow-hidden transition-all duration-300">
            {/* Header / Title */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-main">Adjustments</h2>
                <Button
                    variant={isCropping ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setIsCropping(!isCropping)}
                    disabled={!selectedImage || isProcessing}
                    title="Crop Image"
                    className="ml-auto"
                >
                    <Crop className="w-4 h-4 mr-2" />
                    Crop
                </Button>
            </div>


            {/* Tabs */}
            <div className="p-4 border-b border-white/5 flex gap-2">
                <ToolTab
                    icon={Wand2}
                    label="Enhance"
                    active={activeTab === 'enhance'}
                    onClick={() => setActiveTab('enhance')}
                />
                <ToolTab
                    icon={Sparkles}
                    label="Magic"
                    active={activeTab === 'magic'}
                    onClick={() => setActiveTab('magic')}
                />
                <ToolTab
                    icon={Sliders}
                    label="Adjust"
                    active={activeTab === 'adjust'}
                    onClick={() => setActiveTab('adjust')}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {activeTab === 'enhance' && (
                    <div className="space-y-6">
                        <div className="bg-surface/50 p-4 rounded-2xl border border-white/5">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Restore & Fix</h3>

                            <SmartTooltip
                                title="Face Restoration"
                                description="Automatically detects and reconstructs blurred or damaged faces using GFPGAN AI."
                                mediaSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"
                            >
                                <div className="w-full">
                                    <Toggle
                                        label="Face Restoration"
                                        enabled={settings.faceRestoration}
                                        onChange={(v) => updateSettings({ faceRestoration: v })}
                                    />
                                </div>
                            </SmartTooltip>

                            <SmartTooltip
                                title="Scratch Removal"
                                description="Fills in cracks, scratches, and folded creases in old photographs."
                            >
                                <div className="w-full">
                                    <Toggle
                                        label="Scratch Removal"
                                        enabled={settings.removeScratches}
                                        onChange={(v) => updateSettings({ removeScratches: v })}
                                    />
                                </div>
                            </SmartTooltip>
                        </div>

                        <div className="bg-surface/50 p-4 rounded-2xl border border-white/5">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4"> Creative</h3>
                            <SmartTooltip
                                title="AI Colorization"
                                description="Uses deep learning to guess and apply realistic colors to Black & White photos."
                            >
                                <div className="w-full">
                                    <Toggle
                                        label="Colorization"
                                        enabled={settings.colorize}
                                        onChange={(v) => updateSettings({ colorize: v })}
                                    />
                                </div>
                            </SmartTooltip>
                        </div>

                        <div className="bg-surface/50 p-4 rounded-2xl border border-white/5">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Upscaling</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[2, 4].map((scale) => (
                                    <button
                                        key={scale}
                                        onClick={() => updateSettings({ upscaleX: scale })}
                                        className={cn(
                                            "py-2 rounded-lg border text-sm font-bold transition-all",
                                            settings.upscaleX === scale
                                                ? "bg-primary text-white border-primary shadow-neon"
                                                : "bg-transparent text-text-secondary border-white/10 hover:border-primary/50 hover:text-text-main"
                                        )}
                                    >
                                        {scale}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'magic' && (
                    <div className="space-y-6">
                        <div className="bg-surface/50 p-4 rounded-2xl border border-white/5 space-y-5">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">AI Magic Tools</h3>

                            <Toggle
                                label="Auto Enhance (Magic Wand)"
                                enabled={settings.autoEnhance}
                                onChange={(v) => updateSettings({ autoEnhance: v })}
                            />

                            <Toggle
                                label="Remove Background"
                                enabled={settings.removeBackground}
                                onChange={(v) => updateSettings({ removeBackground: v })}
                            />
                            <p className="text-xs text-text-secondary bg-yellow-500/10 text-yellow-200 p-2 rounded">
                                *Note: Background removal uses AI or GrabCut fallback.
                            </p>

                            <div className="pt-4 border-t border-white/10">
                                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Object Eraser</h4>
                                <Button
                                    variant={isMasking ? "primary" : "secondary"}
                                    className="w-full"
                                    onClick={() => setIsMasking(!isMasking)}
                                >
                                    <Eraser className="w-4 h-4 mr-2" />
                                    {isMasking ? "Stop Erasing" : "Open Eraser Tool"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'adjust' && (
                    <div className="space-y-6">
                        <div className="bg-surface/50 p-4 rounded-2xl border border-white/5 space-y-5">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Color Adjustments</h3>

                            <RangeSlider
                                label="Brightness"
                                value={settings.brightness || 1.0}
                                min={0.5} max={1.5} step={0.1}
                                onChange={(v) => updateSettings({ brightness: v })}
                            />
                            <RangeSlider
                                label="Contrast"
                                value={settings.contrast || 1.0}
                                min={0.5} max={1.5} step={0.1}
                                onChange={(v) => updateSettings({ contrast: v })}
                            />
                            <RangeSlider
                                label="Saturation"
                                value={settings.saturation || 1.0}
                                min={0.0} max={2.0} step={0.1}
                                onChange={(v) => updateSettings({ saturation: v })}
                            />
                        </div>
                    </div>
                )}
                {activeTab === 'history' && (
                    <HistoryPanel />
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-black/20 space-y-3">
                {/* Upload New Button */}
                {selectedImage && (
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                                if (e.target.files[0]) uploadImage(e.target.files[0]);
                            }}
                        />
                        <Button variant="outline" size="sm" className="w-full">
                            <Upload className="w-4 h-4 mr-2" /> Upload New Image
                        </Button>
                    </div>
                )}

                <div className="flex gap-2">
                    {/* Always allow generating/updating */}
                    <Button
                        variant="primary"
                        size="lg"
                        className={cn("shadow-lg flex-1", processedImage ? "bg-primary" : "w-full")}
                        disabled={!selectedImage || isProcessing}
                        onClick={processImage}
                    >
                        {isProcessing ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 mr-2" /> {processedImage ? "Update" : "Generate"}
                            </>
                        )}
                    </Button>

                    {processedImage && (
                        <Button
                            variant="success"
                            size="lg"
                            className="flex-1"
                            onClick={handleDownload}
                        >
                            <Download className="w-5 h-5 mr-2" /> Save
                        </Button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default ToolsPanel;
