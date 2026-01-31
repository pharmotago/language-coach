'use client';

import React, { useState } from 'react';
import { User, Palette, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

// Simple SVG Avatar Parts
const AVATAR_PARTS = {
    skin: ['#f8d9ce', '#e0b19e', '#a8735e', '#614335', '#ffcc99'],
    bg: ['bg-slate-700', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'],
    eyes: ['normal', 'happy', 'wink', 'glasses'],
    mouth: ['smile', 'grin', 'neutral', 'open'],
};

export function AvatarCustomizer({ onClose }: { onClose: () => void }) {
    const { avatarConfig, updateAvatarConfig, playSound } = useLanguageStore((state: any) => ({
        avatarConfig: state.avatarConfig,
        updateAvatarConfig: state.updateAvatarConfig,
        playSound: state.playSound // Assuming useSound is handled via context, but let's check imports
    }));

    // Actually useSound is a context, let's fix that
    const { playSound: playSfx } = require('@/contexts/SoundContext').useSound();

    const [config, setConfig] = useState(avatarConfig || {
        skinColor: '#f8d9ce',
        bgColor: 'bg-slate-700',
        eyeType: 'normal',
        mouthType: 'smile'
    });

    const handleSave = () => {
        updateAvatarConfig(config);
        playSfx('unlock');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-6 animate-in zoom-in-95 duration-300 relative border border-slate-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <User className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Palette className="w-6 h-6 text-fuchsia-500" />
                    Customize Avatar
                </h2>

                {/* Avatar Preview */}
                <div className="flex justify-center mb-8">
                    <div className={`w-32 h-32 rounded-full ${config.bgColor} border-4 border-slate-800 flex items-center justify-center relative overflow-hidden shadow-xl`}>
                        {/* SVG Avatar Construction */}
                        <svg viewBox="0 0 100 100" className="w-24 h-24">
                            {/* Head */}
                            <circle cx="50" cy="50" r="35" fill={config.skinColor} />

                            {/* Eyes */}
                            {config.eyeType === 'normal' && (
                                <g fill="#1e293b">
                                    <circle cx="35" cy="45" r="4" />
                                    <circle cx="65" cy="45" r="4" />
                                </g>
                            )}
                            {config.eyeType === 'happy' && (
                                <g fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round">
                                    <path d="M 31 45 Q 35 40 39 45" />
                                    <path d="M 61 45 Q 65 40 69 45" />
                                </g>
                            )}
                            {config.eyeType === 'wink' && (
                                <g fill="#1e293b">
                                    <circle cx="35" cy="45" r="4" />
                                    <path d="M 61 45 Q 65 49 69 45" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                                </g>
                            )}

                            {/* Mouth */}
                            {config.mouthType === 'smile' && (
                                <path d="M 35 60 Q 50 70 65 60" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                            )}
                            {config.mouthType === 'grin' && (
                                <path d="M 35 60 Q 50 75 65 60" fill="white" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                            )}
                            {config.mouthType === 'open' && (
                                <circle cx="50" cy="65" r="6" fill="#1e293b" />
                            )}
                        </svg>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-4 mb-8">
                    {/* Background Color */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Background</label>
                        <div className="flex gap-2 justify-center">
                            {AVATAR_PARTS.bg.map(bg => (
                                <button
                                    key={bg}
                                    onClick={() => setConfig({ ...config, bgColor: bg })}
                                    className={`w-8 h-8 rounded-full ${bg} ${config.bgColor === bg ? 'ring-2 ring-white scale-110' : ''} transition-all`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Skin Color */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Skin Tone</label>
                        <div className="flex gap-2 justify-center">
                            {AVATAR_PARTS.skin.map(skin => (
                                <button
                                    key={skin}
                                    onClick={() => setConfig({ ...config, skinColor: skin })}
                                    className={`w-8 h-8 rounded-full border border-slate-600 ${config.skinColor === skin ? 'ring-2 ring-white scale-110' : ''} transition-all`}
                                    style={{ backgroundColor: skin }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setConfig({ ...config, eyeType: getNextOption(config.eyeType, AVATAR_PARTS.eyes) })}
                            className="bg-slate-800 p-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700"
                        >
                            Eyes: {config.eyeType}
                        </button>
                        <button
                            onClick={() => setConfig({ ...config, mouthType: getNextOption(config.mouthType, AVATAR_PARTS.mouth) })}
                            className="bg-slate-800 p-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700"
                        >
                            Mouth: {config.mouthType}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 btn-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Save Look
                    </button>
                </div>
            </div>
        </div>
    );
}

function getNextOption(current: string, options: string[]) {
    const idx = options.indexOf(current);
    return options[(idx + 1) % options.length];
}
