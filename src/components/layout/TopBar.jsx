"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { HardHat, Bell, Settings, User, Monitor, SunMoon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
    const { projectData, userRole, setUserRole } = useApp();

    return (
        <header className="h-12 border-b bg-card px-4 flex items-center justify-between sticky top-0 z-50 select-none">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-1.5 rounded border border-primary/20">
                        <HardHat className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold tracking-tight leading-none">{projectData.projectName}</h1>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                            <Monitor className="w-2.5 h-2.5" />
                            Decision Support Tool
                        </span>
                    </div>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 h-5 border-dashed border-muted-foreground/30 text-muted-foreground uppercase">
                        v1.0.4-stable
                    </Badge>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">Live Analysis</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 text-muted-foreground">
                    <SunMoon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 pr-2 pl-1 gap-2 hover:bg-muted/50 rounded-md">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border border-border">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <span className="text-xs font-medium">{userRole}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[100]">
                        <DropdownMenuItem onClick={() => setUserRole("Engineer")}>
                            Engineer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUserRole("Student")}>
                            Student
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUserRole("Admin")}>
                            Admin
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
