"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

function AnimatedPlane() {
    const meshRef = useRef();
    const { viewport } = useThree();

    // Generate file paths for frames 001 to 120
    const texturePaths = useMemo(() =>
        Array.from({ length: 120 }, (_, i) =>
            `/dashboard-bg/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
        ),
        []);

    // Load all textures
    const textures = useLoader(THREE.TextureLoader, texturePaths);

    // Create a ref to store the current frame index to avoid re-renders
    const frameRef = useRef(0);

    useFrame((state) => {
        if (!meshRef.current || textures.length === 0) return;

        // Calculate frame index based on time (24 fps)
        const frameIndex = Math.floor(state.clock.elapsedTime * 24) % textures.length;

        // Only update if the frame has changed
        if (frameIndex !== frameRef.current) {
            frameRef.current = frameIndex;
            meshRef.current.material.map = textures[frameIndex];
            // Ensure the texture update is flagged
            meshRef.current.material.needsUpdate = true;
        }
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            {/* Use the first texture initially, toneMapped=false for original colors */}
            <meshBasicMaterial map={textures[0]} toneMapped={false} />
        </mesh>
    );
}

export default function Dashboard3DViewer() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full opacity-30 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false }}>
                <Suspense fallback={null}>
                    <AnimatedPlane />
                </Suspense>
            </Canvas>
        </div>
    );
}
