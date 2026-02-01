import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_GEMINI_API_KEY: z.string().min(1, "Gemini API Key is required"),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const env = envSchema.parse({
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
});
