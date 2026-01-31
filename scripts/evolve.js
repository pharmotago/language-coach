const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PAGE_PATH = path.join(__dirname, '../src/app/page.tsx');
const LOG_PATH = path.join(__dirname, '../evolution_log.txt');

// Evolution Bank - Expanded with 100+ unique variations for 1000x evolution
const HEADLINES = [
    { main: "Speak Like A Native. <br />\n                                <span className=\"text-amber-500\">Master The Language.</span>", sub: "The daily immersion protocol for those who want to reach fluency faster through AI-driven context." },
    { main: "Language Mastery. <br />\n                                <span className=\"text-emerald-500\">Unlock New Worlds.</span>", sub: "Science-backed immersion strategies applied to modern learning. Master phrases in days." },
    { main: "Be The Polyglot <br />\n                                <span className=\"text-blue-500\">The World Deserves.</span>", sub: "Don't let grammar hold you back. Learn the art of natural conversation." },
    { main: "Confidence Is Quiet. <br />\n                                <span className=\"text-red-500\">Fluency Is Loud.</span>", sub: "The tactical guide to remaining calm when speaking a second language in high-pressure situations." }
];

// Content Generation for 1000 Iterations
const ADJECTIVES = ["Fluent", "Legendary", "Unshakable", "Expressive", "Confident", "Tactical", "Native-like", "Modern", "Powerful", "Natural"];
const NOUNS = ["Speaker", "Polyglot", "Communicator", "Learner", "Master", "Voice", "Bridge", "Guide", "Pioneer", "Linguist"];
const COLORS = ["text-amber-500", "text-emerald-500", "text-blue-500", "text-red-500", "text-indigo-400", "text-cyan-400", "text-orange-400", "text-yellow-400", "text-purple-400", "text-rose-400"];

// Helpers
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    try {
        fs.appendFileSync(LOG_PATH, logMessage);
    } catch (e) {
        console.error("Could not write to log file");
    }
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateDynamicHeadline() {
    const adj = getRandomItem(ADJECTIVES);
    const noun = getRandomItem(NOUNS);
    const color = getRandomItem(COLORS);

    // Mix pre-coded headlines with dynamic ones for 1000x variety
    if (Math.random() > 0.5) return getRandomItem(HEADLINES);

    return {
        main: `${adj} ${noun}. <br />\n                                <span className=\"${color}\">Natural Flow.</span>`,
        sub: `Transform your linguistic capabilities through the ${adj.toLowerCase()} art of immersive learning and deep cognitive discipline.`
    };
}

function evolve(skipBuild = false) {
    log('Starting Evolution Process...');

    try {
        if (!fs.existsSync(PAGE_PATH)) throw new Error(`File not found: ${PAGE_PATH}`);
        let content = fs.readFileSync(PAGE_PATH, 'utf8');

        const newHeadline = generateDynamicHeadline();

        const h1Regex = /<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-\[1.1\]">[\s\S]*?<\/h1>/;
        const newH1Html = `<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                                    ${newHeadline.main}
                                </h1>`;

        if (content.match(h1Regex)) {
            content = content.replace(h1Regex, newH1Html);
            log(`Mutated Headline to: ${newHeadline.main.replace(/<br \/>/g, ' ').replace(/\n\s+/g, ' ')}`);
        }

        const pRegex = /<p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">[\s\S]*?<\/p>/;
        const newPHtml = `<p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    ${newHeadline.sub}
                                </p>`;

        if (content.match(pRegex)) {
            content = content.replace(pRegex, newPHtml);
        }

        fs.writeFileSync(PAGE_PATH, content, 'utf8');
        log('Applied mutations to file.');

        if (!skipBuild) {
            log('Verifying build integrity...');
            execSync('npm run build', { stdio: 'ignore' });
            log('Build verified successfully.');
        }

        execSync('git add .');
        execSync('git commit -m "Auto-Evolution: Genetic Optimization Loop"');
        log('Changes committed.');

    } catch (error) {
        log(`CRITICAL ERROR: ${error.message}`);
        if (!process.argv.includes('--daemon') && !process.argv.includes('--batch')) {
            process.exit(1);
        }
    }
}

// Logic for batch runs
async function runBatch(count) {
    log(`🏃 Starting Batch Evolution: ${count} iterations.`);
    for (let i = 1; i <= count; i++) {
        log(`\n--- Cycle ${i}/${count} ---`);
        evolve(true); // Always skip build in batch mode for speed
    }

    log('\n🧬 Batch complete. Running final build verification...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
        log('✅ Final build verified successfully.');
    } catch (e) {
        log('❌ Final build FAILED. Check history.');
    }
}

// CLI Routing
if (process.argv.includes('--batch')) {
    const countIndex = process.argv.indexOf('--batch') + 1;
    const count = parseInt(process.argv[countIndex]) || 10;
    runBatch(count);
} else if (process.argv.includes('--daemon')) {
    const INTERVAL = 6 * 60 * 60 * 1000;
    log(`Starting Auto-Evolution Daemon.`);
    evolve();
    setInterval(() => evolve(), INTERVAL);
    process.stdin.resume();
} else {
    evolve();
}
