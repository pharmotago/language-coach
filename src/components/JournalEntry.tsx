import React, { useState, useEffect } from 'react';
import { BookText, Save, X } from 'lucide-react';

interface JournalEntryProps {
    moduleId: number;
    moduleTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export function JournalEntry({ moduleId, moduleTitle, isOpen, onClose }: JournalEntryProps) {
    const [entry, setEntry] = useState('');
    const storageKey = `stoic-dad-journal-${moduleId}`;

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem(storageKey);
            setEntry(saved || '');
        }
    }, [isOpen, storageKey]);

    const handleSave = () => {
        localStorage.setItem(storageKey, entry);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <BookText className="w-5 h-5 text-amber-500" />
                            Reflection Journal
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">{moduleTitle}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            What resonated with you? What will you practice?
                        </label>
                        <textarea
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                            placeholder="Write your thoughts here... Be honest. This is for you."
                            className="w-full h-48 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
                        />
                    </div>

                    <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                        <p className="text-sm text-slate-400 italic">
                            "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
}
