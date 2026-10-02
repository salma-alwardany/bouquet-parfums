/* =====================================================================
   بوكيه — الصفحة الرئيسية  |  Bouquet — home page sections
   ===================================================================== */
(function () {
  'use strict';

  const { $, $$, esc, I, card, pyramid, img, price, url, fam, sub, subLang, lineArt } = BQ.ui;
  const store = BQ.store;
  const cfg = window.BQ_CONFIG || {};
  const t = (k, v) => BQ.i18n.t(k, v);
  const L = (o) => BQ.i18n.L(o);
  const reduce = BQ.motion.reduce;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const EASE = 'cubic-bezier(.2,.7,.1,1)';

  const state = { family: 'all', journey: cfg.journeyDefault || store.products()[0].id };

  // ------------------------------------------------------- collection
  function renderCollection() {
    const ids = (cfg.collection || []).filter((id) => store.product(id));
    const grid = $('#collectionGrid');
    grid.innerHTML = ids.map((id, i) => card(store.product(id), {
      variant: i === 0 ? 'feature' : 'side',
      sizes: i === 0 ? '(max-width: 900px) 82vw, 56vw' : '(max-width: 900px) 82vw, 32vw',
    })).join('');
  }

  // ------------------------------------------------------- discovery
  function renderFilters() {
    const fams = Object.keys(BQ_FAMILIES);
    const count = (f) => store.products().filter((p) => f === 'all' || p.families.includes(f)).length;
    $('#filters').innerHTML = ['all', ...fams].map((f) => {
      const label = f === 'all' ? t('disc.all') : L(BQ_FAMILIES[f]);
      const ar = BQ.i18n.lang === 'ar';
      const second = f === 'all' ? (ar ? 'ALL' : 'الكل') : (ar ? BQ_FAMILIES[f].en.toUpperCase() : BQ_FAMILIES[f].ar);
      return `<button class="filter${state.family === f ? ' is-active' : ''}" type="button" data-family="${f}" aria-pressed="${state.family === f}">
        <span class="filter__main">${esc(label)}</span><span class="filter__second" lang="${ar ? 'en' : 'ar'}" dir="${ar ? 'ltr' : 'rtl'}">${second}<sup lang="en">${count(f)}</sup></span>
      </button>`;
    }).join('');
    setMood();
  }
  function setMood() {
    const m = $('#familyMood');
    const txt = state.family === 'all' ? t('disc.allMood') : L(BQ_FAMILIES[state.family].mood);
    m.classList.remove('is-in'); void m.offsetWidth;
    m.textContent = txt; m.classList.add('is-in');
  }
  function renderDiscover() {
    const grid = $('#discoverGrid');
    grid.innerHTML = store.products().map((p) => card(p, { variant: 'grid', sizes: '(max-width: 700px) 46vw, (max-width: 1100px) 31vw, 23vw' })).join('');
    applyFilter(state.family, true);
  }
  const shows = (id, f) => f === 'all' || store.product(id).families.includes(f);

  function applyFilter(f, instant) {
    const grid = $('#discoverGrid');
    const cards = $$('.pcard', grid);
    const empty = !cards.some((c) => shows(c.dataset.id, f));
    $('#discoverEmpty').hidden = !empty;
    if (instant || reduce) { cards.forEach((c) => { c.hidden = !shows(c.dataset.id, f); }); return; }

    const first = new Map(cards.filter((c) => !c.hidden).map((c) => [c, c.getBoundingClientRect()]));
    const leaving = cards.filter((c) => !c.hidden && !shows(c.dataset.id, f));
    leaving.forEach((c) => c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(14px) scale(.97)' }], { duration: 320, easing: 'ease-in', fill: 'forwards' }));
    grid.style.minHeight = grid.offsetHeight + 'px';

    setTimeout(() => {
      cards.forEach((c) => { c.hidden = !shows(c.dataset.id, f); c.getAnimations().forEach((a) => a.cancel()); });
      let n = 0;
      cards.filter((c) => !c.hidden).forEach((c) => {
        c.classList.add('is-in');
        const r = c.getBoundingClientRect(); const f0 = first.get(c);
        if (f0) {
          const dx = f0.left - r.left; const dy = f0.top - r.top;
          if (dx || dy) c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 900, easing: EASE });
        } else {
          c.animate([{ opacity: 0, transform: 'translateY(34px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 70 * n++, easing: EASE, fill: 'backwards' });
        }
      });
      grid.style.minHeight = '';
    }, leaving.length ? 330 : 0);
  }

  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-family]'); if (!b || b.dataset.family === state.family) return;
    state.family = b.dataset.family;
    $$('.filter', $('#filters')).forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on); });
    setMood();
    applyFilter(state.family);
  });

  // --------------------------------------------------------- journey
  function renderJourneyTabs() {
    $('#journeyTabs').innerHTML = store.products().map((p) => `
      <button class="jtab${p.id === state.journey ? ' is-active' : ''}" type="button" role="tab" id="jtab-${p.id}" aria-controls="journeyBody"
        aria-selected="${p.id === state.journey}" tabindex="${p.id === state.journey ? 0 : -1}" data-journey="${p.id}">
        <span class="jtab__num" lang="en">${p.number}</span><span class="jtab__name">${esc(L(p.name))}</span>
      </button>`).join('');
  }
  function journeyBodyHTML(p) {
    return `
      <div class="journey__product">
        <a class="journey__img" href="${url(p)}" data-cursor="view" tabindex="-1" aria-hidden="true">${img(p.images[0], { sizes: '(max-width: 900px) 70vw, 30vw' })}<span class="frame-lines"></span></a>
        <p class="journey__fam">${esc(fam(p))}</p>
        <h3 class="journey__name">${esc(L(p.name))}</h3>
        <p class="journey__sub" lang="${subLang()}">${esc(sub(p))}</p>
        <a class="link-u" href="${url(p)}"><span>${t('jour.view', { name: L(p.name) })}</span>${I.arrow}</a>
      </div>
      <div class="journey__pyr">${pyramid(p)}</div>`;
  }
  function renderJourney(animate) {
    const body = $('#journeyBody');
    const p = store.product(state.journey);
    body.setAttribute('aria-labelledby', `jtab-${p.id}`);
    const swap = () => {
      body.innerHTML = journeyBodyHTML(p);
      body.classList.remove('is-out');
      body.classList.add('is-play');
      $$('.lineart', body).forEach((s) => s.classList.add('is-drawn'));
    };
    if (!animate || reduce) { swap(); return; }
    body.classList.add('is-out'); body.classList.remove('is-play');
    setTimeout(swap, 380);
  }
  $('#journeyTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-journey]'); if (!b || b.dataset.journey === state.journey) return;
    selectJourney(b.dataset.journey, false);
  });
  $('#journeyTabs').addEventListener('keydown', (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']; if (!keys.includes(e.key)) return;
    e.preventDefault();
    const tabs = $$('.jtab'); const i = tabs.findIndex((x) => x.dataset.journey === state.journey);
    const rtl = document.documentElement.dir === 'rtl';
    let n = i;
    if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
    else n = (i + ((e.key === 'ArrowRight') !== rtl ? 1 : -1) + tabs.length) % tabs.length;
    selectJourney(tabs[n].dataset.journey, true);
  });
  function selectJourney(id, focus) {
    state.journey = id;
    $$('.jtab').forEach((x) => {
      const on = x.dataset.journey === id;
      x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      if (on) {
        if (focus) x.focus();
        const strip = $('#journeyTabs');
        const left = x.offsetLeft - (strip.clientWidth - x.offsetWidth) / 2;
        strip.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    renderJourney(true);
  }

  // -------------------------------------------------------- featured
  function renderFeatured() {
    const p = store.product(cfg.featured) || store.products()[0];
    const s = store.sizeOf(p, p.defaultSize);
    const ph = p.placeholder ? ' data-ph' : '';
    const notes = ['top', 'heart', 'base'].map((k) => `<div class="fnotes__row"><dt lang="en">${k.toUpperCase()}</dt><dd${ph}>${p.notes[k].map((n) => esc(L(BQ_NOTES[n]))).join(' · ')}</dd></div>`).join('');
    $('#featuredInner').innerHTML = `
      <span class="featured__spot" aria-hidden="true"></span>
      ${lineArt('full', 'featured__art')}
      <img class="featured__bloom featured__bloom--a" src="assets/brand/flower.webp" alt="" width="657" height="514" loading="lazy" data-parallax="0.18" aria-hidden="true">
      <img class="featured__bloom featured__bloom--b" src="assets/brand/flower.webp" alt="" width="657" height="514" loading="lazy" data-parallax="-0.12" aria-hidden="true">
      <img class="featured__bloom featured__bloom--c" src="assets/brand/flower.webp" alt="" width="657" height="514" loading="lazy" data-parallax="0.3" aria-hidden="true">
      <div class="container featured__grid">
        <div class="featured__info" data-reveal>
          <p class="eyebrow eyebrow--gold" lang="en">THE SIGNATURE · N° ${p.number}</p>
          <h2 class="featured__name" id="featName"${ph}>${esc(L(p.name))}</h2>
          <p class="featured__sub" lang="${subLang()}"${ph}>${esc(sub(p))}</p>
          <p class="featured__desc"${ph}>${esc(L(p.short))}</p>
          <p class="featured__price">${price(s.price, p.placeholder)} <span${ph}>· ${s.ml} ${t('ml')} · ${esc(L(p.concentration))}</span></p>
          <div class="featured__cta">
            <a class="btn btn--ivory" href="${url(p)}"><span>${t('card.discover')}</span></a>
            <button class="btn btn--line-light" type="button" data-add="${p.id}" data-ml="${s.ml}">${I.bag}<span>${t('card.add')}</span></button>
          </div>
        </div>
        <figure class="featured__arch" data-reveal>
          <span class="featured__halo" aria-hidden="true"></span>
          <a class="arch" href="${url(p)}" data-cursor="view" tabindex="-1" aria-hidden="true">
            <span class="arch__img" data-parallax="0.06">${img(p.images[0], { sizes: '(max-width: 900px) 70vw, 28vw', alt: '' })}</span>
          </a>
          <span class="arch__lines" aria-hidden="true"></span>
        </figure>
        <div class="featured__notes" data-reveal>
          <p class="eyebrow eyebrow--gold" lang="en">NOTES</p>
          <p class="featured__notes-ar" lang="ar">${t('feat.notes')}</p>
          <dl class="fnotes">${notes}</dl>
        </div>
      </div>`;
  }

  // ------------------------------------------- signature: flower → bottle
  function initSignature() {
    const sec = $('#signature'); const stage = $('.signature__stage');
    if (!sec) return;
    const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const set = (p) => {
      const v = {
        fi: ease(seg(p, 0.0, 0.22)),       // flower in
        fo: ease(seg(p, 0.36, 0.6)),       // flower out
        sp: ease(seg(p, 0.08, 0.7)),       // petals spread
        bi: ease(seg(p, 0.4, 0.72)),       // bottle in
        l1: seg(p, 0.04, 0.18) * (1 - seg(p, 0.34, 0.46)),
        l2: seg(p, 0.56, 0.7),
        cap: seg(p, 0.7, 0.84),
      };
      for (const k in v) stage.style.setProperty('--' + k, v[k].toFixed(4));
    };
    if (reduce) { sec.classList.add('is-static'); set(0.86); return; }
    BQ.motion.onScroll(() => {
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (r.bottom < -50 || r.top > window.innerHeight + 50) return;
      set(clamp(-r.top / total, 0, 1));
    });
  }

  // ------------------------------------------------------------ init
  function renderAll() {
    renderCollection();
    renderFilters();
    renderDiscover();
    renderJourneyTabs();
    renderJourney(false);
    renderFeatured();
  }
  renderAll();
  initSignature();
  BQ.motion.init();

  document.addEventListener('bq:lang', () => {
    renderAll();
    $$('#collectionGrid .pcard, #discoverGrid .pcard, #featuredInner [data-reveal]').forEach((c) => c.classList.add('is-in'));
    BQ.motion.refresh();
  });
})();
