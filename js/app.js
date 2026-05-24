/* ============================================
   app.js - EIGHTY-SIX
   Core init - NO hero transform here,
   all parallax handled by scroll-effects.js
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavLinks();
  initEndingReveal();
});

/* ANCHOR NAV */
function initNavLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      if (window.__lenis__) {
        window.__lenis__.scrollTo(target, { offset: -52, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ENDING SECTION REVEAL (IntersectionObserver) */
function initEndingReveal() {
  const els = document.querySelectorAll('.ending-logo, .ending-quote, .ending-dedication, .ending-footer');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    io.observe(el);
  });
}
