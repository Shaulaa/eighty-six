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
  let targetProgress = 0;
  let msgIndex = 0;
  const startTime = performance.now();
  const minDuration = 2400;
  let rafId = 0;

  // Update status message periodically
  function nextMessage() {
    if (msgIndex < messages.length) {
      if (!status) {
        msgIndex++;
        return;
      }

      status.textContent = messages[msgIndex++];
      status.classList.add('is-changing');
      window.setTimeout(() => status.classList.remove('is-changing'), 220);
    }
  }

  nextMessage();

  function updateTarget() {
    const elapsed = performance.now() - startTime;
    const timeProgress = Math.min(elapsed / minDuration, 1);
    targetProgress = Math.max(targetProgress, easeOutCubic(timeProgress) * 100);
  }

  function animate() {
    updateTarget();
    progress += (targetProgress - progress) * 0.075;

    if (targetProgress >= 100 && 100 - progress < 0.08) {
      progress = 100;
    }

    if (bar) bar.style.width = progress.toFixed(3) + '%';

    // Change message at certain thresholds
    if (progress > 18 && msgIndex === 1) nextMessage();
    if (progress > 42 && msgIndex === 2) nextMessage();
    if (progress > 66 && msgIndex === 3) nextMessage();
    if (progress > 86 && msgIndex === 4) nextMessage();

    if (progress >= 100) {
      window.setTimeout(hideLoader, 520);
      return;
    }

    rafId = requestAnimationFrame(animate);
  }

  rafId = requestAnimationFrame(animate);

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function hideLoader() {
    cancelAnimationFrame(rafId);
    loader.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(() => loader.remove(), 1250);
    // Unlock body scroll
    document.body.style.overflow = '';
  }

  // Lock scroll while loading
  document.body.style.overflow = 'hidden';
})();
