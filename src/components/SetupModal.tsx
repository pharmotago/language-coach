/**
 * Setup Modal - Language and skill level selection
 */

'use client';

import React, { useState } from 'react';
import { Globe, TrendingUp, X } from 'lucide-react';
import { LanguageConfig, SkillLevel } from '@/types/languageTypes';
import { SUPPORTED_LANGUAGES } from '@/lib/languageData';
import { cn } from '@/lib/utils';

interface SetupModalProps {
    onComplete: (language: LanguageConfig, level: SkillLevel) => void;
}

export function SetupModal({ onComplete }: SetupModalProps) {
    const [step, setStep] = useState<'language' | 'level'>('language');
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageConfig | null>(null);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="glass-card max-w-2xl w-full rounded-2xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Language Immersion Coach
                            </h2>
                            <p className="text-sm text-slate-400">
                                {step === 'language' ? 'Choose your target language' : 'Select your current level'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 'language' && (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className="glass-card-light p-4 rounded-xl text-center hover:bg-white/10 hover:border-amber-500/50 transition-all duration-200 group"
                                    >
                                        <div className="text-4xl mb-2">{lang.flag}</div>
                                        <div className="font-bold text-white text-sm mb-0.5">
                                            {lang.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {lang.nativeName}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'level' && selectedLanguage && (
                        <div>
                            {/* Back button */}
                            <button
                                onClick={() => setStep('language')}
                                className="text-sm text-slate-400 hover:text-slate-300 mb-4 flex items-center gap-1"
                            >
                                ← Change language
                            </button>

                            <div className="space-y-3">
                                {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => {
                                    const descriptions = {
                                        Beginner: 'I\'m just starting out. Simple phrases and basic conversations.',
                                        Intermediate: 'I can hold basic conversations and understand common topics.',
                                        Advanced: 'I\'m comfortable with complex discussions and nuanced grammar.'
                                    };

                                    return (
                                        <button
                                            key={level}
                                            onClick={() => handleLevelSelect(level)}
                                            className="w-full glass-card-light p-5 rounded-xl text-left hover:bg-white/10 hover:border-amber-500/50 transition-all duration-200 group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                                    level === 'Beginner' && "bg-emerald-500/10",
                                                    level === 'Intermediate' && "bg-amber-500/10",
                                                    level === 'Advanced' && "bg-red-500/10"
                                                )}>
                                                    <TrendingUp className={cn(
                                                        "w-5 h-5",
                                                        level === 'Beginner' && "text-emerald-400",
                                                        level === 'Intermediate' && "text-amber-400",
                                                        level === 'Advanced' && "text-red-400"
                                                    )} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-amber-400 transition-colors">
                                                        {level}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 leading-relaxed">
                                                        {descriptions[level]}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-slate-800">
                    <p className="text-xs text-slate-500 text-center">
                        🎯 Practice makes perfect. Immersion accelerates fluency.
                    </p>
                </div>
            </div>
        </div>
    );
}
