import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export const feedbackModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction: "You are a strict language tutor. Analyze the student's message for grammar errors and cultural faux pas. Output JSON: { hasError: boolean, feedback: string, culturalNote?: string }. accessing 'feedback' should give a short, helpful correction. If no error, hasError is false."
});
export const scenarioModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction: "You are an expert language teacher. Generate realistic roleplay scenarios for language learners. Output strict JSON with fields: id, title, description, context, difficulty (Beginner/Intermediate/Advanced), and icon (Lucide icon name)."
});

export const chatModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});
