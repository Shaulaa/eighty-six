/* ============================================
   cursor.js — EIGHTY-SIX Military Crosshair Cursor
   ============================================ */

'use strict';

(function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  /* ── INJECT CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    * { cursor: none !important; }

    #mil-cursor {
      position: fixed;
      top: 0; left: 0;
      width: 40px; height: 40px;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: opacity 0.2s;
    }

    #mil-cursor .cur-ring {
      position: absolute;
      inset: 0;
      border: 1px solid rgba(192,41,43,0.85);
      border-radius: 50%;
      transition: transform 0.12s ease, border-color 0.2s;
    }

    #mil-cursor .cur-dot {
      position: absolute;
      top: 50%; left: 50%;
      width: 3px; height: 3px;
      background: #c0292b;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 4px #c0292b;
    }

    /* crosshair lines */
    #mil-cursor .cur-line {
      position: absolute;
      background: rgba(192,41,43,0.7);
    }
    #mil-cursor .cur-line.t { width: 1px; height: 8px;  top: 0;   left: 50%; transform: translateX(-50%); }
    #mil-cursor .cur-line.b { width: 1px; height: 8px;  bottom: 0; left: 50%; transform: translateX(-50%); }
    #mil-cursor .cur-line.l { height: 1px; width: 8px;  left: 0;  top: 50%;  transform: translateY(-50%); }
    #mil-cursor .cur-line.r { height: 1px; width: 8px;  right: 0; top: 50%;  transform: translateY(-50%); }

    /* Corner brackets */
    #mil-cursor .cur-corner {
      position: absolute;
      width: 8px; height: 8px;
    }
    #mil-cursor .cur-corner::before,
    #mil-cursor .cur-corner::after {
      content: '';
      position: absolute;
      background: rgba(192,41,43,0.9);
    }
    #mil-cursor .cur-corner::before { width: 100%; height: 1px; top: 0; left: 0; }
    #mil-cursor .cur-corner::after  { width: 1px; height: 100%; top: 0; left: 0; }
    #mil-cursor .cur-corner.tl { top: 0;    left: 0;  }
    #mil-cursor .cur-corner.tr { top: 0;    right: 0; transform: scaleX(-1); }
    #mil-cursor .cur-corner.bl { bottom: 0; left: 0;  transform: scaleY(-1); }
    #mil-cursor .cur-corner.br { bottom: 0; right: 0; transform: scale(-1); }

    /* Trailing ring */
    #mil-cursor-trail {
      position: fixed;
      top: 0; left: 0;
      width: 60px; height: 60px;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(192,41,43,0.2);
      border-radius: 50%;
      transition: transform 0.18s ease, width 0.18s, height 0.18s, opacity 0.2s;
    }

    /* Hover state — expand ring, change color */
    #mil-cursor.hovering .cur-ring {
      transform: scale(1.5);
      border-color: rgba(255,255,255,0.6);
    }
    #mil-cursor.hovering .cur-dot {
      background: #fff;
      box-shadow: 0 0 8px #fff;
    }
    #mil-cursor-trail.hovering {
      width: 80px; height: 80px;
      border-color: rgba(192,41,43,0.15);
    }

    /* Click burst */
    #mil-cursor.clicking .cur-ring {
      transform: scale(0.7);
    }
  `;
  document.head.appendChild(style);

  /* ── BUILD CURSOR DOM ── */
  const cursor = document.createElement('div');
  cursor.id = 'mil-cursor';
  cursor.innerHTML = `
    <div class="cur-ring"></div>
    <div class="cur-dot"></div>
    <div class="cur-line t"></div>
    <div class="cur-line b"></div>
    <div class="cur-line l"></div>
    <div class="cur-line r"></div>
    <div class="cur-corner tl"></div>
    <div class="cur-corner tr"></div>
    <div class="cur-corner bl"></div>
    <div class="cur-corner br"></div>
  `;
  document.body.appendChild(cursor);

  const trail = document.createElement('div');
  trail.id = 'mil-cursor-trail';
  document.body.appendChild(trail);

  /* ── POSITION TRACKING ── */
  let mouseX = 0, mouseY = 0;
  let trailX  = 0, trailY  = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
  }, { passive: true });

  /* Trail follows with lag */
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    trail.style.left = `${trailX}px`;
    trail.style.top  = `${trailY}px`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  /* ── HOVER ON INTERACTIVE ELEMENTS ── */
  const hoverTargets = 'a, button, .char-card, .war-cell, .nav-links a, .footer-nav a';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
      trail.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
      trail.classList.remove('hovering');
    }
  });

  /* ── CLICK EFFECT ── */
  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
  });

  /* ── HIDE WHEN LEAVING WINDOW ── */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });
})();
