import React from 'react';
import { Shield, Flame, Brain, Heart, X } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 w-full max-w-2xl rounded-2xl border border-amber-500/30 shadow-2xl relative overflow-hidden">

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 bg-amber-500/10 rounded-full mb-4">
                            <Shield className="w-12 h-12 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Welcome, Stoic Dad</h2>
                        <p className="text-slate-300 text-lg">
                            You are about to embark on a journey to master the most important role you'll ever have.
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                            <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                                <Brain className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Learn Ancient Wisdom</h3>
                                <p className="text-sm text-slate-400">
                                    Apply 2,000-year-old Stoic principles to modern fatherhood challenges.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                            <div className="p-2 bg-emerald-500/10 rounded-lg flex-shrink-0">
                                <Flame className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Build Daily Discipline</h3>
                                <p className="text-sm text-slate-400">
                                    Track your streak and build consistency. Small daily actions create lasting change.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                            <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
                                <Heart className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Create Your Legacy</h3>
                                <p className="text-sm text-slate-400">
                                    Your children won't remember your words. They'll remember who you were in moments of pressure.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
                        <p className="text-amber-100 italic text-center text-lg">
                            "The impediment to action advances action. What stands in the way becomes the way."
                        </p>
                        <p className="text-amber-400/60 text-center text-sm mt-2">— Marcus Aurelius</p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-200" />
                        <button
                            onClick={onClose}
                            className="relative w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl flex items-center justify-center gap-2"
                        >
                            <Flame className="w-5 h-5" />
                            Begin Your Journey
                        </button>
                    </div>

                    <p className="text-center text-slate-500 text-sm mt-4">
                        Unlock modules sequentially by completing quizzes. Progress is saved automatically.
                    </p>
                </div>
            </div>
        </div>
    );
}
