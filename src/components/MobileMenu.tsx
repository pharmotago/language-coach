import React from 'react';
import { Menu, X, Home, BarChart3, Shield, Settings as SettingsIcon, Users } from 'lucide-react';
import { UserProfile } from '@/components/UserProfile';

interface MobileMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onNavigate: (action: 'home' | 'stats' | 'emergency' | 'settings' | 'community') => void;
    currentPage: string;
    totalXp: number;
}
const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'emergency', label: 'Emergency', icon: Shield },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
];

export function MobileMenu({ isOpen, onToggle, onNavigate, currentPage, totalXp }: MobileMenuProps) {
    return (
        <>
            {/* Hamburger button */}
            <button
                onClick={onToggle}
                className="lg:hidden fixed bottom-6 left-6 z-50 p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-2xl border border-slate-700"
                aria-label="Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                    onClick={onToggle}
                />
            )}

            {/* Slide-out menu */}
            <div className={`
        lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-slate-950 border-r border-slate-800 z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="mb-8">
                        <UserProfile totalXp={totalXp} className="w-full bg-slate-900/50" />
                    </div>

                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Navigation</h2>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id as any);
                                        onToggle();
                                    }}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive
                                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                                            : 'hover:bg-slate-800 text-slate-300'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}
