import { z, ZodSchema } from 'zod';

export class StorageService {
    /**
     * Get item from localStorage with Zod validation
     */
    static get<T>(key: string, schema: ZodSchema<T>): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const parsed = JSON.parse(item);
            return schema.parse(parsed);
        } catch (error) {
            console.error(`Failed to get ${key} from storage:`, error);
            // Clear corrupted data
            this.remove(key);
            return null;
        }
    }

    /**
     * Set item in localStorage with JSON serialization
     */
    static set<T>(key: string, value: T, schema?: ZodSchema<T>): boolean {
        try {
            // Validate before saving if schema provided
            if (schema) {
                schema.parse(value);
            }

            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded. Attempting cleanup...');
                this.cleanup();
                return false;
            }
            console.error(`Failed to set ${key} in storage:`, error);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     */
    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Failed to remove ${key} from storage:`, error);
        }
    }

    /**
     * Clear all app-specific data
     */
    static clearAll(prefix: string = 'stoic-dad-'): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Failed to clear storage:', error);
        }
    }

    /**
     * Get storage size in bytes
     */
    static getSize(): number {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    /**
     * Clean up old or large items when quota exceeded
     */
    private static cleanup(): void {
        console.warn('Attempting storage cleanup...');

        // Strategy: Remove oldest journal entries first
        const keys = Object.keys(localStorage);
        const journalKeys = keys.filter(k => k.startsWith('stoic-dad-journal-'));

        if (journalKeys.length > 0) {
            // Remove oldest journal entry
            journalKeys.sort();
            localStorage.removeItem(journalKeys[0]);
            console.log(`Removed old journal entry: ${journalKeys[0]}`);
        }
    }

    /**
     * Check if localStorage is available
     */
    static isAvailable(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}
