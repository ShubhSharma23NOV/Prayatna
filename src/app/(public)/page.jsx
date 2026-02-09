"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Boxes, ShieldCheck, Activity, Cpu, Briefcase, GraduationCap, FileCheck, Layers, Calculator, BookOpen, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Hero3DVideo from '@/components/Hero/Hero3DVideo';

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full py-24 px-6 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full text-xs font-medium border-primary/20 bg-primary/5 text-primary mb-4">
                    v1.0.4 Now Available • IS-1893 Compliant
                </Badge>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent pb-2">
                    Seismic Analysis <br /> for Modern Engineering
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    The comprehensive decision support tool used by civil engineers to assess structural risks, visualize BIM models, and validate compliance in real-time.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/register">
                        <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                            Get Started
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/demo">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                            View Interactive Demo
                        </Button>
                    </Link>
                </div>
            </section>

            {/* 3D Video Hero */}
            <Hero3DVideo />

            {/* Features Grid */}
            <section id="features" className="w-full bg-card/50 border-y py-24 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard
                        icon={<ShieldCheck className="w-6 h-6" />}
                        title="Compliance Validator"
                        description="Automatically checks structural parameters against IS-1893:2016 and NBC 2016 standards for immediate feedback."
                    />
                    <FeatureCard
                        icon={<Boxes className="w-6 h-6" />}
                        title="BIM Integration"
                        description="Seamlessly upload and parse IFC files to visualize structures, identify soft storeys, and analyze load paths."
                    />
                    <FeatureCard
                        icon={<Cpu className="w-6 h-6" />}
                        title="ML Advisory"
                        description="Advanced algorithms suggest optimal shear wall placement and foundation types based on soil data."
                    />
                </div>
            </section>

            {/* Engineer Demo Features */}
            <section className="w-full py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">For Engineers</h2>
                            <p className="text-muted-foreground">Professional-grade analysis tools</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <DemoFeature
                            icon={<Layers className="w-5 h-5" />}
                            title="IFC Model Visualization"
                            description="Upload BIM models in standard IFC format and visualize structural elements in interactive 3D. Navigate through your building with professional viewport controls."
                            badge="BIM Ready"
                        />
                        <DemoFeature
                            icon={<Calculator className="w-5 h-5" />}
                            title="Seismic Parameter Input"
                            description="Configure seismic zone, soil type, building height, and structural system. Input panel validates parameters against IS-1893:2016 requirements."
                            badge="Code Compliant"
                        />
                        <DemoFeature
                            icon={<Zap className="w-5 h-5" />}
                            title="Real-time Risk Assessment"
                            description="Multi-module analysis engine evaluates structural stability, tall building logic, shear wall requirements, soil interaction, and ground motion parameters."
                            badge="AI Powered"
                        />
                        <DemoFeature
                            icon={<FileCheck className="w-5 h-5" />}
                            title="Interactive Results Dashboard"
                            description="View confidence scores, risk status, and detailed recommendations. Toggle 3D overlays for shear walls, foundations, and seismic risk zones."
                            badge="Visual"
                        />
                    </div>
                </div>
            </section>

            {/* Student Demo Features */}
            <section className="w-full py-24 px-6 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">For Students</h2>
                            <p className="text-muted-foreground">Learn seismic design interactively</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <DemoFeature
                            icon={<BookOpen className="w-5 h-5" />}
                            title="Read-Only Analysis Mode"
                            description="Explore pre-configured seismic analysis scenarios. View all engineering parameters and understand how different inputs affect structural performance."
                            badge="Educational"
                        />
                        <DemoFeature
                            icon={<Activity className="w-5 h-5" />}
                            title="Interactive 3D Visualization"
                            description="Navigate through building models with professional viewport controls. Toggle overlays to see shear wall placement, foundation types, and risk zones."
                            badge="Hands-on"
                        />
                        <DemoFeature
                            icon={<TrendingUp className="w-5 h-5" />}
                            title="Multi-Module Results"
                            description="Study detailed analysis outputs including PBD stability, tall building logic, structural walls, soil interaction, and ground motion calculations."
                            badge="Comprehensive"
                        />
                        <DemoFeature
                            icon={<ShieldCheck className="w-5 h-5" />}
                            title="Code Compliance Learning"
                            description="See real-time validation against IS-1893:2016 standards. Understand confidence scores, risk assessments, and engineering recommendations."
                            badge="Standards"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                {icon}
            </div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function DemoFeature({ icon, title, description, badge }) {
    return (
        <div className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/30">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <Badge variant="secondary" className="text-xs">{badge}</Badge>
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}
