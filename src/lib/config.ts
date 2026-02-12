/**
 * Centralized Configuration for Language Coach AI
 */

export const CONFIG = {
    // AI Provider Keys
    GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',

    // Monetization
    ADSENSE_PUB_ID: "pub-1966724508656296",

    // Feature Flags & Environment
    IS_PROD: process.env.NODE_ENV === 'production',
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://languagecoach.ai',

    // Standards (Feb 2026)
    DEFAULT_GEMINI_MODEL: 'gemini-3-flash-preview',
    GEMINI_FALLBACKS: ['gemini-2.5-flash-lite', 'gemini-flash-latest']
};
