/* =====================================================================
   بوكيه — صفحة العطر  |  Bouquet — product detail page
   الرابط: product.html?p=<id>
   ===================================================================== */
(function () {
  'use strict';

  const { $, $$, esc, I, card, pyramid, price, money, fam, sub, subLang, lineArt } = BQ.ui;
  const store = BQ.store;
  const cfg = window.BQ_CONFIG || {};
  const t = (k, v) => BQ.i18n.t(k, v);
  const L = (o) => BQ.i18n.L(o);

  const id = new URLSearchParams(location.search).get('p');
  const p = store.product(id);
  const root = $('#pdpRoot');
  const state = { ml: p ? p.defaultSize : 0, qty: 1, img: 0 };

  function notFound() {
    root.innerHTML = `<div class="pdp-missing">${lineArt('flower')}<h1 class="sec-title">${t('pdp.notFound')}</h1><a class="btn btn--line" href="index.html#collection">${t('pdp.back')}</a></div>`;
    document.title = `${t('pdp.notFound')} | Bouquet`;
  }

  const imgTag = (name, sizes, alt, eager) => `<img src="assets/img/${name}-864.webp" srcset="assets/img/${name}-560.webp 560w, assets/img/${name}-864.webp 864w" sizes="${sizes}" width="864" height="1080" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

  function render() {
    const s = store.sizeOf(p, state.ml);
    const ph = p.placeholder ? ' data-ph' : '';
    const name = L(p.name);
    const notesMini = ['top', 'heart', 'base'].map((k) => `<div><dt lang="en">${k.toUpperCase()}</dt><dd${ph}>${p.notes[k].map((n) => esc(L(BQ_NOTES[n]))).join(BQ.i18n.lang === 'ar' ? '، ' : ', ')}</dd></div>`).join('');
    const wished = store.isWished(p.id);

    root.innerHTML = `
      <nav aria-label="breadcrumb"><ol class="crumbs">
        <li><a href="index.html">${t('pdp.home')}</a></li>
        <li><a href="index.html#collection">${t('pdp.collection')}</a></li>
        <li aria-current="page">${esc(name)}</li>
      </ol></nav>

      <div class="pdp">
        <div class="gallery" role="region" aria-label="${t('pdp.gallery')}">
          <div class="gallery__thumbs">${p.images.map((im, i) => `
            <button class="gallery__thumb" type="button" data-img="${i}" aria-current="${i === state.img}" aria-label="${t('pdp.imageN', { n: i + 1 })}">${imgTag(im, '80px', '')}</button>`).join('')}
          </div>
          <div class="gallery__main">
            <div class="gallery__slides" id="slides">${p.images.map((im, i) => `
              <div class="gallery__slide${i === state.img ? ' is-active' : ''}" data-slide="${i}">${imgTag(im, '(max-width: 1023px) 100vw, 52vw', i === 0 ? `${name} — ${p.latin}` : '', i === 0)}</div>`).join('')}
            </div>
            <span class="frame-lines" aria-hidden="true"></span>
          </div>
          <div class="gallery__dots" aria-hidden="true">${p.images.map((_, i) => `<span${i === state.img ? ' class="is-active"' : ''}></span>`).join('')}</div>
        </div>

        <div class="pdp__info" id="pdpInfo">
          <p class="pdp__num" lang="en" dir="ltr">N° ${p.number}</p>
          <h1 class="pdp__name"${ph}>${esc(name)}</h1>
          <p class="pdp__sub" lang="${subLang()}"${ph}>${esc(sub(p))}</p>
          <div class="pdp__tags"><span class="tag"${ph}>${esc(fam(p))}</span><span class="tag"${ph}>${esc(L(p.concentration))}</span></div>
          <p class="pdp__price" id="pdpPrice">${price(s.price, p.placeholder)}</p>
          <p class="pdp__desc"${ph}>${esc(L(p.description))}</p>
          <dl class="pdp__mini">${notesMini}</dl>

          <form id="buyForm" novalidate>
            <fieldset class="sizes-field" style="border:0;padding:0;margin:0">
              <legend class="opt-title">${t('pdp.size')}</legend>
              <div class="sizes">${p.sizes.map((z) => `
                <div class="size">
                  <input type="radio" name="size" id="size-${z.ml}" value="${z.ml}"${z.ml === state.ml ? ' checked' : ''}>
                  <label for="size-${z.ml}"${ph}><strong>${z.ml} ${t('ml')}</strong><small>${cfg.showPrices ? money(z.price) : '&nbsp;'}</small></label>
                </div>`).join('')}
              </div>
            </fieldset>
            <p class="opt-title" id="qtyLabel">${t('pdp.qty')}</p>
            <div class="pdp__buy">
              <div class="qty" role="group" aria-labelledby="qtyLabel">
                <button type="button" data-step="-1" aria-label="${t('cart.dec')}">${I.minus}</button>
                <output id="qtyOut" aria-live="polite">${state.qty}</output>
                <button type="button" data-step="1" aria-label="${t('cart.inc')}">${I.plus}</button>
              </div>
              <button class="btn btn--primary" type="submit" id="addBtn">${I.bag}<span>${t('pdp.add')}</span></button>
              <button class="btn btn--line" type="button" id="buyNow"><span>${t('pdp.buy')}</span></button>
            </div>
          </form>

          <button class="pdp__wish${wished ? ' is-on' : ''}" type="button" data-wish="${p.id}" aria-pressed="${wished}">${I.heart}<span data-wish-label>${t(wished ? 'pdp.wishOn' : 'pdp.wishAdd')}</span></button>

          <div class="acc">
            <details open>
              <summary>${t('pdp.details')}${I.plus}</summary>
              <div class="acc__body"><dl>
                <dt>${t('pdp.family')}</dt><dd${ph}>${esc(fam(p))}</dd>
                <dt>${t('pdp.concentration')}</dt><dd${ph}>${esc(L(p.concentration))}</dd>
                <dt>${t('pdp.sizes')}</dt><dd${ph}>${p.sizes.map((z) => `${z.ml} ${t('ml')}`).join(' · ')}</dd>
              </dl></div>
            </details>
            <details>
              <summary>${t('pdp.delivery')}${I.plus}</summary>
              <div class="acc__body"><p data-ph>${t('pdp.deliveryText')}</p><a class="link-u" href="policies.html#shipping">${t('pdp.deliveryMore')}</a></div>
            </details>
          </div>
        </div>
      </div>`;

    // رحلة العطر
    const pyr = $('#pdpPyramid');
    pyr.innerHTML = pyramid(p);
    pyr.firstElementChild.setAttribute('data-reveal', '');
    $$('.lineart', pyr).forEach((x) => x.classList.add('is-drawn'));
    $('#pdpJourney').hidden = false;

    // قد يعجبك أيضًا: نفس العائلة أولًا
    const others = store.products().filter((x) => x.id !== p.id);
    const score = (x) => x.families.filter((f) => p.families.includes(f)).length;
    const rel = others.sort((a, b) => score(b) - score(a)).slice(0, 4);
    $('#relatedGrid').innerHTML = rel.map((x) => card(x, { variant: 'grid', sizes: '(max-width: 760px) 64vw, 24vw' })).join('');
    $('#related').hidden = false;

    // شريط الشراء (موبايل)
    $('#buybar').innerHTML = `<div class="buybar__txt"><strong>${esc(name)}</strong><span>${cfg.showPrices ? money(s.price) : ''} · ${s.ml} ${t('ml')}</span></div>
      <button class="btn btn--primary btn--sm" type="button" data-add="${p.id}" data-ml="${s.ml}">${I.bag}<span>${t('pdp.add')}</span></button>`;

    bind();
    updatePrice();
    setMeta(s);
  }

  function updatePrice() {
    const s = store.sizeOf(p, state.ml);
    $('#pdpPrice').innerHTML = price(s.price * state.qty, p.placeholder) + (state.qty > 1 ? ` <small style="font-weight:400;color:var(--ink-muted);font-size:.8rem">(${state.qty} × ${cfg.showPrices ? money(s.price) : ''})</small>` : '');
    const bb = $('#buybar'); const btn = bb.querySelector('[data-add]');
    if (btn) { btn.dataset.ml = s.ml; btn.dataset.qty = state.qty; }
    const span = bb.querySelector('.buybar__txt span');
    if (span) span.textContent = `${cfg.showPrices ? money(s.price) : ''} · ${s.ml} ${t('ml')}`;
  }

  function showImg(i, fromScroll) {
    state.img = i;
    $$('.gallery__slide').forEach((el, j) => el.classList.toggle('is-active', j === i));
    $$('.gallery__thumb').forEach((el, j) => el.setAttribute('aria-current', j === i));
    $$('.gallery__dots span').forEach((el, j) => el.classList.toggle('is-active', j === i));
    if (!fromScroll && window.matchMedia('(max-width: 900px)').matches) {
      const sl = $('#slides'); const target = sl.children[i];
      sl.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }
  }

  function bind() {
    $$('.gallery__thumb').forEach((b) => b.addEventListener('click', () => showImg(Number(b.dataset.img))));
    const main = $('.gallery__main');
    main.addEventListener('mousemove', (e) => {
      const r = main.getBoundingClientRect();
      const img = $('.gallery__slide.is-active img'); if (!img) return;
      img.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
      img.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    const sl = $('#slides');
    let st;
    sl.addEventListener('scroll', () => {
      clearTimeout(st);
      st = setTimeout(() => {
        const w = sl.clientWidth; if (!w) return;
        const i = Math.round(Math.abs(sl.scrollLeft) / w);
        if (i !== state.img) showImg(Math.min(i, p.images.length - 1), true);
      }, 60);
    }, { passive: true });

    $$('input[name="size"]').forEach((r) => r.addEventListener('change', () => { state.ml = Number(r.value); updatePrice(); }));
    $$('[data-step]').forEach((b) => b.addEventListener('click', () => {
      state.qty = Math.min(20, Math.max(1, state.qty + Number(b.dataset.step)));
      $('#qtyOut').textContent = state.qty; updatePrice();
    }));
    $('#buyForm').addEventListener('submit', (e) => {
      e.preventDefault();
      store.add(p.id, state.ml, state.qty);
      BQ.ui.bump();
      const b = $('#addBtn'); b.classList.add('is-done'); setTimeout(() => b.classList.remove('is-done'), 900);
      BQ.ui.toast(t('toast.added', { name: L(p.name) }), { open: 'cart', label: t('toast.view') });
    });
    $('#buyNow').addEventListener('click', () => { store.add(p.id, state.ml, state.qty); location.href = 'checkout.html'; });

    // إظهار شريط الشراء بعد تجاوز زر الإضافة
    const bar = $('#buybar');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => {
        const past = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
        bar.classList.toggle('is-on', past); bar.setAttribute('aria-hidden', !past);
      }).observe($('#addBtn'));
    }
  }

  function setMeta(s) {
    const name = L(p.name);
    document.title = `${name} — ${p.latin} | بوكيه Bouquet Parfums`;
    const d = document.querySelector('meta[name="description"]'); if (d) d.setAttribute('content', L(p.short));
    let ld = document.getElementById('pdpLd');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'pdpLd'; document.head.appendChild(ld); }
    const data = {
      '@context': 'https://schema.org', '@type': 'Product',
      name: `${p.name.ar} — ${p.latin}`, description: L(p.description),
      image: p.images.map((im) => `assets/img/${im}-864.webp`),
      brand: { '@type': 'Brand', name: 'Bouquet Parfums' }, sku: p.id,
    };
    if (cfg.showPrices) {
      const prices = p.sizes.map((z) => z.price);
      data.offers = { '@type': 'AggregateOffer', priceCurrency: 'EGP', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: p.sizes.length };
    }
    ld.textContent = JSON.stringify(data);
  }

  if (!p) notFound(); else render();
  BQ.motion.init();

  document.addEventListener('bq:lang', () => {
    if (!p) { notFound(); return; }
    render();
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    BQ.motion.refresh();
  });
})();
