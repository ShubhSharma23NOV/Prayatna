"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const SimpleThreeViewer = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        sceneRef.current = scene;

        // Create camera
        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(30, 20, 30);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Add controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight1.position.set(50, 50, 50);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-50, 50, -50);
        scene.add(directionalLight2);

        // Add grid
        const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
        scene.add(gridHelper);

        // Add axes helper
        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            controls.dispose();
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    useImperativeHandle(ref, () => ({
        loadIfc: async (file, buildingDetails) => {
            const scene = sceneRef.current;
            if (!scene) throw new Error("Scene not initialized");

            console.log("=== Loading Building ===");
            console.log("Building Details:", buildingDetails);

            // Remove any existing building models
            const existingBuildings = scene.children.filter(child => 
                child.type === 'Group' && child.name && !child.name.includes('Helper')
            );
            console.log("Removing existing buildings:", existingBuildings.length);
            existingBuildings.forEach(building => {
                scene.remove(building);
                // Dispose of geometries and materials
                building.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => mat.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            });

            // Create building model based on building details
            const buildingGroup = new THREE.Group();
            buildingGroup.name = buildingDetails?.name || "Demo Building";

            const storeys = buildingDetails?.storeys || 3;
            const buildingWidth = buildingDetails?.width || 20;
            const buildingDepth = buildingDetails?.depth || 15;
            const floorHeight = buildingDetails?.floorHeight || 3;
            const totalHeight = storeys * floorHeight;

            console.log("Building params:", { storeys, buildingWidth, buildingDepth, floorHeight, totalHeight, type: buildingDetails?.type });

            // Foundation slab
            const slabGeometry = new THREE.BoxGeometry(buildingWidth, 0.5, buildingDepth);
            const slabMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x808080,
                metalness: 0.3,
                roughness: 0.7
            });
            const slab = new THREE.Mesh(slabGeometry, slabMaterial);
            slab.position.y = 0;
            buildingGroup.add(slab);

            // Columns (grid pattern)
            const columnGeometry = new THREE.BoxGeometry(0.6, totalHeight, 0.6);
            const columnMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x404040,
                metalness: 0.5,
                roughness: 0.5
            });
            
            const colSpacingX = buildingWidth / 3;
            const colSpacingZ = buildingDepth / 3;
            
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const column = new THREE.Mesh(columnGeometry, columnMaterial);
                    column.position.set(
                        -buildingWidth/2 + colSpacingX + i * colSpacingX,
                        totalHeight / 2,
                        -buildingDepth/2 + colSpacingZ + j * colSpacingZ
                    );
                    buildingGroup.add(column);
                }
            }

            // Walls
            const wallMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xdddddd,
                metalness: 0.1,
                roughness: 0.8
            });
            
            // North wall
            const northWall = new THREE.Mesh(
                new THREE.BoxGeometry(buildingWidth, totalHeight, 0.3),
                wallMaterial
            );
            northWall.position.set(0, totalHeight / 2, -buildingDepth / 2);
            buildingGroup.add(northWall);

            // South wall
            const southWall = new THREE.Mesh(
                new THREE.BoxGeometry(buildingWidth, totalHeight, 0.3),
                wallMaterial
            );
            southWall.position.set(0, totalHeight / 2, buildingDepth / 2);
            buildingGroup.add(southWall);

            // East wall
            const eastWall = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, totalHeight, buildingDepth),
                wallMaterial
            );
            eastWall.position.set(-buildingWidth / 2, totalHeight / 2, 0);
            buildingGroup.add(eastWall);

            // West wall
            const westWall = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, totalHeight, buildingDepth),
                wallMaterial
            );
            westWall.position.set(buildingWidth / 2, totalHeight / 2, 0);
            buildingGroup.add(westWall);

            // Floor slabs for each storey
            for (let i = 1; i <= storeys; i++) {
                const floorSlab = new THREE.Mesh(slabGeometry, slabMaterial);
                floorSlab.position.y = i * floorHeight;
                buildingGroup.add(floorSlab);
            }

            // Add color-coded marker based on building type
            const markerColors = {
                'residential': 0x4CAF50,
                'commercial': 0x2196F3,
                'institutional': 0xFF9800,
                'industrial': 0x9C27B0
            };
            const markerColor = markerColors[buildingDetails?.type] || 0xff0000;
            
            const marker = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2, 2),
                new THREE.MeshStandardMaterial({ color: markerColor })
            );
            marker.position.set(0, 1, 0);
            buildingGroup.add(marker);

            scene.add(buildingGroup);
            console.log("Building group added to scene. Children count:", buildingGroup.children.length);
            console.log("Scene children count:", scene.children.length);

            // Position camera to see the building
            if (cameraRef.current && controlsRef.current) {
                const distance = Math.max(buildingWidth, buildingDepth, totalHeight) * 2;
                cameraRef.current.position.set(distance, distance * 0.7, distance);
                controlsRef.current.target.set(0, totalHeight / 2, 0);
                controlsRef.current.update();
            }

            console.log(`${buildingDetails?.name || 'Building'} loaded successfully!`);
            console.log("Storeys:", storeys, "Height:", totalHeight);
            
            return buildingGroup;
        },
        setView: (type) => {
            if (!cameraRef.current || !controlsRef.current) return;
            
            const camera = cameraRef.current;
            const controls = controlsRef.current;
            
            switch (type) {
                case 'top':
                    camera.position.set(0, 50, 0);
                    controls.target.set(0, 0, 0);
                    break;
                case 'front':
                    camera.position.set(0, 10, 40);
                    controls.target.set(0, 2.5, 0);
                    break;
                case 'side':
                    camera.position.set(40, 10, 0);
                    controls.target.set(0, 2.5, 0);
                    break;
                case 'reset':
                    camera.position.set(30, 20, 30);
                    controls.target.set(0, 2.5, 0);
                    break;
            }
            controls.update();
        }
    }));

    return <div ref={containerRef} className="w-full h-full" />;
});

SimpleThreeViewer.displayName = "SimpleThreeViewer";
