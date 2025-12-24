import React, { createContext, useContext, useState } from 'react';
import useHistory from '../hooks/useHistory';
import AuthContext from './AuthContext';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isMasking, setIsMasking] = useState(false);
    const [maskImage, setMaskImage] = useState(null);

    const defaultSettings = {
        removeScratches: false,
        faceRestoration: false,
        upscaleX: 1,
        colorize: false,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        autoEnhance: false,
        removeBackground: false
    };

    const [settings, setSettings, undoSettings, redoSettings, canUndo, canRedo, historyLog, jumpToHistory, historyIndex] = useHistory(defaultSettings);

    const { authTokens } = useContext(AuthContext);

    const uploadImage = async (file) => {
        // Create local preview immediately
        const url = URL.createObjectURL(file);
        setOriginalImage(url);
        setProcessedImage(null);
        setIsProcessing(false);
        // Reset history
        setSettings(defaultSettings);

        // Upload to server
        const formData = new FormData();
        formData.append('original_image', file);
        formData.append('title', file.name);

        try {
            const response = await fetch('http://localhost:8000/api/images/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + (authTokens?.access || '')
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentProject(data);
                console.log("Image uploaded successfully:", data);
            } else {
                console.error("Upload failed:", response.status, response.statusText);
                if (response.status === 401) {
                    alert("Session expired. Please Logout and Login again.");
                } else {
                    const errText = await response.text();
                    alert(`Upload Failed (${response.status}): ${errText || response.statusText}`);
                }
                setOriginalImage(null);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(`Upload Connection Error: ${error.message}`);
            setOriginalImage(null);
        }
    }


    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/images/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + (authTokens?.access || '')
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("Failed to fetch projects");
                return [];
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
    };

    const processImage = async (additionalData = {}) => {
        if (!currentProject) {
            alert("No active project found. Please re-upload the image.");
            return;
        }

        // Sanitize input: If called from an event handler, additionalData will be the Event object.
        // We must ignore Event objects to avoid cyclic JSON errors.
        const payloadData = (additionalData && typeof additionalData === 'object' && !additionalData.nativeEvent)
            ? additionalData
            : {};

        setIsProcessing(true);

        try {
            const body = {
                settings: settings,
                ...payloadData
            };

            const response = await fetch(`http://localhost:8000/api/images/${currentProject.id}/process_image/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + (authTokens?.access || '')
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const data = await response.json();
                setProcessedImage(`${data.processed_image}?t=${Date.now()}`);
            } else {
                console.error("Processing failed:", response.status, response.statusText);
                const errText = await response.text();
                alert(`Server Error (${response.status}): ${errText || response.statusText}`);
            }
        } catch (error) {
            console.error("Error processing:", error);
            alert(`Connection Failed: ${error.message}. Check console for details.`);
        } finally {
            setIsProcessing(false);
        }
    };

    const [isHistoryAction, setIsHistoryAction] = useState(false);

    // Effect to auto-process when settings change due to Undo/Redo
    React.useEffect(() => {
        if (isHistoryAction && currentProject && !isProcessing) {
            console.log("Auto-processing due to History Action (Undo/Redo)");
            processImage(); // Re-process with restored settings
            setIsHistoryAction(false);
        }
    }, [settings, isHistoryAction]);

    const handleUndo = () => {
        setIsHistoryAction(true);
        undoSettings();
    };

    const handleRedo = () => {
        setIsHistoryAction(true);
        redoSettings();
    };

    const handleJumpToHistory = (index) => {
        setIsHistoryAction(true);
        jumpToHistory(index);
    };

    const updateSettings = (keyOrObject, value) => {
        let newSettings;
        if (typeof keyOrObject === 'object' && keyOrObject !== null) {
            newSettings = { ...settings, ...keyOrObject };
        } else {
            newSettings = { ...settings, [keyOrObject]: value };
        }
        setSettings(newSettings);
    };

    const loadProject = (project) => {
        setCurrentProject(project);
        setOriginalImage(project.original_image);
        setProcessedImage(project.processed_image);
        if (project.settings && Object.keys(project.settings).length > 0) {
            setSettings(project.settings);
        } else {
            setSettings(defaultSettings);
        }
    };

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark';
    });

    React.useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ImageContext.Provider
            value={{
                selectedImage: originalImage,
                originalImage,
                processedImage,
                isProcessing,
                settings,
                uploadImage,
                processImage,
                updateSettings,
                loadProject,
                currentProject,
                isCropping,
                setIsCropping,
                isMasking,
                setIsMasking,
                maskImage,
                setMaskImage,
                setMaskImage,
                undoSettings: handleUndo,
                redoSettings: handleRedo,
                canUndo,
                canRedo,
                setOriginalImage,
                historyLog,
                jumpToHistory: handleJumpToHistory,
                historyIndex,
                theme,
                toggleTheme
            }}
        >
            {children}
        </ImageContext.Provider>
    );
};

export const useImage = () => useContext(ImageContext);
