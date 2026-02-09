"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ResultsPage() {
    const router = useRouter();

    const modules = [
        {
            id: 'module1',
            name: 'Performance-Based Design (PBD)',
            description: 'Structural stability and confidence analysis',
            results: {
                confidenceScore: 78,
                riskStatus: 'Medium Risk',
                recommendations: [
                    'Consider adding shear walls in the perimeter',
                    'Review foundation design for soft soil conditions'
                ]
            }
        },
        {
            id: 'module2',
            name: 'Tall Building Logic',
            description: 'Height-specific structural requirements',
            results: {
                status: 'Applicable',
                suggestions: [
                    'Increase lateral stiffness at upper floors',
                    'Check P-Delta effects for slender structure'
                ]
            }
        },
        {
            id: 'module3',
            name: 'Structural Walls Analysis',
            description: 'Shear wall density and placement',
            results: {
                densityRequirement: '2.5%',
                placementStatus: 'Symmetric',
                suggestion: 'Add shear walls along building perimeter for torsional resistance'
            }
        },
        {
            id: 'module4',
            name: 'Soil-Structure Interaction (SSI)',
            description: 'Foundation type and soil behavior',
            results: {
                foundationType: 'Pile Foundation',
                liquefactionRisk: 'Low',
                reason: 'Recommended for soft soil conditions and high seismic zone'
            }
        },
        {
            id: 'module5',
            name: 'Ground Motion Parameters',
            description: 'Peak ground acceleration and response spectrum',
            results: {
                expectedPGA: '0.24g',
                note: 'Based on Zone IV classification'
            }
        }
    ];

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Multi-Module Results</h1>
                        <p className="text-sm text-muted-foreground">Detailed analysis outputs by module</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-2">
                    <TrendingUp className="w-3 h-3" />
                    5 Modules
                </Badge>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {modules.map((module, idx) => (
                            <Card key={module.id}>
                                <AccordionItem value={module.id} className="border-none">
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{module.name}</h3>
                                                <p className="text-sm text-muted-foreground">{module.description}</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4">
                                        <div className="space-y-3 pt-2">
                                            {Object.entries(module.results).map(([key, value]) => (
                                                <div key={key} className="p-3 rounded-lg border bg-muted/30">
                                                    <p className="text-xs text-muted-foreground uppercase mb-1">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                    {Array.isArray(value) ? (
                                                        <ul className="space-y-1">
                                                            {value.map((item, i) => (
                                                                <li key={i} className="text-sm">• {item}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm font-semibold">{value}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
