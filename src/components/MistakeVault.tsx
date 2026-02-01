"use client";

import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { X, Trash2, History, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MistakeVaultProps {
    onClose: () => void;
}

export function MistakeVault({ onClose }: MistakeVaultProps) {
    const { mistakeLog, clearMistakes } = useLanguageStore();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl flex flex-col bg-slate-900/90"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Mistake Vault</h2>
                            <p className="text-sm text-slate-400">Review your past errors to improve mastery.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {mistakeLog.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Clean Record!</h3>
                            <p className="text-slate-400 max-w-xs">
                                No mistakes recorded yet. Keep practicing to fill this vault with learning opportunities.
                            </p>
                        </div>
                    ) : (
                        mistakeLog.map((mistake) => (
                            <div key={mistake.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-2">
                                        <span>{new Date(mistake.timestamp).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{mistake.context}</span>
                                    </div>
                                    <AlertTriangle className="w-4 h-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-rose-400 font-semibold uppercase">You Said:</label>
                                        <p className="text-slate-300 font-medium line-through decoration-rose-500/50 decoration-2">
                                            "{mistake.original}"
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-emerald-400 font-semibold uppercase">Correction:</label>
                                        <p className="text-emerald-100 font-medium">
                                            "{mistake.correction}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {mistakeLog.length > 0 && (
                    <div className="px-6 py-4 border-t border-white/10 bg-slate-900/50 flex justify-end">
                        <button
                            onClick={clearMistakes}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear History
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
