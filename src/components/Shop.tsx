'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Zap, Palette, Lock, Check } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ShopItem } from '@/types/languageTypes';
import { useSound } from '@/contexts/SoundContext';

// Mock Shop Inventory
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'streak-freeze',
        name: 'Streak Freeze',
        description: 'Pause your streak for one day if you miss a lesson.',
        cost: 200,
        type: 'powerup',
        icon: 'Zap',
        purchased: false
    },
    {
        id: 'gold-theme',
        name: 'Midas Touch',
        description: 'Unlock the exclusive Gold & Obsidian color theme.',
        cost: 1000,
        type: 'theme',
        icon: 'Palette',
        purchased: false
    },
    {
        id: 'avatar-cyber',
        name: 'Cyberpunk Avatar',
        description: 'A neon-infused profile avatar to show off your style.',
        cost: 500,
        type: 'avatar',
        icon: 'Star',
        purchased: false
    },
    {
        id: 'avatar-samurai',
        name: 'Ronin Avatar',
        description: 'The way of the warrior. Legendary avatar frame.',
        cost: 800,
        type: 'avatar',
        icon: 'Star',
        purchased: false
    }
];

export function Shop() {
    const { coins, inventory, purchaseItem } = useLanguageStore();
    const { playSound } = useSound();
    const [activeTab, setActiveTab] = useState<'all' | 'powerup' | 'avatar' | 'theme'>('all');

    const handlePurchase = (item: ShopItem) => {
        if (inventory.includes(item.id)) return;

        const success = purchaseItem(item.id, item.cost);
        if (success) {
            playSound('unlock'); // Cha-ching!
        } else {
            // Shake effect or error sound could go here
        }
    };

    const filteredItems = SHOP_ITEMS.map(item => ({
        ...item,
        purchased: inventory.includes(item.id)
    })).filter(item => activeTab === 'all' || item.type === activeTab);

    return (
        <div className="animate-in fade-in duration-300">
            {/* Shop Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-amber-400" />
                        Item Shop
                    </h2>
                    <p className="text-slate-400 mt-1">Spend your hard-earned LinguaCoins.</p>
                </div>

                <div className="glass-card px-6 py-3 rounded-full flex items-center gap-2 border border-amber-500/30 bg-amber-500/10">
                    <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 font-bold text-xs">
                        $
                    </div>
                    <span className="text-xl font-bold text-amber-400">{coins}</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {(['all', 'powerup', 'avatar', 'theme'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                ? 'bg-amber-500 text-amber-950'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                    const canAfford = coins >= item.cost;

                    return (
                        <div
                            key={item.id}
                            className={`glass-card p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group ${item.purchased
                                    ? 'border-emerald-500/30 bg-emerald-500/5'
                                    : 'border-slate-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10'
                                }`}
                        >
                            {/* Icon & Details */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${item.purchased ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-amber-400'
                                    }`}>
                                    {item.type === 'powerup' && <Zap className="w-6 h-6" />}
                                    {item.type === 'theme' && <Palette className="w-6 h-6" />}
                                    {item.type === 'avatar' && <Star className="w-6 h-6" />}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${item.purchased ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    {item.type}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-white mb-2">{item.name}</h3>
                            <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{item.description}</p>

                            {/* Purchase Button */}
                            <button
                                onClick={() => handlePurchase(item)}
                                disabled={item.purchased || !canAfford}
                                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${item.purchased
                                        ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                                        : canAfford
                                            ? 'btn-primary'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                {item.purchased ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Owned
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xs">🪙</span>
                                        {item.cost}
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
