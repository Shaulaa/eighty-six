/* ============================================
   scroll-effects.js — EIGHTY-SIX
   Goonies-style deep layered parallax
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => setTimeout(init, 400));

function init() {
  /* ── HELPERS ── */
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const prog  = (top,en,ex) => clamp((top-en)/(ex-en), 0, 1);
  const lerp  = (a,b,t) => a + (b-a)*t;

  /* ── BUILD HERO LAYERS (Goonies-style depth stack) ── */
  buildHeroLayers();

  /* ── CACHED ELS ── */
  const layers  = [...document.querySelectorAll('.parallax-layer')];
  const numEl   = document.querySelector('.hero-number');
  const titleEl = document.querySelector('.hero-title');
  const jpEl    = document.querySelector('.hero-jp-sub');
  const kanjiEl = document.querySelector('.hero-kanji');
  const lineEl  = document.querySelector('.hero-title-line');
  const metaEl  = document.querySelector('.hero-meta');
  const tagEl   = document.querySelector('.hero-tagline');

  const synL  = document.querySelector('.synopsis-grid > div:first-child');
  const synR  = document.querySelector('.synopsis-grid > div:last-child');
  const synI  = document.querySelector('.synopsis-img img');
  const cards = [...document.querySelectorAll('.char-card')];
  const smWar = [...document.querySelectorAll('.war-cell:not(.war-cell-wide)')];
  const wideW = document.querySelector('.war-cell-wide');
  const wideI = wideW?.querySelector('.war-img');
  const wideT = wideW?.querySelector('.war-cell-text');
  const qbs   = [...document.querySelectorAll('.quote-block')];

  /* ── STATE ── */
  let sy=window.scrollY, tsy=sy;
  let mx=0, tmx=0, my=0, tmy=0;
  const vh = window.innerHeight;

  if (window.__lenis__)
    window.__lenis__.on('scroll', ({scroll}) => { tsy = scroll; });
  window.addEventListener('scroll', () => { tsy = window.scrollY; }, {passive:true});
  window.addEventListener('mousemove', e => {
    tmx = (e.clientX / innerWidth  - 0.5);
    tmy = (e.clientY / innerHeight - 0.5);
  }, {passive:true});

  /* ── SINGLE RAF LOOP ── */
  ;(function tick(){
    requestAnimationFrame(tick);

    sy  = lerp(sy,  tsy,  0.075);
    mx  = lerp(mx,  tmx,  0.04);
    my  = lerp(my,  tmy,  0.04);

    const hp     = clamp(sy / vh, 0, 1);
    const inHero = sy < vh * 1.2;

    /* ══ LAYERED PARALLAX HERO (Goonies-style) ══
       Each layer moves at a different rate — deeper = slower.
       Layers: [0]=far bg, [1]=mid dust, [2]=mid-front, [3]=close vignette
    */
    if (inHero) {
      const speeds = [0.18, 0.28, 0.42, 0.58]; // bg → foreground
      const mxSpeeds = [6, 10, 15, 20];

      layers.forEach((l, i) => {
        const ty = -sy * speeds[i];
        const tx = mx * mxSpeeds[i];
        l.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        // fade out layers as scroll progresses
        if (i > 0) l.style.opacity = `${clamp(1 - hp * (i * 0.6), 0, 1)}`;
      });
    }

    /* ── HERO TEXT — each at different depth ── */
    if (inHero) {
      const fade = (s) => `${clamp(1 - hp*s, 0, 1)}`;

      if (numEl) {
        numEl.style.transform = `translate3d(${mx*28}px, calc(-50% + ${-sy*0.35}px), 0)`;
        numEl.style.opacity   = fade(2.8);
      }
      if (jpEl) {
        jpEl.style.transform = `translate3d(${-sy*0.12 + mx*5}px, ${sy*0.08}px, 0)`;
        jpEl.style.opacity   = fade(3);
      }
      if (titleEl) {
        titleEl.style.transform = `translate3d(${mx*12}px, ${sy*0.22}px, 0)`;
        titleEl.style.opacity   = fade(2);
      }
      if (lineEl) {
        lineEl.style.width   = `${50 + hp*130}px`;
        lineEl.style.opacity = fade(2.5);
      }
      if (kanjiEl) {
        kanjiEl.style.transform = `translate3d(${sy*0.1 + mx*3}px, ${sy*0.12}px, 0)`;
        kanjiEl.style.opacity   = fade(2.5);
      }
      if (metaEl) {
        metaEl.style.transform = `translate3d(${mx*4}px, ${sy*0.07}px, 0)`;
        metaEl.style.opacity   = fade(3);
      }
      if (tagEl) {
        tagEl.style.transform = `translate3d(${sy*0.06}px, ${sy*0.07}px, 0)`;
        tagEl.style.opacity   = fade(3);
      }
    }

    /* ══ SYNOPSIS ══ */
    if (synL) {
      const p = prog(synL.getBoundingClientRect().top, vh*.95, vh*.1);
      synL.style.transform = `translate3d(${(1-p)*-80}px, 0, 0)`;
      synL.style.opacity   = `${clamp(p*1.8,0,1)}`;
    }
    if (synR) {
      const p = prog(synR.getBoundingClientRect().top, vh*.95, vh*.1);
      synR.style.transform = `translate3d(${(1-p)*80}px, 0, 0)`;
      synR.style.opacity   = `${clamp(p*1.8,0,1)}`;
    }
    if (synI) {
      const r  = synI.closest('.synopsis-img').getBoundingClientRect();
      const cy = (r.top + r.height/2 - vh/2) / vh;
      synI.style.transform = `translate3d(0, ${cy*65}px, 0) scale(1.16)`;
    }

    /* ══ CHAR CARDS ══ */
    cards.forEach((card,i) => {
      const r   = card.getBoundingClientRect();
      const p   = prog(r.top, vh*.95, vh*.2);
      const col = i%3, row = Math.floor(i/3);
      const ix  = col===0?-70:col===2?70:0;
      const iy  = row===0?-45:45;
      const cy  = (r.top + r.height/2 - vh/2) / vh;

      card.style.transform = `translate3d(${ix*(1-p)}px, ${iy*(1-p)}px, 0) scale(${0.88+p*0.12})`;
      card.style.opacity   = `${clamp(p*2.5,0,1)}`;

      const img = card.querySelector('.char-img');
      if (img) img.style.transform = `translate3d(0, ${cy*55}px, 0) scale(1.18)`;
    });

    /* ══ WAR ══ */
    smWar.forEach((cell,i) => {
      const r   = cell.getBoundingClientRect();
      const p   = prog(r.top, vh*.9, vh*.25);
      const cy  = (r.top + r.height/2 - vh/2) / vh;
      const dir = i===0 ? -1 : 1;

      cell.style.transform = `translate3d(${dir*(1-p)*90}px, 0, 0)`;
      cell.style.opacity   = `${clamp(p*2.5,0,1)}`;

      const img = cell.querySelector('.war-img');
      if (img) {
        img.style.transform = `translate3d(0, ${cy*60}px, 0) scale(1.18)`;
        img.style.filter    = `brightness(${.35+p*.75}) saturate(${.5+p*.7})`;
      }
    });

    if (wideW) {
      const r  = wideW.getBoundingClientRect();
      const p  = prog(r.top, vh*.85, vh*.1);
      const cy = (r.top + r.height/2 - vh/2) / vh;

      wideW.style.transform = `translate3d(0, ${(1-p)*60}px, 0)`;
      wideW.style.opacity   = `${clamp(p*1.8,0,1)}`;

      if (wideI) {
        wideI.style.transform = `translate3d(0, ${cy*55}px, 0) scale(${1.2-p*0.16})`;
        wideI.style.filter    = `brightness(${.25+p*.85})`;
      }
      if (wideT) {
        wideT.style.transform = `translate3d(0, ${(1-p)*40}px, 0)`;
        wideT.style.opacity   = `${clamp(p*2-.8,0,1)}`;
      }
    }

    /* ══ QUOTES ══ */
    qbs.forEach((b,i) => {
      const p   = prog(b.getBoundingClientRect().top, vh*.88, vh*.1);
      const dir = i%2===0 ? -1 : 1;
      b.style.transform = `translate3d(${dir*(1-p)*55}px, 0, 0)`;
      b.style.opacity   = `${clamp(p*2,0,1)}`;
    });

  })();
}

/* ══ BUILD HERO DEPTH LAYERS ══
   Inject 4 absolutely-positioned divs inside .hero
   each with different opacity/blur/gradient to simulate depth
*/
function buildHeroLayers() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.parallax-layer')) return;

  // Layer configs: [zIndex, style]
  const layerDefs = [
    // Layer 0 — far bg (same as hero-bg but slightly dimmed)
    {
      z: 0,
      style: `
        position:absolute;inset:0;
        background: rgba(0,0,0,0);
        pointer-events:none;
      `
    },
    // Layer 1 — mid atmospheric haze
    {
      z: 2,
      style: `
        position:absolute;inset:0;
        background: radial-gradient(ellipse 80% 60% at 60% 40%,
          rgba(30,58,95,0.25) 0%, transparent 70%);
        pointer-events:none;
      `
    },
    // Layer 2 — red slash/light ray
    {
      z: 3,
      style: `
        position:absolute;inset:0;
        background: linear-gradient(125deg,
          transparent 30%,
          rgba(192,41,43,0.06) 45%,
          rgba(192,41,43,0.1) 55%,
          transparent 65%);
        pointer-events:none;
      `
    },
    // Layer 3 — foreground vignette (darkens edges)
    {
      z: 4,
      style: `
        position:absolute;inset:0;
        background:
          radial-gradient(ellipse 100% 100% at 50% 50%,
            transparent 40%, rgba(0,0,0,0.55) 100%),
          linear-gradient(180deg,
            rgba(0,0,0,0.3) 0%,
            transparent 30%,
            transparent 60%,
            rgba(0,0,0,0.7) 100%);
        pointer-events:none;
      `
    },
  ];

  layerDefs.forEach((def, i) => {
    const div = document.createElement('div');
    div.className = 'parallax-layer';
    div.setAttribute('data-depth', i);
    div.style.cssText = def.style + `z-index:${def.z};will-change:transform;`;
    hero.appendChild(div);
  });
}
