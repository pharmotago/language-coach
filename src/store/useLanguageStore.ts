/**
 * Zustand State Management for Language Immersion Coach
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, LanguageConfig, SkillLevel, Scenario, Mistake } from '@/types/languageTypes';
import { VocabularyCard, calculateNextReview } from '@/components/VocabularyFlashcards';

interface LanguageStore {
    // Current Context
    targetLanguage: LanguageConfig | null;
    isInitialized: boolean;

    // Per-Language State (indexed by language code)
    skillLevels: Record<string, SkillLevel>;
    messages: Record<string, Message[]>;
    mistakeLog: Record<string, Mistake[]>;
    vocabulary: Record<string, VocabularyCard[]>;
    currentScenarios: Record<string, Scenario | null>;

    // Global User State
    coins: number;
    energy: number;
    lastEnergyRefill: string | null;
    isPremium: boolean;
    inventory: string[];
    avatarConfig: { skinColor: string; bgColor: string; eyeType: string; mouthType: string };

    // Global Actions
    setLanguage: (language: LanguageConfig) => void;
    addCoins: (amount: number) => void;
    useEnergy: () => boolean;
    refillEnergy: () => void;
    setPremium: (status: boolean) => void;
    purchaseItem: (itemId: string, cost: number) => boolean;
    updateAvatarConfig: (config: { skinColor: string; bgColor: string; eyeType: string; mouthType: string }) => void;
    initialize: () => void;
    resetAll: () => void;

    // Contextual Actions (auto-index by targetLanguage.code)
    setSkillLevel: (level: SkillLevel) => void;
    setScenario: (scenario: Scenario | null) => void;
    addMessage: (message: Message) => void;
    addMistake: (mistake: Mistake) => void;
    clearMistakes: () => void;
    clearMessages: () => void;

    // Vocabulary Actions
    addVocabularyCard: (card: Omit<VocabularyCard, 'id' | 'dateAdded' | 'easinessFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'masteryLevel' | 'reviewCount'>) => void;
    updateVocabularyCard: (cardId: string, quality: number) => void;

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
            vocabulary: {},
            currentScenarios: {},

            // Global State
            coins: 100,
            energy: 20,
            lastEnergyRefill: new Date().toISOString(),
            isPremium: false,
            inventory: [],
            avatarConfig: { skinColor: '#f8d9ce', bgColor: 'bg-slate-700', eyeType: 'normal', mouthType: 'smile' },

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

            addVocabularyCard: (cardData) => {
                const lang = get().targetLanguage?.code;
                if (!lang) return;

                set((state) => {
                    const deck = state.vocabulary[lang] || [];
                    // Avoid duplicates
                    if (deck.find(c => c.term.toLowerCase() === cardData.term.toLowerCase())) return state;

                    const newCard: VocabularyCard = {
                        ...cardData,
                        id: Math.random().toString(36).substring(7),
                        dateAdded: new Date(),
                        easinessFactor: 2.5,
                        interval: 0,
                        repetitions: 0,
                        nextReviewDate: new Date(),
                        masteryLevel: 'new',
                        reviewCount: 0
                    };

                    return {
                        vocabulary: {
                            ...state.vocabulary,
                            [lang]: [newCard, ...deck]
                        }
                    };
                });
            },

            updateVocabularyCard: (cardId, quality) => {
                const lang = get().targetLanguage?.code;
                if (!lang) return;

                set((state) => {
                    const deck = state.vocabulary[lang] || [];
                    const updatedDeck = deck.map(card => {
                        if (card.id === cardId) {
                            return calculateNextReview(card, quality);
                        }
                        return card;
                    });

                    return {
                        vocabulary: {
                            ...state.vocabulary,
                            [lang]: updatedDeck
                        }
                    };
                });
            },

            clearMistakes: () => {
                const langCode = get()._getLang(); // Use the helper function
                set((state) => ({
                    mistakeLog: { ...state.mistakeLog, [langCode]: [] } // Target mistakeLog
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
                    vocabulary: {},
                    currentScenarios: {},
                    coins: 100,
                    energy: 20,
                    lastEnergyRefill: new Date().toISOString(),
                    isPremium: false,
                    inventory: [],
                    avatarConfig: { skinColor: '#f8d9ce', bgColor: 'bg-slate-700', eyeType: 'normal', mouthType: 'smile' }
                }),

            addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

            useEnergy: () => {
                const state = get();
                if (state.isPremium) return true;
                if (state.energy > 0) {
                    set({ energy: state.energy - 1 });
                    return true;
                }
                return false;
            },

            refillEnergy: () => set({ energy: 20, lastEnergyRefill: new Date().toISOString() }),

            setPremium: (status) => set({ isPremium: status }),

            purchaseItem: (itemId, cost) => {
                const state = get();
                if (state.coins >= cost && !state.inventory.includes(itemId)) {
                    set({
                        coins: state.coins - cost,
                        inventory: [...state.inventory, itemId]
                    });
                    return true;
                }
                return false;
            },

            updateAvatarConfig: (config) => set({ avatarConfig: config }),
            initialize: () => set({ isInitialized: true })
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
                vocabulary: state.vocabulary,
                currentScenarios: state.currentScenarios,
                currentScenarios: state.currentScenarios,
                coins: state.coins,
                energy: state.energy,
                lastEnergyRefill: state.lastEnergyRefill,
                isPremium: state.isPremium,
                inventory: state.inventory,
                avatarConfig: state.avatarConfig
            })
        }
    )
);
