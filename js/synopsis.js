/* ============================================
   synopsis.js — EIGHTY-SIX Cinematic Synopsis
   Two-panel pinned scroll sequence using GSAP
   ScrollTrigger + Lenis integration
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  initSynopsisCinematic();
});

function initSynopsisCinematic() {
  const section   = document.querySelector('.synopsis');
  if (!section) return;

  const mobile    = () => window.innerWidth <= 900;
  const reduceM   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const panelKicker = document.getElementById('syn-panel-kicker');
  const panelMain   = document.getElementById('syn-panel-main');

  if (!panelKicker || !panelMain) return;

  /* ── elements ── */
  const kickerLabel   = panelKicker.querySelector('.syn-kicker-label');
  const kickerNum     = panelKicker.querySelector('.syn-kicker-num');
  const kickerSub     = panelKicker.querySelector('.syn-kicker-sub');
  const kickerSlash   = panelKicker.querySelector('.syn-kicker-slash');
  const kickerLine    = panelKicker.querySelector('.syn-kicker-line');
  const kickerTagline = panelKicker.querySelector('.syn-kicker-tagline');

  const colImg     = panelMain.querySelector('.syn-col-img');
  const portrait   = panelMain.querySelector('.syn-portrait');
  const imgFrame   = panelMain.querySelector('.syn-img-frame');
  const imgBadge   = panelMain.querySelector('.syn-img-badge');
  const imgMeta    = panelMain.querySelector('.syn-img-meta');

  const colText    = panelMain.querySelector('.syn-col-text');
  const sectionLbl = panelMain.querySelector('.syn-section-label');
  const headLines  = panelMain.querySelectorAll('.syn-heading-line');
  const rule       = panelMain.querySelector('.syn-rule');
  const paras      = panelMain.querySelectorAll('.syn-para');
  const tags       = panelMain.querySelectorAll('.syn-tag');
  const credit     = panelMain.querySelector('.syn-credit');

  /* ── reduced motion fallback ── */
  if (reduceM) {
    gsap.set([panelKicker, panelMain], { opacity: 1 });
    return;
  }

  /* ═══════════════════════════════════════════
     PANEL A — KICKER (pinned, enter & exit)
  ═══════════════════════════════════════════ */

  /* Initial states */
  gsap.set(panelKicker, { opacity: 0 });
  gsap.set(kickerLabel, { opacity: 0, y: -14 });
  gsap.set(kickerNum,   { opacity: 0, x: -60, rotationY: -25 });
  gsap.set(kickerSlash, { opacity: 0 });
  gsap.set(kickerSub,   { opacity: 0, x: 30 });
  gsap.set(kickerLine,  { scaleX: 0, transformOrigin: 'center' });
  gsap.set(kickerTagline, { opacity: 0, y: 20 });

  const tlKicker = gsap.timeline({
    scrollTrigger: {
      trigger: panelKicker,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play reverse play reverse',
    }
  });

  tlKicker
    .to(panelKicker, { opacity: 1, duration: 0.01 })
    .to(kickerLabel, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.1)
    .to(kickerNum,   { opacity: 1, x: 0, rotationY: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
    .to(kickerSlash, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.5)
    .to(kickerSub,   { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 0.4)
    .to(kickerLine,  { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.6)
    .to(kickerTagline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.8);

  /* ═══════════════════════════════════════════
     PANEL B — MAIN CONTENT
     Pinned with scrub: stagger image + text in
  ═══════════════════════════════════════════ */

  /* Initial states */
  gsap.set(panelMain, { opacity: 0 });
  gsap.set(imgFrame,  { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 });
  gsap.set(portrait,  { scale: 1.15, filter: 'brightness(0.5) saturate(0.3)' });
  gsap.set(imgBadge,  { opacity: 0, y: 16 });
  gsap.set(imgMeta,   { opacity: 0 });

  gsap.set(sectionLbl, { opacity: 0, x: -20 });
  headLines.forEach((l, i) => gsap.set(l, { opacity: 0, y: 50 + i * 10, skewY: 4 }));
  gsap.set(rule,   { scaleX: 0, transformOrigin: 'left center' });
  paras.forEach(p => gsap.set(p, { opacity: 0, y: 30 }));
  tags.forEach((t, i) => gsap.set(t, { opacity: 0, y: 12, scale: 0.9 }));
  gsap.set(credit, { opacity: 0 });

  /* Pinned scrub timeline */
  const scrollPx = mobile() ? window.innerHeight * 2.5 : window.innerHeight * 3;

  const tlMain = gsap.timeline({
    scrollTrigger: {
      trigger: panelMain,
      pin: true,
      start: 'top top',
      end: `+=${scrollPx}`,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  /* Phase 0 — panel fade in */
  tlMain.to(panelMain, { opacity: 1, duration: 0.3 }, 0);

  /* Phase 1 — image reveals (left to right clip) */
  tlMain
    .to(imgFrame,  {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.1)
    .to(portrait, {
      scale: 1.0,
      filter: 'brightness(0.82) saturate(0.75)',
      duration: 1.0,
      ease: 'power2.out'
    }, 0.2)
    .to(imgBadge, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
    .to(imgMeta,  { opacity: 1, duration: 0.4 }, 0.9);

  /* Phase 2 — section label */
  tlMain.to(sectionLbl, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 0.4);

  /* Phase 3 — heading lines stagger */
  headLines.forEach((l, i) => {
    tlMain.to(l, {
      opacity: 1, y: 0, skewY: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, 0.45 + i * 0.12);
  });

  /* Phase 4 — rule line */
  tlMain.to(rule, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 0.7);

  /* Phase 5 — paragraphs stagger */
  paras.forEach((p, i) => {
    tlMain.to(p, {
      opacity: 1, y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 0.85 + i * 0.18);
  });

  /* Phase 6 — tags stagger */
  tags.forEach((t, i) => {
    tlMain.to(t, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.3,
      ease: 'back.out(1.4)'
    }, 1.4 + i * 0.06);
  });

  /* Phase 7 — credit */
  tlMain.to(credit, { opacity: 1, duration: 0.4 }, 1.8);

  /* ═══════════════════════════════════════════
     PORTRAIT PARALLAX (Lenis-driven)
  ═══════════════════════════════════════════ */
  const updatePortraitParallax = () => {
    if (!portrait) return;
    const rect = imgFrame.getBoundingClientRect();
    const vh   = window.innerHeight;
    const cy   = (rect.top + rect.height / 2 - vh / 2) / vh;
    const drift = mobile() ? cy * 22 : cy * 38;
    gsap.set(portrait, { y: drift });
  };

  if (window.__lenis__) {
    window.__lenis__.on('scroll', updatePortraitParallax);
  }
  window.addEventListener('scroll', updatePortraitParallax, { passive: true });

  /* ═══════════════════════════════════════════
     EXIT — section scrolls out, fade to black
     for seamless transition to characters
  ═══════════════════════════════════════════ */
  gsap.to(section, {
    '--exit-fade': 1,
    scrollTrigger: {
      trigger: section,
      start: 'bottom 60%',
      end: 'bottom top',
      scrub: true,
    }
  });

  /* Refresh on load */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    updatePortraitParallax();
  }, { once: true });
}
