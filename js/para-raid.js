/* ============================================
   para-raid.js — EIGHTY-SIX Para-RAID System
   Full neural sync experience
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParaRaid();
});

function initParaRaid() {
  const section = document.getElementById('para-raid');
  if (!section) return;

  let activated = false;

  /* Activate when section enters viewport */
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !activated) {
      activated = true;
      runSequence();
    }
  }, { threshold: 0.25 });
  io.observe(section);

  initNeuralCanvas();
  initECGCanvas();
  initWaveCanvas();
  initRadarCanvas();
  initOverload();
}

/* ══════════════════════════════════
   1. ACTIVATION SEQUENCE (typing)
══════════════════════════════════ */
async function runSequence() {
  const lines = [
    { text: '> INITIALIZING PARA-RAID SYSTEM...', cls: '' },
    { text: '> NEURAL LINK ESTABLISHED', cls: '' },
    { text: '> SCANNING FOR PROCESSOR UNITS...', cls: 'dim' },
    { text: '> SPEARHEAD SQUADRON DETECTED [6 UNITS]', cls: '' },
    { text: '> SYNCING WITH HANDLER ONE...', cls: '' },
    { text: '> WARNING: SIGNAL FRAGMENTED', cls: 'red' },
    { text: '> TRANSMISSION ACTIVE ██████████ 100%', cls: '' },
  ];

  const container = document.getElementById('pr-terminal-lines');
  if (!container) return;

  for (const line of lines) {
    await typeTerminalLine(container, line.text, line.cls);
    await sleep(line.cls === 'red' ? 600 : 180);
  }

  /* After init, show transmissions */
  await sleep(400);
  showTransmissions();
}

function typeTerminalLine(container, text, cls) {
  return new Promise(resolve => {
    const el = document.createElement('div');
    el.className = `pr-terminal-line${cls ? ' ' + cls : ''}`;
    container.appendChild(el);

    let i = 0;
    const speed = 22;

    function typeChar() {
      if (i < text.length) {
        el.textContent = text.slice(0, ++i);
        setTimeout(typeChar, speed + Math.random() * 18);
      } else {
        resolve();
      }
    }
    typeChar();
  });
}

/* ══════════════════════════════════
   2. NEURAL NODE CANVAS
══════════════════════════════════ */
function initNeuralCanvas() {
  const canvas = document.getElementById('pr-neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = [
    { id: 'LENA',   x: 0.18, y: 0.35, color: '#3a7bd5', r: 7, label: 'HANDLER·01' },
    { id: 'SHIN',   x: 0.50, y: 0.28, color: '#c0292b', r: 9, label: 'UNDERTAKER' },
    { id: 'RAIDEN', x: 0.75, y: 0.45, color: '#00ffc8', r: 6, label: 'LAUGHING FOX' },
    { id: 'KURENA', x: 0.62, y: 0.72, color: '#e08c2a', r: 6, label: 'GUNSLINGER' },
    { id: 'ANJU',   x: 0.35, y: 0.70, color: '#9b59b6', r: 6, label: 'SNOW WITCH' },
    { id: 'THEO',   x: 0.85, y: 0.22, color: '#2ecc71', r: 5, label: 'WEHRWOLF' },
  ];

  const connections = [
    [0,1],[1,2],[1,3],[1,4],[2,3],[0,4],[2,5]
  ];

  let t = 0;

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    t += 0.012;

    /* Draw connections with animated data packets */
    connections.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      const x1 = na.x*W, y1 = na.y*H;
      const x2 = nb.x*W, y2 = nb.y*H;

      /* Base line */
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(0,255,200,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Animated packet traveling along line */
      const progress = (Math.sin(t + a * 1.2 + b * 0.7) * 0.5 + 0.5);
      const px = x1 + (x2-x1) * progress;
      const py = y1 + (y2-y1) * progress;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,255,200,${0.5 + Math.sin(t*3)*0.3})`;
      ctx.fill();

      /* Glow on line */
      const grad = ctx.createLinearGradient(x1,y1,x2,y2);
      grad.addColorStop(Math.max(0, progress-0.15), 'rgba(0,255,200,0)');
      grad.addColorStop(progress, `rgba(0,255,200,0.25)`);
      grad.addColorStop(Math.min(1, progress+0.15), 'rgba(0,255,200,0)');
      ctx.beginPath();
      ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    /* Draw nodes */
    nodes.forEach((n, i) => {
      const x = n.x * W, y = n.y * H;
      const pulse = Math.sin(t * 1.8 + i * 0.9) * 0.5 + 0.5;

      /* Outer pulse ring */
      ctx.beginPath();
      ctx.arc(x, y, n.r + 8 + pulse * 8, 0, Math.PI*2);
      ctx.strokeStyle = n.color + '22';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Mid ring */
      ctx.beginPath();
      ctx.arc(x, y, n.r + 3, 0, Math.PI*2);
      ctx.strokeStyle = n.color + '55';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Core */
      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI*2);
      ctx.fillStyle = n.color + 'cc';
      ctx.fill();

      /* Glow */
      const grd = ctx.createRadialGradient(x,y,0, x,y, n.r*4);
      grd.addColorStop(0, n.color + '33');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, n.r*4, 0, Math.PI*2);
      ctx.fillStyle = grd;
      ctx.fill();

      /* Label */
      ctx.font = '700 8px "Orbitron", monospace';
      ctx.fillStyle = n.color + 'cc';
      ctx.letterSpacing = '0.1em';
      ctx.textAlign = 'center';
      ctx.fillText(n.id, x, y - n.r - 10);

      ctx.font = '7px "Orbitron", monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillText(n.label, x, y + n.r + 14);
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════
   3. ECG / HEARTBEAT CANVAS
══════════════════════════════════ */
function initECGCanvas() {
  const canvas = document.getElementById('pr-ecg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let offset = 0;
  let bpm = 1;  // base speed
  let targetBpm = 1;

  /* Speed up on section hover */
  const section = document.getElementById('para-raid');
  if (section) {
    section.addEventListener('mouseenter', () => { targetBpm = 2.4; });
    section.addEventListener('mouseleave', () => { targetBpm = 1; });
  }

  function ecgValue(x) {
    x = x % (Math.PI * 2);
    if (x < 0.3) return Math.sin(x * 10) * 0.15;
    if (x < 0.6) return 0;
    if (x < 0.75) return -Math.sin((x-0.6)*20) * 0.3;
    if (x < 0.9) return Math.sin((x-0.75)*40) * 1;  // QRS spike
    if (x < 1.1) return -Math.sin((x-0.9)*15) * 0.25;
    if (x < 1.5) return Math.sin((x-1.1)*5) * 0.12;
    return 0;
  }

  function draw() {
    bpm += (targetBpm - bpm) * 0.04;
    offset += 0.03 * bpm;

    ctx.clearRect(0, 0, W, H);

    /* Grid lines */
    ctx.strokeStyle = 'rgba(192,41,43,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
    }
    for (let y = 0; y < H; y += H/4) {
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }

    /* ECG line */
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const xVal = (px / W) * Math.PI * 4 - offset;
      const yVal = ecgValue(xVal);
      const py = H/2 - yVal * (H/2 * 0.85);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    /* Glow effect */
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#c0292b';
    ctx.strokeStyle = `rgba(192,41,43,${0.7 + bpm*0.1})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* Moving scan line */
    const scanX = (offset / (Math.PI*4)) * W % W;
    const grad = ctx.createLinearGradient(scanX-40, 0, scanX, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(192,41,43,0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(scanX-40, 0, 40, H);

    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════
   4. WAVEFORM CANVAS
══════════════════════════════════ */
function initWaveCanvas() {
  const canvas = document.getElementById('pr-wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  const bars = 80;

  function draw() {
    t += 0.04;
    ctx.clearRect(0, 0, W, H);

    const barW = W / bars;

    for (let i = 0; i < bars; i++) {
      const noise = Math.sin(t * 2.1 + i * 0.4) * 0.5
                  + Math.sin(t * 3.7 + i * 0.2) * 0.3
                  + Math.sin(t * 1.3 + i * 0.8) * 0.2;
      const amp = (noise * 0.5 + 0.5);
      const barH = amp * H * 0.85;

      const alpha = 0.3 + amp * 0.7;
      const x = i * barW + barW * 0.15;
      const y = (H - barH) / 2;

      ctx.fillStyle = `rgba(0,255,200,${alpha})`;
      ctx.fillRect(x, y, barW * 0.7, barH);

      /* Glow on tall bars */
      if (amp > 0.7) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffc8';
        ctx.fillStyle = `rgba(0,255,200,${alpha * 0.5})`;
        ctx.fillRect(x, y, barW * 0.7, barH);
        ctx.shadowBlur = 0;
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════
   5. RADAR CANVAS
══════════════════════════════════ */
function initRadarCanvas() {
  const canvas = document.getElementById('pr-radar-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width = 80;
  const H = canvas.height = 80;
  const cx = W/2, cy = H/2, r = 34;
  let angle = 0;

  const blips = [
    { a: 0.8, d: 0.6 }, { a: 2.1, d: 0.4 },
    { a: 3.5, d: 0.75 }, { a: 4.8, d: 0.5 },
    { a: 5.6, d: 0.3 },
  ];

  function draw() {
    ctx.clearRect(0,0,W,H);
    angle += 0.025;

    /* Rings */
    [1, 0.66, 0.33].forEach(scale => {
      ctx.beginPath();
      ctx.arc(cx, cy, r*scale, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(0,255,200,0.15)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    /* Cross lines */
    ctx.strokeStyle = 'rgba(0,255,200,0.1)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cx-r,cy); ctx.lineTo(cx+r,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-r); ctx.lineTo(cx,cy+r); ctx.stroke();

    /* Sweep */
    const sweepGrad = ctx.createConicalGradient
      ? null  // not widely supported
      : null;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const grad = ctx.createLinearGradient(0, 0, r, 0);
    grad.addColorStop(0, 'rgba(0,255,200,0.5)');
    grad.addColorStop(1, 'rgba(0,255,200,0)');
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0, 0, r, -Math.PI/8, 0);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    /* Blips */
    blips.forEach(b => {
      const diff = ((b.a - angle) % (Math.PI*2) + Math.PI*2) % (Math.PI*2);
      const fade = diff < Math.PI*2 ? Math.max(0, 1 - diff / (Math.PI*0.8)) : 0;
      if (fade > 0.05) {
        const bx = cx + Math.cos(b.a) * r * b.d;
        const by = cy + Math.sin(b.a) * r * b.d;
        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,255,200,${fade})`;
        ctx.fill();
        ctx.shadowBlur = 6 * fade;
        ctx.shadowColor = '#00ffc8';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    /* Center dot */
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,255,200,0.8)';
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════
   6. TRANSMISSIONS
══════════════════════════════════ */
const TRANSMISSIONS = [
  { who: 'SHIN',   cls: 'shin',   text: 'Can you hear me, Handler One?',              time: '04:21:08' },
  { who: 'LENA',   cls: 'lena',   text: 'Yes... I\'m here. I can hear you.',           time: '04:21:11' },
  { who: 'RAIDEN', cls: 'raiden', text: 'Signal\'s breaking up. Stay focused.',        time: '04:21:19' },
  { who: 'SHIN',   cls: 'shin',   text: 'We keep moving. That\'s all we can do.',      time: '04:21:34' },
  { who: 'LENA',   cls: 'lena',   text: 'I won\'t look away. Not anymore.',            time: '04:21:47' },
];

function showTransmissions() {
  const container = document.getElementById('pr-transmissions');
  if (!container) return;

  TRANSMISSIONS.forEach((msg, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'pr-msg';
      el.innerHTML = `
        <div class="pr-msg-header ${msg.cls}">
          ${msg.who}
          <span class="pr-msg-time">${msg.time}</span>
        </div>
        <div class="pr-msg-text">${msg.text}</div>
      `;
      container.appendChild(el);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('visible'));
      });
    }, i * 1800);
  });
}

/* ══════════════════════════════════
   7. OVERLOAD EFFECT
══════════════════════════════════ */
function initOverload() {
  const overlay = document.getElementById('pr-overload');
  if (!overlay) return;

  const section = document.getElementById('para-raid');
  if (!section) return;

  let hoverTimer;

  section.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => {
      triggerOverload(overlay);
    }, 4000); // trigger after 4s of hovering
  });

  section.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
  });
}

function triggerOverload(overlay) {
  let flashes = 0;
  const maxFlashes = 6;

  function flash() {
    if (flashes >= maxFlashes) return;
    overlay.classList.add('flash');
    setTimeout(() => {
      overlay.classList.remove('flash');
      flashes++;
      setTimeout(flash, 60 + Math.random() * 80);
    }, 40 + Math.random() * 60);
  }
  flash();
}

/* ── UTIL ── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
