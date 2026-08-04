// Theme toggle (light / dark)
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'evolvora-theme';

// Show a clear broken-image state (icon + alt text) when an image fails to load
document.querySelectorAll('img').forEach((img) => {
  const markBroken = () => {
    if (img.classList.contains('img-error')) return;
    img.classList.add('img-error');
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', 'Image unavailable');
    }
  };
  img.addEventListener('error', markBroken);
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markBroken();
});

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f4f7fd' : '#070b16');
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

// Fixed nav: stays visible while scrolling
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
}

// Dropdown: hover on desktop, click/tap on mobile
document.querySelectorAll('.has-dropdown .drop-btn').forEach(btn => {
  const wrap = btn.closest('.has-dropdown');
  const desktopMq = window.matchMedia('(min-width: 1001px)');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (desktopMq.matches) return; // desktop uses pure hover
    const willOpen = !wrap.classList.contains('open');
    document.querySelectorAll('.has-dropdown.open').forEach((el) => {
      if (el !== wrap) el.classList.remove('open');
    });
    wrap.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  wrap.addEventListener('mouseenter', () => {
    if (!desktopMq.matches) return;
    btn.setAttribute('aria-expanded', 'true');
  });
  wrap.addEventListener('mouseleave', () => {
    if (!desktopMq.matches) return;
    btn.setAttribute('aria-expanded', 'false');
    wrap.classList.remove('open');
  });
});

// Close mobile menu on link click
if (links) {
  links.querySelectorAll('a[href]').forEach(a =>
    a.addEventListener('click', () => setMenuOpen(false))
  );
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const ans = item.querySelector('.faq-a');
    const open = item.classList.toggle('open');
    ans.style.maxHeight = open ? ans.scrollHeight + 'px' : null;
    q.setAttribute('aria-expanded', open);
  });
});

// Shared slider arrow controls
function injectSliderNav(container, onPrev, onNext) {
  if (!container || container.querySelector('.slider-nav-btn')) return;
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'slider-nav-btn slider-nav-btn--prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'slider-nav-btn slider-nav-btn--next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  prev.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);
  container.classList.add('slider-has-nav');
  container.append(prev, next);
}

// Services section: sticky scroll, 2 cards at a time
(function initServicesScroll() {
  const section = document.querySelector('.services-scroll');
  if (!section) return;

  const scrollRoot = section.querySelector('.cards-scroll');
  const track = section.querySelector('.cards-scroll-track');
  const viewport = section.querySelector('.cards-scroll-viewport');
  const dots = section.querySelectorAll('.cards-scroll-dots span');
  const panels = section.querySelectorAll('.cards-scroll-panel');
  const mq = window.matchMedia('(max-width: 1000px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let panelIndex = 0;

  function getStep() {
    if (!viewport) return 0;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return viewport.offsetWidth + gap;
  }

  function goToPanel(index, fromScroll = false) {
    if (mq.matches || reduceMotion.matches || !viewport) return;
    panelIndex = Math.max(0, Math.min(panels.length - 1, index));
    const step = getStep();
    track.style.transform = `translate3d(-${panelIndex * step}px, 0, 0)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === panelIndex));
    if (!fromScroll) {
      const start = section.offsetTop;
      const scrollRange = section.offsetHeight - window.innerHeight;
      const progress = panels.length <= 1 ? 0 : panelIndex / (panels.length - 1);
      window.scrollTo({ top: start + progress * scrollRange, behavior: 'smooth' });
    }
  }

  function update() {
    if (mq.matches || reduceMotion.matches || !viewport) return;

    const start = section.offsetTop;
    const scrollRange = section.offsetHeight - window.innerHeight;
    const progress = scrollRange <= 0 ? 0 : Math.min(1, Math.max(0, (window.scrollY - start) / scrollRange));
    const step = getStep();
    const offset = progress * (panels.length - 1) * step;

    track.style.transform = `translate3d(-${offset}px, 0, 0)`;

    panelIndex = Math.min(panels.length - 1, Math.round(progress * (panels.length - 1)));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === panelIndex));
  }

  function setup() {
    if (mq.matches || reduceMotion.matches) {
      section.style.height = '';
      track.style.transform = '';
      return;
    }
    section.style.height = `${panels.length * 100}vh`;
    update();
  }

  injectSliderNav(scrollRoot, () => goToPanel(panelIndex - 1), () => goToPanel(panelIndex + 1));

  setup();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', setup);
  mq.addEventListener('change', setup);
  reduceMotion.addEventListener('change', setup);
})();

// Why Evolvora: sticky viewport, floating sliding images
(function initWhyStory() {
  const section = document.querySelector('.why-story');
  if (!section) return;

  const steps = [...section.querySelectorAll('.why-story-step')];
  const track = section.querySelector('.why-visual-photo-track');
  const viewport = section.querySelector('.why-visual-float-viewport');
  const mq = window.matchMedia('(max-width: 1000px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer = null;
  let activeIndex = 0;

  function moveTrack(index) {
    if (!track || !viewport) return;
    const h = viewport.offsetHeight;
    track.style.transform = `translate3d(0, -${index * h}px, 0)`;
  }

  function setActive(index) {
    activeIndex = index;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    moveTrack(index);
  }

  function enable() {
    if (observer || !steps.length) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.whyStep));
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    steps.forEach((step) => observer.observe(step));
  }

  function disable() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    steps.forEach((step) => step.classList.add('is-active'));
    if (track) track.style.transform = '';
  }

  function setup() {
    if (mq.matches || reduceMotion.matches) disable();
    else {
      setActive(activeIndex);
      enable();
    }
  }

  setup();
  window.addEventListener('resize', () => moveTrack(activeIndex));
  section.querySelectorAll('.why-story-visual img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', () => moveTrack(activeIndex), { once: true });
  });
  requestAnimationFrame(() => moveTrack(activeIndex));
  mq.addEventListener('change', setup);
  reduceMotion.addEventListener('change', setup);
})();

// 3D tilt on product mockups (press / drag)
(function initTilt3d() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileMq = window.matchMedia('(max-width: 1000px)');

  function getBase() {
    const mobile = mobileMq.matches;
    return {
      x: 5,
      y: mobile ? 6 : 8,
      tx: mobile ? -6 : -20,
      scale: mobile ? 1.01 : 1.02
    };
  }

  document.querySelectorAll('[data-tilt-3d]').forEach((el) => {
    const target = el.querySelector('.browser');
    if (!target) return;

    let pressing = false;

    function setVars(x, y, active) {
      const base = getBase();
      const tilt = active ? 30 : 14;
      const move = active ? 16 : 6;
      const depth = active ? -18 : 0;
      const scale = active ? base.scale * 0.98 : base.scale;

      target.style.setProperty('--tilt-x', String(base.x - y * tilt));
      target.style.setProperty('--tilt-y', String(base.y + x * tilt));
      target.style.setProperty('--tilt-tx', String(base.tx + x * move));
      target.style.setProperty('--tilt-ty', String(y * move));
      target.style.setProperty('--tilt-z', String(depth));
      target.style.setProperty('--tilt-scale', String(scale));
    }

    function reset() {
      pressing = false;
      el.classList.remove('is-pressing', 'is-active');
      setVars(0, 0, false);
    }

    function pointFromEvent(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      return { x, y };
    }

    function apply(e, active) {
      if (reduceMotion.matches) return;
      const { x, y } = pointFromEvent(e);
      setVars(x, y, active);
    }

    el.addEventListener('pointerdown', (e) => {
      if (reduceMotion.matches) return;
      pressing = true;
      el.classList.add('is-pressing', 'is-active');
      el.setPointerCapture(e.pointerId);
      apply(e, true);
    });

    el.addEventListener('pointermove', (e) => {
      if (pressing) apply(e, true);
      else if (e.pointerType === 'mouse') apply(e, false);
    });

    el.addEventListener('pointerup', reset);
    el.addEventListener('pointercancel', reset);

    el.addEventListener('pointerleave', () => {
      if (!pressing) reset();
    });

    el.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (e.type === 'keydown' && !pressing) {
        pressing = true;
        el.classList.add('is-pressing', 'is-active');
        setVars(0, 0, true);
      }
    });

    el.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') reset();
    });

    reset();
  });
})();

// Coverflow carousels: desktop transform loop, mobile scroll-snap + arrows
(function initCoverflowCarousels() {
  document.querySelectorAll('[data-coverflow]').forEach((root) => {
    const track = root.querySelector('.coverflow-track, .services-coverflow-track');
    if (!track) return;

    const cardSelector = '.coverflow-card, .services-coverflow-card';
    const mq = window.matchMedia('(max-width: 1000px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setCount = Number(root.dataset.setCount) || track.querySelectorAll(cardSelector).length;
    const STEP_MS = 2800;
    const SLIDE_MS = 500;
    const PAUSE_MS = 8000;

    let viewport = root.querySelector('.slider-viewport');
    if (!viewport) {
      viewport = document.createElement('div');
      viewport.className = 'slider-viewport';
      track.parentNode.insertBefore(viewport, track);
      viewport.appendChild(track);
    }

    let offset = 0;
    let setWidth = 0;
    let stepWidth = 0;
    let stepTimer = null;
    let animTimer = null;
    let resumeTimer = null;
    let mobileIndex = 0;
    let mode = 'desktop';

    function cards() {
      return [...track.querySelectorAll(cardSelector)];
    }

    function resetTrack() {
      if (!track.dataset.cloned) return;
      cards().slice(setCount).forEach((card) => card.remove());
      delete track.dataset.cloned;
    }

    function cloneForLoop() {
      if (track.dataset.cloned || reduceMotion.matches) return;
      const original = track.innerHTML;
      track.innerHTML = original + original + original;
      track.dataset.cloned = '1';
    }

    function measure() {
      const list = cards();
      if (!list.length) return false;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const cardW = list[0].getBoundingClientRect().width;
      if (!cardW) return false;
      stepWidth = cardW + gap;
      setWidth = setCount * stepWidth;
      return stepWidth > 0 && setWidth > 0;
    }

    function updateCards() {
      if (mode === 'mobile') {
        const centerX = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
        cards().forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const dist = Math.abs(rect.left + rect.width / 2 - centerX);
          const active = dist < rect.width * 0.35;
          card.classList.toggle('is-center', active);
          card.style.transform = '';
          card.style.opacity = '';
          card.style.zIndex = active ? '2' : '1';
          if (active) mobileIndex = i;
        });
        return;
      }

      const rootRect = viewport.getBoundingClientRect();
      const centerX = rootRect.left + rootRect.width / 2;
      const radius = Math.max(rootRect.width * 0.32, stepWidth * 1.4);

      cards().forEach((card) => {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - centerX);
        const t = Math.min(1, dist / radius);
        const scale = 1.18 - t * 0.36;
        const opacity = 1 - t * 0.32;
        card.style.transform = `scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(Math.round((1 - t) * 100));
        card.classList.toggle('is-center', t < 0.14);
      });
    }

    function stop() {
      if (stepTimer) {
        clearInterval(stepTimer);
        stepTimer = null;
      }
      if (animTimer) {
        clearInterval(animTimer);
        animTimer = null;
      }
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    }

    function animateDuringSlide() {
      if (animTimer) clearInterval(animTimer);
      const start = performance.now();
      animTimer = setInterval(() => {
        updateCards();
        if (performance.now() - start > SLIDE_MS + 40) {
          clearInterval(animTimer);
          animTimer = null;
        }
      }, 16);
    }

    function wrapOffset() {
      if (!setWidth) return;
      let changed = false;
      while (offset <= -2 * setWidth) {
        offset += setWidth;
        changed = true;
      }
      while (offset > -0.5) {
        offset -= setWidth;
        changed = true;
      }
      if (changed) {
        track.style.transition = 'none';
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
        void track.offsetHeight;
      }
    }

    function slideDesktop(direction) {
      if (!measure()) return;
      offset -= direction * stepWidth;
      track.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(.4,0,.2,1)`;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      animateDuringSlide();
      window.setTimeout(() => {
        wrapOffset();
        updateCards();
      }, SLIDE_MS + 24);
    }

    function scrollMobileTo(index, smooth = true) {
      const list = cards();
      if (!list.length) return;
      mobileIndex = ((index % list.length) + list.length) % list.length;
      const card = list[mobileIndex];
      const left = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
      viewport.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' });
      window.setTimeout(updateCards, smooth ? 320 : 0);
    }

    function slideMobile(direction) {
      const list = cards();
      if (!list.length) return;
      scrollMobileTo(mobileIndex + direction, true);
    }

    function advance() {
      if (reduceMotion.matches) return;
      if (mode === 'mobile') slideMobile(1);
      else slideDesktop(1);
    }

    function retreat() {
      if (reduceMotion.matches) return;
      if (mode === 'mobile') slideMobile(-1);
      else slideDesktop(-1);
    }

    function pauseAuto() {
      stop();
      resumeTimer = window.setTimeout(startAuto, PAUSE_MS);
    }

    function onManualNav(direction) {
      if (direction > 0) advance();
      else retreat();
      pauseAuto();
    }

    function startAuto() {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
      if (stepTimer) clearInterval(stepTimer);
      if (!reduceMotion.matches) stepTimer = setInterval(advance, STEP_MS);
    }

    function clearCardStyles() {
      cards().forEach((card) => {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.zIndex = '';
        card.classList.remove('is-center');
      });
    }

    function startDesktop() {
      mode = 'desktop';
      cloneForLoop();
      track.style.transform = '';
      const boot = (tries) => {
        if (!measure()) {
          if (tries < 30) requestAnimationFrame(() => boot(tries + 1));
          return;
        }
        offset = -setWidth;
        track.style.transition = '';
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
        updateCards();
        startAuto();
      };
      boot(0);
    }

    function startMobile() {
      mode = 'mobile';
      resetTrack();
      clearCardStyles();
      track.style.transition = '';
      track.style.transform = '';
      mobileIndex = 0;
      requestAnimationFrame(() => {
        scrollMobileTo(0, false);
        updateCards();
        startAuto();
      });
    }

    function start() {
      stop();
      if (reduceMotion.matches) {
        resetTrack();
        clearCardStyles();
        track.style.transition = '';
        track.style.transform = '';
        return;
      }
      if (mq.matches) startMobile();
      else startDesktop();
    }

    injectSliderNav(root, () => onManualNav(-1), () => onManualNav(1));

    let scrollEndTimer = null;
    viewport.addEventListener('scroll', () => {
      if (mode !== 'mobile') return;
      updateCards();
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(updateCards, 120);
    }, { passive: true });

    start();
    window.addEventListener('resize', () => {
      if (mode === 'desktop') {
        measure();
        wrapOffset();
        updateCards();
      } else {
        scrollMobileTo(mobileIndex, false);
      }
    });
    mq.addEventListener('change', start);
    reduceMotion.addEventListener('change', start);
  });
})();

// About page: subtle hero parallax
(function initAboutPage() {
  const page = document.querySelector('.about-page');
  if (!page) return;

  const hero = page.querySelector('.about-hero');
  const heroPanel = page.querySelector('.about-hero-panel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileMq = window.matchMedia('(max-width: 1000px)');

  // The background mesh keeps its own CSS drift animation, so only the panel
  // is nudged here — an inline transform would override that animation.
  if (hero && heroPanel && !reduceMotion.matches && !mobileMq.matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroPanel.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroPanel.style.transform = '';
    });
  }
})();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Footer year
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
