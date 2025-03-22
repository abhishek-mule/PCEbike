// Particle Animation
function createParticles() {
  const particles = document.getElementById('particles');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float-particle ${5 + Math.random() * 10}s linear infinite;
    `;
    particles.appendChild(particle);
  }
}

// Initialize particles on load
document.addEventListener('DOMContentLoaded', createParticles);