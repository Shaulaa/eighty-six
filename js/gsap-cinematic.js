/* ============================================
   gsap-cinematic.js - focused ScrollTrigger layer
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  initQuotesCinematic(reduceMotion);
  initBattlefieldLateralScroll(reduceMotion);

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
});

/* ============================================================
   QUOTES CINEMATIC — pin section, show quotes 1-by-1,
   bg "86" 3D parallax on scrub, zoom-out blank at end
   ============================================================ */
function initQuotesCinematic(reduceMotion) {
  const section = document.querySelector('.quotes');
  if (!section) return;

  const blocks = gsap.utils.toArray('.quote-block', section);
  if (!blocks.length) return;

  /* ── Mark section as cinematic ── */
  section.classList.add('quotes-scroll-cinematic');

  /* ── Build DOM layers ── */
  const inner = section.querySelector('.quotes-inner');

  /* Cinema layer (bg) */
  const cinemaLayer = document.createElement('div');
  cinemaLayer.className = 'quotes-cinema-layer';
  section.insertBefore(cinemaLayer, inner);

  /* Giant "86" 3D text */
  const bg86 = document.createElement('div');
  bg86.className = 'quotes-bg-86';
  bg86.textContent = '86';
  cinemaLayer.appendChild(bg86);

  /* Orbit rings */
  const orbit = document.createElement('div');
  orbit.className = 'quotes-orbit';
  orbit.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);';
  cinemaLayer.appendChild(orbit);

  const orbitB = document.createElement('div');
  orbitB.className = 'quotes-orbit quotes-orbit-b';
  orbitB.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);';
  cinemaLayer.appendChild(orbitB);

  /* Sweep light */
  const sweep = document.createElement('div');
  sweep.className = 'quotes-sweep';
  cinemaLayer.appendChild(sweep);

  /* Counter (01 / 03) */
  const counter = document.createElement('div');
  counter.className = 'quotes-counter';
  counter.innerHTML = `<span class="quotes-counter-current">01</span><span>/</span><span>${String(blocks.length).padStart(2,'0')}</span>`;
  section.appendChild(counter);

  /* Progress bar */
  const progress = document.createElement('div');
  progress.className = 'quotes-progress';
  progress.innerHTML = '<span></span>';
  section.appendChild(progress);

  /* ── Stagger: 3 beats per quote + 2 beats exit/blank ── */
  const BEATS_PER_QUOTE = 3;   // enter, hold, exit
  const BEATS_BLANK     = 2;   // zoom-out blank pause
  const BEATS_LINGER    = 1;   // extra pause before release
  const totalBeats = blocks.length * BEATS_PER_QUOTE + BEATS_BLANK + BEATS_LINGER;
  const scrollDist = `+=${window.innerHeight * totalBeats}`;

  /* ── Initial states ── */
  gsap.set(blocks, { opacity: 0, y: 60, filter: 'blur(6px)' });
  gsap.set(bg86, {
    xPercent: -50,
    yPercent: -50,
    rotationY: -12,
    rotationX: 8,
    z: -120,
    opacity: 0.09,
    scale: 1,
  });
  gsap.set(orbit,  { opacity: 0, rotation: 0 });
  gsap.set(orbitB, { opacity: 0, rotation: 0 });
  gsap.set(sweep,  { opacity: 0, x: '-100%' });
  gsap.set(counter, { opacity: 0, y: -12 });
  gsap.set(progress, { opacity: 0 });
  gsap.set(progress.querySelector('span'), { scaleX: 0, transformOrigin: 'left center' });

  /* ── Master timeline ── */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: scrollDist,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  /* --- INTRO: fade in orbits & sweep --- */
  tl.to(orbit,  { opacity: 0.9, duration: 0.4 }, 0)
    .to(orbitB, { opacity: 0.6, duration: 0.4 }, 0)
    .to(sweep,  { opacity: 1, x: '0%', duration: 0.5 }, 0)
    .to(counter, { opacity: 1, y: 0, duration: 0.3 }, 0)
    .to(progress, { opacity: 1, duration: 0.3 }, 0);

  /* --- Per-quote steps --- */
  blocks.forEach((block, i) => {
    const start = 0.5 + i * BEATS_PER_QUOTE;
    const enterEnd = start + 0.6;
    const holdEnd  = start + BEATS_PER_QUOTE - 0.5;
    const exitEnd  = start + BEATS_PER_QUOTE;
    const progressVal = (i + 1) / blocks.length;
    const counterNum  = String(i + 1).padStart(2, '0');

    /* BG-86 3D drift per quote */
    const rotY  = -12 + i * 8;
    const rotX  = 8  - i * 3;
    const bgZ   = -120 + i * 30;
    const bgOp  = 0.09 + i * 0.02;
    const bgScale = 1 + i * 0.06;

    /* Enter quote */
    tl.to(block, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 }, start)
      .to(bg86,  { rotationY: rotY, rotationX: rotX, z: bgZ, opacity: bgOp, scale: bgScale, duration: BEATS_PER_QUOTE * 0.9, ease: 'none' }, start)
      .to(orbit, { rotation: `+=${45 + i * 15}`, duration: BEATS_PER_QUOTE, ease: 'none' }, start)
      .to(orbitB,{ rotation: `-=${30 + i * 10}`, duration: BEATS_PER_QUOTE, ease: 'none' }, start)
      .to(sweep, { x: '200%', duration: 0.7, ease: 'power2.in' }, start);

    /* Update counter */
    tl.add(() => {
      const cur = counter.querySelector('.quotes-counter-current');
      if (cur) cur.textContent = counterNum;
    }, enterEnd);

    /* Progress bar fill */
    tl.to(progress.querySelector('span'), {
      scaleX: progressVal, duration: BEATS_PER_QUOTE - 0.5, ease: 'none'
    }, start);

    /* Sweep reset for next */
    if (i < blocks.length - 1) {
      tl.set(sweep, { x: '-100%' }, exitEnd - 0.1)
        .to(sweep, { opacity: 1, x: '0%', duration: 0 }, exitEnd - 0.1);
    }

    /* Exit quote */
    tl.to(block, { opacity: 0, y: -50, filter: 'blur(4px)', duration: 0.4 }, holdEnd);
  });

  /* --- ZOOM-OUT BLANK: bg86 rushes toward camera then fades --- */
  const blankStart = 0.5 + blocks.length * BEATS_PER_QUOTE;

  tl.to(orbit,    { opacity: 0, scale: 0.5, duration: 0.4 }, blankStart)
    .to(orbitB,   { opacity: 0, scale: 0.5, duration: 0.4 }, blankStart)
    .to(sweep,    { opacity: 0, duration: 0.3 }, blankStart)
    .to(counter,  { opacity: 0, y: -12, duration: 0.3 }, blankStart)
    .to(progress, { opacity: 0, duration: 0.3 }, blankStart)

    /* 86 zooms forward — fake 3D rush */
    .to(bg86, {
      scale: 3.5,
      z: 400,
      rotationY: 0,
      rotationX: 0,
      opacity: 0.22,
      duration: 0.8,
      ease: 'power2.in'
    }, blankStart)

    /* Whiteout then black */
    .to(cinemaLayer, {
      backgroundColor: 'rgba(255,255,255,0.0)',
      duration: 0.1
    }, blankStart + 0.6)

    /* Fade everything to pure black */
    .to(bg86, {
      opacity: 0,
      scale: 6,
      duration: 0.4,
      ease: 'power3.in'
    }, blankStart + 0.7)
    .to(cinemaLayer, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    }, blankStart + 0.8);
}


/* ============================================================
   BATTLEFIELD LATERAL SCROLL
   ============================================================ */
function initBattlefieldLateralScroll(reduceMotion) {
  const section = document.querySelector('#war.battlefield-lateral');
  if (!section) return;

  const panels = gsap.utils.toArray('#war .battlefield-vertical-section');
  if (!panels.length) return;

  section.classList.add('battlefield-lateral-active');
  section.classList.remove('war-scroll-cinematic');
  section.querySelectorAll('.bf-film-layer, .bf-target, .bf-cinema-layer').forEach((element) => element.remove());

  if (reduceMotion || window.innerWidth <= 900) {
    gsap.set('#war .battlefield-large-child', { clearProps: 'transform' });
    return;
  }

  panels.forEach((panel) => {
    const large = panel.querySelector('.battlefield-large-child');
    if (!large) return;

    const getOffset = () => {
      const panelPadding = Math.round(window.innerHeight * 0.14);
      return Math.min(0, window.innerHeight - large.scrollHeight - panelPadding);
    };

    const getDistance = () => {
      const travel = Math.abs(getOffset());
      return Math.max(window.innerHeight, travel + Math.round(window.innerHeight * 0.58));
    };

    gsap.set(large, {
      y: 0,
      force3D: true,
      willChange: 'transform'
    });

    gsap.to(large, {
      y: getOffset,
      ease: 'none',
      scrollTrigger: {
        trigger: panel,
        pin: true,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
  });
}
