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
import { motion } from 'framer-motion';
import { VoiceInput } from './VoiceInput';
import { useSpeech } from '@/hooks/useSpeech';

export function LanguageCoach() {
    const {
        targetLanguage,
        skillLevels,
        isInitialized,
        messages: allMessages,
        addMessage,
        setLanguage,
        setSkillLevel,
        clearMessages
    } = useLanguageStore();

    const langCode = targetLanguage?.code || 'global';
    const messages = React.useMemo(() => (allMessages && allMessages[langCode]) || [], [allMessages, langCode]);
    const skillLevel = skillLevels?.[langCode];

    // UI State
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSetup, setShowSetup] = useState(false);

    // Persistence Hook
    const { saveConversation } = useConversationHistory();

    // Speech Hook
    const { speak, stop, isSpeaking: isTtsSpeaking } = useSpeech();

    // Auto-scroll logic
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToEnd = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToEnd();
    }, [messages]);

    const handleInitialGreeting = useCallback(async () => {
        if (!targetLanguage || !skillLevel) return;

        setIsLoading(true);
        try {
            const promptText = `Hello coach! I am a ${skillLevel} level student starting a lesson in ${targetLanguage.name}. Give me a short, encouraging greeting in ${targetLanguage.name} to start our conversation.`;

            const response = await aiService.generateResponse({
                messages: [],
                systemPrompt: promptText,
                targetLanguage: targetLanguage.name,
                skillLevel: skillLevel
            });

            addMessage({
                id: Date.now().toString(),
                role: 'coach',
                content: response.response,
                translation: response.translation,
                feedback: response.feedback ? String(response.feedback) : undefined,
                timestamp: new Date()
            });

            // Speak greeting
            speak(response.response, targetLanguage.code);
        } catch (err) {
            console.error("Initial Greeting Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [targetLanguage, skillLevel, addMessage, speak]);

    useEffect(() => {
        if (isInitialized && targetLanguage && skillLevel && messages.length === 0) {
            handleInitialGreeting();
        }
    }, [isInitialized, targetLanguage, skillLevel, messages.length, handleInitialGreeting]);

    // Focus input on load
    const inputRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (isInitialized && !showSetup) {
            inputRef.current?.focus();
        }
    }, [isInitialized, showSetup]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !targetLanguage || !skillLevel || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        addMessage(userMessage);
        setInputValue('');
        setIsLoading(true);

        try {
            // Context for AI
            const contextMessages = messages.slice(-10).map(m => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.timestamp
            }));

            const promptText = `Continue our conversation. Respond naturally to the student. Try to keep the conversation flowing. 
            Level: ${skillLevel} in ${targetLanguage.name}.`;

            const response = await aiService.generateResponse({
                messages: contextMessages,
                systemPrompt: promptText,
                targetLanguage: targetLanguage.name,
                skillLevel: skillLevel
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'coach',
                content: response.response,
                translation: response.translation,
                feedback: response.feedback ? String(response.feedback) : undefined,
                timestamp: new Date()
            };

            addMessage(aiMessage);

            // Speak AI response
            speak(aiMessage.content, targetLanguage.code);

            // Save to history after AI reply
            saveConversation(langCode, {
                id: langCode,
                language: targetLanguage.name,
                skillLevel: skillLevel,
                messages: [...messages, userMessage, aiMessage],
                createdAt: new Date(),
                updatedAt: new Date(),
                title: `Conversation in ${targetLanguage.name}`
            });

        } catch (err: any) {
            console.error("AI Error Details:", err);
            if (err.name !== 'AbortError') {
                console.error(err);
                addMessage({
                    id: Date.now().toString(),
                    role: 'coach',
                    content: "I'm having trouble connecting right now. Let's try again in a moment.",
                    timestamp: new Date()
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSendMessage();
        }
    };

    const handleSetupComplete = (language: any, level: any) => {
        setLanguage(language);
        setSkillLevel(level);
        setShowSetup(false);
    };

    const handleReset = () => {
        if (confirm('Clear entire conversation history?')) {
            clearMessages();
        }
    };

    if (!isInitialized || showSetup) {
        return (
            <SetupModal
                onComplete={handleSetupComplete}
                initialLanguage={targetLanguage}
                onClose={isInitialized ? () => setShowSetup(false) : undefined}
            />
        );
    }

    if (!targetLanguage) return null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
            <AppHeader
                targetLanguage={targetLanguage}
                onSetupClick={() => setShowSetup(true)}
                onResetClick={handleReset}
            />

            <main className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-6 py-8 flex flex-col pt-20">
                <div className="space-y-4">
                    {messages.length === 0 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center text-slate-500 my-16 border border-slate-100 p-10 rounded-3xl bg-white shadow-ambient"
                        >
                            <h3 className="text-xl font-bold mb-2 text-slate-900 tracking-tight">Practice {targetLanguage.name}</h3>
                            <p className="text-sm font-medium text-slate-400">Your AI tutor is ready. Start by saying hello.</p>
                        </motion.div>
                    )}

                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            targetLanguageName={targetLanguage.name}
                            onSpeak={() => speak(message.content, targetLanguage.code)}
                            isSpeaking={isTtsSpeaking}
                        />
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-slate-400 p-4"
                        >
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                            </div>
                            <span className="text-[11px] font-bold font-mono tracking-widest uppercase">Syncing...</span>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="w-full max-w-2xl mx-auto p-6 bg-transparent sticky bottom-0 z-20">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative flex shadow-premium rounded-2xl bg-white border border-slate-200/50 group focus-within:shadow-focused transition-all duration-300"
                >
                    <div className="flex items-center pl-2">
                        <VoiceInput
                            onTranscription={(text) => setInputValue(prev => (prev.trim() + ' ' + text).trim())}
                            langCode={targetLanguage.code}
                            disabled={isLoading}
                        />
                    </div>
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isLoading ? "Syncing response..." : "Type in " + targetLanguage.name + "..."}
                        className="w-full bg-transparent rounded-2xl py-4 pl-3 pr-14 focus:outline-none resize-none h-14 text-sm font-medium text-slate-800 placeholder:text-slate-300 transition-all font-sans"
                        disabled={isLoading}
                        rows={1}
                        style={{ minHeight: '56px', maxHeight: '160px' }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-2.5 top-2.5 bottom-2.5 aspect-square rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-20 transition-all duration-200"
                        title="Send Message"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </motion.div>
                <div className="text-center mt-3">
                    <span className="text-[10px] font-bold font-mono text-slate-300 tracking-tighter uppercase">⌘ + ENTER TO BROADCAST</span>
                </div>
            </footer>
        </div>
    );
}
