import { createAIProvider, TieredAIProvider, AIProvider } from './aiBase';

const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
const anthropicKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';

const providers: AIProvider[] = [];

// 1. Primary: Gemini 3 Flash (Modern Standard as of Feb 2026)
// Note: Gemini 1.5 Flash is deprecated and non-functional in current API versions.
if (geminiKey) {
    providers.push(createAIProvider('gemini', geminiKey, 'gemini-3-flash-preview'));
    // Fallback within Gemini for quota resilience
    providers.push(createAIProvider('gemini', geminiKey, 'gemini-2.5-flash-lite'));
    providers.push(createAIProvider('gemini', geminiKey, 'gemini-flash-latest'));
}

// 2. Secondary: OpenAI GPT-4o
if (openaiKey) {
    providers.push(createAIProvider('openai', openaiKey, 'gpt-4o'));
}

// 3. Tertiary: Anthropic Claude 3.5 Sonnet
if (anthropicKey) {
    providers.push(createAIProvider('anthropic', anthropicKey, 'claude-3-5-sonnet-20240620'));
}

// Ensure at least one provider exists (even if keys are missing)
if (providers.length === 0) {
    console.warn('No AI API keys found in environment variables. AI features will fail.');
    // Add Gemini as a placeholder
    providers.push(createAIProvider('gemini', 'MISSING_KEY', 'gemini-3-flash-preview'));
}

export const aiService = new TieredAIProvider(providers);
