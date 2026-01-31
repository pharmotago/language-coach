/**
 * Language Immersion Coach - Type Definitions
 */

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StreakData {
    current: number;
    longest: number;
    lastPracticeDate: Date;
    history: Date[];
}

// Phase 4: Gamification Types
export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'powerup' | 'avatar' | 'theme';
    icon: string;
    purchased: boolean;
}

export interface UserStats {
    coins: number;
    totalXp: number;
    level: number;
    streak: number;
}

// Phase 3: Infinite Content Engine Types

export interface QuizQuestion {
    id: string;
    type: 'multiple-choice' | 'translate' | 'fill-blank';
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer: string;
    explanation: string;
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    difficulty: SkillLevel;
    completed: boolean;
    score?: number;
}

export interface Lesson {
    id: string;
    title: string;
    topic: string; // e.g., "Food", "Travel", "Grammar: Past Tense"
    content: string; // The "teaching" part
    quiz: Quiz;
    generatedAt: Date;
}

export interface CultureNote {
    title: string;
    content: string;
    icon: string; // Emoji or Lucide icon
    tags: string[];
}

export interface Message {
    id: string;
    role: 'user' | 'coach';
    content: string;
    timestamp: Date;
    // For coach messages
    translation?: string;
    feedback?: Feedback;
    cultureNote?: CultureNote;
}

export interface Feedback {
    correction: string | null; // Grammar/syntax fixes
    polish: string; // Native-sounding alternative
    wordOfTheDay: {
        term: string;
        translation: string;
        usage: string;
    };
    generalTips?: string; // Optional coaching notes
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    context: string; // Context to inject into AI prompt
    difficulty: SkillLevel;
    icon: string; // Lucide icon name
}

export interface LanguageConfig {
    code: string; // ISO 639-1 code (e.g., 'es', 'fr', 'ja')
    name: string;
    nativeName: string;
    flag: string; // Emoji flag
    supportedLevels: SkillLevel[];
}

export interface ConversationState {
    targetLanguage: LanguageConfig | null;
    skillLevel: SkillLevel | null;
    messages: Message[];
    currentScenario: Scenario | null;
    isInitialized: boolean;
}
