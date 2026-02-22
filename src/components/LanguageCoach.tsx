/**
 * Language Immersion Coach - Clean, Minimal Chat Interface
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { aiService } from '@/lib/aiCore';
import { Message } from '@/types/languageTypes';
import { SetupModal } from './SetupModal';
import { ChatMessage } from './ChatMessage';
import { AppHeader } from './AppHeader';
import { useConversationHistory } from '@/lib/conversationHistory';
import { Send, Loader2 } from 'lucide-react';

export function LanguageCoach() {
    const {
        targetLanguage,
        skillLevels,
        messages: allMessages,
        isInitialized,
        setLanguage,
        setSkillLevel,
        addMessage,
        currentScenarios,
        initialize,
        resetAll,
    } = useLanguageStore();

    const langCode = targetLanguage?.code || 'global';
    const messages = allMessages[langCode] || [];
    const skillLevel = skillLevels[langCode];
    const currentScenario = currentScenarios[langCode];

    // UI State
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Persistence Hook
    const { saveConversation } = useConversationHistory();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send initial greeting when setup is complete
    useEffect(() => {
        if (isInitialized && targetLanguage && skillLevel && messages.length === 0) {
            handleInitialGreeting();
        }
    }, [isInitialized, targetLanguage, skillLevel]);

    const handleInitialGreeting = async () => {
        if (!targetLanguage || !skillLevel) return;

        setIsLoading(true);
        setError(null);

        try {
            const prompt = `
            Act as a native ${targetLanguage.name} language tutor. 
            User Skill Level: ${skillLevel}.
            
            Task: Generate a warm, welcoming initial greeting for a new student.
            
            Instructions:
            1. Speak ONLY in ${targetLanguage.name} (with English translation in parentheses).
            2. Match the difficulty to the user's skill level.
            3. Ask a simple open-ended question to start the conversation.
            
            Output strictly valid JSON:
            {
                "response": "Greeting in ${targetLanguage.name}",
                "translation": "English translation"
            }
            `;

            const aiResponse = await aiService.generateResponse({
                messages: [],
                systemPrompt: prompt,
                targetLanguage: targetLanguage.name,
                skillLevel: skillLevel
            });

            const aiData = {
                response: aiResponse.response,
                translation: aiResponse.translation
            };

            const coachMessage: Message = {
                id: Date.now().toString(),
                role: 'coach',
                content: aiData.response,
                timestamp: new Date(),
                translation: aiData.translation,
            };

            addMessage(coachMessage);
        } catch (err: any) {
            console.error("AI Greeting Error:", err);
            addMessage({
                id: Date.now().toString(),
                role: 'coach',
                content: "Hello! Let's start learning!",
                timestamp: new Date()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim() || !targetLanguage || !skillLevel || isLoading) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        addMessage(userMessage);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        abortControllerRef.current = new AbortController();

        try {
            // Very strict prompt to save tokens
            const prompt = `
            Act as a native ${targetLanguage.name} language tutor. 
            User Skill Level: ${skillLevel}.
            Current Context: ${currentScenario ? currentScenario.context : 'Casual conversation'}.
            
            User Message: "${userMessage.content}"
            
            Instructions:
            1. Respond naturally and concisely in ${targetLanguage.name}. DO NOT ramble.
            2. Provide correction of ONLY severe mistakes in the user's message.
            
            Output strictly valid JSON format ONLY:
            {
                "response": "Your concise response in ${targetLanguage.name}",
                "translation": "English translation of your response",
                "feedback": "Correction if needed (optional, keep very short)"
            }
            `;

            const aiResponse = await aiService.generateResponse({
                messages: messages,
                systemPrompt: prompt,
                targetLanguage: targetLanguage.name,
                skillLevel: skillLevel
            });

            const coachMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'coach',
                content: aiResponse.response,
                timestamp: new Date(),
                translation: aiResponse.translation,
                feedback: aiResponse.feedback || undefined,
            };

            addMessage(coachMessage);

            // Persistence
            saveConversation({
                id: Date.now().toString(),
                language: targetLanguage.name,
                skillLevel,
                messages: [...messages, userMessage, coachMessage],
                createdAt: new Date(),
                updatedAt: new Date(),
                title: `Conversation - ${new Date().toLocaleDateString()}`
            });

        } catch (err: any) {
            console.error("AI Error Details:", err);
            if (err.name !== 'AbortError') {
                setError('Failed to connect to AI Tutor. Please try again.');
                console.error(err);
                addMessage({
                    id: Date.now().toString(),
                    role: 'coach',
                    content: "I'm having trouble responding right now. Please try again.",
                    timestamp: new Date()
                });
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [inputValue, targetLanguage, skillLevel, isLoading, messages, currentScenario, addMessage, saveConversation]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset everything?')) {
            resetAll();
        }
    };

    // Show setup modal if not initialized or manually requested
    if ((!isInitialized || !targetLanguage || !skillLevel) || showSetup) {
        return (
            <SetupModal
                onComplete={(lang, level) => {
                    setLanguage(lang);
                    setSkillLevel(level);
                    initialize();
                    setShowSetup(false);
                }}
                onClose={isInitialized ? () => setShowSetup(false) : undefined}
                initialLanguage={targetLanguage}
            />
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
            <AppHeader
                targetLanguage={targetLanguage}
                onSetupClick={() => setShowSetup(true)}
                onResetClick={handleReset}
            />

            <main className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto px-4 py-8 flex flex-col pt-24">
                <div className="space-y-6">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center text-slate-500 my-10 border border-slate-200 p-8 rounded-2xl bg-white shadow-sm">
                            <h3 className="text-xl font-semibold mb-2 text-slate-800">Ready to practice {targetLanguage.name}?</h3>
                            <p>Say hello to your tutor to begin.</p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            targetLanguageName={targetLanguage.name}
                        />
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-slate-400 p-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Tutor is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="w-full max-w-3xl mx-auto p-4 bg-slate-50/90 backdrop-blur-sm sticky bottom-0">
                <div className="relative flex shadow-xl shadow-slate-200/50 rounded-2xl">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isLoading ? "Waiting for response..." : "Type your message in " + targetLanguage.name + " (or English)..."}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none h-14 shadow-sm"
                        disabled={isLoading}
                        rows={1}
                        style={{ minHeight: '56px', maxHeight: '120px' }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-md"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-xs text-slate-400">Press Enter to send</span>
                </div>
            </footer>
        </div>
    );
}
