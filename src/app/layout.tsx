import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClientLayout } from "@/components/ClientLayout";
import Script from "next/script";
import { CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: {
        default: "Language Coach AI | Neural Sync Protocol",
        template: "%s | Language Coach AI"
    },
    description: "Initialize your neural sync. Accelerate language acquisition with deep AI immersion and real-time biometric-grade feedback.",
    icons: {
        icon: '/favicon.png',
    },
    manifest: "/manifest.json",
    metadataBase: new URL(CONFIG.BASE_URL),
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Coach AI',
    },
    openGraph: {
        title: "Language Coach AI | Neural Sync Protocol",
        description: "Bypass the translation lag. Initialize your neural sync and achieve native-level fluency with AI-driven deep immersion.",
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
