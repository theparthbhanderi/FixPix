import { useState, useCallback, useContext } from 'react';
import { ImageContext } from '../context/ImageContext';
import AuthContext from '../context/AuthContext';

const useBatchProcessor = () => {
    const [queue, setQueue] = useState([]);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const { authTokens } = useContext(AuthContext);

    // Add files to queue
    const addToQueue = useCallback((files) => {
        const newItems = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            status: 'pending', // pending, processing, completed, error
            resultUrl: null,
            error: null
        }));
        setQueue(prev => [...prev, ...newItems]);
    }, []);

    // Remove file from queue
    const removeFromQueue = useCallback((id) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    }, []);

    // Process a single item
    const processItem = async (item) => {
        try {
            // 1. Upload
            const formData = new FormData();
            formData.append('original_image', item.file);
            formData.append('title', item.file.name);

            const uploadRes = await fetch('http://localhost:8000/api/images/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Upload failed');
            const project = await uploadRes.json();

            // 2. Process (Auto Enhance by default for batch)
            // We can extend this to accept specific settings passed to processQueue
            const settings = { autoEnhance: true };

            const processRes = await fetch(`http://localhost:8000/api/images/${project.id}/process_image/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({ settings })
            });

            if (!processRes.ok) throw new Error('Processing failed');
            const result = await processRes.json();

            return { success: true, resultUrl: result.processed_image };

        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    };

    // Process all pending items sequentially
    const processQueue = useCallback(async () => {
        setIsBatchProcessing(true);

        const itemsToProcess = queue.filter(item => item.status === 'pending');

        // We can't simply iterate because we need to update state for each item
        // Solution: Create a copy of queue ids to process
        for (const item of itemsToProcess) {
            // Update status to processing
            setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing' } : q));

            const { success, resultUrl, error } = await processItem(item);

            // Update status to completed/error
            setQueue(prev => prev.map(q => q.id === item.id ? {
                ...q,
                status: success ? 'completed' : 'error',
                resultUrl: success ? resultUrl : null,
                error: error || null
            } : q));
        }

        setIsBatchProcessing(false);
    }, [queue, authTokens]);

    const clearQueue = useCallback(() => {
        setQueue([]);
    }, []);

    return {
        queue,
        isBatchProcessing,
        addToQueue,
        removeFromQueue,
        processQueue,
        clearQueue
    };
};

export default useBatchProcessor;
