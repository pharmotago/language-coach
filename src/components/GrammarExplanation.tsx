/**
 * Grammar Explanation Modal & Tools
 */

'use client';

import React, { useState } from 'react';
import { BookOpen, X, Lightbulb, CheckCircle } from 'lucide-react';

export interface GrammarRule {
    id: string;
    title: string;
    category: 'verb' | 'noun' | 'adjective' | 'syntax' | 'pronoun' | 'preposition';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    explanation: string;
    examples: {
        incorrect?: string;
        correct: string;
        translation: string;
    }[];
    tips: string[];
    relatedRules?: string[];
}

export function GrammarExplanationModal({ rule, onClose }: {
    rule: GrammarRule;
    onClose: () => void;
}) {
    const [showExercise, setShowExercise] = useState(false);

    const categoryColors: Record<GrammarRule['category'], string> = {
        verb: 'from-blue-500 to-blue-600',
        noun: 'from-emerald-500 to-emerald-600',
        adjective: 'from-purple-500 to-purple-600',
        syntax: 'from-amber-500 to-amber-600',
        pronoun: 'from-pink-500 to-pink-600',
        preposition: 'from-cyan-500 to-cyan-600'
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${categoryColors[rule.category]} rounded-t-2xl`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-white" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">{rule.title}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full text-white">
                                        {rule.category}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full text-white">
                                        {rule.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Explanation */}
                    <div>
                        <h3 className="font-semibold text-white mb-3">Explanation</h3>
                        <p className="text-slate-300 leading-relaxed">{rule.explanation}</p>
                    </div>

                    {/* Examples */}
                    <div>
                        <h3 className="font-semibold text-white mb-3">Examples</h3>
                        <div className="space-y-3">
                            {rule.examples.map((example, index) => (
                                <div key={index} className="bg-slate-900/50 rounded-xl p-4 space-y-2">
                                    {example.incorrect && (
                                        <div className="flex items-start gap-2">
                                            <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-red-300 line-through">{example.incorrect}</p>
                                                <p className="text-xs text-red-400/70 mt-1">Incorrect</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-emerald-300 font-semibold">{example.correct}</p>
                                            <p className="text-xs text-slate-500 mt-1">{example.translation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    {rule.tips.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                Helpful Tips
                            </h3>
                            <ul className="space-y-2">
                                {rule.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2 text-slate-300">
                                        <span className="text-amber-400 mt-1">•</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Practice Button */}
                    <button
                        onClick={() => setShowExercise(!showExercise)}
                        className="w-full btn-primary py-3"
                    >
                        {showExercise ? 'Hide Practice' : 'Practice This Rule'}
                    </button>

                    {/* Exercise Section */}
                    {showExercise && (
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-amber-500/30">
                            <h4 className="font-semibold text-white mb-4">Quick Exercise</h4>
                            <p className="text-slate-400 text-sm mb-4">
                                Try creating your own sentence using this grammar rule...
                            </p>
                            <textarea
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                rows={3}
                                placeholder="Write your sentence here..."
                            />
                            <button className="mt-3 btn-primary">Check Answer</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Grammar Library Component
export function GrammarLibrary({ language, onSelectRule }: {
    language: string;
    onSelectRule: (rule: GrammarRule) => void;
}) {
    const [filter, setFilter] = useState<'all' | GrammarRule['difficulty']>('all');
    const [categoryFilter, setCategoryFilter] = useState<'all' | GrammarRule['category']>('all');

    const rules = GRAMMAR_RULES[language] || [];
    const filtered = rules.filter(rule => {
        if (filter !== 'all' && rule.difficulty !== filter) return false;
        if (categoryFilter !== 'all' && rule.category !== categoryFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <div>
                    <label className="text-xs text-slate-500 mb-2 block">Difficulty</label>
                    <div className="flex gap-2">
                        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => setFilter(level)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === level
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rules Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {filtered.map(rule => (
                    <button
                        key={rule.id}
                        onClick={() => onSelectRule(rule)}
                        className="glass-card p-4 rounded-xl text-left hover:border-amber-500/50 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                                {rule.title}
                            </h4>
                            <BookOpen className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                            {rule.explanation}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">
                                {rule.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">
                                {rule.difficulty}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Sample Grammar Rules Database
const GRAMMAR_RULES: Record<string, GrammarRule[]> = {
    Spanish: [
        {
            id: 'sp-ser-vs-estar',
            title: 'Ser vs. Estar',
            category: 'verb',
            difficulty: 'beginner',
            explanation: 'Spanish has two verbs for "to be". Use SER for permanent characteristics and ESTAR for temporary states or locations.',
            examples: [
                {
                    correct: 'Soy profesor',
                    translation: 'I am a teacher (permanent profession)',
                    incorrect: 'Estoy profesor'
                },
                {
                    correct: 'Estoy cansado',
                    translation: 'I am tired (temporary state)',
                    incorrect: 'Soy cansado'
                },
                {
                    correct: 'El museo está en el centro',
                    translation: 'The museum is in the center (location)'
                }
            ],
            tips: [
                'Remember: SER = Permanent, ESTAR = Temporary/Location',
                'Use SER for time, origin, profession, characteristics',
                'Use ESTAR for feelings, conditions, locations, ongoing actions'
            ]
        },
        {
            id: 'sp-subjunctive',
            title: 'Subjunctive Mood',
            category: 'verb',
            difficulty: 'advanced',
            explanation: 'The subjunctive expresses doubt, desire, emotion, or uncertainty. It\'s used in dependent clauses after certain triggers.',
            examples: [
                {
                    correct: 'Espero que vengas mañana',
                    translation: 'I hope that you come tomorrow',
                    incorrect: 'Espero que vienes mañana'
                },
                {
                    correct: 'Dudo que sea verdad',
                    translation: 'I doubt that it\'s true'
                }
            ],
            tips: [
                'Common triggers: esperar que, dudar que, es importante que',
                'Subjunctive is used after expressions of emotion, doubt, or desire',
                'If there\'s no "que", usually use indicative instead'
            ]
        }
    ]
};
