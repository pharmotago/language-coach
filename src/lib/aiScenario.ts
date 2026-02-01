import { Scenario, SkillLevel } from '@/types/languageTypes';

import { scenarioModel } from '@/lib/gemini';

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
        const result = await scenarioModel.generateContent(systemPrompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);

        return {
            id: data.id || `custom-${Date.now()}`,
            title: data.title,
            description: data.description,
            context: data.context,
            difficulty: data.difficulty as SkillLevel,
            icon: data.icon || 'Sparkles'
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
