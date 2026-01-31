/**
 * AI Integration Adapters for Multiple Providers
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

// OpenAI Adapter
export class OpenAIAdapter implements AIProvider {
    name = 'OpenAI';
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'gpt-4') {
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
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = JSON.parse(data.choices[0].message.content);
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
        // GPT-4 pricing: ~$0.03 per 1K input tokens + $0.06 per 1K output tokens
        return (tokens / 1000) * 0.045; // Average estimate
    }
}

// Anthropic Claude Adapter
export class AnthropicAdapter implements AIProvider {
    name = 'Anthropic';
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'claude-3-opus-20240229') {
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
                throw new Error(`Anthropic API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = JSON.parse(data.content[0].text);
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
        // Claude-3 Opus pricing: ~$0.015 per 1K input + $0.075 per 1K output
        return (tokens / 1000) * 0.045; // Average estimate
    }
}

// Google Gemini Adapter
export class GeminiAdapter implements AIProvider {
    name = 'Google Gemini';
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'gemini-pro') {
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
                            maxOutputTokens: params.maxTokens || 500
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = JSON.parse(data.candidates[0].content.parts[0].text);
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
        // Gemini Pro pricing: ~$0.00025 per 1K chars (≈ tokens)
        return (tokens / 1000) * 0.001; // Very affordable
    }
}

// Rate Limiter
export class RateLimiter {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;
    private requestsPerMinute: number;
    private minDelay: number;

    constructor(requestsPerMinute: number = 60) {
        this.requestsPerMinute = requestsPerMinute;
        this.minDelay = (60 * 1000) / requestsPerMinute;
    }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            if (!this.processing) {
                this.process();
            }
        });
    }

    private async process() {
        this.processing = true;

        while (this.queue.length > 0) {
            const fn = this.queue.shift();
            if (fn) {
                await fn();
                await new Promise(resolve => setTimeout(resolve, this.minDelay));
            }
        }

        this.processing = false;
    }
}

// Token Usage Tracker
export class TokenUsageTracker {
    private usage: Array<{ date: Date; tokens: number; cost: number; provider: string }> = [];

    track(tokens: number, cost: number, provider: string) {
        this.usage.push({
            date: new Date(),
            tokens,
            cost,
            provider
        });
    }

    getStats(days: number = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const recent = this.usage.filter(u => u.date >= cutoff);

        return {
            totalTokens: recent.reduce((sum, u) => sum + u.tokens, 0),
            totalCost: recent.reduce((sum, u) => sum + u.cost, 0),
            requestCount: recent.length,
            averageCost: recent.length > 0 ? recent.reduce((sum, u) => sum + u.cost, 0) / recent.length : 0,
            byProvider: this.groupByProvider(recent)
        };
    }

    private groupByProvider(usage: typeof this.usage) {
        const groups: Record<string, { tokens: number; cost: number; requests: number }> = {};

        usage.forEach(u => {
            if (!groups[u.provider]) {
                groups[u.provider] = { tokens: 0, cost: 0, requests: 0 };
            }
            groups[u.provider].tokens += u.tokens;
            groups[u.provider].cost += u.cost;
            groups[u.provider].requests += 1;
        });

        return groups;
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
            return new OpenAIAdapter(apiKey, model);
        case 'anthropic':
            return new AnthropicAdapter(apiKey, model);
        case 'gemini':
            return new GeminiAdapter(apiKey, model);
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}
