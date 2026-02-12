/**
 * Language Coach Page - WITH ERROR BOUNDARY
 */

import { LanguageCoach } from '@/components/LanguageCoach';
import { LanguageCoachErrorBoundary } from '@/components/LanguageCoachErrorBoundary';
import { SoundProvider } from '@/contexts/SoundContext';

export const metadata = {
    title: 'Immersion Session',
    description: 'Deep immersion into your target language with an AI Language Coach.'
};

export default function LanguagePage() {
    return (
        <LanguageCoachErrorBoundary>
            <SoundProvider>
                <LanguageCoach />
            </SoundProvider>
        </LanguageCoachErrorBoundary>
    );
}
