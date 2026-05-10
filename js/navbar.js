/* ============================================
   navbar.js — EIGHTY-SIX Military HUD Navbar
   Scroll behavior & active link tracking
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const links      = navbar.querySelectorAll('.nav-links a');
  const hamburger  = navbar.querySelector('.nav-hamburger');
  const navLinks   = navbar.querySelector('.nav-links');
  const sections   = document.querySelectorAll('section[id]');

  // ── SCROLL: toggle scrolled class + active link ──
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Scrolled state
        if (scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Active section
        let current = '';
        sections.forEach(sec => {
          const top = sec.offsetTop - 80;
          if (scrollY >= top) current = sec.id;
        });

        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  // ── HAMBURGER MENU (mobile) ──
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}
