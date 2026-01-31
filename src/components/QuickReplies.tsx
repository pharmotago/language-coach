/**
 * Quick Reply / Template Responses Component
 */

'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { SkillLevel } from '@/types/languageTypes';

interface QuickRepliesProps {
    language: string;
    level: SkillLevel;
    onSelect: (text: string) => void;
}

export function QuickReplies({ language, level, onSelect }: QuickRepliesProps) {
    const replies = getQuickReplies(language, level);

    if (replies.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-3">
            {replies.map((reply, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(reply)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-amber-500/50 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-200"
                >
                    <Zap className="w-3 h-3 text-amber-400" />
                    {reply}
                </button>
            ))}
        </div>
    );
}


function getQuickReplies(language: string, level: SkillLevel): string[] {
    const replies: Record<string, Record<SkillLevel, string[]>> = {
        Spanish: {
            Beginner: [
                'Sí',
                'No',
                '¿Cómo?',
                'No entiendo',
                '¿Puedes repetir?'
            ],
            Intermediate: [
                'Por supuesto',
                'No estoy seguro',
                '¿Podrías explicar?',
                'Interesante',
                'Tengo una pregunta'
            ],
            Advanced: [
                'Estoy de acuerdo',
                'Discrepo respetuosamente',
                'Desde mi punto de vista',
                'Por otro lado',
                'En mi opinión'
            ]
        },
        French: {
            Beginner: [
                'Oui',
                'Non',
                'Comment?',
                'Je ne comprends pas',
                'Pouvez-vous répéter?'
            ],
            Intermediate: [
                'Bien sûr',
                'Je ne suis pas sûr',
                'Pouvez-vous expliquer?',
                'Intéressant',
                'J\'ai une question'
            ],
            Advanced: [
                'Je suis d\'accord',
                'Je ne suis pas d\'accord',
                'De mon point de vue',
                'D\'autre part',
                'À mon avis'
            ]
        }
    };

    const defaultReplies: Record<SkillLevel, string[]> = {
        Beginner: ['Yes', 'No', 'I don\'t understand', 'Can you repeat?'],
        Intermediate: ['Of course', 'I\'m not sure', 'Could you explain?', 'Interesting'],
        Advanced: ['I agree', 'I disagree', 'In my view', 'On the other hand']
    };

    return replies[language]?.[level] || defaultReplies[level] || [];
}
