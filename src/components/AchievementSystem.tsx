/**
 * Achievement & Badge System
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Award, Star, Flame, Target, Zap, Crown, Medal } from 'lucide-react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: 'trophy' | 'award' | 'star' | 'flame' | 'target' | 'zap' | 'crown' | 'medal';
    category: 'conversationalist' | 'perfectionist' | 'dedicated' | 'explorer';
    requirement: number;
    current: number;
    color: 'amber' | 'emerald' | 'blue' | 'purple' | 'red';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlocked: boolean;
    unlockedAt?: Date;
    xpReward: number;
}

interface AchievementBadgeProps {
    achievement: Achievement;
    showProgress?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
    trophy: Trophy,
    award: Award,
    star: Star,
    flame: Flame,
    target: Target,
    zap: Zap,
    crown: Crown,
    medal: Medal
};

const colorMap = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-green-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-rose-500'
};

const rarityBorder = {
    common: 'border-slate-600',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-amber-500 shadow-lg shadow-amber-500/50'
};

export function AchievementBadge({ achievement, showProgress = true, size = 'md' }: AchievementBadgeProps) {
    const Icon = iconMap[achievement.icon];
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20',
        lg: 'w-32 h-32'
    };

    return (
        <div className="relative group">
            <div
                className={`
                    ${sizeClasses[size]} rounded-2xl border-2 
                    ${rarityBorder[achievement.rarity]}
                    ${achievement.unlocked
                        ? `bg-gradient-to-br ${colorMap[achievement.color]}`
                        : 'bg-slate-800/50 opacity-40'
                    }
                    flex items-center justify-center
                    transition-all duration-300 hover:scale-110
                    ${achievement.unlocked && 'animate-pulse-slow'}
                `}
            >
                <Icon className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-10 h-10' : 'w-16 h-16'} text-white`} />

                {achievement.rarity === 'legendary' && achievement.unlocked && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/20 to-transparent animate-pulse" />
                )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="glass-card p-3 rounded-lg min-w-[200px] text-center">
                    <h4 className="font-bold text-white mb-1">{achievement.title}</h4>
                    <p className="text-xs text-slate-400 mb-2">{achievement.description}</p>

                    {showProgress && !achievement.unlocked && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Progress</span>
                                <span className="text-amber-400">{achievement.current}/{achievement.requirement}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full bg-gradient-to-r ${colorMap[achievement.color]} transition-all duration-500`}
                                    style={{ width: `${Math.min((achievement.current / achievement.requirement) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-emerald-400 mt-2">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                    )}

                    <div className="mt-2 text-xs">
                        <span className={`
                            px-2 py-0.5 rounded-full
                            ${achievement.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' :
                                achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                                    achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-slate-500/20 text-slate-400'}
                        `}>
                            {achievement.rarity.toUpperCase()}
                        </span>
                        {achievement.unlocked && (
                            <span className="ml-2 text-amber-400">+{achievement.xpReward} XP</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AchievementsList({ achievements }: { achievements: Achievement[] }) {
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const filtered = achievements.filter(a => {
        if (filter === 'unlocked' && !a.unlocked) return false;
        if (filter === 'locked' && a.unlocked) return false;
        if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
        return true;
    });

    const stats = {
        total: achievements.length,
        unlocked: achievements.filter(a => a.unlocked).length,
        totalXP: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0)
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-white">{stats.unlocked}/{stats.total}</div>
                    <div className="text-xs text-slate-400">Achievements</div>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-amber-400">{stats.totalXP}</div>
                    <div className="text-xs text-slate-400">Total XP</div>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                        {Math.round((stats.unlocked / stats.total) * 100)}%
                    </div>
                    <div className="text-xs text-slate-400">Complete</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unlocked')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === 'unlocked' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    Unlocked
                </button>
                <button
                    onClick={() => setFilter('locked')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === 'locked' ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    Locked
                </button>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {filtered.map(achievement => (
                    <AchievementBadge key={achievement.id} achievement={achievement} size="md" />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No achievements found
                </div>
            )}
        </div>
    );
}

// Achievement unlock notification
export function AchievementUnlockNotification({ achievement, onClose }: {
    achievement: Achievement;
    onClose: () => void;
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-500">
            <div className={`
                glass-card rounded-2xl p-6 border-2 ${rarityBorder[achievement.rarity]}
                min-w-[300px] max-w-md
                ${achievement.rarity === 'legendary' && 'animate-pulse-glow'}
            `}>
                <div className="flex items-start gap-4">
                    <AchievementBadge achievement={achievement} showProgress={false} size="md" />

                    <div className="flex-1">
                        <div className="text-xs text-amber-400 font-semibold mb-1">
                            🎉 ACHIEVEMENT UNLOCKED!
                        </div>
                        <h3 className="font-bold text-white mb-1">{achievement.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                        <div className="text-xs text-amber-400">+{achievement.xpReward} XP</div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-400"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

// Pre-defined achievements
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_message',
        title: 'First Steps',
        description: 'Send your first message',
        icon: 'star',
        category: 'conversationalist',
        requirement: 1,
        current: 0,
        color: 'blue',
        rarity: 'common',
        unlocked: false,
        xpReward: 10
    },
    {
        id: 'conversationalist',
        title: 'Conversationalist',
        description: 'Send 50 messages',
        icon: 'award',
        category: 'conversationalist',
        requirement: 50,
        current: 0,
        color: 'emerald',
        rarity: 'rare',
        unlocked: false,
        xpReward: 100
    },
    {
        id: 'chatterbox',
        title: 'Chatterbox',
        description: 'Send 200 messages',
        icon: 'trophy',
        category: 'conversationalist',
        requirement: 200,
        current: 0,
        color: 'purple',
        rarity: 'epic',
        unlocked: false,
        xpReward: 500
    },
    {
        id: 'polyglot',
        title: 'Polyglot',
        description: 'Practice all 8 languages',
        icon: 'crown',
        category: 'explorer',
        requirement: 8,
        current: 0,
        color: 'amber',
        rarity: 'legendary',
        unlocked: false,
        xpReward: 1000
    },
    {
        id: 'week_warrior',
        title: '7 Day Streak',
        description: 'Practice for 7 days straight',
        icon: 'flame',
        category: 'dedicated',
        requirement: 7,
        current: 0,
        color: 'red',
        rarity: 'rare',
        unlocked: false,
        xpReward: 200
    },
    {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Get 10 messages with no corrections',
        icon: 'target',
        category: 'perfectionist',
        requirement: 10,
        current: 0,
        color: 'emerald',
        rarity: 'epic',
        unlocked: false,
        xpReward: 300
    },
    {
        id: 'vocabulary_master',
        title: 'Vocabulary Master',
        description: 'Learn 100 new words',
        icon: 'medal',
        category: 'perfectionist',
        requirement: 100,
        current: 0,
        color: 'blue',
        rarity: 'epic',
        unlocked: false,
        xpReward: 400
    },
    {
        id: 'speed_learner',
        title: 'Speed Learner',
        description: 'Complete 5 scenarios in one day',
        icon: 'zap',
        category: 'explorer',
        requirement: 5,
        current: 0,
        color: 'amber',
        rarity: 'rare',
        unlocked: false,
        xpReward: 150
    }
];
