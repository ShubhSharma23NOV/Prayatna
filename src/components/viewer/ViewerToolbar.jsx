"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Rotate3D,
    Box,
    ArrowUp,
    Activity,
    RotateCcw,
    Scissors,
    Layers,
    Maximize2,
    Square
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ViewerToolbar({ onViewChange, onReset, onSectionCut, onStoreyChange }) {
    return (
        <TooltipProvider>
            <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white border-0"
                            onClick={onReset}
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Reset View</TooltipContent>
                </Tooltip>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white border-0"
                            onClick={() => onViewChange('top')}
                        >
                            <Square className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Top View</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white border-0"
                            onClick={() => onViewChange('front')}
                        >
                            <Maximize2 className="w-3.5 h-3.5 rotate-45" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Front View</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white border-0"
                            onClick={() => onViewChange('side')}
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Side View</TooltipContent>
                </Tooltip>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white border-0"
                            onClick={onSectionCut}
                        >
                            <Scissors className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Section Cut (Placeholder)</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white border-0"
                            onClick={onStoreyChange}
                        >
                            <Layers className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Storey Filter (Placeholder)</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
