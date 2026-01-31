/**
 * Advanced Analytics Dashboard
 */

'use client';

import React from 'react';
import { TrendingUp, BarChart3, PieChart, Clock, Target, Award } from 'lucide-react';
import { Message } from '@/types/languageTypes';

export interface AnalyticsData {
    messages: Message[];
    totalWords: number;
    totalCorrections: number;
    totalPracticeTime: number; // minutes
    startDate: Date;
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
    const insights = calculateInsights(data);

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={<BarChart3 className="w-5 h-5" />}
                    label="Total Messages"
                    value={insights.totalMessages}
                    change="+12% this week"
                    positive={true}
                />
                <MetricCard
                    icon={<Target className="w-5 h-5" />}
                    label="Accuracy"
                    value={`${insights.accuracyPercent}%`}
                    change="+5% improvement"
                    positive={true}
                />
                <MetricCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Practice Time"
                    value={`${Math.floor(data.totalPracticeTime / 60)}h`}
                    change={`${Math.floor(data.totalPracticeTime % 60)}m avg/day`}
                />
                <MetricCard
                    icon={<Award className="w-5 h-5" />}
                    label="Words Learned"
                    value={data.totalWords}
                    change="This month"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Progress Over Time */}
                <div className="glass-card rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Messages Per Day (Last 14 Days)
                    </h3>
                    <SimpleLineChart data={insights.messagesPerDay} />
                </div>

                {/* Error Breakdown */}
                <div className="glass-card rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-amber-400" />
                        Common Error Types
                    </h3>
                    <ErrorBreakdown errors={insights.errorTypes} />
                </div>
            </div>

            {/* Detailed Insights */}
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Learning Insights</h3>
                <div className="space-y-4">
                    <Insight
                        type="strength"
                        title="Your Strengths"
                        description={`You excel at ${insights.topStrength}. Keep it up!`}
                    />
                    <Insight
                        type="improvement"
                        title="Areas for Improvement"
                        description={`Focus on ${insights.improvementArea} to level up faster.`}
                    />
                    <Insight
                        type="tip"
                        title="Recommendation"
                        description={insights.recommendation}
                    />
                </div>
            </div>

            {/* Vocabulary Diversity */}
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Vocabulary Diversity</h3>
                <div className="space-y-3">
                    <DiversityBar label="Unique Words Used" value={insights.uniqueWords} max={500} color="blue" />
                    <DiversityBar label="Advanced Vocabulary" value={insights.advancedWords} max={100} color="purple" />
                    <DiversityBar label="Grammar Structures" value={insights.grammarStructures} max={50} color="emerald" />
                </div>
            </div>

            {/* Weekly Summary */}
            <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">This Week's Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SummaryStat label="Days Practiced" value={insights.weeklyStats.daysPracticed} total={7} />
                    <SummaryStat label="Messages Sent" value={insights.weeklyStats.messagesSent} />
                    <SummaryStat label="Time Spent" value={`${insights.weeklyStats.timeSpent}min`} />
                    <SummaryStat label="XP Earned" value={insights.weeklyStats.xpEarned} highlight />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, label, value, change, positive }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: string;
    positive?: boolean;
}) {
    return (
        <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            {change && (
                <div className={`text-xs ${positive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {change}
                </div>
            )}
        </div>
    );
}

function SimpleLineChart({ data }: { data: { label: string; value: number }[] }) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="space-y-2">
            {data.map((day, index) => (
                <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-12">{day.label}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-6 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-end pr-2 transition-all duration-500"
                            style={{ width: `${(day.value / maxValue) * 100}%` }}
                        >
                            {day.value > 0 && (
                                <span className="text-xs font-semibold text-white">{day.value}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ErrorBreakdown({ errors }: { errors: { type: string; count: number; color: string }[] }) {
    const total = errors.reduce((sum, e) => sum + e.count, 0);

    return (
        <div className="space-y-3">
            {errors.map((error, index) => {
                const percentage = total > 0 ? (error.count / total) * 100 : 0;
                return (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">{error.type}</span>
                            <span className="text-slate-500">{error.count} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className={`h-full rounded-full bg-${error.color}-500 transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Insight({ type, title, description }: {
    type: 'strength' | 'improvement' | 'tip';
    title: string;
    description: string;
}) {
    const icons = {
        strength: '💪',
        improvement: '📈',
        tip: '💡'
    };

    const colors = {
        strength: 'border-emerald-500/30 bg-emerald-500/5',
        improvement: 'border-amber-500/30 bg-amber-500/5',
        tip: 'border-blue-500/30 bg-blue-500/5'
    };

    return (
        <div className={`p-4 rounded-lg border ${colors[type]}`}>
            <div className="flex items-start gap-3">
                <span className="text-2xl">{icons[type]}</span>
                <div>
                    <h4 className="font-semibold text-white mb-1">{title}</h4>
                    <p className="text-sm text-slate-400">{description}</p>
                </div>
            </div>
        </div>
    );
}

function DiversityBar({ label, value, max, color }: {
    label: string;
    value: number;
    max: number;
    color: 'blue' | 'purple' | 'emerald';
}) {
    const percentage = (value / max) * 100;
    const colorClasses = {
        blue: 'from-blue-500 to-blue-400',
        purple: 'from-purple-500 to-purple-400',
        emerald: 'from-emerald-500 to-emerald-400'
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-400">{value} / {max}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}

function SummaryStat({ label, value, total, highlight = false }: {
    label: string;
    value: string | number;
    total?: number;
    highlight?: boolean;
}) {
    return (
        <div className={`text-center p-3 rounded-lg ${highlight ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-900/50'}`}>
            <div className={`text-2xl font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>
                {value}{total && `/${total}`}
            </div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
        </div>
    );
}

function calculateInsights(data: AnalyticsData) {
    const userMessages = data.messages.filter(m => m.role === 'user');
    const messagesWithCorrections = data.messages.filter(m => m.feedback?.correction);

    // Messages per day for last 14 days
    const messagesPerDay = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const value = Math.floor(Math.random() * 10); // Mock data
        return { label, value };
    });

    return {
        totalMessages: userMessages.length,
        accuracyPercent: Math.round(((userMessages.length - messagesWithCorrections.length) / Math.max(userMessages.length, 1)) * 100),
        messagesPerDay,
        errorTypes: [
            { type: 'Grammar', count: 15, color: 'red' },
            { type: 'Vocabulary', count: 8, color: 'amber' },
            { type: 'Pronunciation', count: 5, color: 'blue' },
            { type: 'Syntax', count: 12, color: 'purple' }
        ],
        uniqueWords: Math.min(data.totalWords * 2, 500),
        advancedWords: Math.min(data.totalWords * 0.3, 100),
        grammarStructures: Math.min(Math.floor(userMessages.length / 5), 50),
        topStrength: 'vocabulary retention',
        improvementArea: 'verb conjugations',
        recommendation: 'Try practicing more complex sentence structures with the intermediate scenarios.',
        weeklyStats: {
            daysPracticed: 5,
            messagesSent: 42,
            timeSpent: 180,
            xpEarned: 520
        }
    };
}
