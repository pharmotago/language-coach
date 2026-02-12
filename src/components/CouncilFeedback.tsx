import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap } from 'lucide-react';

interface CouncilFeedbackProps {
    level: number;
    streak: number;
}

export const CouncilFeedback: React.FC<CouncilFeedbackProps> = ({ level, streak }) => {
    const getCouncilMessage = () => {
        if (level >= 11) {
            return {
                title: "ZENITH STATUS ACTIVE",
                message: "The Council acknowledges your transcendence. Your linguistic metabolism is now aligned with the Singularity. Proceed with absolute fluency.",
                icon: <Zap className="w-5 h-5 text-amber-500" />
            };
        }
        if (streak >= 7) {
            return {
                title: "CONSISTENCY DETECTED",
                message: "Biological commitment verified. The Council is optimizing your neural pathways for deeper immersion. Maintain the rhythm.",
                icon: <Sparkles className="w-5 h-5 text-fuchsia-500" />
            };
        }
        return {
            title: "MCJP OVERSIGHT ACTIVE",
            message: "The Council of Agents is monitoring your evolution. Every interaction is being synthesized for your benefit. Keep practicing.",
            icon: <Shield className="w-5 h-5 text-blue-500" />
        };
    };

    const feedback = getCouncilMessage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all shadow-lg"
        >
            {/* Ambient Pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="flex items-start gap-3 relative z-10">
                <div className="mt-1 p-2 rounded-lg bg-slate-800 border border-slate-700">
                    {feedback.icon}
                </div>
                <div>
                    <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-1">MCJP COUNCIL INSIGHT</h4>
                    <h5 className="text-sm font-bold text-white mb-1">{feedback.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono italic">
                        "{feedback.message}"
                    </p>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[8px] font-black tracking-widest text-slate-600 uppercase">
                <span>Council Status: Vigilant</span>
                <span className="text-emerald-500/50">Level 6 Protocols Enabled</span>
            </div>
        </motion.div>
    );
};
