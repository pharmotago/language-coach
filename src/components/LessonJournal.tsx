import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Module } from "@/types";
import { Save, CheckCircle2, Smile, Meh, Frown } from "lucide-react";
import { useCourseStore } from "@/store/useCourseStore";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface LessonJournalProps {
    module: Module;
    onNext: () => void;
    isExam?: boolean;
}

export function LessonJournal({ module, onNext, isExam }: LessonJournalProps) {
    const { journalEntries, saveJournalEntry } = useCourseStore();
    const existingEntry = journalEntries[module.id];

    // Support both legacy (string) and new (object) formats
    const initialContent = typeof existingEntry === 'string' ? existingEntry : existingEntry?.content || "";
    const initialMood = typeof existingEntry === 'string' ? 'neutral' : existingEntry?.mood || 'neutral';

    const [content, setContent] = useState(initialContent);
    const [mood, setMood] = useState(initialMood);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        triggerHaptic(HapticPatterns.medium);
        saveJournalEntry(module.id, content, mood);

        setTimeout(() => {
            setIsSaving(false);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        }, 800);
    };

    const moods = [
        { id: 'positive', icon: Smile, label: 'Focused', color: 'text-emerald-500' },
        { id: 'neutral', icon: Meh, label: 'Neutral', color: 'text-amber-500' },
        { id: 'negative', icon: Frown, label: 'Struggling', color: 'text-rose-500' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
        >
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-200">Reflect on Day {module.id}</h3>
                    <AnimatePresence>
                        {showSaved && (
                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center"
                            >
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Progress Saved
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mood Tracker */}
                <div className="mb-6">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">How are you feeling?</label>
                    <div className="flex gap-4">
                        {moods.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => { triggerHaptic(HapticPatterns.light); setMood(m.id); }}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all flex-1",
                                    mood === m.id
                                        ? `bg-slate-800 border-amber-500/50 ${m.color}`
                                        : "bg-slate-900/50 border-transparent text-slate-500 hover:bg-slate-800/50"
                                )}
                            >
                                <m.icon className="w-6 h-6" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative group">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What did you learn today? How will you apply this to your family?"
                        className="w-full h-48 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition-all resize-none"
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-600 group-focus-within:text-slate-400">
                        {content.split(/\s+/).filter(Boolean).length} words
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <p className="text-xs text-slate-500 italic max-w-[200px]">
                        "He who is brave is free." — Seneca
                    </p>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !content.trim()}
                        className={cn(
                            "flex items-center space-x-2 px-6 py-2 rounded-full font-bold transition-all",
                            isSaving
                                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                : "bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-95"
                        )}
                    >
                        {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} inline-block><Save className="w-4 h-4" /></motion.div> : <Save className="w-4 h-4" />}
                        <span>{isSaving ? "Saving..." : "Save Reflection"}</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => { triggerHaptic(HapticPatterns.medium); onNext(); }}
                    className="text-slate-500 hover:text-amber-500 text-sm font-medium transition-colors"
                >
                    {isExam ? "Continue to Exam" : "Skip to Challenge"} →
                </button>
            </div>
        </motion.div>
    );
}
