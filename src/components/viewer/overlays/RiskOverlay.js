import * as THREE from 'three';

/**
 * Creates a Risk Zone Overlay group
 * @param {Object} module1 - Rule engine output for Module 1
 */
export function createRiskOverlay(module1) {
    const group = new THREE.Group();
    group.name = "overlay-risk-zones";

    const isHighRisk = module1?.riskStatus === 'High Risk';

    const material = new THREE.MeshStandardMaterial({
        color: isHighRisk ? '#ff0000' : '#ffa500',
        transparent: true,
        opacity: 0.3
    });

    // Soft Storey Risk: Highlight ground floor band
    const geometry = new THREE.BoxGeometry(11, 3, 11);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.5;
    group.add(mesh);

    // Torsion Markers at corners
    const markerGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const corners = [
        { x: -5.5, z: -5.5 }, { x: 5.5, z: -5.5 },
        { x: -5.5, z: 5.5 }, { x: 5.5, z: 5.5 }
    ];

    corners.forEach(pos => {
        const marker = new THREE.Mesh(markerGeom, material);
        marker.position.set(pos.x, 1.5, pos.z);
        group.add(marker);
    });

    return group;
}
