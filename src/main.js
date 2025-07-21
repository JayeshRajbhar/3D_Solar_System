import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { createControls } from "./controls.js";
import { createStarField } from "./starfield.js";
import { setupTooltips } from "./tooltips.js";
import { setupTheme } from "./theme.js";
import { setupCameraControls } from "./camera.js";

// Planet data
const PLANET_DATA = [
  {
    name: "Mercury",
    color: 0x8c7853,
    radius: 1.5,
    orbit: 25,
    speed: 0.04,
    rotationSpeed: 0.01,
    texture: "./textures/mercury.jpg",
    info: "Closest planet to the Sun. Extremely hot days, freezing nights.",
  },
  {
    name: "Venus",
    color: 0xffc649,
    radius: 2.2,
    orbit: 32,
    speed: 0.015,
    rotationSpeed: -0.005,
    texture: "./textures/venus.jpg",
    info: "Hottest planet due to greenhouse effect. Rotates backwards.",
  },
  {
    name: "Earth",
    color: 0x6b93d6,
    radius: 2.5,
    orbit: 42,
    speed: 0.01,
    rotationSpeed: 0.02,
    texture: "./textures/earth.jpg",
    info: "Our home planet. The only known planet with life.",
  },
  {
    name: "Mars",
    color: 0xcd5c5c,
    radius: 2,
    orbit: 52,
    speed: 0.008,
    rotationSpeed: 0.018,
    texture: "./textures/mars.jpg",
    info: "The Red Planet. Has the largest volcano in the solar system.",
  },
  {
    name: "Jupiter",
    color: 0xd8ca9d,
    radius: 6,
    orbit: 72,
    speed: 0.005,
    rotationSpeed: 0.04,
    texture: "./textures/jupiter.jpg",
    info: "Largest planet. Great Red Spot is a storm larger than Earth.",
  },
  {
    name: "Saturn",
    color: 0xfad5a5,
    radius: 5.2,
    orbit: 95,
    speed: 0.0038,
    rotationSpeed: 0.038,
    texture: "./textures/saturn.jpg",
    info: "Famous for its beautiful ring system. Less dense than water.",
  },
  {
    name: "Uranus",
    color: 0x4fd0e7,
    radius: 3.8,
    orbit: 118,
    speed: 0.0027,
    rotationSpeed: 0.03,
    texture: "./textures/uranus.jpg",
    info: "Ice giant that rotates on its side. Has faint rings.",
  },
  {
    name: "Neptune",
    color: 0x4b70dd,
    radius: 3.6,
    orbit: 140,
    speed: 0.0022,
    rotationSpeed: 0.032,
    texture: "./textures/neptune.jpg",
    info: "Windiest planet with speeds up to 2,100 km/h.",
  },
];

class SolarSystemSimulation {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.planets = [];
    this.sun = null;
    this.isAnimating = true;
    this.clock = new THREE.Clock();
    this.speeds = PLANET_DATA.map((p) => p.speed);
    this.textureLoader = new THREE.TextureLoader();
    this.loadingManager = new THREE.LoadingManager();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.focusedPlanet = null;

    this.setupLoadingManager();
    this.init();
  }

  setupLoadingManager() {
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      const loadingBar = document.getElementById("loading-bar");
      if (loadingBar) {
        loadingBar.style.width = `${progress * 100}%`;
      }
    };

    this.loadingManager.onLoad = () => {
      this.hideLoadingScreen();
    };

    this.loadingManager.onError = (url) => {
      console.warn("Failed to load:", url);
    };

    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        loadingScreen.style.display = "none";
      },
    });
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createSun();
    this.createPlanets();
    this.createStarField();
    this.setupControls();
    this.setupEventListeners();
    this.setupUI();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000011);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 80, 160);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.8;

    document.body.appendChild(this.renderer.domElement);
  }

  createLights() {
    // Sun light
    const sunLight = new THREE.PointLight(0xffffaa, 0.1, 1000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 1000;
    this.scene.add(sunLight);

    // Ambient light for visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 18);
    this.scene.add(ambientLight);
  }

  createSun() {
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunTexture = this.textureLoader.load("./textures/sun.jpg");
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
    });

    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.userData = {
      name: "Sun",
      info: "The star at the center of our solar system. Surface temperature: 5,778 K",
    };
    this.scene.add(this.sun);

    // Sun glow effect
    const sunGlowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const sunGlowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
      },
      vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(1.0, 0.6, 0.1, 1.0) * intensity;
                }
            `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    this.scene.add(sunGlow);
  }

  createPlanets() {
    this.planets = [];

    PLANET_DATA.forEach((planetData, index) => {
      const geometry = new THREE.SphereGeometry(planetData.radius, 32, 32);

      // Load texture if available
      let material;
      if (planetData.texture) {
        const texture = this.textureLoader.load(planetData.texture);
        texture.colorSpace = THREE.SRGBColorSpace;
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: planetData.color,
          roughness: 0.8,
          metalness: 0.1,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      const angle = Math.random() * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * planetData.orbit;
      mesh.position.z = Math.sin(angle) * planetData.orbit;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        name: planetData.name,
        info: planetData.info,
        index: index,
      };
      this.scene.add(mesh);

      // Saturn's rings with texture
      let saturnRing = null;
      if (planetData.name === "Saturn") {
        const ringGeometry = new THREE.CylinderGeometry(
          planetData.radius * 2.0, 
          planetData.radius * 2.0, 
          0.1, 
          64, 
          1, 
          true 
        );

        const ringTexture = this.textureLoader.load("textures/saturn_ring.png");
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });

        saturnRing = new THREE.Mesh(ringGeometry, ringMaterial);
        saturnRing.position.copy(mesh.position);
        this.scene.add(saturnRing);

        mesh.userData.ring = saturnRing;
      }

      // Create orbital path 
      const orbitGeometry = new THREE.RingGeometry(
        planetData.orbit - 0.1,
        planetData.orbit + 0.1,
        64
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitRing.rotation.x = -Math.PI / 2;
      this.scene.add(orbitRing);

      this.planets.push({
        mesh,
        angle,
        rotationAngle: 0,
        orbit: planetData.orbit,
        rotationSpeed: planetData.rotationSpeed,
        orbitRing,
        ...planetData,
      });
    });
  }

  createStarField() {
    createStarField(this.scene);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI;
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.onWindowResize());
    this.renderer.domElement.addEventListener("click", (event) =>
      this.onMouseClick(event)
    );
    this.renderer.domElement.addEventListener("mousemove", (event) =>
      this.onMouseMove(event)
    );
  }

  setupUI() {
    // Create speed controls
    createControls(PLANET_DATA, this.speeds, (index, newSpeed) => {
      this.speeds[index] = newSpeed;
    });

    // Setup tooltips
    setupTooltips();

    // Setup theme toggle
    setupTheme();

    // Setup camera controls
    setupCameraControls(this.camera, this.controls);

    // Play/pause button
    const playPauseBtn = document.getElementById("play-pause-btn");
    playPauseBtn.addEventListener("click", () => {
      this.isAnimating = !this.isAnimating;
      playPauseBtn.innerHTML = this.isAnimating ? "⏸️ Pause" : "▶️ Play";
      playPauseBtn.classList.toggle("paused", !this.isAnimating);
    });

    // Reset button
    const resetBtn = document.getElementById("reset-btn");
    resetBtn.addEventListener("click", () => {
      this.resetAnimation();
    });
  }

  onMouseClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects([
      this.sun,
      ...this.planets.map((p) => p.mesh),
    ]);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      this.focusOnObject(clickedObject);

      // Update info panel
      const infoPanel = document.getElementById("planet-info");
      infoPanel.textContent = `${clickedObject.userData.name}: ${clickedObject.userData.info}`;
    }
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects([
      this.sun,
      ...this.planets.map((p) => p.mesh),
    ]);

    const tooltip = document.getElementById("planet-tooltip");

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      tooltip.innerHTML = `
                <strong>${hoveredObject.userData.name}</strong><br>
                ${hoveredObject.userData.info}
            `;
      tooltip.style.left = event.clientX + 10 + "px";
      tooltip.style.top = event.clientY + 10 + "px";
      tooltip.classList.add("visible");
      this.renderer.domElement.style.cursor = "pointer";
    } else {
      tooltip.classList.remove("visible");
      this.renderer.domElement.style.cursor = "default";
    }
  }

  focusOnObject(object) {
    const targetPosition = object.position.clone();
    const distance = object === this.sun ? 50 : 25;

    const direction = new THREE.Vector3()
      .subVectors(this.camera.position, targetPosition)
      .normalize()
      .multiplyScalar(distance);

    const newPosition = targetPosition.clone().add(direction);

    gsap.to(this.camera.position, {
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      duration: 2,
      ease: "power2.out",
    });

    gsap.to(this.controls.target, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: "power2.out",
    });

    this.focusedPlanet = object;
  }

  resetAnimation() {
    this.planets.forEach((planet, index) => {
      planet.angle = Math.random() * Math.PI * 2;
      planet.rotationAngle = 0;
      this.speeds[index] = PLANET_DATA[index].speed;
    });

    // Reset UI sliders
    const sliders = document.querySelectorAll(".speed-slider");
    sliders.forEach((slider, index) => {
      slider.value = PLANET_DATA[index].speed;
      slider.nextElementSibling.textContent =
        PLANET_DATA[index].speed.toFixed(4);
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateFPS() {
    const fps = Math.round(1 / this.clock.getDelta());
    const fpsCounter = document.getElementById("fps-counter");
    if (fpsCounter) {
      fpsCounter.textContent = `FPS: ${fps}`;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.updateFPS();

    if (this.isAnimating) {
      this.planets.forEach((planet, index) => {
        // Orbital motion
        planet.angle += this.speeds[index];
        planet.mesh.position.x = Math.cos(planet.angle) * planet.orbit;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.orbit;

        // Self-rotation
        planet.rotationAngle += planet.rotationSpeed;
        planet.mesh.rotation.y = planet.rotationAngle;

        if (planet.mesh.userData.ring) {
          planet.mesh.userData.ring.position.copy(planet.mesh.position);
        }
      });

      // Sun rotation
      this.sun.rotation.y += 0.005;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check WebGL support
  if (!window.WebGLRenderingContext) {
    document.getElementById("webgl-error").style.display = "block";
    document.getElementById("loading-screen").style.display = "none";
    return;
  }

  new SolarSystemSimulation();
});

window.SolarSystemSimulation = SolarSystemSimulation;
