"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SoundType = 'click' | 'success' | 'lock' | 'unlock' | 'hover';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    play: (sound: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const createTone = (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number, vol: number = 0.1) => {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.warn('AudioContext failed', e);
    }
}

export function SoundProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const handleInteraction = () => {
            setIsMuted(false);
        };
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        }
    }, []);

    const toggleMute = () => setIsMuted(prev => !prev);

    const play = (sound: SoundType) => {
        if (isMuted) return;

        try {
            switch (sound) {
                case 'click':
                    createTone(800, 'sine', 0.05, 0.05);
                    break;
                case 'hover':
                    // Silent
                    break;
                case 'success':
                    createTone(500, 'sine', 0.1, 0.1);
                    setTimeout(() => createTone(750, 'sine', 0.2, 0.1), 100);
                    break;
                case 'lock':
                    createTone(150, 'square', 0.1, 0.1);
                    break;
                case 'unlock':
                    createTone(1000, 'sine', 0.3, 0.1);
                    break;
            }
        } catch (e) {
            console.error("Sound playback failed", e);
        }
    };

    const contextValue = { isMuted, toggleMute, play };

    return (
        <SoundContext.Provider value={contextValue}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
}
