import React from 'react';

export function Hero3DPreview() {
    return (
        <div className="relative w-full max-w-sm mx-auto perspective-1000 group">
            <div className="relative transform transition-all duration-700 ease-out group-hover:rotate-y-12 group-hover:rotate-x-6 preserve-3d">

                {/* Device Frame */}
                <div className="relative bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden aspect-[9/19]">
                    {/* Screen Content Mockup */}
                    <div className="absolute inset-0 bg-slate-950 flex flex-col">
                        {/* Header */}
                        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
                            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                            <div className="w-20 h-4 bg-slate-800 rounded animate-pulse" />
                            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-4 flex-1">
                            <div className="w-full h-32 bg-amber-500/10 rounded-2xl border border-amber-500/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer" />
                            </div>

                            <div className="space-y-2">
                                <div className="h-20 bg-slate-900 rounded-xl border border-slate-800 p-3 flex gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-slate-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-3/4 h-3 bg-slate-800 rounded" />
                                        <div className="w-1/2 h-3 bg-slate-800 rounded" />
                                    </div>
                                </div>
                                <div className="h-20 bg-slate-900 rounded-xl border border-slate-800 p-3 flex gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-slate-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-3/4 h-3 bg-slate-800 rounded" />
                                        <div className="w-1/2 h-3 bg-slate-800 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Nav */}
                        <div className="h-16 bg-slate-900 border-t border-slate-800 grid grid-cols-4 place-items-center">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-6 h-6 rounded bg-slate-800" />
                            ))}
                        </div>
                    </div>

                    {/* Reflection/Gloss */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[2.5rem]" />
                </div>

                {/* Shadow/Glow */}
                <div className="absolute -inset-4 bg-amber-500/20 blur-3xl -z-10 rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>

            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; transform: rotateX(5deg) rotateY(-5deg) rotateZ(2deg); }
                .rotate-y-12 { transform: rotateY(-12deg) rotateX(5deg); }
                .rotate-x-6 { transform: rotateX(10deg); }
            `}</style>
        </div>
    );
}
