// Theme toggle (light / dark)
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'evolvora-theme';

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f4fc' : '#0d0821');
  if (themeToggle) {
    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.setAttribute('aria-pressed', isLight);
  }
}

if (themeToggle) {
  applyTheme(getTheme());
  themeToggle.addEventListener('click', () => {
    applyTheme(getTheme() === 'light' ? 'dark' : 'light');
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
});

// Fixed nav — stays visible while scrolling
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

function setMenuOpen(open) {
  if (!toggle || !links) return;
  links.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('nav-open', open);
}

if (toggle && links) {
  links.classList.remove('open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('nav-open');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenuOpen(!links.classList.contains('open'));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) setMenuOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (nav?.contains(e.target) || links.contains(e.target)) return;
    setMenuOpen(false);
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => setMenuOpen(false))
  );
}

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 3D tilt — hero + feature screenshots (press a side to tilt and hold)
(function initTilt3d() {
  const elements = document.querySelectorAll('[data-tilt-3d]');
  if (!elements.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  elements.forEach((el) => {
    const target = el.querySelector('.browser');
    if (!target) return;

    const isHero = el.classList.contains('hero-shot');
    const isReverse = el.hasAttribute('data-tilt-reverse');
    let pressing = false;
    let heldX = 0;
    let heldY = 0;

    function getBase() {
      const mobile = window.matchMedia('(max-width: 960px)').matches;
      if (isHero) {
        return {
          x: mobile ? 6 : 8,
          y: mobile ? -8 : -14,
          scale: mobile ? 1.02 : 1.03,
        };
      }
      return {
        x: mobile ? 3 : 4,
        y: isReverse ? (mobile ? -6 : -8) : mobile ? 6 : 8,
        scale: mobile ? 0.98 : 1.02,
      };
    }

    function setVars(x, y, active) {
      const base = getBase();
      const tilt = isHero ? (active ? 28 : 18) : active ? 14 : 7;
      const move = isHero ? (active ? 14 : 8) : active ? 8 : 5;
      const depth = isHero ? (active ? -16 : -6) : active ? -12 : -5;
      const scale = active ? base.scale * 0.985 : base.scale;

      target.style.setProperty('--tilt-x', String(base.x - y * tilt));
      target.style.setProperty('--tilt-y', String(base.y + x * tilt));
      target.style.setProperty('--tilt-tx', String(x * move));
      target.style.setProperty('--tilt-ty', String(y * move));
      target.style.setProperty('--tilt-z', String(depth));
      target.style.setProperty('--tilt-scale', String(scale));
    }

    function pointFromEvent(e) {
      const rect = el.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
    }

    function apply(e, active) {
      if (reduceMotion.matches) return;
      const { x, y } = pointFromEvent(e);
      heldX = x;
      heldY = y;
      setVars(x, y, active);
    }

    function settle() {
      pressing = false;
      el.classList.remove('is-pressing');
      el.classList.add('is-held');
      setVars(heldX, heldY, false);
      window.setTimeout(() => el.classList.remove('is-active'), 80);
    }

    el.addEventListener('pointerdown', (e) => {
      if (reduceMotion.matches) return;
      if (e.button != null && e.button !== 0) return;
      pressing = true;
      el.classList.add('is-pressing', 'is-active');
      el.setPointerCapture(e.pointerId);
      apply(e, true);
    });

    el.addEventListener('pointermove', (e) => {
      if (!pressing) return;
      apply(e, true);
    });

    el.addEventListener('pointerup', settle);
    el.addEventListener('pointercancel', settle);

    el.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (reduceMotion.matches) return;
      heldX = heldX === 0 ? 0.35 : heldX * -1;
      heldY = 0.1;
      el.classList.add('is-active', 'is-held');
      setVars(heldX, heldY, true);
      window.setTimeout(() => {
        el.classList.remove('is-active');
        setVars(heldX, heldY, false);
      }, 160);
    });

    setVars(0, 0, false);
  });
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
