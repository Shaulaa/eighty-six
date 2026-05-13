/* ============================================
   scroll-effects.js — EIGHTY-SIX
   Smooth parallax for ALL sections
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => setTimeout(init, 300));

function init() {
  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
  const lerp  = (a,b,t) => a+(b-a)*t;
  const prog  = (top,en,ex) => clamp((top-en)/(ex-en), 0, 1);
  const vh    = window.innerHeight;

  /* ── HERO ── */
  const bgEl    = document.querySelector('.hero-bg');
  const gridEl  = document.querySelector('.hero-grid');
  const numEl   = document.querySelector('.hero-number');
  const titleEl = document.querySelector('.hero-title');
  const jpEl    = document.querySelector('.hero-jp-sub');
  const kanjiEl = document.querySelector('.hero-kanji');
  const lineEl  = document.querySelector('.hero-title-line');
  const metaEl  = document.querySelector('.hero-meta');
  const tagEl   = document.querySelector('.hero-tagline');

  /* ── SYNOPSIS ── */
  const synL = document.querySelector('.synopsis-grid > div:first-child');
  const synR = document.querySelector('.synopsis-grid > div:last-child');
  const synI = document.querySelector('.synopsis-img img');

  /* ── CHARACTERS ── */
  const cards = [...document.querySelectorAll('.char-card')];

  /* ── QUOTES ── */
  const qbs = [...document.querySelectorAll('.quote-block')];

  /* ── BATTLEFIELD ── */
  const warCells = [...document.querySelectorAll('.war-cell:not(.war-cell-wide)')];
  const wideW    = document.querySelector('.war-cell-wide');
  const wideI    = wideW?.querySelector('.war-img');
  const wideT    = wideW?.querySelector('.war-cell-text');
  const warLine  = document.querySelector('.war-line');

  /* ── PARA-RAID ── */
  const prSection = document.getElementById('para-raid');
  const prInner   = document.querySelector('.pr-inner');

  /* ── ENDING ── */
  const endLogo   = document.querySelector('.ending-logo');
  const endQuote  = document.querySelector('.ending-quote');
  const endDed    = document.querySelector('.ending-dedication');
  const endFooter = document.querySelector('.ending-footer');

  /* ── SMOOTH STATE ── */
  let sy=window.scrollY, tsy=sy, mx=0, tmx=0;
  if (window.__lenis__)
    window.__lenis__.on('scroll', ({scroll}) => { tsy=scroll; });
  window.addEventListener('scroll', ()=>{ tsy=window.scrollY; }, {passive:true});
  window.addEventListener('mousemove', e=>{
    tmx = (e.clientX/innerWidth - 0.5);
  }, {passive:true});

  ;(function tick(){
    requestAnimationFrame(tick);

    sy = lerp(sy, tsy, 0.055);
    mx = lerp(mx, tmx, 0.04);

    const hp     = clamp(sy/vh, 0, 1);
    const inHero = sy < vh * 1.2;

    /* ══ HERO ══ */
    if (bgEl && inHero)
      bgEl.style.transform = `translate3d(${mx*20}px, ${sy*0.35}px, 0)`;

    if (gridEl && inHero) {
      gridEl.style.transform = `translate3d(0, ${sy*0.2}px, 0)`;
      gridEl.style.opacity   = `${clamp(1-hp*2,0,1)}`;
    }
    if (numEl && inHero) {
      numEl.style.transform = `translate3d(${mx*20}px, calc(-50% + ${-sy*0.28}px), 0)`;
      numEl.style.opacity   = `${clamp(1-hp*2.5,0,1)}`;
    }
    if (jpEl && inHero) {
      jpEl.style.transform = `translate3d(${-sy*0.08+mx*5}px, ${sy*0.05}px, 0)`;
      jpEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
    }
    if (titleEl && inHero) {
      titleEl.style.transform = `translate3d(${mx*10}px, ${sy*0.14}px, 0)`;
      titleEl.style.opacity   = `${clamp(1-hp*2,0,1)}`;
    }
    if (lineEl && inHero) {
      lineEl.style.width   = `${50+hp*140}px`;
      lineEl.style.opacity = `${clamp(1-hp*2.5,0,1)}`;
    }
    if (kanjiEl && inHero) {
      kanjiEl.style.transform = `translate3d(${sy*0.07+mx*3}px, ${sy*0.09}px, 0)`;
      kanjiEl.style.opacity   = `${clamp(1-hp*2.5,0,1)}`;
    }
    if (metaEl && inHero) {
      metaEl.style.transform = `translate3d(${mx*5}px, ${sy*0.07}px, 0)`;
      metaEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
    }
    if (tagEl && inHero) {
      tagEl.style.transform = `translate3d(${sy*0.06}px, ${sy*0.07}px, 0)`;
      tagEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
    }

    /* ══ SYNOPSIS ══ */
    if (synL) {
      const p = prog(synL.getBoundingClientRect().top, vh*.95, vh*.1);
      synL.style.transform = `translate3d(${(1-p)*-50}px,0,0)`;
      synL.style.opacity   = `${clamp(p*1.8,0,1)}`;
    }
    if (synR) {
      const p = prog(synR.getBoundingClientRect().top, vh*.95, vh*.1);
      synR.style.transform = `translate3d(${(1-p)*50}px,0,0)`;
      synR.style.opacity   = `${clamp(p*1.8,0,1)}`;
    }
    if (synI) {
      const r  = synI.closest('.synopsis-img').getBoundingClientRect();
      const cy = (r.top + r.height/2 - vh/2) / vh;
      synI.style.transform = `translate3d(0,${cy*40}px,0) scale(1.1)`;
    }

    /* ══ CHAR CARDS ══ */
    cards.forEach((card,i) => {
      const r   = card.getBoundingClientRect();
      const p   = prog(r.top, vh*.95, vh*.2);
      const col = i%3, row = Math.floor(i/3);
      const ix  = col===0?-70:col===2?70:0;
      const iy  = row===0?-45:45;
      const cy  = (r.top + r.height/2 - vh/2) / vh;
      card.style.transform = `translate3d(${ix*(1-p)}px,${iy*(1-p)}px,0) scale(${0.88+p*0.12})`;
      card.style.opacity   = `${clamp(p*2.5,0,1)}`;
      const img = card.querySelector('.char-img');
      if (img) img.style.transform = `translate3d(0,${cy*30}px,0) scale(1.12)`;
    });

    /* ══ QUOTES ══ */
    qbs.forEach((b,i) => {
      const p   = prog(b.getBoundingClientRect().top, vh*.88, vh*.1);
      const dir = i%2===0?-1:1;
      b.style.transform = `translate3d(${dir*(1-p)*35}px,0,0)`;
      b.style.opacity   = `${clamp(p*2,0,1)}`;
    });

    /* ══ BATTLEFIELD — smooth, no abrupt jump ══ */
    warCells.forEach((cell,i) => {
      const r  = cell.getBoundingClientRect();
      /* enter from far → close smoothly */
      const p  = prog(r.top, vh*1.0, vh*0.3);
      const cy = (r.top + r.height/2 - vh/2) / vh;
      const dir = i===0 ? -1 : 1;

      /* slide in once, then subtle vertical drift */
      const slideX = dir * (1-p) * 60;
      const driftY = cy * 30;
      cell.style.transform = `translate3d(${slideX}px, ${driftY}px, 0)`;
      cell.style.opacity   = `${clamp(p*2,0,1)}`;

      const img = cell.querySelector('.war-img');
      if (img) {
        /* inner image moves slower than cell → depth */
        img.style.transform = `translate3d(0, ${cy*28}px, 0) scale(1.1)`;
        /* smooth brightness reveal */
        const bright = 0.4 + p * 0.65;
        const sat    = 0.5 + p * 0.65;
        img.style.filter = `brightness(${bright}) saturate(${sat})`;
        img.style.transition = 'filter 0.4s ease';
      }
    });

    if (wideW) {
      const r  = wideW.getBoundingClientRect();
      const p  = prog(r.top, vh*0.95, vh*0.1);
      const cy = (r.top + r.height/2 - vh/2) / vh;

      wideW.style.transform = `translate3d(0, ${(1-p)*30 + cy*12}px, 0)`;
      wideW.style.opacity   = `${clamp(p*1.8,0,1)}`;

      if (wideI) {
        wideI.style.transform  = `translate3d(0, ${cy*28}px, 0) scale(${1.1-p*0.06})`;
        wideI.style.filter     = `brightness(${0.3+p*0.8})`;
        wideI.style.transition = 'filter 0.5s ease';
      }
      if (wideT) {
        wideT.style.transform = `translate3d(0, ${(1-p)*35}px, 0)`;
        wideT.style.opacity   = `${clamp(p*2.2-0.8,0,1)}`;
      }
    }

    if (warLine) {
      const r = warLine.getBoundingClientRect();
      const p = prog(r.top, vh, vh*0.4);
      warLine.style.transform  = `scaleX(${p})`;
      warLine.style.transformOrigin = 'center';
      warLine.style.opacity    = `${p}`;
    }

    /* ══ PARA-RAID — subtle parallax ══ */
    if (prInner) {
      const r  = prInner.getBoundingClientRect();
      const cy = (r.top + r.height/2 - vh/2) / vh;
      prInner.style.transform = `translate3d(0, ${cy*25}px, 0)`;
    }

    /* ══ ENDING — staggered reveal ══ */
    const endEls = [endLogo, endQuote, endDed, endFooter];
    endEls.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = prog(r.top, vh*0.9, vh*0.2);
      el.style.transform = `translate3d(0, ${(1-p)*20}px, 0)`;
      el.style.opacity   = `${clamp(p*2,0,1)}`;
    });

  })();
}
