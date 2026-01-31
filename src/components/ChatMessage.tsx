/**
 * Chat Message Component - Display individual messages in conversation
 */

'use client';

import React, { useState } from 'react';
import { MessageCircle, Bot, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { voiceService } from '@/lib/voice';
import { Message } from '@/types/languageTypes';
import { cn } from '@/lib/utils';
import { CoachFeedback } from './CoachFeedback';
import { CultureDeck } from './CultureDeck';
import { MessageActions } from './MessageActions';

interface ChatMessageProps {
    message: Message;
    targetLanguageName: string;
    languageCode?: string;
    onRegenerate?: () => void;
}

export function ChatMessage({ message, targetLanguageName, languageCode = 'en', onRegenerate }: ChatMessageProps) {
    const [showTranslation, setShowTranslation] = useState(false);
    const isUser = message.role === 'user';

    const handleSpeak = () => {
        voiceService.speak(message.content, languageCode);
    };

    return (
        <div className={cn(
            "flex gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 group",
            isUser ? "flex-row-reverse" : "flex-row"
        )}>
            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                isUser
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
            )}>
                {isUser ? (
                    <MessageCircle className="w-5 h-5" />
                ) : (
                    <Bot className="w-5 h-5" />
                )}
            </div>

            {/* Message Content */}
            <div className={cn(
                "flex-1 max-w-[85%]",
                isUser && "flex flex-col items-end"
            )}>
                {/* Message Bubble */}
                <div className={cn(
                    "px-5 py-3 rounded-2xl transition-all",
                    isUser
                        ? "bg-amber-500/10 border border-amber-500/30 text-slate-100"
                        : "glass-card text-slate-200 group-hover:border-slate-700"
                )}>
                    <p className="leading-relaxed whitespace-pre-wrap select-text">
                        {message.content}
                    </p>
                </div>

                {/* Message Actions */}
                <MessageActions
                    messageContent={message.content}
                    messageId={message.id}
                    isUserMessage={isUser}
                    onRegenerate={!isUser ? onRegenerate : undefined}
                    language={languageCode}
                >
                    {!isUser && (
                        <button
                            onClick={handleSpeak}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                            title="Listen"
                        >
                            <Volume2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </MessageActions>

                {/* Translation Toggle (Coach messages only) */}
                {!isUser && message.translation && (
                    <div className="mt-2">
                        <button
                            onClick={() => setShowTranslation(!showTranslation)}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800/30"
                        >
                            {showTranslation ? (
                                <>
                                    <ChevronUp className="w-3 h-3" />
                                    Hide translation
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-3 h-3" />
                                    Show English translation
                                </>
                            )}
                        </button>

                        {showTranslation && (
                            <div className="mt-2 px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                                <p className="text-sm text-slate-400 italic">
                                    {message.translation}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Feedback Section (Coach messages only) */}
                {!isUser && message.feedback && (
                    <div className="mt-4">
                        <CoachFeedback
                            feedback={message.feedback}
                            targetLanguageName={targetLanguageName}
                        />
                    </div>
                )}

                {/* Culture Note (Coach messages only) */}
                {!isUser && message.cultureNote && (
                    <div className="mt-4 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300">
                        <CultureDeck
                            note={message.cultureNote}
                            onClose={() => { }} // Optional: Allow dismissing
                        />
                    </div>
                )}

                {/* Timestamp */}
                <div className={cn(
                    "mt-1.5 text-xs text-slate-600",
                    isUser && "text-right"
                )}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
}
