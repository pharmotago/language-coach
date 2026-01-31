/**
 * Vocabulary Flashcard System with Spaced Repetition (SM-2 Algorithm)
 */

'use client';

import React, { useState } from 'react';
import { Volume2, RotateCw, Heart, Brain, CheckCircle2, XCircle, Minus } from 'lucide-react';

export interface VocabularyCard {
    id: string;
    term: string;
    translation: string;
    language: string;
    example: string;
    phonetic?: string;
    category: string;
    dateAdded: Date;

    // SM-2 Algorithm fields
    easinessFactor: number; // 1.3 to 2.5+
    interval: number; // days until next review
    repetitions: number; // number of correct reviews in a row
    nextReviewDate: Date;
    lastReviewDate?: Date;
    masteryLevel: 'new' | 'learning' | 'mastered';
    reviewCount: number;
}

export interface ReviewResult {
    quality: 0 | 1 | 2 | 3 | 4 | 5; // 0-2: Again, 3: Hard, 4: Good, 5: Easy
}

// SM-2 Spaced Repetition Algorithm
export function calculateNextReview(card: VocabularyCard, quality: number): VocabularyCard {
    let { easinessFactor, interval, repetitions } = card;

    // Update easiness factor
    easinessFactor = Math.max(1.3, easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    // Update interval and repetitions
    if (quality < 3) {
        // Failed recall
        repetitions = 0;
        interval = 1;
    } else {
        repetitions += 1;
        if (repetitions === 1) {
            interval = 1;
        } else if (repetitions === 2) {
            interval = 6;
        } else {
            interval = Math.round(interval * easinessFactor);
        }
    }

    // Determine mastery level
    let masteryLevel: 'new' | 'learning' | 'mastered' = 'learning';
    if (repetitions === 0 && card.reviewCount === 0) {
        masteryLevel = 'new';
    } else if (repetitions >= 3 && interval >= 21) {
        masteryLevel = 'mastered';
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
        ...card,
        easinessFactor,
        interval,
        repetitions,
        nextReviewDate,
        lastReviewDate: new Date(),
        masteryLevel,
        reviewCount: card.reviewCount + 1
    };
}

export function FlashcardReview({ card, onReview, onSpeak }: {
    card: VocabularyCard;
    onReview: (quality: number) => void;
    onSpeak: (text: string, lang: string) => void;
}) {
    const [flipped, setFlipped] = useState(false);

    const handleReview = (quality: number) => {
        onReview(quality);
        setFlipped(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Flashcard */}
            <div
                className="relative h-96 cursor-pointer perspective-1000"
                onClick={() => setFlipped(!flipped)}
            >
                <div
                    className={`
                        relative w-full h-full transition-all duration-500 transform-style-3d
                        ${flipped ? 'rotate-y-180' : ''}
                    `}
                >
                    {/* Front Side */}
                    <div className={`
                        absolute w-full h-full glass-card rounded-2xl p-8 flex flex-col items-center justify-center
                        backface-hidden border-2 border-slate-700
                        ${flipped ? 'invisible' : ''}
                    `}>
                        <div className="text-center mb-6">
                            <span className="text-sm text-slate-500 uppercase tracking-wider">
                                {card.language} • {card.category}
                            </span>
                        </div>

                        <div className="text-5xl font-bold text-white mb-4 text-center">
                            {card.term}
                        </div>

                        {card.phonetic && (
                            <div className="text-lg text-slate-400 mb-6">
                                /{card.phonetic}/
                            </div>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSpeak(card.term, card.language);
                            }}
                            className="btn-ghost px-4 py-2 flex items-center gap-2"
                        >
                            <Volume2 className="w-5 h-5" />
                            Listen
                        </button>

                        <div className="absolute bottom-8 text-sm text-slate-500">
                            Click to reveal translation
                        </div>
                    </div>

                    {/* Back Side */}
                    <div className={`
                        absolute w-full h-full glass-card rounded-2xl p-8 flex flex-col items-center justify-center
                        backface-hidden rotate-y-180 border-2 border-emerald-600
                        ${!flipped ? 'invisible' : ''}
                    `}>
                        <div className="text-4xl font-bold text-emerald-400 mb-6 text-center">
                            {card.translation}
                        </div>

                        <div className="bg-slate-900 rounded-xl p-4 mb-6 max-w-md">
                            <p className="text-sm text-slate-300 italic">
                                "{card.example}"
                            </p>
                        </div>

                        <div className="absolute bottom-8 text-sm text-slate-500">
                            Rate your recall
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Buttons (only show when flipped) */}
            {flipped && (
                <div className="mt-8 grid grid-cols-4 gap-3 animate-in fade-in duration-300">
                    <button
                        onClick={() => handleReview(0)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500/50 transition-all"
                    >
                        <XCircle className="w-6 h-6 text-red-400" />
                        <span className="text-sm font-semibold text-red-300">Again</span>
                        <span className="text-xs text-red-500/70">Complete blackout</span>
                    </button>

                    <button
                        onClick={() => handleReview(3)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border-2 border-orange-500/30 hover:border-orange-500/50 transition-all"
                    >
                        <Minus className="w-6 h-6 text-orange-400" />
                        <span className="text-sm font-semibold text-orange-300">Hard</span>
                        <span className="text-xs text-orange-500/70">Difficult recall</span>
                    </button>

                    <button
                        onClick={() => handleReview(4)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all"
                    >
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300">Good</span>
                        <span className="text-xs text-emerald-500/70">Correct response</span>
                    </button>

                    <button
                        onClick={() => handleReview(5)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all"
                    >
                        <Brain className="w-6 h-6 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-300">Easy</span>
                        <span className="text-xs text-blue-500/70">Perfect recall</span>
                    </button>
                </div>
            )}

            {/* Card Stats */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                    <RotateCw className="w-4 h-4" />
                    <span>Reviewed {card.reviewCount} times</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>Mastery: {card.masteryLevel}</span>
                </div>
            </div>
        </div>
    );
}

export function VocabularyDashboard({ cards }: { cards: VocabularyCard[] }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
        total: cards.length,
        new: cards.filter(c => c.masteryLevel === 'new').length,
        learning: cards.filter(c => c.masteryLevel === 'learning').length,
        mastered: cards.filter(c => c.masteryLevel === 'mastered').length,
        dueToday: cards.filter(c => new Date(c.nextReviewDate) <= today).length
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard
                    label="Total Words"
                    value={stats.total}
                    color="blue"
                    icon="📚"
                />
                <StatCard
                    label="New"
                    value={stats.new}
                    color="slate"
                    icon="✨"
                />
                <StatCard
                    label="Learning"
                    value={stats.learning}
                    color="amber"
                    icon="📖"
                />
                <StatCard
                    label="Mastered"
                    value={stats.mastered}
                    color="emerald"
                    icon="🎓"
                />
                <StatCard
                    label="Due Today"
                    value={stats.dueToday}
                    color="red"
                    icon="⏰"
                    highlight={stats.dueToday > 0}
                />
            </div>

            {/* Study Now Button */}
            {stats.dueToday > 0 && (
                <button className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2">
                    <Brain className="w-6 h-6" />
                    Study {stats.dueToday} Cards Now
                </button>
            )}

            {/* Progress Visualization */}
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Vocabulary Progress</h3>
                <div className="space-y-3">
                    <ProgressBar label="Mastered" value={stats.mastered} total={stats.total} color="emerald" />
                    <ProgressBar label="Learning" value={stats.learning} total={stats.total} color="amber" />
                    <ProgressBar label="New" value={stats.new} total={stats.total} color="slate" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color, icon, highlight = false }: {
    label: string;
    value: number;
    color: string;
    icon: string;
    highlight?: boolean;
}) {
    const colorClasses: Record<string, string> = {
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
        slate: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
        amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
        emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
        red: 'from-red-500/20 to-red-600/10 border-red-500/30'
    };

    return (
        <div className={`
            glass-card rounded-xl p-4 border-2 bg-gradient-to-br
            ${colorClasses[color]}
            ${highlight ? 'animate-pulse-slow' : ''}
        `}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
        </div>
    );
}

function ProgressBar({ label, value, total, color }: {
    label: string;
    value: number;
    total: number;
    color: 'emerald' | 'amber' | 'slate';
}) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    const colorClasses = {
        emerald: 'from-emerald-500 to-emerald-400',
        amber: 'from-amber-500 to-amber-400',
        slate: 'from-slate-500 to-slate-400'
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-300">{value} / {total}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
