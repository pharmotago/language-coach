import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                404
            </h1>
            <h2 className="text-2xl font-bold text-white mb-2">Lost in Translation?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                We couldn't translate this URL into a valid page. Let's get you back to the lesson plan.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-1"
            >
                <Home className="w-5 h-5" />
                Back to Dashboard
            </Link>
        </div>
    );
}
