/* ============================================
   particles.js — EIGHTY-SIX Dust/Ash Particles
   Custom canvas-based particle system
   ============================================ */

'use strict';

(function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '3',
    pointerEvents: 'none',
  });
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const CONFIG = {
    count: 80,
    minSize: 0.5,
    maxSize: 2.5,
    minSpeed: 0.1,
    maxSpeed: 0.4,
    colors: [
      'rgba(192,41,43,',   // blood red
      'rgba(154,163,176,', // silver
      'rgba(255,255,255,', // white ash
    ],
    minOpacity: 0.05,
    maxOpacity: 0.35,
  };

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
      this.speedY = -(CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed));
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.color  = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.opacity = CONFIG.minOpacity + Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity);
      this.opacityDir = Math.random() > 0.5 ? 1 : -1;
      this.opacitySpeed = 0.002 + Math.random() * 0.004;
      // slight drift
      this.drift = (Math.random() - 0.5) * 0.01;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.speedX += this.drift;

      // Fade in/out
      this.opacity += this.opacitySpeed * this.opacityDir;
      if (this.opacity >= CONFIG.maxOpacity) this.opacityDir = -1;
      if (this.opacity <= CONFIG.minOpacity) this.opacityDir = 1;

      // Reset when off screen
      if (this.y < -10 || this.x < -10 || this.x > W + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }

  function initParticleList() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  // Init
  resize();
  initParticleList();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticleList();
  });
})();
