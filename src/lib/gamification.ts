export const XP_CONSTANTS = {
    READ_LESSON: 10,
    COMPLETE_QUIZ: 50,
    PERFECT_SCORE: 20,
    DAILY_CHECKIN: 15,
    WEEKLY_STREAK: 100
};

export interface LevelInfo {
    level: number;
    title: string;
    xpRequired: number; // Cumulative XP needed to reach *next* level
    minXp: number; // XP of current level start
}

export const LEVELS: LevelInfo[] = [
    { level: 1, title: 'Novice', minXp: 0, xpRequired: 100 },
    { level: 2, title: 'Apprentice', minXp: 100, xpRequired: 250 },
    { level: 3, title: 'Prokopton', minXp: 250, xpRequired: 500 },
    { level: 4, title: 'Practitioner', minXp: 500, xpRequired: 900 },
    { level: 5, title: 'Philosopher', minXp: 900, xpRequired: 1500 },
    { level: 6, title: 'Stoic', minXp: 1500, xpRequired: 2500 },
    { level: 7, title: 'Mentor', minXp: 2500, xpRequired: 4000 },
    { level: 8, title: 'Patriarch', minXp: 4000, xpRequired: 6000 },
    { level: 9, title: 'Sage', minXp: 6000, xpRequired: 9000 },
    { level: 10, title: 'Legend', minXp: 9000, xpRequired: 15000 },
];

export function calculateLevel(totalXp: number): LevelInfo {
    // Find the highest level where minXp <= totalXp
    const level = [...LEVELS].reverse().find(l => totalXp >= l.minXp);
    return level || LEVELS[0];
}

export function getNextLevel(currentLevel: number): LevelInfo | null {
    if (currentLevel >= LEVELS.length) return null;
    return LEVELS[currentLevel]; // Since levels are 1-indexed in display but array is 0-indexed logic maps nicely if we look at next index
}

// Get progress to next level percentage (0-100)
export function getLevelProgress(totalXp: number): number {
    const current = calculateLevel(totalXp);
    const next = getNextLevel(current.level);

    if (!next) return 100; // Max level

    const levelSpan = next.minXp - current.minXp;
    const progressInLevel = totalXp - current.minXp;

    return Math.min(100, Math.max(0, (progressInLevel / levelSpan) * 100));
}
