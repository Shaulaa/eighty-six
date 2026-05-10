/* ============================================
   typed.js — EIGHTY-SIX Typewriter Effect
   Typing animation for hero section text
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Wait for loader to finish before starting
  const delay = document.getElementById('loader') ? 3200 : 400;
  setTimeout(initTyped, delay);
});

function initTyped() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;

  const lines = [
    'They called them tools of war.',
    'They called them <em>Eighty-Six</em>.',
  ];

  const fullHTML  = lines.join('<br>');
  const plainText = lines.map(l => l.replace(/<[^>]+>/g, '')).join('\n');

  el.innerHTML = '';
  el.style.opacity = '1';
  el.style.borderRight = '2px solid #c0292b';

  let charIndex = 0;
  let lineIndex = 0;
  const allChars = [];

  // Build char list with metadata
  lines.forEach((line, li) => {
    const stripped = line.replace(/<[^>]+>/g, '');
    stripped.split('').forEach((ch, ci) => {
      allChars.push({ char: ch, line: li, isItalic: line.includes('<em>') && ci >= line.indexOf('>') - 3 });
    });
    if (li < lines.length - 1) allChars.push({ char: '\n', line: li });
  });

  // Simpler approach: type raw text, then render HTML at the end
  const rawLines = lines.map(l => l.replace(/<em>/g, '').replace(/<\/em>/g, ''));
  let raw = '';
  let idx = 0;
  const fullRaw = rawLines.join('\n');

  function type() {
    if (idx < fullRaw.length) {
      raw += fullRaw[idx];
      idx++;

      // Render with line breaks
      const parts = raw.split('\n');
      el.innerHTML = parts.map((p, i) => {
        if (i === 1 && raw.includes('\n')) {
          return `<em>${p}</em>`;
        }
        return p;
      }).join('<br>');

      const speed = 30 + Math.random() * 20;
      setTimeout(type, speed);
    } else {
      // Done — blink cursor then remove
      let blinks = 0;
      const blinkInterval = setInterval(() => {
        el.style.borderRightColor = blinks % 2 === 0 ? 'transparent' : '#c0292b';
        blinks++;
        if (blinks > 6) {
          clearInterval(blinkInterval);
          el.style.borderRight = '2px solid #c0292b';
        }
      }, 400);
    }
  }

  type();
}
