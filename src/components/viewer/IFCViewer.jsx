"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as OBC from '@thatopen/components';

/**
 * Real IFC Viewer using ThatOpen Components
 * Loads actual IFC geometry from files
 */
export const IFCViewer = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const componentsRef = useRef(null);
  const fragmentsManagerRef = useRef(null);
  const currentModelRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize ThatOpen Components
    const components = new OBC.Components();
    componentsRef.current = components;

    // Create scene
    const worlds = components.get(OBC.Worlds);
    const world = worlds.create();
    world.scene = new OBC.SimpleScene(components);
    world.scene.three.background = new THREE.Color(0x0a0a0a);

    // Create renderer
    world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
    world.renderer.three.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );

    // Create camera
    world.camera = new OBC.SimpleCamera(components);
    world.camera.controls.setLookAt(30, 20, 30, 0, 0, 0);

    // Add grid (simplified - avoid accessing nested properties that may not exist)
    try {
      const grids = components.get(OBC.Grids);
      const grid = grids.create(world);
      // Grid styling may vary by version, skip if not available
      if (grid?.three?.material?.color) {
        grid.three.material.color.setHex(0x222222);
      }
    } catch (error) {
      console.warn("Grid creation skipped:", error.message);
      // Add manual grid as fallback
      const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
      world.scene.three.add(gridHelper);
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    world.scene.three.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(50, 50, 50);
    world.scene.three.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-50, 50, -50);
    world.scene.three.add(directionalLight2);

    // Initialize fragments manager for IFC loading
    const fragments = components.get(OBC.FragmentsManager);
    fragmentsManagerRef.current = fragments;

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !world.renderer) return;
      world.renderer.resize();
      world.camera?.updateAspect();
    };
    window.addEventListener('resize', handleResize);

    // Start render loop
    components.init();

    return () => {
      window.removeEventListener('resize', handleResize);
      components.dispose();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    /**
     * Load IFC file and display real geometry
     */
    loadIfc: async (file, buildingDetails) => {
      const components = componentsRef.current;
      const fragments = fragmentsManagerRef.current;
      
      if (!components || !fragments) {
        throw new Error("Viewer not initialized");
      }

      console.log("=== Loading Real IFC Model ===");
      console.log("Building:", buildingDetails?.name);
      console.log("File:", file.name);

      try {
        // Dispose previous model
        if (currentModelRef.current) {
          console.log("Disposing previous model...");
          fragments.dispose(currentModelRef.current);
          currentModelRef.current = null;
        }

        // Load IFC file
        const ifcLoader = components.get(OBC.IfcLoader);
        await ifcLoader.setup();

        // Read file as array buffer
        const buffer = await file.arrayBuffer();
        const data = new Uint8Array(buffer);

        // Load the IFC model
        const model = await ifcLoader.load(data);
        currentModelRef.current = model;

        console.log("✓ IFC Model loaded successfully");
        console.log("Model UUID:", model.uuid);
        console.log("Fragments count:", Object.keys(model.items).length);

        // Add model to scene
        const worlds = components.get(OBC.Worlds);
        const world = worlds.list.values().next().value;
        world.scene.three.add(model);

        // Fit camera to model
        const bbox = new THREE.Box3();
        model.traverse((child) => {
          if (child.geometry) {
            child.geometry.computeBoundingBox();
            if (child.geometry.boundingBox) {
              bbox.union(child.geometry.boundingBox);
            }
          }
        });

        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2;

        world.camera.controls.setLookAt(
          center.x + distance,
          center.y + distance * 0.7,
          center.z + distance,
          center.x,
          center.y,
          center.z
        );

        console.log("✓ Camera positioned");
        console.log("Model bounds:", { center, size });

        return model;
      } catch (error) {
        console.error("Failed to load IFC:", error);
        throw new Error(`IFC loading failed: ${error.message}`);
      }
    },

    /**
     * Set predefined camera views
     */
    setView: (type) => {
      const components = componentsRef.current;
      if (!components) return;

      const worlds = components.get(OBC.Worlds);
      const world = worlds.list.values().next().value;
      if (!world?.camera) return;

      const camera = world.camera;
      const model = currentModelRef.current;

      if (!model) {
        // Default views if no model
        switch (type) {
          case 'top':
            camera.controls.setLookAt(0, 50, 0, 0, 0, 0);
            break;
          case 'front':
            camera.controls.setLookAt(0, 10, 40, 0, 5, 0);
            break;
          case 'side':
            camera.controls.setLookAt(40, 10, 0, 0, 5, 0);
            break;
          case 'reset':
            camera.controls.setLookAt(30, 20, 30, 0, 0, 0);
            break;
        }
        return;
      }

      // Calculate model bounds
      const bbox = new THREE.Box3();
      model.traverse((child) => {
        if (child.geometry) {
          child.geometry.computeBoundingBox();
          if (child.geometry.boundingBox) {
            bbox.union(child.geometry.boundingBox);
          }
        }
      });

      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      switch (type) {
        case 'top':
          camera.controls.setLookAt(
            center.x,
            center.y + maxDim * 2,
            center.z,
            center.x,
            center.y,
            center.z
          );
          break;
        case 'front':
          camera.controls.setLookAt(
            center.x,
            center.y,
            center.z + maxDim * 2,
            center.x,
            center.y,
            center.z
          );
          break;
        case 'side':
          camera.controls.setLookAt(
            center.x + maxDim * 2,
            center.y,
            center.z,
            center.x,
            center.y,
            center.z
          );
          break;
        case 'reset':
          camera.controls.setLookAt(
            center.x + maxDim * 1.5,
            center.y + maxDim,
            center.z + maxDim * 1.5,
            center.x,
            center.y,
            center.z
          );
          break;
      }
    },

    /**
     * Dispose current model
     */
    dispose: () => {
      const fragments = fragmentsManagerRef.current;
      if (fragments && currentModelRef.current) {
        fragments.dispose(currentModelRef.current);
        currentModelRef.current = null;
      }
    }
  }));

  return <div ref={containerRef} className="w-full h-full" />;
});

IFCViewer.displayName = "IFCViewer";
