import { Scenario, SkillLevel } from '@/types/languageTypes';

import { aiService } from '@/lib/aiCore';

// Real AI generator for custom scenarios
export async function generateScenario(
    prompt: string,
    skillLevel: SkillLevel
): Promise<Scenario> {

    const systemPrompt = `
    Generate a language learning roleplay scenario based on this user request: "${prompt}".
    Target Skill Level: ${skillLevel}.
    
    Output JSON ONLY with these fields:
    - id: string (unique-ish)
    - title: string (short catchy title)
    - description: string (1 sentence summary)
    - context: string (Detailed setting instructions for the AI tutor to act out this roleplay)
    - difficulty: "${skillLevel}"
    - icon: string (A Lucide icon name that fits, e.g. "Coffee", "Briefcase", "Plane", "Ghost", "Heart")
    `;

    try {
        const aiResponse = await aiService.generateResponse({
            messages: [],
            systemPrompt: systemPrompt,
            targetLanguage: 'English', // Neutral as this is for metadata
            skillLevel: skillLevel
        });

        const data = {
            id: `custom-${Date.now()}`,
            title: aiResponse.response, // Fallback if structure varies
            description: aiResponse.translation,
            context: aiResponse.response,
            difficulty: skillLevel,
            icon: 'Sparkles'
        };

        // Note: The tiered response might already be parsed if using JSON adapters
        // Here we adapt the response to the expected scenario structure
        return {
            id: data.id,
            title: aiResponse.response.split('\n')[0].substring(0, 30),
            description: aiResponse.translation || aiResponse.response.substring(0, 100),
            context: aiResponse.response,
            difficulty: skillLevel,
            icon: 'Sparkles'
        };
    } catch (error) {
        console.error("Scenario Generation Error:", error);
        // Fallback only if AI fails entirely
        return {
            id: `fallback-${Date.now()}`,
            title: prompt.length > 20 ? `${prompt.substring(0, 20)}...` : prompt,
            description: `Custom scenario: ${prompt}`,
            context: `You are in a custom roleplay scenario defined by: "${prompt}". The user wants to practice specific vocabulary and interactions related to this topic. Adapt your persona to fit this context perfectly. Level: ${skillLevel}.`,
            difficulty: skillLevel,
            icon: 'Sparkles'
        };
    }
}
