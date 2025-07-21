import * as THREE from 'three';

export function createStarField(scene) {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 2,
        sizeAttenuation: false
    });

    const starsVertices = [];
    // to place 3000 stars randomly in the space
    for (let i = 0; i < 3000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    return stars;
}
