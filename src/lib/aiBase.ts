/**
 * AI Integration Adapters for Multiple Providers - Base Layer
 */

import { Message, Feedback, SkillLevel } from '@/types/languageTypes';

export interface AIProvider {
    name: string;
    generateResponse(params: AIRequestParams): Promise<AIResponse>;
    estimateCost(tokens: number): number;
}

export interface AIRequestParams {
    messages: Message[];
    systemPrompt: string;
    targetLanguage: string;
    skillLevel: SkillLevel;
    temperature?: number;
    maxTokens?: number;
}

export interface AIResponse {
    response: string;
    translation: string;
    feedback: Feedback;
    tokensUsed: number;
    cost: number;
}

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            if (i === maxRetries - 1) throw error;

            const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
            console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Max retries exceeded');
}

// Helper to handle LLM JSON responses with potential markdown or malformed formatting
function cleanAndParseJSON(text: string): any {
    try {
        // 1. Try direct parse
        return JSON.parse(text);
    } catch (e) {
        // 2. Clean markdown blocks if present
        let cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)```/gi, '$1').trim();

        // 3. Fallback: Find start of first { and end of last }
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            cleaned = cleaned.substring(start, end + 1);
        }

        try {
            return JSON.parse(cleaned);
        } catch (innerE: any) {
            console.error("JSON Parse Failure. Raw text:", text);
            console.error("Attempted cleaning result:", cleaned);
            throw new Error(`AI JSON Parse Error: ${innerE.message}`);
        }
    }
}

// OpenAI Adapter
export class OpenAIAdapter implements AIProvider {
    name = 'OpenAI';
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'gpt-4o') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async generateResponse(params: AIRequestParams): Promise<AIResponse> {
        return retryWithBackoff(async () => {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: params.systemPrompt },
                        ...params.messages.map(m => ({
                            role: m.role === 'user' ? 'user' : 'assistant',
                            content: m.content
                        }))
                    ],
                    temperature: params.temperature || 0.7,
                    max_tokens: params.maxTokens || 500,
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                throw new Error(`OpenAI API error ${response.status}: ${response.statusText}. ${errorBody}`);
            }

            const data = await response.json();
            const content = cleanAndParseJSON(data.choices[0].message.content);
            const tokensUsed = data.usage.total_tokens;

            return {
                response: content.response,
                translation: content.translation,
                feedback: content.feedback,
                tokensUsed,
                cost: this.estimateCost(tokensUsed)
            };
        });
    }

    estimateCost(tokens: number): number {
        return (tokens / 1000) * 0.045;
    }
}

// Anthropic Claude Adapter
export class AnthropicAdapter implements AIProvider {
    name = 'Anthropic';
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20240620') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async generateResponse(params: AIRequestParams): Promise<AIResponse> {
        return retryWithBackoff(async () => {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: params.maxTokens || 1024,
                    system: params.systemPrompt,
                    messages: params.messages.map(m => ({
                        role: m.role === 'user' ? 'user' : 'assistant',
                        content: m.content
                    }))
                })
            });

            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                throw new Error(`Anthropic API error ${response.status}: ${response.statusText}. ${errorBody}`);
            }

            const data = await response.json();
            const content = cleanAndParseJSON(data.content[0].text);
            const tokensUsed = data.usage.input_tokens + data.usage.output_tokens;

            return {
                response: content.response,
                translation: content.translation,
                feedback: content.feedback,
                tokensUsed,
                cost: this.estimateCost(tokensUsed)
            };
        });
    }

    estimateCost(tokens: number): number {
        return (tokens / 1000) * 0.045;
    }
}

// Google Gemini Adapter (FETCH BASED - bypassing SDK)
export class GeminiAdapter implements AIProvider {
    name = 'Google Gemini';
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'gemini-3-flash-preview') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async generateResponse(params: AIRequestParams): Promise<AIResponse> {
        return retryWithBackoff(async () => {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: params.systemPrompt }]
                            },
                            ...params.messages.map(m => ({
                                role: m.role === 'user' ? 'user' : 'model',
                                parts: [{ text: m.content }]
                            }))
                        ],
                        generationConfig: {
                            temperature: params.temperature || 0.7,
                            maxOutputTokens: params.maxTokens || 500,
                            responseMimeType: "application/json"
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                throw new Error(`Gemini API error ${response.status}: ${response.statusText}. ${errorBody}`);
            }

            const data = await response.json();

            // Critical: Ensure the model didn't fail safety checks or return empty
            if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
                throw new Error(`Gemini candidate error: ${JSON.stringify(data)}`);
            }

            const content = cleanAndParseJSON(data.candidates[0].content.parts[0].text);
            const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

            return {
                response: content.response,
                translation: content.translation,
                feedback: content.feedback,
                tokensUsed,
                cost: this.estimateCost(tokensUsed)
            };
        });
    }

    estimateCost(tokens: number): number {
        return (tokens / 1000) * 0.001;
    }
}

// Tiered AI Provider with Fallback Logic
export class TieredAIProvider implements AIProvider {
    name: string;
    private providers: AIProvider[];

    constructor(providers: AIProvider[]) {
        if (providers.length === 0) {
            throw new Error('TieredAIProvider requires at least one provider');
        }
        this.providers = providers;
        this.name = `Tiered(${providers.map(p => p.name).join(' -> ')})`;
    }

    async generateResponse(params: AIRequestParams): Promise<AIResponse> {
        let lastError: Error | null = null;

        for (const provider of this.providers) {
            try {
                console.log(`Attempting generation with ${provider.name}...`);
                const response = await provider.generateResponse(params);
                console.log(`Success with ${provider.name}`);
                return response;
            } catch (error: any) {
                console.warn(`Provider ${provider.name} failed:`, error.message);
                lastError = error;
            }
        }

        throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
    }

    estimateCost(tokens: number): number {
        return this.providers[0].estimateCost(tokens);
    }
}

// Provider Factory
export function createAIProvider(
    provider: 'openai' | 'anthropic' | 'gemini',
    apiKey: string,
    model?: string
): AIProvider {
    switch (provider) {
        case 'openai':
            return new OpenAIAdapter(apiKey, model || 'gpt-4o');
        case 'anthropic':
            return new AnthropicAdapter(apiKey, model || 'claude-3-5-sonnet-20240620');
        case 'gemini':
            return new GeminiAdapter(apiKey, model || 'gemini-1.5-flash');
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}
