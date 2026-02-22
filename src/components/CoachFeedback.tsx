/**
 * Coach Feedback Component - Display simple string feedback
 */

'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CoachFeedbackProps {
    feedback: string;
    targetLanguageName: string;
}

export function CoachFeedback({ feedback, targetLanguageName }: CoachFeedbackProps) {
    if (!feedback) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 w-full">
            <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                        Correction Notes
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        {feedback}
                    </p>
                </div>
            </div>
        </div>
    );
}
