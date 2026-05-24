/* ============================================
   scroll-effects.js — EIGHTY-SIX
   Deep parallax, single RAF, no conflicts
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => setTimeout(init, 300));

function init() {
  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
  const lerp  = (a,b,t) => a+(b-a)*t;
  const prog  = (top,en,ex) => clamp((top-en)/(ex-en), 0, 1);
  const vh    = window.innerHeight;

  /* ── HERO ELEMENTS ── */
  const bgEl    = document.querySelector('.hero-bg');
  const gridEl  = document.querySelector('.hero-grid');
  const numEl   = document.querySelector('.hero-number');
  const titleEl = document.querySelector('.hero-title');
  const jpEl    = document.querySelector('.hero-jp-sub');
  const kanjiEl = document.querySelector('.hero-kanji');
  const lineEl  = document.querySelector('.hero-title-line');
  const metaEl  = document.querySelector('.hero-meta');
  const tagEl   = document.querySelector('.hero-tagline');

  /* ── OTHER SECTIONS ── */
  const synL  = document.querySelector('.synopsis-grid > div:first-child');
  const synR  = document.querySelector('.synopsis-grid > div:last-child');
  const synI  = document.querySelector('.synopsis-img img');
  const cards = [...document.querySelectorAll('.char-card')];
  const smWar = [...document.querySelectorAll('.war-cell:not(.war-cell-wide)')];
  const wideW = document.querySelector('.war-cell-wide');
  const wideI = wideW?.querySelector('.war-img');
  const wideT = wideW?.querySelector('.war-cell-text');
  const qbs   = [...document.querySelectorAll('.quote-block')];
  const quotesSection = document.getElementById('quotes');
  const warSection = document.getElementById('war');

  /* ── SMOOTH STATE ── */
  let sy=window.scrollY, tsy=sy;
  let mx=0, tmx=0;

  if (window.__lenis__)
    window.__lenis__.on('scroll', ({scroll}) => { tsy=scroll; });
  window.addEventListener('scroll', ()=>{ tsy=window.scrollY; }, {passive:true});
  window.addEventListener('mousemove', e=>{
    tmx = (e.clientX/innerWidth - 0.5);
  }, {passive:true});

  /* ── SINGLE RAF ── */
  ;(function tick(){
    requestAnimationFrame(tick);

    sy  = lerp(sy,  tsy,  0.07);
    mx  = lerp(mx,  tmx,  0.04);

    const hp     = clamp(sy/vh, 0, 1);
    const inHero = sy < vh * 1.3;

    /* ══ HERO PARALLAX ══
       KEY: bg moves UP a lot when scrolling down.
       If bg moves up 0.5px per 1px scroll → feels deep.
    */
    if (inHero) {

      /* BG — move up fast (deepest layer) */
      if (bgEl) {
        const ty = sy * 0.55;           /* strong: 55% of scroll */
        const tx = mx * 30;             /* mouse tilt */
        bgEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      /* Grid — slower than bg */
      if (gridEl) {
        gridEl.style.transform = `translate3d(0, ${sy*0.25}px, 0)`;
        gridEl.style.opacity   = `${clamp(1-hp*2,0,1)}`;
      }

      /* BIG 86 — float opposite to scroll (moves DOWN) */
      if (numEl) {
        numEl.style.transform = `translate3d(${mx*30}px, calc(-50% + ${-sy*0.4}px), 0)`;
        numEl.style.opacity   = `${clamp(1-hp*2.5,0,1)}`;
      }

      /* JP subtitle — drifts left + up */
      if (jpEl) {
        jpEl.style.transform = `translate3d(${-sy*0.14+mx*6}px, ${sy*0.08}px, 0)`;
        jpEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
      }

      /* TITLE — mid layer */
      if (titleEl) {
        titleEl.style.transform = `translate3d(${mx*14}px, ${sy*0.25}px, 0)`;
        titleEl.style.opacity   = `${clamp(1-hp*2,0,1)}`;
      }

      /* LINE — stretches */
      if (lineEl) {
        lineEl.style.width   = `${50 + hp*140}px`;
        lineEl.style.opacity = `${clamp(1-hp*2.5,0,1)}`;
      }

      /* KANJI — drifts right */
      if (kanjiEl) {
        kanjiEl.style.transform = `translate3d(${sy*0.12+mx*4}px, ${sy*0.14}px, 0)`;
        kanjiEl.style.opacity   = `${clamp(1-hp*2.5,0,1)}`;
      }

      /* META + TAGLINE — slow foreground */
      if (metaEl) {
        metaEl.style.transform = `translate3d(${mx*5}px, ${sy*0.08}px, 0)`;
        metaEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
      }
      if (tagEl) {
        tagEl.style.transform = `translate3d(${sy*0.07}px, ${sy*0.08}px, 0)`;
        tagEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
      }
    }

    /* ══ SYNOPSIS ══ — handled by synopsis.js */

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
      if (img) img.style.transform = `translate3d(0,${cy*55}px,0) scale(1.18)`;
    });

    /* ══ WAR ══ */
    if (!warSection?.classList.contains('war-scroll-cinematic')) {
      smWar.forEach((cell,i) => {
      const r   = cell.getBoundingClientRect();
      const p   = prog(r.top, vh*.9, vh*.25);
      const cy  = (r.top + r.height/2 - vh/2) / vh;
      const dir = i===0 ? -1 : 1;

      cell.style.transform = `translate3d(${dir*(1-p)*90}px,0,0)`;
      cell.style.opacity   = `${clamp(p*2.5,0,1)}`;

      const img = cell.querySelector('.war-img');
      if (img) {
        img.style.transform = `translate3d(0,${cy*60}px,0) scale(1.18)`;
        img.style.filter    = `brightness(${.35+p*.75}) saturate(${.5+p*.7})`;
      }
      });

      if (wideW) {
      const r  = wideW.getBoundingClientRect();
      const p  = prog(r.top, vh*.85, vh*.1);
      const cy = (r.top + r.height/2 - vh/2) / vh;

      wideW.style.transform = `translate3d(0,${(1-p)*60}px,0)`;
      wideW.style.opacity   = `${clamp(p*1.8,0,1)}`;
      if (wideI) {
        wideI.style.transform = `translate3d(0,${cy*55}px,0) scale(${1.2-p*.16})`;
        wideI.style.filter    = `brightness(${.25+p*.85})`;
      }
      if (wideT) {
        wideT.style.transform = `translate3d(0,${(1-p)*40}px,0)`;
        wideT.style.opacity   = `${clamp(p*2-.8,0,1)}`;
      }
      }
    }

    /* ══ QUOTES ══ */
    if (!quotesSection?.classList.contains('quotes-scroll-cinematic')) {
      qbs.forEach((b,i) => {
      const p   = prog(b.getBoundingClientRect().top, vh*.88, vh*.1);
      const dir = i%2===0?-1:1;
      b.style.transform = `translate3d(${dir*(1-p)*55}px,0,0)`;
      b.style.opacity   = `${clamp(p*2,0,1)}`;
      });
    }

  })();
}
