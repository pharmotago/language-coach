"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface Step {
    target?: string; // ID of element to highlight
    title: string;
    description: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const steps: Step[] = [
    {
        title: "Welcome to The Stoic Dad",
        description: "Your journey to emotional mastery begins here. Let's take a quick tour of your command center.",
        position: 'center'
    },
    {
        target: 'module-list',
        title: "The Path",
        description: "This is your curriculum. Unlocked modules appear here. Complete them to progress.",
        position: 'right'
    },
    {
        target: 'progress-ring',
        title: "Your Progress",
        description: "Track your completion rate. Consistency is key.",
        position: 'left'
    },
    {
        target: 'emergency-btn',
        title: "Emergency Protocol",
        description: "Feeling overwhelmed? Tap this shield for instant tactical scripts.",
        position: 'top' // Usually bottom right, so tooltip on top/left
    },
    {
        target: 'quick-actions',
        title: "Command Deck",
        description: "Access stats, journal export, and search from here.",
        position: 'left'
    }
];

interface TutorialOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);

    // Reset step when opening
    useEffect(() => {
        if (isOpen) setCurrentStep(0);
    }, [isOpen]);

    if (!isOpen) return null;

    const step = steps[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === steps.length - 1;

    // TODO: logic to calculate position based on target element bounding rect
    // For MVP, we'll use fixed positioning or simpler generic overlays
    // We can use a simpler "Spotlight" effect:
    // Darken everything, but "cut out" the hole for the target if it exists

    // Actually, implementing true spotlight positioning is complex without a lib.
    // Let's stick to a central modal that points to things, or just a sequential modal sequence.
    // For "Empire-Grade", let's try a simple spotlight effect if we can find the element.

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

            {/* Content Card */}
            <div className="relative z-10 max-w-md w-full mx-4 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                            Tutorial {currentStep + 1}/{steps.length}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">
                            {step.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-slate-300 leading-relaxed mb-8">
                    {step.description}
                </p>

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={isFirst}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isFirst
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={() => {
                            if (isLast) onClose();
                            else setCurrentStep(currentStep + 1);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-bold transition-all shadow-lg hover:shadow-amber-500/25"
                    >
                        {isLast ? (
                            <>Finish <Check className="w-4 h-4" /></>
                        ) : (
                            <>Next <ChevronRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
