"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    title?: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info', title?: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, title }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-4 w-full max-w-sm">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className={cn(
                                "glass-3d p-4 rounded-2xl flex gap-4 items-start relative overflow-hidden group",
                                toast.type === 'success' && "border-emerald-500/50 shadow-emerald-500/10",
                                toast.type === 'error' && "border-red-500/50 shadow-red-500/10",
                                toast.type === 'warning' && "border-amber-500/50 shadow-amber-500/10",
                                toast.type === 'info' && "border-blue-500/50 shadow-blue-500/10"
                            )}
                        >
                            {/* Accent line */}
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1",
                                toast.type === 'success' && "bg-emerald-500",
                                toast.type === 'error' && "bg-red-500",
                                toast.type === 'warning' && "bg-amber-500",
                                toast.type === 'info' && "bg-blue-500"
                            )} />

                            <div className={cn(
                                "p-2 rounded-xl flex-shrink-0",
                                toast.type === 'success' && "bg-emerald-500/20 text-emerald-400",
                                toast.type === 'error' && "bg-red-500/20 text-red-400",
                                toast.type === 'warning' && "bg-amber-500/20 text-amber-400",
                                toast.type === 'info' && "bg-blue-500/20 text-blue-400"
                            )}>
                                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                {toast.type === 'warning' && <Bell className="w-5 h-5" />}
                                {toast.type === 'info' && <Info className="w-5 h-5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                {toast.title && (
                                    <h4 className="font-black text-sm uppercase tracking-widest text-white mb-1">
                                        {toast.title}
                                    </h4>
                                )}
                                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                    {toast.message}
                                </p>
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
