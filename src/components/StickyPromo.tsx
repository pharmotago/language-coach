import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

export function StickyPromo() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

    useEffect(() => {
        // Show after 5 seconds
        const timer = setTimeout(() => setIsVisible(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format HH:MM:SS
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[40] bg-gradient-to-r from-amber-600 to-amber-500 p-3 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Text & Timer */}
                <div className="flex items-center gap-4 text-slate-900">
                    <div className="flex items-center gap-2 font-bold whitespace-nowrap">
                        <Clock className="w-5 h-5 animate-pulse" />
                        <span>LAUNCH OFFER: 50% OFF</span>
                    </div>
                    <div className="hidden md:block h-6 w-px bg-slate-900/20" />
                    <div className="text-sm font-medium">
                        Get lifetime access for just $29 before the price increases.
                    </div>
                </div>

                {/* Action */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="font-mono font-bold text-lg text-slate-900/80 bg-white/20 px-3 py-1 rounded-lg">
                        {formatTime(timeLeft)}
                    </div>

                    <a
                        href="https://mcjp.gumroad.com/l/uobtt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none text-center px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        Claim Offer
                    </a>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-black/10 rounded-full transition-colors md:hidden"
                    >
                        <X className="w-5 h-5 text-slate-900" />
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 text-slate-900/50 hover:text-slate-900 hidden md:block"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
