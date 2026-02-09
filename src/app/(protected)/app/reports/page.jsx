"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Download, Eye, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
    const router = useRouter();

    const reports = [
        {
            id: 1,
            name: 'Seismic Analysis Report - Residential Tower',
            type: 'Full Analysis',
            date: '2024-02-08',
            pages: 24,
            format: 'PDF'
        },
        {
            id: 2,
            name: 'Code Compliance Summary - Commercial Complex',
            type: 'Compliance',
            date: '2024-02-05',
            pages: 8,
            format: 'PDF'
        },
        {
            id: 3,
            name: 'Risk Assessment Report - Hospital Building',
            type: 'Risk Analysis',
            date: '2024-02-01',
            pages: 12,
            format: 'PDF'
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
                        <h1 className="text-xl font-bold">Reports & Exports</h1>
                        <p className="text-sm text-muted-foreground">Generate and download compliance reports</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-2">
                    <FileText className="w-3 h-3" />
                    {reports.length} Reports
                </Badge>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Report Templates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate New Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="h-auto py-4 flex-col gap-2" disabled>
                                    <FileText className="w-6 h-6" />
                                    <span className="font-semibold">Full Analysis Report</span>
                                    <span className="text-xs text-muted-foreground">Complete seismic analysis</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-4 flex-col gap-2" disabled>
                                    <FileText className="w-6 h-6" />
                                    <span className="font-semibold">Compliance Summary</span>
                                    <span className="text-xs text-muted-foreground">Code validation results</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-4 flex-col gap-2" disabled>
                                    <FileText className="w-6 h-6" />
                                    <span className="font-semibold">Risk Assessment</span>
                                    <span className="text-xs text-muted-foreground">Structural risk analysis</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Existing Reports */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Recent Reports</h2>
                        {reports.map((report) => (
                            <Card key={report.id} className="hover:shadow-lg transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{report.name}</h3>
                                                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {report.date}
                                                    </div>
                                                    <span>•</span>
                                                    <span>{report.pages} pages</span>
                                                    <span>•</span>
                                                    <Badge variant="secondary" className="text-xs">{report.type}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" disabled>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Preview
                                            </Button>
                                            <Button size="sm" disabled>
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
