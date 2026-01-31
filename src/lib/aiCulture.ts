import { CultureNote, LanguageConfig } from '@/types/languageTypes';

// Mock generation for cultural insights
export function generateCultureNote(
    text: string,
    language: LanguageConfig
): CultureNote | null {
    // In a real app, this would use AI to analyze the message for cultural nuances
    // For now, we return mock data based on keywords

    const lowerText = text.toLowerCase();

    // SPANISH CULTURE
    if (language.name === 'Spanish') {
        if (lowerText.includes('usted') || lowerText.includes('su ')) {
            return {
                title: "The Power of 'Usted'",
                content: "You used 'Usted' (formal you). In many Latin American countries, this is essential for showing respect to elders or strangers. However, in Spain, 'Tú' is used much more freely!",
                icon: "Handshake",
                tags: ["Formality", "Respect"]
            };
        }
        if (lowerText.includes('tapas') || lowerText.includes('comer')) {
            return {
                title: "Tapas Culture",
                content: "In Spain, 'ir de tapas' isn't just eating—it's a social ritual of hopping between bars, having a drink and a small plate at each one.",
                icon: "Utensils",
                tags: ["Food", "Social"]
            };
        }
        if (lowerText.includes('siesta') || lowerText.includes('tarde')) {
            return {
                title: "The Siesta Myth",
                content: "While famous, the 'siesta' is less common in modern cities. However, many shops still close between 2 PM and 5 PM for a long lunch break.",
                icon: "Sun",
                tags: ["Lifestyle"]
            };
        }
    }

    // FRENCH CULTURE
    if (language.name === 'French') {
        if (lowerText.includes('monsieur') || lowerText.includes('madame')) {
            return {
                title: "La Politesse",
                content: "French social interactions rely heavily on 'Bonjour' and 'Monsieur/Madame'. Entering a shop without greeting the owner is considered quite rude.",
                icon: "MessageCircle",
                tags: ["Etiquette"]
            };
        }
        if (lowerText.includes('café') || lowerText.includes('vin')) {
            return {
                title: "Terrace Culture",
                content: "Sitting at a café terrace is a national sport in France. It's perfectly normal to nurse a single coffee for an hour while people-watching.",
                icon: "Coffee",
                tags: ["Lifestyle"]
            };
        }
    }

    // JAPANESE CULTURE
    if (language.name === 'Japanese') {
        if (lowerText.includes('san') || lowerText.includes('sama')) {
            return {
                title: "Honorifics (-san)",
                content: "Adding '-san' is the standard polite way to address others. Never use it for yourself! For customers or deities, use '-sama'.",
                icon: "User",
                tags: ["Respect", "Grammar"]
            };
        }
        if (lowerText.includes('arigato') || lowerText.includes('sumimasen')) {
            return {
                title: "Sumimasen vs. Arigato",
                content: "'Sumimasen' means 'Excuse me', 'Sorry', AND 'Thank you'. It acknowledges the trouble someone went through for you.",
                icon: "HeartHandshake",
                tags: ["Politeness"]
            };
        }
    }

    // Random generic note if no keywords match (for demo purposes 20% of the time)
    if (Math.random() > 0.8) {
        return {
            title: `Did you know? (${language.name})`,
            content: `Learning ${language.name} opens the door to understanding the rich history and traditions of its speakers. Language and culture are inseparable!`,
            icon: "Globe",
            tags: ["General"]
        };
    }

    return null;
}
