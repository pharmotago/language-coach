"use client";

import { useCourseStore } from "@/store/useCourseStore";
import courseData from "@/data";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Compass, Anchor, Sword, Scale, HelpCircle, Landmark, Crown, Scroll, Key, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const BADGE_ICONS: Record<string, any> = {
    shield: Shield,
    compass: Compass,
    anchor: Anchor,
    sword: Sword,
    balance: Scale,
    helm: HelpCircle, // Fallback if Helm not in lucide
    pillar: Landmark,
    crown: Crown,
    scroll: Scroll,
    key: Key
};

export function TrophyCase() {
    const { unlockedIndex } = useCourseStore();

    return (
        <div className="bg-slate-800/10 border border-slate-700/20 rounded-3xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-200">The Hall of Heroes</h3>
            </div>

            <div className="flex flex-wrap gap-6">
                {courseData.map((module, i) => {
                    const isMastered = i < unlockedIndex;
                    const Icon = BADGE_ICONS[module.badge || 'shield'] || Shield;

                    return (
                        <div key={module.id} className="group relative">
                            <motion.div
                                initial={false}
                                animate={{
                                    opacity: isMastered ? 1 : 0.2,
                                    scale: isMastered ? 1 : 0.8,
                                    filter: isMastered ? "grayscale(0%)" : "grayscale(100%)"
                                }}
                                className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg",
                                    isMastered
                                        ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-amber-500/10"
                                        : "bg-slate-800 border-slate-700 text-slate-600"
                                )}
                            >
                                <Icon className="w-8 h-8" />
                            </motion.div>

                            {/* Tooltip */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap z-20 pointer-events-none">
                                {isMastered ? `Master of ${module.title}` : `Locked Virtue`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
