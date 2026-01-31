import { useState, useEffect } from "react";
import { Headphones, Play, PenTool } from "lucide-react";
import { Module } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCourseStore } from "@/store/useCourseStore";

interface LessonAudioProps {
    module: Module;
    onNext: () => void;
}

export function LessonAudio({ module, onNext }: LessonAudioProps) {
    const { theme } = useCourseStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);

    // Audio Simulation Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setAudioProgress((prev) => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return prev + 0.5;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (percent: number) => {
        const totalSeconds = 225; // 3:45 (Simulated duration)
        const currentSeconds = Math.floor((percent / 100) * totalSeconds);
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const headingColor = theme === 'paper' ? 'text-slate-900' : 'text-slate-100';
    const subColor = theme === 'paper' ? 'text-slate-500' : 'text-slate-400';

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-12 bg-slate-800/30 rounded-2xl border border-slate-800"
        >
            <div className={`w-36 h-36 rounded-full flex items-center justify-center mb-8 shadow-2xl ring-1 ring-slate-700 transition-all duration-700 relative overflow-hidden ${isPlaying ? "bg-amber-900/40 scale-105 ring-amber-500/30" : "bg-slate-900 scale-100"}`}>
                {/* Visualizer Bars */}
                {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-50">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [20, 60, 30, 80, 40],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.8,
                                    ease: "easeInOut",
                                    delay: i * 0.1,
                                    repeatType: "mirror"
                                }}
                                className="w-2 bg-amber-500 rounded-full"
                            />
                        ))}
                    </div>
                )}

                <Headphones className={`w-12 h-12 text-amber-500 relative z-10 transition-all duration-500 ${isPlaying ? "scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "opacity-80"}`} />
            </div>
            <h3 className={cn("text-xl font-bold mb-2 transition-colors", headingColor)}>{module.title} (Audio)</h3>
            <p className={cn("text-sm mb-8 transition-colors", subColor)}>Listen to the daily lesson on the go.</p>

            {module.spotifyId ? (
                <div className="w-full max-w-sm">
                    <iframe
                        style={{ borderRadius: "12px" }}
                        src={`https://open.spotify.com/embed/track/${module.spotifyId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                </div>
            ) : (
                <div className="w-full max-w-sm bg-slate-700/50 rounded-full h-16 flex items-center px-4 relative overflow-hidden group cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => setIsPlaying(!isPlaying)}>
                    <button
                        aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
                        className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform z-10 shadow-lg shadow-amber-500/20"
                    >
                        {isPlaying ? (
                            <div className="flex space-x-1">
                                <div className="w-1 h-3 bg-slate-900 rounded-full" />
                                <div className="w-1 h-3 bg-slate-900 rounded-full" />
                            </div>
                        ) : (
                            <Play className="w-5 h-5 ml-1" />
                        )}
                    </button>
                    <div className="flex-1 mx-4 h-1 bg-slate-600 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${audioProgress}%` }}
                        />
                    </div>
                    <span className="text-xs text-slate-400 font-mono w-10 text-right">{formatTime(audioProgress)}</span>
                </div>
            )}

            <div className="mt-12 flex justify-center">
                <button
                    onClick={onNext}
                    className="text-amber-500 hover:text-amber-400 font-medium flex items-center transition-colors"
                >
                    Next: Reflect <PenTool className="w-4 h-4 ml-2" />
                </button>
            </div>
        </motion.div>
    );
}
