/**
 * Message Actions Component - Copy, Regenerate, Speak
 */

'use client';

import React, { useState } from 'react';
import { Copy, RefreshCw, Volume2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageActionsProps {
    messageContent: string;
    messageId: string;
    isUserMessage: boolean;
    onRegenerate?: () => void;
    language?: string;
    children?: React.ReactNode;
}

export function MessageActions({
    messageContent,
    messageId,
    isUserMessage,
    onRegenerate,
    language = 'en-US',
    children
}: MessageActionsProps) {
    const [copied, setCopied] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(messageContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(messageContent);
            utterance.lang = language;
            utterance.rate = 0.9; // Slightly slower for language learning

            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleRegenerateClick = () => {
        if (onRegenerate) {
            onRegenerate();
        }
    };

    return (
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy Button */}
            <button
                onClick={handleCopy}
                className={cn(
                    "p-1.5 rounded-lg transition-all text-xs flex items-center gap-1",
                    copied
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "hover:bg-slate-800 text-slate-500 hover:text-slate-400"
                )}
                title="Copy message"
            >
                {copied ? (
                    <>
                        <Check className="w-3 h-3" />
                        <span className="text-xs">Copied!</span>
                    </>
                ) : (
                    <Copy className="w-3 h-3" />
                )}
            </button>

            {/* Custom Children (e.g. Listen button from parent) */}
            {children}

            {/* Text-to-Speech Button (Legacy internal, optional if children not used) */}
            {!children && !isUserMessage && 'speechSynthesis' in window && (
                <button
                    onClick={handleSpeak}
                    className={cn(
                        "p-1.5 rounded-lg transition-all",
                        speaking
                            ? "bg-amber-500/20 text-amber-400"
                            : "hover:bg-slate-800 text-slate-500 hover:text-slate-400"
                    )}
                    title="Listen to pronunciation"
                >
                    <Volume2 className={cn("w-3 h-3", speaking && "animate-pulse")} />
                </button>
            )}

            {/* Regenerate Button (for coach messages) */}
            {!isUserMessage && onRegenerate && (
                <button
                    onClick={handleRegenerateClick}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-400 transition-all"
                    title="Regenerate response"
                >
                    <RefreshCw className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
