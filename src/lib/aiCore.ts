import { createAIProvider, TieredAIProvider, AIProvider } from './aiBase';
import { CONFIG } from './config';

const providers: AIProvider[] = [];

// 1. Primary: Gemini (Modern Standard)
if (CONFIG.GEMINI_API_KEY) {
    [CONFIG.DEFAULT_GEMINI_MODEL, ...CONFIG.GEMINI_FALLBACKS].forEach(model => {
        providers.push(createAIProvider('gemini', CONFIG.GEMINI_API_KEY, model));
    });
}

// 2. Secondary: OpenAI
if (CONFIG.OPENAI_API_KEY) {
    providers.push(createAIProvider('openai', CONFIG.OPENAI_API_KEY, 'gpt-4o'));
}

// 3. Tertiary: Anthropic
if (CONFIG.ANTHROPIC_API_KEY) {
    providers.push(createAIProvider('anthropic', CONFIG.ANTHROPIC_API_KEY, 'claude-3-5-sonnet-20240620'));
}

// Mock fallback if no keys
if (providers.length === 0) {
    console.warn('No AI API keys found. AI features will fail.');
    providers.push(createAIProvider('gemini', 'MISSING_KEY', CONFIG.DEFAULT_GEMINI_MODEL));
}

export const aiService = new TieredAIProvider(providers);
