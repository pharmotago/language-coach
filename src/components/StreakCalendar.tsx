import { useRef, useEffect } from "react";
import { Flame } from "lucide-react";
import { useCourseStore } from "@/store/useCourseStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function StreakCalendar() {
    const { completedDates } = useCourseStore();

    // Helper to get last 28 days
    const days = Array.from({ length: 28 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (27 - i));
        return params(d);
    });

    function params(d: Date) {
        return d.toISOString().split('T')[0];
    }

    // Calculate Current Streak
    let currentStreak = 0;
    const today = params(new Date());
    const yesterday = params(new Date(new Date().setDate(new Date().getDate() - 1)));

    // Check if today or yesterday is completed to maintain streak
    let cursor = new Date();
    while (true) {
        const dateStr = params(cursor);
        if (completedDates.includes(dateStr)) {
            currentStreak++;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            // Allow skipping today if it's not over yet
            if (dateStr === today && currentStreak === 0) {
                cursor.setDate(cursor.getDate() - 1);
                continue;
            }
            break;
        }
    }

    return (
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Consistency</h3>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Flame className={cn("w-5 h-5", currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-slate-700")} />
                        {currentStreak > 0 && (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full"
                            />
                        )}
                    </div>
                    <span className="text-sm font-bold text-slate-300">{currentStreak} Day Streak</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((dateStr, index) => {
                    const isCompleted = completedDates.includes(dateStr);
                    const isToday = dateStr === today;

                    return (
                        <div key={dateStr} className="flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCompleted ? [1, 1.2, 1] : 1,
                                    backgroundColor: isCompleted ? "rgb(245, 158, 11)" : "rgba(30, 41, 59, 0.5)"
                                }}
                                transition={{ duration: 0.3, delay: index * 0.01 }}
                                className={`w-full aspect-square rounded-md border text-[10px] flex items-center justify-center relative
                                    ${isCompleted ? "border-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20" : "border-slate-800 text-slate-600"}
                                    ${isToday ? "ring-1 ring-slate-400" : ""}
                                `}
                            >
                                {isCompleted && <span className="absolute inset-0 bg-amber-400 opacity-20 animate-ping rounded-md" />}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-600 font-mono">
                <span>4 Weeks Ago</span>
                <span>Today</span>
            </div>
        </div>
    );
}
