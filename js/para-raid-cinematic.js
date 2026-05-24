/* ============================================
   para-raid-cinematic.js — EIGHTY-SIX
   Full scroll-driven cinematic Para-RAID
   4 pinned scenes: Title → Neural → Intercept → Final
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  setTimeout(initParaRaidCinematic, 100);
});

function initParaRaidCinematic() {
  const section = document.getElementById('para-raid');
  if (!section) return;

  const mobile = window.innerWidth <= 768;

  /* Hide original inner content on desktop */
  const prInner = section.querySelector('.pr-inner');
  if (prInner && !mobile) prInner.style.display = 'none';

  buildCinematicDOM(section);

  if (!mobile) {
    initScrollSequence(section);
  } else {
    /* Mobile: just show title + static content */
    if (prInner) prInner.style.display = '';
  }

  startNeuralFilmCanvas();
  startECGFilmCanvas();
  initVideoAmbient();

}



/* ══════════════════════════════════════════════
   BUILD CINEMATIC DOM
══════════════════════════════════════════════ */
function buildCinematicDOM(section) {
  /* Film grain */
  const grain = document.createElement('div');
  grain.className = 'prc-grain';

  /* Letterbox bars */
  const lbox = document.createElement('div');
  lbox.className = 'prc-letterbox';
  lbox.innerHTML = '<div class="prc-lbox-top"></div><div class="prc-lbox-bot"></div>';

  /* Scene wrap */
  const sceneWrap = document.createElement('div');
  sceneWrap.id = 'prc-scene-wrap';
  sceneWrap.innerHTML = `

    <!-- SCENE 0: cinematic title card -->
    <div class="prc-scene prc-scene-active" id="prc-s0">
      <div class="prc-s0-bg"></div>
      <div class="prc-s0-grid"></div>
      <div class="prc-title-card">
        <div class="prc-tc-overline">
          <span class="prc-tc-dash"></span>
          CLASSIFIED · REPUBLIC MILITARY · HANDLER DIVISION
          <span class="prc-tc-dash"></span>
        </div>
        <div class="prc-tc-title">PARA<span class="prc-tc-dot">·</span>RAID</div>
        <div class="prc-tc-sub">NEURAL SYNCHRONIZATION SYSTEM</div>
        <div class="prc-tc-line"></div>
        <div class="prc-tc-desc">Long-range communication device that connects<br>the minds of Handler and Processor across the front line.</div>
        <div class="prc-tc-scroll-hint">
          <span class="prc-scroll-arrow">↓</span>
          SCROLL TO INITIALIZE
        </div>
      </div>
      <div class="prc-s0-corner prc-s0-tl"></div>
      <div class="prc-s0-corner prc-s0-tr"></div>
      <div class="prc-s0-corner prc-s0-bl"></div>
      <div class="prc-s0-corner prc-s0-br"></div>
      <div class="prc-s0-radar-hint">
        <canvas id="prc-mini-radar"></canvas>
      </div>
    </div>

    <!-- SCENE 1: Video battlefield + neural map -->
    <div class="prc-scene" id="prc-s1">
      <div class="prc-s1-gif-wrap" id="prc-vid-wrap">
        <video
          id="prc-vid-main"
          class="prc-s1-gif"
          src="img/86-web.mp4"
          muted
          playsinline
          autoplay
          loop
          preload="auto"
          webkit-playsinline
        ></video>
        <div class="prc-s1-gif-vignette" id="prc-vid-vignette"></div>
        <div class="prc-s1-gif-scanlines"></div>
        <div class="prc-vid-noise" id="prc-vid-noise"></div>
        <div class="prc-vid-chromatic" id="prc-vid-chromatic"></div>
      </div>
      <div class="prc-s1-hud-tl">
        <div class="prc-s1-hud-tag">SPEARHEAD · COMBAT FEED</div>
        <div class="prc-s1-hud-freq">FREQ 44.7 MHz <span class="prc-blink">● LIVE</span></div>
      </div>
      <canvas id="prc-neural-film" class="prc-neural-film-canvas"></canvas>
      <div class="prc-film-text prc-ft-left">
        <div class="prc-ft-label">NEURAL NETWORK</div>
        <div class="prc-ft-heading">Six Voices.<br>One Signal.</div>
        <div class="prc-ft-body">Spearhead Squadron — enam Processor<br>terhubung melintasi medan perang.<br>Para-RAID membawa suara mereka.</div>
      </div>
      <div class="prc-scan-line"></div>
    </div>

    <!-- SCENE 2: transmission intercept -->
    <div class="prc-scene" id="prc-s2">
      <div class="prc-s2-bg-layer"></div>
      <div class="prc-s2-lines-bg"></div>
      <div class="prc-intercept-wrap">
        <div class="prc-intercept-header">
          <span class="prc-ih-tag">⬛ LIVE INTERCEPT</span>
          <span class="prc-ih-freq">FREQ · 44.7 MHz</span>
          <span class="prc-ih-status prc-blink">● REC</span>
        </div>
        <div class="prc-intercept-msgs" id="prc-msgs"></div>
        <div class="prc-s2-ecg-wrap">
          <div class="prc-s2-ecg-label">NEURAL PULSE — SPEARHEAD SQUADRON</div>
          <canvas id="prc-ecg-film" class="prc-ecg-film"></canvas>
        </div>
      </div>
    </div>

    <!-- SCENE 3: final frame -->
    <div class="prc-scene" id="prc-s3">
      <div class="prc-s3-bg-layer" id="prc-s3-bg"></div>
      <div class="prc-s3-overlay"></div>
      <div class="prc-s3-lbars">
        <div class="prc-s3-lbar-t"></div>
        <div class="prc-s3-lbar-b"></div>
      </div>
      <div class="prc-final-content">
        <div class="prc-final-kicker">— UNDERTAKER · FINAL TRANSMISSION —</div>
        <div class="prc-final-quote">
          "We are not tools of the government,<br>
          or anyone else. Fighting was the only<br>
          thing — <em>the only thing</em> — I was good at."
        </div>
        <div class="prc-final-attr">SHINEI NOUZEN · SPEARHEAD SQUADRON</div>
        <div class="prc-final-line"></div>
      </div>
    </div>

  `;

  const prInner = section.querySelector('.pr-inner');
  if (prInner) {
    section.insertBefore(sceneWrap, prInner);
  } else {
    section.appendChild(sceneWrap);
  }

  /* Insert grain and letterbox INSIDE sceneWrap so they move with the pin */
  sceneWrap.insertBefore(lbox,  sceneWrap.firstChild);
  sceneWrap.insertBefore(grain, sceneWrap.firstChild);

  /* Start mini radar on title card */
  setTimeout(startMiniRadar, 50);
}

/* ══════════════════════════════════════════════
   SCROLL SEQUENCE — pinned, 5 beats × 100vh
══════════════════════════════════════════════ */
function initScrollSequence(section) {
  const wrap    = document.getElementById('prc-scene-wrap');
  const s0      = document.getElementById('prc-s0');
  const s1      = document.getElementById('prc-s1');
  const s2      = document.getElementById('prc-s2');
  const s3      = document.getElementById('prc-s3');
  const lboxTop = document.querySelector('.prc-lbox-top');
  const lboxBot = document.querySelector('.prc-lbox-bot');

  if (!wrap || !s0 || !s1 || !s2 || !s3) return;

  /* Set section tall enough for scroll beats */
  const BEATS = 7;
  section.style.height    = `${BEATS * 100}vh`;
  section.style.minHeight = 'unset';
  section.style.overflow  = 'visible';

  /* scene wrap: relative, sized explicitly */
  wrap.style.position = 'relative';
  wrap.style.width    = '100%';
  wrap.style.height   = '100vh';
  wrap.style.zIndex   = '15';
  gsap.set(wrap, { autoAlpha: 0 });

  /* All scenes off except s0 */
  [s1, s2, s3].forEach(s => gsap.set(s, { opacity: 0, pointerEvents: 'none' }));

  /* ── Delay title reveal until Para-RAID reaches the handoff point ── */
  gsap.to(wrap, {
    autoAlpha: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top 42%',
      end: 'top 8%',
      scrub: 1.2,
      invalidateOnRefresh: true,
    }
  });

  /* ── Intro: title card elements animate in on first enter ── */
  const tlIntro = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 28%',
      once: true,
    }
  });

  gsap.set('.prc-tc-overline',    { opacity: 0, y: -14 });
  gsap.set('.prc-tc-title',       { opacity: 0, scale: 1.1, filter: 'blur(12px)' });
  gsap.set('.prc-tc-sub',         { opacity: 0 });
  gsap.set('.prc-tc-line',        { scaleX: 0, transformOrigin: 'center' });
  gsap.set('.prc-tc-desc',        { opacity: 0, y: 14 });
  gsap.set('.prc-tc-scroll-hint', { opacity: 0 });
  gsap.set('.prc-s0-corner',      { opacity: 0, scale: 0.6 });

  tlIntro
    .to('.prc-s0-corner',       { opacity: 1, scale: 1, duration: 0.65, stagger: 0.1, ease: 'back.out(1.5)' }, 0)
    .to('.prc-tc-overline',     { opacity: 1, y: 0,     duration: 0.65, ease: 'power2.out' }, 0.22)
    .to('.prc-tc-title',        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.15, ease: 'power3.out' }, 0.48)
    .to('.prc-tc-sub',          { opacity: 1,            duration: 0.5 }, 1.08)
    .to('.prc-tc-line',         { scaleX: 1,             duration: 0.7, ease: 'power2.inOut' }, 1.18)
    .to('.prc-tc-desc',         { opacity: 1, y: 0,     duration: 0.55 }, 1.42)
    .to('.prc-tc-scroll-hint',  { opacity: 1,            duration: 0.55 }, 1.82);

  /* ── Main pinned timeline ── */
  const master = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: wrap,
      pinSpacing: false,
      start: 'top top',
      end: `+=${BEATS * window.innerHeight}`,
      scrub: 1.4,
      invalidateOnRefresh: true,
      onEnter:     () => { gsap.to([lboxTop, lboxBot], { scaleY: 1, duration: 0.45, ease: 'power2.out' }); gsap.set(wrap, { visibility: 'visible', opacity: 1 }); },
      onLeave:     () => { gsap.to([lboxTop, lboxBot], { scaleY: 0, duration: 0.35, ease: 'power2.in'  }); gsap.set(wrap, { visibility: 'hidden',  opacity: 0 }); },
      onEnterBack: () => { gsap.to([lboxTop, lboxBot], { scaleY: 1, duration: 0.45, ease: 'power2.out' }); gsap.set(wrap, { visibility: 'visible', opacity: 1 }); },
      onLeaveBack: () => { gsap.to([lboxTop, lboxBot], { scaleY: 0, duration: 0.35, ease: 'power2.in'  }); gsap.set(wrap, { visibility: 'hidden',  opacity: 0 }); },
    }
  });

  /* ── BEAT 1 → 2: S0 exit, S1 enter ── */
  master
    .to('.prc-tc-scroll-hint', { opacity: 0, duration: 0.15 }, 0.6)
    .to(s0, { opacity: 0, scale: 0.96, filter: 'blur(6px)', duration: 0.4 }, 0.8)
    .to(s1, { opacity: 1, pointerEvents: 'auto', duration: 0.4 }, 1.0);

  /* ── S1 CINEMATIC SCROLL EFFECTS ── */
  /* Video scale: starts slightly zoomed, pulls back as you scroll */
  gsap.set('#prc-vid-main', { scale: 1.12, filter: 'brightness(0.3) saturate(0.5)' });
  master
    .to('#prc-vid-main', {
      scale: 1.0,
      filter: 'brightness(0.45) saturate(0.75)',
      ease: 'none',
      duration: 1.5
    }, 1.0)
    .to('#prc-vid-main', {
      scale: 0.94,
      filter: 'brightness(0.25) saturate(0.4)',
      ease: 'power2.in',
      duration: 0.5
    }, 2.5);

  /* Vignette pulses tighter as scene progresses */
  gsap.set('#prc-vid-vignette', { opacity: 0.6 });
  master
    .to('#prc-vid-vignette', { opacity: 1.0, ease: 'power2.inOut', duration: 1.5 }, 1.0);

  /* Chromatic aberration flicker on enter */
  master
    .to('#prc-vid-chromatic', { opacity: 0.18, duration: 0.08 }, 1.0)
    .to('#prc-vid-chromatic', { opacity: 0,    duration: 0.12 }, 1.08)
    .to('#prc-vid-chromatic', { opacity: 0.12, duration: 0.06 }, 1.2)
    .to('#prc-vid-chromatic', { opacity: 0,    duration: 0.2  }, 1.26);

  /* Noise static burst on scene entry */
  master
    .to('#prc-vid-noise', { opacity: 0.12, duration: 0.1 }, 1.0)
    .to('#prc-vid-noise', { opacity: 0.04, duration: 0.6 }, 1.1);

  /* S1 text reveal */
  gsap.set('.prc-ft-label',   { opacity: 0, x: -24 });
  gsap.set('.prc-ft-heading', { opacity: 0, x: -32 });
  gsap.set('.prc-ft-body',    { opacity: 0, y: 16 });
  gsap.set('.prc-scan-line',  { scaleX: 0, transformOrigin: 'left center', opacity: 0 });
  gsap.set('.prc-s1-hud-tl',  { opacity: 0, y: -12 });

  master
    .to('.prc-s1-hud-tl',   { opacity: 1, y: 0,    duration: 0.3 }, 1.1)
    .to('.prc-scan-line',    { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 1.2)
    .to('.prc-ft-label',     { opacity: 1, x: 0,    duration: 0.4 }, 1.4)
    .to('.prc-ft-heading',   { opacity: 1, x: 0,    duration: 0.55, ease: 'power2.out' }, 1.55)
    .to('.prc-ft-body',      { opacity: 1, y: 0,    duration: 0.4 }, 1.8);

  /* ── BEAT 3 → 4: S1 exit, S2 enter ── */
  master
    .to(s1, { opacity: 0, duration: 0.4 }, 3.0)
    .to(s2, { opacity: 1, pointerEvents: 'auto', duration: 0.4 }, 3.2);

  gsap.set('.prc-intercept-header', { opacity: 0, y: -16 });
  gsap.set('.prc-intercept-msgs',   { opacity: 0 });
  gsap.set('.prc-s2-ecg-wrap',      { opacity: 0, y: 14 });

  master
    .to('.prc-intercept-header', { opacity: 1, y: 0, duration: 0.4 }, 3.35)
    .to('.prc-intercept-msgs',   { opacity: 1,        duration: 0.3 }, 3.55)
    .to('.prc-s2-ecg-wrap',      { opacity: 1, y: 0,  duration: 0.4 }, 3.65);

  /* Spawn messages when s2 enters */
  let msgsSpawned = false;
  ScrollTrigger.create({
    trigger: section,
    start: () => `top+=${3 * window.innerHeight} top`,
    onEnter: () => { if (!msgsSpawned) { msgsSpawned = true; spawnTransmissions(); } },
  });

  /* ── BEAT 4.5 → 5.5: S2 exit, S3 enter ── */
  master
    .to(s2, { opacity: 0, duration: 0.4 }, 4.5)
    .to(s3, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 4.7);

  /* S3 letterbox + content */
  gsap.set('.prc-s3-lbar-t', { scaleY: 0, transformOrigin: 'top center' });
  gsap.set('.prc-s3-lbar-b', { scaleY: 0, transformOrigin: 'bottom center' });
  gsap.set('.prc-final-kicker', { opacity: 0, y: -10 });
  gsap.set('.prc-final-quote',  { opacity: 0, y: 32, filter: 'blur(6px)' });
  gsap.set('.prc-final-attr',   { opacity: 0 });
  gsap.set('.prc-final-line',   { scaleX: 0, transformOrigin: 'center' });

  master
    .to('.prc-s3-lbar-t',     { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, 4.75)
    .to('.prc-s3-lbar-b',     { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, 4.75)
    .to('.prc-final-kicker',  { opacity: 1, y: 0,    duration: 0.35 }, 4.9)
    .to('.prc-final-quote',   { opacity: 1, y: 0,    filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }, 5.05)
    .to('.prc-final-attr',    { opacity: 1,           duration: 0.4 }, 5.55)
    .to('.prc-final-line',    { scaleX: 1,            duration: 0.5, ease: 'power2.inOut' }, 5.7)

  /* ── BEAT 5.7 → 6.5: S3 fade out sebelum section habis ── */
  master
    .to(s3, { opacity: 0, filter: 'blur(8px)', scale: 0.97, duration: 0.5, ease: 'power2.in' }, 5.8)
    .to(wrap, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 6.3);
}

/* ══════════════════════════════════════════════
   TRANSMISSIONS
══════════════════════════════════════════════ */
const MSGS = [
  { who: 'SHIN',   side: 'left',  color: 'shin',   text: 'Masuk ke zona mati. Sinyal mungkin terputus.' },
  { who: 'LENA',   side: 'right', color: 'lena',   text: 'Aku mendengarmu. Jelas sekali, Undertaker.' },
  { who: 'RAIDEN', side: 'left',  color: 'raiden', text: 'Tiga kelas Löwe di utara. Formasi menyebar.' },
  { who: 'SHIN',   side: 'left',  color: 'shin',   text: 'Kita tidak berhenti. Jaga garis.' },
  { who: 'LENA',   side: 'right', color: 'lena',   text: 'Aku tidak akan berpaling. Tidak lagi.' },
];

function spawnTransmissions() {
  const container = document.getElementById('prc-msgs');
  if (!container) return;

  MSGS.forEach((msg, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = `prc-msg prc-msg-${msg.side}`;
      el.innerHTML = `
        <span class="prc-msg-who prc-who-${msg.color}">${msg.who}</span>
        <span class="prc-msg-text" id="prc-msg-text-${i}"></span>
      `;
      container.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.add('visible');
        typeMsg(document.getElementById(`prc-msg-text-${i}`), msg.text);
      }));
    }, i * 900);
  });
}

function typeMsg(el, text) {
  if (!el) return;
  let i = 0;
  const speed = 28;
  function tick() {
    if (i < text.length) {
      el.textContent = text.slice(0, ++i);
      setTimeout(tick, speed + Math.random() * 16);
    }
  }
  tick();
}

/* ══════════════════════════════════════════════
   MINI RADAR (Scene 0 corner)
══════════════════════════════════════════════ */
function startMiniRadar() {
  const canvas = document.getElementById('prc-mini-radar');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 70;
  const H = canvas.height = 70;
  const cx = W/2, cy = H/2, r = 28;
  let angle = 0;
  const blips = [
    { a: 0.8, d: 0.55 }, { a: 2.2, d: 0.4 },
    { a: 3.6, d: 0.7  }, { a: 4.9, d: 0.45 },
    { a: 5.5, d: 0.3  },
  ];

  function draw() {
    ctx.clearRect(0,0,W,H);
    angle += 0.028;

    /* Rings */
    [1, 0.66, 0.33].forEach(sc => {
      ctx.beginPath(); ctx.arc(cx,cy,r*sc,0,Math.PI*2);
      ctx.strokeStyle = 'rgba(0,255,200,0.18)'; ctx.lineWidth = 0.5; ctx.stroke();
    });

    /* Cross */
    ctx.strokeStyle = 'rgba(0,255,200,0.1)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cx-r,cy); ctx.lineTo(cx+r,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-r); ctx.lineTo(cx,cy+r); ctx.stroke();

    /* Sweep */
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
    const g = ctx.createLinearGradient(0,0,r,0);
    g.addColorStop(0, 'rgba(0,255,200,0.55)'); g.addColorStop(1, 'rgba(0,255,200,0)');
    ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,r,-Math.PI/7,0); ctx.closePath();
    ctx.fillStyle = g; ctx.fill(); ctx.restore();

    /* Blips */
    blips.forEach(b => {
      const diff = ((b.a - angle) % (Math.PI*2) + Math.PI*2) % (Math.PI*2);
      const fade = Math.max(0, 1 - diff / (Math.PI*0.75));
      if (fade > 0.05) {
        const bx = cx + Math.cos(b.a)*r*b.d;
        const by = cy + Math.sin(b.a)*r*b.d;
        ctx.beginPath(); ctx.arc(bx,by,2.5,0,Math.PI*2);
        ctx.fillStyle = `rgba(0,255,200,${fade})`;
        ctx.shadowBlur = 6*fade; ctx.shadowColor = '#00ffc8';
        ctx.fill(); ctx.shadowBlur = 0;
      }
    });

    ctx.beginPath(); ctx.arc(cx,cy,2,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,255,200,0.9)'; ctx.fill();
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════════
   NEURAL CANVAS (Scene 1)
══════════════════════════════════════════════ */
function startNeuralFilmCanvas() {
  const canvas = document.getElementById('prc-neural-film');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth  || 800;
    canvas.height = canvas.offsetHeight || 400;
  };
  resize();
  window.addEventListener('resize', resize);

  const nodes = [
    { id: 'LENA',   x:0.18, y:0.38, color:'#3a7bd5', r:7  },
    { id: 'SHIN',   x:0.50, y:0.26, color:'#c0292b', r:10 },
    { id: 'RAIDEN', x:0.76, y:0.44, color:'#00ffc8', r:6  },
    { id: 'KURENA', x:0.63, y:0.72, color:'#e08c2a', r:6  },
    { id: 'ANJU',   x:0.35, y:0.70, color:'#9b59b6', r:6  },
    { id: 'THEO',   x:0.86, y:0.21, color:'#2ecc71', r:5  },
  ];
  const edges = [[0,1],[1,2],[1,3],[1,4],[2,3],[0,4],[2,5]];
  let t = 0;

  (function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    t += 0.009;

    edges.forEach(([a,b]) => {
      const na=nodes[a], nb=nodes[b];
      const x1=na.x*W,y1=na.y*H,x2=nb.x*W,y2=nb.y*H;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
      ctx.strokeStyle='rgba(0,255,200,0.07)'; ctx.lineWidth=1; ctx.stroke();

      const p  = Math.sin(t+a*1.3+b*0.8)*0.5+0.5;
      const px = x1+(x2-x1)*p, py=y1+(y2-y1)*p;
      ctx.beginPath(); ctx.arc(px,py,2.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,200,${0.5+Math.sin(t*4)*0.3})`; ctx.fill();

      const g=ctx.createLinearGradient(x1,y1,x2,y2);
      g.addColorStop(Math.max(0,p-.15),'rgba(0,255,200,0)');
      g.addColorStop(p,               'rgba(0,255,200,0.22)');
      g.addColorStop(Math.min(1,p+.15),'rgba(0,255,200,0)');
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
      ctx.strokeStyle=g; ctx.lineWidth=2; ctx.stroke();
    });

    nodes.forEach((n,i) => {
      const x=n.x*W, y=n.y*H;
      const pulse=Math.sin(t*1.7+i*1.0)*0.5+0.5;
      ctx.beginPath(); ctx.arc(x,y,n.r+8+pulse*7,0,Math.PI*2);
      ctx.strokeStyle=n.color+'18'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(x,y,n.r+3,0,Math.PI*2);
      ctx.strokeStyle=n.color+'44'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(x,y,n.r,0,Math.PI*2);
      ctx.fillStyle=n.color+'cc'; ctx.fill();
      const grd=ctx.createRadialGradient(x,y,0,x,y,n.r*5);
      grd.addColorStop(0,n.color+'2a'); grd.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.arc(x,y,n.r*5,0,Math.PI*2);
      ctx.fillStyle=grd; ctx.fill();
      ctx.font='700 9px "Orbitron",monospace';
      ctx.fillStyle=n.color+'cc'; ctx.textAlign='center';
      ctx.fillText(n.id,x,y-n.r-12);
    });
    requestAnimationFrame(draw);
  })();
}

/* ══════════════════════════════════════════════
   ECG CANVAS (Scene 2)
══════════════════════════════════════════════ */
function startECGFilmCanvas() {
  const canvas = document.getElementById('prc-ecg-film');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth  || 500;
    H = canvas.height = canvas.offsetHeight || 60;
  };
  resize();
  window.addEventListener('resize', resize);

  let offset = 0;
  function ecgV(x) {
    x = x%(Math.PI*2);
    if(x<0.3)  return Math.sin(x*10)*0.12;
    if(x<0.6)  return 0;
    if(x<0.75) return -Math.sin((x-0.6)*20)*0.25;
    if(x<0.9)  return  Math.sin((x-0.75)*40);
    if(x<1.1)  return -Math.sin((x-0.9)*15)*0.22;
    if(x<1.5)  return  Math.sin((x-1.1)*5)*0.1;
    return 0;
  }

  (function draw() {
    offset += 0.026;
    ctx.clearRect(0,0,W,H);
    ctx.beginPath();
    for(let px=0; px<W; px++) {
      const py=H/2-ecgV((px/W)*Math.PI*4-offset)*(H/2*0.8);
      px===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
    }
    ctx.shadowBlur=10; ctx.shadowColor='#c0292b';
    ctx.strokeStyle='rgba(192,41,43,0.8)'; ctx.lineWidth=1.5;
    ctx.stroke(); ctx.shadowBlur=0;
    requestAnimationFrame(draw);
  })();
}


/* ══════════════════════════════════════════════
   VIDEO AMBIENT — subtle idle motion when pinned
   Slow Ken Burns drift while video autoplays
══════════════════════════════════════════════ */
function initVideoAmbient() {
  const video = document.getElementById('prc-vid-main');
  if (!video) return;

  /* Ensure autoplay works — unmute then remute to bypass some browser blocks */
  video.muted = true;
  const playPromise = video.play();
  if (playPromise) playPromise.catch(() => {});

  /* Subtle idle Ken Burns: slow drift on X axis while scene is visible */
  const s1 = document.getElementById('prc-s1');
  if (!s1) return;

  /* Observe when S1 is visible, start/stop ambient drift */
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      gsap.to(video, {
        x: '-2%',
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    } else {
      gsap.killTweensOf(video, 'x');
      gsap.set(video, { x: 0 });
    }
  }, { threshold: 0.1 });

  io.observe(s1);
}
