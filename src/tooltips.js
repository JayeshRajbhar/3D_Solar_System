export function setupTooltips() {
    const tooltip = document.getElementById('planet-tooltip');
    
    // Add smooth animations
    tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    document.addEventListener('mousemove', (e) => {
        if (tooltip.classList.contains('visible')) {
            const rect = tooltip.getBoundingClientRect();
            const x = Math.min(e.clientX + 10, window.innerWidth - rect.width - 10);
            const y = Math.min(e.clientY + 10, window.innerHeight - rect.height - 10);
            
            tooltip.style.left = `${Math.max(10, x)}px`;
            tooltip.style.top = `${Math.max(10, y)}px`;
        }
    });
}
