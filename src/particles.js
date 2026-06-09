/**
 * Interactive Particle Constellation System
 * Designed for high performance and low CPU usage.
 */
export function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;

  // Mouse interaction state
  const mouse = {
    x: null,
    y: null,
    radius: 120, // Interaction radius
  };

  // Adjust particle count based on screen size
  function getParticleCount() {
    return window.innerWidth < 768 ? 15 : 60;
  }

  // Handle window resizing
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticleArray();
  }

  // Particle Class Definition
  class Particle {
    constructor() {
      this.reset();
      // Initialize with random positions across the canvas
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1; // 1px to 3px
      this.speedX = (Math.random() - 0.5) * 0.4; // Slow drifting
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.baseAlpha = Math.random() * 0.3 + 0.15; // 0.15 to 0.45 opacity
      this.alpha = this.baseAlpha;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap-around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Mouse interactive push/pull effect
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          // Push particles away from mouse
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Gently push away
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
          
          // Brighten up active particles
          this.alpha = Math.min(0.8, this.baseAlpha + force * 0.4);
        } else {
          // Fade back to baseline alpha
          if (this.alpha > this.baseAlpha) {
            this.alpha -= 0.01;
          }
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 51, 234, ${this.alpha})`; // Purple hues
      ctx.fill();
    }
  }

  // Populate Particle Array
  function initParticleArray() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Connect particles with faint lines
  function drawLines() {
    const maxDistance = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < maxDistance) {
          // Calculate line opacity based on distance
          const alpha = (1 - distance / maxDistance) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // Gradient line colors (Purple to Blue)
          const grad = ctx.createLinearGradient(
            particles[i].x, particles[i].y, 
            particles[j].x, particles[j].y
          );
          grad.addColorStop(0, `rgba(147, 51, 234, ${alpha})`);
          grad.addColorStop(1, `rgba(59, 130, 246, ${alpha})`);
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Also connect to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const alpha = (1 - distance / mouse.radius) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`; // Blue connecting lines to cursor
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    drawLines();
    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse Listeners
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    // Debounce resize to prevent stuttering
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(resizeCanvas, 100);
  });

  // Initialize
  resizeCanvas();
  animate();

  // Return clean-up handler
  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}
