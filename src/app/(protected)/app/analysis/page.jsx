"use client";

import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { ViewerPanel } from '@/components/layout/ViewerPanel';
import { ResultsPanel } from '@/components/layout/ResultsPanel';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Lightbulb, Target, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple separator for the footer since it's a small component
function LocalSeparator({ orientation, className }) {
    return (
        <div className={`${orientation === 'vertical' ? 'w-[1px] h-full' : 'h-[1px] w-full'} bg-border ${className}`} />
    )
}

// Student Learning Panel Component
function StudentLearningPanel() {
    const learningModules = [
        {
            icon: BookOpen,
            title: "Structural Basics",
            description: "Learn fundamental concepts of structural engineering",
            topics: ["Load Types", "Stress & Strain", "Material Properties"],
            color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
        },
        {
            icon: Target,
            title: "Seismic Design",
            description: "Understanding earthquake-resistant structures",
            topics: ["Seismic Zones", "Base Isolation", "Ductility"],
            color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
        },
        {
            icon: TrendingUp,
            title: "Analysis Methods",
            description: "Explore different structural analysis techniques",
            topics: ["FEA Basics", "Load Paths", "Deflection"],
            color: "bg-green-500/10 text-green-500 border-green-500/20"
        },
        {
            icon: Award,
            title: "Case Studies",
            description: "Real-world building analysis examples",
            topics: ["Residential", "Commercial", "Bridges"],
            color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
        }
    ];

    const interactiveLessons = [
        { title: "Understanding Column Stress", duration: "5 min", difficulty: "Beginner" },
        { title: "Load Distribution in Beams", duration: "8 min", difficulty: "Beginner" },
        { title: "Seismic Force Calculation", duration: "12 min", difficulty: "Intermediate" },
        { title: "Foundation Design Basics", duration: "10 min", difficulty: "Intermediate" },
        { title: "Moment Frame Analysis", duration: "15 min", difficulty: "Advanced" }
    ];

    return (
        <aside className="w-80 border-r bg-muted/20 overflow-auto">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold">Learning Lab</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Interactive structural engineering education
                    </p>
                </div>

                {/* Learning Modules */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Learning Modules
                    </h3>
                    {learningModules.map((module, index) => (
                        <Card key={index} className={`border ${module.color} cursor-pointer hover:shadow-md transition-shadow`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${module.color}`}>
                                        <module.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-sm">{module.title}</CardTitle>
                                        <CardDescription className="text-xs mt-1">
                                            {module.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="flex flex-wrap gap-1">
                                    {module.topics.map((topic, i) => (
                                        <Badge key={i} variant="secondary" className="text-[10px]">
                                            {topic}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Interactive Lessons */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Interactive Lessons</h3>
                    <div className="space-y-2">
                        {interactiveLessons.map((lesson, index) => (
                            <button
                                key={index}
                                className="w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <h4 className="text-xs font-semibold">{lesson.title}</h4>
                                        <div className="flex gap-2 mt-1">
                                            <Badge variant="outline" className="text-[9px]">
                                                {lesson.duration}
                                            </Badge>
                                            <Badge 
                                                variant={lesson.difficulty === 'Beginner' ? 'default' : lesson.difficulty === 'Intermediate' ? 'secondary' : 'destructive'} 
                                                className="text-[9px]"
                                            >
                                                {lesson.difficulty}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress Card */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Your Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Lessons Completed</span>
                                <span className="font-bold">3/15</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[20%]"></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="text-[10px]">
                                🏆 2 Badges Earned
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                                ⭐ Level 1
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </aside>
    );
}

// Engineer Input Panel (existing)
function EngineerInputPanel() {
    const { InputPanel } = require('@/components/layout/InputPanel');
    return <InputPanel />;
}

export default function AnalysisPage() {
    const { userRole } = useApp();
    const isStudent = userRole === 'Student';

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full overflow-hidden bg-background font-sans antialiased text-foreground">
                {/* Navigation / Header */}
                <TopBar />

                {/* Main Application Interface */}
                <main className="flex flex-1 overflow-hidden">
                    {/* Left Side: Student Learning or Engineer Inputs */}
                    {isStudent ? <StudentLearningPanel /> : <EngineerInputPanel />}

                    {/* Center: 3D Visualization */}
                    <ViewerPanel />

                    {/* Right Side: Analysis Results & Reports */}
                    <ResultsPanel />
                </main>

                {/* Technical Status Bar */}
                <footer className="h-6 border-t bg-card px-3 flex items-center justify-between text-[9px] text-muted-foreground font-mono uppercase tracking-tight select-none">
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1.5 font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {isStudent ? "LEARNING MODE" : "SYSTEM READY"}
                        </div>
                        <LocalSeparator orientation="vertical" className="h-3 mx-1" />
                        <span>PROJECT: {isStudent ? "EDUCATION_LAB" : "CIVIL_CORE_BETA"}</span>
                        <span>UNITS: SI (METRIC)</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <span>ENGINE: {isStudent ? "EDU_v1.0" : "IFC_JS v0.1.2"}</span>
                        {!isStudent && <span>MEMORY: 342MB / 4GB</span>}
                        <div className="flex items-center gap-1">
                            {isStudent ? "PROGRESS: 20%" : "LATENCY:"} <span className="text-green-500">{isStudent ? "" : "14MS"}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </TooltipProvider>
    );
}
