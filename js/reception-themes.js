/* ============================================
   reception-themes.js — EIGHTY-SIX
   Critical Reception bars + Key Themes reveal
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initReceptionBars();
  initKeyThemes();
});

/* ══ RECEPTION BARS ══ */
function initReceptionBars() {
  const section = document.getElementById('reception');
  if (!section) return;

  let animated = false;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      setTimeout(() => {
        document.querySelectorAll('.rc-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.val + '%';
        });
      }, 300);
    }
  }, { threshold: 0.3 });

  io.observe(section);
}

/* ══ KEY THEMES REVEAL ══ */
function initKeyThemes() {
  const cards = document.querySelectorAll('.kt-card');
  if (!cards.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 150);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => io.observe(c));
}
