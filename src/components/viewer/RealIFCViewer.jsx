"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { IFCLoader } from 'web-ifc-three/IFCLoader';

/**
 * Real IFC Viewer - Parses and displays actual IFC geometry
 * Uses web-ifc-three to load real IFC files
 */
export const RealIFCViewer = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(40, 30, 40);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Manual camera controls
    const canvas = renderer.domElement;
    canvas.style.cursor = 'grab';
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const targetPosition = new THREE.Vector3(0, 15, 0);
    
    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };
    
    const handleMouseUp = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      const offset = new THREE.Vector3().subVectors(camera.position, targetPosition);
      const radius = offset.length();
      
      let theta = Math.atan2(offset.x, offset.z);
      let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));
      
      theta -= deltaX * 0.01;
      phi -= deltaY * 0.01;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
      
      camera.position.x = targetPosition.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = targetPosition.y + radius * Math.cos(phi);
      camera.position.z = targetPosition.z + radius * Math.sin(phi) * Math.cos(theta);
      
      camera.lookAt(targetPosition);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      const zoomSpeed = 0.1;
      const direction = e.deltaY > 0 ? 1 : -1;
      const factor = 1 + direction * zoomSpeed;
      
      const offset = new THREE.Vector3().subVectors(camera.position, targetPosition);
      offset.multiplyScalar(factor);
      
      const newDistance = offset.length();
      if (newDistance > 5 && newDistance < 200) {
        camera.position.copy(targetPosition).add(offset);
        camera.lookAt(targetPosition);
      }
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
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

    // IFC Loader
    const ifcLoader = new IFCLoader();
    
    // Set WASM path - must be done before loading any files
    ifcLoader.ifcManager.setWasmPath('/wasm/');
    
    // Initialize the IFC manager
    ifcLoader.ifcManager.setupThreeMeshBVH();
    
    loaderRef.current = ifcLoader;

    console.log('✅ RealIFCViewer initialized with web-ifc-three');
    console.log('✅ WASM path set to: /wasm/');

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

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupControls();
      if (loaderRef.current) {
        loaderRef.current.ifcManager.dispose();
      }
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    loadIFCFile: async (file) => {
      const scene = sceneRef.current;
      const loader = loaderRef.current;
      const camera = cameraRef.current;
      
      if (!scene || !loader) {
        console.error('Scene or loader not initialized');
        return;
      }

      // Remove old model
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
      }

      try {
        console.log('Loading IFC file:', file.name);
        console.log('File size:', file.size, 'bytes');
        console.log('File type:', file.type);
        
        // Create URL from file
        const url = URL.createObjectURL(file);
        console.log('Blob URL created:', url);
        
        // Load IFC model
        console.log('Starting IFC load...');
        const model = await loader.loadAsync(url);
        console.log('IFC model loaded:', model);
        
        // Add to scene
        scene.add(model);
        modelRef.current = model;
        
        // Calculate bounding box and position camera
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 2; // Add some padding
        
        camera.position.set(center.x + cameraZ, center.y + cameraZ * 0.5, center.z + cameraZ);
        camera.lookAt(center);
        
        // Clean up URL
        URL.revokeObjectURL(url);
        
        console.log('✅ IFC file loaded successfully');
        console.log('Model bounds:', box);
        console.log('Model center:', center);
        console.log('Model size:', size);
        
      } catch (error) {
        console.error('❌ Error loading IFC file:', error);
        throw error;
      }
    },

    loadIFCFromURL: async (url) => {
      const scene = sceneRef.current;
      const loader = loaderRef.current;
      const camera = cameraRef.current;
      
      if (!scene || !loader) {
        console.error('Scene or loader not initialized');
        return;
      }

      // Remove old model
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
      }

      try {
        console.log('Loading IFC from URL:', url);
        
        // Load IFC model
        const model = await loader.loadAsync(url);
        
        // Add to scene
        scene.add(model);
        modelRef.current = model;
        
        // Calculate bounding box and position camera
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 2;
        
        camera.position.set(center.x + cameraZ, center.y + cameraZ * 0.5, center.z + cameraZ);
        camera.lookAt(center);
        
        console.log('✅ IFC file loaded from URL successfully');
        console.log('Model bounds:', box);
        
      } catch (error) {
        console.error('❌ Error loading IFC from URL:', error);
        throw error;
      }
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

RealIFCViewer.displayName = "RealIFCViewer";
