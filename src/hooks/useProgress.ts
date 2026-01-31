import { useState, useEffect } from 'react';
import { z } from 'zod';

const ProgressSchema = z.object({
    highestUnlockedId: z.number().min(1).max(10),
    completedModules: z.array(z.number().min(1).max(10)),
});

type Progress = z.infer<typeof ProgressSchema>;

const STORAGE_KEY = 'stoic-dad-progress-v2';

export function useProgress() {
    const [highestUnlockedId, setHighestUnlockedId] = useState(1);
    const [completedModules, setCompletedModules] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const validated = ProgressSchema.parse(parsed);
                setHighestUnlockedId(validated.highestUnlockedId);
                setCompletedModules(validated.completedModules);
            }
        } catch (err) {
            console.error('Failed to load progress:', err);
            setError('Failed to load progress. Starting fresh.');
            // Clear corrupted data
            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage whenever progress changes
    useEffect(() => {
        if (!isLoaded) return;

        try {
            const data: Progress = {
                highestUnlockedId,
                completedModules,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (err) {
            console.error('Failed to save progress:', err);
            setError('Failed to save progress. Storage may be full.');
        }
    }, [highestUnlockedId, completedModules, isLoaded]);

    const completeModule = (moduleId: number) => {
        if (!completedModules.includes(moduleId)) {
            setCompletedModules(prev => [...prev, moduleId].sort((a, b) => a - b));
        }

        const nextId = moduleId + 1;
        if (nextId > highestUnlockedId && nextId <= 10) {
            setHighestUnlockedId(nextId);
        }
    };

    const resetProgress = () => {
        setHighestUnlockedId(1);
        setCompletedModules([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const getCompletionPercentage = (totalModules: number) => {
        return (completedModules.length / totalModules) * 100;
    };

    return {
        highestUnlockedId,
        completedModules,
        isLoaded,
        error,
        completeModule,
        resetProgress,
        getCompletionPercentage,
    };
}
