import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClientLayout } from "@/components/ClientLayout";
import Script from "next/script";
import { CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Language Coach AI",
        template: "%s | Language Coach AI"
    },
    description: "Premium AI Language Immersion & Real-time Feedback.",
    icons: {
        icon: '/favicon.png',
    },
    manifest: "/manifest.json",
    metadataBase: new URL(CONFIG.BASE_URL),
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#020617' },
    ],
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Coach AI',
    },
    openGraph: {
        title: "Language Coach AI",
        description: "Level up your fluency with an AI tutor that talks back. Real-time grammar & accent feedback.",
        url: CONFIG.BASE_URL,
        siteName: "Language Coach AI",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

import { SoundProvider } from "@/lib/sound";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <Script
                    id="adsense-init"
                    async
                    strategy="afterInteractive"
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_PUB_ID}`}
                    crossOrigin="anonymous"
                />
            </head>
            <body className={cn(inter.className, "antialiased font-sans")}>
                <ErrorBoundary>
                    <SoundProvider>
                        <ClientLayout>
                            {children}
                        </ClientLayout>
                    </SoundProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
