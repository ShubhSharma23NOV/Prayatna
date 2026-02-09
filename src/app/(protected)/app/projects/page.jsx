"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FolderOpen, Plus, FileText, Calendar, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
    const router = useRouter();

    const projects = [
        {
            id: 1,
            name: 'Residential Tower - Phase 1',
            location: 'Mumbai, Zone III',
            storeys: 15,
            lastModified: '2024-02-08',
            status: 'In Progress'
        },
        {
            id: 2,
            name: 'Commercial Complex',
            location: 'Delhi, Zone IV',
            storeys: 8,
            lastModified: '2024-02-05',
            status: 'Completed'
        },
        {
            id: 3,
            name: 'Hospital Building',
            location: 'Bangalore, Zone II',
            storeys: 6,
            lastModified: '2024-02-01',
            status: 'Draft'
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
                        <h1 className="text-xl font-bold">My Projects</h1>
                        <p className="text-sm text-muted-foreground">Manage your structural analysis projects</p>
                    </div>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Project
                </Button>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto space-y-4">
                    {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-all cursor-pointer">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FolderOpen className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">{project.location}</p>
                                        </div>
                                    </div>
                                    <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                                        {project.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            <span>{project.storeys} Storeys</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span>Modified {project.lastModified}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">Open</Button>
                                        <Button size="sm" variant="ghost">
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
