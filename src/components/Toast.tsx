import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
        warning: AlertTriangle
    };

    const colors = {
        success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    };

    const Icon = icons[type];

    return (
        <div className={cn(
            "fixed top-20 right-4 z-[100] p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-top-5 duration-300 max-w-sm overflow-hidden",
            colors[type]
        )}>
            <div className="flex items-start gap-3 relative z-10">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="p-0.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full">
                <div
                    className="h-full bg-current opacity-50 origin-left"
                    style={{
                        animation: `shrink ${duration}ms linear forwards`
                    }}
                />
            </div>
            <style jsx>{`
                @keyframes shrink {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
}

// Toast container hook
export function useToast() {
    const [toast, setToast] = React.useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ message, type });
    };

    const ToastComponent = toast ? (
        <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
        />
    ) : null;

    return { showToast, ToastComponent };
}
