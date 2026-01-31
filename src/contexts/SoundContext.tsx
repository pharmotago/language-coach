'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundService, SoundType } from '@/lib/sounds';

interface SoundContextType {
    playSound: (type: SoundType) => void;
    isMuted: boolean;
    toggleMute: () => void;
    volume: number;
    setVolume: (vol: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        // Load prefs from localStorage if needed
        const savedMute = localStorage.getItem('sound_muted');
        const savedVol = localStorage.getItem('sound_volume');

        if (savedMute !== null) setIsMuted(savedMute === 'true');
        if (savedVol !== null) setVolume(parseFloat(savedVol));
    }, []);

    useEffect(() => {
        soundService.setMuted(isMuted);
        localStorage.setItem('sound_muted', isMuted.toString());
    }, [isMuted]);

    useEffect(() => {
        soundService.setVolume(volume);
        localStorage.setItem('sound_volume', volume.toString());
    }, [volume]);

    const playSound = (type: SoundType) => {
        if (!isMuted) {
            soundService.play(type);
        }
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{
            playSound,
            isMuted,
            toggleMute,
            volume,
            setVolume
        }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
}
