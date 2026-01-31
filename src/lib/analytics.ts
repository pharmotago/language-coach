type AnalyticsEvent = {
    name: string;
    properties?: Record<string, any>;
    timestamp: number;
};

class AnalyticsEngine {
    private queue: AnalyticsEvent[] = [];
    private isInitialized = false;

    init() {
        if (typeof window === 'undefined') return;
        this.isInitialized = true;
        this.flush();
    }

    track(name: string, properties?: Record<string, any>) {
        if (typeof window === 'undefined') return;

        const event: AnalyticsEvent = {
            name,
            properties,
            timestamp: Date.now(),
        };

        this.queue.push(event);

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${name}`, properties);
        }

        // Simulating data send
        this.persist(event);
    }

    private persist(event: AnalyticsEvent) {
        try {
            const history = JSON.parse(localStorage.getItem('stoic_analytics') || '[]');
            history.push(event);
            // Keep last 1000 events
            if (history.length > 1000) history.shift();
            localStorage.setItem('stoic_analytics', JSON.stringify(history));
        } catch (e) {
            console.error('Analytics persistence failed', e);
        }
    }

    private flush() {
        // In a real app, this would send data to Segment/Mixpanel
    }
}

export const analytics = new AnalyticsEngine();
