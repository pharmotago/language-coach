import { Zap } from "lucide-react";
import { Module } from "@/types";
import Markdown from "react-markdown";
import { motion } from "framer-motion";

interface LessonActProps {
    module: Module;
    onComplete: () => void;
}

export function LessonAct({ module, onComplete }: LessonActProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
        >
            <div className="space-y-8">
                <div className="p-6 bg-amber-950/20 border border-amber-900/50 rounded-xl">
                    <h3 className="text-amber-500 font-bold mb-4 uppercase text-sm tracking-wider flex items-center">
                        <Zap className="w-4 h-4 mr-2" /> Mental Scripts
                    </h3>
                    <div className="prose prose-invert text-slate-300">
                        <Markdown>{module.content.scripts}</Markdown>
                    </div>
                </div>

                <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <h3 className="text-slate-100 font-bold mb-4 uppercase text-sm tracking-wider">Today's Challenge</h3>
                    <div className="prose prose-invert prose-lg text-slate-200 leading-relaxed border-l-4 border-amber-500 pl-4">
                        <Markdown>{module.content.challenge}</Markdown>
                    </div>
                </div>

                <div className="pt-8 flex justify-center">
                    <button
                        onClick={onComplete}
                        className="group bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center"
                    >
                        Mark Complete
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
