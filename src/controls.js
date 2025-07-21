export function createControls(planetData, speeds, onSpeedChange) {
    const controlsContainer = document.getElementById('speed-controls');
    controlsContainer.innerHTML = '';

    planetData.forEach((planet, index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'speed-control';
        
        controlDiv.innerHTML = `
            <label>${planet.name}</label>
            <input 
                type="range" 
                class="speed-slider"
                min="0.001" 
                max="0.08" 
                step="0.001" 
                value="${speeds[index]}"
                data-planet="${index}"
            />
            <span class="speed-value">${speeds[index].toFixed(4)}</span>
        `;

        const slider = controlDiv.querySelector('.speed-slider');
        const valueDisplay = controlDiv.querySelector('.speed-value');

        slider.addEventListener('input', (e) => {
            const newSpeed = parseFloat(e.target.value);
            valueDisplay.textContent = newSpeed.toFixed(4);
            onSpeedChange(index, newSpeed);
        });

        controlsContainer.appendChild(controlDiv);
    });

    // Controls panel toggle functionality
    const toggleBtn = document.getElementById('toggle-controls');
    const controlsContent = document.querySelector('.controls-content');
    let isCollapsed = false;

    toggleBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        controlsContent.style.display = isCollapsed ? 'none' : 'block';
        toggleBtn.textContent = isCollapsed ? '+' : '−';
    });
}
