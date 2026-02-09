"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookOpen, FileText, Video, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
    const router = useRouter();

    const resources = [
        {
            category: 'IS-1893:2016 Standards',
            items: [
                { title: 'Seismic Zone Classification', type: 'PDF', description: 'Understanding seismic zones in India' },
                { title: 'Load Calculation Methods', type: 'PDF', description: 'Base shear and lateral force calculations' },
                { title: 'Structural Irregularities', type: 'PDF', description: 'Identifying and addressing irregularities' }
            ]
        },
        {
            category: 'Video Tutorials',
            items: [
                { title: 'Introduction to Seismic Analysis', type: 'Video', description: '15 min tutorial on basics' },
                { title: 'Using the IFC Viewer', type: 'Video', description: 'Navigate and analyze BIM models' },
                { title: 'Understanding Risk Assessment', type: 'Video', description: 'Interpreting analysis results' }
            ]
        },
        {
            category: 'Case Studies',
            items: [
                { title: 'Residential Building Analysis', type: 'PDF', description: 'Complete workflow example' },
                { title: 'Commercial Structure Design', type: 'PDF', description: 'Multi-storey building case' },
                { title: 'Soft Storey Mitigation', type: 'PDF', description: 'Real-world problem solving' }
            ]
        }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'PDF': return <FileText className="w-4 h-4" />;
            case 'Video': return <Video className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
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
                        <h1 className="text-xl font-bold">Learning Resources</h1>
                        <p className="text-sm text-muted-foreground">IS-1893 standards and tutorials</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-2">
                    <BookOpen className="w-3 h-3" />
                    Educational
                </Badge>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {resources.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-lg font-semibold">{section.category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {section.items.map((item, itemIdx) => (
                                    <Card key={itemIdx} className="hover:shadow-lg transition-all cursor-pointer">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    {getIcon(item.type)}
                                                </div>
                                                <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                                            </div>
                                            <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                                            <CardDescription className="text-xs">{item.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button size="sm" variant="outline" className="w-full gap-2" disabled>
                                                <ExternalLink className="w-3 h-3" />
                                                View Resource
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
