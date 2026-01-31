import React from 'react';
import { Module } from '@/lib/schemas';
import { ArrowLeft, BookOpen, Brain, Flame } from 'lucide-react';

interface LessonViewProps {
    module: Module;
    onBack: () => void;
    onTakeQuiz: () => void;
}

export function LessonView({ module, onBack, onTakeQuiz }: LessonViewProps) {
    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Path
            </button>

            <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <BookOpen className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{module.title}</h2>
                        <p className="text-slate-400">{module.summary}</p>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="mb-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center gap-4">
                    <div className="p-2 bg-amber-500/10 rounded-full">
                        <svg className="w-6 h-6 text-amber-500 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Audio Guide</div>
                        <audio
                            controls
                            className="w-full h-8"
                            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder
                        />
                    </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none mb-8">
                    <div className="whitespace-pre-line text-slate-300 leading-relaxed font-serif text-lg tracking-wide selection:bg-amber-500/30 selection:text-amber-100">
                        {module.content.full_lesson_content}
                    </div>
                </div>

                {module.content.challenge && (
                    <div className="bg-slate-900/80 rounded-xl p-6 border border-amber-900/30 mb-8">
                        <div className="flex items-center gap-2 mb-3 text-amber-500 font-semibold">
                            <Flame className="w-5 h-5" />
                            <span>Daily Challenge</span>
                        </div>
                        <p className="text-amber-100/90 italic">
                            "{module.content.challenge}"
                        </p>
                    </div>
                )}

                <button
                    onClick={onTakeQuiz}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Brain className="w-5 h-5" />
                    Take Knowledge Check
                </button>
            </div>
        </div>
    );
}
