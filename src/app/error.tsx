'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="p-4 bg-rose-500/10 rounded-full mb-6 animate-pulse">
                <AlertCircle className="w-12 h-12 text-rose-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Connection Lost</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                We encountered an unexpected error. Don't worry, making mistakes is part of learning!
            </p>
            <button
                onClick={reset}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-rose-500/20 transition-all hover:-translate-y-1"
            >
                <RotateCcw className="w-5 h-5" />
                Reload Application
            </button>
        </div>
    );
}
