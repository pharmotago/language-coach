/**
 * Zustand State Management for Language Immersion Coach
 * Lightweight version — no gamification, no Supabase dependency.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, LanguageConfig, SkillLevel, Scenario, Mistake } from '@/types/languageTypes';

interface LanguageStore {
    // Current Context
    targetLanguage: LanguageConfig | null;
    isInitialized: boolean;

    // Per-Language State (indexed by language code)
    skillLevels: Record<string, SkillLevel>;
    messages: Record<string, Message[]>;
    mistakeLog: Record<string, Mistake[]>;
    currentScenarios: Record<string, Scenario | null>;

    // Global Actions
    setLanguage: (language: LanguageConfig) => void;
    initialize: () => void;
    resetAll: () => void;

    // Contextual Actions (auto-index by targetLanguage.code)
    setSkillLevel: (level: SkillLevel) => void;
    setScenario: (scenario: Scenario | null) => void;
    addMessage: (message: Message) => void;
    addMistake: (mistake: Mistake) => void;
    clearMistakes: () => void;
    clearMessages: () => void;

    // Internal Helpers
    _getLang: () => string;
}

export const useLanguageStore = create<LanguageStore>()(
    persist(
        (set, get) => ({
            // Current Context
            targetLanguage: null,
            isInitialized: false,

            // Per-Language Init
            skillLevels: {},
            messages: {},
            mistakeLog: {},
            currentScenarios: {},

            // Switch language context (non-destructive)
            setLanguage: (language) => set({ targetLanguage: language }),

            // Helper to get current language code
            _getLang: () => get().targetLanguage?.code || 'global',

            setSkillLevel: (level) => {
                const lang = get().targetLanguage?.code;
                if (!lang) return;
                set((state) => ({
                    skillLevels: { ...state.skillLevels, [lang]: level }
                }));
            },

            setScenario: (scenario) => {
                const lang = get().targetLanguage?.code;
                if (!lang) return;
                set((state) => ({
                    currentScenarios: { ...state.currentScenarios, [lang]: scenario }
                }));
            },

            addMessage: (message) => {
                const lang = get().targetLanguage?.code;
                if (!lang) return;
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [lang]: [...(state.messages[lang] || []), message]
                    }
                }));
            },

            addMistake: (mistake) => {
                const lang = get().targetLanguage?.code;
                if (!lang) return;
                set((state) => ({
                    mistakeLog: {
                        ...state.mistakeLog,
                        [lang]: [mistake, ...(state.mistakeLog[lang] || [])]
                    }
                }));
            },

            clearMistakes: () => {
                const langCode = get()._getLang();
                set((state) => ({
                    mistakeLog: { ...state.mistakeLog, [langCode]: [] }
                }));
            },

            clearMessages: () => {
                const lang = get().targetLanguage?.code;
                if (!lang) return;
                set((state) => ({
                    messages: { ...state.messages, [lang]: [] }
                }));
            },

            resetAll: () =>
                set({
                    targetLanguage: null,
                    isInitialized: false,
                    skillLevels: {},
                    messages: {},
                    mistakeLog: {},
                    currentScenarios: {}
                }),

            initialize: () => {
                set({ isInitialized: true });
            }
        }),
        {
            name: 'language-coach-storage',
            partialize: (state) => ({
                targetLanguage: state.targetLanguage,
                isInitialized: state.isInitialized,
                skillLevels: state.skillLevels,
                messages: state.messages,
                mistakeLog: state.mistakeLog,
                currentScenarios: state.currentScenarios
            })
        }
    )
);
