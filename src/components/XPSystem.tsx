/**
 * XP (Experience Points) and Leveling System
 */

'use client';

import React from 'react';
import { TrendingUp, Star, Sparkles } from 'lucide-react';

export interface XPSystem {
    currentXP: number;
    currentLevel: number;
    xpForNextLevel: number;
    totalXPEarned: number;
}

export function calculateLevel(totalXP: number): { level: number; xpForNext: number; xpProgress: number } {
    // XP formula: level^2 * 100
    let level = 1;
    let xpNeeded = 0;

    while (xpNeeded <= totalXP) {
        level++;
        xpNeeded += level * level * 100;
    }

    level--; // Step back to current level
    const xpForCurrentLevel = (level * level * 100);
    const xpForNextLevel = ((level + 1) * (level + 1) * 100);
    const xpInCurrentLevel = totalXP - (xpForCurrentLevel * level / 2);

    return {
        level,
        xpForNext: xpForNextLevel,
        xpProgress: xpInCurrentLevel
    };
}

export function XPBar({ currentXP, currentLevel, xpForNextLevel, compact = false }: {
    currentXP: number;
    currentLevel: number;
    xpForNextLevel: number;
    compact?: boolean;
}) {
    const progress = (currentXP / xpForNextLevel) * 100;

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">Lv {currentLevel}</span>
                </div>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs text-slate-400 min-w-[60px] text-right">
                    {currentXP}/{xpForNextLevel}
                </span>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">Level {currentLevel}</div>
                        <div className="text-sm text-slate-400">Language Learner</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-amber-400">{currentXP} XP</div>
                    <div className="text-xs text-slate-500">
                        {xpForNextLevel - currentXP} to next level
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 animate-shimmer transition-all duration-500 ease-out relative"
                        style={{ width: `${progress}%`, backgroundSize: '200% 100%' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                    <span className="text-slate-500">Level {currentLevel}</span>
                    <span className="text-amber-400 font-semibold">{Math.round(progress)}%</span>
                    <span className="text-slate-500">Level {currentLevel + 1}</span>
                </div>
            </div>

            {/* XP Sources */}
            <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Earn XP by:</h4>
                <div className="grid grid-cols-2 gap-3">
                    <XPSource icon="💬" label="Send message" xp={5} />
                    <XPSource icon="✅" label="Perfect message" xp={15} />
                    <XPSource icon="📚" label="Learn word" xp={10} />
                    <XPSource icon="🎯" label="Complete scenario" xp={50} />
                    <XPSource icon="🔥" label="Daily practice" xp={25} />
                    <XPSource icon="🏆" label="Unlock achievement" xp="varies" />
                </div>
            </div>
        </div>
    );
}

function XPSource({ icon, label, xp }: { icon: string; label: string; xp: number | string }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">{icon}</span>
            <span className="text-slate-300 flex-1">{label}</span>
            <span className="text-amber-400 font-semibold">+{xp}</span>
        </div>
    );
}

// Level Up Animation Component
export function LevelUpNotification({ level, onClose }: {
    level: number;
    onClose: () => void;
}) {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative">
                {/* Particle effects */}
                <div className="absolute inset-0 animate-pulse">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-amber-400 rounded-full animate-float"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Main card */}
                <div className="glass-card rounded-2xl p-12 text-center border-2 border-amber-500 min-w-[400px] animate-in zoom-in duration-500">
                    <div className="mb-4 animate-bounce">
                        <Sparkles className="w-16 h-16 text-amber-400 mx-auto" />
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-2">
                        LEVEL UP!
                    </h2>

                    <div className="text-6xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent mb-4">
                        {level}
                    </div>

                    <p className="text-slate-300 mb-6">
                        You've reached level {level}! Keep up the amazing work!
                    </p>

                    <button
                        onClick={onClose}
                        className="btn-primary"
                    >
                        Continue Learning
                    </button>
                </div>
            </div>
        </div>
    );
}

// XP Gain Toast Notification
export function XPGainToast({ amount, reason, onClose }: {
    amount: number;
    reason: string;
    onClose: () => void;
}) {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-24 right-6 z-40 animate-in slide-in-from-right duration-300">
            <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 border border-amber-500/30">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <div>
                    <div className="font-bold text-amber-400">+{amount} XP</div>
                    <div className="text-xs text-slate-400">{reason}</div>
                </div>
            </div>
        </div>
    );
}
