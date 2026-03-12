export const BIM_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
        body { margin: 0; overflow: hidden; background-color: #0f172a; color: white; font-family: sans-serif; }
        #loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        .bar-container { width: 200px; height: 6px; background: #334155; border-radius: 3px; margin-top: 10px; overflow: hidden; }
        .bar { width: 0%; height: 100%; background: #38bdf8; transition: width 0.3s; }
        canvas { display: block; width: 100vw; height: 100vh; }
    </style>
    <!-- Import Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/DeviceOrientationControls.js"></script>
    <!-- Web IFC Loader -->
    <!-- Web IFC Loader (Use consistent version) -->
    <script src="https://unpkg.com/web-ifc-three@0.0.123/IFCLoader.js"></script>
</head>
<body>
    <div id="loading">
        <div id="status">Ready to Upload</div>
        <div class="bar-container" id="barCon" style="display:none"><div class="bar" id="bar"></div></div>
    </div>
    <script>
        // Init Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a); 
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        // Camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(20, 20, 20);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha for AR potential
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.localClippingEnabled = true;
        document.body.appendChild(renderer.domElement);

        // Controls
        const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.05;
        
        let deviceControls = null; // Will init on demand
        let isARMode = false;

        // Grid (Engineering feel)
        const gridHelper = new THREE.GridHelper(50, 50, 0x334155, 0x1e293b);
        scene.add(gridHelper);

        // Placeholder for Model
        const modelGroup = new THREE.Group();
        scene.add(modelGroup);

        // Demo Building (If no IFC uploaded)
        function createDemoModel() {
            modelGroup.clear();
            const geometry = new THREE.BoxGeometry(10, 10, 10);
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x94a3b8, // Concrete-ish
                roughness: 0.7,
                metalness: 0.1
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.y = 5;
            modelGroup.add(cube);
            
            // Add "Slabs"
            for(let i=0; i<3; i++) {
                const slab = new THREE.Mesh(
                    new THREE.BoxGeometry(12, 0.5, 12),
                    new THREE.MeshStandardMaterial({ color: 0xcbfa23 }) // Highlight
                );
                slab.position.y = i * 3.5;
                modelGroup.add(slab);
            }
            
            fitCamera();
            updateStatus('');
        }
        
        // --- Feature Implementations ---

        // 1. Slicing (Section Cut)
        const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 20); // Downward facing
        // renderer.clippingPlanes = [clipPlane]; // Global clipping
        
        function setSliceHeight(val) {
             // Val 0-1 mapped to height 0-20
             const height = val * 20;
             clipPlane.constant = height;
             // Apply to all materials in modelGroup
             modelGroup.traverse((child) => {
                 if(child.isMesh) {
                     child.material.clippingPlanes = [clipPlane];
                     child.material.clipShadows = true;
                 }
             });
        }
        
        // 2. Toggles
        function toggleCategory(category, visible) {
            // Mock implementation for demo cubes
            // In real IFC, check userData or name
            modelGroup.traverse((child) => {
                if(child.name.includes(category)) {
                    child.visible = visible;
                }
            });
        }

        // Camera Fit
        function fitCamera() {
            const box = new THREE.Box3().setFromObject(modelGroup);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
            cameraZ *= 2.0; // Zoom out a bit
            
            camera.position.set(center.x + cameraZ, center.y + cameraZ/1.5, center.z + cameraZ);
            camera.lookAt(center);
            orbitControls.target.copy(center);
            orbitControls.update();
        }

        // Bridge to RN
        function updateStatus(text, progress) {
            const el = document.getElementById('status');
            const bar = document.getElementById('bar');
            const con = document.getElementById('barCon');
            
            if(text) {
                el.innerText = text;
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }

            if(progress !== undefined) {
                con.style.display = 'block';
                bar.style.width = progress + '%';
            } else {
                con.style.display = 'none';
            }
        }

        // Initial Demo
        createDemoModel();

        // Message Listener
        document.addEventListener('message', (event) => {
            handleMessage(event.data);
        });
        window.addEventListener('message', (event) => {
            handleMessage(event.data);
        });

        let accumulatedBase64 = [];
        
        function handleMessage(data) {
            try {
                const msg = JSON.parse(data);
                switch(msg.type) {
                    case 'CHUNK':
                        const { data: chunkData, index, total } = msg.value;
                        if (index === 0) accumulatedBase64 = new Array(total);
                        accumulatedBase64[index] = chunkData;
                        
                        const progress = Math.round(((index + 1) / total) * 100);
                        updateStatus('Receiving... ' + progress + '%', progress);
                        
                        if (index === total - 1) {
                            // All chunks received
                            const fullBase64 = accumulatedBase64.join('');
                            accumulatedBase64 = []; // Clear memory
                            loadModelFromBase64(fullBase64);
                        }
                        break;
                        
                    case 'LOAD_MODEL':
                        // Legacy single-message support
                        loadModelFromBase64(msg.value);
                        break;
                        
                    case 'SLICE':
                        setSliceHeight(msg.value);
                        break;
                    case 'RESET_VIEW':
                        fitCamera();
                        break;
                    case 'TOGGLE_AR':
                        isARMode = msg.value;
                        if(isARMode) {
                            if(!deviceControls) {
                                deviceControls = new THREE.DeviceOrientationControls(camera);
                            }
                            orbitControls.enabled = false;
                            scene.background = null; // Transparent for "AR" feel (if webview allows)
                        } else {
                            orbitControls.enabled = true;
                            scene.background = new THREE.Color(0x0f172a);
                            fitCamera();
                        }
                        break;
                }
            } catch(e) { console.error(e); }
        }

        function loadModelFromBase64(base64Data) {
            updateStatus('Reading File...', 10);
            try {
                const cleanBase64 = base64Data.replace(/\s/g, '');
                const byteCharacters = atob(cleanBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);

                updateStatus('Parsing IFC...', 30);

                const ifcLoader = new THREE.IFCLoader();
                ifcLoader.ifcManager.setWasmPath('https://unpkg.com/web-ifc@0.0.36/'); 

                ifcLoader.load(url, (ifcModel) => {
                    updateStatus('Rendering...', 80);
                    modelGroup.clear();
                    modelGroup.add(ifcModel);
                    fitCamera();
                    updateStatus('');
                }, (progress) => {
                    // console.log('Loading progress', progress);
                }, (error) => {
                    console.error('IFC Load Error detail:', error);
                    updateStatus('Error loading IFC: ' + error.message);
                });

            } catch (e) {
                console.error('Processing Error:', e);
                updateStatus('Error processing file: ' + e.message);
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            if(isARMode && deviceControls) {
                deviceControls.update();
            } else {
                orbitControls.update();
            }
            renderer.render(scene, camera);
        }
        animate();
        
        // Window Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>
`;
