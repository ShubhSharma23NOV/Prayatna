"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calculator, Play, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function CalculatorPage() {
    const router = useRouter();
    const { userRole } = useApp();
    const isReadOnly = userRole === 'Student';

    const [inputs, setInputs] = useState({
        zone: 'zone-iii',
        soil: 'medium',
        storeys: 10,
        height: 30,
        importance: 1.0,
        dampingRatio: 5
    });

    const [results, setResults] = useState(null);

    const handleCalculate = () => {
        // Mock calculation
        const zoneFactors = { 'zone-ii': 0.10, 'zone-iii': 0.16, 'zone-iv': 0.24, 'zone-v': 0.36 };
        const Z = zoneFactors[inputs.zone];
        const I = inputs.importance;
        const baseShear = (Z * I * inputs.height * 9.81 * 0.05).toFixed(2);
        
        setResults({
            baseShear: baseShear + ' kN',
            zoneFactor: Z,
            timePeriod: (0.09 * inputs.height / Math.sqrt(inputs.height)).toFixed(3) + ' sec',
            designPGA: (Z * 0.4).toFixed(3) + ' g'
        });
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Seismic Load Calculator</h1>
                        <p className="text-sm text-muted-foreground">Calculate base shear and seismic parameters</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-2">
                    <Calculator className="w-3 h-3" />
                    IS-1893:2016
                </Badge>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Parameters</CardTitle>
                            <CardDescription>Configure building and site parameters</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Seismic Zone</Label>
                                <Select
                                    value={inputs.zone}
                                    onValueChange={(val) => setInputs({ ...inputs, zone: val })}
                                    disabled={isReadOnly}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="zone-ii">Zone II (Z=0.10)</SelectItem>
                                        <SelectItem value="zone-iii">Zone III (Z=0.16)</SelectItem>
                                        <SelectItem value="zone-iv">Zone IV (Z=0.24)</SelectItem>
                                        <SelectItem value="zone-v">Zone V (Z=0.36)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Soil Type</Label>
                                <Select
                                    value={inputs.soil}
                                    onValueChange={(val) => setInputs({ ...inputs, soil: val })}
                                    disabled={isReadOnly}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hard">Type I - Hard Soil</SelectItem>
                                        <SelectItem value="medium">Type II - Medium Soil</SelectItem>
                                        <SelectItem value="soft">Type III - Soft Soil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Number of Storeys</Label>
                                    <Input
                                        type="number"
                                        value={inputs.storeys}
                                        onChange={(e) => setInputs({ ...inputs, storeys: parseInt(e.target.value) })}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Height (m)</Label>
                                    <Input
                                        type="number"
                                        value={inputs.height}
                                        onChange={(e) => setInputs({ ...inputs, height: parseFloat(e.target.value) })}
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Importance Factor (I)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={inputs.importance}
                                    onChange={(e) => setInputs({ ...inputs, importance: parseFloat(e.target.value) })}
                                    disabled={isReadOnly}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Damping Ratio (%)</Label>
                                <Input
                                    type="number"
                                    value={inputs.dampingRatio}
                                    onChange={(e) => setInputs({ ...inputs, dampingRatio: parseFloat(e.target.value) })}
                                    disabled={isReadOnly}
                                />
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full gap-2"
                                disabled={isReadOnly}
                            >
                                <Play className="w-4 h-4" />
                                Calculate
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Calculation Results</CardTitle>
                            <CardDescription>Seismic design parameters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!results ? (
                                <div className="flex items-center justify-center h-64 text-center">
                                    <div className="space-y-2">
                                        <Calculator className="w-12 h-12 text-muted-foreground mx-auto" />
                                        <p className="text-sm text-muted-foreground">
                                            Configure parameters and click Calculate
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg border bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Design Base Shear</p>
                                        <p className="text-3xl font-bold font-mono">{results.baseShear}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg border">
                                            <p className="text-xs text-muted-foreground mb-1">Zone Factor (Z)</p>
                                            <p className="text-xl font-bold font-mono">{results.zoneFactor}</p>
                                        </div>
                                        <div className="p-3 rounded-lg border">
                                            <p className="text-xs text-muted-foreground mb-1">Time Period</p>
                                            <p className="text-xl font-bold font-mono">{results.timePeriod}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-primary/5">
                                        <p className="text-xs text-muted-foreground mb-1">Design PGA</p>
                                        <p className="text-2xl font-bold font-mono text-primary">{results.designPGA}</p>
                                    </div>

                                    <Button variant="outline" className="w-full gap-2" disabled>
                                        <FileDown className="w-4 h-4" />
                                        Export Calculation Sheet
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
