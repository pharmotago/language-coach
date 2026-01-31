import React from 'react';

export function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Header skeleton */}
            <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-slate-800 rounded animate-pulse" />
                                <div className="h-3 w-48 bg-slate-800 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="pb-2">
                        <div className="h-1 bg-slate-800 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="text-center mb-6">
                            <div className="h-8 w-48 bg-slate-800 rounded mx-auto mb-2 animate-pulse" />
                            <div className="h-4 w-64 bg-slate-800 rounded mx-auto animate-pulse" />
                        </div>

                        {/* Module cards skeleton */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full flex-shrink-0 animate-pulse" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-6 w-3/4 bg-slate-800 rounded animate-pulse" />
                                        <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                                        <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar skeleton */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900">
                                <div className="h-32 bg-slate-800 rounded-xl animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
