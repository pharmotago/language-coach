'use client';

import React, { useEffect } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    fullWidthResponsive?: boolean;
}

/**
 * AdSense Component
 * Renders a Google AdSense ad unit safely within a client component.
 */
export const AdSense: React.FC<AdSenseProps> = ({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true
}) => {
    const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (e) {
            console.warn('AdSense push error:', e);
        }
    }, []);

    if (!pubId) return null;

    return (
        <div className="adsense-container my-4 overflow-hidden rounded-xl bg-slate-800/50 p-2 backdrop-blur-sm">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={pubId}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
            />
        </div>
    );
};
