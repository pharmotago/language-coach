import React, { useState, useEffect } from 'react';
import { Settings, X, Volume2, VolumeX, Moon, Sun, Bell, BellOff } from 'lucide-react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserSettings {
    soundEffects: boolean;
    darkMode: boolean;
    notifications: boolean;
    confettiEnabled: boolean;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const [settings, setSettings] = useState<UserSettings>({
        soundEffects: true,
        darkMode: true,
        notifications: true,
        confettiEnabled: true
    });

    useEffect(() => {
        const saved = localStorage.getItem('stoic-dad-settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, [isOpen]);

    const updateSetting = (key: keyof UserSettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('stoic-dad-settings', JSON.stringify(newSettings));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold text-white">Settings</h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3">
                            {settings.soundEffects ? (
                                <Volume2 className="w-5 h-5 text-amber-500" />
                            ) : (
                                <VolumeX className="w-5 h-5 text-slate-500" />
                            )}
                            <div>
                                <h4 className="font-semibold text-white">Sound Effects</h4>
                                <p className="text-xs text-slate-400">Quiz success sounds</p>
                            </div>
                        </div>
                        <button
                            onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.soundEffects ? 'bg-amber-500' : 'bg-slate-700'
                                }`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.soundEffects ? 'translate-x-6' : ''
                                }`} />
                        </button>
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3">
                            {settings.darkMode ? (
                                <Moon className="w-5 h-5 text-blue-400" />
                            ) : (
                                <Sun className="w-5 h-5 text-amber-500" />
                            )}
                            <div>
                                <h4 className="font-semibold text-white">Dark Mode</h4>
                                <p className="text-xs text-slate-400">Currently active</p>
                            </div>
                        </div>
                        <button
                            onClick={() => updateSetting('darkMode', !settings.darkMode)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-blue-500' : 'bg-slate-700'
                                }`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-6' : ''
                                }`} />
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3">
                            {settings.notifications ? (
                                <Bell className="w-5 h-5 text-purple-400" />
                            ) : (
                                <BellOff className="w-5 h-5 text-slate-500" />
                            )}
                            <div>
                                <h4 className="font-semibold text-white">Notifications</h4>
                                <p className="text-xs text-slate-400">Daily reminders</p>
                            </div>
                        </div>
                        <button
                            onClick={() => updateSetting('notifications', !settings.notifications)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-purple-500' : 'bg-slate-700'
                                }`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : ''
                                }`} />
                        </button>
                    </div>

                    {/* Confetti */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎉</span>
                            <div>
                                <h4 className="font-semibold text-white">Confetti Effects</h4>
                                <p className="text-xs text-slate-400">Celebration animations</p>
                            </div>
                        </div>
                        <button
                            onClick={() => updateSetting('confettiEnabled', !settings.confettiEnabled)}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${settings.confettiEnabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-700'
                                }`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${settings.confettiEnabled ? 'translate-x-6' : ''
                                }`} />
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 border-t border-slate-800 bg-red-900/5">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Danger Zone</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-white">Reset Progress</h4>
                            <p className="text-xs text-slate-400">Clear all data and start over</p>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure? This cannot be undone.')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
                        >
                            Reset Data
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    <p className="text-xs text-slate-400 text-center">
                        Settings are saved automatically to your browser
                    </p>
                </div>
            </div>
        </div >
    );
}
