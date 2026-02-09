"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

export const StructuralAnalysisViewer = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const targetRef = useRef(new THREE.Vector3(0, 10, 0));
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 5 });
  const cameraDistanceRef = useRef(60);

  // Create structural frame with stress visualization
  const createStructuralFrame = () => {
    const group = new THREE.Group();
    
    const storeys = 5;
    const bayWidth = 6; // meters
    const bayDepth = 6;
    const floorHeight = 4;
    const totalHeight = storeys * floorHeight;

    // Create foundation with stress colors
    const foundationGeometry = new THREE.BoxGeometry(bayWidth * 3 + 2, 1, bayDepth * 3 + 2);
    const foundationMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2a4a2a,
      metalness: 0.3,
      roughness: 0.8
    });
    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.y = -0.5;
    foundation.receiveShadow = true;
    group.add(foundation);

    // Stress color gradient (green = low stress, yellow = medium, red = high)
    const getStressColor = (level) => {
      if (level < 0.3) return 0x44ff44; // Green - low stress
      if (level < 0.6) return 0xffff44; // Yellow - medium stress
      if (level < 0.8) return 0xff8844; // Orange - high stress
      return 0xff4444; // Red - critical stress
    };

    // Create columns with varying stress levels
    const columnPositions = [
      { x: -bayWidth, z: -bayDepth, stress: 0.8 },
      { x: 0, z: -bayDepth, stress: 0.5 },
      { x: bayWidth, z: -bayDepth, stress: 0.7 },
      { x: -bayWidth, z: 0, stress: 0.6 },
      { x: 0, z: 0, stress: 0.9 }, // Center column - highest stress
      { x: bayWidth, z: 0, stress: 0.6 },
      { x: -bayWidth, z: bayDepth, stress: 0.7 },
      { x: 0, z: bayDepth, stress: 0.5 },
      { x: bayWidth, z: bayDepth, stress: 0.8 }
    ];

    columnPositions.forEach(pos => {
      const columnGeometry = new THREE.BoxGeometry(0.4, totalHeight, 0.4);
      const columnMaterial = new THREE.MeshStandardMaterial({ 
        color: getStressColor(pos.stress),
        metalness: 0.6,
        roughness: 0.4,
        emissive: getStressColor(pos.stress),
        emissiveIntensity: 0.2
      });
      const column = new THREE.Mesh(columnGeometry, columnMaterial);
      column.position.set(pos.x, totalHeight / 2, pos.z);
      column.castShadow = true;
      group.add(column);

      // Add stress indicator arrows at top
      const arrowGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
      const arrowMaterial = new THREE.MeshStandardMaterial({ 
        color: getStressColor(pos.stress),
        emissive: getStressColor(pos.stress),
        emissiveIntensity: 0.5
      });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.set(pos.x, totalHeight + 0.8, pos.z);
      arrow.rotation.x = Math.PI;
      group.add(arrow);
    });

    // Create beams connecting columns
    const beamMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6688aa,
      metalness: 0.7,
      roughness: 0.3
    });

    for (let floor = 1; floor <= storeys; floor++) {
      const y = floor * floorHeight;
      
      // Horizontal beams (X direction)
      for (let z = -1; z <= 1; z++) {
        for (let x = -1; x < 1; x++) {
          const beam = new THREE.Mesh(
            new THREE.BoxGeometry(bayWidth, 0.3, 0.3),
            beamMaterial
          );
          beam.position.set(x * bayWidth + bayWidth/2, y, z * bayDepth);
          beam.castShadow = true;
          group.add(beam);
        }
      }
      
      // Horizontal beams (Z direction)
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z < 1; z++) {
          const beam = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.3, bayDepth),
            beamMaterial
          );
          beam.position.set(x * bayWidth, y, z * bayDepth + bayDepth/2);
          beam.castShadow = true;
          group.add(beam);
        }
      }

      // Floor slabs (semi-transparent)
      const slabMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        transparent: true,
        opacity: 0.3,
        metalness: 0.2,
        roughness: 0.8,
        side: THREE.DoubleSide
      });
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(bayWidth * 3, 0.15, bayDepth * 3),
        slabMaterial
      );
      slab.position.y = y;
      slab.receiveShadow = true;
      group.add(slab);
    }

    // Add load indicators (downward arrows showing applied loads)
    const loadMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.3
    });

    for (let i = 0; i < 5; i++) {
      const loadArrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 1.5, 8),
        loadMaterial
      );
      const angle = (i / 5) * Math.PI * 2;
      const radius = 8;
      loadArrow.position.set(
        Math.cos(angle) * radius,
        totalHeight + 2,
        Math.sin(angle) * radius
      );
      group.add(loadArrow);
    }

    // Add displacement vectors (showing deformation)
    const displacementMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.4
    });

    // Top corners show maximum displacement
    const corners = [
      { x: -bayWidth, z: -bayDepth },
      { x: bayWidth, z: -bayDepth },
      { x: -bayWidth, z: bayDepth },
      { x: bayWidth, z: bayDepth }
    ];

    corners.forEach(corner => {
      const displacement = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2, 8),
        displacementMaterial
      );
      displacement.position.set(corner.x, totalHeight + 1, corner.z);
      displacement.rotation.x = Math.PI / 6;
      group.add(displacement);
    });

    return group;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.Fog(0x0a0a0f, 40, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(40, 25, 40);
    camera.lookAt(0, 10, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(30, 50, 30);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    scene.add(mainLight);

    // Accent lights for stress visualization
    const accentLight1 = new THREE.PointLight(0xff4444, 0.5, 50);
    accentLight1.position.set(0, 20, 0);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x44ff44, 0.3, 40);
    accentLight2.position.set(-15, 10, -15);
    scene.add(accentLight2);

    // Grid
    const grid = new THREE.GridHelper(60, 30, 0x444444, 0x222222);
    scene.add(grid);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper);

    // Create structural model
    const model = createStructuralFrame();
    scene.add(model);
    modelRef.current = model;

    // Manual rotation controls
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };

    const updateCamera = () => {
      const target = targetRef.current;
      const cameraAngle = cameraAngleRef.current;
      const cameraDistance = cameraDistanceRef.current;
      
      camera.position.x = target.x + cameraDistance * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.position.y = target.y + cameraDistance * Math.cos(cameraAngle.phi);
      camera.position.z = target.z + cameraDistance * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.lookAt(target);
    };

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    });

    renderer.domElement.addEventListener('mouseleave', () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;

      cameraAngleRef.current.theta -= deltaX * 0.01;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + deltaY * 0.01));

      updateCamera();
      previousMouse = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      cameraDistanceRef.current = Math.max(20, Math.min(150, cameraDistanceRef.current + e.deltaY * 0.1));
      updateCamera();
    }, { passive: false });

    renderer.domElement.style.cursor = 'grab';

    // Animation loop with pulsing stress indicators
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Pulse stress indicators
      if (modelRef.current) {
        modelRef.current.children.forEach((child, index) => {
          if (child.geometry && child.geometry.type === 'ConeGeometry') {
            child.position.y = child.position.y > 15 ? 
              20 + Math.sin(time * 2 + index) * 0.3 : 
              child.position.y;
          }
        });
      }
      
      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function handleResize() {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    }
    window.addEventListener('resize', handleResize);

    console.log('✅ Structural Analysis Viewer initialized');

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    setView: (view) => {
      const camera = cameraRef.current;
      const target = targetRef.current;
      
      switch(view) {
        case 'top':
          cameraAngleRef.current = { theta: 0, phi: 0.1 };
          break;
        case 'front':
          cameraAngleRef.current = { theta: 0, phi: Math.PI / 2 };
          break;
        case 'side':
          cameraAngleRef.current = { theta: Math.PI / 2, phi: Math.PI / 2 };
          break;
        case 'reset':
          cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 5 };
          cameraDistanceRef.current = 60;
          break;
      }
      
      const cameraAngle = cameraAngleRef.current;
      const cameraDistance = cameraDistanceRef.current;
      camera.position.x = target.x + cameraDistance * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.position.y = target.y + cameraDistance * Math.cos(cameraAngle.phi);
      camera.position.z = target.z + cameraDistance * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.lookAt(target);
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
        left: 0
      }}
    >
      {/* Legend overlay */}
      <div 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '11px',
          pointerEvents: 'none',
          zIndex: 10,
          fontFamily: 'monospace'
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>STRESS ANALYSIS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#44ff44', borderRadius: '2px' }}></div>
          <span>Low Stress (&lt;30%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#ffff44', borderRadius: '2px' }}></div>
          <span>Medium (30-60%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: '#ff8844', borderRadius: '2px' }}></div>
          <span>High (60-80%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: '#ff4444', borderRadius: '2px' }}></div>
          <span>Critical (&gt;80%)</span>
        </div>
      </div>
      
      {/* Controls hint */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        🖱️ Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
});

StructuralAnalysisViewer.displayName = "StructuralAnalysisViewer";
