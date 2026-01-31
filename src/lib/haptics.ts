/**
 * Haptic Feedback Service
 * Provides tactile feedback for mobile devices (and supported desktops)
 */

type VibrationPattern = number | number[];

export const HapticPatterns = {
    soft: 10,               // Subtle tick
    light: 20,              // Light tap
    medium: 40,             // Definitive click
    heavy: 70,              // Heavy thud
    success: [30, 50, 30],  // Da-da-da (Rising feel)
    warning: [50, 100, 50], // Buzz-Buzz
    error: [50, 50, 50, 50, 100], // Buzz-Buzz-Thud
    unlock: [50, 50, 100, 50, 50, 50, 100], // Fanfare vibration
};

export const triggerHaptic = (pattern: VibrationPattern) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try {
            window.navigator.vibrate(pattern);
        } catch (e) {
            // Haptics not supported or blocked
            console.debug('Haptics failed:', e);
        }
    }
};
