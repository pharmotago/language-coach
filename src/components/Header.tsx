import React from 'react';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-amber-500" />
        <h1 className="text-lg font-bold text-slate-100 tracking-tight">The Stoic Dad</h1>
      </div>
    </header>
  );
}
