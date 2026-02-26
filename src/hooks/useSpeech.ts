/**
 * Custom Hook for Text-to-Speech (TTS) using Web Speech API
 */

'use client';

import { useCallback, useState, useEffect } from 'react';

export function useSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const updateVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };

        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const stop = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    const speak = useCallback((text: string, langCode: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        // Stop any current speech
        stop();

        const utterance = new SpeechSynthesisUtterance(text);

        // Find best voice for the language
        // Language codes might come as 'es', 'ja', etc.
        const voice = voices.find(v => v.lang.startsWith(langCode)) ||
            voices.find(v => v.lang.includes(langCode));

        if (voice) {
            utterance.voice = voice;
        }

        utterance.lang = langCode;
        utterance.rate = 0.9; // Slightly slower for language learning
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('Speech Synthesis Error:', e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [voices, stop]);

    return {
        speak,
        stop,
        isSpeaking
    };
}
