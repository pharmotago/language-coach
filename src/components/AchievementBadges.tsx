import React from 'react';
import { Trophy, Flame, Brain, Target, Award, Crown, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    unlocked: boolean;
    progress?: number;
    goal?: number;
}

interface AchievementBadgesProps {
    completedModules: number[];
    currentStreak: number;
    longestStreak: number;
}

export function AchievementBadges({ completedModules, currentStreak, longestStreak }: AchievementBadgesProps) {
    const achievements: Achievement[] = [
        {
            id: 'first-step',
            name: 'First Step',
            description: 'Complete your first module',
            icon: Target,
            unlocked: completedModules.length >= 1
        },
        {
            id: 'habit-former',
            name: 'Habit Former',
            description: 'Maintain a 3-day streak',
            icon: Flame,
            unlocked: currentStreak >= 3
        },
        {
            id: 'week-warrior',
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: Zap,
            unlocked: currentStreak >= 7
        },
        {
            id: 'stoic-master',
            name: 'Stoic Master',
            description: 'Complete all 10 modules',
            icon: Crown,
            unlocked: completedModules.length === 10,
            progress: completedModules.length,
            goal: 10
        },
        {
            id: 'virtue-scholar',
            name: 'Virtue Scholar',
            description: 'Complete all 4 virtue modules',
            icon: Brain,
            unlocked: [7, 8, 9, 10].every(id => completedModules.includes(id))
        },
        {
            id: 'dedicated-dad',
            name: 'Dedicated Dad',
            description: 'Achieve a 30-day streak',
            icon: Shield,
            unlocked: longestStreak >= 30,
            progress: Math.min(longestStreak, 30),
            goal: 30
        }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Achievements
                </h3>
                <div className="text-sm text-slate-400">
                    {unlockedCount} / {achievements.length}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    const showProgress = !achievement.unlocked && achievement.progress !== undefined;

                    return (
                        <div
                            key={achievement.id}
                            className={cn(
                                "p-4 rounded-xl border transition-all duration-300",
                                achievement.unlocked
                                    ? "bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/10"
                                    : "bg-slate-950/50 border-slate-800 opacity-60"
                            )}
                        >
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className={cn(
                                    "p-3 rounded-full",
                                    achievement.unlocked ? "bg-amber-500/20" : "bg-slate-800"
                                )}>
                                    <Icon className={cn(
                                        "w-6 h-6",
                                        achievement.unlocked ? "text-amber-500" : "text-slate-600"
                                    )} />
                                </div>

                                <div>
                                    <h4 className={cn(
                                        "font-semibold text-sm mb-1",
                                        achievement.unlocked ? "text-white" : "text-slate-500"
                                    )}>
                                        {achievement.name}
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-tight">
                                        {achievement.description}
                                    </p>

                                    {showProgress && (
                                        <div className="mt-2">
                                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500/50 transition-all duration-500"
                                                    style={{ width: `${(achievement.progress! / achievement.goal!) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {achievement.progress} / {achievement.goal}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {achievement.unlocked && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                                        <Award className="w-3 h-3 text-emerald-400" />
                                        <span className="text-xs font-medium text-emerald-400">Unlocked</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
