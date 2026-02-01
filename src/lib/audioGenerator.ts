/**
 * Procedural Audio Generator
 * Creates ambient soundscapes using pure Web Audio API without external files.
 */

class AudioGenerator {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private activeNodes: AudioNode[] = [];
    private isPlaying: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.3; // Default volume
            }
        }
    }

    private createNoiseBuffer(): AudioBuffer | null {
        if (!this.ctx) return null;
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    private createPinkNoise(buffer: AudioBuffer): AudioBufferSourceNode | null {
        if (!this.ctx) return null;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Brown/Pink filter
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Deep rumble

        noise.connect(filter);
        return noise as any; // Return logic node for connection
    }

    public playAmbience(type: 'cafe' | 'library' | 'street' | 'nature' | 'rain') {
        this.stop();
        if (!this.ctx || !this.masterGain) return;

        // Resume context if suspended (browser requirements)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const t = this.ctx.currentTime;
        const noiseBuffer = this.createNoiseBuffer();
        if (!noiseBuffer) return;

        // Common Setup
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        // Scenario Specifics
        switch (type) {
            case 'cafe':
                // Medium chatter/hums
                filter.type = 'bandpass';
                filter.frequency.value = 800;
                filter.Q.value = 0.5;
                gain.gain.value = 0.15;
                break;
            case 'library':
                // Low rumble quiet
                filter.type = 'lowpass';
                filter.frequency.value = 200;
                gain.gain.value = 0.08;
                break;
            case 'street':
                // Higher pitch noise + rumble
                filter.type = 'highpass';
                filter.frequency.value = 600;
                gain.gain.value = 0.1;
                break;
            case 'nature':
            case 'rain':
                // Pink noise rain
                filter.type = 'lowpass';
                filter.frequency.value = 800;
                gain.gain.value = 0.2;
                break;
            default:
                return;
        }

        noiseSource.start();
        this.activeNodes.push(noiseSource);
        this.isPlaying = true;

        // Fade in
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 2);
    }

    public stop() {
        if (!this.isPlaying) return;

        this.activeNodes.forEach(node => {
            try {
                if (node instanceof AudioBufferSourceNode) {
                    node.stop();
                    node.disconnect();
                }
            } catch (e) { /* ignore */ }
        });
        this.activeNodes = [];
        this.isPlaying = false;
    }

    public setVolume(val: number) {
        if (this.masterGain) {
            this.masterGain.gain.value = val;
        }
    }
}

export const audioGenerator = new AudioGenerator();
