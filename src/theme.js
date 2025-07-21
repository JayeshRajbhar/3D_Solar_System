export function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    let isDarkMode = true;

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        themeToggle.innerHTML = isDarkMode ? '🌙 Dark' : '☀️ Light';
        
        // Update Three.js scene background
        const scene = window.currentScene; 
        if (scene) {
            scene.background = new THREE.Color(isDarkMode ? 0x000011 : 0x87CEEB);
        }
    });
}
