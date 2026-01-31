'use client';

import React, { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, User } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface LeaderboardUser {
    id: string;
    rank: number;
    name: string;
    xp: number;
    avatar_color: string;
    streak: number;
    isCurrentUser?: boolean;
    language: string;
    flag: string;
}

// Mock Leaderboard Data
const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { id: '1', rank: 1, name: 'LinguaMaster99', xp: 12500, avatar_color: 'bg-purple-500', streak: 45, language: 'Japanese', flag: '🇯🇵' },
    { id: '2', rank: 2, name: 'PolyglotPrime', xp: 11200, avatar_color: 'bg-blue-500', streak: 32, language: 'Spanish', flag: '🇪🇸' },
    { id: '3', rank: 3, name: 'SoraExplorer', xp: 9800, avatar_color: 'bg-emerald-500', streak: 12, language: 'French', flag: '🇫🇷' },
    { id: '4', rank: 4, name: 'ZenLearner', xp: 8500, avatar_color: 'bg-amber-500', streak: 8, language: 'Italian', flag: '🇮🇹' },
    { id: '5', rank: 5, name: 'ArcticFox', xp: 7200, avatar_color: 'bg-indigo-500', streak: 5, language: 'German', flag: '🇩🇪' },
];

interface LeaderboardProps {
    currentUserXp: number;
    currentUserStreak: number;
}

export function Leaderboard({ currentUserXp, currentUserStreak }: LeaderboardProps) {
    const { skillLevel } = useLanguageStore();
    const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');

    // Simulate current user relative to leaderboard
    const currentUserMock: LeaderboardUser = {
        id: 'user',
        rank: 6,
        name: 'You',
        xp: currentUserXp,
        avatar_color: 'bg-fuchsia-500',
        streak: currentUserStreak,
        language: 'English',
        flag: '🌎',
        isCurrentUser: true
    };

    const displayUsers = [...MOCK_LEADERBOARD, currentUserMock];

    return (
        <div className="animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Crown className="w-8 h-8 text-amber-400" />
                        Leaderboard
                    </h2>
                    <p className="text-slate-400 mt-1"> compete with learners worldwide.</p>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setTimeframe('weekly')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${timeframe === 'weekly' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setTimeframe('all-time')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${timeframe === 'all-time' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* League Banner */}
            <div className="glass-card bg-gradient-to-r from-amber-500/10 to-purple-500/10 border-amber-500/20 p-6 rounded-2xl mb-8 flex items-center justify-between animate-pulse-subtle">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Medal className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Gold League</h3>
                        <p className="text-sm text-amber-200/60">Top 10 advance to Diamond League</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">4 Days</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Remaining</div>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-3">
                {displayUsers.map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${user.isCurrentUser
                            ? 'bg-slate-800/80 border-amber-500/50 shadow-lg shadow-amber-500/5 sticky bottom-4 z-10 backdrop-blur-md'
                            : 'glass-card border-slate-800/50 hover:bg-slate-800/30'
                            }`}
                    >
                        {/* Rank */}
                        <div className="w-8 flex justify-center font-bold text-lg">
                            {user.rank === 1 ? <span className="text-amber-400">1</span> :
                                user.rank === 2 ? <span className="text-slate-300">2</span> :
                                    user.rank === 3 ? <span className="text-amber-700">3</span> :
                                        <span className="text-slate-500">{user.rank}</span>}
                        </div>

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full ${user.avatar_color} flex items-center justify-center text-white font-bold shadow-inner`}>
                            {user.name.charAt(0)}
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className={`font-bold ${user.isCurrentUser ? 'text-amber-400' : 'text-slate-200'}`}>
                                    {user.name}
                                </span>
                                {user.isCurrentUser && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-bold">You</span>}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    {user.flag} {user.language}
                                </span>
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    {user.streak} day streak
                                </span>
                            </div>
                        </div>

                        {/* XP */}
                        <div className="font-mono font-bold text-slate-300">
                            {user.xp.toLocaleString()} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
