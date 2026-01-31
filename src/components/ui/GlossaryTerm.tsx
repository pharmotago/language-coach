"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";

const GLOSSARY: Record<string, string> = {
    "Eudaimonia": "Often translated as 'happiness' or 'flourishing', it is the state of living in accordance with virtue and reason.",
    "Prohairesis": "The 'moral choice' or 'will power'—the only thing that is truly within our absolute control.",
    "Amor Fati": "A love of fate. The practice of welcoming everything that happens as exactly what was needed.",
    "Memento Mori": "Remember that you will die. A reminder to live intentionally and not waste time on trifles.",
    "Ataraxia": "Tranquility or freedom from mental disturbance.",
    "Sympatheia": "The belief that all things are interconnected in a cosmic whole.",
    "Premeditatio Malorum": "The premeditation of evils. Imagining potential setbacks to remove their sting.",
};

export function GlossaryTerm({ term }: { term: keyof typeof GLOSSARY | string }) {
    const [isOpen, setIsOpen] = useState(false);
    const definition = GLOSSARY[term as keyof typeof GLOSSARY] || "A stoic concept to be mastered.";

    return (
        <span className="relative inline-block">
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onClick={() => { triggerHaptic(HapticPatterns.light); setIsOpen(!isOpen); }}
                className="text-amber-500 border-b border-dotted border-amber-500/50 hover:border-amber-500 transition-all cursor-help"
            >
                {term}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-[100] pointer-events-none"
                    >
                        <div className="flex items-start gap-2 text-left">
                            <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed text-slate-300 normal-case font-sans">
                                <span className="font-bold text-amber-500">{term}:</span> {definition}
                            </p>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-white" />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
