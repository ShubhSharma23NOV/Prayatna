"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import * as WebIFC from 'web-ifc';

/**
 * Simple IFC Viewer - Uses web-ifc directly
 * Parses IFC files and displays geometry
 */
export const SimpleIFCViewer = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const ifcApiRef = useRef(null);

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

    // Initialize web-ifc API
    const ifcApi = new WebIFC.IfcAPI();
    
    // Set WASM path with locateFile
    ifcApi.wasmModule = {
      locateFile: (path) => {
        console.log('Locating WASM file:', path);
        const wasmPath = `/wasm/${path}`;
        console.log('Resolved to:', wasmPath);
        return wasmPath;
      }
    };
    
    ifcApi.SetWasmPath('/wasm/');
    ifcApiRef.current = ifcApi;

    console.log('✅ SimpleIFCViewer initialized');
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
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    loadIFCFile: async (file) => {
      const scene = sceneRef.current;
      const ifcApi = ifcApiRef.current;
      const camera = cameraRef.current;
      
      if (!scene || !ifcApi) {
        console.error('Scene or IFC API not initialized');
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
        
        // Read file as array buffer
        const data = await file.arrayBuffer();
        const uint8Array = new Uint8Array(data);
        
        console.log('Initializing IFC API...');
        await ifcApi.Init();
        
        console.log('Opening IFC model...');
        const modelID = ifcApi.OpenModel(uint8Array);
        
        console.log('Model ID:', modelID);
        console.log('Getting all geometry...');
        
        // Create Three.js group for the model
        const modelGroup = new THREE.Group();
        
        // Get all geometry
        const geometries = ifcApi.LoadAllGeometry(modelID);
        
        console.log('Geometries loaded:', geometries.size());
        
        // Convert IFC geometry to Three.js meshes
        for (let i = 0; i < geometries.size(); i++) {
          const geometry = geometries.get(i);
          const geometryData = ifcApi.GetGeometry(modelID, geometry.geometryExpressID);
          
          const verts = ifcApi.GetVertexArray(geometryData.GetVertexData(), geometryData.GetVertexDataSize());
          const indices = ifcApi.GetIndexArray(geometryData.GetIndexData(), geometryData.GetIndexDataSize());
          
          const bufferGeometry = new THREE.BufferGeometry();
          bufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
          bufferGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
          bufferGeometry.computeVertexNormals();
          
          const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            side: THREE.DoubleSide
          });
          
          const mesh = new THREE.Mesh(bufferGeometry, material);
          
          // Apply transformation matrix
          const matrix = geometry.flatTransformation;
          if (matrix && matrix.length === 16) {
            mesh.matrix.fromArray(matrix);
            mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
          }
          
          modelGroup.add(mesh);
        }
        
        // Add to scene
        scene.add(modelGroup);
        modelRef.current = modelGroup;
        
        // Calculate bounding box and position camera
        const box = new THREE.Box3().setFromObject(modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 2;
        
        camera.position.set(center.x + cameraZ, center.y + cameraZ * 0.5, center.z + cameraZ);
        camera.lookAt(center);
        
        // Close model
        ifcApi.CloseModel(modelID);
        
        console.log('✅ IFC file loaded successfully');
        console.log('Model bounds:', box);
        console.log('Model center:', center);
        console.log('Model size:', size);
        console.log('Meshes created:', modelGroup.children.length);
        
      } catch (error) {
        console.error('❌ Error loading IFC file:', error);
        throw error;
      }
    },

    loadIFCFromURL: async (url) => {
      try {
        console.log('Fetching IFC from URL:', url);
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], url.split('/').pop(), { type: 'application/x-step' });
        await ref.current.loadIFCFile(file);
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

SimpleIFCViewer.displayName = "SimpleIFCViewer";
