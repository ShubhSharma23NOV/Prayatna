"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

export const FinalViewer = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const targetRef = useRef(new THREE.Vector3(0, 15, 0));
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 6 });
  const cameraDistanceRef = useRef(80);

  // Building creation function - Creates realistic BIM-style building
  const createBuilding = (storeys = 10, width = 25, depth = 20, buildingType = 'residential') => {
    const group = new THREE.Group();
    
    const floorHeight = 3.5;
    const totalHeight = storeys * floorHeight;

    // Building type-specific configurations
    let columnConfig, colorScheme, hasParapet, hasLargeWindows;
    
    switch(buildingType) {
      case 'hospital':
        columnConfig = { grid: 5, size: 0.7 }; // More columns for heavy equipment
        colorScheme = { 
          column: 0x707070, 
          slab: 0xa0a0a0, 
          glass: 0x90e0ff, 
          mullion: 0x3a3a3a,
          roof: 0x606060 
        };
        hasParapet = true;
        hasLargeWindows = true;
        break;
        
      case 'commercial':
        columnConfig = { grid: 3, size: 0.6 };
        colorScheme = { 
          column: 0x505050, 
          slab: 0x888888, 
          glass: 0x88bbff, 
          mullion: 0x1a1a1a,
          roof: 0x4a4a4a 
        };
        hasParapet = true;
        hasLargeWindows = true;
        break;
        
      case 'institutional': // School
        columnConfig = { grid: 4, size: 0.5 };
        colorScheme = { 
          column: 0x606060, 
          slab: 0x959595, 
          glass: 0xffdd88, 
          mullion: 0x2a2a2a,
          roof: 0x555555 
        };
        hasParapet = false;
        hasLargeWindows = true;
        break;
        
      case 'industrial':
        columnConfig = { grid: 3, size: 1.0 }; // Larger columns for heavy loads
        colorScheme = { 
          column: 0x4a4a4a, 
          slab: 0x707070, 
          glass: 0x666666, // Less glass, more solid
          mullion: 0x333333,
          roof: 0x3a3a3a 
        };
        hasParapet = false;
        hasLargeWindows = false;
        break;
        
      default: // residential
        columnConfig = { grid: 4, size: 0.5 };
        colorScheme = { 
          column: 0x606060, 
          slab: 0x999999, 
          glass: 0x88bbff, 
          mullion: 0x2a2a2a,
          roof: 0x555555 
        };
        hasParapet = true;
        hasLargeWindows = false;
    }

    // STRUCTURAL COLUMNS
    const columnMaterial = new THREE.MeshStandardMaterial({ 
      color: colorScheme.column,
      metalness: 0.5,
      roughness: 0.6
    });

    const gridSize = columnConfig.grid;
    const columnSize = columnConfig.size;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const column = new THREE.Mesh(
          new THREE.BoxGeometry(columnSize, totalHeight, columnSize),
          columnMaterial
        );
        column.position.set(
          -width/2 + (i * width/(gridSize-1)),
          totalHeight/2,
          -depth/2 + (j * depth/(gridSize-1))
        );
        column.castShadow = true;
        group.add(column);
      }
    }

    // FLOOR SLABS with edge beams
    const slabMaterial = new THREE.MeshStandardMaterial({ 
      color: colorScheme.slab,
      metalness: 0.2,
      roughness: 0.8
    });

    const beamMaterial = new THREE.MeshStandardMaterial({ 
      color: colorScheme.column,
      metalness: 0.4,
      roughness: 0.6
    });

    for (let floor = 0; floor <= storeys; floor++) {
      const y = floor * floorHeight;
      
      // Main slab
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.3, depth),
        slabMaterial
      );
      slab.position.y = y;
      slab.castShadow = true;
      slab.receiveShadow = true;
      group.add(slab);

      // Edge beams (structural)
      if (floor < storeys) {
        const beamHeight = buildingType === 'industrial' ? 0.8 : 0.6;
        const beamWidth = buildingType === 'industrial' ? 0.5 : 0.4;
        
        // Front and back beams
        [-depth/2, depth/2].forEach(z => {
          const beam = new THREE.Mesh(
            new THREE.BoxGeometry(width, beamHeight, beamWidth),
            beamMaterial
          );
          beam.position.set(0, y + beamHeight/2, z);
          beam.castShadow = true;
          group.add(beam);
        });
        
        // Left and right beams
        [-width/2, width/2].forEach(x => {
          const beam = new THREE.Mesh(
            new THREE.BoxGeometry(beamWidth, beamHeight, depth),
            beamMaterial
          );
          beam.position.set(x, y + beamHeight/2, 0);
          beam.castShadow = true;
          group.add(beam);
        });
      }
    }

    // CURTAIN WALL SYSTEM (glass panels with mullions)
    const glassOpacity = buildingType === 'industrial' ? 0.15 : (hasLargeWindows ? 0.35 : 0.3);
    const glassMaterial = new THREE.MeshStandardMaterial({ 
      color: colorScheme.glass,
      transparent: true,
      opacity: glassOpacity,
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.DoubleSide
    });

    const mullionMaterial = new THREE.MeshStandardMaterial({ 
      color: colorScheme.mullion,
      metalness: 0.8,
      roughness: 0.2
    });

    // Glass walls
    const wallOffset = 0.05;
    const walls = [
      { size: [width - 0.8, totalHeight - 1, 0.05], pos: [0, totalHeight/2, -depth/2 + wallOffset] },
      { size: [width - 0.8, totalHeight - 1, 0.05], pos: [0, totalHeight/2, depth/2 - wallOffset] },
      { size: [0.05, totalHeight - 1, depth - 0.8], pos: [-width/2 + wallOffset, totalHeight/2, 0] },
      { size: [0.05, totalHeight - 1, depth - 0.8], pos: [width/2 - wallOffset, totalHeight/2, 0] }
    ];

    walls.forEach(w => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(...w.size),
        glassMaterial
      );
      wall.position.set(...w.pos);
      group.add(wall);
    });

    // Vertical mullions (more for commercial/hospital, less for industrial)
    const mullionCount = buildingType === 'industrial' ? 4 : (hasLargeWindows ? 10 : 8);
    const mullionSize = buildingType === 'industrial' ? 0.12 : 0.08;
    
    for (let i = 0; i <= mullionCount; i++) {
      const x = -width/2 + (i * width/mullionCount);
      
      // Front mullions
      const frontMullion = new THREE.Mesh(
        new THREE.BoxGeometry(mullionSize, totalHeight, mullionSize),
        mullionMaterial
      );
      frontMullion.position.set(x, totalHeight/2, -depth/2);
      group.add(frontMullion);
      
      // Back mullions
      const backMullion = new THREE.Mesh(
        new THREE.BoxGeometry(mullionSize, totalHeight, mullionSize),
        mullionMaterial
      );
      backMullion.position.set(x, totalHeight/2, depth/2);
      group.add(backMullion);
    }

    // Horizontal mullions (floor separators)
    for (let floor = 1; floor < storeys; floor++) {
      const y = floor * floorHeight;
      
      // Front and back
      [-depth/2, depth/2].forEach(z => {
        const mullion = new THREE.Mesh(
          new THREE.BoxGeometry(width, 0.12, 0.12),
          mullionMaterial
        );
        mullion.position.set(0, y, z);
        group.add(mullion);
      });
    }

    // ROOF STRUCTURE
    const roofMaterial = new THREE.MeshStandardMaterial({ 
      color: colorScheme.roof,
      metalness: buildingType === 'industrial' ? 0.7 : 0.6,
      roughness: buildingType === 'industrial' ? 0.3 : 0.4
    });
    
    // Industrial buildings get pitched/sloped roof
    if (buildingType === 'industrial') {
      // Sloped roof for warehouse
      const roofGeometry = new THREE.BoxGeometry(width + 0.5, 0.3, depth + 0.5);
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = totalHeight + 0.15;
      roof.rotation.x = 0.1; // Slight slope
      roof.castShadow = true;
      group.add(roof);
      
      // Add roof trusses (visible structure)
      const trussCount = 5;
      for (let i = 0; i < trussCount; i++) {
        const truss = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 1.5, depth),
          new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.8 })
        );
        truss.position.set(-width/2 + (i * width/(trussCount-1)), totalHeight + 0.75, 0);
        group.add(truss);
      }
    } else {
      // Flat roof for other buildings
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.5, 0.4, depth + 0.5),
        roofMaterial
      );
      roof.position.y = totalHeight + 0.2;
      roof.castShadow = true;
      group.add(roof);
    }

    // Roof parapet (only for buildings that need it)
    if (hasParapet) {
      const parapetMaterial = new THREE.MeshStandardMaterial({ 
        color: colorScheme.column,
        metalness: 0.3,
        roughness: 0.7
      });
      const parapetHeight = buildingType === 'hospital' ? 1.5 : 1.2;
      const parapetThickness = 0.2;
      
      // Parapet walls
      [
        { size: [width + 0.5, parapetHeight, parapetThickness], pos: [0, totalHeight + parapetHeight/2, -depth/2 - 0.25] },
        { size: [width + 0.5, parapetHeight, parapetThickness], pos: [0, totalHeight + parapetHeight/2, depth/2 + 0.25] },
        { size: [parapetThickness, parapetHeight, depth + 0.5], pos: [-width/2 - 0.25, totalHeight + parapetHeight/2, 0] },
        { size: [parapetThickness, parapetHeight, depth + 0.5], pos: [width/2 + 0.25, totalHeight + parapetHeight/2, 0] }
      ].forEach(p => {
        const parapet = new THREE.Mesh(
          new THREE.BoxGeometry(...p.size),
          parapetMaterial
        );
        parapet.position.set(...p.pos);
        parapet.castShadow = true;
        group.add(parapet);
      });
    }

    // FOUNDATION/PODIUM
    const foundationHeight = buildingType === 'industrial' ? 2.0 : 1.5;
    const foundationMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a4a4a,
      metalness: 0.2,
      roughness: 0.9
    });
    const foundation = new THREE.Mesh(
      new THREE.BoxGeometry(width + 2, foundationHeight, depth + 2),
      foundationMaterial
    );
    foundation.position.y = -foundationHeight/2;
    foundation.receiveShadow = true;
    foundation.castShadow = true;
    group.add(foundation);

    // Add building-specific features
    if (buildingType === 'hospital') {
      // Add helipad on roof
      const helipadMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff4444, 
        metalness: 0.3,
        roughness: 0.7
      });
      const helipad = new THREE.Mesh(
        new THREE.CylinderGeometry(3, 3, 0.2, 32),
        helipadMaterial
      );
      helipad.position.y = totalHeight + 0.5;
      helipad.castShadow = true;
      group.add(helipad);
      
      // H marking
      const hMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const hBar1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.25, 2),
        hMaterial
      );
      hBar1.position.set(-0.8, totalHeight + 0.62, 0);
      hBar1.rotation.x = -Math.PI / 2;
      group.add(hBar1);
      
      const hBar2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.25, 2),
        hMaterial
      );
      hBar2.position.set(0.8, totalHeight + 0.62, 0);
      hBar2.rotation.x = -Math.PI / 2;
      group.add(hBar2);
      
      const hBar3 = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.25, 0.3),
        hMaterial
      );
      hBar3.position.set(0, totalHeight + 0.62, 0);
      hBar3.rotation.x = -Math.PI / 2;
      group.add(hBar3);
    }
    
    if (buildingType === 'industrial') {
      // Add loading dock
      const dockMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x555555,
        metalness: 0.4
      });
      const dock = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.3, 2, 3),
        dockMaterial
      );
      dock.position.set(0, 1, depth/2 + 1.5);
      dock.castShadow = true;
      group.add(dock);
    }

    return group;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(60, 40, 60);
    camera.lookAt(0, 15, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Grid
    const grid = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
    scene.add(grid);

    // DEFAULT DEMO BUILDING - Show immediately for demonstration
    const defaultBuilding = createBuilding(8); // 8-storey building
    scene.add(defaultBuilding);
    modelRef.current = defaultBuilding;
    console.log('✅ Default demo building loaded - ready for interaction');

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
      cameraDistanceRef.current = Math.max(20, Math.min(200, cameraDistanceRef.current + e.deltaY * 0.1));
      updateCamera();
    }, { passive: false });

    renderer.domElement.style.cursor = 'grab';

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
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

    console.log('✅ FinalViewer initialized with manual controls');

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    loadBuilding: (buildingDetails) => {
      const scene = sceneRef.current;
      if (!scene) return;

      // Remove old model
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }

      // Building parameters - USE DIFFERENT SIZES based on building type
      const storeys = buildingDetails?.storeys || 10;
      const buildingType = buildingDetails?.type || 'residential';
      
      // Vary dimensions based on building type and storeys
      let width, depth;
      if (storeys <= 3) {
        // Small buildings (warehouse, demo)
        width = buildingType === 'industrial' ? 35 : 30;
        depth = buildingType === 'industrial' ? 30 : 25;
      } else if (storeys <= 6) {
        // Medium buildings (school, hospital)
        width = buildingType === 'institutional' ? 28 : 22;
        depth = buildingType === 'institutional' ? 22 : 18;
      } else if (storeys <= 10) {
        // Large buildings (commercial)
        width = 18;
        depth = 15;
      } else {
        // Tall buildings (residential tower)
        width = 15;
        depth = 12;
      }
      
      const floorHeight = buildingDetails?.column_height || 3.5;
      const totalHeight = storeys * floorHeight;
      
      console.log(`🏗️ Creating ${buildingDetails?.name || 'building'}: ${buildingType}, ${storeys} floors, ${width}x${depth}m, ${totalHeight}m tall`);

      // Use the improved building creation function with type
      const group = createBuilding(storeys, width, depth, buildingType);

      scene.add(group);
      modelRef.current = group;

      // Update camera target to center of new building
      const centerY = totalHeight / 2;
      targetRef.current.set(0, centerY, 0);
      
      // Adjust camera distance based on building height
      const optimalDistance = Math.max(totalHeight * 1.5, 50);
      cameraDistanceRef.current = optimalDistance;
      
      // Update camera position immediately
      const camera = cameraRef.current;
      if (camera) {
        const cameraAngle = cameraAngleRef.current;
        const target = targetRef.current;
        camera.position.x = target.x + optimalDistance * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
        camera.position.y = target.y + optimalDistance * Math.cos(cameraAngle.phi);
        camera.position.z = target.z + optimalDistance * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
        camera.lookAt(target);
      }

      console.log('✅ Building loaded:', buildingType, storeys, 'floors, visible in scene');
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
      {/* Rotation hint overlay */}
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
        🖱️ Drag to rotate 360° • Scroll to zoom
      </div>
    </div>
  );
});

FinalViewer.displayName = "FinalViewer";
