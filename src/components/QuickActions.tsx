import React from 'react';
import { BookText, Shield, BarChart3, Download, RefreshCw, Search, Users } from 'lucide-react';

interface QuickActionsProps {
    onOpenEmergency: () => void;
    onOpenStats: () => void;
    onExportJournal: () => void;
    onResetProgress: () => void;
    onOpenSearch: () => void;
    onOpenCommunity: () => void;
}

export function QuickActions({
    onOpenEmergency,
    onOpenStats,
    onExportJournal,
    onResetProgress,
    onOpenSearch,
    onOpenCommunity
}: QuickActionsProps) {
    const actions = [
        {
            id: 'search',
            label: 'Search',
            description: 'Find lessons',
            icon: Search,
            onClick: onOpenSearch,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/30'
        },
        {
            id: 'community',
            label: 'Community',
            description: 'Leaderboard',
            icon: Users,
            onClick: onOpenCommunity,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/30'
        },

        {
            id: 'emergency',
            label: 'Emergency',
            description: 'Crisis protocols',
            icon: Shield,
            onClick: onOpenEmergency,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30'
        },
        {
            id: 'stats',
            label: 'Analytics',
            description: 'View progress',
            icon: BarChart3,
            onClick: onOpenStats,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30'
        },
        {
            id: 'export',
            label: 'Export',
            description: 'Download notes',
            icon: Download,
            onClick: onExportJournal,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30'
        },
        {
            id: 'reset',
            label: 'Reset',
            description: 'Start over',
            icon: RefreshCw,
            onClick: onResetProgress,
            color: 'text-slate-500',
            bgColor: 'bg-slate-500/10',
            borderColor: 'border-slate-500/30'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookText className="w-5 h-5 text-amber-500" />
                Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.id}
                            onClick={action.onClick}
                            className={`p-4 rounded-xl border ${action.borderColor} ${action.bgColor} hover:scale-105 active:scale-95 transition-all duration-200 text-left group`}
                        >
                            <Icon className={`w-5 h-5 ${action.color} mb-2 group-hover:animate-pulse`} />
                            <div className="font-semibold text-sm text-white mb-0.5">{action.label}</div>
                            <div className="text-xs text-slate-400">{action.description}</div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 italic text-center">
                    💡 Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-amber-400 font-mono">E</kbd> for Emergency Toolkit
                </p>
            </div>
        </div>
    );
}
