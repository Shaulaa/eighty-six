/* ============================================
   scroll.js — EIGHTY-SIX Cinematic Website
   Smooth scroll behavior & active section tracking
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initSectionTracker();
  initScrollProgress();
});

/* ── ACTIVE SECTION TRACKER ──
   Adds data-active attribute to body for potential
   nav highlighting or CSS-driven state changes.
*/
function initSectionTracker() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.body.setAttribute('data-section', entry.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ── SCROLL PROGRESS LINE ──
   Injects a thin red progress bar at the top of the page.
*/
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  Object.assign(bar.style, {
    position:   'fixed',
    top:        '0',
    left:       '0',
    height:     '2px',
    width:      '0%',
    background: 'var(--red, #c0292b)',
    zIndex:     '9999',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  });
  document.body.prepend(bar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${Math.min(pct, 100)}%`;
        ticking = false;
      });
      ticking = true;
    }
  });
}
