/* ============================================
   loader.js — EIGHTY-SIX Cinematic Loading Screen
   ============================================ */

'use strict';

(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const bar    = loader.querySelector('.loader-bar-fill');
  const status = loader.querySelector('.loader-status');

  const messages = [
    'INITIALIZING PARA-RAID SYSTEM...',
    'CONNECTING TO SPEARHEAD SQUADRON...',
    'LOADING BATTLEFIELD DATA...',
    'SYNCING JUGGERNAUT UNITS...',
    'SYSTEM READY — DEPLOYING...',
  ];

  let progress = 0;
  let msgIndex = 0;

  // Update status message periodically
  function nextMessage() {
    if (msgIndex < messages.length) {
      status.textContent = messages[msgIndex++];
    }
  }

  nextMessage();

  // Animate progress bar
  const interval = setInterval(() => {
    const increment = Math.random() * 18 + 4;
    progress = Math.min(progress + increment, 100);

    if (bar) bar.style.width = progress + '%';

    // Change message at certain thresholds
    if (progress > 20 && msgIndex === 1) nextMessage();
    if (progress > 45 && msgIndex === 2) nextMessage();
    if (progress > 68 && msgIndex === 3) nextMessage();
    if (progress > 88 && msgIndex === 4) nextMessage();

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(hideLoader, 400);
    }
  }, 180);

  function hideLoader() {
    loader.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(() => loader.remove(), 900);
    // Unlock body scroll
    document.body.style.overflow = '';
  }

  // Lock scroll while loading
  document.body.style.overflow = 'hidden';
})();
