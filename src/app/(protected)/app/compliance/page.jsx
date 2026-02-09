"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CompliancePage() {
    const router = useRouter();

    const complianceChecks = [
        {
            code: 'IS-1893:2016',
            checks: [
                { id: 1, rule: 'Clause 6.4.2 - Seismic Zone Factor', status: 'pass', detail: 'Zone III (Z=0.16) correctly applied' },
                { id: 2, rule: 'Clause 6.4.5 - Importance Factor', status: 'pass', detail: 'I=1.0 for ordinary structures' },
                { id: 3, rule: 'Clause 7.6.2 - Soft Storey Check', status: 'warning', detail: 'Stiffness irregularity detected at ground floor' },
                { id: 4, rule: 'Clause 7.8.1 - Torsional Irregularity', status: 'pass', detail: 'Eccentricity within 10% limit' },
                { id: 5, rule: 'Clause 7.10.3 - Drift Limitations', status: 'pass', detail: 'Inter-storey drift < 0.004h' }
            ]
        },
        {
            code: 'NBC 2016',
            checks: [
                { id: 1, rule: 'Section 2.2.3 - Load Combinations', status: 'pass', detail: '1.2D + 1.0L + 1.0E applied' },
                { id: 2, rule: 'Section 3.4.1 - Minimum Base Shear', status: 'pass', detail: 'Base shear exceeds minimum requirement' },
                { id: 3, rule: 'Section 4.2.5 - Shear Wall Density', status: 'fail', detail: 'Shear wall density below 2% requirement' }
            ]
        }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            default: return null;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pass': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Pass</Badge>;
            case 'fail': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Fail</Badge>;
            case 'warning': return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Warning</Badge>;
            default: return null;
        }
    };

    const totalChecks = complianceChecks.reduce((sum, code) => sum + code.checks.length, 0);
    const passedChecks = complianceChecks.reduce((sum, code) => 
        sum + code.checks.filter(c => c.status === 'pass').length, 0
    );
    const failedChecks = complianceChecks.reduce((sum, code) => 
        sum + code.checks.filter(c => c.status === 'fail').length, 0
    );
    const warningChecks = complianceChecks.reduce((sum, code) => 
        sum + code.checks.filter(c => c.status === 'warning').length, 0
    );

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Code Compliance Checker</h1>
                        <p className="text-sm text-muted-foreground">Validate against IS-1893 & NBC standards</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-2">
                    <FileCheck className="w-3 h-3" />
                    Validator
                </Badge>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-muted-foreground">Total Checks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{totalChecks}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-green-500/20 bg-green-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-green-600">Passed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">{passedChecks}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-orange-500/20 bg-orange-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-orange-600">Warnings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-orange-600">{warningChecks}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-red-600">Failed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-600">{failedChecks}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Compliance Details */}
                    <Tabs defaultValue="is-1893" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="is-1893">IS-1893:2016</TabsTrigger>
                            <TabsTrigger value="nbc-2016">NBC 2016</TabsTrigger>
                        </TabsList>

                        <TabsContent value="is-1893" className="space-y-4 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>IS-1893:2016 Compliance Checks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {complianceChecks[0].checks.map((check) => (
                                            <div key={check.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                <div className="mt-0.5">
                                                    {getStatusIcon(check.status)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold text-sm">{check.rule}</p>
                                                        {getStatusBadge(check.status)}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="nbc-2016" className="space-y-4 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>NBC 2016 Compliance Checks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {complianceChecks[1].checks.map((check) => (
                                            <div key={check.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                <div className="mt-0.5">
                                                    {getStatusIcon(check.status)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold text-sm">{check.rule}</p>
                                                        {getStatusBadge(check.status)}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button className="flex-1" disabled>
                            Generate Compliance Report
                        </Button>
                        <Button variant="outline" className="flex-1" disabled>
                            Export to PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
