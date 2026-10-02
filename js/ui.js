/* =====================================================================
   بوكيه — مكوّنات الواجهة المشتركة
   Bouquet — shared UI: header, menu, search, cart & wishlist drawers,
   footer, product card, fragrance pyramid, toasts.
   ===================================================================== */
(function () {
  'use strict';

  const cfg = window.BQ_CONFIG || {};
  const i18n = BQ.i18n;
  const store = BQ.store;
  const t = (k, v) => i18n.t(k, v);
  const L = (o) => i18n.L(o);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = document.body.dataset.page || 'home';
  const home = page === 'home' ? '' : 'index.html';

  // ---------------------------------------------------------------- icons
  const svg = (body, extra = '') => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>`;
  const I = {
    search: svg('<circle cx="10.8" cy="10.8" r="6.3"/><path d="M20 20l-4.6-4.6"/>'),
    user: svg('<circle cx="12" cy="8.3" r="3.7"/><path d="M4.6 20.2c1.2-3.7 4-5.6 7.4-5.6s6.2 1.9 7.4 5.6"/>'),
    heart: svg('<path d="M12 19.6s-7.4-4.5-7.4-10a4.1 4.1 0 0 1 7.4-2.4 4.1 4.1 0 0 1 7.4 2.4c0 5.5-7.4 10-7.4 10z"/>'),
    bag: svg('<path d="M5.2 8.4h13.6l-1.1 11.8H6.3z"/><path d="M8.8 8.4V7a3.2 3.2 0 0 1 6.4 0v1.4"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    plus: svg('<path d="M12 6v12M6 12h12"/>'),
    minus: svg('<path d="M6 12h12"/>'),
    arrow: svg('<path d="M4 12h15.5M14.5 7l5 5-5 5"/>', 'data-flip'),
    check: svg('<path d="M5 12.5l4.2 4.2L19 7"/>'),
    whatsapp: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12.04 2.5a9.44 9.44 0 0 0-8.1 14.3L2.6 21.5l4.83-1.27a9.44 9.44 0 1 0 4.61-17.73zm0 17.2a7.8 7.8 0 0 1-3.97-1.09l-.28-.17-2.87.75.77-2.8-.19-.29a7.8 7.8 0 1 1 6.54 3.6zm4.28-5.84c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.74.92-.13.15-.27.17-.5.06a6.4 6.4 0 0 1-3.2-2.8c-.24-.41.24-.38.69-1.27.08-.15.04-.29-.02-.4-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.3 2.6 2.6 0 0 0-.81 1.93 4.52 4.52 0 0 0 .95 2.4c.12.15 1.64 2.5 3.97 3.51 1.48.64 2.06.69 2.8.58.45-.07 1.38-.56 1.57-1.1.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.44-.27z"/></svg>',
    instagram: svg('<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.8"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>'),
    facebook: svg('<path d="M14.2 20.4v-7.2h2.4l.4-2.8h-2.8V8.7c0-.8.3-1.4 1.4-1.4h1.5V4.8a19 19 0 0 0-2.2-.1c-2.2 0-3.6 1.3-3.6 3.7v2h-2.4v2.8h2.4v7.2"/>'),
    tiktok: svg('<path d="M14.6 3.8v10.7a3.6 3.6 0 1 1-3.1-3.6"/><path d="M14.6 3.8c.4 2.4 2 3.9 4.6 4.1"/>'),
  };

  // ------------------------------------------------------------ helpers
  const nf = new Intl.NumberFormat('en-US');
  function money(n) {
    const c = L(cfg.currency);
    return i18n.lang === 'ar' ? `${nf.format(n)} ${c}` : `${c} ${nf.format(n)}`;
  }
  function price(n, ph) {
    if (!cfg.showPrices) return `<span class="price price--req">${t('priceOnRequest')}</span>`;
    return `<span class="price"${ph ? ' data-ph' : ''}>${money(n)}</span>`;
  }
  const url = (p) => `product.html?p=${encodeURIComponent(p.id)}`;
  const fam = (p) => p.families.map((f) => L(BQ_FAMILIES[f])).join(' · ');
  const sub = (p) => (i18n.lang === 'ar' ? p.latin : p.name.ar);
  const subLang = () => (i18n.lang === 'ar' ? 'fr' : 'ar');

  function img(name, o = {}) {
    const sizes = o.sizes || '(max-width: 700px) 88vw, 40vw';
    const load = o.eager ? 'fetchpriority="high"' : 'loading="lazy"';
    return `<img${o.cls ? ` class="${o.cls}"` : ''} src="assets/img/${name}-864.webp" srcset="assets/img/${name}-560.webp 560w, assets/img/${name}-864.webp 864w" sizes="${sizes}" width="864" height="1080" alt="${esc(o.alt || '')}" ${load} decoding="async">`;
  }

  // ------------------------------------------------ line-art (logo flower)
  function mountLineSprite() {
    if ($('#bq-line-sprite') || !window.BQ_LINEART) return;
    const A = window.BQ_LINEART;
    const paths = A.paths.map((d) => `<path d="${d}" pathLength="1"/>`).join('')
      + A.stamens.map((d) => `<path d="${d}" pathLength="1"/>`).join('')
      + A.dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" pathLength="1"/>`).join('');
    const holder = document.createElement('div');
    holder.innerHTML = `<svg id="bq-line-sprite" width="0" height="0" style="position:absolute" aria-hidden="true"><defs><g id="bq-line">${paths}</g></defs></svg>`;
    document.body.prepend(holder.firstChild);
  }
  // viewBox crops: full, flower head, top sprig, lower leaves, right buds
  const VB = { full: '-6 -6 669 526', flower: '215 70 290 285', top: '60 -4 190 200', base: '150 320 200 200', buds: '480 150 180 300' };
  const lineArt = (crop = 'full', cls = '') => `<svg class="lineart ${cls}" viewBox="${VB[crop] || crop}" aria-hidden="true" focusable="false"><use href="#bq-line"/></svg>`;

  // ------------------------------------------------------- product card
  function card(p, o = {}) {
    const variant = o.variant || 'default';
    const s = store.sizeOf(p, p.defaultSize);
    const w = store.isWished(p.id);
    const ph = p.placeholder ? ' data-ph' : '';
    return `
<article class="pcard pcard--${variant}" style="--accent:${p.accent}" data-id="${p.id}"${o.reveal !== false ? ' data-reveal' : ''}>
  <div class="pcard__frame">
    <a class="pcard__media" href="${url(p)}" data-cursor="view" tabindex="-1" aria-hidden="true">
      ${img(p.images[0], { sizes: o.sizes, eager: o.eager })}
      <span class="pcard__petals" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    </a>
    <span class="pcard__num" lang="en" dir="ltr">N° ${p.number}</span>
    <button class="wish-btn${w ? ' is-on' : ''}" type="button" data-wish="${p.id}" aria-pressed="${w}" aria-label="${esc(t(w ? 'card.wishRemove' : 'card.wishAdd'))} — ${esc(L(p.name))}">${I.heart}</button>
    <div class="pcard__reveal">
      <p class="pcard__desc"${ph}>${esc(L(p.short))}</p>
      <div class="pcard__actions">
        <a class="link-u" href="${url(p)}"><span>${t('card.discover')}</span>${I.arrow}</a>
        <button class="btn btn--primary btn--sm" type="button" data-add="${p.id}" data-ml="${s.ml}">${I.bag}<span>${t('card.add')}</span></button>
      </div>
    </div>
  </div>
  <div class="pcard__body">
    <p class="pcard__family"${ph}>${esc(fam(p))}</p>
    <h3 class="pcard__name"><a href="${url(p)}"${ph}>${esc(L(p.name))}</a></h3>
    <p class="pcard__sub" lang="${subLang()}"${ph}>${esc(sub(p))}</p>
    <p class="pcard__price">${price(s.price, p.placeholder)}<span class="pcard__size"${ph}> · ${s.ml} ${t('ml')}</span></p>
  </div>
</article>`;
  }

  // ----------------------------------------------- fragrance pyramid
  function pyramid(p) {
    const ph = p.placeholder ? ' data-ph' : '';
    const tiers = [['top', 'I', 'TOP NOTES', 'top'], ['heart', 'II', 'HEART NOTES', 'flower'], ['base', 'III', 'BASE NOTES', 'base']];
    return `<div class="pyr" data-pyr="${p.id}">${tiers.map(([k, num, en, crop], i) => `
  <div class="pyr__tier pyr__tier--${k}" style="--i:${i}">
    ${lineArt(crop, 'pyr__art')}
    <p class="pyr__head" lang="en" dir="ltr"><span class="pyr__num">${num}</span><span class="pyr__en">${en}</span></p>
    <h3 class="pyr__label">${t('jour.' + k)}</h3>
    <p class="pyr__hint">${t('jour.' + k + 'Hint')}</p>
    <ul class="pyr__notes"${ph}>${p.notes[k].map((n, j) => `<li style="--j:${j}">${esc(L(BQ_NOTES[n]))}</li>`).join('')}</ul>
  </div>${i < 2 ? '<div class="pyr__flow" aria-hidden="true"><span></span></div>' : ''}`).join('')}
</div>`;
  }

  // ------------------------------------------------------------ layout
  function navLinks(cls) {
    const items = [['#top', 'nav.home'], ['#collection', 'nav.collection'], ['#discover', 'nav.discover'], ['#story', 'nav.story'], ['#contact', 'nav.contact']];
    return items.map(([h, k], i) => `<li><a class="${cls}" href="${h === '#contact' && page !== 'checkout' ? '#contact' : (home || (h === '#contact' ? 'index.html' : '')) + h}" data-nav="${h.slice(1)}"><span class="${cls}-num" lang="en">0${i + 1}</span><span data-i18n="${k}">${t(k)}</span></a></li>`).join('');
  }

  function headerHTML() {
    return `
<a class="skip-link" href="#main" data-i18n="skip">${t('skip')}</a>
<header class="site-header" id="siteHeader">
  <div class="site-header__bar">
    <a class="brandmark" href="${home || '#top'}" aria-label="Bouquet Parfums — ${t('nav.home')}">
      <img src="assets/brand/flower.webp" alt="" width="40" height="31">
      <span class="brandmark__word" lang="en">BOUQUET</span>
    </a>
    <nav class="site-nav" data-i18n-attr="aria-label:nav.main" aria-label="${t('nav.main')}"><ul>${navLinks('site-nav__link')}</ul></nav>
    <div class="site-tools">
      <button class="lang-btn" type="button" data-lang-toggle data-i18n-attr="aria-label:lang.switchLabel" aria-label="${t('lang.switchLabel')}"><span data-i18n="lang.switch">${t('lang.switch')}</span></button>
      <button class="icon-btn" type="button" data-open="search" data-i18n-attr="aria-label:nav.search" aria-label="${t('nav.search')}">${I.search}</button>
      <a class="icon-btn hide-sm" href="account.html" data-i18n-attr="aria-label:nav.account" aria-label="${t('nav.account')}">${I.user}</a>
      <button class="icon-btn hide-sm" type="button" data-open="wish" data-i18n-attr="aria-label:nav.wishlist" aria-label="${t('nav.wishlist')}">${I.heart}<span class="badge" data-wish-count hidden></span></button>
      <button class="icon-btn" type="button" data-open="cart" data-i18n-attr="aria-label:nav.cart" aria-label="${t('nav.cart')}">${I.bag}<span class="badge" data-cart-count hidden></span></button>
      <button class="icon-btn menu-btn" type="button" data-open="menu" aria-expanded="false" aria-controls="menuPanel" data-i18n-attr="aria-label:nav.menu" aria-label="${t('nav.menu')}"><span class="menu-lines"><i></i><i></i></span></button>
    </div>
  </div>
</header>`;
  }

  function overlaysHTML() {
    return `
<div class="scrim" data-close aria-hidden="true"></div>

<div class="menu-panel overlay" id="menuPanel" role="dialog" aria-modal="true" data-i18n-attr="aria-label:nav.menu" aria-label="${t('nav.menu')}" data-overlay="menu" inert>
  ${lineArt('full', 'menu-panel__art')}
  <button class="icon-btn overlay__close" type="button" data-close data-i18n-attr="aria-label:close" aria-label="${t('close')}">${I.close}</button>
  <nav class="menu-panel__nav"><ol>${navLinks('menu-link')}</ol></nav>
  <div class="menu-panel__tools">
    <a href="account.html">${I.user}<span data-i18n="nav.account">${t('nav.account')}</span></a>
    <button type="button" data-open="wish">${I.heart}<span data-i18n="nav.wishlist">${t('nav.wishlist')}</span></button>
    <button type="button" data-lang-toggle><span lang="en">EN</span> / <span lang="ar">عربي</span></button>
  </div>
  <p class="menu-panel__sig" lang="en" dir="ltr">BOUQUET — PARFUMS • <span lang="ar">عطور</span></p>
</div>

<div class="search-panel overlay" id="searchPanel" role="dialog" aria-modal="true" data-i18n-attr="aria-label:search.label" aria-label="${t('search.label')}" data-overlay="search" inert>
  <div class="search-panel__inner">
    <div class="search-field">
      ${I.search}
      <label class="sr-only" for="searchInput" data-i18n="search.label">${t('search.label')}</label>
      <input id="searchInput" type="search" autocomplete="off" spellcheck="false" data-i18n-attr="placeholder:search.ph" placeholder="${t('search.ph')}">
      <button class="icon-btn" type="button" data-close data-i18n-attr="aria-label:close" aria-label="${t('close')}">${I.close}</button>
    </div>
    <div class="search-suggest" id="searchSuggest"></div>
    <div class="search-results" id="searchResults" aria-live="polite"></div>
  </div>
</div>

<aside class="drawer overlay" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" data-overlay="cart" inert>
  <header class="drawer__head">
    <h2 id="cartTitle" data-i18n="cart.title">${t('cart.title')}</h2>
    <span class="drawer__count" id="cartCountLabel"></span>
    <button class="icon-btn" type="button" data-close data-i18n-attr="aria-label:close" aria-label="${t('close')}">${I.close}</button>
  </header>
  <div class="drawer__body" id="cartBody"></div>
  <footer class="drawer__foot" id="cartFoot"></footer>
</aside>

<aside class="drawer overlay" id="wishDrawer" role="dialog" aria-modal="true" aria-labelledby="wishTitle" data-overlay="wish" inert>
  <header class="drawer__head">
    <h2 id="wishTitle" data-i18n="wish.title">${t('wish.title')}</h2>
    <span class="drawer__count" id="wishCountLabel"></span>
    <button class="icon-btn" type="button" data-close data-i18n-attr="aria-label:close" aria-label="${t('close')}">${I.close}</button>
  </header>
  <div class="drawer__body" id="wishBody"></div>
</aside>

<div class="toast" id="toast" role="status" aria-live="polite"></div>
${cfg.previewBadge ? `<button class="ph-pill" type="button" aria-pressed="false" data-ph-toggle data-i18n-attr="title:ph.hint" title="${t('ph.hint')}"><i></i><span data-i18n="ph.badge">${t('ph.badge')}</span></button>` : ''}`;
  }

  function socialLinks() {
    const s = cfg.social || {};
    const item = (key, icon, label) => {
      const href = s[key];
      return `<a class="social" href="${href ? esc(href) : '#'}" ${href ? 'target="_blank" rel="noopener"' : 'data-ph'} aria-label="${label}">${icon}</a>`;
    };
    return item('instagram', I.instagram, 'Instagram') + item('facebook', I.facebook, 'Facebook') + item('tiktok', I.tiktok, 'TikTok')
      + `<a class="social" href="https://wa.me/${cfg.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp}</a>`;
  }

  function footerHTML() {
    const y = new Date().getFullYear();
    return `
<footer class="site-footer" id="contact">
  ${lineArt('full', 'site-footer__art')}
  <div class="container">
    <section class="news" aria-labelledby="newsTitle">
      <p class="eyebrow eyebrow--gold" lang="en">THE BOUQUET LETTER</p>
      <h2 class="news__title" id="newsTitle" data-i18n="foot.newsTitle">${t('foot.newsTitle')}</h2>
      <p class="news__lead" data-i18n="foot.newsLead">${t('foot.newsLead')}</p>
      <form class="news__form" id="newsForm" novalidate>
        <label class="sr-only" for="newsEmail" data-i18n="foot.email">${t('foot.email')}</label>
        <div class="news__row">
          <input id="newsEmail" type="email" inputmode="email" autocomplete="email" required data-i18n-attr="placeholder:foot.email" placeholder="${t('foot.email')}">
          <button class="btn btn--ivory" type="submit"><span data-i18n="foot.subscribe">${t('foot.subscribe')}</span></button>
        </div>
        <p class="news__msg" id="newsMsg" role="status" aria-live="polite"></p>
      </form>
    </section>

    <div class="foot-grid">
      <div class="foot-brand">
        <a class="foot-emblem" href="${home || '#top'}" aria-label="Bouquet Parfums">
          <img src="assets/brand/bouquet-logo-880.webp" alt="" width="880" height="880" loading="lazy" decoding="async">
        </a>
        <p class="foot-brand__en" lang="en">BOUQUET</p>
        <p class="foot-brand__ar" lang="ar">بوكيه</p>
        <p class="foot-brand__tag" lang="en" dir="ltr">PARFUMS <i>•</i> <span lang="ar">عطور</span></p>
      </div>
      <nav class="foot-col" aria-labelledby="footExplore">
        <h3 id="footExplore" data-i18n="foot.explore">${t('foot.explore')}</h3>
        <ul>
          <li><a class="link-u" href="${home}#top" data-i18n="nav.home">${t('nav.home')}</a></li>
          <li><a class="link-u" href="${home}#collection" data-i18n="nav.collection">${t('nav.collection')}</a></li>
          <li><a class="link-u" href="${home}#discover" data-i18n="nav.discover">${t('nav.discover')}</a></li>
          <li><a class="link-u" href="${home}#story" data-i18n="nav.story">${t('nav.story')}</a></li>
          <li><a class="link-u" href="account.html" data-i18n="nav.account">${t('nav.account')}</a></li>
        </ul>
      </nav>
      <nav class="foot-col" aria-labelledby="footCare">
        <h3 id="footCare" data-i18n="foot.care">${t('foot.care')}</h3>
        <ul>
          <li><a class="link-u" href="policies.html#service" data-i18n="foot.service">${t('foot.service')}</a></li>
          <li><a class="link-u" href="policies.html#shipping" data-i18n="foot.shipping">${t('foot.shipping')}</a></li>
          <li><a class="link-u" href="policies.html#privacy" data-i18n="foot.privacy">${t('foot.privacy')}</a></li>
          <li><a class="link-u" href="policies.html#terms" data-i18n="foot.terms">${t('foot.terms')}</a></li>
        </ul>
      </nav>
      <div class="foot-col">
        <h3 data-i18n="foot.follow">${t('foot.follow')}</h3>
        <div class="socials">${socialLinks()}</div>
        <a class="foot-wa link-u" href="https://wa.me/${cfg.whatsapp}" target="_blank" rel="noopener"><span data-i18n="foot.whatsapp">${t('foot.whatsapp')}</span> <span dir="ltr">+${cfg.whatsapp}</span></a>
      </div>
    </div>

    <div class="foot-bottom">
      <p data-rights data-y="${y}">${t('foot.rights', { y })}</p>
      <button class="lang-btn lang-btn--light" type="button" data-lang-toggle><span lang="en">English</span> · <span lang="ar">العربية</span></button>
    </div>
  </div>
</footer>`;
  }

  // -------------------------------------------------------- overlays
  let current = null; let lastFocus = null;
  const focusables = (el) => $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null);

  function open(name) {
    const el = $(`[data-overlay="${name}"]`);
    if (!el) return;
    if (current && current !== el) close(true);
    lastFocus = lastFocus || document.activeElement;
    current = el;
    el.inert = false;
    el.classList.add('is-open');
    document.documentElement.classList.add('is-locked', 'has-overlay');
    $('.scrim').classList.toggle('is-on', name !== 'menu');
    if (BQ.motion && BQ.motion.lenis) BQ.motion.lenis.stop();
    const mb = $('.menu-btn'); if (mb) mb.setAttribute('aria-expanded', name === 'menu');
    if (name === 'cart') renderCart();
    if (name === 'wish') renderWish();
    if (name === 'search') renderSearch();
    setTimeout(() => {
      const target = name === 'search' ? $('#searchInput') : focusables(el)[0];
      if (target) target.focus({ preventScroll: true });
    }, 60);
  }
  function close(switching) {
    if (!current) return;
    current.classList.remove('is-open');
    current.inert = true;
    current = null;
    $('.scrim').classList.remove('is-on');
    const mb = $('.menu-btn'); if (mb) mb.setAttribute('aria-expanded', 'false');
    if (switching === true) return;
    document.documentElement.classList.remove('is-locked', 'has-overlay');
    if (BQ.motion && BQ.motion.lenis) BQ.motion.lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  document.addEventListener('keydown', (e) => {
    if (!current) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      const f = focusables(current); if (!f.length) return;
      const first = f[0]; const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ------------------------------------------------------------ cart
  function renderCart() {
    const body = $('#cartBody'); const foot = $('#cartFoot'); if (!body) return;
    const lines = store.cart();
    $('#cartCountLabel').textContent = lines.length ? t('cart.count', { n: store.cartCount() }) : '';
    if (!lines.length) {
      body.innerHTML = `<div class="drawer__empty">${lineArt('flower', 'drawer__art')}<p>${t('cart.empty')}</p><a class="btn btn--line" href="${home}#discover" data-close-link>${t('cart.emptyCta')}</a></div>`;
      foot.innerHTML = ''; foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = `<ul class="lines">${lines.map(lineHTML).join('')}</ul>`;
    foot.innerHTML = `
      <div class="sum-row"><span>${t('cart.subtotal')}</span><strong>${cfg.showPrices ? money(store.cartSubtotal()) : t('priceOnRequest')}</strong></div>
      <p class="drawer__note">${t('cart.shipNote')}</p>
      <a class="btn btn--primary btn--block" href="checkout.html"><span>${t('cart.checkout')}</span>${I.arrow}</a>
      <button class="link-u drawer__continue" type="button" data-close>${t('cart.continue')}</button>`;
  }
  function lineHTML(l) {
    const p = l.product;
    return `<li class="line" data-key="${l.key}">
      <a class="line__img" href="${url(p)}" tabindex="-1" aria-hidden="true">${img(p.images[0], { sizes: '96px' })}</a>
      <div class="line__info">
        <p class="line__name"><a href="${url(p)}">${esc(L(p.name))}</a></p>
        <p class="line__meta"><span lang="${subLang()}">${esc(sub(p))}</span> · ${l.ml} ${t('ml')}</p>
        <div class="line__row">
          ${qtyHTML(l.key, l.qty)}
          <span class="line__price">${cfg.showPrices ? money(l.total) : ''}</span>
        </div>
        <button class="line__remove" type="button" data-remove="${l.key}">${t('cart.remove')}</button>
      </div>
    </li>`;
  }
  function qtyHTML(key, qty) {
    return `<div class="qty" role="group" aria-label="${t('cart.qty')}">
      <button type="button" data-qty="${key}" data-delta="-1" aria-label="${t('cart.dec')}">${I.minus}</button>
      <output aria-live="polite">${qty}</output>
      <button type="button" data-qty="${key}" data-delta="1" aria-label="${t('cart.inc')}">${I.plus}</button>
    </div>`;
  }

  // ------------------------------------------------------- wishlist
  function renderWish() {
    const body = $('#wishBody'); if (!body) return;
    const list = store.wishlist();
    $('#wishCountLabel').textContent = list.length ? String(list.length) : '';
    if (!list.length) {
      body.innerHTML = `<div class="drawer__empty">${lineArt('top', 'drawer__art')}<p>${t('wish.empty')}</p><a class="btn btn--line" href="${home}#discover" data-close-link>${t('cart.emptyCta')}</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="lines">${list.map((p) => {
      const s = store.sizeOf(p, p.defaultSize);
      return `<li class="line">
        <a class="line__img" href="${url(p)}" tabindex="-1" aria-hidden="true">${img(p.images[0], { sizes: '96px' })}</a>
        <div class="line__info">
          <p class="line__name"><a href="${url(p)}">${esc(L(p.name))}</a></p>
          <p class="line__meta">${esc(fam(p))} · ${s.ml} ${t('ml')}</p>
          <div class="line__row">
            <button class="btn btn--line btn--sm" type="button" data-add="${p.id}" data-ml="${s.ml}">${I.bag}<span>${t('card.add')}</span></button>
            <span class="line__price">${cfg.showPrices ? money(s.price) : ''}</span>
          </div>
          <button class="line__remove" type="button" data-wish="${p.id}">${t('card.wishRemove')}</button>
        </div>
      </li>`;
    }).join('')}</ul>`;
  }

  // ---------------------------------------------------------- search
  const norm = (s) => String(s || '').toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  function haystack(p) {
    const notes = [...p.notes.top, ...p.notes.heart, ...p.notes.base].map((n) => `${BQ_NOTES[n].ar} ${BQ_NOTES[n].en}`).join(' ');
    const fams = p.families.map((f) => `${BQ_FAMILIES[f].ar} ${BQ_FAMILIES[f].en}`).join(' ');
    return norm(`${p.name.ar} ${p.name.en} ${p.latin} ${fams} ${notes} ${p.short.ar} ${p.short.en}`);
  }
  function renderSearch() {
    const sug = $('#searchSuggest');
    const chips = [...Object.keys(BQ_FAMILIES).map((f) => L(BQ_FAMILIES[f])), ...['damaskRose', 'oud', 'whiteMusk', 'jasmine', 'vanilla'].map((n) => L(BQ_NOTES[n]))];
    sug.innerHTML = `<p class="search-suggest__label">${t('search.suggest')}</p><div class="chips">${chips.map((c) => `<button class="chip" type="button" data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div>`;
    runSearch();
  }
  function runSearch() {
    const input = $('#searchInput'); const box = $('#searchResults'); if (!input) return;
    const q = input.value.trim();
    if (!q) { box.innerHTML = ''; return; }
    const words = norm(q).split(/\s+/).filter(Boolean);
    const res = store.products().filter((p) => { const h = haystack(p); return words.every((w) => h.includes(w)); });
    if (!res.length) { box.innerHTML = `<p class="search-none">${t('search.none', { q: esc(q) })}</p>`; return; }
    box.innerHTML = `<p class="search-count">${t('search.count', { n: res.length })}</p><ul class="search-list">${res.map((p) => {
      const s = store.sizeOf(p, p.defaultSize);
      return `<li><a class="search-item" href="${url(p)}">
        <span class="search-item__img">${img(p.images[0], { sizes: '80px' })}</span>
        <span class="search-item__txt"><strong>${esc(L(p.name))}</strong><em lang="${subLang()}">${esc(sub(p))}</em><small>${esc(fam(p))}</small></span>
        <span class="search-item__price">${cfg.showPrices ? money(s.price) : ''}</span>
      </a></li>`;
    }).join('')}</ul>`;
  }

  // ----------------------------------------------------------- toast
  let toastTimer;
  function toast(msg, action) {
    const el = $('#toast'); if (!el) return;
    el.innerHTML = `<img src="assets/brand/flower.webp" alt="" width="30" height="23"><span>${esc(msg)}</span>${action ? `<button type="button" class="link-u" data-open="${action.open}">${esc(action.label)}</button>` : ''}`;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 3800);
  }

  // ---------------------------------------------------------- counts
  function syncCounts() {
    const c = store.cartCount(); const w = store.wishlist().length;
    $$('[data-cart-count]').forEach((b) => { b.textContent = c; b.hidden = !c; });
    $$('[data-wish-count]').forEach((b) => { b.textContent = w; b.hidden = !w; });
  }
  function syncWishButtons() {
    $$('[data-wish]').forEach((b) => {
      if (b.classList.contains('line__remove')) return;
      const on = store.isWished(b.dataset.wish);
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
      const p = store.product(b.dataset.wish);
      if (b.classList.contains('wish-btn') && p) b.setAttribute('aria-label', `${t(on ? 'card.wishRemove' : 'card.wishAdd')} — ${L(p.name)}`);
      const lbl = b.querySelector('[data-wish-label]');
      if (lbl) lbl.textContent = t(on ? 'pdp.wishOn' : 'pdp.wishAdd');
    });
  }
  function bump() {
    const b = $('[data-open="cart"]'); if (!b) return;
    b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump');
  }

  // --------------------------------------------------------- events
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-add],[data-wish],[data-open],[data-close],[data-close-link],[data-lang-toggle],[data-qty],[data-remove],[data-q],[data-ph-toggle],a[href]');
    if (!el) return;

    if (el.matches('[data-add]')) {
      const p = store.product(el.dataset.add); if (!p) return;
      const ml = Number(el.dataset.ml) || p.defaultSize;
      const qty = Number(el.dataset.qty) || 1;
      store.add(p.id, ml, qty);
      bump();
      el.classList.add('is-done'); setTimeout(() => el.classList.remove('is-done'), 1400);
      toast(t('toast.added', { name: L(p.name) }), { open: 'cart', label: t('toast.view') });
      return;
    }
    if (el.matches('[data-wish]')) {
      const p = store.product(el.dataset.wish); if (!p) return;
      const on = store.toggleWish(p.id);
      toast(t(on ? 'toast.wishOn' : 'toast.wishOff', { name: L(p.name) }));
      return;
    }
    if (el.matches('[data-open]')) { e.preventDefault(); open(el.dataset.open); return; }
    if (el.matches('[data-close]')) { e.preventDefault(); close(); return; }
    if (el.matches('[data-close-link]')) { close(); return; }
    if (el.matches('[data-lang-toggle]')) { i18n.toggle(); return; }
    if (el.matches('[data-qty]')) {
      const line = store.cart().find((l) => l.key === el.dataset.qty);
      if (line) store.setQty(line.key, line.qty + Number(el.dataset.delta));
      return;
    }
    if (el.matches('[data-remove]')) { store.remove(el.dataset.remove); return; }
    if (el.matches('[data-q]')) { const i = $('#searchInput'); i.value = el.dataset.q; runSearch(); i.focus(); return; }
    if (el.matches('[data-ph-toggle]')) {
      const on = document.documentElement.classList.toggle('show-ph');
      el.setAttribute('aria-pressed', on);
      return;
    }
    // روابط داخل القوائم المفتوحة: أغلقيها أولًا
    if (current && el.matches('a[href]')) {
      const href = el.getAttribute('href');
      if (href && href.startsWith('#')) { close(); }
      else if (href && href.startsWith('index.html#') && page === 'home') { close(); }
    }
  });

  // ------------------------------------------------------ newsletter
  function bindNewsletter() {
    const f = $('#newsForm'); if (!f) return;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#newsEmail'); const msg = $('#newsMsg');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      if (!ok) { msg.textContent = t('foot.badEmail'); input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
      input.removeAttribute('aria-invalid');
      // PLACEHOLDER: اربطي النموذج بخدمة بريد (Mailchimp / Brevo…) لاستلام الاشتراكات فعليًا.
      try { const list = JSON.parse(localStorage.getItem('bq_news') || '[]'); list.push(input.value.trim()); localStorage.setItem('bq_news', JSON.stringify(list)); } catch (err) {}
      f.classList.add('is-sent'); msg.textContent = t('foot.thanks'); input.value = '';
    });
  }

  // ---------------------------------------------------------- header
  function bindHeader() {
    const h = $('#siteHeader');
    const onScroll = () => h.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // تمييز الرابط الحالي في الصفحة الرئيسية
    if (page !== 'home' || !('IntersectionObserver' in window)) return;
    const links = $$('[data-nav]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'collection', 'discover', 'story', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // ----------------------------------------------------------- mount
  function mount() {
    mountLineSprite();
    const hh = document.createElement('div'); hh.innerHTML = headerHTML();
    document.body.prepend(...hh.childNodes);
    const main = $('#main');
    if (main && page !== 'checkout') main.insertAdjacentHTML('afterend', footerHTML());
    else if (main) main.insertAdjacentHTML('afterend', `<footer class="mini-footer"><p data-rights data-y="${new Date().getFullYear()}">${t('foot.rights', { y: new Date().getFullYear() })}</p></footer>`);
    document.body.insertAdjacentHTML('beforeend', overlaysHTML());

    bindHeader();
    bindNewsletter();
    const si = $('#searchInput'); if (si) si.addEventListener('input', runSearch);
    syncCounts();
    document.documentElement.classList.remove('lang-pending');
  }

  document.addEventListener('bq:cart', () => { syncCounts(); if (current && current.id === 'cartDrawer') renderCart(); });
  document.addEventListener('bq:wish', () => { syncCounts(); syncWishButtons(); if (current && current.id === 'wishDrawer') renderWish(); });
  document.addEventListener('bq:lang', () => {
    $$('[data-rights]').forEach((el) => { el.textContent = t('foot.rights', { y: el.dataset.y }); });
    if (current && current.id === 'cartDrawer') renderCart();
    if (current && current.id === 'wishDrawer') renderWish();
    if (current && current.id === 'searchPanel') renderSearch();
  });

  // ------------------------------------------------ Egypt governorates
  const GOVS = [
    ['cairo', 'القاهرة', 'Cairo'], ['giza', 'الجيزة', 'Giza'], ['alex', 'الإسكندرية', 'Alexandria'], ['qalyubia', 'القليوبية', 'Qalyubia'],
    ['dakahlia', 'الدقهلية', 'Dakahlia'], ['sharqia', 'الشرقية', 'Sharqia'], ['gharbia', 'الغربية', 'Gharbia'], ['monufia', 'المنوفية', 'Monufia'],
    ['beheira', 'البحيرة', 'Beheira'], ['kafr', 'كفر الشيخ', 'Kafr El Sheikh'], ['damietta', 'دمياط', 'Damietta'], ['portsaid', 'بورسعيد', 'Port Said'],
    ['ismailia', 'الإسماعيلية', 'Ismailia'], ['suez', 'السويس', 'Suez'], ['fayoum', 'الفيوم', 'Faiyum'], ['benisuef', 'بني سويف', 'Beni Suef'],
    ['minya', 'المنيا', 'Minya'], ['assiut', 'أسيوط', 'Asyut'], ['sohag', 'سوهاج', 'Sohag'], ['qena', 'قنا', 'Qena'], ['luxor', 'الأقصر', 'Luxor'],
    ['aswan', 'أسوان', 'Aswan'], ['redsea', 'البحر الأحمر', 'Red Sea'], ['newvalley', 'الوادي الجديد', 'New Valley'], ['matrouh', 'مطروح', 'Matrouh'],
    ['nsinai', 'شمال سيناء', 'North Sinai'], ['ssinai', 'جنوب سيناء', 'South Sinai'],
  ];
  const govName = (id) => { const g = GOVS.find((x) => x[0] === id); return g ? (i18n.lang === 'ar' ? g[1] : g[2]) : ''; };
  const govOptions = (sel) => `<option value="">${t('co.govChoose')}</option>` + GOVS.map((g) => `<option value="${g[0]}"${g[0] === sel ? ' selected' : ''}>${i18n.lang === 'ar' ? g[1] : g[2]}</option>`).join('');

  window.BQ.ui = { $, $$, esc, I, money, price, url, fam, sub, subLang, img, card, pyramid, lineArt, qtyHTML, toast, open, close, bump, mount, syncWishButtons, govName, govOptions };

  mount();
  i18n.apply();
})();
