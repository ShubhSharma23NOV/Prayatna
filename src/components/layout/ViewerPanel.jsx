"use client";

import React, { useRef, useState } from 'react';
import { StructuralAnalysisViewer } from '@/components/viewer/StructuralAnalysisViewer';
import { ViewerToolbar } from '@/components/viewer/ViewerToolbar';
import { useApp } from '@/context/AppContext';

export function ViewerPanel() {
    const { analysisResults, overlayToggles, userRole } = useApp();
    const viewerRef = useRef(null);

    return (
        <section className="flex-1 relative flex flex-col bg-[#1a1a1a] overflow-hidden group">
            {/* 3D Structural Analysis Context */}
            <div className="absolute inset-0 z-0">
                <StructuralAnalysisViewer
                    ref={viewerRef}
                    overlayToggles={overlayToggles}
                    analysisResults={analysisResults}
                />
            </div>

            {/* Viewport Badge Information */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                    <span className="bg-primary/20 backdrop-blur-md border border-primary/30 px-2 py-0.5 rounded text-[10px] font-bold text-primary font-mono tracking-tighter uppercase">
                        ANALYSIS_ACTIVE
                    </span>
                    <span className="bg-muted/30 backdrop-blur-md border border-white/5 px-2 py-0.5 rounded text-[10px] font-medium text-white/50 tracking-tighter uppercase font-mono">
                        FEA_ENGINE_2.1
                    </span>
                </div>
            </div>

            {/* Floating Viewport Toolbar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-transform hover:scale-105 duration-300">
                <ViewerToolbar
                    onReset={() => viewerRef.current?.setView('reset')}
                    onViewChange={(v) => viewerRef.current?.setView(v)}
                    onSectionCut={() => console.log("Section Cut Not Implemented")}
                    onStoreyChange={() => console.log("Storey Slider Not Implemented")}
                />
            </div>

            {/* Technical Helper Info */}
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[10px] font-mono text-white/20 text-right leading-tight uppercase font-bold tracking-widest">
                    Grid: 1.0m<br />
                    Z-Axis: Global<br />
                    Precision: Float64
                </div>
            </div>
        </section>
    );
}

