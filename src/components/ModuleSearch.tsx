"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronRight, BookOpen } from 'lucide-react';
import { Module } from '@/lib/schemas';
import courseData from '@/data';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { createPortal } from 'react-dom';

interface ModuleSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectModule: (module: Module) => void;
}

export function ModuleSearch({ isOpen, onClose, onSelectModule }: ModuleSearchProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter modules based on query
    const results = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();

        return courseData.filter(module => {
            const matchTitle = module.title.toLowerCase().includes(lowerQuery);
            const matchSummary = module.summary.toLowerCase().includes(lowerQuery);
            const matchContent = module.content.full_lesson_content.toLowerCase().includes(lowerQuery);

            return matchTitle || matchSummary || matchContent;
        }).slice(0, 5); // Limit to 5 results
    }, [query]);

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [results]);

    // Keyboard navigation
    useKeyboardShortcuts({
        'escape': onClose,
        'arrowdown': () => setSelectedIndex(i => Math.min(i + 1, results.length - 1)),
        'arrowup': () => setSelectedIndex(i => Math.max(i - 1, 0)),
        'enter': () => {
            if (results[selectedIndex]) {
                onSelectModule(results[selectedIndex]);
                onClose();
            }
        }
    }, isOpen);

    // Focus input on mount
    const inputRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
                {/* Search Header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-800">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for wisdom, lessons, or topics..."
                        className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-lg"
                    />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results List */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query.trim() === '' ? (
                        <div className="p-8 text-center text-slate-500">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Type to search the curriculum</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {results.map((module, index) => (
                                <button
                                    key={module.id}
                                    onClick={() => {
                                        onSelectModule(module);
                                        onClose();
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center gap-4 transition-colors ${index === selectedIndex
                                            ? 'bg-amber-500/10 border border-amber-500/20'
                                            : 'hover:bg-slate-800 border border-transparent'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400'
                                        }`}>
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium truncate ${index === selectedIndex ? 'text-amber-100' : 'text-slate-200'
                                            }`}>
                                            Day {module.id}: {module.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 truncate">
                                            {module.summary}
                                        </p>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 ${index === selectedIndex ? 'text-amber-500' : 'text-slate-600'
                                        }`} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <p>No matching lessons found.</p>
                        </div>
                    )}
                </div>

                {/* Footer Tips */}
                <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 px-4">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-sans">↓</kbd>
                            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-sans">↑</kbd>
                            navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-sans">↵</kbd>
                            select
                        </span>
                    </div>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-sans">esc</kbd>
                        close
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
}
