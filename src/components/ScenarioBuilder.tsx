'use client';

import React, { useState } from 'react';
import { Sparkles, X, Wand2, Calculator, MessageSquarePlus } from 'lucide-react';
import { generateScenario } from '@/lib/aiScenario';
import { Scenario, SkillLevel } from '@/types/languageTypes';
import { useSound } from '@/contexts/SoundContext';

interface ScenarioBuilderProps {
    skillLevel: SkillLevel;
    onScenarioCreated: (scenario: Scenario) => void;
    onClose: () => void;
}

export function ScenarioBuilder({ skillLevel, onScenarioCreated, onClose }: ScenarioBuilderProps) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { playSound } = useSound();

    const handleCreate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            const scenario = await generateScenario(prompt, skillLevel);
            playSound('unlock'); // Success sound
            onScenarioCreated(scenario);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                        <Wand2 className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Build Custom Scenario</h2>
                    <p className="text-slate-400 text-sm">
                        Describe any situation you want to practice. The AI will set the scene.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            What do you want to practice?
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Argue with a taxi driver about the fare, Negotiate a salary, Flirt at a coffee shop..."
                            className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                            autoFocus
                        />
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={!prompt.trim() || isGenerating}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="w-5 h-5 animate-spin" />
                                Generating Context...
                            </>
                        ) : (
                            <>
                                <MessageSquarePlus className="w-5 h-5" />
                                Create Scenario
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-slate-500">
                        Powered by Infinite Content Engine™
                    </p>
                </div>
            </div>
        </div>
    );
}
