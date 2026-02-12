/**
 * Setup Modal - Language and skill level selection
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, TrendingUp, X } from 'lucide-react';
import { LanguageConfig, SkillLevel } from '@/types/languageTypes';
import { SUPPORTED_LANGUAGES } from '@/lib/languageData';
import { cn } from '@/lib/utils';

interface SetupModalProps {
    onComplete: (language: LanguageConfig, level: SkillLevel) => void;
    onClose?: () => void;
    initialLanguage?: LanguageConfig | null;
}

export function SetupModal({ onComplete, onClose, initialLanguage }: SetupModalProps) {
    const [step, setStep] = useState<'language' | 'level'>('language');
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageConfig | null>(initialLanguage || null);

    const handleLanguageSelect = (language: LanguageConfig) => {
        setSelectedLanguage(language);
        setStep('level');
    };

    const handleLevelSelect = (level: SkillLevel) => {
        if (selectedLanguage) {
            onComplete(selectedLanguage, level);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-3d max-w-2xl w-full rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                            <Globe className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                                Neural Coach
                            </h2>
                            <p className="text-sm text-emerald-400/80 font-bold uppercase tracking-widest">
                                {step === 'language' ? 'Deployment Sector' : 'Cognitive Level'}
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {step === 'language' ? (
                            <motion.div
                                key="language"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                                {SUPPORTED_LANGUAGES.map((lang, idx) => (
                                    <motion.button
                                        key={lang.code}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className="glass-premium p-6 rounded-2xl text-center hover:bg-emerald-500/10 transition-all border-white/5 hover:border-emerald-500/50 group"
                                    >
                                        <div className="text-5xl mb-3 drop-shadow-2xl">{lang.flag}</div>
                                        <div className="font-black text-white text-sm mb-1 uppercase tracking-tighter">
                                            {lang.name}
                                        </div>
                                        <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                                            {lang.nativeName}
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="level"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <button
                                    onClick={() => setStep('language')}
                                    className="text-xs text-emerald-400/60 hover:text-emerald-400 mb-6 flex items-center gap-2 font-black uppercase tracking-widest transition-colors"
                                >
                                    ← Reassign Sector
                                </button>

                                <div className="space-y-4">
                                    {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => {
                                        const descriptions = {
                                            Beginner: 'Fundamental acquisition. Basic synaptic connections.',
                                            Intermediate: 'Operational fluency. Complex neural pattern matching.',
                                            Advanced: 'Architectural mastery. Full cognitive immersion.'
                                        };

                                        return (
                                            <motion.button
                                                key={level}
                                                whileHover={{ x: 10 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleLevelSelect(level)}
                                                className="w-full glass-premium p-6 rounded-2xl text-left hover:bg-emerald-500/10 border-white/5 hover:border-emerald-500/50 transition-all group"
                                            >
                                                <div className="flex items-start gap-6">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                                                        level === 'Beginner' && "bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20",
                                                        level === 'Intermediate' && "bg-amber-500/20 text-amber-400 shadow-amber-500/20",
                                                        level === 'Advanced' && "bg-rose-500/20 text-rose-400 shadow-rose-500/20"
                                                    )}>
                                                        <TrendingUp className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-black text-white text-xl uppercase tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">
                                                            {level}
                                                        </h3>
                                                        <p className="text-sm text-white/60 leading-relaxed font-bold">
                                                            {descriptions[level]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-10 py-6 border-t border-white/5 bg-white/5">
                    <p className="text-[10px] text-white/40 text-center font-black uppercase tracking-[0.3em]">
                        Cognitive Immersion Protocol Active
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
