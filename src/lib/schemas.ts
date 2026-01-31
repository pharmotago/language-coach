import { z } from "zod";

export const QuizSchema = z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    explanation: z.string().optional(),
});

export const ScenarioSchema = z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    explanation: z.string(),
});

export const ModuleContentSchema = z.object({
    full_lesson_content: z.string(),
    scripts: z.string().optional(),
    challenge: z.string().optional(),
    questions: z.array(ScenarioSchema).optional(),
    audit: z.array(z.string()).optional(),
    quiz: QuizSchema.optional(),
});

export const ModuleSchema = z.object({
    id: z.number(),
    title: z.string(),
    summary: z.string(),
    isLocked: z.boolean(),
    spotifyId: z.string().optional(),
    readTime: z.number().optional(),
    badge: z.string().optional(),
    content: ModuleContentSchema,
});

export type Module = z.infer<typeof ModuleSchema>;
