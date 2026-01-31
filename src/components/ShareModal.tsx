"use client";

import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { ShareCard } from './ShareCard';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { calculateLevel } from '@/lib/gamification';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalXp: number;
    streak: number;
    completedModules: number;
}

export function ShareModal({ isOpen, onClose, totalXp, streak, completedModules }: ShareModalProps) {
    const modalRef = useFocusTrap(isOpen);
    const { title } = calculateLevel(totalXp);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 flex flex-col items-center">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-amber-500" />
                        Share Progress
                    </h2>

                    <div className="mb-8 w-full transform hover:scale-[1.02] transition-transform duration-300">
                        <ShareCard
                            totalXp={totalXp}
                            streak={streak}
                            level={title}
                            completedModules={completedModules}
                        />
                    </div>

                    <div className="flex gap-3 w-full">
                        <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Save Image
                        </button>
                        <button className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
