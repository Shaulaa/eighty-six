/* ============================================
   characters.js - EIGHTY-SIX
   Vertical sticky heading + horizontal scroll
   using GSAP ScrollTrigger + Lenis
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCharVertical();
  initCharHorizontal();
});

/* 1. VERTICAL - sticky heading, items reveal */
function initCharVertical() {
  const section  = document.querySelector('.char-vertical');
  const colLeft  = document.querySelector('.char-v-left');
  const items    = document.querySelectorAll('.char-v-item');

  if (!section || !colLeft || !items.length) return;

  /* Reveal items on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => io.observe(item));

  initStableCharacterHeading(section, colLeft);
}

function initStableCharacterHeading(section, heading) {
  const lockTop = 150;
  const naturalTop = 240;
  let start = 0;
  let end = 0;
  let mode = '';
  let ticking = false;

  const clearMode = () => {
    heading.classList.remove('is-fixed', 'is-bottom');
    mode = '';
  };

  const measure = () => {
    clearMode();

    if (window.innerWidth <= 768) {
      heading.style.removeProperty('--char-left-x');
      heading.style.removeProperty('--char-left-width');
      heading.style.removeProperty('--char-left-bottom-top');
      return;
    }

    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.scrollY;
    const headingRect = heading.getBoundingClientRect();
    const bottomTop = Math.max(naturalTop, section.offsetHeight - headingRect.height - 180);

    heading.style.setProperty('--char-left-x', `${Math.round(headingRect.left)}px`);
    heading.style.setProperty('--char-left-width', `${Math.round(headingRect.width)}px`);
    heading.style.setProperty('--char-left-bottom-top', `${Math.round(bottomTop)}px`);

    start = sectionTop + naturalTop - lockTop;
    end = sectionTop + bottomTop - lockTop;
    update();
  };

  const setMode = (nextMode) => {
    if (mode === nextMode) return;

    heading.classList.toggle('is-fixed', nextMode === 'fixed');
    heading.classList.toggle('is-bottom', nextMode === 'bottom');
    mode = nextMode;
  };

  const update = () => {
    if (window.innerWidth <= 768) {
      clearMode();
      return;
    }

    const y = Math.round(window.scrollY);
    if (y < start) {
      setMode('');
    } else if (y >= end) {
      setMode('bottom');
    } else {
      setMode('fixed');
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  measure();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure, { once: true });
  window.__lenis__?.on('scroll', requestUpdate);
  document.fonts?.ready?.then(measure);
}

/* 2. HORIZONTAL - card scroll */
function initCharHorizontal() {
  const section = document.getElementById('char-horizontal');
  const items   = typeof gsap !== 'undefined' ? gsap.utils.toArray('.char-h-item') : [];

  if (!section || !items.length) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* Skip on mobile */
  if (window.innerWidth <= 768) return;

  gsap.to(items, {
    xPercent: -100 * (items.length - 1),
    ease:     'sine.out',
    scrollTrigger: {
      trigger: section,
      pin:     true,
      scrub:   2,
      snap:    1 / (items.length - 1),
      end:     '+=' + section.offsetWidth,
    },
  });
}
