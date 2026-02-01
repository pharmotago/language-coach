export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />
            </div>
            <p className="mt-4 text-slate-500 text-xs uppercase tracking-widest font-bold">
                Loading Immersion...
            </p>
        </div>
    );
}
