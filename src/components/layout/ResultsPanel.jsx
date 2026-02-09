"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Activity,
    Box,
    FileSearch,
    Download,
    CheckCircle2,
    AlertTriangle,
    ClipboardCheck,
    Zap
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ResultsPanel() {
    const { analysisResults, uiState, inputState, overlayToggles, toggleOverlay } = useApp();

    if (!analysisResults && !uiState.isAnalyzing) {
        return (
            <aside className="w-80 border-l bg-card flex flex-col items-center justify-center p-8 text-center select-none">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight mb-2">No Analysis Data</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Configure engineering parameters on the left and run analysis to populate results.
                </p>
            </aside>
        );
    }

    const { module1, module2, module3, module4, module5 } = analysisResults || {};

    return (
        <aside className="w-80 border-l bg-card flex flex-col select-none relative">
            {uiState.isAnalyzing && (
                <div className="absolute inset-0 z-50 bg-card/60 backdrop-blur-[1px] flex items-center justify-center">
                    <Badge variant="outline" className="animate-pulse bg-background shadow-lg text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 border-primary/20">
                        Re-computing...
                    </Badge>
                </div>
            )}

            <Tabs defaultValue="summary" className="flex-1 flex flex-col">
                <div className="h-10 px-2 flex items-center border-b bg-muted/20">
                    <TabsList className="h-7 w-full bg-transparent p-0 gap-1">
                        <TabsTrigger value="summary" className="data-[state=active]:bg-card data-[state=active]:shadow-none h-6 text-[10px] uppercase font-bold tracking-tight px-3 rounded">
                            Summary
                        </TabsTrigger>
                        <TabsTrigger value="modules" className="data-[state=active]:bg-card data-[state=active]:shadow-none h-6 text-[10px] uppercase font-bold tracking-tight px-3 rounded">
                            Modules
                        </TabsTrigger>
                        <TabsTrigger value="overlays" className="data-[state=active]:bg-card data-[state=active]:shadow-none h-6 text-[10px] uppercase font-bold tracking-tight px-3 rounded">
                            3D List
                        </TabsTrigger>
                        <TabsTrigger value="report" className="data-[state=active]:bg-card data-[state=active]:shadow-none h-6 text-[10px] uppercase font-bold tracking-tight px-3 rounded">
                            Report
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <TabsContent value="summary" className="m-0 p-4 space-y-4">
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Overall Risk Status</span>
                                <Badge
                                    variant="outline"
                                    className={`h-5 rounded-sm text-[10px] font-bold uppercase ${module1?.riskStatus === 'High Risk' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                        module1?.riskStatus === 'Medium Risk' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                            'bg-green-500/10 text-green-600 border-green-500/20'
                                        }`}
                                >
                                    {module1?.riskStatus}
                                </Badge>
                            </div>

                            <Card className="shadow-none border-border bg-muted/30">
                                <CardHeader className="p-3 pb-0">
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                        Confidence Score
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-2">
                                    <div className="text-2xl font-mono font-bold">{module1?.confidenceScore}%</div>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Based on IS code validation and structural regularity checks.
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="space-y-2 pt-2">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Analysis Recommendations</span>
                                <div className="space-y-2">
                                    {module1?.recommendations.map((rec, i) => (
                                        <div key={i} className="flex gap-2 p-2 rounded border bg-card/50">
                                            <AlertTriangle className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] leading-tight font-medium">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </TabsContent>

                    <TabsContent value="modules" className="m-0">
                        <Accordion type="multiple" className="border-b">
                            <AccordionItem value="pbd" className="px-4">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <span className="text-xs font-bold uppercase tracking-tight">PBD / Stability</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    <div className="p-2 border rounded bg-muted/20 space-y-1">
                                        <div className="flex justify-between text-[10px]">
                                            <span className="text-muted-foreground">Confidence:</span>
                                            <span className="font-mono font-bold">{module1?.confidenceScore}%</span>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="tall" className="px-4">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <span className="text-xs font-bold uppercase tracking-tight">Tall Building Logic</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-muted-foreground">Module Status:</span>
                                        <Badge variant="secondary" className="text-[9px] h-4">{module2?.status}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        {module2?.suggestions.map((s, i) => (
                                            <div key={i} className="text-[10px] p-1.5 border border-dashed rounded bg-card/50">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="walls" className="px-4">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <span className="text-xs font-bold uppercase tracking-tight">Structural Walls</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 border rounded bg-muted/20">
                                            <p className="text-[8px] uppercase text-muted-foreground">Required Density</p>
                                            <p className="text-[11px] font-mono font-bold">{module3?.densityRequirement}</p>
                                        </div>
                                        <div className="p-2 border rounded bg-muted/20">
                                            <p className="text-[8px] uppercase text-muted-foreground">Geometric Center</p>
                                            <p className="text-[11px] font-mono font-bold">{module3?.placementStatus}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] italic border-l-2 border-primary pl-2 py-1">{module3?.suggestion}</p>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="ssi" className="px-4">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <span className="text-xs font-bold uppercase tracking-tight">Soil Interaction (SSI)</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    <div className="p-2 border rounded bg-muted/20">
                                        <p className="text-[9px] font-bold uppercase mb-1">{module4?.foundationType} Foundation</p>
                                        <p className="text-[10px] text-muted-foreground leading-tight">{module4?.reason}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] p-1">
                                        <span className="text-muted-foreground">Liquefaction Risk:</span>
                                        <span className={`font-bold ${module4?.liquefactionRisk === 'High' ? 'text-destructive' : 'text-green-500'}`}>
                                            {module4?.liquefactionRisk}
                                        </span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="motion" className="px-4 border-b-0">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <span className="text-xs font-bold uppercase tracking-tight">Ground Motion (PGA)</span>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-[10px] text-muted-foreground">Design PGA:</span>
                                        <span className="text-lg font-mono font-bold text-primary">{module5?.expectedPGA}</span>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">
                                        {module5?.note}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </TabsContent>

                    <TabsContent value="overlays" className="m-0 p-4 space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-[11px] font-bold">Shear Walls</Label>
                                    <p className="text-[9px] text-muted-foreground">Suggested density: {module3?.densityRequirement}</p>
                                </div>
                                <Switch
                                    checked={overlayToggles.shearWalls}
                                    onCheckedChange={() => toggleOverlay('shearWalls')}
                                    disabled={!analysisResults}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-[11px] font-bold">Foundation Layout</Label>
                                    <p className="text-[9px] text-muted-foreground">Type: {module4?.foundationType}</p>
                                </div>
                                <Switch
                                    checked={overlayToggles.foundation}
                                    onCheckedChange={() => toggleOverlay('foundation')}
                                    disabled={!analysisResults}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-[11px] font-bold">Seismic Risk Zones</Label>
                                    <p className="text-[9px] text-muted-foreground">High demand areas highlight</p>
                                </div>
                                <Switch
                                    checked={overlayToggles.riskZones}
                                    onCheckedChange={() => toggleOverlay('riskZones')}
                                    disabled={!analysisResults}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="report" className="m-0 p-4 space-y-4">
                        <div className="bg-muted/30 border rounded-lg p-3 space-y-3 font-mono text-[9px]">
                            <div className="border-b pb-1 font-bold text-primary">ANALYSIS_LOG: STRUCTIQ_V1.0</div>
                            <div className="space-y-1">
                                <p>&gt; INPUT_SITE_ZONE: {inputState.zone.toUpperCase()}</p>
                                <p>&gt; INPUT_HEIGHT: {inputState.storeys} FLOORS</p>
                                <p>&gt; CALC_PGA: {module5?.expectedPGA}</p>
                                <p>&gt; RISK_EST: {module1?.riskStatus}</p>
                                <p>&gt; CONFIDENCE: {module1?.confidenceScore}%</p>
                            </div>
                        </div>
                        <Button disabled className="w-full h-9 gap-2 uppercase text-[10px] font-bold tracking-widest">
                            <Download className="w-3.5 h-3.5" />
                            Download Report
                        </Button>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </aside>
    );
}
