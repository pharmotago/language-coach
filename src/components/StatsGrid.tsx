"use client";

import { useCourseStore } from "@/store/useCourseStore";
import { BookOpen, Clock, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export function StatsGrid() {
    const { journalEntries, unlockedIndex, completedDates } = useCourseStore();

    const entries = Object.values(journalEntries);
    const totalWords = entries.reduce((acc, curr) => {
        const content = typeof curr === 'string' ? curr : curr.content;
        return acc + content.split(/\s+/).filter(Boolean).length;
    }, 0);

    const stats = [
        { label: "Lessons Mastered", value: unlockedIndex, icon: Target, color: "text-emerald-500" },
        { label: "Words Reflected", value: totalWords, icon: BookOpen, color: "text-amber-500" },
        { label: "Days Training", value: completedDates.length, icon: Zap, color: "text-blue-500" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-slate-800/20 border border-slate-700/30 p-4 rounded-2xl flex items-center gap-4"
                >
                    <div className={`p-3 rounded-xl bg-slate-900/50 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-100">{stat.value}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
