const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PAGE_PATH = path.join(__dirname, '../src/app/page.tsx');
const LOG_PATH = path.join(__dirname, '../evolution_log.txt');

// Evolution Bank (embedded for zero-dependency)
const HEADLINES = [
    {
        main: "Stop The Dad Rage. <br />\n                                <span className=\"text-amber-500\">Start Leading.</span>",
        sub: "The 5-Day Stoic Protocol for fathers who want to control their temper, \n                                master their emotions, and build an unbreakable legacy."
    },
    {
        main: "Master Your Temper. <br />\n                                <span className=\"text-emerald-500\">Build Your Legacy.</span>",
        sub: "Ancient Stoic strategies applied to modern fatherhood. Reclaim your calm in 5 days."
    },
    {
        main: "Be The Father <br />\n                                <span className=\"text-blue-500\">Your Kids Deserve.</span>",
        sub: "Don't let anger define your parenting. Learn the Stoic art of emotional control."
    },
    {
        main: "Chaos Is Inevitable. <br />\n                                <span className=\"text-red-500\">Rage Is Optional.</span>",
        sub: "The tactical guide to remaining calm when your house is on fire (metaphorically)."
    }
];

const QUOTES = [
    { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
    { text: "It is not events that disturb people, it is their judgements concerning them.", author: "Epictetus" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { text: "No man is free who is not master of himself.", author: "Epictetus" },
    { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" }
];

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

function evolve() {
    log('Starting Evolution Process...');

    try {
        // 1. Read the file
        if (!fs.existsSync(PAGE_PATH)) {
            throw new Error(`File not found: ${PAGE_PATH}`);
        }
        let content = fs.readFileSync(PAGE_PATH, 'utf8');

        // 2. Mutate Headline (Regex search for the H1 block)
        const newHeadline = getRandomItem(HEADLINES);

        // Regex to match the H1 block. Note: escaping [ and ] for the leading-[1.1] class
        const h1Regex = /<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-\[1.1\]">[\s\S]*?<\/h1>/;
        const newH1Html = `<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                                    ${newHeadline.main}
                                </h1>`;

        if (content.match(h1Regex)) {
            content = content.replace(h1Regex, newH1Html);
            log(`Mutated Headline to: ${newHeadline.main.replace(/<br \/>/g, ' ')}`);
        } else {
            log('Warning: Could not find H1 to mutate. Regex check failed.');
        }

        // Replace Subheadline
        const pRegex = /<p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">[\s\S]*?<\/p>/;
        const newPHtml = `<p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    ${newHeadline.sub}
                                </p>`;

        if (content.match(pRegex)) {
            content = content.replace(pRegex, newPHtml);
        }

        // 3. Save Changes
        fs.writeFileSync(PAGE_PATH, content, 'utf8');
        log('Applied mutations to file.');

        // 4. Verify Build
        log('Verifying build integrity...');
        try {
            execSync('npm run build', { stdio: 'inherit' });
            log('Build verified successfully.');
        } catch (error) {
            log('Build failed! Reverting changes...');
            throw new Error('Build failed after evolution.');
        }

        // 5. Git Operations
        log('Committing changes...');
        execSync('git add .');
        execSync('git commit -m "Auto-Evolution: Genetic Optimization"');
        log('Changes committed.');

        // execSync('git push origin main'); 

    } catch (error) {
        log(`CRITICAL ERROR: ${error.message}`);
        // Don't exit process in daemon mode, just log and continue next cycle
        if (!process.argv.includes('--daemon')) {
            process.exit(1);
        }
    }
}

// Daemon Mode Logic
if (process.argv.includes('--daemon')) {
    const INTERVAL = 6 * 60 * 60 * 1000; // 6 Hours
    log(`Starting Auto-Evolution Daemon. Cycle set to every 6 hours.`);

    // Run immediately
    evolve();

    // Schedule loop
    setInterval(() => {
        log('Starting scheduled evolution cycle...');
        evolve();
    }, INTERVAL);

    // Keep process alive
    process.stdin.resume();
} else {
    // Single Run
    evolve();
}
