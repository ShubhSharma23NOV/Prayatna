"use client";

import React from 'react';
import Link from 'next/link';
import { HardHat, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicNavbar() {
    return (
        <nav className="h-16 border-b bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-primary/10 p-2 rounded border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <HardHat className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight leading-none">STRUCTIQ</span>
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                        <Monitor className="w-2.5 h-2.5" />
                        Decision Support Tool
                    </span>
                </div>
            </Link>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Link href="/register">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
