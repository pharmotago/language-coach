import { Lesson, LanguageConfig, SkillLevel } from '@/types/languageTypes';

// Mock generator for now - in production this would call OpenAI/Anthropic
export async function generateLesson(
    topic: string,
    targetLanguage: LanguageConfig,
    level: SkillLevel
): Promise<Lesson> {

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const id = Date.now().toString();

    // In a real app, this would be dynamic based on the "topic" argument
    return {
        id,
        title: `${topic} 101`,
        topic,
        content: `Here are some key phrases for **${topic}** in ${targetLanguage.name}. Focus on the polite forms and common vocabulary.`,
        generatedAt: new Date(),
        quiz: {
            id: `quiz-${id}`,
            title: `${topic} Quiz`,
            description: `Test your knowledge of ${topic}`,
            difficulty: level,
            completed: false,
            questions: [
                {
                    id: 'q1',
                    type: 'multiple-choice',
                    question: `How do you say "I would like..." related to ${topic} in ${targetLanguage.name}?`,
                    options: ['Quiero...', 'Me gustaría...', 'Dame...', 'Tienes...'],
                    correctAnswer: 'Me gustaría...',
                    explanation: '"Me gustaría" is the polite conditional form commonly used for requests.'
                },
                {
                    id: 'q2',
                    type: 'fill-blank',
                    question: `Complete the phrase: "¿Me puede _____ the menu?" (bring)`,
                    correctAnswer: 'traer',
                    explanation: 'Traer means "to bring".'
                },
                {
                    id: 'q3',
                    type: 'multiple-choice',
                    question: `Which is the most formal way to address a stranger?`,
                    options: ['Tú', 'Usted', 'Vos', 'Che'],
                    correctAnswer: 'Usted',
                    explanation: 'Usted is the formal "you" used with strangers and elders.'
                },
                {
                    id: 'q4',
                    type: 'translate',
                    question: `Translate: "Where is the bathroom?"`,
                    correctAnswer: '¿Dónde está el baño?',
                    explanation: 'Essential phrase for any traveler!'
                },
                {
                    id: 'q5',
                    type: 'multiple-choice',
                    question: `What is the correct response to "Gracias"?`,
                    options: ['De nada', 'Por favor', 'Hola', 'Adios'],
                    correctAnswer: 'De nada',
                    explanation: '"De nada" means "You\'re welcome" (literally "of nothing").'
                }
            ]
        }
    };
}
