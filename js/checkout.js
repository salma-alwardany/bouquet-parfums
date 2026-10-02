/* =====================================================================
   بوكيه — إتمام الطلب  |  Bouquet — checkout
   ---------------------------------------------------------------------
   الطلب يُسجَّل في ثلاثة أماكن حتى لا يضيع أبدًا:
     1) على جهاز العميلة (صفحة «حسابي»)
     2) في Google Sheet عبر js/orders-api.js  ← لوحة التحكم تقرأ منه
     3) رسالة واتساب جاهزة ترسلها العميلة إلى رقم المتجر
   طرق الدفع: الدفع عند الاستلام + تحويل على محفظة/إنستاباي.
   ===================================================================== */
(function () {
  'use strict';

  const { $, $$, esc, I, money, img, url, sub, subLang, lineArt, qtyHTML, govName, govOptions } = BQ.ui;
  const store = BQ.store;
  const cfg = window.BQ_CONFIG || {};
  const t = (k, v) => BQ.i18n.t(k, v);
  const L = (o) => BQ.i18n.L(o);
  const root = $('#coRoot');
  let view = 'form'; let lastOrder = null; let busy = false;

  const FIELDS = ['name', 'phone', 'email', 'gov', 'city', 'street', 'notes', 'ref'];
  let values = Object.assign({}, store.profile());

  // طرق الدفع المتاحة فعلًا حسب الإعدادات
  const pay = cfg.payment || {};
  const wallets = ((pay.wallet && pay.wallet.accounts) || []).filter((a) => a && String(a.value || '').trim());
  const walletOn = !!(pay.wallet && pay.wallet.enabled) && wallets.length > 0;
  const codOn = pay.cod !== false;
  const methods = [codOn && 'cod', walletOn && 'wallet'].filter(Boolean);
  let method = methods[0] || 'cod';

  function readValues() {
    const f = $('#coForm'); if (!f) return;
    FIELDS.forEach((k) => { if (f.elements[k]) values[k] = f.elements[k].value; });
    values.save = f.elements.save ? f.elements.save.checked : values.save;
    if (f.elements.pay) method = f.elements.pay.value;
  }

  const field = (k, label, type = 'text', extra = '') => `
    <div class="field" data-field="${k}">
      <label for="f-${k}">${label}</label>
      <input id="f-${k}" name="${k}" type="${type}" value="${esc(values[k] || '')}" ${extra}>
      <p class="field__err" id="e-${k}" aria-live="polite"></p>
    </div>`;

  function summaryHTML() {
    const lines = store.cart();
    return `
      <aside class="summary" aria-labelledby="sumTitle">
        <div class="summary__head"><h2 id="sumTitle">${t('co.summary')}</h2><button class="link-u" type="button" data-open="cart">${t('co.edit')}</button></div>
        <ul class="lines">${lines.map((l) => `
          <li class="line">
            <a class="line__img" href="${url(l.product)}" tabindex="-1" aria-hidden="true">${img(l.product.images[0], { sizes: '70px' })}</a>
            <div class="line__info">
              <p class="line__name"><a href="${url(l.product)}">${esc(L(l.product.name))}</a></p>
              <p class="line__meta"><span lang="${subLang()}">${esc(sub(l.product))}</span> · ${l.ml} ${t('ml')}</p>
              <div class="line__row">${qtyHTML(l.key, l.qty)}<span class="line__price">${cfg.showPrices ? money(l.total) : ''}</span></div>
            </div>
          </li>`).join('')}
        </ul>
        <div class="summary__rows">
          <div class="sum-row"><span>${t('cart.subtotal')}</span><span>${cfg.showPrices ? money(store.cartSubtotal()) : t('priceOnRequest')}</span></div>
          <div class="sum-row"><span>${t('co.shipping')}</span><span data-ph>${t('co.shippingTBD')}</span></div>
          <div class="sum-row sum-row--total"><span>${t('co.total')}</span><strong>${cfg.showPrices ? money(store.cartSubtotal()) : t('priceOnRequest')}</strong></div>
        </div>
      </aside>`;
  }

  function head(titleKey) {
    return `<div class="co-head"><div><p class="eyebrow" lang="en">BOUQUET — CHECKOUT</p><h1>${t(titleKey)}</h1></div>
      <a class="link-u" href="index.html#discover"><span>${t('cart.continue')}</span>${I.arrow}</a></div>`;
  }

  function payHTML() {
    const opt = (val, title, hint) => `
      <label class="pay-opt"><input type="radio" name="pay" value="${val}"${method === val ? ' checked' : ''}>
        <span><strong>${title}</strong><small>${hint}</small></span></label>`;
    const walletBox = `
      <div class="wallet" id="walletBox"${method === 'wallet' ? '' : ' hidden'}>
        <p class="wallet__how">${t('co.walletHow')}</p>
        <ul class="wallet__list">${wallets.map((a) => `
          <li>
            <span class="wallet__label">${esc(L({ ar: a.label, en: a.labelEn || a.label }))}</span>
            <span class="wallet__num" dir="ltr">${esc(a.value)}</span>
            <button class="wallet__copy" type="button" data-copy="${esc(a.value)}">${t('co.copy')}</button>
          </li>`).join('')}
        </ul>
        ${field('ref', t('co.ref'), 'text', `inputmode="numeric" dir="ltr" placeholder="${esc(t('co.refPh'))}"`)}
      </div>`;
    return `
      <div class="pay">
        ${codOn ? opt('cod', t('co.cod'), t('co.codHint')) : ''}
        ${walletOn ? opt('wallet', t('co.wallet'), t('co.walletHint')) : ''}
      </div>
      ${walletOn ? walletBox : ''}
      <p class="co-note">${I.check}<span>${t('co.secure')}</span></p>`;
  }

  function render() {
    readValues();
    if (view === 'done') return renderDone();
    if (!store.cart().length) {
      root.innerHTML = `<div class="co-empty">${lineArt('flower')}<h2>${t('co.emptyTitle')}</h2><p>${t('co.emptyText')}</p><a class="btn btn--primary" href="index.html#discover">${t('cart.emptyCta')}</a></div>`;
      return;
    }
    root.innerHTML = `${head('co.title')}
      <div class="co">
        <form class="co-form" id="coForm" novalidate>
          <fieldset>
            <legend><span lang="en">01</span>${t('co.contact')}</legend>
            <div class="grid-2">
              <div class="span-2">${field('name', t('co.name'), 'text', 'autocomplete="name" required')}</div>
              ${field('phone', t('co.phone'), 'tel', 'autocomplete="tel" inputmode="tel" dir="ltr" required placeholder="01X XXXX XXXX"')}
              ${field('email', t('co.email'), 'email', 'autocomplete="email" inputmode="email" dir="ltr"')}
            </div>
          </fieldset>
          <fieldset>
            <legend><span lang="en">02</span>${t('co.address')}</legend>
            <div class="grid-2">
              <div class="field" data-field="gov">
                <label for="f-gov">${t('co.gov')}</label>
                <select id="f-gov" name="gov" required autocomplete="address-level1">${govOptions(values.gov)}</select>
                <p class="field__err" id="e-gov" aria-live="polite"></p>
              </div>
              ${field('city', t('co.city'), 'text', 'autocomplete="address-level2" required')}
              <div class="span-2">${field('street', t('co.street'), 'text', `autocomplete="street-address" required placeholder="${esc(t('co.streetPh'))}"`)}</div>
              <div class="field span-2" data-field="notes">
                <label for="f-notes">${t('co.notes')}</label>
                <textarea id="f-notes" name="notes" rows="3" placeholder="${esc(t('co.notesPh'))}">${esc(values.notes || '')}</textarea>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend><span lang="en">03</span>${t('co.payment')}</legend>
            ${payHTML()}
          </fieldset>
          <label class="check"><input type="checkbox" name="save"${values.save !== false ? ' checked' : ''}><span>${t('co.save')}</span></label>
          <div style="margin-top:28px">
            <button class="btn btn--primary btn--block" type="submit" id="placeBtn">${I.whatsapp}<span>${t('co.place')}</span></button>
            <p class="co-note">${t('co.placeNote')}</p>
            <p class="co-err" id="coErr" role="alert"></p>
          </div>
        </form>
        ${summaryHTML()}
      </div>`;
    $('#coForm').addEventListener('submit', placeOrder);
    $$('#coForm input, #coForm select').forEach((el) => el.addEventListener('input', () => clearErr(el.name)));
    $$('#coForm input[name="pay"]').forEach((r) => r.addEventListener('change', () => {
      method = r.value;
      const box = $('#walletBox'); if (box) box.hidden = method !== 'wallet';
    }));
    root.addEventListener('click', onCopy);
  }

  function onCopy(e) {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    copyText(b.dataset.copy);
    const old = b.textContent; b.textContent = t('co.copied'); b.classList.add('is-done');
    setTimeout(() => { b.textContent = old; b.classList.remove('is-done'); }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-1000px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function renderSummaryOnly() {
    const s = $('.summary'); if (!s) return render();
    if (!store.cart().length) return render();
    s.outerHTML = summaryHTML();
  }

  // ---------------------------------------------------------- validation
  function setErr(k, msg) {
    const f = $(`[data-field="${k}"]`); const e = $(`#e-${k}`); const input = $(`#f-${k}`);
    if (f) f.classList.toggle('is-invalid', !!msg);
    if (e) e.textContent = msg || '';
    if (input) { if (msg) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', `e-${k}`); } else input.removeAttribute('aria-invalid'); }
  }
  const clearErr = (k) => setErr(k, '');

  function validate() {
    readValues();
    let first = null;
    const req = ['name', 'phone', 'gov', 'city', 'street'];
    req.forEach((k) => { const bad = !String(values[k] || '').trim(); setErr(k, bad ? t('co.required') : ''); if (bad && !first) first = k; });
    const digits = String(values.phone || '').replace(/[^\d+]/g, '');
    if (values.phone && !/^(\+?20|0)?1[0125]\d{8}$/.test(digits) && !/^\+?\d{8,15}$/.test(digits)) { setErr('phone', t('co.badPhone')); first = first || 'phone'; }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) { setErr('email', t('co.badEmail')); first = first || 'email'; }
    $('#coErr').textContent = first ? t('co.fixErrors') : '';
    if (first) { const el = $(`#f-${first}`); el.focus(); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    return !first;
  }

  // --------------------------------------------------------- the order
  function orderId() {
    const d = new Date(); const pad = (n) => String(n).padStart(2, '0');
    return `BQ-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const payLabel = (m) => t(m === 'wallet' ? 'co.wallet' : 'co.cod');

  function orderText(o) {
    const lines = o.items.map((i) => `• ${i.name} (${i.latin}) — ${i.ml} ${t('ml')} × ${i.qty}${cfg.showPrices ? ` = ${money(i.price * i.qty)}` : ''}`);
    const c = o.customer;
    return [
      t('wa.greeting'),
      `${t('wa.order')}: ${o.id}`,
      '',
      ...lines,
      '',
      cfg.showPrices ? `${t('cart.subtotal')}: ${money(o.subtotal)}` : '',
      `${t('co.shipping')}: ${t('co.shippingTBD')}`,
      '',
      `${t('wa.customer')}:`,
      `${t('co.name')}: ${c.name}`,
      `${t('co.phone')}: ${c.phone}`,
      c.email ? `${t('co.email')}: ${c.email}` : '',
      `${t('co.address')}: ${c.govName} — ${c.city} — ${c.street}`,
      `${t('wa.payment')}: ${o.paymentLabel}`,
      o.ref ? `${t('wa.ref')}: ${o.ref}` : '',
      c.notes ? `${t('wa.notes')}: ${c.notes}` : '',
    ].filter((x, i, a) => x !== '' || (a[i - 1] !== '' && i > 0)).join('\n');
  }
  const waLink = (o) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(orderText(o))}`;

  async function placeOrder(e) {
    e.preventDefault();
    if (busy || !validate()) return;
    const f = $('#coForm');
    const btn = $('#placeBtn');
    busy = true;
    btn.disabled = true;
    btn.querySelector('span').textContent = t('co.sending');

    const customer = {
      name: values.name.trim(), phone: values.phone.trim(), email: (values.email || '').trim(),
      gov: values.gov, govName: govName(values.gov),
      city: values.city.trim(), street: values.street.trim(), notes: (values.notes || '').trim(),
    };
    const items = store.cart().map((l) => ({ id: l.id, name: L(l.product.name), latin: l.product.latin, ml: l.ml, qty: l.qty, price: l.price, image: l.product.images[0] }));
    const order = {
      id: orderId(), date: new Date().toISOString(), items,
      subtotal: store.cartSubtotal(), currency: cfg.currency.ar,
      payment: method, paymentLabel: payLabel(method),
      ref: method === 'wallet' ? String(values.ref || '').trim() : '',
      customer, status: 'new', lang: BQ.i18n.lang,
    };

    store.addOrder(order);
    if (f.elements.save.checked) store.saveProfile({ ...customer, notes: '', save: true });

    // التسجيل في Google Sheet (لا يعطّل العميلة لو فشل — الطلب محفوظ ويعاد إرساله لاحقًا)
    const sent = await BQ.api.submitOrder(order);

    const link = waLink(order);
    const w = window.open(link, '_blank', 'noopener');
    lastOrder = { order, link, opened: !!w, sent: sent.ok };
    store.clearCart();
    busy = false;
    view = 'done';
    renderDone();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderDone() {
    const o = lastOrder.order;
    const page = String(cfg.messenger || '').trim();
    root.innerHTML = `<div class="co-done" data-reveal>
      <svg class="lineart" data-draw viewBox="-6 -6 669 526" aria-hidden="true" focusable="false"><use href="#bq-line"/></svg>
      <p class="eyebrow" lang="en">MERCI</p>
      <h2>${t('co.thanks')}${BQ.i18n.lang === 'ar' ? '، ' : ', '}${esc(o.customer.name.split(' ')[0])}</h2>
      <p class="co-done__id" lang="en" dir="ltr">${o.id}</p>
      <p>${t('co.thanksText', { id: o.id })}</p>
      <div class="co-done__actions">
        <a class="btn btn--primary" href="${lastOrder.link}" target="_blank" rel="noopener">${I.whatsapp}<span>${t('co.resend')}</span></a>
        ${page ? `<button class="btn btn--line" type="button" id="msgrBtn">${I.messenger}<span>${t('co.msgr')}</span></button>` : ''}
        <button class="btn btn--line" type="button" id="copyBtn"><span>${t('co.copyOrder')}</span></button>
      </div>
      <p class="co-done__hint" id="doneHint" role="status" aria-live="polite"></p>
      <a class="link-u" href="index.html"><span>${t('co.backHome')}</span></a>
    </div>`;

    const text = orderText(o);
    const copyBtn = $('#copyBtn');
    copyBtn.addEventListener('click', () => {
      copyText(text);
      $('#doneHint').textContent = t('co.copied');
    });
    const mb = $('#msgrBtn');
    if (mb) mb.addEventListener('click', () => {
      copyText(text);
      $('#doneHint').textContent = t('co.msgrHint');
      setTimeout(() => window.open(`https://m.me/${encodeURIComponent(page)}`, '_blank', 'noopener'), 350);
    });
    BQ.motion.refresh(root);
  }

  render();
  BQ.motion.init();
  document.addEventListener('bq:cart', () => { if (view === 'form') renderSummaryOnly(); });
  document.addEventListener('bq:lang', render);
})();
