/* ============================================
   section-parallax.js - reception/footer parallax
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initReceptionFooterParallax();
});

function initReceptionFooterParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const scene = document.getElementById('reception-footer-scene');
  if (!scene) return;

  gsap.registerPlugin(ScrollTrigger);
  createNightStars(scene);

  const layers = gsap.utils.toArray(scene.querySelectorAll('.rf-parallax-bg'));
  const clouds = gsap.utils.toArray(scene.querySelectorAll('.rf-cloud, .rf-haze'));
  const butterflies = gsap.utils.toArray(scene.querySelectorAll('.rf-butterfly'));
  /* footer-specific clouds are direct children of scene, not inside a parallax-bg */
  const footerClouds = gsap.utils.toArray(scene.querySelectorAll('.rf-footer-cloud'));
  const ground = scene.querySelector('.rf-ground');

  if (!layers.length) return;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars?.id?.startsWith('reception-footer-parallax')) {
      trigger.kill();
    }
  });
  gsap.killTweensOf([...layers, ...clouds, ...butterflies, ground].filter(Boolean));

  const layerSetters = layers.map((layer) => ({
    node: layer,
    y: gsap.quickSetter(layer, 'y', 'px')
  }));
  const cloudSetters = clouds.map((cloud, index) => ({
    node: cloud,
    x: gsap.quickSetter(cloud, 'x', 'px'),
    y: gsap.quickSetter(cloud, 'y', 'px'),
    direction: index % 2 === 0 ? 1 : -1,
    depth: cloud.classList.contains('rf-haze') ? 0.62 : 1
  }));
  const groundScale = ground ? gsap.quickSetter(ground, 'scale') : null;
  const getSceneProgress = () => {
    const rect = scene.getBoundingClientRect();
    const total = rect.height + window.innerHeight;
    return gsap.utils.clamp(0, 1, (window.innerHeight - rect.top) / total);
  };
  const renderParallax = () => {
    const progress = getSceneProgress();
    const layerTravel = Math.max(window.innerHeight * 0.95, scene.offsetHeight * 0.22);

    layerSetters.forEach(({ node, y }) => {
      const speed = Number.parseFloat(node.dataset.speed || '0');
      y(-progress * layerTravel * speed);
    });

    cloudSetters.forEach(({ x, y, direction, depth }, index) => {
      x(progress * direction * 90 * depth);
      y(-progress * (105 + (index % 3) * 28) * depth);
    });

    /* footer clouds drift gently side to side */
    footerClouds.forEach((cloud, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      gsap.set(cloud, { x: progress * dir * 55, y: -progress * 35 });
    });

    if (groundScale) {
      groundScale(1 + progress * 0.035);
    }
  };

  gsap.set(layers, { xPercent: -50, y: 0, force3D: true, willChange: 'transform' });
  gsap.set(clouds, { x: 0, y: 0, force3D: true, willChange: 'transform' });
  if (ground) gsap.set(ground, { y: 0, scale: 1, force3D: true, willChange: 'transform' });

  ScrollTrigger.create({
    id: 'reception-footer-parallax-layers',
    trigger: scene,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
    invalidateOnRefresh: true,
    refreshPriority: 70,
    onEnter: renderParallax,
    onEnterBack: renderParallax,
    onUpdate: renderParallax,
    onRefresh: renderParallax
  });
  gsap.ticker.remove(renderParallax);
  gsap.ticker.add(renderParallax);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    butterflies.forEach((butterfly, index) => {
      const driftX = [-34, 28, -22][index % 3];
      const driftY = [-48, -34, -60][index % 3];
      const rotation = [12, -16, 10][index % 3];
      const baseRotation = [-11, 7, -17][index % 3];
      const scale = [1, 0.72, 0.92][index % 3];

      gsap.set(butterfly, {
        rotate: baseRotation,
        scale,
        transformOrigin: '50% 50%'
      });

      gsap.to(butterfly, {
        x: `+=${driftX}`,
        y: `+=${driftY}`,
        rotate: `+=${rotation}`,
        duration: [4.8, 6.2, 5.4][index % 3],
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.22
      });
    });
  }

  /* Footer butterflies — drift animation */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const footerBflies = scene.querySelectorAll('.rf-butterfly-4, .rf-butterfly-5');
    footerBflies.forEach((butterfly, index) => {
      const driftX = [-26, 32][index % 2];
      const driftY = [-38, -28][index % 2];
      const rotation = [-14, 18][index % 2];
      const baseRotation = [8, -12][index % 2];
      const scale = [0.95, 0.82][index % 2];

      gsap.set(butterfly, { rotate: baseRotation, scale, transformOrigin: '50% 50%' });
      gsap.to(butterfly, {
        x: `+=${driftX}`,
        y: `+=${driftY}`,
        rotate: `+=${rotation}`,
        duration: [5.6, 4.2][index % 2],
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.7 + 1.4
      });
    });
  }

  /* ── Footer reveal: slides up from behind ground as scene scrolls ── */
  const footer = scene.querySelector('.site-footer');
  const groundEl = scene.querySelector('.rf-ground');

  if (footer && groundEl) {
    gsap.set(footer, { y: 0, opacity: 1 });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function createNightStars(scene) {
  const starLayer = scene.querySelector('.rf-stars');
  if (!starLayer || starLayer.dataset.ready === 'true') return;

  const stars = [
    [8, 10, 1.6, 4.8, -0.7], [18, 22, 1.2, 6.2, -2.1],
    [31, 13, 1.9, 5.3, -1.3], [44, 26, 1.1, 7.4, -3.8],
    [58, 9, 1.5, 4.1, -0.2], [72, 18, 1.3, 6.8, -4.4],
    [86, 33, 1.8, 5.9, -2.9], [12, 42, 1.1, 8.1, -5.2],
    [26, 56, 1.4, 4.6, -1.9], [39, 48, 1.0, 6.5, -0.9],
    [53, 62, 1.7, 7.2, -3.1], [67, 44, 1.2, 5.1, -2.4],
    [80, 58, 1.5, 6.9, -4.8], [91, 70, 1.0, 8.6, -6.0],
    [15, 76, 1.3, 5.6, -1.1], [34, 82, 1.1, 7.8, -5.7],
    [49, 74, 1.6, 4.9, -0.4], [63, 86, 1.0, 6.1, -2.6],
    [77, 80, 1.4, 5.7, -3.6], [88, 90, 1.2, 7.0, -4.1],
    [22, 7, 1.0, 8.4, -6.4], [94, 14, 1.3, 5.4, -1.6]
  ];

  const fragment = document.createDocumentFragment();
  stars.forEach(([x, y, size, duration, delay], index) => {
    const star = document.createElement('span');
    star.className = 'rf-star';
    star.style.setProperty('--star-x', `${x}%`);
    star.style.setProperty('--star-y', `${y}%`);
    star.style.setProperty('--star-size', `${size}px`);
    star.style.setProperty('--star-duration', `${duration}s`);
    star.style.setProperty('--star-delay', `${delay}s`);
    star.style.setProperty('--star-min', index % 3 === 0 ? '0.12' : '0.2');
    star.style.setProperty('--star-max', index % 4 === 0 ? '0.98' : '0.74');
    star.style.setProperty('--star-scale', index % 5 === 0 ? '1.2' : '1');
    fragment.appendChild(star);
  });

  starLayer.appendChild(fragment);
  starLayer.dataset.ready = 'true';
}
