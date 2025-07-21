import { gsap } from 'gsap';

export function setupCameraControls(camera, controls) {
    const resetCameraBtn = document.getElementById('reset-camera');
    const topViewBtn = document.getElementById('top-view');

    resetCameraBtn.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: 0,
            y: 80,
            z: 160,
            duration: 2,
            ease: "power2.out"
        });

        gsap.to(controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: "power2.out"
        });
    });

    topViewBtn.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: 0,
            y: 200,
            z: 0,
            duration: 2,
            ease: "power2.out"
        });

        gsap.to(controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: "power2.out"
        });
    });
}
