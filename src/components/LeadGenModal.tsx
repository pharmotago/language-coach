import React, { useState, useEffect } from 'react';
import { Mail, X, ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export function LeadGenModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [hasTriggered, setHasTriggered] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Trigger 1: Time passed (60s)
        const timer = setTimeout(() => {
            if (!hasTriggered && !localStorage.getItem('lead_captured')) {
                triggerModal();
            }
        }, 60000);

        // Trigger 2: Exit Intent (Desktop only)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggered && !localStorage.getItem('lead_captured')) {
                triggerModal();
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasTriggered]);

    const triggerModal = () => {
        setIsOpen(true);
        setHasTriggered(true);
        analytics.track('lead_gen_opened');
    };

    const handleClose = () => {
        setIsOpen(false);
        // Don't show again for this session immediately, maybe expire in 1 day
        // For now, simple suppression
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Mock API Call
        console.log('Lead Captured:', email);
        analytics.track('lead_gen_submitted', { email });

        localStorage.setItem('lead_captured', 'true');
        setIsSubmitted(true);

        setTimeout(() => {
            setIsOpen(false);
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 overflow-hidden">
                {!isSubmitted ? (
                    <>
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="inline-flex p-3 bg-amber-500/10 rounded-full mb-4">
                                <Mail className="w-8 h-8 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Wait! Don't Leave Empty Handed.</h2>
                            <p className="text-slate-400">
                                Get our free <strong>"Stoic Morning Routine" PDF</strong>. Used by 10,000+ fathers to start the day with focus.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                Send Me The PDF <ArrowRight className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-center text-slate-600">
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="inline-flex p-3 bg-emerald-500/10 rounded-full mb-4 animate-in zoom-in">
                            <ArrowRight className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Check Your Inbox!</h2>
                        <p className="text-slate-400">
                            The PDF is on its way.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
