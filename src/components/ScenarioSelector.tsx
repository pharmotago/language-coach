/**
 * Scenario Selector Component - Choose contextual practice scenarios
 */

'use client';

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Scenario, SkillLevel } from '@/types/languageTypes';
import { SCENARIOS } from '@/lib/languageData';
import { cn } from '@/lib/utils';
import { aiService } from '@/lib/aiCore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ScenarioSelectorProps {
    currentLevel: SkillLevel;
    onSelect: (scenario: Scenario) => void;
    onClose: () => void;
}

export function ScenarioSelector({ currentLevel, onSelect, onClose }: ScenarioSelectorProps) {
    const [mode, setMode] = useState<'select' | 'create'>('select');
    const [customTopic, setCustomTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const { dynamicScenarios } = useLanguageStore();

    // Filter scenarios appropriate for current level
    const suitableScenarios = [
        ...SCENARIOS.filter(scenario => {
            const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
            return levelOrder[scenario.difficulty] <= levelOrder[currentLevel];
        }),
        ...dynamicScenarios.filter(scenario => {
            const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
            return levelOrder[scenario.difficulty] <= levelOrder[currentLevel];
        })
    ];

    const handleGenerate = async () => {
        if (!customTopic.trim()) return;

        setIsGenerating(true);
        setError('');

        try {
            const prompt = `Generate a roleplay scenario for a language learner about: "${customTopic}". The difficulty should be "${currentLevel}".`;
            const aiResponse = await aiService.generateResponse({
                messages: [],
                systemPrompt: prompt,
                targetLanguage: 'English',
                skillLevel: currentLevel
            });

            // The aiService handles JSON cleaning and parsing for us in most cases, 
            // but we need to map the output to the Scenario interface
            const newScenario: Scenario = {
                id: `custom_${Date.now()}`,
                title: aiResponse.response.split('\n')[0].substring(0, 30),
                description: aiResponse.translation || aiResponse.response.substring(0, 100),
                context: aiResponse.response,
                difficulty: currentLevel,
                icon: 'Sparkles'
            };

            onSelect(newScenario);
            onClose();
        } catch (err) {
            console.error("Generation Error:", err);
            setError("Failed to generate scenario. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass-card max-w-3xl w-full max-h-[80vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {mode === 'select' ? 'Choose a Scenario' : 'Create Custom Scenario'}
                        </h2>
                        <p className="text-sm text-slate-400">
                            {mode === 'select' ? 'Practice in a real-world context' : 'Powered by Gemini AI 🧠'}
                        </p>
                    </div>
                    {mode === 'create' && (
                        <button
                            onClick={() => setMode('select')}
                            className="text-slate-400 hover:text-white"
                        >
                            Back
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] flex-1">
                    {mode === 'select' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Custom Scenario Button */}
                            <button
                                onClick={() => setMode('create')}
                                className="relative overflow-hidden rounded-xl text-left transition-all duration-300 group h-full border border-amber-500/30 hover:border-amber-500/60 p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/10 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
                            >
                                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-slow" />

                                <div className="relative z-10 flex items-center gap-4 h-full">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Icons.Sparkles className="w-6 h-6 text-white animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-1">
                                            Infinite Scenarios
                                        </h3>
                                        <p className="text-sm text-slate-400 group-hover:text-amber-100/70 transition-colors">
                                            Generate ANY situation with AI...
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {suitableScenarios.map((scenario) => {
                                const IconComponent = (Icons as any)[scenario.icon] || Icons.MessageCircle;
                                return (
                                    <button
                                        key={scenario.id}
                                        onClick={() => { onSelect(scenario); onClose(); }}
                                        className="glass-card-light p-5 rounded-xl text-left hover:bg-white/10 hover:border-amber-500/30 transition-all duration-200 group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                                                <IconComponent className="w-6 h-6 text-amber-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">{scenario.title}</h3>
                                                    <span className={cn(
                                                        "text-xs px-2 py-0.5 rounded-full font-medium",
                                                        scenario.difficulty === 'Beginner' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
                                                        scenario.difficulty === 'Intermediate' && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                                                        scenario.difficulty === 'Advanced' && "bg-red-500/10 text-red-400 border border-red-500/30"
                                                    )}>{scenario.difficulty}</span>
                                                </div>
                                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{scenario.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 items-center justify-center h-full py-8">
                            <div className="w-full max-w-md space-y-4">
                                <label className="block text-sm font-medium text-slate-300">
                                    What scenario do you want to practice?
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={customTopic}
                                        onChange={(e) => setCustomTopic(e.target.value)}
                                        placeholder="e.g., Returning a defective robot not knowing the receipt is missing..."
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        disabled={isGenerating}
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    />
                                    <Icons.Bot className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                </div>
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <button
                                    onClick={handleGenerate}
                                    disabled={!customTopic.trim() || isGenerating}
                                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Icons.Loader2 className="animate-spin w-5 h-5" />
                                            Generating Scenario...
                                        </>
                                    ) : (
                                        <>
                                            <Icons.Wand2 className="w-5 h-5" />
                                            Create Simulation
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-4">
                                {["Ordering street food", "Discussing philosophy", "Flirting at a bar", "Police traffic stop"].map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => setCustomTopic(topic)}
                                        className="text-xs bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white py-2 px-3 rounded-lg transition-colors border border-slate-700/50"
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center">
                    <p className="text-xs text-slate-500">
                        {mode === 'select' ? `${suitableScenarios.length} scenarios available` : 'AI Generation Active'}
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
