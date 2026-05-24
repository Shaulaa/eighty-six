/* ============================================
   char-to-quotes-cinematic.js — EIGHTY-SIX
   Cinematic transition: char-horizontal → quotes
   + Para-RAID GIF parallax cinematic reveal
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  setTimeout(() => {
    initCharToQuotesTransition();
    initParaRaidGif();
  }, 120);
});

/* ══════════════════════════════════════════════
   1. CHAR-HORIZONTAL → QUOTES TRANSITION
   Cinematic wipe: characters fade into darkness,
   quotes rises from black with film grain + bars
══════════════════════════════════════════════ */
function initCharToQuotesTransition() {
  const charH  = document.getElementById('char-horizontal');
  const quotes = document.querySelector('.quotes');
  if (!charH || !quotes) return;

  /* ── Remove old margin hack that causes the gap ── */
  charH.style.marginBottom = '0';
  quotes.style.marginTop   = '0';

  /* ── Inject transition bridge layer ── */
  const bridge = document.createElement('div');
  bridge.id = 'cq-bridge';
  bridge.innerHTML = `
    <div class="cq-film-top"></div>
    <div class="cq-film-bot"></div>
    <div class="cq-vignette"></div>
    <div class="cq-grain"></div>
    <div class="cq-glitch-line"></div>
    <div class="cq-label">SPEARHEAD SQUADRON — ROSTER COMPLETE</div>
  `;
  charH.appendChild(bridge);

  /* ── Inject entry veil on quotes ── */
  const quotesVeil = document.createElement('div');
  quotesVeil.id = 'quotes-entry-veil';
  quotes.insertBefore(quotesVeil, quotes.firstChild);

  /* ── Initial states ── */
  gsap.set('#cq-bridge', { opacity: 0, pointerEvents: 'none' });
  gsap.set('.cq-film-top', { scaleY: 0, transformOrigin: 'top center' });
  gsap.set('.cq-film-bot', { scaleY: 0, transformOrigin: 'bottom center' });
  gsap.set('.cq-vignette', { opacity: 0 });
  gsap.set('.cq-label',    { opacity: 0, letterSpacing: '0.5em' });
  gsap.set('.cq-glitch-line', { opacity: 0, scaleX: 0 });
  gsap.set('#quotes-entry-veil', { opacity: 1 });

  /* ── Timeline: char-horizontal exit ── */
  const exitTl = gsap.timeline({
    scrollTrigger: {
      trigger: charH,
      start: 'bottom 70%',
      end:   'bottom top',
      scrub: 1.4,
    }
  });

  exitTl
    .to('#cq-bridge',       { opacity: 1, duration: 0.1 }, 0)
    .to('.cq-vignette',     { opacity: 1, duration: 0.4 }, 0)
    .to('.cq-film-top',     { scaleY: 1, duration: 0.55, ease: 'power2.inOut' }, 0.1)
    .to('.cq-film-bot',     { scaleY: 1, duration: 0.55, ease: 'power2.inOut' }, 0.1)
    .to('.cq-glitch-line',  { opacity: 1, scaleX: 1, duration: 0.3, ease: 'power1.out' }, 0.35)
    .to('.cq-label',        { opacity: 1, letterSpacing: '0.25em', duration: 0.35 }, 0.45)
    .to('.cq-glitch-line',  { opacity: 0, duration: 0.15 }, 0.72)
    .to('.cq-label',        { opacity: 0, duration: 0.2 }, 0.78);

  /* ── Scale-down char images as exit completes ── */
  const charImgs = gsap.utils.toArray('.char-h-img');
  if (charImgs.length) {
    exitTl.to(charImgs, {
      scale: 1.06,
      filter: 'brightness(0.15) saturate(0) contrast(1.2)',
      duration: 1,
      ease: 'power2.in',
      stagger: 0.06
    }, 0);
  }

  /* ── Quotes entry: veil lifts as quotes enters viewport ── */
  const entryTl = gsap.timeline({
    scrollTrigger: {
      trigger: quotes,
      start: 'top 90%',
      end:   'top 20%',
      scrub: 1,
    }
  });

  entryTl
    .to('#quotes-entry-veil', { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0)
    .to('.cq-film-top', { scaleY: 0, duration: 0.5, ease: 'power2.in' }, 0)
    .to('.cq-film-bot', { scaleY: 0, duration: 0.5, ease: 'power2.in' }, 0)
    .to('.cq-vignette', { opacity: 0, duration: 0.6 }, 0);

  /* ── Quotes quote-blocks: stagger reveal ── */
  const qBlocks = gsap.utils.toArray('.quote-block');
  qBlocks.forEach((block, i) => {
    gsap.fromTo(block,
      { opacity: 0, y: 40, filter: 'blur(4px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 80%',
          end:   'top 40%',
          scrub: 0.8,
        }
      }
    );
  });
}

/* ══════════════════════════════════════════════
   2. PARA-RAID GIF CINEMATIC REVEAL
   Parallax-driven battlefield GIF that moves
   on scroll — cinematic film look
══════════════════════════════════════════════ */
function initParaRaidGif() {
  const section = document.getElementById('para-raid');
  if (!section) return;

  /* ── Build GIF layer ── */
  const gifLayer = document.createElement('div');
  gifLayer.id = 'prc-gif-layer';
  gifLayer.innerHTML = `
    <div class="prc-gif-letterbox-top"></div>
    <div class="prc-gif-letterbox-bot"></div>
    <img src="img/86.gif" alt="" class="prc-gif-img" id="prc-gif-img"/>
    <div class="prc-gif-vignette"></div>
    <div class="prc-gif-overlay"></div>
    <div class="prc-gif-grain"></div>
    <div class="prc-gif-scanlines"></div>
    <div class="prc-gif-hud">
      <div class="prc-gif-hud-tl">
        <span class="prc-gif-hud-tag">SPEARHEAD · COMBAT LOG</span>
        <span class="prc-gif-hud-freq">RAID-01 ● LIVE</span>
      </div>
      <div class="prc-gif-hud-br">
        <span class="prc-gif-hud-stat blink">● TRANSMITTING</span>
      </div>
    </div>
  `;
  section.insertBefore(gifLayer, section.firstChild);

  /* ── Initial: hidden, letterbox bars closed ── */
  gsap.set('#prc-gif-layer', { opacity: 0 });
  gsap.set('.prc-gif-letterbox-top', { scaleY: 1, transformOrigin: 'top center' });
  gsap.set('.prc-gif-letterbox-bot', { scaleY: 1, transformOrigin: 'bottom center' });
  gsap.set('.prc-gif-img', { scale: 1.18, y: '8%' });
  gsap.set('.prc-gif-hud', { opacity: 0 });

  /* ── Phase 1: enter — fade in layer, open letterbox ── */
  const enterTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end:   'top 20%',
      scrub: 1.2,
    }
  });

  enterTl
    .to('#prc-gif-layer',           { opacity: 1, duration: 0.4 }, 0)
    .to('.prc-gif-letterbox-top',   { scaleY: 0, duration: 0.7, ease: 'power2.inOut' }, 0.1)
    .to('.prc-gif-letterbox-bot',   { scaleY: 0, duration: 0.7, ease: 'power2.inOut' }, 0.1)
    .to('.prc-gif-img',             { scale: 1, y: '0%', duration: 1, ease: 'power2.out' }, 0.1)
    .to('.prc-gif-hud',             { opacity: 1, duration: 0.3 }, 0.6);

  /* ── Phase 2: parallax — GIF moves as section scrolls ── */
  gsap.to('.prc-gif-img', {
    y: '-12%',
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end:   'bottom top',
      scrub: 1.8,
    }
  });

  /* ── Phase 3: exit — fade out gif, close letterbox ── */
  const exitTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'bottom 60%',
      end:   'bottom top',
      scrub: 1,
    }
  });

  exitTl
    .to('.prc-gif-hud',           { opacity: 0, duration: 0.3 }, 0)
    .to('.prc-gif-letterbox-top', { scaleY: 1, duration: 0.5, ease: 'power2.in' }, 0.1)
    .to('.prc-gif-letterbox-bot', { scaleY: 1, duration: 0.5, ease: 'power2.in' }, 0.1)
    .to('#prc-gif-layer',         { opacity: 0, duration: 0.4 }, 0.45);
}
