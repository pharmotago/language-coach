/**
 * Zustand State Management for Language Immersion Coach
 * Cleaned up version without gamification overhead.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, LanguageConfig, SkillLevel, Scenario, Mistake } from '@/types/languageTypes';
import { supabase } from '@/lib/supabase';

interface LanguageStore {
    // Current Context
    targetLanguage: LanguageConfig | null;
    isInitialized: boolean;

    // Per-Language State (indexed by language code)
    skillLevels: Record<string, SkillLevel>;
    messages: Record<string, Message[]>;
    mistakeLog: Record<string, Mistake[]>;
    currentScenarios: Record<string, Scenario | null>;
    dynamicScenarios: Scenario[];

    // Global Actions
    setLanguage: (language: LanguageConfig) => void;
    fetchDynamicContent: () => Promise<void>;
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
            dynamicScenarios: [],

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

            fetchDynamicContent: async () => {
                try {
                    const { data, error } = await supabase
                        .from('lc_dynamic_content')
                        .select('*')
                        .eq('content_type', 'scenario');

                    if (error) throw error;

                    if (data && data.length > 0) {
                        const mapped: Scenario[] = data.map((item: any) => ({
                            id: `dynamic-${item.id}`,
                            title: item.title,
                            description: item.data.description || '',
                            context: item.data.context || '',
                            difficulty: item.data.difficulty || 'Intermediate',
                            icon: item.data.icon || 'Sparkles'
                        }));
                        set({ dynamicScenarios: mapped });
                    }
                } catch (err) {
                    console.error('Failed to fetch dynamic scenarios:', err);
                }
            },

            initialize: () => {
                get().fetchDynamicContent();
                set({ isInitialized: true });
            }
        }),
        {
            name: 'language-coach-storage',
            // Only persist settings, not messages
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
