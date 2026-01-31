import React from 'react';
import { Clock, Target, Book } from 'lucide-react';

interface ModulePreviewProps {
    title: string;
    summary: string;
    estimatedTime?: string;
    keyTakeaway?: string;
}

export function ModulePreview({ title, summary, estimatedTime = "10-15 min", keyTakeaway }: ModulePreviewProps) {
    return (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
            <div className="bg-slate-800 border border-amber-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                {/* Arrow */}
                <div className="absolute -top-2 left-8 w-4 h-4 bg-slate-800 border-l border-t border-amber-500/30 transform rotate-45" />

                <div className="relative space-y-3">
                    <div>
                        <h4 className="font-bold text-white mb-1">{title}</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{estimatedTime}</span>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                            <Book className="w-3 h-3" />
                            <span>1 Quiz</span>
                        </div>
                    </div>

                    {keyTakeaway && (
                        <div className="pt-2 border-t border-slate-700">
                            <div className="flex items-start gap-2">
                                <Target className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-amber-400 mb-0.5">Key Takeaway</p>
                                    <p className="text-xs text-slate-300">{keyTakeaway}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
