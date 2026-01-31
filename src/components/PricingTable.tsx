import React from 'react';
import { Check, X, Crown } from 'lucide-react';

export function PricingTable() {
    return (
        <div className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Path</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Most fathers stumble through blindly. The Stoic Dad follows a protocol.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                    <h3 className="text-xl font-bold text-slate-300 mb-2">The Wanderer</h3>
                    <div className="text-4xl font-bold text-white mb-6">$0</div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-400">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span>Module 1 Access</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-400">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span>Basic Streak Tracking</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-500 opacity-50">
                            <X className="w-5 h-5" />
                            <span>Advanced Modules (2-10)</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-500 opacity-50">
                            <X className="w-5 h-5" />
                            <span>Audio Guides</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-500 opacity-50">
                            <X className="w-5 h-5" />
                            <span>Community Access</span>
                        </li>
                    </ul>
                    <button className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl pointer-events-none opacity-50">
                        Current Plan
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="relative bg-slate-900 rounded-2xl p-8 border border-amber-500/50 shadow-2xl shadow-amber-500/10 transform md:scale-105">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" /> MOST POPULAR
                    </div>

                    <h3 className="text-xl font-bold text-amber-500 mb-2">The Stoic Patriarch</h3>
                    <div className="flex items-end gap-2 mb-6">
                        <div className="text-4xl font-bold text-white">$29</div>
                        <div className="text-lg text-slate-500 line-through mb-1">$99</div>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span>Full Access (Modules 1-10)</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span>Tactical Audio Guides</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span>"Emergency Toolkit" Lifetime Access</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span>Future Updates Included</span>
                        </li>
                    </ul>

                    <a
                        href="https://mcjp.gumroad.com/l/uobtt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-center transition-colors shadow-lg hover:shadow-xl"
                    >
                        Unlock Full Access
                    </a>

                    <p className="text-xs text-center text-slate-500 mt-4">One-time payment. No subscription.</p>
                </div>
            </div>
        </div>
    );
}
