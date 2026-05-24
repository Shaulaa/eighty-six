(function() {
  function setup() {
    const war = document.querySelector('.war.battlefield-lateral');
    const wrap = document.getElementById('prc-scene-wrap');
    if (!war || !wrap) return;

    const overlay = document.createElement('div');
    overlay.id = 'section-transition-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;z-index:999;pointer-events:none;background:#060608;opacity:0;';
    wrap.appendChild(overlay);

    function onScroll(scroll) {
      const bot = war.offsetTop + war.offsetHeight;
      const vh  = window.innerHeight;
      const fadeStart = bot - vh * 0.28;
      const fadeEnd   = bot + vh * 0.08;
      const fadeOut   = fadeEnd + vh * 0.55;

      let opacity = 0;
      if (scroll >= fadeStart && scroll <= fadeEnd) {
        opacity = Math.min(0.95, (scroll - fadeStart) / (fadeEnd - fadeStart));
      } else if (scroll > fadeEnd && scroll <= fadeOut) {
        opacity = Math.max(0, 0.95 * (1 - (scroll - fadeEnd) / (fadeOut - fadeEnd)));
      }
      overlay.style.opacity = opacity;
    }

    if (window.__lenis__) {
      window.__lenis__.on('scroll', ({ scroll }) => onScroll(scroll));
    }
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }

  function waitForWrap() {
    if (document.getElementById('prc-scene-wrap')) {
      setup();
    } else {
      setTimeout(waitForWrap, 100);
    }
  }

  if (document.readyState === 'complete') waitForWrap();
  else window.addEventListener('load', waitForWrap);
})();
