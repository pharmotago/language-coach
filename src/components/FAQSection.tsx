import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export function FAQSection() {
    return (
        <div className="py-20 border-t border-slate-900/50">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                <FAQItem
                    question="Is this a subscription?"
                    answer="No. This is a one-time purchase of $29. You get lifetime access to all modules and future updates. No recurring fees, ever."
                />
                <FAQItem
                    question="How long does the protocol take?"
                    answer="The core curriculum is designed as a 5-day intensive path, but you can go at your own pace. Most dads spend 10-15 minutes per day reading and reflecting."
                />
                <FAQItem
                    question="Do I need to be a 'Stoic' to use this?"
                    answer="Not at all. This is practical philosophy, not academic theory. We use Stoic principles (Emotional Control, Leadership, Resilience) applied specifically to modern fatherhood challenges."
                />
                <FAQItem
                    question="What if it doesn't work for me?"
                    answer="We offer a 30-day money-back guarantee. If you don't feel more in control of your emotions and parenting, simply email us for a full refund."
                />
            </div>

            {/* Guarantee Badge */}
            <div className="mt-16 flex flex-col items-center text-center p-8 bg-slate-900/30 rounded-2xl border border-slate-800">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">100% Ironclad Guarantee</h3>
                <p className="text-slate-400 max-w-md">
                    Try The Stoic Dad Protocol risk-free. If you don't see a change in your patience and leadership within 30 days, we'll refund every penny.
                </p>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <span className="font-semibold text-slate-200">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-slate-400 border-t border-slate-800/50">
                    {answer}
                </div>
            )}
        </div>
    );
}
