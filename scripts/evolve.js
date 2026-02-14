import path from 'path';
import { fileURLToPath } from 'url';
import EvolutionEngine from '../../shared-ui/scripts/evolution-engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const engine = new EvolutionEngine({
    projectName: 'Language Coach',
    pagePath: path.join(__dirname, '../src/app/page.tsx'),
    headlines: [
        { main: "Speak Like A Native. <br />\n                                <span className=\"text-amber-500\">Master The Language.</span>", sub: "The daily immersion protocol for those who want to reach fluency faster through AI-driven context." },
        { main: "Language Mastery. <br />\n                                <span className=\"text-emerald-500\">Unlock New Worlds.</span>", sub: "Science-backed immersion strategies applied to modern learning. Master phrases in days." },
        { main: "Be The Polyglot <br />\n                                <span className=\"text-blue-500\">The World Deserves.</span>", sub: "Don't let grammar hold you back. Learn the art of natural conversation." },
        { main: "Confidence Is Quiet. <br />\n                                <span className=\"text-red-500\">Fluency Is Loud.</span>", sub: "The tactical guide to remaining calm when speaking a second language in high-pressure situations." }
    ],
    adjectives: ["Fluent", "Legendary", "Unshakable", "Expressive", "Confident", "Tactical", "Native-like", "Modern", "Powerful", "Natural"],
    nouns: ["Speaker", "Polyglot", "Communicator", "Learner", "Master", "Voice", "Bridge", "Guide", "Pioneer", "Linguist"],
    colors: ["text-amber-500", "text-emerald-500", "text-blue-500", "text-red-500", "text-indigo-400", "text-cyan-400", "text-orange-400", "text-yellow-400", "text-purple-400", "text-rose-400"]
});

// CLI Routing
/* global process */
if (process.argv.includes('--batch')) {
    const countIndex = process.argv.indexOf('--batch') + 1;
    const count = parseInt(process.argv[countIndex]) || 10;
    engine.runBatch(count);
} else if (process.argv.includes('--daemon')) {
    engine.startDaemon();
} else {
    engine.evolve();
}
