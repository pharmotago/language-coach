import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "The Stoic Dad",
    description: "Daily parenting challenges for the modern Stoic.",
    manifest: "/manifest.json",
    metadataBase: new URL('https://thestoicdad.com'),
    openGraph: {
        title: "The Stoic Dad",
        description: "Master your reactions, guide your family. Unlock one ancient lesson at a time.",
        url: "https://thestoicdad.com",
        siteName: "The Stoic Dad",
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
        <html lang="en">
            <body className={cn(inter.className, "antialiased")}>
                <ErrorBoundary>
                    <SoundProvider>
                        {children}
                    </SoundProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
