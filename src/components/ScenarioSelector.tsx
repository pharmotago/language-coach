/**
 * Scenario Selector Component - Choose contextual practice scenarios
 */

'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { Scenario, SkillLevel } from '@/types/languageTypes';
import { SCENARIOS } from '@/lib/languageData';
import { cn } from '@/lib/utils';

interface ScenarioSelectorProps {
    currentLevel: SkillLevel;
    onSelect: (scenario: Scenario) => void;
    onClose: () => void;
    onCreateCustom?: () => void;
}

export function ScenarioSelector({ currentLevel, onSelect, onClose, onCreateCustom }: ScenarioSelectorProps) {
    // Filter scenarios appropriate for current level
    const suitableScenarios = SCENARIOS.filter(scenario => {
        const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return levelOrder[scenario.difficulty] <= levelOrder[currentLevel];
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass-card max-w-3xl w-full max-h-[80vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Choose a Scenario
                    </h2>
                    <p className="text-sm text-slate-400">
                        Practice in a real-world context to improve faster
                    </p>
                </div>

                {/* Scenarios Grid */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Custom Scenario Button */}
                        <button
                            onClick={() => {
                                if (onCreateCustom) onCreateCustom();
                            }}
                            className="glass-card-light p-5 rounded-xl text-left hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-200 group border-dashed border-2 border-slate-700"
                        >
                            <div className="flex items-center gap-4 h-full">
                                <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <Icons.Plus className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                                        Create Custom
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        Type any situation...
                                    </p>
                                </div>
                            </div>
                        </button>

                        {suitableScenarios.map((scenario) => {
                            const IconComponent = (Icons as any)[scenario.icon] || Icons.MessageCircle;

                            return (
                                <button
                                    key={scenario.id}
                                    onClick={() => {
                                        onSelect(scenario);
                                        onClose();
                                    }}
                                    className="glass-card-light p-5 rounded-xl text-left hover:bg-white/10 hover:border-amber-500/30 transition-all duration-200 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                                            <IconComponent className="w-6 h-6 text-amber-400" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                                                    {scenario.title}
                                                </h3>
                                                <span className={cn(
                                                    "text-xs px-2 py-0.5 rounded-full font-medium",
                                                    scenario.difficulty === 'Beginner' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
                                                    scenario.difficulty === 'Intermediate' && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                                                    scenario.difficulty === 'Advanced' && "bg-red-500/10 text-red-400 border border-red-500/30"
                                                )}>
                                                    {scenario.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                {scenario.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center">
                    <p className="text-xs text-slate-500">
                        {suitableScenarios.length} scenarios available for your level
                    </p>
                    <button
                        onClick={onClose}
                        className="btn-secondary text-sm px-4 py-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
