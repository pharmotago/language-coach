/**
 * Sound Assets & Generation
 */

// We will use AudioContext for procedural sounds to keep external deps low
// But we'll structure it to allow file assets later if needed.

export type SoundType = 'send' | 'receive' | 'success' | 'error' | 'click' | 'hover' | 'unlock';

class SoundService {
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;
    private volume: number = 0.5;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
        }
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    public setVolume(vol: number) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
        if (!this.audioContext || this.isMuted) return;

        // Resume context if suspended (browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + startTime);

        gain.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(this.audioContext.currentTime + startTime);
        osc.stop(this.audioContext.currentTime + startTime + duration);
    }

    public play(sound: SoundType) {
        if (!this.audioContext) return;

        switch (sound) {
            case 'click':
                this.playTone(800, 'sine', 0.05); // Short tick
                break;
            case 'hover':
                // Very subtle, maybe skip or just very low volume/freq
                // this.playTone(400, 'sine', 0.02);
                break;
            case 'send':
                // Rising pitch "Whoosh"
                this.playTone(400, 'sine', 0.1);
                this.playTone(600, 'sine', 0.1, 0.05);
                this.playTone(800, 'triangle', 0.15, 0.1);
                break;
            case 'receive':
                // Soft chime "Ding-dong"
                this.playTone(600, 'sine', 0.2);
                this.playTone(400, 'sine', 0.4, 0.15);
                break;
            case 'success':
                // Major chord equivalent
                this.playTone(523.25, 'sine', 0.2); // C5
                this.playTone(659.25, 'sine', 0.2, 0.1); // E5
                this.playTone(783.99, 'sine', 0.4, 0.2); // G5
                break;
            case 'error':
                // Dissonant / Low thud
                this.playTone(150, 'sawtooth', 0.2);
                this.playTone(140, 'sawtooth', 0.2, 0.1);
                break;
            case 'unlock':
                // Magical arpeggio
                const now = 0;
                [440, 554, 659, 880, 1108, 1318, 1760].forEach((freq, i) => {
                    this.playTone(freq, 'sine', 0.3, now + (i * 0.08));
                });
                break;
        }
    }
}

export const soundService = new SoundService();
