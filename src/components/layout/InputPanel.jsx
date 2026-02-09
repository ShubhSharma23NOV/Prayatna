"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Play, Settings2, Database, Info, Loader2 } from 'lucide-react';

export function InputPanel() {
    const { inputState, updateInput, runAnalysis, uiState, userRole } = useApp();

    const isReadOnly = userRole === 'Student';

    return (
        <aside className="w-72 border-r bg-muted/20 flex flex-col select-none">
            <div className="p-3 border-b bg-card/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-primary" />
                    <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Engineering Parameters</h2>
                </div>
                {isReadOnly && (
                    <div className="px-2 py-0.5 rounded bg-muted text-[9px] font-bold uppercase text-muted-foreground">
                        Read Only
                    </div>
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Database className="w-3 h-3" />
                            Site & Seismicity
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="seismic-zone" className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Seismic Zone</Label>
                            <Select
                                value={inputState.zone}
                                onValueChange={(val) => updateInput('zone', val)}
                                disabled={isReadOnly}
                            >
                                <SelectTrigger id="seismic-zone" className="h-8 text-xs bg-background/50">
                                    <SelectValue placeholder="Select Zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="zone-ii">Zone II (Low)</SelectItem>
                                    <SelectItem value="zone-iii">Zone III (Moderate)</SelectItem>
                                    <SelectItem value="zone-iv">Zone IV (High)</SelectItem>
                                    <SelectItem value="zone-v">Zone V (Very High)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="soil-type" className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Soil Type</Label>
                            <Select
                                value={inputState.soil}
                                onValueChange={(val) => updateInput('soil', val)}
                                disabled={isReadOnly}
                            >
                                <SelectTrigger id="soil-type" className="h-8 text-xs bg-background/50">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hard">Type I (Hard/Rock)</SelectItem>
                                    <SelectItem value="medium">Type II (Medium/Stiff)</SelectItem>
                                    <SelectItem value="soft">Type III (Soft)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <div className="w-1 h-3 bg-primary rounded-full" />
                            Structural Geometry
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="storeys" className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Number of Storeys</Label>
                            <Input
                                id="storeys"
                                type="number"
                                value={inputState.storeys}
                                onChange={(e) => updateInput('storeys', parseInt(e.target.value) || 0)}
                                className="h-8 text-xs font-mono bg-background/50"
                                disabled={isReadOnly}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="system" className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Structural System</Label>
                            <Select
                                value={inputState.structuralSystem}
                                onValueChange={(val) => updateInput('structuralSystem', val)}
                                disabled={isReadOnly}
                            >
                                <SelectTrigger id="system" className="h-8 text-xs bg-background/50">
                                    <SelectValue placeholder="Select System" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="smrf">SMRF (Moment Frame)</SelectItem>
                                    <SelectItem value="wall">Shear Wall-Frame Dual</SelectItem>
                                    <SelectItem value="braced">Concentrically Braced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Plan Regularity</Label>
                                <p className="text-[9px] text-muted-foreground/70">Structural symmetry check</p>
                            </div>
                            <Switch
                                checked={inputState.regularity}
                                onCheckedChange={(val) => updateInput('regularity', val)}
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="p-3 border-t bg-card/60">
                <Button
                    className="w-full h-9 text-xs font-bold uppercase tracking-widest gap-2"
                    size="sm"
                    onClick={runAnalysis}
                    disabled={uiState.isAnalyzing || isReadOnly}
                >
                    {uiState.isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    {uiState.isAnalyzing ? "Analyzing..." : isReadOnly ? "Analysis Locked" : "Run Analysis"}
                </Button>
                <div className="mt-2 flex items-start gap-1.5 px-1">
                    <Info className="w-2.5 h-2.5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-[9px] text-muted-foreground leading-tight italic">
                        {isReadOnly ? "Switch to Engineer role to modify parameters." : "Changes require re-analysis to update global performance matrices."}
                    </p>
                </div>
            </div>
        </aside>
    );
}

