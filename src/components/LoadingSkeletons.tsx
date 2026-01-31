/**
 * Loading Skeleton Components
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function MessageSkeleton({ isUserMessage = false }: { isUserMessage?: boolean }) {
    return (
        <div
            className={cn(
                "flex gap-3 mb-6 animate-pulse",
                isUserMessage ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar Skeleton */}
            <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0" />

            {/* Message Skeleton */}
            <div className={cn("flex-1 max-w-[85%]", isUserMessage && "flex flex-col items-end")}>
                <div
                    className={cn(
                        "px-5 py-3 rounded-2xl",
                        isUserMessage ? "bg-amber-500/10" : "bg-slate-800/50"
                    )}>
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-3/4" />
                        <div className="h-4 bg-slate-700 rounded w-1/2" />
                    </div>
                </div>

                {!isUserMessage && (
                    <div className="mt-4 w-full">
                        <div className="h-32 bg-slate-800/30 rounded-xl" />
                    </div>
                )}
            </div>
        </div>
    );
}

export function SetupModalSkeleton() {
    return (
        <div className="glass-card max-w-2xl w-full rounded-2xl border border-slate-800 p-8 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-700" />
                <div className="flex-1">
                    <div className="h-6 bg-slate-700 rounded w-48 mb-2" />
                    <div className="h-4 bg-slate-800 rounded w-64" />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-800 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export function ChatInterfaceSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header Skeleton */}
            <div className="glass-card border-b border-slate-800 px-6 py-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-full" />
                    <div>
                        <div className="h-5 w-32 bg-slate-800 rounded mb-2" />
                        <div className="h-4 w-24 bg-slate-800 rounded" />
                    </div>
                </div>
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 px-6 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <MessageSkeleton />
                    <MessageSkeleton isUserMessage />
                    <MessageSkeleton />
                </div>
            </div>

            {/* Input Skeleton */}
            <div className="glass-card border-t border-slate-800 px-6 py-4 animate-pulse">
                <div className="max-w-4xl mx-auto">
                    <div className="h-16 bg-slate-800 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
