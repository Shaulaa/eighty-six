/* ============================================
   atmosphere.js — EIGHTY-SIX
   Section transitions, quote particles, footer stars
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initSectionFog();
  initQuoteAtmosphere();
  initFooterStars();
});

/* ══════════════════════════════════════════
   1. SECTION TRANSITION FOG
   Canvas overlay that changes opacity/color
   as user scrolls between sections
══════════════════════════════════════════ */
function initSectionFog() {
  const canvas = document.createElement('canvas');
  canvas.id = 'atm-fog';
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '8',
    pointerEvents: 'none',
    mixBlendMode:  'multiply',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Section color palette — each section has a fog color */
  const sections = [
    { id: 'hero',       color: [10,  10,  11],  fogMax: 0    },
    { id: 'synopsis',   color: [240, 238, 233], fogMax: 0    },
    { id: 'characters', color: [10,  10,  11],  fogMax: 0    },
    { id: 'quotes',     color: [20,  15,  25],  fogMax: 0.08 },
    { id: 'war',        color: [10,  10,  11],  fogMax: 0    },
    { id: 'para-raid',  color: [6,   6,   8],   fogMax: 0.06 },
    { id: 'reception',  color: [14,  14,  18],  fogMax: 0    },
    { id: 'key-themes', color: [10,  10,  14],  fogMax: 0    },
  ];

  let fogR = 10, fogG = 10, fogB = 11, fogA = 0;
  let tFogR = 10, tFogG = 10, tFogB = 11, tFogA = 0;

  const lerp = (a, b, t) => a + (b - a) * t;

  function getActiveFog() {
    const vh = window.innerHeight;
    const scrollY = window.scrollY;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh * 0.5) {
        return sections[i];
      }
    }
    return sections[0];
  }

  function draw() {
    const active = getActiveFog();
    tFogR = active.color[0];
    tFogG = active.color[1];
    tFogB = active.color[2];
    tFogA = active.fogMax;

    fogR = lerp(fogR, tFogR, 0.03);
    fogG = lerp(fogG, tFogG, 0.03);
    fogB = lerp(fogB, tFogB, 0.03);
    fogA = lerp(fogA, tFogA, 0.03);

    ctx.clearRect(0, 0, W, H);

    if (fogA > 0.001) {
      const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
      grad.addColorStop(0, `rgba(${fogR|0},${fogG|0},${fogB|0},0)`);
      grad.addColorStop(1, `rgba(${fogR|0},${fogG|0},${fogB|0},${fogA})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════
   2. QUOTE SECTION ATMOSPHERE
   Sparkles + floating orbs when quotes visible
══════════════════════════════════════════ */
function initQuoteAtmosphere() {
  const quoteSec = document.querySelector('.quotes');
  if (!quoteSec) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'atm-quote';
  Object.assign(canvas.style, {
    position:      'absolute',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '1',
    pointerEvents: 'none',
  });
  quoteSec.style.position = 'relative';
  quoteSec.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = quoteSec.offsetWidth;
    H = canvas.height = quoteSec.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Sparkles */
  class Sparkle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.size  = Math.random() * 2 + 0.5;
      this.life  = 0;
      this.maxLife = 80 + Math.random() * 120;
      this.speed = Math.random() * 0.3 - 0.15;
      this.vy    = -Math.random() * 0.4 - 0.1;
      this.color = Math.random() > 0.6
        ? `rgba(192,41,43,`
        : `rgba(200,210,255,`;
    }
    update() {
      this.life++;
      this.x += this.speed;
      this.y += this.vy;
      if (this.life > this.maxLife) this.reset();
    }
    draw() {
      const t   = this.life / this.maxLife;
      const op  = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * op, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (op * 0.7) + ')';
      ctx.fill();
    }
  }

  /* Soft light orbs */
  class Orb {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = 30 + Math.random() * 60;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.2;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 200;
      this.color = Math.random() > 0.5
        ? [192, 41,  43]
        : [58,  90, 180];
    }
    update() {
      this.life++;
      this.x += this.vx;
      this.y += this.vy;
      if (this.life > this.maxLife || this.x < -100 || this.x > W + 100) this.reset();
    }
    draw() {
      const t  = this.life / this.maxLife;
      const op = (t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.06;
      const gr = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      gr.addColorStop(0, `rgba(${this.color.join(',')},${op})`);
      gr.addColorStop(1, `rgba(${this.color.join(',')},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();
    }
  }

  const sparkles = Array.from({ length: 40 }, () => new Sparkle());
  const orbs     = Array.from({ length: 6  }, () => new Orb());

  /* Only animate when section is near viewport */
  let active = false;
  const io = new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  io.observe(quoteSec);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (active) {
      sparkles.forEach(s => { s.update(); s.draw(); });
      orbs.forEach(o     => { o.update(); o.draw(); });
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════
   3. FOOTER AMBIENT STARS
══════════════════════════════════════════ */
function initFooterStars() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'atm-footer-stars';
  Object.assign(canvas.style, {
    position:      'absolute',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '0',
    pointerEvents: 'none',
    opacity:       '0.6',
  });
  footer.style.position = 'relative';
  footer.style.overflow = 'hidden';

  // Put canvas before first child
  footer.insertBefore(canvas, footer.firstChild);

  // Make all footer content sit above canvas
  [...footer.children].forEach(child => {
    if (child !== canvas) child.style.position = 'relative';
  });

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = footer.offsetWidth;
    H = canvas.height = footer.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Star {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 4;
      this.r    = Math.random() * 1.2 + 0.2;
      this.op   = Math.random() * 0.5 + 0.1;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.twinkleSpeed  = 0.01 + Math.random() * 0.015;
    }
  }

  const stars = Array.from({ length: 80 }, () => new Star());
  let t = 0;

  function draw() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      const twinkle = Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,255,${Math.max(0, s.op + twinkle)})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}
