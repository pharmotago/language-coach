'use client';

import React, { useEffect, useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { audioGenerator } from '@/lib/audioGenerator';
import { Volume2, VolumeX, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AmbientManager() {
    const { currentScenario } = useLanguageStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);

    useEffect(() => {
        if (!currentScenario) {
            audioGenerator.stop();
            setIsPlaying(false);
            return;
        }

        const type = mapScenarioToAudioType(currentScenario.id);
        if (type) {
            audioGenerator.playAmbience(type);
            setIsPlaying(true);
        } else {
            audioGenerator.stop();
            setIsPlaying(false);
        }

        return () => audioGenerator.stop();
    }, [currentScenario]);

    const toggleMute = () => {
        if (isPlaying) {
            audioGenerator.stop();
            setIsPlaying(false);
        } else if (currentScenario) {
            const type = mapScenarioToAudioType(currentScenario.id);
            if (type) {
                audioGenerator.playAmbience(type);
                setIsPlaying(true);
            }
        }
    };

    if (!currentScenario || !mapScenarioToAudioType(currentScenario.id)) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg"
            >
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Atmosphere</span>
                    <span className="text-xs text-amber-500 font-medium capitalize">
                        {mapScenarioToAudioType(currentScenario.id)}
                    </span>
                </div>

                <div className="h-4 w-px bg-slate-700" />

                <button
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    {isPlaying ? (
                        <div className="relative">
                            <Waves className="w-5 h-5 text-emerald-400 animate-pulse" />
                        </div>
                    ) : (
                        <VolumeX className="w-5 h-5" />
                    )}
                </button>
            </motion.div>
        </div>
    );
}

function mapScenarioToAudioType(id: string): 'cafe' | 'library' | 'street' | 'nature' | 'rain' | null {
    const lower = id.toLowerCase();
    if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('restaurant')) return 'cafe';
    if (lower.includes('library') || lower.includes('school') || lower.includes('study')) return 'library';
    if (lower.includes('street') || lower.includes('market') || lower.includes('city')) return 'street';
    if (lower.includes('park') || lower.includes('nature') || lower.includes('garden')) return 'nature';
    if (lower.includes('rain') || lower.includes('storm')) return 'rain';

    // Default fallback based on common scenarios
    if (['ordering-food', 'restaurant'].includes(id)) return 'cafe';
    if (['directions', 'shopping'].includes(id)) return 'street';

    return null;
}
