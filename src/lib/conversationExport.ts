/**
 * Conversation Export Utility
 */

import { Message } from '@/types/languageTypes';

export interface ExportOptions {
    format: 'txt' | 'json' | 'md';
    includeFeedback?: boolean;
    includeTranslations?: boolean;
    includeTimestamps?: boolean;
}

export function exportConversation(
    messages: Message[],
    languageName: string,
    skillLevel: string,
    options: ExportOptions = { format: 'txt', includeFeedback: true, includeTranslations: true }
) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `language-practice-${languageName.toLowerCase()}-${timestamp}`;

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (options.format) {
        case 'json':
            content = JSON.stringify({
                language: languageName,
                level: skillLevel,
                date: new Date().toISOString(),
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content,
                    translation: options.includeTranslations ? m.translation : undefined,
                    feedback: options.includeFeedback ? m.feedback : undefined,
                    timestamp: options.includeTimestamps ? m.timestamp : undefined
                }))
            }, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;

        case 'md':
            content = generateMarkdownExport(messages, languageName, skillLevel, options);
            mimeType = 'text/markdown';
            extension = 'md';
            break;

        case 'txt':
        default:
            content = generateTextExport(messages, languageName, skillLevel, options);
            mimeType = 'text/plain';
            extension = 'txt';
            break;
    }

    // Create download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function generateTextExport(
    messages: Message[],
    languageName: string,
    skillLevel: string,
    options: ExportOptions
): string {
    let output = `Language Practice: ${languageName} (${skillLevel} Level)\n`;
    output += `Date: ${new Date().toLocaleString()}\n`;
    output += `${'='.repeat(60)}\n\n`;

    messages.forEach((msg, index) => {
        const role = msg.role === 'user' ? 'You' : 'Coach';
        output += `[${role}]\n`;
        output += `${msg.content}\n`;

        if (options.includeTranslations && msg.translation) {
            output += `Translation: ${msg.translation}\n`;
        }

        if (options.includeFeedback && msg.feedback) {
            output += `\n--- Feedback ---\n`;
            if (msg.feedback.correction) {
                output += `Correction: ${msg.feedback.correction}\n`;
            }
            output += `Polish: ${msg.feedback.polish}\n`;
            output += `Word of the Day: ${msg.feedback.wordOfTheDay.term} - ${msg.feedback.wordOfTheDay.translation}\n`;
            output += `Usage: ${msg.feedback.wordOfTheDay.usage}\n`;
        }

        if (options.includeTimestamps) {
            output += `Time: ${new Date(msg.timestamp).toLocaleTimeString()}\n`;
        }

        output += `\n${'-'.repeat(60)}\n\n`;
    });

    return output;
}

function generateMarkdownExport(
    messages: Message[],
    languageName: string,
    skillLevel: string,
    options: ExportOptions
): string {
    let output = `# Language Practice: ${languageName}\n\n`;
    output += `**Level:** ${skillLevel}  \n`;
    output += `**Date:** ${new Date().toLocaleString()}  \n\n`;
    output += `---\n\n`;

    messages.forEach((msg, index) => {
        const role = msg.role === 'user' ? '👤 **You**' : '🤖 **Coach**';
        output += `## ${role}\n\n`;
        output += `${msg.content}\n\n`;

        if (options.includeTranslations && msg.translation) {
            output += `> 🌐 *Translation:* ${msg.translation}\n\n`;
        }

        if (options.includeFeedback && msg.feedback) {
            output += `### 📝 Feedback\n\n`;

            if (msg.feedback.correction) {
                output += `**⚠️ Correction:**  \n${msg.feedback.correction}\n\n`;
            }

            output += `**✨ Polish (Sound More Native):**  \n${msg.feedback.polish}\n\n`;

            output += `**📚 Word of the Day:**  \n`;
            output += `- **${msg.feedback.wordOfTheDay.term}** - *${msg.feedback.wordOfTheDay.translation}*\n`;
            output += `- Usage: "${msg.feedback.wordOfTheDay.usage}"\n\n`;
        }

        if (options.includeTimestamps) {
            output += `*${new Date(msg.timestamp).toLocaleTimeString()}*\n\n`;
        }

        output += `---\n\n`;
    });

    return output;
}
