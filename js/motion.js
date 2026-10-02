/* =====================================================================
   بوكيه — الحركة والتفاعلات الدقيقة
   Bouquet — motion: smooth scroll, reveals, parallax, petals, cursor.
   كل الحركات تتوقف تلقائيًا عند تفعيل «تقليل الحركة» في الجهاز.
   ===================================================================== */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const motion = { reduce, lenis: null };
  const scrollFns = new Set();

  // ------------------------------------------------ smooth scrolling
  if (!reduce && finePointer && typeof window.Lenis === 'function') {
    try {
      motion.lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
      document.documentElement.classList.add('lenis');
    } catch (e) { motion.lenis = null; }
  }

  function scrollToTarget(target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (motion.lenis) motion.lenis.scrollTo(el, { offset: -70, duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  motion.scrollTo = scrollToTarget;

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const href = a.getAttribute('href');
    const hash = href.slice(href.indexOf('#'));
    const path = href.slice(0, href.indexOf('#'));
    const here = !path || path === location.pathname.split('/').pop() || (path === 'index.html' && document.body.dataset.page === 'home');
    if (!here || hash.length < 2) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    if (BQ.ui) BQ.ui.close();
    setTimeout(() => scrollToTarget(el), BQ.ui ? 60 : 0);
    history.replaceState(null, '', hash);
  });

  // ----------------------------------------------------- split words
  // يقسّم العنوان إلى كلمات (وليس حروفًا، حفاظًا على اتصال الحروف العربية)
  function split(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/(\s+)/).map((w, i) => (/^\s+$/.test(w) ? ' ' : `<span class="w" aria-hidden="true"><span style="--wi:${i / 2}">${w}</span></span>`)).join('');
  }
  function splitAll(root) { $$('[data-split]', root || document).forEach(split); }

  // --------------------------------------------------------- reveals
  let io = null;
  function observe(root) {
    const els = $$('[data-reveal]:not(.is-in), .lineart[data-draw]:not(.is-drawn)', root || document);
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add(el.matches('.lineart') ? 'is-drawn' : 'is-in'));
      return;
    }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add(en.target.matches('.lineart') ? 'is-drawn' : 'is-in');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    }
    els.forEach((el) => io.observe(el));
  }
  motion.observe = observe;

  // -------------------------------------------------------- parallax
  const para = new Set();
  let pio = null;
  function watchParallax(root) {
    if (reduce) return;
    if (!pio) {
      pio = new IntersectionObserver((entries) => entries.forEach((en) => (en.isIntersecting ? para.add(en.target) : para.delete(en.target))), { rootMargin: '20% 0px' });
    }
    $$('[data-parallax]', root || document).forEach((el) => pio.observe(el));
  }
  function updateParallax() {
    const vh = window.innerHeight;
    para.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.12;
      const off = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    });
  }

  // ----------------------------------------------------- the loop
  let lastY = -1;
  function frame(time) {
    if (motion.lenis) motion.lenis.raf(time);
    const y = window.scrollY;
    if (y !== lastY) {
      lastY = y;
      updateParallax();
      scrollFns.forEach((fn) => fn(y));
    }
    requestAnimationFrame(frame);
  }
  motion.onScroll = (fn) => { scrollFns.add(fn); fn(window.scrollY); };
  window.addEventListener('resize', () => { lastY = -1; });

  // --------------------------------------------------------- petals
  // بتلات متساقطة خفيفة مرسومة على canvas
  function Petals(canvas, opts) {
    const o = Object.assign({ count: 14, dir: 1, size: [7, 15], speed: [0.25, 0.6], colors: ['#7D162A', '#9B2A40', '#D8B0B4', '#B86A78'], alpha: [0.35, 0.85] }, opts || {});
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, raf = 0, running = false, items = [], last = 0;
    const rnd = (a, b) => a + Math.random() * (b - a);

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      return {
        x: rnd(0, w), y: initial ? rnd(0, h) : (o.dir > 0 ? rnd(-60, -20) : h + rnd(20, 60)),
        s: rnd(o.size[0], o.size[1]), v: rnd(o.speed[0], o.speed[1]),
        drift: rnd(-0.18, 0.18), sway: rnd(8, 26), phase: rnd(0, Math.PI * 2), freq: rnd(0.0006, 0.0014),
        rot: rnd(0, Math.PI * 2), vr: rnd(-0.008, 0.008), flip: rnd(0, Math.PI * 2), vf: rnd(0.008, 0.02),
        c: o.colors[Math.floor(Math.random() * o.colors.length)], a: rnd(o.alpha[0], o.alpha[1]),
      };
    }
    function draw(p, t) {
      const sx = p.x + Math.sin(t * p.freq + p.phase) * p.sway;
      ctx.save();
      ctx.translate(sx, p.y);
      ctx.rotate(p.rot);
      ctx.scale(Math.max(0.18, Math.abs(Math.cos(p.flip))), 1);
      ctx.globalAlpha = p.a;
      const s = p.s;
      const g = ctx.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, p.c); g.addColorStop(1, 'rgba(248,243,238,0.35)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, s);
      ctx.bezierCurveTo(s * 0.95, s * 0.35, s * 0.8, -s * 0.9, s * 0.12, -s * 0.95);
      ctx.quadraticCurveTo(0, -s * 0.7, -s * 0.12, -s * 0.95);
      ctx.bezierCurveTo(-s * 0.8, -s * 0.9, -s * 0.95, s * 0.35, 0, s);
      ctx.fill();
      ctx.restore();
    }
    function tick(t) {
      const dt = Math.min(48, t - (last || t)) / 16.67; last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < items.length; i++) {
        const p = items[i];
        p.y += p.v * dt * o.dir; p.x += p.drift * dt; p.rot += p.vr * dt; p.flip += p.vf * dt;
        if ((o.dir > 0 && p.y > h + 40) || (o.dir < 0 && p.y < -40) || p.x < -60 || p.x > w + 60) items[i] = spawn(false);
        draw(p, t);
      }
      if (running) raf = requestAnimationFrame(tick);
    }
    function start() { if (running || reduce) return; running = true; last = 0; raf = requestAnimationFrame(tick); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    items = Array.from({ length: o.count }, () => spawn(true));
    if (reduce) { items.slice(0, Math.ceil(o.count / 3)).forEach((p) => draw(p, 0)); return { start() {}, stop() {} }; }
    new IntersectionObserver((en) => (en[0].isIntersecting ? start() : stop())).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : null));
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    return { start, stop };
  }
  motion.Petals = Petals;
  function initPetals(root) {
    $$('canvas[data-petals]:not([data-ready])', root || document).forEach((c) => {
      c.dataset.ready = '1';
      let opts = {};
      try { opts = JSON.parse(c.dataset.petals || '{}'); } catch (e) {}
      Petals(c, opts);
    });
  }

  // --------------------------------------------------------- cursor
  function initCursor() {
    if (reduce || !finePointer) return;
    const c = document.createElement('div');
    c.className = 'cursor'; c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<span class="cursor__ring"><em></em></span><span class="cursor__dot"></span>';
    document.body.appendChild(c);
    const ring = c.firstChild; const dot = c.lastChild; const label = ring.firstChild;
    let x = -100, y = -100, rx = -100, ry = -100, shown = false;
    document.documentElement.classList.add('has-cursor');
    window.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!shown) { shown = true; rx = x; ry = y; c.classList.add('is-on'); }
    }, { passive: true });
    document.addEventListener('mouseleave', () => { shown = false; c.classList.remove('is-on'); });
    document.addEventListener('mouseover', (e) => {
      const view = e.target.closest('[data-cursor="view"]');
      const hot = e.target.closest('a, button, [role="button"], label, select, .chip');
      const text = e.target.closest('input, textarea');
      c.classList.toggle('is-view', !!view);
      c.classList.toggle('is-hover', !!hot && !view);
      c.classList.toggle('is-text', !!text);
      if (view) label.textContent = BQ.i18n.t('card.discover');
    });
    document.addEventListener('mousedown', () => c.classList.add('is-down'));
    document.addEventListener('mouseup', () => c.classList.remove('is-down'));
    (function loop() {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      requestAnimationFrame(loop);
    })();
  }

  // ------------------------------------------------ videos in view
  function initVideos() {
    $$('video[data-autoplay]').forEach((v) => {
      if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
      const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
      new IntersectionObserver((en) => (en[0].isIntersecting ? play() : v.pause()), { threshold: 0.05 }).observe(v);
    });
  }

  // -------------------------------------------------------- refresh
  motion.refresh = function (root) { observe(root); watchParallax(root); initPetals(root); };

  function init() {
    document.documentElement.classList.add(reduce ? 'reduce-motion' : 'motion-ok');
    splitAll();
    motion.refresh();
    initCursor();
    initVideos();
    requestAnimationFrame(frame);
    document.documentElement.classList.add('is-loaded');
    // عند فتح رابط يحتوي على # من صفحة أخرى
    if (location.hash.length > 1) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 80);
    }
  }
  document.addEventListener('bq:lang', () => { splitAll(); $$('[data-split]').forEach((el) => el.closest('[data-reveal]') || el.classList.add('is-in')); });

  window.BQ = window.BQ || {};
  window.BQ.motion = motion;
  motion.clamp = clamp;
  motion.init = init;
})();
