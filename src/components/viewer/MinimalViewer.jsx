"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

/**
 * Minimal Three.js Viewer with Manual Camera Controls
 * OrbitControls doesn't work with Next.js 16/React 19, so we use manual controls
 */
export const MinimalViewer = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const targetRef = useRef(new THREE.Vector3(0, 15, 0)); // Center of building at mid-height

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera - position to view the building from a good angle
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    // Position camera to see the full building centered
    camera.position.set(50, 20, 50);
    camera.lookAt(0, 15, 0); // Look at center of building (height/2)
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // CRITICAL: Append canvas BEFORE creating controls
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    console.log('✅ Canvas appended to DOM');
    console.log('Canvas in document?', document.contains(renderer.domElement));

    // MANUAL CAMERA CONTROLS (OrbitControls not working with Next.js 16/React 19)
    const canvas = renderer.domElement;
    canvas.style.cursor = 'grab';
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    // Mouse down - start dragging
    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };
    
    // Mouse up - stop dragging
    const handleMouseUp = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };
    
    // Mouse move - rotate camera
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      const targetPosition = targetRef.current;
      
      // Calculate spherical coordinates
      const offset = new THREE.Vector3().subVectors(camera.position, targetPosition);
      const radius = offset.length();
      
      let theta = Math.atan2(offset.x, offset.z);
      let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));
      
      // Update angles based on mouse movement
      theta -= deltaX * 0.01;
      phi -= deltaY * 0.01;
      
      // Clamp phi to prevent flipping
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
      
      // Convert back to Cartesian coordinates
      camera.position.x = targetPosition.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = targetPosition.y + radius * Math.cos(phi);
      camera.position.z = targetPosition.z + radius * Math.sin(phi) * Math.cos(theta);
      
      camera.lookAt(targetPosition);
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    // Mouse wheel - zoom
    const handleWheel = (e) => {
      e.preventDefault();
      
      const targetPosition = targetRef.current;
      const zoomSpeed = 0.1;
      const direction = e.deltaY > 0 ? 1 : -1;
      const factor = 1 + direction * zoomSpeed;
      
      // Zoom towards/away from target
      const offset = new THREE.Vector3().subVectors(camera.position, targetPosition);
      offset.multiplyScalar(factor);
      
      // Clamp distance
      const newDistance = offset.length();
      if (newDistance > 2 && newDistance < 500) {
        camera.position.copy(targetPosition).add(offset);
        camera.lookAt(targetPosition);
      }
    };
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    console.log('✅ Manual camera controls enabled (drag to rotate, scroll to zoom)');
    
    // Store cleanup functions
    const cleanupControls = () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
    };

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(50, 100, 50);
    scene.add(light1);

    // Grid
    const grid = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
    scene.add(grid);

    // Axes
    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // DEFAULT BUILDING MODEL - Professional looking
    const defaultBuilding = new THREE.Group();
    
    // Create a realistic multi-story building
    const floors = 10;
    const floorHeight = 3;
    const buildingWidth = 20;
    const buildingDepth = 15;
    
    // Main building structure
    const buildingGeometry = new THREE.BoxGeometry(buildingWidth, floors * floorHeight, buildingDepth);
    const buildingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      metalness: 0.3,
      roughness: 0.7
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = (floors * floorHeight) / 2;
    building.castShadow = true;
    building.receiveShadow = true;
    defaultBuilding.add(building);
    
    // Floor separators
    for (let i = 1; i < floors; i++) {
      const floorLine = new THREE.Mesh(
        new THREE.BoxGeometry(buildingWidth + 0.2, 0.3, buildingDepth + 0.2),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
      );
      floorLine.position.y = i * floorHeight;
      defaultBuilding.add(floorLine);
    }
    
    // Windows with glass material
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4488ff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x2244aa,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7
    });
    
    // Add windows on all floors
    for (let floor = 0; floor < floors; floor++) {
      for (let col = 0; col < 4; col++) {
        // Front facade windows
        const windowFront = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 0.2),
          windowMaterial
        );
        windowFront.position.set(
          -buildingWidth/2 + 4 + col * 4,
          floorHeight * floor + floorHeight/2,
          buildingDepth/2 + 0.1
        );
        defaultBuilding.add(windowFront);
        
        // Back facade windows
        const windowBack = windowFront.clone();
        windowBack.position.z = -buildingDepth/2 - 0.1;
        defaultBuilding.add(windowBack);
        
        // Side windows
        if (col < 3) {
          const windowSide = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 2, 2),
            windowMaterial
          );
          windowSide.position.set(
            buildingWidth/2 + 0.1,
            floorHeight * floor + floorHeight/2,
            -buildingDepth/2 + 3 + col * 4
          );
          defaultBuilding.add(windowSide);
          
          const windowSide2 = windowSide.clone();
          windowSide2.position.x = -buildingWidth/2 - 0.1;
          defaultBuilding.add(windowSide2);
        }
      }
    }
    
    // Roof structure
    const roofGeometry = new THREE.ConeGeometry(buildingWidth * 0.7, 4, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = floors * floorHeight + 2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    defaultBuilding.add(roof);
    
    // Building edges for definition
    const edges = new THREE.EdgesGeometry(buildingGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    wireframe.position.copy(building.position);
    defaultBuilding.add(wireframe);
    
    // Ground/foundation
    const foundation = new THREE.Mesh(
      new THREE.BoxGeometry(buildingWidth + 2, 1, buildingDepth + 2),
      new THREE.MeshStandardMaterial({ color: 0x666666 })
    );
    foundation.position.y = -0.5;
    foundation.receiveShadow = true;
    defaultBuilding.add(foundation);
    
    scene.add(defaultBuilding);
    defaultBuilding.visible = false; // Hide by default - only show when model loaded
    console.log('✅ Default building created (hidden)');

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function handleResize() {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    console.log("✅ MinimalViewer initialized with manual controls");

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupControls();
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    loadBuilding: (buildingDetails) => {
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!scene || !camera) return;

      // Remove old model
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }

      // Create building from backend-generated dimensions
      const group = new THREE.Group();
      
      // Use dimensions from buildingDetails if available (from backend)
      const footingLength = buildingDetails?.footing_length || 3.0;
      const footingWidth = buildingDetails?.footing_width || 3.0;
      const footingDepth = buildingDetails?.footing_depth || 1.5;
      const columnWidth = buildingDetails?.column_width || 0.6;
      const columnDepth = buildingDetails?.column_depth || 0.6;
      const columnHeight = buildingDetails?.column_height || 3.0;

      // Create footing (foundation) - brown color, below ground
      const footing = new THREE.Mesh(
        new THREE.BoxGeometry(footingLength, footingDepth, footingWidth),
        new THREE.MeshStandardMaterial({ 
          color: 0x8B4513, // Brown
          transparent: true,
          opacity: 0.8
        })
      );
      footing.position.y = -footingDepth / 2; // Position below ground
      group.add(footing);

      // Create column - blue color, above ground
      const column = new THREE.Mesh(
        new THREE.BoxGeometry(columnWidth, columnHeight, columnDepth),
        new THREE.MeshStandardMaterial({ 
          color: 0x2196F3, // Blue
          transparent: true,
          opacity: 0.9
        })
      );
      column.position.y = columnHeight / 2; // Position above ground
      group.add(column);

      // Add wireframe edges for better visibility
      const footingEdges = new THREE.EdgesGeometry(footing.geometry);
      const footingLines = new THREE.LineSegments(
        footingEdges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      footing.add(footingLines);

      const columnEdges = new THREE.EdgesGeometry(column.geometry);
      const columnLines = new THREE.LineSegments(
        columnEdges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      column.add(columnLines);

      // Add ground plane reference
      const groundPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(footingLength * 3, footingWidth * 3),
        new THREE.MeshStandardMaterial({ 
          color: 0x90EE90, // Light green
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        })
      );
      groundPlane.rotation.x = -Math.PI / 2;
      groundPlane.position.y = 0;
      group.add(groundPlane);

      scene.add(group);
      modelRef.current = group;

      // Calculate model center and size
      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Update target position for camera controls
      targetRef.current.copy(center);
      
      // Position camera to view the entire model
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 2.5; // Add padding
      
      camera.position.set(
        center.x + cameraZ * 0.7,
        center.y + cameraZ * 0.5,
        center.z + cameraZ * 0.7
      );
      camera.lookAt(center);

      console.log("✅ Building loaded:", buildingDetails?.name);
      console.log("Footing:", footingLength, "×", footingWidth, "×", footingDepth, "m");
      console.log("Column:", columnWidth, "×", columnDepth, "×", columnHeight, "m");
      console.log("Model center:", center);
      console.log("Model size:", size);
      console.log("Camera position:", camera.position);
    }
  }));

  return (
    <div 
      ref={mountRef} 
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        cursor: 'grab'
      }}
    />
  );
});

MinimalViewer.displayName = "MinimalViewer";
