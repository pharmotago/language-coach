"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export function EmptyState({ title, description, actionLabel, onAction }: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            <div className="relative mb-8">
                {/* Abstract Stoic Pillar/Shield SVG */}
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-800">
                    <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="opacity-20" />
                    <path d="M40 40H80V90H40V40Z" fill="currentColor" fillOpacity="0.05" />
                    <path d="M45 45V85H75V45H45Z" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />
                    <rect x="58" y="55" width="4" height="20" rx="2" fill="currentColor" className="text-amber-500 opacity-20" />
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        d="M60 20V40M60 80V100"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="text-amber-500"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-amber-500/50" />
                </div>
            </div>

            <h3 className="text-xl font-medium mb-2 text-slate-300">{title}</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-8">{description}</p>

            {actionLabel && (
                <button
                    onClick={onAction}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
}
