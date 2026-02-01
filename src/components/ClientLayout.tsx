'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ToastProvider } from './ToastProvider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <ToastProvider>
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </ToastProvider>
    );
}
