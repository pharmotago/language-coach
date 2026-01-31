"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Confetti({ active }: { active: boolean }) {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10,
                color: ["#f59e0b", "#fbbf24", "#d97706", "#fef3c7"][Math.floor(Math.random() * 4)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 0.5
            }));
            setParticles(newParticles);
            const timer = setTimeout(() => setParticles([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [active]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, x: `${p.x}vw`, y: "-10vh", rotate: 0 }}
                        animate={{
                            opacity: 0,
                            y: "110vh",
                            x: `${p.x + (Math.random() * 20 - 10)}vw`,
                            rotate: p.rotation + 720
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            borderRadius: Math.random() > 0.5 ? "50%" : "2px"
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
