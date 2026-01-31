/**
 * Conversation History Persistence using IndexedDB
 */

import { Message, SkillLevel } from '@/types/languageTypes';

export interface SavedConversation {
    id: string;
    language: string;
    skillLevel: SkillLevel;
    scenario?: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    title: string;
}

class ConversationDB {
    private dbName = 'language-coach-db';
    private version = 1;
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        if (typeof window === 'undefined') return; // SSR safety

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create conversations store
                if (!db.objectStoreNames.contains('conversations')) {
                    const store = db.createObjectStore('conversations', { keyPath: 'id' });
                    store.createIndex('language', 'language', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                    store.createIndex('updatedAt', 'updatedAt', { unique: false });
                }

                // Create vocabulary store
                if (!db.objectStoreNames.contains('vocabulary')) {
                    const vocabStore = db.createObjectStore('vocabulary', { keyPath: 'id' });
                    vocabStore.createIndex('language', 'language', { unique: false });
                    vocabStore.createIndex('nextReviewDate', 'nextReviewDate', { unique: false });
                }
            };
        });
    }

    async saveConversation(conversation: SavedConversation): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['conversations'], 'readwrite');
            const store = transaction.objectStore('conversations');
            const request = store.put(conversation);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getConversation(id: string): Promise<SavedConversation | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['conversations'], 'readonly');
            const store = transaction.objectStore('conversations');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllConversations(): Promise<SavedConversation[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['conversations'], 'readonly');
            const store = transaction.objectStore('conversations');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteConversation(id: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['conversations'], 'readwrite');
            const store = transaction.objectStore('conversations');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async searchConversations(query: string): Promise<SavedConversation[]> {
        const all = await this.getAllConversations();
        const lowerQuery = query.toLowerCase();

        return all.filter(conv =>
            conv.title.toLowerCase().includes(lowerQuery) ||
            conv.language.toLowerCase().includes(lowerQuery) ||
            conv.messages.some(m => m.content.toLowerCase().includes(lowerQuery))
        );
    }
}

export const conversationDB = new ConversationDB();

// React Hook for Conversation History
export function useConversationHistory() {
    const [conversations, setConversations] = React.useState<SavedConversation[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        setLoading(true);
        try {
            const convs = await conversationDB.getAllConversations();
            setConversations(convs.sort((a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            ));
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveConversation = async (conversation: SavedConversation) => {
        await conversationDB.saveConversation(conversation);
        await loadConversations();
    };

    const deleteConversation = async (id: string) => {
        await conversationDB.deleteConversation(id);
        await loadConversations();
    };

    const searchConversations = async (query: string) => {
        const results = await conversationDB.searchConversations(query);
        setConversations(results);
    };

    return {
        conversations,
        loading,
        saveConversation,
        deleteConversation,
        searchConversations,
        refreshConversations: loadConversations
    };
}

// Import React for the hook
import React from 'react';
