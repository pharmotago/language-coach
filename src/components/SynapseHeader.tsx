'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Globe, RotateCcw, Download } from 'lucide-react';
import { XPBar } from './XPSystem';

interface SynapseHeaderProps {
    headerBg: any;
    headerBlur: any;
    headerPadding: any;
    targetLanguage: any;
    skillLevel: string;
    streakData: { currentStreak: number };
    level: { xpProgress: number; level: number; xpForNext: number };
    activeView: string;
    setActiveView: (view: any) => void;
    onAvatarClick: () => void;
    onSetupClick: () => void;
    onExportClick: () => void;
    onScenariosClick: () => void;
    onReferralClick: () => void;
    onResetClick: () => void;
    messagesLength: number;
}

import { Send, BarChart3, Book, Crown } from 'lucide-react';

export const SynapseHeader: React.FC<SynapseHeaderProps> = ({
    headerBg,
    headerBlur,
    headerPadding,
    targetLanguage,
    skillLevel,
    streakData,
    level,
    activeView,
    setActiveView,
    onAvatarClick,
    onSetupClick,
    onExportClick,
    onScenariosClick,
    onReferralClick,
    onResetClick,
    messagesLength
}) => {
    return (
        <motion.header
            style={{
                backgroundColor: headerBg,
                backdropFilter: headerBlur,
                paddingTop: headerPadding,
                paddingBottom: headerPadding
            }}
            className="border-b border-emerald-500/10 px-4 md:px-6 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-40 transition-all duration-300 backdrop-blur-3xl"
        >
            <div className="flex items-center gap-3 md:gap-6 py-2">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={onAvatarClick}
                        className="w-12 h-12 rounded-none bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/60 transition-all flex items-center justify-center text-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 neon-pulse"
                        title="Synapse Avatar"
                    >
                        <div className="w-full h-full bg-emerald-950 flex items-center justify-center text-emerald-400 font-black text-[10px] tracking-tighter uppercase">
                            SYNP
                        </div>
                    </button>

                    <button
                        onClick={onSetupClick}
                        className="flex items-center gap-2 md:gap-4 hover:bg-emerald-500/5 p-1 px-3 rounded-none border-l border-emerald-500/20 transition-all group"
                        title="Signal Shift"
                    >
                        <div className="text-2xl md:text-4xl animate-pulse group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">{targetLanguage?.flag}</div>
                        <div className="text-left">
                            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                                {targetLanguage?.name} <span className="text-emerald-500">Synapse</span>
                                <span className={`
                                    text-[9px] px-2 py-0.5 rounded-none border border-emerald-500/20 uppercase tracking-[0.2em] font-black
                                    ${skillLevel === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                                        skillLevel === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}
                                `}>
                                    {skillLevel}
                                </span>
                            </h1>
                            <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                Active Integration // {streakData.currentStreak} Day Streak
                            </div>
                        </div>
                    </button>
                </div>

                <div className="hidden lg:block w-56">
                    <XPBar
                        currentXP={level.xpProgress}
                        currentLevel={level.level}
                        xpForNextLevel={level.xpForNext}
                        compact
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <nav className="flex bg-slate-900/50 rounded-lg p-1 mr-2 border border-slate-800">
                    <button
                        onClick={() => setActiveView('chat')}
                        className={`p-2 rounded-md transition-all ${activeView === 'chat' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Chat"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setActiveView('lessons')}
                        className={`p-2 rounded-md transition-all ${activeView === 'lessons' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Lessons"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setActiveView('vocabulary')}
                        className={`p-2 rounded-md transition-all ${activeView === 'vocabulary' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Vocabulary"
                    >
                        <Book className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setActiveView('achievements')}
                        className={`p-2 rounded-md transition-all ${activeView === 'achievements' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Achievements"
                    >
                        <Trophy className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setActiveView('leaderboard')}
                        className={`p-2 rounded-md transition-all ${activeView === 'leaderboard' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Leaderboard"
                    >
                        <Crown className="w-4 h-4 text-amber-500" />
                    </button>
                    <button
                        onClick={() => setActiveView('analytics')}
                        className={`p-2 rounded-md transition-all ${activeView === 'analytics' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Analytics"
                    >
                        <BarChart3 className="w-4 h-4" />
                    </button>
                </nav>

                <div className="hidden md:flex items-center gap-1 bg-slate-900/50 rounded-lg p-1 border border-slate-800">
                    <button
                        onClick={onExportClick}
                        disabled={messagesLength === 0}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Export"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onScenariosClick}
                        className="p-2 text-amber-400 hover:text-amber-300"
                        title="Scenarios"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onReferralClick}
                        className="p-2 text-emerald-500 hover:text-emerald-400"
                        title="Invite Friend"
                    >
                        <Globe className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onResetClick}
                        className="p-2 text-rose-500 hover:text-rose-400"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.header>
    );
};
