import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const stoicQuotes = [
    {
        text: "You have power over your mind, not outside events. Realize this, and you will find strength.",
        author: "Marcus Aurelius",
        work: "Meditations"
    },
    {
        text: "It's not what happens to you, but how you react to it that matters.",
        author: "Epictetus",
        work: "Enchiridion"
    },
    {
        text: "We suffer more often in imagination than in reality.",
        author: "Seneca",
        work: "Letters from a Stoic"
    },
    {
        text: "The best revenge is to be unlike him who performed the injury.",
        author: "Marcus Aurelius",
        work: "Meditations"
    },
    {
        text: "If it is not right, do not do it. If it is not true, do not say it.",
        author: "Marcus Aurelius",
        work: "Meditations"
    },
    {
        text: "He who fears death will never do anything worthy of a man who is alive.",
        author: "Seneca",
        work: "Letters from a Stoic"
    },
    {
        text: "Waste no more time arguing what a good man should be. Be one.",
        author: "Marcus Aurelius",
        work: "Meditations"
    },
    {
        text: "The happiness of your life depends upon the quality of your thoughts.",
        author: "Marcus Aurelius",
        work: "Meditations"
    },
    {
        text: "First say to yourself what you would be; and then do what you have to do.",
        author: "Epictetus",
        work: "Discourses"
    },
    {
        text: "No person has the power to have everything they want, but it is in their power not to want what they don't have.",
        author: "Seneca",
        work: "Letters from a Stoic"
    }
];

export function DailyQuote() {
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Use date as seed for consistent "daily" quote
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        setQuoteIndex(seed % stoicQuotes.length);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setQuoteIndex((prev) => (prev + 1) % stoicQuotes.length);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const quote = stoicQuotes[quoteIndex];

    return (
        <div className="bg-gradient-to-br from-amber-900/20 to-slate-900 rounded-2xl p-6 border border-amber-500/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Quote className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Daily Wisdom</h3>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="p-1.5 hover:bg-slate-800/50 rounded-full transition-colors group"
                        title="New quote"
                    >
                        <RefreshCw className={`w-4 h-4 text-amber-500/60 group-hover:text-amber-500 transition-all ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <blockquote className="mb-4">
                    <p className="text-lg text-slate-100 leading-relaxed italic font-serif">
                        "{quote.text}"
                    </p>
                </blockquote>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <p className="text-amber-400 font-semibold">— {quote.author}</p>
                        <p className="text-slate-500 text-xs italic">{quote.work}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
