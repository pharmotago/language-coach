"use client";

import React from 'react';
import { UserProfile } from './UserProfile';
import { Trophy, Flame, Target, Shield } from 'lucide-react';

interface ShareCardProps {
    totalXp: number;
    streak: number;
    level: string;
    completedModules: number;
    username?: string;
}

export function ShareCard({ totalXp, streak, level, completedModules, username = "Stoic Initiate" }: ShareCardProps) {
    return (
        <div className="w-full max-w-sm mx-auto bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative p-8 flex flex-col items-center text-center">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">THE STOIC DAD</h2>
                    <div className="h-1 w-12 bg-amber-500 mx-auto rounded-full" />
                </div>

                {/* Profile Section */}
                <UserProfile
                    totalXp={totalXp}
                    username={username}
                    className="w-full bg-slate-900/50 border-slate-800/50 mb-6"
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
                        <Flame className="w-6 h-6 text-amber-500 mb-2" />
                        <span className="text-2xl font-bold text-white">{streak}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Day Streak</span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
                        <Target className="w-6 h-6 text-emerald-500 mb-2" />
                        <span className="text-2xl font-bold text-white">{completedModules}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Modules</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Join the path at stoicdad.app</span>
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
    );
}
