/**
 * Voice Input Component - Speech-to-Text for language practice
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
    language: string; // Language code (e.g., 'es-ES', 'fr-FR')
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

export function VoiceInput({ language, onTranscript, disabled = false }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if Speech Recognition is supported
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        // Initialize speech recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            setTranscript(transcriptText);

            // If final result, send to parent
            if (event.results[current].isFinal) {
                onTranscript(transcriptText);
                setTranscript('');
                setIsListening(false);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language, onTranscript]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    if (!isSupported) {
        return null; // Gracefully degrade if not supported
    }

    return (
        <div className="relative">
            <button
                onClick={toggleListening}
                disabled={disabled}
                className={cn(
                    "p-3 rounded-full transition-all duration-300",
                    isListening
                        ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                aria-label={isListening ? "Stop recording" : "Start recording"}
            >
                {isListening ? (
                    <MicOff className="w-5 h-5" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </button>

            {/* Live Transcript Display */}
            {transcript && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                            <p className="text-xs text-slate-300">
                                {transcript}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
