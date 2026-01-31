/**
 * Language Coach App - Home
 */

import { LanguageCoach } from '@/components/LanguageCoach';
import { LanguageCoachErrorBoundary } from '@/components/LanguageCoachErrorBoundary';
import { SoundProvider } from '@/contexts/SoundContext';

export const metadata = {
    title: 'Language Immersion Coach | Practice & Learn',
    description: 'Practice your target language with AI-powered conversation and structured feedback'
};

export default function Home() {
    return (
        <LanguageCoachErrorBoundary>
            <SoundProvider>
                <LanguageCoach />
            </SoundProvider>
        </LanguageCoachErrorBoundary>
    );
}
