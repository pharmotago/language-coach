import React, { useState } from 'react';
import { Lock, Star, Check, X, CreditCard, ArrowRight } from 'lucide-react';
import { useToast } from './Toast';
import { useSound } from '@/lib/sound';
import { triggerHaptic, HapticPatterns } from '@/lib/haptics';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
}

export function PremiumModal({ isOpen, onClose, onUnlock }: PremiumModalProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const { showToast } = useToast();
    const { play } = useSound();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim().toUpperCase() === 'STOIC2026') {
            onUnlock();
            onClose();
            play('success');
            triggerHaptic(HapticPatterns.success);
            showToast('Premium Access Unlocked! Welcome to the inner circle.', 'success');
        } else {
            setError(true);
            play('lock');
            triggerHaptic(HapticPatterns.error);
            showToast('Invalid access code', 'error');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 w-full max-w-lg rounded-2xl border border-amber-500/30 shadow-2xl relative overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Hero Image / Icon */}
                <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-8 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/20  blur-3xl rounded-full" />
                    <div className="relative z-10 inline-flex p-4 bg-slate-900 rounded-full border border-amber-500/50 mb-4 shadow-xl shadow-amber-500/10">
                        <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Unlock The Full Protocol</h2>
                    <p className="text-amber-200/80 font-medium">Join 5,000+ Stoic Fathers</p>
                </div>

                <div className="p-8">
                    {/* Benefits */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-500/10 rounded-full">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-slate-300">Access to all 10 Advanced Modules</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-500/10 rounded-full">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-slate-300">Tactical audio guides & scripts</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-500/10 rounded-full">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-slate-300">Lifetime updates & community access</span>
                        </div>
                    </div>

                    {/* Access Code Form */}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Enter Access Code
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="STOIC..."
                                className={`flex-1 bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-mono tracking-widest`}
                            />
                            <button
                                type="submit"
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl border border-slate-700 transition-colors"
                            >
                                Unlock
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4 py-4 mb-6">
                        <div className="h-px bg-slate-800 flex-1" />
                        <span className="text-xs text-slate-500 font-medium uppercase">Or</span>
                        <div className="h-px bg-slate-800 flex-1" />
                    </div>

                    {/* CTA */}
                    <a
                        href="https://mcjp.gumroad.com/l/uobtt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-500/20"
                    >
                        <Star className="w-5 h-5 fill-slate-900" />
                        <span>Get Lifetime Access for $29</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
}
