/**
 * Language Coach Page
 */

import { LanguageCoach } from '@/components/LanguageCoach';
import { LanguageCoachErrorBoundary } from '@/components/LanguageCoachErrorBoundary';

export const metadata = {
    title: 'Immersion Session',
    description: 'Deep immersion into your target language with an AI Language Coach.'
};

export default function LanguagePage() {
    return (
        <LanguageCoachErrorBoundary>
            <LanguageCoach />
        </LanguageCoachErrorBoundary>
    );
}
