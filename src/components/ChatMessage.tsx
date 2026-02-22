/**
 * Chat Message Component - Clean, Minimal Design
 */

'use client';

import React, { useState } from 'react';
import { MessageCircle, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { Message } from '@/types/languageTypes';
import { cn } from '@/lib/utils';
import { CoachFeedback } from './CoachFeedback';

interface ChatMessageProps {
    message: Message;
    targetLanguageName: string;
}

export function ChatMessage({ message, targetLanguageName }: ChatMessageProps) {
    const [showTranslation, setShowTranslation] = useState(false);
    const isUser = message.role === 'user';

    return (
        <div className={cn(
            "flex w-full gap-3 mb-6",
            isUser ? "flex-row-reverse" : "flex-row"
        )}>
            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
                isUser
                    ? "bg-slate-200 text-slate-500"
                    : "bg-emerald-100 text-emerald-600"
            )}>
                {isUser ? (
                    <MessageCircle className="w-4 h-4" />
                ) : (
                    <Bot className="w-4 h-4" />
                )}
            </div>

            {/* Message Content */}
            <div className={cn(
                "flex flex-col max-w-[80%]",
                isUser ? "items-end" : "items-start"
            )}>
                {/* Message Bubble */}
                <div className={cn(
                    "px-4 py-3 rounded-2xl shadow-sm",
                    isUser
                        ? "bg-slate-800 text-white rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                )}>
                    <p className="leading-relaxed whitespace-pre-wrap select-text text-[15px]">
                        {message.content}
                    </p>
                </div>

                {/* Optional Translation */}
                {!isUser && message.translation && (
                    <div className="mt-1 w-full flex flex-col items-start gap-1">
                        <button
                            onClick={() => setShowTranslation(!showTranslation)}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
                        >
                            {showTranslation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {showTranslation ? 'Hide translation' : 'Show translation'}
                        </button>

                        {showTranslation && (
                            <div className="px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-600 italic border border-slate-200">
                                {message.translation}
                            </div>
                        )}
                    </div>
                )}

                {/* Optional Feedback */}
                {!isUser && message.feedback && (
                    <div className="mt-2 w-full">
                        <CoachFeedback
                            feedback={message.feedback}
                            targetLanguageName={targetLanguageName}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
