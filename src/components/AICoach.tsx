import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const MARCUS_RESPONSES: Record<string, string[]> = {
    anger: [
        "How much more grievous are the consequences of anger than the causes of it. — Marcus Aurelius",
        "Keep this thought handy when you feel a fit of rage coming on: it isn't manly to be enraged. Rather, gentleness and civility are more human, and therefore manlier. — Marcus Aurelius",
        "Anger, if not restrained, is frequently more hurtful to us than the injury that provokes it. — Seneca"
    ],
    anxiety: [
        "Today I escaped anxiety. Or no, I discarded it, because it was within me, in my own perceptions — not outside. — Marcus Aurelius",
        "We suffer more often in imagination than in reality. — Seneca",
        "Man is not worried by real problems so much as by his imagined anxieties about real problems. — Epictetus"
    ],
    lazy: [
        "At dawn, when you have trouble getting out of bed, tell yourself: 'I have to go to work — as a human being... Is this what I was created for? To huddle under the blankets and stay warm?' — Marcus Aurelius",
        "You are not your body and hair style, but your capacity for choosing well. If your choices are beautiful, so shall you be. — Epictetus"
    ],
    default: [
        "The obstacle is the way.",
        "Focus on what you can control.",
        "Amor Fati - love your fate.",
        "This too shall pass."
    ]
};

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
};

export function AICoach() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Greetings. I am Marcus. What weighs upon your mind?", sender: 'bot' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            analytics.track('ai_coach_opened');
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        analytics.track('ai_message_sent', { length: input.length });

        // Heuristic AI logic
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let responses = MARCUS_RESPONSES.default;

            if (lowerInput.includes('ang') || lowerInput.includes('mad') || lowerInput.includes('rage')) {
                responses = MARCUS_RESPONSES.anger;
            } else if (lowerInput.includes('anx') || lowerInput.includes('worr') || lowerInput.includes('fear')) {
                responses = MARCUS_RESPONSES.anxiety;
            } else if (lowerInput.includes('lazy') || lowerInput.includes('tired') || lowerInput.includes('bed')) {
                responses = MARCUS_RESPONSES.lazy;
            }

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const botMsg: Message = { id: (Date.now() + 1).toString(), text: randomResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Trigger */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 p-4 bg-slate-900 border border-amber-500/50 rounded-full shadow-2xl shadow-amber-500/20 hover:scale-110 transition-transform group"
                >
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    <MessageSquare className="w-6 h-6 text-amber-500 group-hover:text-amber-400" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center">
                                <Bot className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Marcus</h3>
                                <div className="flex items-center gap-1 text-xs text-emerald-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Online
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-amber-600/90 text-white rounded-tr-none'
                                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Consult the Emperor..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-2 bg-amber-600 rounded-xl text-white disabled:opacity-50 hover:bg-amber-500 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
