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
  const quotesSection = document.getElementById('quotes');
  const qbs = [...document.querySelectorAll('.quote-block')];

  /* ── BATTLEFIELD ── */
  const warSection = document.getElementById('war');
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

    const mobile = window.innerWidth <= 768;

    /* ══ HERO ══ */
    if (bgEl && inHero) {
      if (mobile) {
        /* Mobile: vertical only, no horizontal shift */
        bgEl.style.transform = `translate3d(0, ${sy*0.25}px, 0)`;
      } else {
        bgEl.style.transform = `translate3d(${mx*20}px, ${sy*0.35}px, 0)`;
      }
    }

    if (gridEl && inHero) {
      gridEl.style.transform = `translate3d(0, ${sy*0.2}px, 0)`;
      gridEl.style.opacity   = `${clamp(1-hp*2,0,1)}`;
    }
    if (numEl && inHero) {
      const ntx = mobile ? 0 : mx*20;
      numEl.style.transform = `translate3d(${ntx}px, calc(-50% + ${-sy*0.28}px), 0)`;
      numEl.style.opacity   = `${clamp(1-hp*2.5,0,1)}`;
    }
    if (jpEl && inHero) {
      const jtx = mobile ? 0 : -sy*0.08+mx*5;
      jpEl.style.transform = `translate3d(${jtx}px, ${sy*0.05}px, 0)`;
      jpEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
    }
    if (titleEl && inHero) {
      const ttx = mobile ? 0 : mx*10;
      titleEl.style.transform = `translate3d(${ttx}px, ${sy*0.14}px, 0)`;
      titleEl.style.opacity   = `${clamp(1-hp*2,0,1)}`;
    }
    if (lineEl && inHero) {
      lineEl.style.width   = `${50+hp*140}px`;
      lineEl.style.opacity = `${clamp(1-hp*2.5,0,1)}`;
    }
    if (kanjiEl && inHero) {
      const ktx = mobile ? 0 : sy*0.07+mx*3;
      kanjiEl.style.transform = `translate3d(${ktx}px, ${sy*0.09}px, 0)`;
      kanjiEl.style.opacity   = `${clamp(1-hp*2.5,0,1)}`;
    }
    if (metaEl && inHero) {
      const mtx = mobile ? 0 : mx*5;
      metaEl.style.transform = `translate3d(${mtx}px, ${sy*0.07}px, 0)`;
      metaEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
    }
    if (tagEl && inHero) {
      const tactx = mobile ? 0 : sy*0.06;
      tagEl.style.transform = `translate3d(${tactx}px, ${sy*0.07}px, 0)`;
      tagEl.style.opacity   = `${clamp(1-hp*3,0,1)}`;
    }

    /* ══ SYNOPSIS ══ — handled by synopsis.js GSAP timeline */
    // synL / synR / synI parallax removed; synopsis.js owns this section

    /* ══ CHAR CARDS ══ */
    cards.forEach((card,i) => {
      const r   = card.getBoundingClientRect();
      const p   = prog(r.top, vh*.95, vh*.2);
      const col = i%3, row = Math.floor(i/3);
      const ix  = mobile ? 0 : (col===0?-70:col===2?70:0);
      const iy  = row===0?-45:45;
      const cy  = (r.top + r.height/2 - vh/2) / vh;
      card.style.transform = `translate3d(${ix*(1-p)}px,${iy*(1-p)}px,0) scale(${0.88+p*0.12})`;
      card.style.opacity   = `${clamp(p*2.5,0,1)}`;
      const img = card.querySelector('.char-img');
      if (img) img.style.transform = `translate3d(0,${cy*(mobile?18:30)}px,0) scale(1.12)`;
    });

    /* ══ QUOTES ══ */
    if (!quotesSection?.classList.contains('quotes-scroll-cinematic')) {
      qbs.forEach((b,i) => {
        const p   = prog(b.getBoundingClientRect().top, vh*.88, vh*.1);
        const dir = i%2===0?-1:1;
        const tx  = mobile ? dir*(1-p)*20 : dir*(1-p)*35;
        b.style.transform = `translate3d(${tx}px,0,0)`;
        b.style.opacity   = `${clamp(p*2,0,1)}`;
      });
    }

    /* ══ BATTLEFIELD ══ */
    if (!warSection?.classList.contains('war-scroll-cinematic')) {
      warCells.forEach((cell,i) => {
        const r   = cell.getBoundingClientRect();
        const p   = prog(r.top, vh*1.0, vh*0.3);
        const cy  = (r.top + r.height/2 - vh/2) / vh;
        const dir = i===0 ? -1 : 1;
        const slideX = mobile ? 0 : dir*(1-p)*60;
        const driftY = cy * (mobile?16:30);

        cell.style.transform = `translate3d(${slideX}px, ${driftY}px, 0)`;
        cell.style.opacity   = `${clamp(p*2,0,1)}`;

        const img = cell.querySelector('.war-img');
        if (img) {
          img.style.transform = `translate3d(0, ${cy*(mobile?14:28)}px, 0) scale(1.1)`;
          img.style.filter    = `brightness(${0.4+p*0.65}) saturate(${0.5+p*0.65})`;
          img.style.transition = 'filter 0.4s ease';
        }
      });

      if (wideW) {
        const r  = wideW.getBoundingClientRect();
        const p  = prog(r.top, vh*0.95, vh*0.1);
        const cy = (r.top + r.height/2 - vh/2) / vh;

        wideW.style.transform = `translate3d(0, ${(1-p)*30 + cy*(mobile?10:12)}px, 0)`;
        wideW.style.opacity   = `${clamp(p*1.8,0,1)}`;

        if (wideI) {
          wideI.style.transform  = `translate3d(0, ${cy*(mobile?14:28)}px, 0) scale(${1.1-p*0.06})`;
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
        warLine.style.transform       = `scaleX(${p})`;
        warLine.style.transformOrigin = 'center';
        warLine.style.opacity         = `${p}`;
      }
    }

    /* ══ PARA-RAID ══ */
    if (prInner) {
      const r  = prInner.getBoundingClientRect();
      const cy = (r.top + r.height/2 - vh/2) / vh;
      prInner.style.transform = `translate3d(0, ${cy*(mobile?12:25)}px, 0)`;
    }

    /* ══ RECEPTION BARS ══ */
    const rcInner = document.querySelector('.rc-inner');
    if (rcInner) {
      const r  = rcInner.getBoundingClientRect();
      const cy = (r.top + r.height/2 - vh/2) / vh;
      rcInner.style.transform = `translate3d(0, ${cy*(mobile?10:18)}px, 0)`;
    }

    /* ══ KEY THEMES CARDS ══ */
    const ktCards = [...document.querySelectorAll('.kt-card')];
    ktCards.forEach((card, i) => {
      const r   = card.getBoundingClientRect();
      const p   = prog(r.top, vh*0.95, vh*0.2);
      const cy  = (r.top + r.height/2 - vh/2) / vh;
      const dir = i%2===0 ? -1 : 1;
      const tx  = mobile ? 0 : dir*(1-p)*40;
      card.style.transform = `translate3d(${tx}px, ${cy*(mobile?8:14)}px, 0)`;
      card.style.opacity   = `${clamp(p*2,0,1)}`;
    });

    /* ══ ENDING ══ */
    const endEls = [endLogo, endQuote, endDed, endFooter];
    endEls.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = prog(r.top, vh*0.9, vh*0.2);
      el.style.transform = `translate3d(0, ${(1-p)*20}px, 0)`;
      el.style.opacity   = `${clamp(p*2,0,1)}`;
    });

  })();
}
