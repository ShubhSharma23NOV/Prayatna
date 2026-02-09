"use client";

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({ children }) {
    const { isLoggedIn } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.replace('/login');
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
            {children}
        </div>
    );
}
