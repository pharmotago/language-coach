// Storage keys with version suffix for schema migration
export const STORAGE_KEYS = {
    PROGRESS: 'stoic-dad-progress-v2',
    STREAK: 'stoic-dad-streak-v2',
    JOURNAL_PREFIX: 'stoic-dad-journal',
    SETTINGS: 'stoic-dad-settings-v2',
    WELCOMED: 'stoic-dad-welcomed',
} as const;

// Module configuration
export const MODULE_CONFIG = {
    TOTAL_MODULES: 10,
    MIN_MODULE_ID: 1,
    MAX_MODULE_ID: 10,
} as const;

// Achievement thresholds
export const ACHIEVEMENT_THRESHOLDS = {
    FIRST_STEP: 1,
    HABIT_FORMER: 3,
    WEEK_WARRIOR: 7,
    DEDICATED_DAD: 30,
    STOIC_MASTER: 10,
    VIRTUE_MODULES: [7, 8, 9, 10], // Temperance, Justice, Wisdom, Final
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    CONFETTI: 3000,
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
    EMERGENCY: 'e',
    JOURNAL: 'j',
    STATS: 's',
    ESCAPE: 'escape',
} as const;

// Toast configuration
export const TOAST_CONFIG = {
    DEFAULT_DURATION: 3000,
    SUCCESS_DURATION: 2000,
    ERROR_DURATION: 4000,
} as const;

// Routes (for future navigation)
export const ROUTES = {
    HOME: '/',
    MODULE: (id: number) => `/#module-${id}`,
} as const;

// Design tokens
export const DESIGN_TOKENS = {
    COLORS: {
        PRIMARY: '#F59E0B', // Amber 500
        BACKGROUND: '#020617', // Slate 950
        SURFACE: '#0F172A', // Slate 900
        BORDER: '#1E293B', // Slate 800
        SUCCESS: '#10B981', // Emerald 500
        ERROR: '#EF4444', // Red 500
        WARNING: '#F59E0B', // Amber 500
        INFO: '#3B82F6', // Blue 500
    },
    BREAKPOINTS: {
        SM: 640,
        MD: 768,
        LG: 1024,
        XL: 1280,
    },
} as const;
