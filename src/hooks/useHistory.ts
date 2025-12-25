/**
 * useHistory - Undo/Redo History Management Hook (TypeScript)
 */

import { useState, useCallback } from 'react';

type HistoryResult<T> = [
    T,                          // current state
    (newState: T) => void,      // setState
    () => void,                 // undo
    () => void,                 // redo
    boolean,                    // canUndo
    boolean,                    // canRedo
    T[],                        // history log
    (index: number) => void,    // jumpTo
    number                      // current index
];

function useHistory<T>(initialState: T): HistoryResult<T> {
    const [index, setIndex] = useState<number>(0);
    const [history, setHistory] = useState<T[]>([initialState]);

    const setState = useCallback((newState: T) => {
        setHistory((prev) => {
            const newHistory = prev.slice(0, index + 1);
            newHistory.push(newState);
            return newHistory;
        });
        setIndex((prev) => prev + 1);
    }, [index]);

    const undo = useCallback(() => {
        setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, []);

    const redo = useCallback(() => {
        setIndex((prev) => (prev < history.length - 1 ? prev + 1 : prev));
    }, [history.length]);

    const jumpTo = useCallback((newIndex: number) => {
        if (newIndex >= 0 && newIndex < history.length) {
            setIndex(newIndex);
        }
    }, [history.length]);

    const canUndo = index > 0;
    const canRedo = index < history.length - 1;

    return [history[index], setState, undo, redo, canUndo, canRedo, history, jumpTo, index];
}

export default useHistory;
