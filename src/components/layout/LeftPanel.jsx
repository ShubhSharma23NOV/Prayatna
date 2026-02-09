import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calculator, Box, Layers } from 'lucide-react';

export function LeftPanel() {
    const { parameters, updateParameter } = useApp();

    return (
        <aside className="w-80 border-r bg-muted/30 flex flex-col">
            <div className="p-4 border-b bg-card">
                <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold">Engineering Parameters</h2>
                </div>
                <p className="text-xs text-muted-foreground">Adjust geometry and material properties</p>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    <section>
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-3 block">Geometry</Label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="beamLength" className="text-xs">Beam Span (m)</Label>
                                <Input
                                    id="beamLength"
                                    type="number"
                                    value={parameters.beamLength}
                                    onChange={(e) => updateParameter('beamLength', parseFloat(e.target.value))}
                                    className="h-8 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-3 block">Loading</Label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="loadValue" className="text-xs">Distributed Load (kN/m)</Label>
                                <Input
                                    id="loadValue"
                                    type="number"
                                    value={parameters.loadValue}
                                    onChange={(e) => updateParameter('loadValue', parseFloat(e.target.value))}
                                    className="h-8 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-3 block">Materials</Label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="material" className="text-xs">Grade</Label>
                                <Input
                                    id="material"
                                    value={parameters.material}
                                    onChange={(e) => updateParameter('material', e.target.value)}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </ScrollArea>
        </aside>
    );
}
