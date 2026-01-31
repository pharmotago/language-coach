/**
 * Zustand State Management for Language Immersion Coach
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, LanguageConfig, SkillLevel, Scenario } from '@/types/languageTypes';

interface LanguageStore {
    // State
    targetLanguage: LanguageConfig | null;
    skillLevel: SkillLevel | null;
    messages: Message[];
    currentScenario: Scenario | null;
    isInitialized: boolean;

    // Phase 4: Gamification
    coins: number;
    inventory: string[];
    avatarConfig: { skinColor: string; bgColor: string; eyeType: string; mouthType: string };
    addCoins: (amount: number) => void;
    purchaseItem: (itemId: string, cost: number) => boolean;
    updateAvatarConfig: (config: { skinColor: string; bgColor: string; eyeType: string; mouthType: string }) => void;

    // Actions
    setLanguage: (language: LanguageConfig) => void;
    setSkillLevel: (level: SkillLevel) => void;
    setScenario: (scenario: Scenario | null) => void;
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    resetConversation: () => void;
    initialize: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
    persist(
        (set, get) => ({
            // Initial state
            targetLanguage: null,
            skillLevel: null,
            messages: [],
            currentScenario: null,
            isInitialized: false,
            coins: 100, // Bonus for joining
            inventory: [],
            avatarConfig: { skinColor: '#f8d9ce', bgColor: 'bg-slate-700', eyeType: 'normal', mouthType: 'smile' },

            // Set target language
            setLanguage: (language) => set({ targetLanguage: language }),

            // Set skill level
            setSkillLevel: (level) => set({ skillLevel: level }),

            // Set current scenario
            setScenario: (scenario) => set({ currentScenario: scenario }),

            // Add a new message to the conversation
            addMessage: (message) =>
                set((state) => ({
                    messages: [...state.messages, message]
                })),

            // Clear all messages but keep settings
            clearMessages: () => set({ messages: [] }),

            // Complete reset
            resetConversation: () =>
                set({
                    targetLanguage: null,
                    skillLevel: null,
                    messages: [],
                    currentScenario: null,
                    isInitialized: false,
                    coins: 100,
                    inventory: [],
                    avatarConfig: { skinColor: '#f8d9ce', bgColor: 'bg-slate-700', eyeType: 'normal', mouthType: 'smile' }
                }),

            addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

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

            // Mark as initialized (after setup complete)
            initialize: () => set({ isInitialized: true })
        }),
        {
            name: 'language-coach-storage',
            // Only persist settings, not messages
            partialize: (state) => ({
                targetLanguage: state.targetLanguage,
                skillLevel: state.skillLevel,
                isInitialized: state.isInitialized,
                coins: state.coins,
                inventory: state.inventory,
                avatarConfig: state.avatarConfig
            })
        }
    )
);
