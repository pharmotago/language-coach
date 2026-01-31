'use client';

import React, { useState } from 'react';
import { BookOpen, Brain, Check, ChevronRight, RefreshCw, X } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { generateLesson } from '@/lib/aiLesson';
import { Lesson, QuizQuestion } from '@/types/languageTypes';
import { useSound } from '@/contexts/SoundContext';
import { triggerHaptic, HapticPatterns } from '@/lib/haptics';

export function LessonGenerator() {
    const { targetLanguage, skillLevel } = useLanguageStore();
    const { playSound } = useSound();

    const [isLoading, setIsLoading] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [inputAnswer, setInputAnswer] = useState('');

    const topics = [
        'Ordering Food', 'Travel Essentials', 'Making Friends',
        'Asking Directions', 'Emergency', 'Business Protocol',
        'Flirting', 'Pop Culture', 'Slang & Idioms'
    ];

    const handleGenerate = async (topic: string) => {
        if (!targetLanguage || !skillLevel) return;

        setIsLoading(true);
        setCurrentLesson(null);
        setShowResults(false);
        setScore(0);
        setActiveQuestionIndex(0);

        try {
            const lesson = await generateLesson(topic, targetLanguage, skillLevel);
            setCurrentLesson(lesson);
            playSound('receive');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (answer: string) => {
        if (isAnswered || !currentLesson) return;

        const currentQuestion = currentLesson.quiz.questions[activeQuestionIndex];
        const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();

        setSelectedOption(answer);
        setIsAnswered(true);

        if (isCorrect) {
            setScore(p => p + 1);
            playSound('success');
            triggerHaptic(HapticPatterns.success);
        } else {
            playSound('error');
            triggerHaptic(HapticPatterns.error);
        }
    };

    const nextQuestion = () => {
        if (!currentLesson) return;

        if (activeQuestionIndex < currentLesson.quiz.questions.length - 1) {
            setActiveQuestionIndex(p => p + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setInputAnswer('');
            playSound('click');
        } else {
            setShowResults(true);
            playSound('unlock'); // Fanfare for completion
        }
    };

    if (showResults && currentLesson) {
        const percentage = Math.round((score / currentLesson.quiz.questions.length) * 100);
        return (
            <div className="max-w-xl mx-auto mt-8 animate-in fade-in zoom-in duration-500">
                <div className="glass-card p-8 rounded-2xl text-center border-amber-500/30 border">
                    <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Brain className="w-10 h-10 text-amber-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
                    <p className="text-slate-400 mb-6">{currentLesson.title}</p>

                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-8">
                        {percentage}%
                    </div>

                    <button
                        onClick={() => setCurrentLesson(null)}
                        className="btn-primary w-full py-4 text-lg"
                    >
                        Start New Lesson
                    </button>
                </div>
            </div>
        );
    }

    if (currentLesson) {
        const question = currentLesson.quiz.questions[activeQuestionIndex];
        const progress = ((activeQuestionIndex) / currentLesson.quiz.questions.length) * 100;

        return (
            <div className="max-w-2xl mx-auto mt-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setCurrentLesson(null)}
                        className="text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-slate-400 text-sm font-mono">
                        {activeQuestionIndex + 1}/{currentLesson.quiz.questions.length}
                    </span>
                </div>

                <div className="glass-card p-6 rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-center animate-in slide-in-from-right duration-300 key={activeQuestionIndex}">
                    <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
                        {question.question}
                    </h3>

                    {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-3 w-full max-w-md">
                            {question.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={isAnswered}
                                    className={`w-full p-4 rounded-xl text-left transition-all border ${isAnswered
                                            ? opt === question.correctAnswer
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100'
                                                : opt === selectedOption
                                                    ? 'bg-red-500/20 border-red-500 text-red-100'
                                                    : 'bg-slate-800/50 border-transparent opacity-50'
                                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-amber-500/50 text-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{opt}</span>
                                        {isAnswered && opt === question.correctAnswer && <Check className="w-5 h-5" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {(question.type === 'fill-blank' || question.type === 'translate') && (
                        <div className="w-full max-w-md space-y-4">
                            <input
                                type="text"
                                value={inputAnswer}
                                onChange={(e) => setInputAnswer(e.target.value)}
                                disabled={isAnswered}
                                onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleAnswer(inputAnswer)}
                                placeholder="Type your answer..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                            />
                            {!isAnswered && (
                                <button
                                    onClick={() => handleAnswer(inputAnswer)}
                                    disabled={!inputAnswer.trim()}
                                    className="btn-primary w-full py-3"
                                >
                                    Check Answer
                                </button>
                            )}
                        </div>
                    )}

                    {isAnswered && (
                        <div className={`mt-8 p-4 rounded-xl w-full max-w-md text-left animate-in fade-in slide-in-from-bottom-2 ${selectedOption === question.correctAnswer
                                ? 'bg-emerald-500/10 border border-emerald-500/30'
                                : 'bg-red-500/10 border border-red-500/30'
                            }`}>
                            <p className={`font-bold mb-1 ${selectedOption === question.correctAnswer ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {selectedOption === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                            </p>
                            <p className="text-slate-300 text-sm">
                                {question.explanation}
                            </p>
                            <button
                                onClick={nextQuestion}
                                className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                {activeQuestionIndex < currentLesson.quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Dashboard View
    return (
        <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-2">AI Lesson Generator</h2>
            <p className="text-slate-400 mb-8">
                Generate personalized micro-lessons instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => handleGenerate(topic)}
                        disabled={isLoading}
                        className="glass-card p-6 rounded-xl text-left hover:border-amber-500/50 hover:bg-slate-800/80 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-lg bg-slate-800 group-hover:bg-amber-500/20 flex items-center justify-center mb-4 transition-colors">
                            <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-amber-400" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1">{topic}</h3>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400">
                            {targetLanguage?.name} • 5 min
                        </p>
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="text-center">
                        <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                        <p className="text-white font-medium">Generating Lesson...</p>
                        <p className="text-slate-400 text-sm mt-2">Designing quiz questions for {targetLanguage?.name}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
