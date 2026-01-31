import React from 'react';
import { Shield, Flame, Trophy } from 'lucide-react';

interface EnhancedHeaderProps {
    completionPercentage: number;
    currentStreak: number;
    completedCount: number;
    totalCount: number;
}

export function EnhancedHeader({
    completionPercentage,
    currentStreak,
    completedCount,
    totalCount
}: EnhancedHeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
            <div className="container mx-auto px-4">
                {/* Main header */}
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Shield className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-100 tracking-tight">The Stoic Dad</h1>
                            <p className="text-xs text-slate-400">Master yourself, lead your family</p>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
                            <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-amber-500' : 'text-slate-600'}`} />
                            <span className="text-sm font-medium text-slate-300">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
                            <Trophy className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-slate-300">{completedCount}/{totalCount}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="pb-2">
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
