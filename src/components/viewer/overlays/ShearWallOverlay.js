import * as THREE from 'three';

/**
 * Creates a Shear Wall Overlay group
 * @param {Object} module3 - Rule engine output for Module 3
 */
export function createShearWallOverlay(module3) {
    const group = new THREE.Group();
    group.name = "overlay-shear-walls";

    const material = new THREE.MeshStandardMaterial({
        color: '#808080',
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    // Simple heuristic: Placing walls at corners and centers
    // In a real app, this would use IFC coordinates
    const wallPositions = [
        { x: -5, z: -5 }, { x: 5, z: -5 },
        { x: -5, z: 5 }, { x: 5, z: 5 },
        { x: 0, z: 0 }
    ];

    wallPositions.forEach(pos => {
        const geometry = new THREE.BoxGeometry(2, 10, 0.2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos.x, 5, pos.z);
        group.add(mesh);
    });

    return group;
}
