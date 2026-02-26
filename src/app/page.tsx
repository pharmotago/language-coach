/**
 * Language Coach App - Home
 */

import { LanguageCoach } from '@/components/LanguageCoach';
import { LanguageCoachErrorBoundary } from '@/components/LanguageCoachErrorBoundary';

export const metadata = {
    title: 'Practice & Learn',
    description: 'Master your target language with AI-powered conversation and real-time guidance.'
};

export default function Home() {
    return (
        <LanguageCoachErrorBoundary>
            <LanguageCoach />
        </LanguageCoachErrorBoundary>
    );
}
