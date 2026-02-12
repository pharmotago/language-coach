
const { aiService } = require('./src/lib/aiService');

console.log("AI Service Type:", aiService.constructor.name);
if (aiService.providers) {
    console.log("Number of providers:", aiService.providers.length);
    aiService.providers.forEach((p, i) => {
        console.log(`Provider ${i}:`, p.name);
        if (p.model) console.log(`  Model:`, p.model);
    });
} else {
    console.log("No providers found in aiService.");
}
