"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export default function Hero3DVideo() {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const rotateX = isHovered ? mousePosition.y * 10 : 0;
    const rotateY = isHovered ? mousePosition.x * -10 : 0;

    return (
        <div 
            ref={containerRef}
            className="w-full max-w-6xl px-6 pb-24"
            style={{ perspective: '1500px' }}
        >
            <div
                className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ease-out"
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
                    transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Video Element */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-sm font-medium text-white">Interactive 3D Engine</span>
                </div>

                {/* Bottom Text */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Real-time Force Simulation</h3>
                    <p className="text-white/80 text-sm">Experience structural analysis in an immersive 3D environment</p>
                </div>

                {/* 3D Depth Layers */}
                <div 
                    className="absolute inset-0 border-2 border-white/10 rounded-3xl pointer-events-none"
                    style={{
                        transform: 'translateZ(20px)',
                    }}
                />
                <div 
                    className="absolute inset-4 border border-white/5 rounded-2xl pointer-events-none"
                    style={{
                        transform: 'translateZ(40px)',
                    }}
                />
            </div>

            {/* Shadow Effect */}
            <div 
                className="absolute inset-0 -z-10 blur-3xl opacity-50"
                style={{
                    background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3), transparent 70%)',
                    transform: `translateY(${isHovered ? '10px' : '20px'})`,
                    transition: 'transform 0.3s ease-out',
                }}
            />
        </div>
    );
}
