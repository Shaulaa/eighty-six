/* ============================================
   reception-themes.js — EIGHTY-SIX
   GSAP ScrollTrigger cinematic timeline
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    fallbackInit();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  initReceptionCinematic();
  // initKeyThemesCinematic(); -- replaced by timeline
});

/* ══════════════════════════════════
   CRITICAL RECEPTION — cinematic
══════════════════════════════════ */
function initReceptionCinematic() {
  const section = document.getElementById('reception');
  if (!section) return;

  const label     = section.querySelector('.rc-label');
  const title     = section.querySelector('.rc-title');
  const divider   = section.querySelector('.rc-divider');
  const scoreNum  = section.querySelector('.rc-score-num');
  const stars     = section.querySelectorAll('.rc-star');
  const scoreLbl  = section.querySelector('.rc-score-label');
  const scoreQ    = section.querySelector('.rc-score-quote');
  const barRows   = section.querySelectorAll('.rc-bar-row');
  const barFills  = section.querySelectorAll('.rc-bar-fill');

  /* ── Initial states ── */
  gsap.set([label, title, divider], { opacity: 0, y: -18 });
  gsap.set(scoreNum,  { opacity: 0, scale: 0.82, filter: 'blur(14px)' });
  gsap.set(stars,     { opacity: 0, scale: 0, rotation: 45 });
  gsap.set([scoreLbl, scoreQ], { opacity: 0, y: 10 });
  gsap.set(barRows,   { opacity: 0, x: -28 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 72%',
      once: true,
    }
  });

  /* ── 1. Header slide down ── */
  tl.to(label,   { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0)
    .to(title,   { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, 0.12)
    .to(divider, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.28);

  /* ── 2. Score number counter + blur reveal ── */
  tl.to(scoreNum, {
      opacity: 1, scale: 1, filter: 'blur(0px)',
      duration: 0.9, ease: 'expo.out'
    }, 0.55);

  /* Animated counter 0 → 8.1 */
  const scoreTarget = parseFloat(scoreNum.textContent) || 8.1;
  scoreNum.textContent = '0.0';
  tl.to({ val: 0 }, {
    val: scoreTarget,
    duration: 1.1,
    ease: 'power2.out',
    onUpdate: function() {
      scoreNum.textContent = this.targets()[0].val.toFixed(1);
    }
  }, 0.6);

  /* ── 3. Stars pop in ── */
  tl.to(stars, {
      opacity: 0.9, scale: 1,
      stagger: 0.07, duration: 0.35, ease: 'back.out(2)'
    }, 1.2);

  /* ── 4. Score label + quote ── */
  tl.to([scoreLbl, scoreQ], {
      opacity: 1, y: 0,
      stagger: 0.12, duration: 0.45, ease: 'power2.out'
    }, 1.5);

  /* ── 5. Bar rows slide in + fill ── */
  tl.to(barRows, {
      opacity: 1, x: 0,
      stagger: 0.1, duration: 0.5, ease: 'power2.out'
    }, 1.8);

  /* Bar fill after rows visible */
  tl.call(() => {
    barFills.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.val + '%';
      }, i * 110);
    });
  }, [], 2.1);
}

/* ══════════════════════════════════
   KEY THEMES — cinematic timeline
══════════════════════════════════ */
function initKeyThemesCinematic() {
  const section = document.getElementById('key-themes');
  if (!section) return;

  const label   = section.querySelector('.kt-label');
  const title   = section.querySelector('.kt-title');
  const divider = section.querySelector('.kt-divider');
  const tags    = section.querySelectorAll('.kt-tag');
  const cards   = section.querySelectorAll('.kt-card');

  /* ── Initial states ── */
  gsap.set([label, title, divider], { opacity: 0, y: -16 });
  gsap.set(tags,  { opacity: 0, y: 12, scale: 0.92 });
  gsap.set(cards, { opacity: 0, x: -36, filter: 'blur(4px)' });

  /* ── Header timeline ── */
  const tlHead = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      once: true,
    }
  });

  tlHead
    .to(label,   { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, 0)
    .to(title,   { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.1)
    .to(divider, { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, 0.22)
    .to(tags, {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.06, duration: 0.35, ease: 'back.out(1.4)'
      }, 0.38);

  /* ── Cards — diagonal stagger untuk 2×2 grid ── */
  cards.forEach((card, i) => {
    /* Delay diagonal: 0,0 → 0.1 | 0,1 → 0.2 | 1,0 → 0.2 | 1,1 → 0.3 */
    const col = i % 2;
    const row = Math.floor(i / 2);
    const diagonalDelay = (col + row) * 0.12;

    gsap.to(card, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out',
      delay: diagonalDelay,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
    });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 83%',
      once: true,
      onEnter: () => {
        setTimeout(() => card.classList.add('visible'), diagonalDelay * 1000);
      }
    });
  });
}

/* ══ Fallback if GSAP not loaded ══ */
function fallbackInit() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.kt-card').forEach(c => io.observe(c));

  const rcSection = document.getElementById('reception');
  if (rcSection) {
    const barIo = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.rc-bar-fill').forEach(b => {
          b.style.width = b.dataset.val + '%';
        });
        barIo.disconnect();
      }
    }, { threshold: 0.3 });
    barIo.observe(rcSection);
  }
}

/* ══════════════════════════════════════════════
   KEY THEMES TIMELINE — scroll-draw (GSAP)
   Same mechanism as codepen.io/daviderik/full/abExeQJ
   adapted to 86's dark palette + red accent
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  initKeyThemesTimeline();
});

function initKeyThemesTimeline() {
  const root     = document.querySelector('.kt-timeline');
  if (!root) return;

  const inner    = root.querySelector('.kt-timeline__inner');
  const baseLine = root.querySelector('.kt-timeline__line--base');
  const fillLine = root.querySelector('.kt-timeline__line--fill');
  const items    = Array.from(root.querySelectorAll('.kt-timeline__item'));
  if (!inner || !baseLine || !fillLine || !items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─ helpers ─ */
  const clamp = (n,a,b) => Math.max(a, Math.min(b, n));

  function dotCY(dotEl) {
    const r = dotEl.getBoundingClientRect();
    return r.top + r.height/2 + window.scrollY;
  }

  function setLineSpan() {
    const dots = items.map(i => i.querySelector('.kt-timeline__dot')).filter(Boolean);
    if (dots.length < 2) return null;
    const firstY = dotCY(dots[0]);
    const lastY  = dotCY(dots[dots.length-1]);
    const innerTop = inner.getBoundingClientRect().top + window.scrollY;
    inner.style.setProperty('--kt-line-top', Math.max(0, firstY - innerTop) + 'px');
    inner.style.setProperty('--kt-line-h',   Math.max(1, lastY - firstY)    + 'px');
    return { firstY, lastY, dots };
  }

  function vcY() { return window.scrollY + window.innerHeight/2; }

  function getProgress(firstY, lastY) {
    return clamp((vcY() - firstY) / (lastY - firstY || 1), 0, 1);
  }

  let fillST = null;

  function build() {
    /* kill previous */
    ScrollTrigger.getAll()
      .filter(t => t.vars?.id?.startsWith('kt-'))
      .forEach(t => t.kill());

    const bounds = setLineSpan();
    if (!bounds) return;
    const { firstY, lastY, dots } = bounds;
    const firstDot = dots[0];
    const lastDot  = dots[dots.length-1];

    /* ── Initial states ── */
    const dotBases = Array.from(root.querySelectorAll('.kt-timeline__dotBase'));
    const dotFills = Array.from(root.querySelectorAll('.kt-timeline__dotFill'));

    gsap.set(dotBases, { opacity: 0, scale: 0.85, transformOrigin: 'center' });
    gsap.set(baseLine, { opacity: 1, scaleY: 0, transformOrigin: 'top' });
    gsap.set(fillLine, { opacity: 0, scaleY: 0, transformOrigin: 'top' });
    gsap.set(dotFills, { opacity: 0, scale: 0, transformOrigin: 'center' });
    items.forEach((item, idx) => {
      const dotFill = item.querySelector('.kt-timeline__dotFill');
      const cont    = item.querySelector('.kt-timeline__col--content');
      const media   = item.querySelector('.kt-timeline__col--media');
      if (dotFill) gsap.set(dotFill, { scale: 0, transformOrigin: 'center' });
      if (cont)    gsap.set(cont,    { opacity: 0, y: 18 });
      if (media)   gsap.set(media,   { opacity: 0, y: 22 });

      if (reduceMotion) return;

      const dot = item.querySelector('.kt-timeline__dot');
      if (!dot) return;

      const revealTl = gsap.timeline({
        scrollTrigger: {
          id: `kt-item-${idx}`,
          trigger: dot,
          start: 'center center',
          toggleActions: 'play none none reverse',
        }
      });
      if (dotFill) revealTl.to(dotFill, { scale: 1, duration: 0.22, ease: 'power2.out' }, 0);
      if (cont)    revealTl.to(cont,    { opacity: 1, y: 0, duration: 0.34, ease: 'power2.out' }, 0.08);
      if (media)   revealTl.to(media,   { opacity: 1, y: 0, duration: 0.34, ease: 'power2.out' }, 0.16);
    });

    /* ── Scrubbed fill line ── */
    if (!reduceMotion) {
      gsap.set(fillLine, { scaleY: 0, transformOrigin: 'top' });
      fillST = ScrollTrigger.create({
        id: 'kt-fill',
        trigger: firstDot,
        start: 'center center',
        endTrigger: lastDot,
        end: 'center center',
        scrub: true,
        onUpdate(self) { gsap.set(fillLine, { scaleY: self.progress }); }
      });
      fillST.disable();
    }

    /* ── Release no-flash guard ── */
    root.classList.add('is-ready');

    if (reduceMotion) {
      gsap.set(dotBases, { opacity: 1, scale: 1 });
      gsap.set(baseLine, { scaleY: 1 });
      gsap.set(fillLine, { opacity: 1, scaleY: getProgress(firstY, lastY) });
      gsap.set(dotFills, { opacity: 1, scale: 1 });
      items.forEach((item) => {
        const cont  = item.querySelector('.kt-timeline__col--content');
        const media = item.querySelector('.kt-timeline__col--media');
        if (cont)  gsap.set(cont,  { opacity: 1, y: 0 });
        if (media) gsap.set(media, { opacity: 1, y: 0 });
      });
      if (fillST) fillST.enable();
      return;
    }

    /* ── Intro animation — muted draw then live reveal ── */
    const targetProgress = getProgress(firstY, lastY);

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(dotBases, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.06 }, 0)
      .to(baseLine, { scaleY: 1, duration: 3.2, ease: 'none' }, 0.1)
      /* bring live layer in */
      .add(() => {
        gsap.set(fillLine, { scaleY: 0 });
      }, 0.65)
      .to(fillLine, { opacity: 1, duration: 0.1, ease: 'power1.out' }, 0.65)
      .to(dotFills, { opacity: 1, duration: 0.1, ease: 'power1.out' }, 0.65)
      /* grow fill to current scroll pos */
      .to(fillLine, { scaleY: targetProgress, duration: 0.45, ease: 'power2.out' }, 0.67)
      /* hand off to ScrollTrigger */
      .add(() => {
        /* snap already-passed items */
        items.forEach((item) => {
          const dot = item.querySelector('.kt-timeline__dot');
          if (!dot) return;
          const y = dotCY(dot);
          const passed = y <= vcY() + 0.5;
          const dF = item.querySelector('.kt-timeline__dotFill');
          const cont = item.querySelector('.kt-timeline__col--content');
          const media = item.querySelector('.kt-timeline__col--media');
          if (dF) gsap.set(dF, { scale: passed ? 1 : 0 });
          if (cont) gsap.set(cont, { opacity: passed ? 1 : 0, y: passed ? 0 : 18 });
          if (media) gsap.set(media, { opacity: passed ? 1 : 0, y: passed ? 0 : 22 });
        });
        if (fillST) { fillST.enable(); fillST.refresh(); }
        ScrollTrigger.refresh();
      }, 1.2);
  }

  /* ── Rebuild on resize ── */
  let raf = 0;
  function rebuildSoon() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      build();
      ScrollTrigger.refresh();
      requestAnimationFrame(() => { setLineSpan(); ScrollTrigger.refresh(); });
    });
  }

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(rebuildSoon);
    ro.observe(root);
    items.forEach(item => ro.observe(item));
  }

  window.addEventListener('load',   rebuildSoon, { passive: true });
  window.addEventListener('resize', rebuildSoon, { passive: true });
  requestAnimationFrame(rebuildSoon);
}
