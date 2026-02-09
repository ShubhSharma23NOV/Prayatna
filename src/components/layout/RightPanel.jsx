import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, BarChart3, Info } from 'lucide-react';

export function RightPanel() {
    const { results } = useApp();

    return (
        <aside className="w-80 border-l bg-muted/30 flex flex-col">
            <div className="p-4 border-b bg-card">
                <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold">Analysis Results</h2>
                </div>
                <p className="text-xs text-muted-foreground">Real-time computation output</p>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <Card className="shadow-none border-border bg-card/50">
                        <CardHeader className="p-3 pb-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Max Deflection</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-1">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-mono font-semibold">{(results.deflection * 1000).toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">mm</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-border bg-card/50">
                        <CardHeader className="p-3 pb-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Material Stress</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-1">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-mono font-semibold">{results.maxStress.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">MPa</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-border bg-card/50">
                        <CardHeader className="p-3 pb-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Utilization Ratio</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-1 flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className={`text-2xl font-mono font-semibold ${results.utilization > 0.9 ? 'text-destructive' : 'text-green-500'}`}>
                                    {(results.utilization * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${results.utilization > 0.9 ? 'bg-destructive' : 'bg-green-500'}`}
                                    style={{ width: `${results.utilization * 100}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md flex gap-3">
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-blue-700 dark:text-blue-400">
                            Analysis based on Euler-Bernoulli beam theory with standard linear elastic assumptions.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
