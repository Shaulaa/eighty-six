/* ============================================
   navbar.js — EIGHTY-SIX Military HUD Navbar
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
});

function initNavbar() {
  const navbar    = document.getElementById('navbar');
  if (!navbar) return;

  const links     = navbar.querySelectorAll('.nav-links a');
  const hamburger = navbar.querySelector('.nav-hamburger');
  const navLinks  = navbar.querySelector('.nav-links');
  const sections  = document.querySelectorAll('section[id], footer');
  let isOpen      = false;

  /* ── SCROLL: scrolled state + active link ── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 40);

        let current = '';
        sections.forEach(sec => {
          if (scrollY >= sec.offsetTop - 90) current = sec.id || '';
        });
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  /* ── HAMBURGER ── */
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        navLinks.classList.add('open');
        // Lock body scroll without shifting layout
        document.body.style.overflow   = 'hidden';
        document.body.style.paddingRight = '0px';
        // animate each link in staggered
        navLinks.querySelectorAll('li').forEach((li, i) => {
          li.style.transitionDelay = `${i * 0.06}s`;
          li.style.opacity = '0';
          li.style.transform = 'translateX(-12px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              li.style.opacity = '1';
              li.style.transform = 'translateX(0)';
            });
          });
        });
        // animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        closeMenu();
      }
    });

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target   = document.getElementById(targetId);
        closeMenu();
        if (!target) return;

        // Smooth scroll via Lenis or native, duration 1.6s
        setTimeout(() => {
          if (window.__lenis__) {
            window.__lenis__.scrollTo(target, {
              offset:   -52,
              duration: 1.6,
              easing:   t => 1 - Math.pow(1 - t, 4),
            });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, isOpen ? 320 : 0); // wait for menu close anim on mobile
      });
    });
  }

  /* ── DESKTOP anchor smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.closest('#navbar')) return; // handled above
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (window.__lenis__) {
        window.__lenis__.scrollTo(target, {
          offset:   -52,
          duration: 1.6,
          easing:   t => 1 - Math.pow(1 - t, 4),
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function closeMenu() {
    isOpen = false;
    navLinks.querySelectorAll('li').forEach(li => {
      li.style.transitionDelay = '0s';
    });
    navLinks.classList.remove('open');
    // Restore body scroll
    document.body.style.overflow    = '';
    document.body.style.paddingRight = '';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
}
