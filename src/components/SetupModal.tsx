/**
 * Setup Modal - Clean, Minimal Language and skill level selection
 */

'use client';

import React, { useState } from 'react';
import { Globe, X } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl relative overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                                Neural Coach
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                {step === 'language' ? 'Select a language to learn' : 'Choose your proficiency'}
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 'language' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageSelect(lang)}
                                    className="p-6 rounded-2xl text-center bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col items-center gap-2"
                                >
                                    <div className="text-4xl">{lang.flag}</div>
                                    <div>
                                        <div className="font-semibold text-slate-800 text-sm">
                                            {lang.name}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                            {lang.nativeName}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={() => setStep('language')}
                                className="text-sm text-emerald-600 hover:text-emerald-700 mb-6 font-medium transition-colors"
                            >
                                ← Back to languages
                            </button>

                            <div className="flex flex-col gap-3">
                                {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => {
                                    const descriptions = {
                                        Beginner: 'Start from scratch. Learn basic vocabulary and grammar.',
                                        Intermediate: 'Hold basic conversations. Improve fluency and vocabulary.',
                                        Advanced: 'Refine complex structures and near-native colloquialisms.'
                                    };

                                    return (
                                        <button
                                            key={level}
                                            onClick={() => handleLevelSelect(level)}
                                            className="w-full bg-white p-5 rounded-2xl text-left border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex items-start gap-4"
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm",
                                                level === 'Beginner' && "bg-emerald-100 text-emerald-700",
                                                level === 'Intermediate' && "bg-amber-100 text-amber-700",
                                                level === 'Advanced' && "bg-rose-100 text-rose-700"
                                            )}>
                                                {level.charAt(0)}
                                            </div>
                                            <div className="flex-1 mt-0.5">
                                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">
                                                    {level}
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {descriptions[level]}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
