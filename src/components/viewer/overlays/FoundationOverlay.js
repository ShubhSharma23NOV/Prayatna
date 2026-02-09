import * as THREE from 'three';

/**
 * Creates a Foundation Overlay group
 * @param {Object} module4 - Rule engine output for Module 4
 */
export function createFoundationOverlay(module4) {
    const group = new THREE.Group();
    group.name = "overlay-foundation";

    const material = new THREE.MeshStandardMaterial({
        color: '#505050',
        transparent: true,
        opacity: 0.5
    });

    const type = module4?.foundationType || 'Raft';

    if (type.includes('Piled')) {
        // Pile Foundation: Slab + Piles
        const slabGeom = new THREE.BoxGeometry(12, 0.5, 12);
        const slab = new THREE.Mesh(slabGeom, material);
        slab.position.y = -0.25;
        group.add(slab);

        // Piles
        const pileGeom = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
        for (let x = -4; x <= 4; x += 4) {
            for (let z = -4; z <= 4; z += 4) {
                const pile = new THREE.Mesh(pileGeom, material);
                pile.position.set(x, -2.75, z);
                group.add(pile);
            }
        }
    } else if (type.includes('Isolated')) {
        // Isolated Footings: Pads
        const padGeom = new THREE.BoxGeometry(2, 0.5, 2);
        for (let x = -5; x <= 5; x += 5) {
            for (let z = -5; z <= 5; z += 5) {
                const pad = new THREE.Mesh(padGeom, material);
                pad.position.set(x, -0.25, z);
                group.add(pad);
            }
        }
    } else {
        // Standard Raft
        const slabGeom = new THREE.BoxGeometry(12, 0.8, 12);
        const slab = new THREE.Mesh(slabGeom, material);
        slab.position.y = -0.4;
        group.add(slab);
    }

    return group;
}
