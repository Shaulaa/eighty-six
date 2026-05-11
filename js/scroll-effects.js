/* ============================================
   scroll-effects.js — EIGHTY-SIX
   Single bg parallax, strong & clean
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => setTimeout(init, 300));

function init() {
  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
  const lerp  = (a,b,t) => a+(b-a)*t;
  const prog  = (top,en,ex) => clamp((top-en)/(ex-en), 0, 1);
  const vh    = window.innerHeight;

  const bgEl    = document.querySelector('.hero-bg');
  const gridEl  = document.querySelector('.hero-grid');
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

  let sy=window.scrollY, tsy=sy, mx=0, tmx=0;

  if (window.__lenis__)
    window.__lenis__.on('scroll', ({scroll}) => { tsy=scroll; });
  window.addEventListener('scroll', ()=>{ tsy=window.scrollY; }, {passive:true});
  window.addEventListener('mousemove', e=>{
    tmx = (e.clientX/innerWidth - 0.5);
  }, {passive:true});

  ;(function tick(){
    requestAnimationFrame(tick);

    sy = lerp(sy, tsy, 0.07);
    mx = lerp(mx, tmx, 0.04);

    const hp     = clamp(sy/vh, 0, 1);
    const inHero = sy < vh * 1.2;

    /* ── BG: single layer, strong parallax via transform ── */
    if (bgEl && inHero) {
      bgEl.style.transform = `translate3d(${mx*25}px, ${sy*0.5}px, 0)`;
    }

    /* ── GRID ── */
    if (gridEl && inHero) {
      gridEl.style.transform = `translate3d(0, ${sy*0.2}px, 0)`;
      gridEl.style.opacity   = `${clamp(1-hp*2,0,1)}`;
    }

    /* ── HERO TEXT — different speeds per layer ── */
    if (inHero) {
      const f = s => `${clamp(1-hp*s,0,1)}`;

      // 86 number — moves fast opposite (creates depth against slow bg)
      if (numEl) {
        numEl.style.transform = `translate3d(${mx*30}px, calc(-50% + ${-sy*0.4}px), 0)`;
        numEl.style.opacity   = f(2.5);
      }
      // jp sub — mid speed
      if (jpEl) {
        jpEl.style.transform = `translate3d(${-sy*0.12+mx*6}px, ${sy*0.07}px, 0)`;
        jpEl.style.opacity   = f(3);
      }
      // title — slowest text (close to camera feel)
      if (titleEl) {
        titleEl.style.transform = `translate3d(${mx*12}px, ${sy*0.22}px, 0)`;
        titleEl.style.opacity   = f(2);
      }
      if (lineEl) {
        lineEl.style.width   = `${50+hp*140}px`;
        lineEl.style.opacity = f(2.5);
      }
      if (kanjiEl) {
        kanjiEl.style.transform = `translate3d(${sy*0.1+mx*4}px, ${sy*0.13}px, 0)`;
        kanjiEl.style.opacity   = f(2.5);
      }
      if (metaEl) {
        metaEl.style.transform = `translate3d(${mx*5}px, ${sy*0.07}px, 0)`;
        metaEl.style.opacity   = f(3);
      }
      if (tagEl) {
        tagEl.style.transform = `translate3d(${sy*0.06}px, ${sy*0.07}px, 0)`;
        tagEl.style.opacity   = f(3);
      }
    }

    /* ── SYNOPSIS ── */
    if (synL) {
      const p = prog(synL.getBoundingClientRect().top, vh*.95, vh*.1);
      synL.style.transform = `translate3d(${(1-p)*-80}px,0,0)`;
      synL.style.opacity   = `${clamp(p*1.8,0,1)}`;
    }
    if (synR) {
      const p = prog(synR.getBoundingClientRect().top, vh*.95, vh*.1);
      synR.style.transform = `translate3d(${(1-p)*80}px,0,0)`;
      synR.style.opacity   = `${clamp(p*1.8,0,1)}`;
    }
    if (synI) {
      const r  = synI.closest('.synopsis-img').getBoundingClientRect();
      const cy = (r.top + r.height/2 - vh/2) / vh;
      synI.style.transform = `translate3d(0,${cy*70}px,0) scale(1.16)`;
    }

    /* ── CHAR CARDS ── */
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

    /* ── WAR ── */
    smWar.forEach((cell,i) => {
      const r   = cell.getBoundingClientRect();
      const p   = prog(r.top, vh*.9, vh*.25);
      const cy  = (r.top + r.height/2 - vh/2) / vh;
      const dir = i===0?-1:1;
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

    /* ── QUOTES ── */
    qbs.forEach((b,i) => {
      const p   = prog(b.getBoundingClientRect().top, vh*.88, vh*.1);
      const dir = i%2===0?-1:1;
      b.style.transform = `translate3d(${dir*(1-p)*55}px,0,0)`;
      b.style.opacity   = `${clamp(p*2,0,1)}`;
    });

  })();
}
