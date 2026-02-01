"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-white/5 backdrop-blur-sm relative overflow-hidden",
                "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent",
                className
            )}
            {...props}
        />
    );
}

export function ChatSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className={cn("flex items-start gap-4", i % 2 === 0 ? "flex-row-reverse" : "")}>
                    <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
                    <div className={cn("max-w-[80%] space-y-2", i % 2 === 0 ? "items-end" : "")}>
                        <Skeleton className="h-20 w-64 rounded-2xl" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}
