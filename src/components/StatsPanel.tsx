import React from 'react';
import { TrendingUp, Target, Award, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtueScore {
    virtue: string;
    score: number;
    color: string;
}

interface StatsPanelProps {
    completedModules: number[];
    totalModules: number;
    onShare?: () => void;
}

export function StatsPanel({ completedModules, totalModules, onShare }: StatsPanelProps) {
    const completionRate = (completedModules.length / totalModules) * 100;

    // Mock virtue scores based on completed modules
    // In a real implementation, this would track quiz performance per virtue
    const virtueScores: VirtueScore[] = [
        { virtue: 'Courage', score: completedModules.length >= 6 ? 85 : 0, color: 'text-red-500' },
        { virtue: 'Temperance', score: completedModules.length >= 7 ? 78 : 0, color: 'text-blue-500' },
        { virtue: 'Justice', score: completedModules.length >= 8 ? 92 : 0, color: 'text-purple-500' },
        { virtue: 'Wisdom', score: completedModules.length >= 9 ? 88 : 0, color: 'text-amber-500' },
    ];

    const averageScore = virtueScores.reduce((sum, v) => sum + v.score, 0) / virtueScores.filter(v => v.score > 0).length || 0;

    return (
        <div className="space-y-4">
            {/* Overall Stats */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Your Progress
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                        <Target className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {Math.round(completionRate)}%
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Completion</div>
                    </div>

                    <div className="text-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                        <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white mb-1">
                            {Math.round(averageScore)}
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Avg Score</div>
                    </div>
                </div>
            </div>

            {/* Virtue Breakdown */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Virtue Mastery
                </h3>

                {virtueScores.some(v => v.score > 0) ? (
                    <div className="space-y-3">
                        {virtueScores.map((virtue) => (
                            virtue.score > 0 && (
                                <div key={virtue.virtue}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={cn("font-medium", virtue.color)}>{virtue.virtue}</span>
                                        <span className="text-sm text-slate-400">{virtue.score}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                virtue.color.replace('text-', 'bg-')
                                            )}
                                            style={{ width: `${virtue.score}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 px-4 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
                        <Award className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm text-slate-400 font-medium">No virtues mastered yet.</p>
                        <p className="text-xs text-slate-500 mt-1">Complete module quizzes to reveal your archetype.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
