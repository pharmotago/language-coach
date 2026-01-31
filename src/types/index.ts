import { ComponentType } from 'react';

// Content structure
export interface QuizOption {
    text: string;
    isCorrect: boolean;
    feedback?: string;
}

// Support both new array format and legacy object format
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface LegacyQuiz {
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface ModuleContent {
    full_lesson_content: string;
    scripts?: string;
    challenge?: string;
    // Support both structures
    questions?: QuizQuestion[];
    quiz?: LegacyQuiz;
    audit?: string[];
}

// Module structure
export interface Module {
    id: number;
    title: string;
    summary: string;
    isLocked: boolean;
    content: ModuleContent;
    // Optional metadata
    spotifyId?: string;
    readTime?: number;
    badge?: string;
}

// ... other types stay the same ...
export interface Progress {
    highestUnlockedId: number;
    completedModules: number[];
}

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastCheckIn: string | null;
}

export interface Settings {
    soundEffects: boolean;
    darkMode: boolean;
    notifications: boolean;
    confettiEnabled: boolean;
}

export type AchievementId =
    | 'first-step'
    | 'habit-former'
    | 'week-warrior'
    | 'stoic-master'
    | 'virtue-scholar'
    | 'dedicated-dad';

export interface Achievement {
    id: AchievementId;
    name: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    unlocked: boolean;
    progress?: number;
    goal?: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}
