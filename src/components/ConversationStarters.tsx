/**
 * Conversation Starter Suggestions Component
 */

'use client';

import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { SkillLevel } from '@/types/languageTypes';

interface ConversationStartersProps {
    language: string;
    level: SkillLevel;
    onSelect: (text: string) => void;
}

export function ConversationStarters({ language, level, onSelect }: ConversationStartersProps) {
    const starters = getStartersForLanguage(language, level);

    return (
        <div className="mb-6 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-400">
                    Click to start the conversation
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {starters.map((starter, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(starter.text)}
                        className="glass-card-light p-3 rounded-xl text-left hover:bg-white/10 hover:border-amber-500/30 transition-all duration-200 group"
                    >
                        <div className="flex items-start gap-3">
                            <MessageSquare className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-slate-200 mb-1">
                                    {starter.text}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {starter.translation}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function getStartersForLanguage(language: string, level: SkillLevel) {
    const starters: Record<string, Record<SkillLevel, Array<{ text: string; translation: string }>>> = {
        Spanish: {
            Beginner: [
                { text: '¡Hola! ¿Cómo estás?', translation: 'Hello! How are you?' },
                { text: 'Me llamo Juan. ¿Y tú?', translation: 'My name is Juan. And you?' },
                { text: '¿De dónde eres?', translation: 'Where are you from?' },
                { text: 'Quiero aprender español', translation: 'I want to learn Spanish' }
            ],
            Intermediate: [
                { text: '¿Qué te gusta hacer en tu tiempo libre?', translation: 'What do you like to do in your free time?' },
                { text: 'Cuéntame sobre tu día', translation: 'Tell me about your day' },
                { text: '¿Has viajado recientemente?', translation: 'Have you traveled recently?' },
                { text: '¿Cuál es tu comida favorita?', translation: 'What\'s your favorite food?' }
            ],
            Advanced: [
                { text: '¿Qué opinas sobre la situación política actual?', translation: 'What do you think about the current political situation?' },
                { text: 'Me gustaría discutir temas filosóficos', translation: 'I\'d like to discuss philosophical topics' },
                { text: '¿Podrías explicarme las diferencias entre el subjuntivo y el indicativo?', translation: 'Could you explain the differences between subjunctive and indicative?' },
                { text: 'Hablemos sobre literatura española contemporánea', translation: 'Let\'s talk about contemporary Spanish literature' }
            ]
        },
        French: {
            Beginner: [
                { text: 'Bonjour! Comment allez-vous?', translation: 'Hello! How are you?' },
                { text: 'Je m\'appelle Marie', translation: 'My name is Marie' },
                { text: 'J\'apprends le français', translation: 'I\'m learning French' },
                { text: 'Parlez-vous anglais?', translation: 'Do you speak English?' }
            ],
            Intermediate: [
                { text: 'Qu\'est-ce que vous faites comme travail?', translation: 'What do you do for work?' },
                { text: 'Parlez-moi de vos passe-temps', translation: 'Tell me about your hobbies' },
                { text: 'Quel est votre plat préféré?', translation: 'What\'s your favorite dish?' },
                { text: 'Avez-vous des projets pour le week-end?', translation: 'Do you have plans for the weekend?' }
            ],
            Advanced: [
                { text: 'Que pensez-vous de la culture française?', translation: 'What do you think about French culture?' },
                { text: 'Discutons de littérature française', translation: 'Let\'s discuss French literature' },
                { text: 'Je voudrais améliorer mon usage du subjonctif', translation: 'I\'d like to improve my use of the subjunctive' },
                { text: 'Parlons de philosophie existentialiste', translation: 'Let\'s talk about existentialist philosophy' }
            ]
        }
    };

    const defaultStarters: Record<SkillLevel, Array<{ text: string; translation: string }>> = {
        Beginner: [
            { text: `Hello in ${language}`, translation: 'Greeting' },
            { text: `My name is...`, translation: 'Introduction' },
            { text: `How are you?`, translation: 'Asking about wellbeing' },
            { text: `I want to learn ${language}`, translation: 'Statement of intent' }
        ],
        Intermediate: [
            { text: `Tell me about your day`, translation: 'Conversation starter' },
            { text: `What are your hobbies?`, translation: 'Personal interests' },
            { text: `What\'s your favorite...?`, translation: 'Preferences' },
            { text: `Have you been to...?`, translation: 'Travel experience' }
        ],
        Advanced: [
            { text: `Let\'s discuss current events`, translation: 'Deep conversation' },
            { text: `What\'s your opinion on...?`, translation: 'Opinion exchange' },
            { text: `Can you explain the grammar of...?`, translation: 'Grammar inquiry' },
            { text: `Let\'s talk about culture`, translation: 'Cultural discussion' }
        ]
    };

    return starters[language]?.[level] || defaultStarters[level];
}
