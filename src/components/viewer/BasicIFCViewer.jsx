"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Basic IFC Viewer - Fallback using pure Three.js
 * Displays procedural models based on building metadata
 * More stable than ThatOpen Components for demo purposes
 */
export const BasicIFCViewer = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const currentModelRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("=== Initializing BasicIFCViewer ===");
    console.log("Container dimensions:", containerRef.current.clientWidth, "x", containerRef.current.clientHeight);

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e); // Dark blue-gray instead of pure black
    sceneRef.current = scene;
    console.log("Scene created with background color");

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
    console.log("Camera created");

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Explicitly set canvas styles for interaction
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none'; // Important for touch/mouse events
    renderer.domElement.style.cursor = 'grab';
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    console.log("Renderer created and canvas appended");
    console.log("Canvas size:", renderer.domElement.width, "x", renderer.domElement.height);
    console.log("Canvas style:", renderer.domElement.style.cssText);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Enable all interactions
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.enableZoom = true;
    
    // Allow full 360° vertical rotation
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    
    // Smoother experience
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    
    controlsRef.current = controls;
    console.log("OrbitControls created and fully enabled");
    
    // Test controls are working
    controls.addEventListener('change', () => {
      console.log("Camera moved! Position:", camera.position);
    });

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(50, 50, 50);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-50, 50, -50);
    scene.add(directionalLight2);

    // Add grid (visible by default)
    const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
    scene.add(gridHelper);
    console.log("Grid added");

    // Add axes helper (visible by default)
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    console.log("Axes added");

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

      console.log("=== Loading Building Model ===");
      console.log("Building:", buildingDetails?.name);
      console.log("Type:", buildingDetails?.type);
      console.log("Storeys:", buildingDetails?.storeys);

      // Remove existing model
      if (currentModelRef.current) {
        console.log("Removing previous model...");
        scene.remove(currentModelRef.current);
        currentModelRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        currentModelRef.current = null;
      }

      // Create building model based on metadata
      const buildingGroup = new THREE.Group();
      buildingGroup.name = buildingDetails?.name || "Building";

      // Extract building parameters
      const storeys = buildingDetails?.storeys || 3;
      const type = buildingDetails?.type || 'residential';
      
      // Vary dimensions by building type
      let buildingWidth, buildingDepth, floorHeight;
      
      switch(type) {
        case 'industrial':
          buildingWidth = 50;  // Much wider
          buildingDepth = 40;
          floorHeight = 7;     // Taller ceilings
          break;
        case 'institutional':
          buildingWidth = storeys > 5 ? 35 : 45;  // Hospitals/schools are wide
          buildingDepth = 30;
          floorHeight = 4.5;
          break;
        case 'commercial':
          buildingWidth = 30;
          buildingDepth = 25;
          floorHeight = 4.5;
          break;
        case 'residential':
        default:
          buildingWidth = 18;  // Narrower
          buildingDepth = 14;
          floorHeight = 3;     // Standard residential
          break;
      }

      const totalHeight = storeys * floorHeight;

      console.log("=== BUILDING DIMENSIONS ===");
      console.log("Width:", buildingWidth, "m");
      console.log("Depth:", buildingDepth, "m");
      console.log("Floor Height:", floorHeight, "m");
      console.log("Total Height:", totalHeight, "m");
      console.log("Footprint:", buildingWidth * buildingDepth, "m²");
      console.log("========================");

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

      // Columns (3x3 grid)
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

      // Walls - color varies by building type
      const wallColors = {
        'residential': 0xE8F5E9,  // Light green
        'commercial': 0xE3F2FD,   // Light blue
        'institutional': 0xFFF3E0, // Light orange
        'industrial': 0xF3E5F5     // Light purple
      };
      const wallColor = wallColors[type] || 0xdddddd;
      
      const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: wallColor,
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
      const markerColor = markerColors[type] || 0xff0000;
      
      // Large colored cube at the top to identify building type
      const markerSize = Math.max(buildingWidth, buildingDepth) * 0.15;
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(markerSize, markerSize, markerSize),
        new THREE.MeshStandardMaterial({ 
          color: markerColor,
          emissive: markerColor,
          emissiveIntensity: 0.5,
          metalness: 0.8,
          roughness: 0.2
        })
      );
      marker.position.set(0, totalHeight + markerSize, 0);
      buildingGroup.add(marker);
      
      // Add building info text (using a plane with color)
      const infoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(buildingWidth * 0.8, 3),
        new THREE.MeshBasicMaterial({ 
          color: markerColor,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        })
      );
      infoPlane.position.set(0, totalHeight + markerSize * 2.5, 0);
      infoPlane.rotation.x = Math.PI / 2;
      buildingGroup.add(infoPlane);
      
      // Add height measurement line
      const heightLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(buildingWidth/2 + 3, 0, 0),
        new THREE.Vector3(buildingWidth/2 + 3, totalHeight, 0)
      ]);
      const heightLine = new THREE.Line(
        heightLineGeometry,
        new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 })
      );
      buildingGroup.add(heightLine);
      
      // Add height markers every 10m
      for (let h = 0; h <= totalHeight; h += 10) {
        const heightMarker = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.3, 0.3),
          new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        heightMarker.position.set(buildingWidth/2 + 3, h, 0);
        buildingGroup.add(heightMarker);
      }

      // Add to scene
      scene.add(buildingGroup);
      currentModelRef.current = buildingGroup;
      
      console.log("Building added to scene");
      console.log("Building position:", buildingGroup.position);
      console.log("Scene children count:", scene.children.length);
      console.log("Building bounding box:");
      const bbox = new THREE.Box3().setFromObject(buildingGroup);
      console.log("  Min:", bbox.min);
      console.log("  Max:", bbox.max);
      console.log("  Center:", bbox.getCenter(new THREE.Vector3()));
      
      // Show grid and axes now that we have a model
      scene.children.forEach(child => {
        if (child.type === 'GridHelper' || child.type === 'AxesHelper') {
          child.visible = true;
        }
      });

      // Add size reference markers at ground level
      const refMarkerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
      const refMarkerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5
      });
      
      // Corner markers to show footprint
      const corners = [
        [-buildingWidth/2, 0, -buildingDepth/2],
        [buildingWidth/2, 0, -buildingDepth/2],
        [-buildingWidth/2, 0, buildingDepth/2],
        [buildingWidth/2, 0, buildingDepth/2]
      ];
      
      corners.forEach(([x, y, z]) => {
        const marker = new THREE.Mesh(refMarkerGeometry, refMarkerMaterial);
        marker.position.set(x, y, z);
        buildingGroup.add(marker);
      });

      // Position camera to clearly show the building
      if (cameraRef.current && controlsRef.current) {
        // Calculate optimal camera distance based on building size
        const maxDimension = Math.max(buildingWidth, buildingDepth, totalHeight);
        const distance = maxDimension * 1.8;
        
        // Get building center
        const bbox = new THREE.Box3().setFromObject(buildingGroup);
        const center = bbox.getCenter(new THREE.Vector3());
        
        // Position camera at 45-degree angle looking at building center
        cameraRef.current.position.set(
          center.x + distance * 0.7,
          center.y + distance * 0.3,
          center.z + distance * 0.7
        );
        controlsRef.current.target.copy(center);
        controlsRef.current.update();
        
        console.log("Camera positioned at:", cameraRef.current.position);
        console.log("Camera looking at:", center);
        console.log("Camera distance:", distance.toFixed(1), "m");
      }

      console.log("✓ Building model created successfully");
      console.log("Children count:", buildingGroup.children.length);
      
      return buildingGroup;
    },

    setView: (type) => {
      if (!cameraRef.current || !controlsRef.current) return;
      
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const model = currentModelRef.current;
      
      let targetY = 0;
      if (model) {
        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        targetY = center.y;
        
        const maxDim = Math.max(size.x, size.y, size.z);
        
        switch (type) {
          case 'top':
            camera.position.set(center.x, center.y + maxDim * 2, center.z);
            controls.target.set(center.x, center.y, center.z);
            break;
          case 'front':
            camera.position.set(center.x, center.y, center.z + maxDim * 2);
            controls.target.set(center.x, center.y, center.z);
            break;
          case 'side':
            camera.position.set(center.x + maxDim * 2, center.y, center.z);
            controls.target.set(center.x, center.y, center.z);
            break;
          case 'reset':
            camera.position.set(center.x + maxDim * 1.5, center.y + maxDim, center.z + maxDim * 1.5);
            controls.target.set(center.x, center.y, center.z);
            break;
        }
      } else {
        // Default views if no model
        switch (type) {
          case 'top':
            camera.position.set(0, 50, 0);
            controls.target.set(0, 0, 0);
            break;
          case 'front':
            camera.position.set(0, 10, 40);
            controls.target.set(0, 5, 0);
            break;
          case 'side':
            camera.position.set(40, 10, 0);
            controls.target.set(0, 5, 0);
            break;
          case 'reset':
            camera.position.set(30, 20, 30);
            controls.target.set(0, 5, 0);
            break;
        }
      }
      controls.update();
    },

    dispose: () => {
      const scene = sceneRef.current;
      if (scene && currentModelRef.current) {
        scene.remove(currentModelRef.current);
        currentModelRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        currentModelRef.current = null;
      }
    }
  }));

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        touchAction: 'none',
        userSelect: 'none'
      }} 
    />
  );
});

BasicIFCViewer.displayName = "BasicIFCViewer";
