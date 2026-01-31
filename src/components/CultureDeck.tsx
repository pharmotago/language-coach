'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { CultureNote } from '@/types/languageTypes';
import { cn } from '@/lib/utils';

interface CultureDeckProps {
    note: CultureNote;
    onClose: () => void;
}

export function CultureDeck({ note, onClose }: CultureDeckProps) {
    const IconComponent = (Icons as any)[note.icon] || Icons.Globe;

    return (
        <div className="relative overflow-hidden group">
            <div className="glass-card-light bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-4 hover:bg-indigo-900/30 transition-all duration-300">
                <div className="bg-indigo-500/20 p-2.5 rounded-lg text-indigo-300 group-hover:text-indigo-200 group-hover:scale-110 transition-all">
                    <IconComponent className="w-6 h-6" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                            Culture Note
                        </span>
                        {note.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-slate-500">#{tag}</span>
                        ))}
                    </div>

                    <h4 className="font-bold text-indigo-100 mb-1">{note.title}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {note.content}
                    </p>
                </div>

                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            </div>
        </div>
    );
}
