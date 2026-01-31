import { useState, useEffect } from 'react';
import { z } from 'zod';

const StreakSchema = z.object({
    currentStreak: z.number().min(0),
    longestStreak: z.number().min(0),
    lastCheckIn: z.string().nullable(),
});

type StreakData = z.infer<typeof StreakSchema>;

const STORAGE_KEY = 'stoic-dad-streak-v2';

export function useStreak() {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const validated = StreakSchema.parse(parsed);
                setCurrentStreak(validated.currentStreak);
                setLongestStreak(validated.longestStreak);
                setLastCheckIn(validated.lastCheckIn);
            }
        } catch (err) {
            console.error('Failed to load streak:', err);
            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage whenever streak changes
    useEffect(() => {
        if (!isLoaded) return;

        try {
            const data: StreakData = {
                currentStreak,
                longestStreak,
                lastCheckIn,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (err) {
            console.error('Failed to save streak:', err);
        }
    }, [currentStreak, longestStreak, lastCheckIn, isLoaded]);

    const updateStreak = () => {
        const today = new Date().toDateString();

        if (lastCheckIn === today) {
            // Already checked in today
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak: number;
        if (lastCheckIn === yesterdayStr) {
            // Consecutive day
            newStreak = currentStreak + 1;
        } else if (lastCheckIn === null) {
            // First check-in ever
            newStreak = 1;
        } else {
            // Streak broken
            newStreak = 1;
        }

        setCurrentStreak(newStreak);
        setLongestStreak(Math.max(longestStreak, newStreak));
        setLastCheckIn(today);
    };

    const resetStreak = () => {
        setCurrentStreak(0);
        setLongestStreak(0);
        setLastCheckIn(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        currentStreak,
        longestStreak,
        lastCheckIn,
        isLoaded,
        updateStreak,
        resetStreak,
    };
}
