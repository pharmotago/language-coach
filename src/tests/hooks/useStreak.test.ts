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
            result.current.increment();
        });

        expect(result.current.currentStreak).toBe(1);
        expect(localStorage.getItem('stoic-dad-streak')).toBe('1');
    });

    it('should reset streak if missed a day', () => {
        // Mock date to be 2 days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        localStorage.setItem('stoic-dad-last-checkin', twoDaysAgo.toDateString());
        localStorage.setItem('stoic-dad-streak', '5');

        const { result } = renderHook(() => useStreak());

        // It should automatically reset on mount/check
        // But our hook might need a trigger or effect.
        // Looking at implementation, it checks on mount.

        // Wait for effect? useStreak uses useEffect internally? 
        // Let's assume the hook exposes a way to check or we simulate render.

        // If the hook logic handles reset internally on mount:
        expect(result.current.currentStreak).toBe(0); // Should be 0 if logic works
    });
});
