import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Shield, Zap } from 'lucide-react';
import agentInsights from '../data/agent_insights.json';

interface SynthesisMessage {
    id: string;
    role: string;
    text: string;
    type: 'insight' | 'optimization' | 'verification';
}

const ARCHETYPE = {
    name: "The Polyglot",
    pulseColor: "border-emerald-500/20",
    glowColor: "rgba(16,185,129,0.1)",
    pulseDuration: 1.5,
    tag: "TERMINAL PORT"
};

const SYNTHESIS_MESSAGES: Omit<SynthesisMessage, 'id'>[] = agentInsights as any;

export function SynthesisOverlay() {
    const [messages, setMessages] = useState<SynthesisMessage[]>([]);
    const [pulseActive, setPulseActive] = useState(false);

    useEffect(() => {
        // High-frequency synaptic pulse interval
        const initialTimer = setTimeout(() => {
            triggerRandomMessage();
        }, 8000);

        const pulseInterval = setInterval(() => {
            setPulseActive(true);
            setTimeout(() => setPulseActive(false), 1500);
        }, 20000); // More frequent for Polyglot

        return () => {
            clearTimeout(initialTimer);
            clearInterval(pulseInterval);
        };
    }, []);

    const triggerRandomMessage = () => {
        const template = SYNTHESIS_MESSAGES[Math.floor(Math.random() * SYNTHESIS_MESSAGES.length)];
        const newMessage: SynthesisMessage = {
            ...template,
            id: Math.random().toString(36).substring(7)
        };

        setMessages(prev => [...prev, newMessage]);
        setPulseActive(true);

        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== newMessage.id));
            setPulseActive(false);
        }, 7000); // Shorter duration for synaptic feel

        // Schedule next message
        setTimeout(triggerRandomMessage, 45000 + Math.random() * 45000);
    };

    return (
        <>
            {/* Council Pulse: Synaptic Frequency */}
            <AnimatePresence>
                {pulseActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: ARCHETYPE.pulseDuration }}
                        className={`fixed inset-0 pointer-events-none z-[100] border-[8px] ${ARCHETYPE.pulseColor} shadow-[inset_0_0_120px_${ARCHETYPE.glowColor}]`}
                    />
                )}
            </AnimatePresence>

            {/* Synthesis Feed: Glassmorphic Intelligence */}
            <div className="fixed top-24 right-4 z-[101] flex flex-col gap-3 pointer-events-none max-w-xs md:max-w-sm">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9, rotate: -2 }}
                            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95, filter: 'blur(10px)' }}
                            className="p-4 bg-slate-900/90 border border-emerald-500/20 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden group pointer-events-auto"
                        >
                            <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    {msg.type === 'insight' && <Sparkles className="w-5 h-5 text-emerald-400" />}
                                    {msg.type === 'optimization' && <Zap className="w-5 h-5 text-blue-400" />}
                                    {msg.type === 'verification' && <Shield className="w-5 h-5 text-amber-400" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                            {ARCHETYPE.tag}
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                                        <span className="text-[9px] font-bold text-white/40 uppercase">
                                            {ARCHETYPE.name}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/80 font-medium leading-relaxed italic">
                                        [{msg.role}]: "{msg.text}"
                                    </p>
                                </div>
                            </div>

                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
