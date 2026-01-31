import { useRef, useEffect, useState } from "react";
import { X, Volume2, VolumeX, Wind } from "lucide-react";
import { useCourseStore } from "@/store/useCourseStore";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const INTERVALS = [
    { name: "Box (4-4-4-4)", inhale: 4, hold: 4, exhale: 4, out: 4 },
    { name: "Focus (4-7-8)", inhale: 4, hold: 7, exhale: 8, out: 0 },
    { name: "Zen (5-5)", inhale: 5, hold: 0, exhale: 5, out: 0 },
];

export function BreathingOverlay() {
    const { isPanicMode, setPanicMode } = useCourseStore();
    const [intervalType, setIntervalType] = useState(1); // 4-7-8 by default
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
    const [counter, setCounter] = useState(0);

    const currentInterval = INTERVALS[intervalType];

    useEffect(() => {
        if (!isPanicMode) return;

        // Setup sound
        if (!audioRef.current && typeof window !== 'undefined') {
            audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"); // Nature loop or similar
            audioRef.current.loop = true;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [isPanicMode]);

    useEffect(() => {
        if (isPlayingSound && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio error", e));
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlayingSound]);

    // Timer logic for phases
    useEffect(() => {
        if (!isPanicMode) return;

        const timer = setInterval(() => {
            setCounter(prev => {
                const next = prev + 1;
                const active = INTERVALS[intervalType];

                if (phase === "Inhale" && next >= active.inhale) {
                    if (active.hold > 0) setPhase("Hold"); else setPhase("Exhale");
                    return 0;
                }
                if (phase === "Hold" && next >= active.hold) {
                    setPhase("Exhale");
                    return 0;
                }
                if (phase === "Exhale" && next >= active.exhale) {
                    if (active.out > 0) setPhase("Pause"); else setPhase("Inhale");
                    return 0;
                }
                if (phase === "Pause" && next >= active.out) {
                    setPhase("Inhale");
                    return 0;
                }

                return next;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPanicMode, phase, intervalType]);

    if (!isPanicMode) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <button
                onClick={() => { triggerHaptic(HapticPatterns.medium); setPanicMode(false); }}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="absolute top-6 left-6 flex gap-4 no-print">
                <button
                    onClick={() => { triggerHaptic(HapticPatterns.light); setIsPlayingSound(!isPlayingSound); }}
                    className={cn("p-3 rounded-full border transition-all", isPlayingSound ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-slate-800 text-slate-500")}
                >
                    {isPlayingSound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
            </div>

            <header className="mb-12">
                <h2 className="text-3xl font-bold text-slate-100 mb-2 tracking-[0.2em] uppercase">De-Escalate</h2>
                <div className="flex gap-2 justify-center mb-8">
                    {INTERVALS.map((item, idx) => (
                        <button
                            key={item.name}
                            onClick={() => { triggerHaptic(HapticPatterns.light); setIntervalType(idx); setPhase("Inhale"); setCounter(0); }}
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all",
                                intervalType === idx ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-slate-800 text-slate-500"
                            )}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="relative flex flex-col items-center justify-center">
                <motion.div
                    animate={{
                        scale: phase === "Inhale" ? [1, 1.2] : phase === "Exhale" ? [1.2, 1] : phase === "Hold" ? 1.2 : 1,
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: phase === "Inhale" ? currentInterval.inhale : currentInterval.exhale,
                        ease: "easeInOut"
                    }}
                    className="w-64 h-64 bg-gradient-to-br from-amber-600 to-amber-900 rounded-full shadow-2xl shadow-amber-500/30 flex flex-col items-center justify-center border-4 border-amber-400/20"
                >
                    <Wind className="w-10 h-10 text-amber-200/50 mb-4" />
                    <span className="text-2xl font-black text-amber-50 uppercase tracking-[0.3em]">{phase}</span>
                    <span className="text-amber-300/50 font-mono text-xl mt-2">{counter + 1}</span>
                </motion.div>

                {/* Visual ring */}
                <div className="absolute -inset-8 border border-white/5 rounded-full animate-ping-slow pointer-events-none" />
            </div>

            <div className="mt-16 text-slate-400 max-w-sm">
                <p className="text-lg leading-relaxed mb-4 italic">
                    "The best revenge is not to be like your enemy." — Marcus Aurelius
                </p>
                <div className="w-12 h-1 bg-amber-500/30 mx-auto rounded-full" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Master your pulse. Guide your spirit.
                </p>
            </div>
        </div>
    );
}
