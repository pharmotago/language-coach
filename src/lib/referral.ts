/**
 * Viral Referral System
 * Generates unique codes and handles sharing logic.
 */

export function generateReferralLink(userId: string) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const referralCode = btoa(userId).slice(0, 8).toUpperCase();
    return `${baseUrl}?ref=${referralCode}`;
}

export async function shareReferral(userId: string) {
    const link = generateReferralLink(userId);
    const shareData = {
        title: 'Join me on Language Coach!',
        text: 'I am leveling up my Spanish with this AI coach. Join me and we both get 500 XP!',
        url: link,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return { success: true, method: 'native' };
        } catch (err) {
            console.log('Share failed or cancelled');
            return { success: false };
        }
    } else {
        // Fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(link);
            return { success: true, method: 'clipboard' };
        } catch (err) {
            return { success: false };
        }
    }
}
