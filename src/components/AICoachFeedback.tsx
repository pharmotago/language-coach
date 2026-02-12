"use client";

import React, { useState, useEffect } from "react";
import { Message } from "@/types/languageTypes";
import { aiService } from "@/lib/aiCore";
import { Sparkles, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AICoachFeedbackProps {
    messages: Message[];
    targetLanguage: string;
}

export function AICoachFeedback({ messages, targetLanguage }: AICoachFeedbackProps) {
    const { addMistake } = useLanguageStore();
    const [feedback, setFeedback] = useState<{ hasError: boolean; feedback: string; culturalNote?: string } | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [lastAnalyzedId, setLastAnalyzedId] = useState<string | null>(null);

    // Analyze the last USER message
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage || lastMessage.role !== 'user' || lastMessage.id === lastAnalyzedId) {
            return;
        }

        const analyze = async () => {
            setLastAnalyzedId(lastMessage.id);
            // Don't analyze very short messages
            if (lastMessage.content.length < 5) return;

            try {
                const prompt = `Analyze this ${targetLanguage} sentence: "${lastMessage.content}". 
                You are a strict language tutor. Analyze the student's message for grammar errors and cultural faux pas. 
                Output JSON: { hasError: boolean, feedback: string, culturalNote?: string }. 
                The 'feedback' field should give a short, helpful correction. If no error, hasError is false.`;

                const aiResponse = await aiService.generateResponse({
                    messages: [],
                    systemPrompt: prompt,
                    targetLanguage: targetLanguage,
                    skillLevel: 'Advanced' // Tutor mode is always high precision
                });

                // Extract feedback properties carefully to match state types
                const feedbackText = aiResponse.feedback?.correction || aiResponse.response;
                const culturalNoteText = aiResponse.translation;

                const hasError = !!aiResponse.feedback?.correction;

                if (hasError || culturalNoteText) {
                    setFeedback({
                        hasError,
                        feedback: feedbackText,
                        culturalNote: culturalNoteText
                    });
                    setIsVisible(true);

                    // Save to Mistake Vault
                    if (hasError) {
                        addMistake({
                            id: Date.now().toString(),
                            original: lastMessage.content,
                            correction: feedbackText,
                            timestamp: new Date(),
                            context: targetLanguage
                        });
                    }

                    // Auto-hide after 8 seconds
                    setTimeout(() => setIsVisible(false), 8000);
                }
            } catch (error) {
                console.error("Feedback error:", error);
            }
        };

        analyze();
    }, [messages, targetLanguage, lastAnalyzedId]);

    if (!feedback || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
            >
                <div className={`p-4 rounded-xl shadow-2xl border backdrop-blur-xl flex gap-4 ${feedback.hasError
                    ? "bg-rose-950/80 border-rose-500/30 text-rose-100"
                    : "bg-indigo-950/80 border-indigo-500/30 text-indigo-100"
                    }`}>
                    <div className={`p-2 rounded-full h-fit flex-shrink-0 ${feedback.hasError ? "bg-rose-500/20" : "bg-indigo-500/20"
                        }`}>
                        {feedback.hasError ? <AlertTriangle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-sm uppercase tracking-wide">
                            {feedback.hasError ? "Correction" : "Cultural Insight"}
                        </h4>
                        <p className="text-sm leading-relaxed">
                            {feedback.feedback}
                        </p>
                        {feedback.culturalNote && (
                            <div className="mt-2 pt-2 border-t border-white/10 text-xs opacity-90 italic">
                                🌍 {feedback.culturalNote}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-white/50 hover:text-white h-fit"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
