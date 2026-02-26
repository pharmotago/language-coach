import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: {
        default: "Language Coach AI",
        template: "%s | Language Coach AI"
    },
    description: "Accelerate language acquisition with AI-powered conversation and real-time feedback.",
    icons: {
        icon: '/favicon.png',
    },
    manifest: "/manifest.json",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://language-coach.mcjp.io'),
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Coach AI',
    },
    openGraph: {
        title: "Language Coach AI",
        description: "Master any language with AI-powered conversation practice.",
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://language-coach.mcjp.io',
        siteName: "Language Coach AI",
        locale: "en_US",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={cn(inter.variable, "antialiased font-sans")}>
                {children}
            </body>
        </html>
    );
}
