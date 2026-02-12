import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStreak } from '@/hooks/useStreak';

describe('useStreak', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.useFakeTimers();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useStreak());
        expect(result.current.currentStreak).toBe(0);
        expect(result.current.longestStreak).toBe(0);
    });

    it('should increment streak if checking in today', () => {
        const { result } = renderHook(() => useStreak());

        act(() => {
            result.current.updateStreak();
        });

        expect(result.current.currentStreak).toBe(1);
        const saved = JSON.parse(localStorage.getItem('language-coach-streak-v2') || '{}');
        expect(saved.currentStreak).toBe(1);
    });

    it('should reset streak if missed a day', () => {
        // Mock date to be 2 days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const data = {
            currentStreak: 5,
            longestStreak: 5,
            lastCheckIn: twoDaysAgo.toDateString()
        };
        localStorage.setItem('language-coach-streak-v2', JSON.stringify(data));

        const { result } = renderHook(() => useStreak());

        // We need to wait for the hook to load and then check.
        // The hook checks on mount via useEffect, but updateStreak is what does the logic.
        // Actually, the hook implementation doesn't check on mount for reset yet!
        // Let's verify if we need to call updateStreak to trigger the logic.

        act(() => {
            result.current.updateStreak();
        });

        expect(result.current.currentStreak).toBe(1); // Should reset to 1 (new streak)
    });
});
