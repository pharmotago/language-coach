import { motion } from "framer-motion";
import { Module } from "@/types";
import { ArrowRight, Clock, Pause, Play } from "lucide-react";
import { ProgressBar } from "./ui/ProgressBar";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GlossaryTerm } from "./ui/GlossaryTerm";

interface LessonReaderProps {
    module: Module;
    onNext: () => void;
}

export function LessonReader({ module, onNext }: LessonReaderProps) {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [readingLevel, setReadingLevel] = useState<"standard" | "quick">("standard");

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Simple glossary processor
    const renderContent = (content: string) => {
        const terms = ["Eudaimonia", "Amor Fati", "Memento Mori", "Prohairesis", "Ataraxia"];
        let parts = [content];

        terms.forEach(term => {
            const nextParts: (string | JSX.Element)[] = [];
            parts.forEach(part => {
                if (typeof part !== 'string') {
                    nextParts.push(part);
                    return;
                }
                const split = part.split(new RegExp(`(${term})`, 'g'));
                split.forEach(s => {
                    if (s === term) {
                        nextParts.push(<GlossaryTerm key={`${term}-${Math.random()}`} term={s} />);
                    } else {
                        nextParts.push(s);
                    }
                });
            });
            parts = nextParts as any;
        });

        return parts;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="prose prose-slate max-w-none dark:prose-invert"
        >
            <ProgressBar />

            {/* Control Bar: Timer and Reading Level */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-slate-800/20 px-4 py-3 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Clock className="w-3 h-3 text-amber-500" /> <span className="text-slate-300 font-mono">{formatTime(seconds)}</span>
                    </div>
                    <button
                        onClick={() => { triggerHaptic(HapticPatterns.light); setIsActive(!isActive); }}
                        className="p-1.5 hover:bg-slate-800 rounded-md transition-colors"
                        title={isActive ? "Pause Timer" : "Resume Timer"}
                    >
                        {isActive ? <Pause className="w-3 h-3 text-slate-400" /> : <Play className="w-3 h-3 text-emerald-500" />}
                    </button>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
                    <button
                        onClick={() => { triggerHaptic(HapticPatterns.light); setReadingLevel("standard"); }}
                        className={cn("px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all", readingLevel === "standard" ? "bg-amber-500 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-300")}
                    >
                        Standard
                    </button>
                    <button
                        onClick={() => { triggerHaptic(HapticPatterns.light); setReadingLevel("quick"); }}
                        className={cn("px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all", readingLevel === "quick" ? "bg-amber-500 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-300")}
                    >
                        Quick
                    </button>
                </div>
            </div>

            <div className="mb-12 leading-relaxed text-lg whitespace-pre-wrap">
                {readingLevel === "quick" ? (
                    <div className="bg-amber-500/5 border-l-4 border-amber-500 p-6 rounded-r-xl italic text-slate-300">
                        {module.summary}
                        <div className="mt-4 not-italic text-sm text-slate-500 font-bold uppercase tracking-widest">— Lesson Essence</div>
                    </div>
                ) : (
                    renderContent(module.content.full_lesson_content)
                )}
            </div>

            <div className="flex justify-end mt-12 pb-12">
                <button
                    onClick={() => {
                        triggerHaptic(HapticPatterns.light);
                        onNext();
                    }}
                    className="flex items-center text-amber-500 font-bold group"
                >
                    Next: Listen <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
