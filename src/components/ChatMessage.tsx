/**
 * Chat Message Component - Clean, Minimal Design
 */

'use client';

import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, Volume2, Loader2 } from 'lucide-react';
import { Message } from '@/types/languageTypes';
import { cn } from '@/lib/utils';
import { CoachFeedback } from './CoachFeedback';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessageProps {
    message: Message;
    targetLanguageName: string;
    onSpeak?: () => void;
    isSpeaking?: boolean;
}

export function ChatMessage({ message, targetLanguageName, onSpeak, isSpeaking }: ChatMessageProps) {
    const [showTranslation, setShowTranslation] = useState(false);
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
                "flex w-full gap-4 mb-8",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar - More subtle */}
            <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 border",
                isUser
                    ? "bg-slate-50 border-slate-100 text-slate-400"
                    : "bg-emerald-50 border-emerald-100 text-emerald-600"
            )}>
                {isUser ? (
                    <span className="text-[10px] font-bold font-mono">U</span>
                ) : (
                    <Bot className="w-4 h-4" />
                )}
            </div>

            {/* Speaking Overlay - very subtle indicator */}
            {!isUser && isSpeaking && (
                <div className="absolute left-10 top-1">
                    <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                </div>
            )}

            {/* Message Content */}
            <div className={cn(
                "flex flex-col max-w-[85%]",
                isUser ? "items-end" : "items-start"
            )}>
                {/* Message Bubble */}
                <div className={cn(
                    "px-4 py-3 rounded-xl transition-all duration-200",
                    isUser
                        ? "bg-slate-900 text-white shadow-premium"
                        : "bg-white border border-slate-200/60 text-slate-800 shadow-ambient"
                )}>
                    <p className="leading-relaxed whitespace-pre-wrap select-text text-[15px] font-medium tracking-tight">
                        {message.content}
                    </p>
                </div>

                {/* Optional Translation & Listen */}
                {!isUser && (
                    <div className="mt-2 w-full flex items-center gap-3">
                        {message.translation && (
                            <button
                                onClick={() => setShowTranslation(!showTranslation)}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors py-1 px-2 hover:bg-slate-50 rounded-md"
                            >
                                {showTranslation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {showTranslation ? 'COLLAPSE' : 'TRANSLATE'}
                            </button>
                        )}

                        {onSpeak && (
                            <button
                                onClick={onSpeak}
                                className={cn(
                                    "flex items-center gap-1.5 text-[11px] font-bold transition-colors py-1 px-2 rounded-md",
                                    isSpeaking ? "text-emerald-600 bg-emerald-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <Volume2 className={cn("w-3 h-3", isSpeaking && "animate-pulse")} />
                                {isSpeaking ? 'LISTENING...' : 'LISTEN'}
                            </button>
                        )}
                    </div>
                )}

                <AnimatePresence>
                    {showTranslation && message.translation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden w-full"
                        >
                            <div className="px-4 py-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100 mt-1 font-medium italic">
                                {message.translation}
                            </div>
                        </motion.div>
                    ) as any}
                </AnimatePresence>

                {/* Optional Feedback */}
                {!isUser && message.feedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-3 w-full"
                    >
                        <CoachFeedback
                            feedback={message.feedback}
                            targetLanguageName={targetLanguageName}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
