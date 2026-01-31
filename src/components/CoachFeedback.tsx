/**
 * Coach Feedback Component - Display structured learning feedback
 */

'use client';

import React, { useState } from 'react';
import { AlertCircle, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Feedback } from '@/types/languageTypes';
import { cn } from '@/lib/utils';

interface CoachFeedbackProps {
    feedback: Feedback;
    targetLanguageName: string;
}

export function CoachFeedback({ feedback, targetLanguageName }: CoachFeedbackProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="glass-card rounded-xl overflow-hidden border-l-4 border-l-amber-500">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm text-slate-300">
                        Coach's Notes
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                    {/* Correction Section */}
                    {feedback.correction && (
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                                        Correction
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {feedback.correction}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Polish Section */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                                    Polish - Sound More Native
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {feedback.polish}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Word of the Day */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <BookOpen className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                                    Word of the Day
                                </h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-200">
                                        {feedback.wordOfTheDay.term}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {feedback.wordOfTheDay.translation}
                                    </p>
                                    <p className="text-xs text-slate-500 italic mt-1.5 pl-3 border-l-2 border-blue-500/30">
                                        {feedback.wordOfTheDay.usage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* General Tips (Optional) */}
                    {feedback.generalTips && (
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                💡 <span className="font-medium">Tip:</span> {feedback.generalTips}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
