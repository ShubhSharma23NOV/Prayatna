"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import {
    HardHat,
    Plus,
    FolderOpen,
    FileText,
    GraduationCap,
    PlayCircle,
    LogOut,
    Layers,
    Calculator,
    Zap,
    FileCheck,
    BookOpen,
    Activity,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
    const { userRole, projectData, logout } = useApp();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navigateTo = (path) => {
        router.push(path);
    };

    return (
        <div className="flex-1 flex flex-col overflow-auto bg-muted/10">
            {/* Dashboard Header */}
            <header className="px-8 py-6 border-b bg-background flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {userRole}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Button>
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                        {userRole?.[0]}
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">

                {/* Engineer / Admin Cards */}
                {(userRole === 'Engineer' || userRole === 'Admin') && (
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ActionCard
                                icon={<Plus className="w-6 h-6 text-white" />}
                                title="Start New Analysis"
                                description="Initialize a new seismic analysis project with defaults."
                                onClick={() => navigateTo('/app/analysis')}
                                variant="primary"
                            />
                            <ActionCard
                                icon={<FolderOpen className="w-6 h-6 text-primary" />}
                                title="My Projects"
                                description="Access and manage your saved structural models."
                                onClick={() => navigateTo('/app/projects')}
                            />
                            <ActionCard
                                icon={<FileText className="w-6 h-6 text-primary" />}
                                title="Reports & Exports"
                                description="Generate compliance reports for existing projects."
                                onClick={() => navigateTo('/app/reports')}
                            />
                        </div>
                    </section>
                )}

                {/* Engineer Feature Showcase */}
                {(userRole === 'Engineer' || userRole === 'Admin') && (
                    <section className="space-y-4 pt-4">
                        <h2 className="text-lg font-semibold tracking-tight">Engineering Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FeatureButton
                                icon={<Layers className="w-5 h-5" />}
                                title="IFC Viewer"
                                badge="BIM"
                                onClick={() => navigateTo('/app/ifc-viewer')}
                            />
                            <FeatureButton
                                icon={<Calculator className="w-5 h-5" />}
                                title="Seismic Calculator"
                                badge="IS-1893"
                                onClick={() => navigateTo('/app/calculator')}
                            />
                            <FeatureButton
                                icon={<Zap className="w-5 h-5" />}
                                title="Risk Assessment"
                                badge="AI"
                                onClick={() => navigateTo('/app/risk-assessment')}
                            />
                            <FeatureButton
                                icon={<FileCheck className="w-5 h-5" />}
                                title="Code Compliance"
                                badge="Validator"
                                onClick={() => navigateTo('/app/compliance')}
                            />
                        </div>
                    </section>
                )}

                {/* Student Cards */}
                {userRole === 'Student' && (
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold tracking-tight">Learning Hub</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ActionCard
                                icon={<PlayCircle className="w-6 h-6 text-primary" />}
                                title="Interactive Demo"
                                description="Explore a pre-configured structural analysis scenario."
                                onClick={() => navigateTo('/app/analysis')}
                            />
                            <ActionCard
                                icon={<GraduationCap className="w-6 h-6 text-primary" />}
                                title="IS-1893 Resources"
                                description="Review code provisions and compliance guidelines."
                                onClick={() => navigateTo('/app/resources')}
                            />
                        </div>
                    </section>
                )}

                {/* Student Feature Showcase */}
                {userRole === 'Student' && (
                    <section className="space-y-4 pt-4">
                        <h2 className="text-lg font-semibold tracking-tight">Learning Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FeatureButton
                                icon={<BookOpen className="w-5 h-5" />}
                                title="Analysis Explorer"
                                badge="Read-Only"
                                onClick={() => navigateTo('/app/analysis')}
                            />
                            <FeatureButton
                                icon={<Activity className="w-5 h-5" />}
                                title="3D Visualization"
                                badge="Interactive"
                                onClick={() => navigateTo('/app/ifc-viewer')}
                            />
                            <FeatureButton
                                icon={<TrendingUp className="w-5 h-5" />}
                                title="Module Results"
                                badge="Study"
                                onClick={() => navigateTo('/app/results')}
                            />
                            <FeatureButton
                                icon={<ShieldCheck className="w-5 h-5" />}
                                title="Code Learning"
                                badge="IS-1893"
                                onClick={() => navigateTo('/app/compliance')}
                            />
                        </div>
                    </section>
                )}

                {/* System Status (Admin Only Example) */}
                {userRole === 'Admin' && (
                    <section className="space-y-4 pt-4">
                        <h2 className="text-lg font-semibold tracking-tight text-destructive">Admin Controls</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ActionCard
                                icon={<HardHat className="w-6 h-6 text-destructive" />}
                                title="User Management"
                                description="Manage registered engineers and students."
                                onClick={() => console.log('Admin Users clicked')}
                            />
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

function ActionCard({ icon, title, description, onClick, variant = "default" }) {
    return (
        <Card
            className={`cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group ${variant === 'primary' ? 'bg-primary border-primary text-primary-foreground' : ''}`}
            onClick={onClick}
        >
            <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${variant === 'primary' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    {icon}
                </div>
                <CardTitle className={`text-xl ${variant === 'primary' ? 'text-white' : ''}`}>{title}</CardTitle>
                <CardDescription className={`${variant === 'primary' ? 'text-white/80' : ''}`}>
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

function FeatureButton({ icon, title, badge, onClick }) {
    return (
        <button
            onClick={onClick}
            className="group relative p-4 rounded-xl border bg-card hover:bg-accent hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary">
                    {badge}
                </span>
            </div>
            <h3 className="text-sm font-semibold">{title}</h3>
        </button>
    )
}
