/**
 * Voice Synthesis Service
 * Wrapper around Web Speech API for Text-to-Speech
 */

export interface VoiceOptions {
    rate?: number;  // 0.1 to 10
    pitch?: number; // 0 to 2
    volume?: number; // 0 to 1
    voice?: SpeechSynthesisVoice | null;
}

class VoiceService {
    private synthesis: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];

    constructor() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this.synthesis = window.speechSynthesis;
            this.loadVoices(); // Initial load

            // Chrome loads voices asynchronously
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    private loadVoices() {
        if (!this.synthesis) return;
        this.voices = this.synthesis.getVoices();
    }

    public getVoices(): SpeechSynthesisVoice[] {
        return this.voices;
    }

    public getVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
        // Try to match exact locale first (e.g. 'es-ES')
        let voice = this.voices.find(v => v.lang === langCode);

        // Fallback to language code only (e.g. 'es')
        if (!voice) {
            const shortCode = langCode.split('-')[0];
            voice = this.voices.find(v => v.lang.startsWith(shortCode));
        }

        // Prefer "Google" voices if available (usually higher quality on Chrome)
        if (!voice && this.voices.length > 0) {
            const premiumVoice = this.voices.find(v => v.lang.startsWith(langCode.split('-')[0]) && v.name.includes('Google'));
            if (premiumVoice) return premiumVoice;
        }

        return voice || this.voices[0] || null;
    }

    public speak(text: string, langCode: string, options: VoiceOptions = {}) {
        if (!this.synthesis) return;

        // Cancel current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        const voice = options.voice || this.getVoiceForLanguage(langCode);
        if (voice) {
            utterance.voice = voice;
        }

        this.synthesis.speak(utterance);
    }

    public cancel() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }
}

// Singleton instance
export const voiceService = new VoiceService();
