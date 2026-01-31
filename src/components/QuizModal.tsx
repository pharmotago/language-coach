import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Module } from '@/lib/schemas';
import { X, Check, AlertCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizModalProps {
    module: Module;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function QuizModal({ module, isOpen, onClose, onSuccess }: QuizModalProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (!isOpen) return null;

    // For the final exam, we might have multiple questions. 
    // For standard modules, it's usually one, but the schema supports many.
    // For standard modules, it's usually one, but the schema supports many.
    // We'll simplisticly handle the first incomplete question or loop through them in a v2.

    // BACKWARDS COMPATIBILITY: Check for legacy 'quiz' object if 'questions' is missing
    let questions = module.content.questions || [];

    // If no questions array but legacy quiz object exists, convert it
    if (questions.length === 0 && module.content.quiz) {
        questions = [{
            question: module.content.quiz.question,
            options: module.content.quiz.options,
            correctAnswer: module.content.quiz.correctAnswer,
            explanation: "Review the lesson content to understand the correct principle."
        } as any];
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleSubmit = () => {
        if (selectedOption === null) return;

        setHasSubmitted(true);
        const correct = selectedOption === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            if (isLastQuestion) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#f59e0b', '#fbbf24', '#ffffff']
                });
                setTimeout(() => {
                    onSuccess();
                    resetState();
                }, 2000);
            } else {
                // Move to next question after delay
                setTimeout(() => {
                    setCurrentQuestionIndex(prev => prev + 1);
                    resetState();
                }, 1500);
            }
        } else {
            // Shake effect handled by css class 'animate-shake' on the container if we added it
        }
    };

    const resetState = () => {
        setSelectedOption(null);
        setHasSubmitted(false);
        setIsCorrect(false);
    };

    // If no questions (like an intro module), just pass
    if (!currentQuestion) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 p-8 rounded-2xl max-w-md w-full text-center border border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-4">Module Complete</h3>
                    <button onClick={onSuccess} className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold">Continue</button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Knowledge Check
                        </h3>
                        {questions.length > 1 && (
                            <div className="flex gap-1 mt-2">
                                {questions.map((_, i) => (
                                    <div key={i} className={cn(
                                        "h-1 w-6 rounded-full",
                                        i < currentQuestionIndex ? "bg-emerald-500" : i === currentQuestionIndex ? "bg-amber-500" : "bg-slate-800"
                                    )} />
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto">
                    <p className="text-lg text-slate-200 font-medium mb-6 whitespace-pre-line">
                        {currentQuestion.question}
                    </p>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedOption === idx;
                            let stateStyles = "border-slate-700 bg-slate-800/50 hover:bg-slate-800";

                            if (hasSubmitted && isSelected) {
                                stateStyles = isCorrect
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                                    : "border-red-500 bg-red-500/10 text-red-100";
                            } else if (isSelected) {
                                stateStyles = "border-amber-500 bg-amber-500/10 text-amber-100";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !hasSubmitted && setSelectedOption(idx)}
                                    disabled={hasSubmitted}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                                        stateStyles
                                    )}
                                >
                                    <span className="flex-1">{option}</span>
                                    {hasSubmitted && isSelected && (
                                        isCorrect ? <Check className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {hasSubmitted && !isCorrect && (
                        <div className="mt-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                            <p className="font-bold mb-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Incorrect
                            </p>
                            Try again. Stoics learn from their errors.
                            <button
                                onClick={resetState}
                                className="mt-3 text-red-400 hover:text-red-300 underline text-xs block"
                            >
                                Retry Question
                            </button>
                        </div>
                    )}

                    {hasSubmitted && isCorrect && currentQuestion.explanation && (
                        <div className="mt-6 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-emerald-200 text-sm animate-in fade-in slide-in-from-top-2">
                            <p className="font-bold mb-1 flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Correct
                            </p>
                            {currentQuestion.explanation}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    <button
                        onClick={handleSubmit}
                        disabled={selectedOption === null || (hasSubmitted && isCorrect)}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-colors"
                    >
                        {hasSubmitted ? (isCorrect ? (isLastQuestion ? "Completing..." : "Next Question") : "Submitted") : "Submit Answer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
