"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Progress } from '@/components/ui/progress';

export default function RiskAssessmentPage() {
    const router = useRouter();
    const { analysisResults } = useApp();

    const riskData = analysisResults || {
        module1: {
            riskStatus: 'Medium Risk',
            confidenceScore: 78,
            recommendations: [
                'Consider adding shear walls in the perimeter',
                'Review foundation design for soft soil conditions',
                'Verify structural regularity in plan'
            ]
        },
        module2: { status: 'Applicable', suggestions: ['Increase lateral stiffness', 'Check P-Delta effects'] },
        module3: { densityRequirement: '2.5%', placementStatus: 'Symmetric' },
        module4: { foundationType: 'Pile', liquefactionRisk: 'Low' },
        module5: { expectedPGA: '0.24g' }
    };

    const getRiskColor = (status) => {
        if (status?.includes('High')) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (status?.includes('Medium')) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        return 'text-green-500 bg-green-500/10 border-green-500/20';
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
                        <h1 className="text-xl font-bold">Risk Assessment Dashboard</h1>
                        <p className="text-sm text-muted-foreground">AI-powered structural risk analysis</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-2">
                    <Zap className="w-3 h-3" />
                    AI Powered
                </Badge>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Overall Risk Status */}
                    <Card className={getRiskColor(riskData.module1.riskStatus)}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">Overall Risk Status</CardTitle>
                                <Badge variant="outline" className="text-lg px-4 py-2">
                                    {riskData.module1.riskStatus}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Confidence Score</span>
                                    <span className="font-bold">{riskData.module1.confidenceScore}%</span>
                                </div>
                                <Progress value={riskData.module1.confidenceScore} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Structural Stability (PBD)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Confidence:</span>
                                        <span className="font-mono font-bold">{riskData.module1.confidenceScore}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant="secondary">Analyzed</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Info className="w-4 h-4 text-blue-500" />
                                    Tall Building Logic
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Module Status:</span>
                                        <Badge variant="secondary">{riskData.module2.status}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        {riskData.module2.suggestions.map((s, i) => (
                                            <p key={i} className="text-xs p-2 border rounded bg-muted/30">{s}</p>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                    Shear Wall Requirements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Required Density:</span>
                                        <span className="font-mono font-bold">{riskData.module3.densityRequirement}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Placement:</span>
                                        <Badge variant="outline">{riskData.module3.placementStatus}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Info className="w-4 h-4 text-purple-500" />
                                    Foundation & Soil
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Foundation Type:</span>
                                        <Badge variant="secondary">{riskData.module4.foundationType}</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Liquefaction Risk:</span>
                                        <span className={`font-bold ${riskData.module4.liquefactionRisk === 'High' ? 'text-red-500' : 'text-green-500'}`}>
                                            {riskData.module4.liquefactionRisk}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Engineering Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {riskData.module1.recommendations.map((rec, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-lg border bg-card">
                                        <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-orange-500">{i + 1}</span>
                                        </div>
                                        <p className="text-sm">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ground Motion */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                Design Ground Motion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm text-muted-foreground">Expected PGA:</span>
                                <span className="text-4xl font-bold font-mono text-primary">{riskData.module5.expectedPGA}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
