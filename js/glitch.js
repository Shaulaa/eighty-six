/* ============================================
   glitch.js — EIGHTY-SIX Cinematic Website
   Glitch effect for hero title & UI elements
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initGlitch();
});

function initGlitch() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  // Random interval glitch trigger (supplements CSS animation)
  function triggerGlitch() {
    title.classList.add('glitch-active');
    setTimeout(() => title.classList.remove('glitch-active'), 300);

    // Schedule next glitch at random interval between 5s–15s
    const next = 5000 + Math.random() * 10000;
    setTimeout(triggerGlitch, next);
  }

  // Start after initial page animations settle
  setTimeout(triggerGlitch, 3000);

  // ── SCANLINE DRIFT on hero ──
  const scanlines = document.querySelector('.hero-scanlines');
  if (scanlines) {
    let offset = 0;
    setInterval(() => {
      offset = (offset + 1) % 80;
      scanlines.style.backgroundPosition = `0 ${offset}px`;
    }, 40);
  }

  // ── RANDOM FLICKER on hero-dots red dot ──
  const redDot = document.querySelector('.hero-dots span:first-child');
  if (redDot) {
    setInterval(() => {
      const flicker = Math.random() < 0.08;
      redDot.style.opacity = flicker ? '0.2' : '';
    }, 120);
  }
}
