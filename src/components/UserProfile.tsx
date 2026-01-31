"use client";

import React from 'react';
import { User, Shield, Zap, Trophy, Star } from 'lucide-react';
import { calculateLevel, getLevelProgress, getNextLevel } from '@/lib/gamification';
import { cn } from '@/lib/utils';

interface UserProfileProps {
    totalXp: number;
    username?: string;
    className?: string;
}

export function UserProfile({ totalXp, username = "Stoic Initiate", className }: UserProfileProps) {
    const currentLevel = calculateLevel(totalXp);
    const progress = getLevelProgress(totalXp);
    const nextLevel = getNextLevel(currentLevel.level);

    return (
        <div className={cn("bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden", className)}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-4 relative z-10">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-500/30 flex items-center justify-center p-1">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                            <User className="w-8 h-8 text-amber-500" />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
                        <span className="text-[10px] font-bold text-white">{currentLevel.level}</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-white truncate">{username}</h3>
                            <p className="text-xs text-amber-500 font-medium uppercase tracking-wider">
                                {currentLevel.title}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-amber-400">{totalXp.toLocaleString()} XP</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Level {currentLevel.level}</span>
                            <span>{nextLevel ? `${nextLevel.minXp - totalXp} XP to scale` : 'Max Level'}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
