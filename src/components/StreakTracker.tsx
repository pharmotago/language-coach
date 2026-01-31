/**
 * Streak Tracking System with Calendar Heatmap
 */

'use client';

import React from 'react';
import { Flame, Calendar as CalendarIcon, Award } from 'lucide-react';

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastPracticeDate: Date | null;
    practiceHistory: Date[]; // Array of dates when user practiced
    streakFreezes: number; // Number of streak freeze items available
}

export function calculateStreak(practiceHistory: Date[]): { current: number; longest: number } {
    if (practiceHistory.length === 0) return { current: 0, longest: 0 };

    // Sort dates in descending order
    const sortedDates = [...practiceHistory]
        .map(d => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastPractice = new Date(sortedDates[0]);
    lastPractice.setHours(0, 0, 0, 0);

    // Check if current streak is active (practiced today or yesterday)
    if (lastPractice.getTime() === today.getTime() || lastPractice.getTime() === yesterday.getTime()) {
        currentStreak = 1;

        // Count consecutive days
        for (let i = 1; i < sortedDates.length; i++) {
            const current = new Date(sortedDates[i]);
            current.setHours(0, 0, 0, 0);

            const previous = new Date(sortedDates[i - 1]);
            previous.setHours(0, 0, 0, 0);

            const dayDiff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

            if (dayDiff === 1) {
                currentStreak++;
            } else if (dayDiff > 1) {
                break;
            }
        }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
        const current = new Date(sortedDates[i]);
        current.setHours(0, 0, 0, 0);

        const previous = new Date(sortedDates[i - 1]);
        previous.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            tempStreak++;
        } else if (dayDiff > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { current: currentStreak, longest: longestStreak };
}

export function StreakDisplay({ streakData }: { streakData: StreakData }) {
    const isActiveToday = streakData.lastPracticeDate && isToday(new Date(streakData.lastPracticeDate));

    return (
        <div className="glass-card rounded-2xl p-6 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center
                        ${streakData.currentStreak > 0
                            ? 'bg-gradient-to-br from-orange-500 to-red-500 animate-pulse-slow'
                            : 'bg-slate-800'
                        }
                    `}>
                        <Flame className={`w-8 h-8 ${streakData.currentStreak > 0 ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white">{streakData.currentStreak}</span>
                            <span className="text-sm text-slate-400">day streak</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            {isActiveToday ? "You practiced today! 🎉" : "Practice today to continue your streak!"}
                        </p>
                    </div>
                </div>

                {streakData.streakFreezes > 0 && (
                    <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">❄️ {streakData.streakFreezes}</div>
                        <div className="text-xs text-slate-500">Streak freezes</div>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{streakData.longestStreak}</div>
                    <div className="text-xs text-slate-500">Longest</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400">{streakData.practiceHistory.length}</div>
                    <div className="text-xs text-slate-500">Total Days</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                        {Math.round((streakData.practiceHistory.length / 365) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">Year Progress</div>
                </div>
            </div>

            {/* Milestones */}
            <StreakMilestones currentStreak={streakData.currentStreak} longestStreak={streakData.longestStreak} />
        </div>
    );
}

function StreakMilestones({ currentStreak, longestStreak }: {
    currentStreak: number;
    longestStreak: number;
}) {
    const milestones = [
        { days: 7, icon: '🔥', label: 'Week Warrior', reward: '50 XP' },
        { days: 30, icon: '🌟', label: 'Month Master', reward: '200 XP' },
        { days: 100, icon: '💎', label: 'Century Club', reward: '500 XP' },
        { days: 365, icon: '👑', label: 'Year Champion', reward: '1000 XP' }
    ];

    return (
        <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Streak Milestones
            </h4>
            <div className="space-y-2">
                {milestones.map(milestone => {
                    const achieved = longestStreak >= milestone.days;
                    const progress = Math.min((currentStreak / milestone.days) * 100, 100);

                    return (
                        <div
                            key={milestone.days}
                            className={`
                                flex items-center gap-3 p-2 rounded-lg transition-all
                                ${achieved ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-900/30'}
                            `}
                        >
                            <div className="text-2xl">{milestone.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-semibold ${achieved ? 'text-amber-400' : 'text-slate-400'}`}>
                                        {milestone.label}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {achieved ? '✓ Achieved!' : `${milestone.days} days`}
                                    </span>
                                </div>
                                {!achieved && (
                                    <div className="w-full bg-slate-800 rounded-full h-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-amber-400 font-semibold">{milestone.reward}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function CalendarHeatmap({ practiceHistory }: { practiceHistory: Date[] }) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // Last 365 days

    // Create array of last 365 days
    const days: Date[] = [];
    for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        days.push(date);
    }

    // Count practice sessions per day
    const practiceCounts = new Map<string, number>();
    practiceHistory.forEach(date => {
        const dateStr = formatDateKey(new Date(date));
        practiceCounts.set(dateStr, (practiceCounts.get(dateStr) || 0) + 1);
    });

    // Group by weeks
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Practice History
                </h3>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-slate-800" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-900/50" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-700/70" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                    </div>
                    <span className="text-slate-500">More</span>
                </div>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((date, dayIndex) => {
                            const dateStr = formatDateKey(date);
                            const count = practiceCounts.get(dateStr) || 0;
                            const intensity = Math.min(count, 4);

                            const colors = [
                                'bg-slate-800 hover:bg-slate-700',
                                'bg-emerald-900/50 hover:bg-emerald-900/70',
                                'bg-emerald-700/70 hover:bg-emerald-700',
                                'bg-emerald-500 hover:bg-emerald-600',
                                'bg-emerald-400 hover:bg-emerald-500'
                            ];

                            return (
                                <div
                                    key={dayIndex}
                                    className={`
                                        w-3 h-3 rounded-sm transition-all cursor-pointer
                                        ${colors[intensity]}
                                        group relative
                                    `}
                                    title={`${date.toLocaleDateString()}: ${count} ${count === 1 ? 'session' : 'sessions'}`}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        <div className="glass-card px-2 py-1 rounded text-xs whitespace-nowrap">
                                            <div className="font-semibold text-white">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                            <div className="text-slate-400">{count} {count === 1 ? 'session' : 'sessions'}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-4 text-xs text-slate-500 text-center">
                Last 365 days • {practiceHistory.length} total practice sessions
            </div>
        </div>
    );
}

function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
}

function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}
