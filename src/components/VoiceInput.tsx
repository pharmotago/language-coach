/**
 * Voice Input Component - Speech-to-Text using Web Speech API
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
    onTranscription: (text: string) => void;
    langCode: string;
    disabled?: boolean;
    className?: string;
}

export function VoiceInput({ onTranscription, langCode, disabled, className }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Initialize Web Speech API
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = langCode;

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                let currentInterim = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        currentInterim += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    onTranscription(finalTranscript);
                }
                setInterimTranscript(currentInterim);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
                setInterimTranscript('');
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [langCode, onTranscription]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) {
            alert('Speech Recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInterimTranscript('');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error('Failed to start recognition', err);
                setIsListening(false);
            }
        }
    }, [isListening]);

    if (!(window as any).SpeechRecognition && !(window as any).webkitSpeechRecognition) {
        return null;
    }

    return (
        <div className={cn("relative flex items-center", className)}>
            <AnimatePresence>
                {isListening && interimTranscript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-4 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl shadow-ambient text-xs text-slate-500 italic max-w-xs"
                    >
                        {interimTranscript}...
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleListening}
                disabled={disabled}
                className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    isListening
                        ? "bg-emerald-500 text-white shadow-emerald-200 shadow-lg animate-pulse"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-200/50"
                )}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
                type="button"
            >
                {isListening ? (
                    <Mic className="w-5 h-5" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
