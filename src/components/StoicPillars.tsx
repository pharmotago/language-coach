"use client";

import { motion } from "framer-motion";
import { Landmark, Shield, Scale, Brain } from "lucide-react";

export function StoicPillars() {
    const pillars = [
        { name: "Wisdom", icon: Brain, desc: "Practical reason and discernment." },
        { name: "Justice", icon: Scale, desc: "Fairness and social duty." },
        { name: "Courage", icon: Shield, desc: "Endurance and bravery." },
        { name: "Temperance", icon: Landmark, desc: "Self-discipline and moderation." }
    ];

    return (
        <div className="mb-16">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-8 text-center">The Four Pillars</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pillars.map((p, i) => (
                    <motion.div
                        key={p.name}
                        whileHover={{ y: -5 }}
                        className="bg-slate-800/20 border border-slate-700/30 p-6 rounded-2xl flex flex-col items-center text-center group cursor-help transition-colors hover:bg-slate-800/40"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-900/50 flex items-center justify-center mb-4 group-hover:text-amber-500 transition-colors">
                            <p.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 mb-2 uppercase tracking-widest">{p.name}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{p.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
