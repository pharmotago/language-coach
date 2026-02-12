const fs = require('fs');
const path = require('path');
const https = require('https');

const apiKey = process.argv[2];

if (!apiKey) {
    console.error('Usage: node scripts/list_models.js <API_KEY>');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', json.error);
            } else if (json.models) {
                console.log('Available Models:');
                json.models.forEach(model => {
                    // Filter for "generateContent" support
                    if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${model.name.replace('models/', '')} (${model.displayName})`);
                    }
                });
            } else {
                console.log('No models found or unexpected response:', json);
            }
        } catch (e) {
            console.error('Error parsing response:', e.message);
            console.log('Raw response:', data);
        }
    });

}).on('error', (e) => {
    console.error('Request error:', e.message);
});
