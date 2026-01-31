/**
 * Progress Tracking & Analytics Component
 */

'use client';

import React from 'react';
import { TrendingUp, Award, Flame, Target, Calendar } from 'lucide-react';
import { Message } from '@/types/languageTypes';

interface ProgressStats {
    totalMessages: number;
    correctionsReceived: number;
    wordsLearned: number;
    streak: number;
    practiceTime: number; // in minutes
}

interface ProgressPanelProps {
    messages: Message[];
    streak?: number;
}

export function ProgressPanel({ messages, streak = 0 }: ProgressPanelProps) {
    const stats = calculateStats(messages);

    return (
        <div className="glass-card rounded-xl p-6 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white">Your Progress</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Messages */}
                <StatCard
                    icon={<Target className="w-4 h-4" />}
                    label="Messages"
                    value={stats.totalMessages}
                    color="blue"
                />

                {/* Corrections */}
                <StatCard
                    icon={<Award className="w-4 h-4" />}
                    label="Corrections"
                    value={stats.correctionsReceived}
                    color="amber"
                />

                {/* Words Learned */}
                <StatCard
                    icon={<Calendar className="w-4 h-4" />}
                    label="Words"
                    value={stats.wordsLearned}
                    color="emerald"
                />

                {/* Streak */}
                <StatCard
                    icon={<Flame className="w-4 h-4" />}
                    label="Streak"
                    value={`${streak}d`}
                    color="red"
                />
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Session Progress</span>
                    <span className="text-xs font-semibold text-amber-400">
                        {stats.totalMessages} messages
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((stats.totalMessages / 20) * 100, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    {20 - stats.totalMessages > 0 ? `${20 - stats.totalMessages} more to reach goal` : 'Goal reached! 🎉'}
                </p>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'blue' | 'amber' | 'emerald' | 'red';
}) {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        red: 'bg-red-500/10 text-red-400 border-red-500/30'
    };

    return (
        <div className="glass-card-light p-3 rounded-lg">
            <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
        </div>
    );
}

function calculateStats(messages: Message[]): ProgressStats {
    const userMessages = messages.filter(m => m.role === 'user');
    const coachMessages = messages.filter(m => m.role === 'coach');

    const correctionsReceived = coachMessages.filter(
        m => m.feedback?.correction
    ).length;

    const wordsLearned = coachMessages.filter(
        m => m.feedback?.wordOfTheDay
    ).length;

    return {
        totalMessages: userMessages.length,
        correctionsReceived,
        wordsLearned,
        streak: 0,
        practiceTime: Math.ceil(messages.length * 1.5) // Rough estimate
    };
}
