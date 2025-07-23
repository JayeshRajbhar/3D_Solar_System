# 3D Solar System 🌌

An interactive, animated 3D solar system built with Three.js. Explore and control the motion of all eight planets as they orbit the Sun, featuring realistic textures and intuitive controls.

## 🚀 Live Demo

**👉 View the Solar System here:** *https://jayeshrajbhar.github.io/3D_Solar_System/*

## ✨ Features

* 3D orbits and self-rotation for all 8 planets
* Realistic textures and a glowing Sun
* Adjustable planetary speeds (slider controls)
* Pause/play animation and reset system
* Camera controls (drag to orbit, scroll to zoom)
* Light/dark theme toggle
* Starfield background for extra realism
* Responsive—works on mobile and desktop

## 🗂️ Project Structure

```text
├── index.html
├── styles/
│   └── main.css
├── public/
│   └── textures/
│       └── [planet images].jpg/png
├── src/
│   ├── main.js
│   ├── controls.js
│   ├── starfield.js
│   ├── theme.js
│   └── camera.js
```

* `index.html`: App entry point
* `src/`: JavaScript files and main logic
* `styles/`: CSS styles
* `public/textures/`: All planet and Sun images

## 🛠️ Installation

***No installation needed to run the live demo. To run locally:***

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
npm install
npm run dev
# or: npx vite
```

Open http://localhost:5173 (or the address Vite shows).

## 📦 Build & Deploy

To build for production and deploy to GitHub Pages:

```bash
npm run build
npm run deploy
```

*Ensure your textures are in the `public/textures/` folder before building.*

## 🖼️ Credits

* Three.js for 3D rendering
* Solar System Scope Textures for planet maps

## 📄 License

MIT