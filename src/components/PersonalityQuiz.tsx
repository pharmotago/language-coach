"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Brain, Shield, Scale, Target } from "lucide-react";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";

export function PersonalityQuiz() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [result, setResult] = useState<string | null>(null);

    const questions = [
        { q: "When chaos erupts at home, you...", options: ["Take charge immediately", "Observe and assess", "Stay calm and moderate"] },
        { q: "What is your primary goal as a father?", options: ["Protection", "Wisdom", "Legacy"] },
    ];

    const results = [
        { title: "The Guardian (Courage)", desc: "Your strength is your shield. You lead by action.", icon: Shield },
        { title: "The Sage (Wisdom)", desc: "Your strength is your mind. You lead by reason.", icon: Brain },
        { title: "The Just (Justice)", desc: "Your strength is your fairness. You lead by example.", icon: Scale }
    ];

    const handleNext = (idx: number) => {
        triggerHaptic(HapticPatterns.light);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setResult(results[idx].title);
        }
    };

    return (
        <div className="mb-12">
            {!isOpen ? (
                <button
                    onClick={() => { triggerHaptic(HapticPatterns.medium); setIsOpen(true); }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 p-8 rounded-3xl flex items-center justify-between group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="p-4 bg-white/20 rounded-2xl">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Discover Your Stoic Archetype</h3>
                            <p className="text-amber-100 text-sm font-medium">Take the 30-second assessment</p>
                        </div>
                    </div>
                    <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-2 transition-transform" />
                </button>
            ) : (
                <div className="bg-slate-800 border-2 border-amber-500 p-8 rounded-3xl min-h-[300px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key={`step-${step}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 block">Question {step + 1} of 2</span>
                                <h3 className="text-2xl font-bold text-slate-100 mb-8">{questions[step].q}</h3>
                                <div className="grid gap-4">
                                    {questions[step].options.map((opt, i) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleNext(i)}
                                            className="w-full p-4 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-left text-slate-300 font-medium transition-all hover:border-amber-500/50"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="w-10 h-10 text-amber-500" />
                                </div>
                                <h3 className="text-3xl font-black text-amber-50 uppercase tracking-tighter mb-2">{result}</h3>
                                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                    You are naturally predisposed to this Stoic virtue. Focus on the relevant modules.
                                </p>
                                <button
                                    onClick={() => { setIsOpen(false); setStep(0); setResult(null); }}
                                    className="text-amber-500 font-bold uppercase tracking-widest text-xs underline"
                                >
                                    Back to Training
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
