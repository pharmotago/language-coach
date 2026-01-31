import { Scenario, SkillLevel } from '@/types/languageTypes';

// Mock generator for custom scenarios
export async function generateScenario(
    prompt: string,
    skillLevel: SkillLevel
): Promise<Scenario> {

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const id = `custom-${Date.now()}`;

    // In a real app, uses LLM to expand the prompt into a full context
    return {
        id,
        title: prompt.length > 20 ? `${prompt.substring(0, 20)}...` : prompt,
        description: `Custom scenario: ${prompt}`,
        context: `You are in a custom roleplay scenario defined by: "${prompt}". The user wants to practice specific vocabulary and interactions related to this topic. Adapt your persona to fit this context perfectly. Level: ${skillLevel}.`,
        difficulty: skillLevel,
        icon: 'Sparkles' // Generic icon for custom
    };
}
