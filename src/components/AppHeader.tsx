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
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-30 flex items-center px-4 justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Globe className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-semibold text-slate-800 text-lg leading-tight">Neural Coach</h1>
                    <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        {targetLanguage ? (
                            <>
                                <span>{targetLanguage.name}</span>
                                <span>{targetLanguage.flag}</span>
                            </>
                        ) : (
                            'Not configured'
                        )}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onSetupClick}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                </button>
                <button
                    onClick={onResetClick}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Reset Everything"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
