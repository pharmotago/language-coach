import { Sparkles } from 'lucide-react';

interface CoachFeedbackProps {
    feedback: string;
    targetLanguageName: string;
}

export function CoachFeedback({ feedback }: CoachFeedbackProps) {
    if (!feedback) return null;

    return (
        <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-emerald-200 transition-all duration-300">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono text-emerald-600 tracking-widest uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                        Tutor Note
                    </span>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                    {feedback}
                </p>
            </div>
        </div>
    );
}
