/**
 * Keyboard Shortcuts Component & Hook
 */

'use client';

import { useEffect } from 'react';

export interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
                const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
                const altMatch = shortcut.alt ? event.altKey : !event.altKey;
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

                if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
}

// Language Coach specific shortcuts
export function useLanguageCoachShortcuts(callbacks: {
    onSend?: () => void;
    onReset?: () => void;
    onScenarios?: () => void;
    onFocusInput?: () => void;
    onToggleVoice?: () => void;
}) {
    const shortcuts: KeyboardShortcut[] = [
        {
            key: 'Enter',
            ctrl: true,
            action: () => callbacks.onSend?.(),
            description: 'Send message'
        },
        {
            key: 'k',
            ctrl: true,
            action: () => callbacks.onFocusInput?.(),
            description: 'Focus input'
        },
        {
            key: 's',
            ctrl: true,
            shift: true,
            action: () => callbacks.onScenarios?.(),
            description: 'Open scenarios'
        },
        {
            key: 'r',
            ctrl: true,
            shift: true,
            action: () => callbacks.onReset?.(),
            description: 'Reset conversation'
        },
        {
            key: 'v',
            ctrl: true,
            shift: true,
            action: () => callbacks.onToggleVoice?.(),
            description: 'Toggle voice input'
        },
        {
            key: '/',
            action: () => callbacks.onFocusInput?.(),
            description: 'Quick focus input'
        }
    ];

    useKeyboardShortcuts(shortcuts);

    return shortcuts;
}

// Shortcuts Help Modal Component
export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: KeyboardShortcut[] }) {
    return (
        <div className= "space-y-2" >
        {
            shortcuts.map((shortcut, index) => (
                <div
                    key= { index }
                    className = "flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                >
                <span className="text-sm text-slate-300" > { shortcut.description } </span>
            < div className = "flex items-center gap-1" >
            {
                shortcut.ctrl && (
                    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400 border border-slate-700">
                        Ctrl
                        </kbd>
                        )
        }
    {
        shortcut.shift && (
            <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400 border border-slate-700" >
                Shift
                </kbd>
                        )
    }
    {
        shortcut.alt && (
            <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400 border border-slate-700" >
                Alt
                </kbd>
                        )
    }
    <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400 border border-slate-700" >
        { shortcut.key.toUpperCase() }
        </kbd>
        </div>
        </div>
            ))
}
</div>
    );
}
