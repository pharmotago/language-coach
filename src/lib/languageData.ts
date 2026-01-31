/**
 * Language configurations and scenarios
 */

import { LanguageConfig, Scenario } from '@/types/languageTypes';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
    {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
        code: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
        flag: '🇮🇹',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        flag: '🇵🇹',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        flag: '🇰🇷',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        flag: '🇨🇳',
        supportedLevels: ['Beginner', 'Intermediate', 'Advanced']
    }
];

export const SCENARIOS: Scenario[] = [
    {
        id: 'cafe',
        title: 'Café in Paris',
        description: 'Order coffee and pastries at a busy Parisian café',
        context: 'You are at a crowded café in Paris. The waiter is friendly but speaks quickly. Practice ordering food and drinks, asking about recommendations, and making small talk.',
        difficulty: 'Beginner',
        icon: 'Coffee'
    },
    {
        id: 'interview',
        title: 'Job Interview',
        description: 'Professional interview for a marketing position',
        context: 'You are in a job interview for a marketing position at an international company. The interviewer asks about your experience, skills, and career goals. Be professional and articulate.',
        difficulty: 'Advanced',
        icon: 'Briefcase'
    },
    {
        id: 'shopping',
        title: 'Shopping in Tokyo',
        description: 'Navigate a department store and negotiate prices',
        context: 'You are shopping for clothes at a department store in Tokyo. Practice asking about sizes, colors, prices, and trying things on. The staff is very polite and helpful.',
        difficulty: 'Intermediate',
        icon: 'ShoppingBag'
    },
    {
        id: 'medical',
        title: 'Medical Emergency',
        description: 'Explain symptoms at a doctor\'s office',
        context: 'You need to visit a doctor while traveling abroad. Describe your symptoms, answer questions about your medical history, and understand the doctor\'s instructions.',
        difficulty: 'Intermediate',
        icon: 'Hospital'
    },
    {
        id: 'directions',
        title: 'Asking for Directions',
        description: 'Navigate a city and ask locals for help',
        context: 'You are lost in an unfamiliar city. Practice asking locals for directions to landmarks, understanding their explanations, and thanking them.',
        difficulty: 'Beginner',
        icon: 'MapPin'
    },
    {
        id: 'restaurant',
        title: 'Fine Dining',
        description: 'Order at an upscale restaurant',
        context: 'You are at an elegant restaurant celebrating a special occasion. Practice reading the menu, asking about dishes, ordering multiple courses, and discussing wine pairings.',
        difficulty: 'Advanced',
        icon: 'Utensils'
    },
    {
        id: 'market',
        title: 'Local Market',
        description: 'Bargain and chat with vendors',
        context: 'You are at a vibrant local market. Practice negotiating prices, asking about products, and engaging in friendly banter with the vendors.',
        difficulty: 'Intermediate',
        icon: 'Store'
    },
    {
        id: 'airport',
        title: 'Airport Check-in',
        description: 'Navigate airline counter and security',
        context: 'You are checking in for an international flight. Practice confirming your reservation, checking baggage, asking about gate information, and understanding announcements.',
        difficulty: 'Beginner',
        icon: 'Plane'
    }
];
