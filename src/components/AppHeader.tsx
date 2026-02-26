/**
 * AppHeader - Clean Top Bar for Language Coach
 */

'use client';

import React from 'react';
import { Globe, Settings, RotateCcw } from 'lucide-react';
import { LanguageConfig } from '@/types/languageTypes';

interface AppHeaderProps {
    targetLanguage: LanguageConfig | null;
    onSetupClick: () => void;
    onResetClick: () => void;
}

export function AppHeader({ targetLanguage, onSetupClick, onResetClick }: AppHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-30 flex items-center px-6 justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center text-emerald-600">
                    <Globe className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="flex flex-col">
                    <h1 className="font-bold text-slate-900 text-sm tracking-tight leading-none uppercase tracking-widest">
                        Neural Coach
                    </h1>
                    {targetLanguage && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded leading-none">
                                {targetLanguage.name.toUpperCase()}
                            </span>
                            <span className="text-xs grayscale opacity-70">{targetLanguage.flag}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={onSetupClick}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all outline-none"
                    title="Change Language Settings"
                    aria-label="Settings"
                >
                    <Settings className="w-4 h-4 stroke-[2]" />
                </button>
                <button
                    onClick={onResetClick}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all outline-none"
                    title="Reset Conversation"
                    aria-label="Reset"
                >
                    <RotateCcw className="w-4 h-4 stroke-[2]" />
                </button>
            </div>
        </header>
    );
}
