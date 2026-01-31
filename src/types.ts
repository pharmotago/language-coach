// Re-export Zod types to ensure single source of truth
import { Module as ZodModule, QuizSchema, ScenarioSchema, ModuleContentSchema } from "@/lib/schemas";
import { z } from "zod";

export type Module = ZodModule;
export type QuizQuestion = z.infer<typeof ScenarioSchema> | z.infer<typeof QuizSchema>;
export type ModuleContent = z.infer<typeof ModuleContentSchema>;
