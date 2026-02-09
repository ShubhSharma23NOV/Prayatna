"use client";

import React, { useRef, useState, useEffect } from 'react';
import { FinalViewer } from '@/components/viewer/FinalViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, AlertCircle, ArrowLeft, Eye, Layers, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { buildingRegistry, getBuildingsByType, getBuildingTypes } from '@/lib/buildingRegistry';

export default function IFCViewerPage() {
    const router = useRouter();
    const { userRole } = useApp();
    const viewerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasModel, setHasModel] = useState(false);
    const [modelInfo, setModelInfo] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');

    const isReadOnly = userRole === 'Student';
    
    // Debug: Log hasModel changes
    useEffect(() => {
        console.log("hasModel changed to:", hasModel);
    }, [hasModel]);

    // Get buildings from registry
    const buildingTypes = getBuildingTypes();
    const filteredBuildings = getBuildingsByType(selectedFilter);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            // For uploaded files, use default building details
            const defaultBuilding = {
                name: file.name,
                type: 'residential',
                storeys: 5
            };
            await viewerRef.current?.loadBuilding(defaultBuilding);
            setHasModel(true);
            setModelInfo({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                uploadedAt: new Date().toLocaleString()
            });
        } catch (err) {
            const errorMsg = err.message || "Failed to load IFC model. Ensure it is a valid .ifc file.";
            setError(errorMsg);
            console.error("File load error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadSample = async (buildingId) => {
        console.log("=== handleLoadSample called ===");
        console.log("Building ID:", buildingId);
        setLoading(true);
        setError(null);

        try {
            const building = buildingRegistry.find(b => b.id === buildingId);
            if (!building) {
                throw new Error('Building not found in registry');
            }

            console.log("Found building:", building.name);
            console.log("Fetching IFC file:", building.ifcPath);
            const response = await fetch(building.ifcPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch IFC file: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            console.log("Blob size:", blob.size, "bytes");
            const fileName = building.ifcPath.split('/').pop();
            const file = new File([blob], fileName, { type: 'application/x-step' });
            
            console.log("Calling viewer.loadBuilding...");
            // Load building
            await viewerRef.current?.loadBuilding(building);
            
            console.log("Setting hasModel to true...");
            setHasModel(true);
            setModelInfo({
                name: building.name,
                size: (blob.size / 1024).toFixed(2) + ' KB',
                uploadedAt: new Date().toLocaleString(),
                details: building
            });
            
            console.log("✓ Building loaded successfully");
            console.log("hasModel should now be true");
        } catch (err) {
            const errorMsg = err.message || "Failed to load IFC model.";
            setError(errorMsg);
            console.error("❌ IFC load error:", err);
        } finally {
            console.log("Setting loading to false...");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">IFC Model Viewer</h1>
                        <p className="text-sm text-muted-foreground">Upload and visualize BIM models</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-2">
                    <Layers className="w-3 h-3" />
                    BIM Ready
                </Badge>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 border-r bg-muted/20 p-6 space-y-6 overflow-auto">
                    {!isReadOnly ? (
                        // Engineer Upload Section
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Upload Model
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <input
                                    type="file"
                                    accept=".ifc"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                    Select IFC File
                                </Button>
                                
                                <p className="text-xs text-muted-foreground">
                                    Supported format: .ifc (Industry Foundation Classes)
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        // Student Sample Buildings Library
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Layers className="w-4 h-4" />
                                        Sample Buildings Library
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">Filter by Type</label>
                                        <div className="flex flex-wrap gap-2">
                                            {buildingTypes.map(type => (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setSelectedFilter(type.value)}
                                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                        selectedFilter === type.value
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted hover:bg-muted/80'
                                                    }`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 max-h-96 overflow-auto">
                                        {filteredBuildings.map(building => (
                                            <button
                                                key={building.id}
                                                onClick={() => handleLoadSample(building.id)}
                                                disabled={loading}
                                                className="w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left disabled:opacity-50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="text-2xl">{building.thumbnail}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold truncate">{building.name}</h4>
                                                        <p className="text-xs text-muted-foreground mt-1">{building.description}</p>
                                                        <div className="flex gap-2 mt-2">
                                                            <Badge variant="secondary" className="text-[10px]">{building.storeys} Floors</Badge>
                                                            <Badge variant="outline" className="text-[10px]">Zone {building.seismicZone}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {modelInfo && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Box className="w-4 h-4" />
                                    Model Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Building:</span>
                                    <span className="font-mono">{modelInfo.name}</span>
                                </div>
                                {modelInfo.details && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type:</span>
                                            <span className="font-mono capitalize">{modelInfo.details.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Storeys:</span>
                                            <span className="font-mono">{modelInfo.details.storeys}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Seismic Zone:</span>
                                            <span className="font-mono">Zone {modelInfo.details.seismicZone}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Size:</span>
                                    <span className="font-mono">{modelInfo.size}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Loaded:</span>
                                    <span className="font-mono text-[10px]">{modelInfo.uploadedAt}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {hasModel && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    View Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => viewerRef.current?.setView('top')}
                                >
                                    Top View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => viewerRef.current?.setView('front')}
                                >
                                    Front View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => viewerRef.current?.setView('side')}
                                >
                                    Side View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => viewerRef.current?.setView('reset')}
                                >
                                    Reset View
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </aside>

                {/* Viewer */}
                <main className="flex-1 relative bg-[#1a1a1a]">
                    <FinalViewer ref={viewerRef} />
                    
                    {/* Debug indicator */}
                    {hasModel && (
                        <div className="absolute top-4 left-4 z-30 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold pointer-events-none">
                            MODEL LOADED ✓
                        </div>
                    )}

                    {!hasModel && !loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm pointer-events-none z-20">
                            <div className="text-center space-y-4 max-w-md px-6 pointer-events-auto">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <Layers className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold">No Model Loaded</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isReadOnly 
                                        ? "Select a sample building from the library to begin exploration"
                                        : "Upload an IFC file from the sidebar to begin visualization"}
                                </p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none z-30">
                            <div className="text-center space-y-4 pointer-events-none">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                                <p className="text-sm text-white font-medium">Loading IFC Model...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute top-4 right-4 z-30 pointer-events-auto">
                            <Badge variant="destructive" className="gap-2">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </Badge>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
