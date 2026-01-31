import React, { memo } from 'react';
import { Lock, CheckCircle, Circle, PlayCircle, Clock } from 'lucide-react';
import { Module } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { useSound } from '@/lib/sound';
import { triggerHaptic, HapticPatterns } from '@/lib/haptics';

interface ModuleCardProps {
    module: Module;
    isActive: boolean;
    isCompleted: boolean;
    isLocked: boolean;
    onClick: () => void;
}

export const ModuleCard = memo(function ModuleCard({ module, isActive, isCompleted, isLocked, onClick }: ModuleCardProps) {
    const { play } = useSound();

    const handleClick = () => {
        if (isLocked) {
            play('lock');
            triggerHaptic(HapticPatterns.error);
        } else {
            play('click');
            triggerHaptic(HapticPatterns.light);
            onClick();
        }
    };

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => !isLocked && play('hover')}
            className={cn(
                "relative p-5 rounded-2xl border transition-all duration-500 group cursor-pointer overflow-hidden",
                isActive
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/50 shadow-2xl shadow-amber-900/10 ring-1 ring-amber-500/10 scale-[1.02]"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl",
                isLocked && "opacity-60 cursor-not-allowed hover:bg-slate-900/40 hover:border-slate-800 hover:translate-y-0 hover:shadow-none bg-slate-900/20"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "text-xs font-bold uppercase tracking-wider",
                            isActive ? "text-amber-500" : "text-slate-500"
                        )}>
                            Day {module.id}
                        </span>
                        {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                    </div>

                    <h3 className={cn(
                        "font-bold text-lg mb-2 transition-colors",
                        isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                    )}>
                        {module.title}
                    </h3>

                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {module.summary}
                    </p>

                    {module.readTime && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{module.readTime} min read</span>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 mt-1">
                    {isLocked ? (
                        <Lock className="w-5 h-5 text-slate-600" />
                    ) : isActive ? (
                        <PlayCircle className="w-6 h-6 text-amber-500 animate-pulse" />
                    ) : isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </div>
                    ) : (
                        <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                    )}
                </div>
            </div>

            {/* ProgressBar for active modules could go here in v2 */}
        </div>
    );
});
