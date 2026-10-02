/* =====================================================================
   بوكيه — حسابي  |  Bouquet — account (device-based)
   ---------------------------------------------------------------------
   لا يوجد تسجيل دخول حقيقي بعد (يتطلب نظام متجر وخادم). الصفحة تعرض
   الطلبات والمفضلة والبيانات المحفوظة على هذا الجهاز فقط.
   ===================================================================== */
(function () {
  'use strict';

  const { $, $$, esc, I, money, card, lineArt, govOptions, govName } = BQ.ui;
  const store = BQ.store;
  const cfg = window.BQ_CONFIG || {};
  const t = (k, v) => BQ.i18n.t(k, v);
  const root = $('#accRoot');
  const TABS = ['orders', 'wishlist', 'details'];
  let tab = TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'orders';

  function sideHTML() {
    const counts = { orders: store.orders().length, wishlist: store.wishlist().length, details: '' };
    return `<aside class="acc-side">
      <p class="eyebrow" lang="en">MY ACCOUNT</p>
      <h1>${t('acc.title')}</h1>
      <p>${t('acc.welcome')}. ${t('acc.device')}</p>
      <div class="acc-tabs" role="tablist" aria-label="${t('acc.title')}">${TABS.map((k) => `
        <button class="acc-tab" type="button" role="tab" id="tab-${k}" aria-controls="accPanel" aria-selected="${k === tab}" tabindex="${k === tab ? 0 : -1}" data-tab="${k}">
          <span>${t('acc.' + k)}</span><small lang="en">${counts[k] ? String(counts[k]).padStart(2, '0') : ''}</small>
        </button>`).join('')}
      </div>
      <div class="acc-soon" data-ph><strong>${t('acc.signin')}</strong>${t('acc.signinSoon')}</div>
    </aside>`;
  }

  function ordersHTML() {
    const list = store.orders();
    if (!list.length) return `<div class="acc-empty">${lineArt('flower', 'drawer__art')}<p>${t('acc.noOrders')}</p><a class="btn btn--line" href="index.html#discover">${t('cart.emptyCta')}</a></div>`;
    const fmt = new Intl.DateTimeFormat(BQ.i18n.lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return list.map((o) => {
      const n = o.items.reduce((a, i) => a + i.qty, 0);
      return `<article class="order">
        <div class="order__top"><span class="order__id" lang="en" dir="ltr">${esc(o.id)}</span><span class="order__meta">${fmt.format(new Date(o.date))}</span></div>
        <div class="order__items">${o.items.map((i) => `<img src="assets/img/${esc(i.image)}-560.webp" alt="${esc(i.name)}" width="54" height="68" loading="lazy">`).join('')}</div>
        <div class="order__top"><span class="order__meta">${t('acc.orderItems', { n })} · ${esc(govName(o.customer.gov))}${cfg.showPrices ? ` · ${money(o.subtotal)}` : ''}</span><span class="order__meta">${t('acc.status')}</span></div>
      </article>`;
    }).join('');
  }

  function wishHTML() {
    const list = store.wishlist();
    if (!list.length) return `<div class="acc-empty">${lineArt('top', 'drawer__art')}<p>${t('wish.empty')}</p><a class="btn btn--line" href="index.html#discover">${t('cart.emptyCta')}</a></div>`;
    return `<div class="acc-grid">${list.map((p) => card(p, { variant: 'grid', reveal: false, sizes: '(max-width: 760px) 46vw, 22vw' })).join('')}</div>`;
  }

  function detailsHTML() {
    const v = store.profile();
    const f = (k, label, type = 'text', extra = '') => `<div class="field"><label for="a-${k}">${label}</label><input id="a-${k}" name="${k}" type="${type}" value="${esc(v[k] || '')}" ${extra}></div>`;
    return `<form id="accForm" class="grid-2" novalidate>
      <div class="span-2">${f('name', t('co.name'), 'text', 'autocomplete="name"')}</div>
      ${f('phone', t('co.phone'), 'tel', 'autocomplete="tel" dir="ltr"')}
      ${f('email', t('co.email'), 'email', 'autocomplete="email" dir="ltr"')}
      <div class="field"><label for="a-gov">${t('co.gov')}</label><select id="a-gov" name="gov">${govOptions(v.gov)}</select></div>
      ${f('city', t('co.city'), 'text', 'autocomplete="address-level2"')}
      <div class="span-2">${f('street', t('co.street'), 'text', 'autocomplete="street-address"')}</div>
      <div class="span-2 acc-actions">
        <button class="btn btn--primary" type="submit">${t('acc.save')}</button>
        <button class="link-u" type="button" id="clearData">${t('acc.clear')}</button>
      </div>
    </form>`;
  }

  function panelHTML() {
    const body = tab === 'orders' ? ordersHTML() : tab === 'wishlist' ? wishHTML() : detailsHTML();
    return `<section class="acc-panel" id="accPanel" role="tabpanel" aria-labelledby="tab-${tab}"><h2>${t('acc.' + tab)}</h2>${body}</section>`;
  }

  function render() {
    root.innerHTML = sideHTML() + panelHTML();
    const form = $('#accForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {}; ['name', 'phone', 'email', 'gov', 'city', 'street'].forEach((k) => { data[k] = form.elements[k].value.trim(); });
        store.saveProfile({ ...store.profile(), ...data, save: true });
        BQ.ui.toast(t('acc.saved'));
      });
      $('#clearData').addEventListener('click', () => { store.clearAll(); BQ.ui.toast(t('acc.cleared')); render(); });
    }
  }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    tab = b.dataset.tab; history.replaceState(null, '', '#' + tab); render();
    const nb = $(`[data-tab="${tab}"]`); if (nb) nb.focus();
  });
  root.addEventListener('keydown', (e) => {
    if (!e.target.closest('[data-tab]') || !['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const i = TABS.indexOf(tab); tab = TABS[(i + (e.key === 'ArrowDown' ? 1 : -1) + TABS.length) % TABS.length];
    render(); $(`[data-tab="${tab}"]`).focus();
  });

  render();
  BQ.motion.init();
  document.addEventListener('bq:lang', render);
  document.addEventListener('bq:wish', () => { if (tab === 'wishlist') render(); });
})();
