"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Leaderboard } from './Leaderboard';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface CommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentXp: number;
    currentStreak: number;
}

export function CommunityModal({ isOpen, onClose, currentXp, currentStreak }: CommunityModalProps) {
    const modalRef = useFocusTrap(isOpen);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="p-1">
                    <Leaderboard currentUserXp={currentXp} currentUserStreak={currentStreak} />
                </div>
            </div>
        </div>
    );
}
