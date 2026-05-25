/* Minimal cinematic hero: GSAP + Lenis-friendly ScrollTrigger */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bgMedia = hero.querySelector('.hero-bg-media');
  const main = hero.querySelector('.hero-main');
  const title = hero.querySelector('.hero-title-big');
  const line1 = hero.querySelector('.hero-line-1');
  const line2 = hero.querySelector('.hero-line-2');
  const accent = hero.querySelector('.hero-accent-line');
  const subtitle = hero.querySelector('.hero-subtitle');
  const label = hero.querySelector('.hero-label-min');
  const footer = hero.querySelector('.hero-footer-min');
  const radar = hero.querySelector('.hero-radar');
  const focus = hero.querySelector('.hero-focus');
  const focusRingA = hero.querySelector('.hero-focus-ring-a');
  const focusRingB = hero.querySelector('.hero-focus-ring-b');
  const focusCore = hero.querySelector('.hero-focus-core');
  const iris = hero.querySelector('.hero-iris');
  const redDot = hero.querySelector('.hero-red-dot');
  const bars = hero.querySelectorAll('.hero-cinema-bars span');
  const scrollLine = hero.querySelector('.hero-scroll-line');
  const scrollHint = hero.querySelector('.hero-scroll-hint');

  if (reduceMotion) {
    gsap.set([label, main, footer, scrollHint, focus], { autoAlpha: 1, y: 0, clearProps: 'transform' });
    gsap.set(iris, { autoAlpha: 0 });
    gsap.set(redDot, { autoAlpha: 0 });
    gsap.set(bars, { scaleY: 1 });
    return;
  }

  gsap.set([label, footer, subtitle, scrollHint], { autoAlpha: 0 });
  gsap.set([line1, line2], { yPercent: 108, rotateX: -14, transformOrigin: '50% 50%' });
  gsap.set(accent, { scaleX: 0, autoAlpha: 0 });
  gsap.set(bars, { scaleY: 1 });
  gsap.set(radar, { autoAlpha: 0, scale: 0.92, rotation: -18 });
  gsap.set(focus, { autoAlpha: 0, scale: 0.82, xPercent: -50, yPercent: -50 });
  gsap.set([focusRingA, focusRingB], { scale: 0.72, rotation: -24, transformOrigin: '50% 50%' });
  gsap.set(focusCore, { scale: 0.72, autoAlpha: 0 });
  gsap.set(iris, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 1 });
  gsap.set(redDot, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
  gsap.set(bgMedia, { scale: 1.1, y: 18, filter: 'grayscale(0.58) contrast(1.12) brightness(0.36) saturate(0.62)' });

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .to(bgMedia, {
      scale: 1.04,
      y: 0,
      filter: 'grayscale(0.52) contrast(1.08) brightness(0.46) saturate(0.72)',
      duration: 1.6
    })
    .to(bars, { scaleY: 0, duration: 0.9 }, 0)
    .to(label, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.28)
    .to([line1, line2], {
      yPercent: 0,
      rotateX: 0,
      duration: 1.15,
      stagger: 0.08
    }, 0.38)
    .to(accent, { scaleX: 1, autoAlpha: 1, duration: 0.75 }, 0.92)
    .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.72 }, 1.02)
    .to(footer, { autoAlpha: 1, y: 0, duration: 0.72 }, 1.1)
    .to(radar, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.9 }, 1.1)
    .to(focus, { autoAlpha: 1, scale: 1, duration: 1 }, 0.7)
    .to([focusRingA, focusRingB], { scale: 1, rotation: 0, duration: 1.2, stagger: 0.08 }, 0.72)
    .to(scrollHint, { autoAlpha: 1, duration: 0.6 }, 1.38);

  gsap.to(scrollLine, {
    scaleY: 0.35,
    autoAlpha: 0.45,
    duration: 1.35,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to(radar, {
    rotation: 360,
    duration: 32,
    repeat: -1,
    ease: 'none'
  });

  gsap.to(focusRingA, {
    rotation: 360,
    duration: 26,
    repeat: -1,
    ease: 'none'
  });

  gsap.to(focusRingB, {
    rotation: -360,
    duration: 18,
    repeat: -1,
    ease: 'none'
  });

  const glitchTitle = () => {
    title.classList.add('is-glitching');
    window.setTimeout(() => title.classList.remove('is-glitching'), 760);
  };

  window.setTimeout(glitchTitle, 2200);
  window.setInterval(glitchTitle, 5200);

  const heroScroll = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=145%',
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });

  heroScroll
    .to(bgMedia, { scale: 1.2, yPercent: 7, filter: 'grayscale(0.72) contrast(1.18) brightness(0.34) saturate(0.55)', ease: 'none' }, 0)
    .to(title, { y: -42, scale: 0.88, autoAlpha: 0.28, ease: 'none' }, 0)
    .to(subtitle, { y: 46, autoAlpha: 0, ease: 'none' }, 0)
    .to(accent, { scaleX: 0.18, autoAlpha: 0.45, ease: 'none' }, 0)
    .to(label, { y: -72, autoAlpha: 0, ease: 'none' }, 0)
    .to(footer, { y: 76, autoAlpha: 0, ease: 'none' }, 0)
    .to(radar, { x: 80, y: -110, autoAlpha: 0, scale: 0.7, ease: 'none' }, 0)
    .to(scrollHint, { autoAlpha: 0, y: 34, ease: 'none' }, 0)
    .to(focus, { left: '50%', top: '50%', scale: 1.25, ease: 'none' }, 0)
    .to(bars, { scaleY: 0.92, ease: 'none' }, 0.16)
    .to(focus, { scale: 8.6, autoAlpha: 0.88, ease: 'none' }, 0.32)
    .to(focus, { autoAlpha: 0, ease: 'none' }, 0.58)
    .to(redDot, { autoAlpha: 1, scale: 1, ease: 'none' }, 0.6)
    .to(redDot, { scale: 1.25, ease: 'none' }, 0.66)
    .to(iris, { scale: 1.05, ease: 'none' }, 0.68)
    .to(bgMedia, { scale: 1.38, autoAlpha: 0, ease: 'none' }, 0.68)
    .to(redDot, { autoAlpha: 0, scale: 0.35, ease: 'none' }, 0.8)
    .to(main, { autoAlpha: 0, scale: 0.82, ease: 'none' }, 0.52)
    .to(bars, { scaleY: 1, ease: 'none' }, 0.78);

  const drift = { x: 0, y: 0 };
  const setBgX = gsap.quickSetter(bgMedia, 'x', 'px');
  const setBgY = gsap.quickSetter(bgMedia, 'y', 'px');
  const setMainX = gsap.quickSetter(main, 'x', 'px');
  const setRadarX = gsap.quickSetter(radar, 'x', 'px');
  const setFocusX = gsap.quickSetter(focus, 'x', 'px');

  window.addEventListener('pointermove', (event) => {
    drift.x = (event.clientX / window.innerWidth - 0.5);
    drift.y = (event.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  gsap.ticker.add(() => {
    if (window.scrollY > window.innerHeight * 1.1) return;
    setBgX(drift.x * -18);
    setBgY(drift.y * -10);
    setMainX(drift.x * 8);
    setRadarX(drift.x * 14);
    setFocusX(drift.x * -10);
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
});
