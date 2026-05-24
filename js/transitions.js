/* ============================================
   transitions.js — EIGHTY-SIX
   Cinematic section-to-section transitions
   Spearhead Squadron → Quotes → War → Para-RAID
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  initSpearheadExit();
  initWarToParaRaid();
  initSectionBreaths();
});

/* ══════════════════════════════════════════════
   1. SPEARHEAD SQUADRON — cinematic exit wipe
   war section terakhir (#battlefield-engagement)
   fades out dengan slow zoom + vignette collapse
   lalu masuk ke para-raid dengan glitch flash
══════════════════════════════════════════════ */
function initSpearheadExit() {
  const warSection  = document.getElementById('war');
  const paraSection = document.getElementById('para-raid');
  if (!warSection || !paraSection) return;

  /* ── inject cinematic overlay di atas war section ── */
  const overlay = document.createElement('div');
  overlay.id = 'war-exit-overlay';
  overlay.innerHTML = `
    <div class="weo-vignette"></div>
    <div class="weo-bars">
      <div class="weo-bar weo-bar-top"></div>
      <div class="weo-bar weo-bar-bot"></div>
    </div>
    <div class="weo-static"></div>
    <div class="weo-label">TRANSMISSION INTERRUPTED</div>
  `;
  warSection.appendChild(overlay);

  /* ── inject entry flash di awal para-raid ── */
  const entryFlash = document.createElement('div');
  entryFlash.id = 'pr-entry-flash';
  paraSection.insertBefore(entryFlash, paraSection.firstChild);

  /* Spearhead image — zoom & darken as war exits */
  const spearheadFig = warSection.querySelector('#battlefield-engagement .battlefield-image-frame img');

  /* Timeline scrubbed to war section exit */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: warSection,
      start: 'bottom 80%',
      end: 'bottom top',
      scrub: 1.2,
    }
  });

  /* Bars cinéma letterbox close in */
  gsap.set('.weo-bar-top', { scaleY: 0, transformOrigin: 'top center' });
  gsap.set('.weo-bar-bot', { scaleY: 0, transformOrigin: 'bottom center' });
  gsap.set('.weo-label',   { opacity: 0, y: 8 });
  gsap.set('.weo-static',  { opacity: 0 });

  tl.to('.weo-vignette',  { opacity: 1, duration: 0.5 }, 0)
    .to('.weo-bar-top',   { scaleY: 1, duration: 0.6, ease: 'power2.inOut' }, 0.15)
    .to('.weo-bar-bot',   { scaleY: 1, duration: 0.6, ease: 'power2.inOut' }, 0.15)
    .to('.weo-label',     { opacity: 1, y: 0, duration: 0.4 }, 0.4)
    .to('.weo-static',    { opacity: 1, duration: 0.2 }, 0.6)
    .to('.weo-static',    { opacity: 0, duration: 0.15 }, 0.78);

  if (spearheadFig) {
    tl.to(spearheadFig, { scale: 1.08, filter: 'brightness(0.2) saturate(0)', duration: 1, ease: 'power2.in' }, 0);
  }

  /* Para-raid entry — ScrollTrigger one-shot flash + reveal */
  ScrollTrigger.create({
    trigger: paraSection,
    start: 'top 32%',
    once: true,
    onEnter: () => triggerPrEntryFlash(entryFlash),
  });
}

function triggerPrEntryFlash(el) {
  const flashes = [0, 60, 110, 150, 180];
  flashes.forEach((delay, i) => {
    setTimeout(() => {
      el.classList.add('active');
      setTimeout(() => el.classList.remove('active'), 35 + i * 8);
    }, delay);
  });
  /* final slow pulse */
  setTimeout(() => {
    gsap.to(el, { opacity: 0.18, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.inOut' });
  }, 300);
}

/* ══════════════════════════════════════════════
   2. WAR → PARA-RAID  — fade bridge
   thin widescreen bars stay as para-raid loads
══════════════════════════════════════════════ */
function initWarToParaRaid() {
  const paraSection = document.getElementById('para-raid');
  if (!paraSection) return;

  /* Bars linger at top of para-raid then retract */
  const bars = document.querySelector('.weo-bars');
  if (!bars) return;

  const retractTl = gsap.timeline({
    scrollTrigger: {
      trigger: paraSection,
      start: 'top 36%',
      end:   'top 4%',
      scrub: 1.4,
    }
  });

  retractTl
    .to('.weo-bar-top', { scaleY: 0, duration: 0.5, ease: 'power2.in' }, 0)
    .to('.weo-bar-bot', { scaleY: 0, duration: 0.5, ease: 'power2.in' }, 0)
    .to('.weo-label',   { opacity: 0, duration: 0.3 }, 0)
    .to('.weo-vignette',{ opacity: 0, duration: 0.5 }, 0);
}

/* ══════════════════════════════════════════════
   3. SUBTLE BREATH — all major sections
   gentle opacity pulse as each section enters
   to avoid hard cuts between bg colors
══════════════════════════════════════════════ */
function initSectionBreaths() {
  const sections = ['#quotes', '#war', '#para-raid'];

  sections.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;

    /* inject breath veil */
    const veil = document.createElement('div');
    veil.className = 'section-breath-veil';
    el.insertBefore(veil, el.firstChild);

    gsap.fromTo(veil,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: sel === '#para-raid' ? 'top 42%' : 'top 85%',
          end: sel === '#para-raid' ? 'top 8%' : 'top 30%',
          scrub: 1,
        }
      }
    );
  });
}
