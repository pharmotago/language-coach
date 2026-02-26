import React, { useState } from 'react';
import { Globe, X, ArrowLeft } from 'lucide-react';
import { LanguageConfig, SkillLevel } from '@/types/languageTypes';
import { SUPPORTED_LANGUAGES } from '@/lib/languageData';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white max-w-2xl w-full rounded-[2rem] shadow-premium relative overflow-hidden border border-slate-200/50"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                            <Globe className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Neural Coach
                            </h2>
                            <p className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-widest mt-1">
                                {step === 'language' ? 'Select Destination' : 'Configure Proficiency'}
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {step === 'language' ? (
                            <motion.div
                                key="language-step"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className="p-6 rounded-2xl text-center bg-white border border-slate-100 hover:border-emerald-500 hover:shadow-ambient transition-all group flex flex-col items-center gap-3 active:scale-95 duration-200"
                                    >
                                        <div className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                                            {lang.flag}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm tracking-tight">
                                                {lang.name}
                                            </div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                {lang.nativeName}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="level-step"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-6"
                            >
                                <button
                                    onClick={() => setStep('language')}
                                    className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 font-mono tracking-widest uppercase mb-4 transition-colors font-mono"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Change Language
                                </button>

                                <div className="flex flex-col gap-3">
                                    {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => {
                                        const descriptions = {
                                            Beginner: 'Focus on fundamentals. Basic vocabulary and syntax.',
                                            Intermediate: 'Build conversational confidence and natural flow.',
                                            Advanced: 'Master nuances, idioms, and complex structures.'
                                        };

                                        return (
                                            <button
                                                key={level}
                                                onClick={() => handleLevelSelect(level)}
                                                className="w-full bg-white p-6 rounded-2xl text-left border border-slate-100 hover:border-emerald-500 hover:shadow-ambient transition-all group flex items-start gap-5 active:scale-[0.99]"
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm border",
                                                    level === 'Beginner' && "bg-emerald-50 border-emerald-100 text-emerald-600",
                                                    level === 'Intermediate' && "bg-slate-50 border-slate-100 text-slate-600",
                                                    level === 'Advanced' && "bg-slate-900 border-slate-800 text-white"
                                                )}>
                                                    {level.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors tracking-tight">
                                                        {level}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mt-0.5 font-medium leading-relaxed">
                                                        {descriptions[level]}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
