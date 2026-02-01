import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: SAFETY_SETTINGS,
});

export const feedbackModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    safetySettings: SAFETY_SETTINGS,
    systemInstruction: "You are a strict language tutor. Analyze the student's message for grammar errors and cultural faux pas. Output JSON: { hasError: boolean, feedback: string, culturalNote?: string }. accessing 'feedback' should give a short, helpful correction. If no error, hasError is false."
});
export const scenarioModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    safetySettings: SAFETY_SETTINGS,
    systemInstruction: "You are an expert language teacher. Generate realistic roleplay scenarios for language learners. Output strict JSON with fields: id, title, description, context, difficulty (Beginner/Intermediate/Advanced), and icon (Lucide icon name)."
});

export const chatModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    safetySettings: SAFETY_SETTINGS,
});
