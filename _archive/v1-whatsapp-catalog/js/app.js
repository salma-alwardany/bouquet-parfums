/* ===================== بوكيه — المنطق ===================== */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ---------- أدوات السعر ----------
  const nfmt = new Intl.NumberFormat('en-US');
  const fmtPrice = (n) =>
    n == null ? null : `${nfmt.format(n)} <span class="cur">${CURRENCY}</span>`;
  const fmtPlain = (n) => (n == null ? 'عند الطلب' : `${nfmt.format(n)} ${CURRENCY}`);

  // ---------- روابط واتساب ----------
  const waLink = (text) =>
    `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(text)}`;

  // ---------- حالة السلة ----------
  const STORE_KEY = 'bouquet_cart_v1';
  let cart = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch { return []; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch {}
  }
  const keyOf = (id, size) => `${id}__${size}`;

  function addToCart(product, size) {
    const k = keyOf(product.id, size);
    const found = cart.find((i) => i.key === k);
    if (found) found.qty += 1;
    else cart.push({ key: k, id: product.id, name: product.name, size, qty: 1 });
    save(); renderCart(); bumpCart();
    toast(`أُضيف «${product.name}» إلى السلة`);
  }
  function changeQty(key, delta) {
    const it = cart.find((i) => i.key === key);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter((i) => i.key !== key);
    save(); renderCart();
  }
  function removeItem(key) {
    cart = cart.filter((i) => i.key !== key);
    save(); renderCart();
  }
  const productById = (id) => PRODUCTS.find((p) => p.id === id);
  const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);

  function cartTotals() {
    let total = 0, hasUnpriced = false;
    cart.forEach((it) => {
      const p = productById(it.id);
      const price = p ? priceFor(p, it.size) : null;
      if (price == null) hasUnpriced = true;
      else total += price * it.qty;
    });
    return { total, hasUnpriced };
  }

  // ---------- بناء الفئات والتنقل ----------
  function buildNav() {
    const nav = $('#nav'), pills = $('#catpills'), fcats = $('#footerCats');
    CATEGORIES.forEach((c) => {
      if (!PRODUCTS.some((p) => p.category === c.id)) return;
      nav.insertAdjacentHTML('beforeend', `<a href="#cat-${c.id}">${c.name}</a>`);
      pills.insertAdjacentHTML('beforeend',
        `<button class="pill" data-cat="${c.id}">${c.emoji} ${c.name}</button>`);
      fcats.insertAdjacentHTML('beforeend', `<li><a href="#cat-${c.id}">${c.name}</a></li>`);
    });
  }

  // ---------- بناء بطاقات العطور ----------
  function badgeHtml(product) {
    if (!product.badges) return '';
    return `<div class="card-badges">${product.badges
      .map((b) => BADGES[b] ? `<span class="badge ${BADGES[b].cls}">${BADGES[b].label}</span>` : '')
      .join('')}</div>`;
  }

  function cardHtml(product) {
    const sizes = sizesFor(product);
    const first = sizes[0];
    const price = priceFor(product, first);
    const searchData = `${product.name} ${product.en || ''}`.toLowerCase();
    return `
    <article class="card" data-id="${product.id}" data-search="${searchData}">
      <div class="card-visual">
        ${badgeHtml(product)}
        <div class="card-bottle"></div>
      </div>
      <div class="card-body">
        <h3 class="card-name">${product.name}</h3>
        <span class="card-en">${product.en || ''}</span>
        ${product.note ? `<span class="card-note">🍼 ${product.note}</span>` : ''}
      </div>
      <div class="card-controls">
        <div class="size-row">
          <select class="size-select" aria-label="الحجم">
            ${sizes.map((s) => `<option value="${s}">${s}</option>`).join('')}
          </select>
          ${SHOW_PRICES ? `<span class="card-price ${price == null ? 'ondemand' : ''}" data-price>${price == null ? 'السعر عند الطلب' : fmtPrice(price)}</span>` : ''}
        </div>
        <div class="card-actions">
          <button class="add-btn" data-add>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            أضيفي للسلة
          </button>
          <a class="wa-mini" data-wa target="_blank" rel="noopener" aria-label="استفسار عبر واتساب" title="استفسار عبر واتساب">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.043z"/></svg>
          </a>
        </div>
      </div>
    </article>`;
  }

  function buildCatalog() {
    const wrap = $('#sections');
    CATEGORIES.forEach((c) => {
      const items = PRODUCTS.filter((p) => p.category === c.id);
      if (!items.length) return;
      wrap.insertAdjacentHTML('beforeend', `
        <section class="cat-section" id="cat-${c.id}">
          <div class="cat-section-head">
            <span class="emoji">${c.emoji}</span>
            <div>
              <h2>${c.name}</h2>
              <span class="sub">${c.sub} • ${items.length} عطر</span>
            </div>
          </div>
          <div class="grid">${items.map(cardHtml).join('')}</div>
        </section>`);
    });
  }

  // ---------- تفاعلات البطاقات ----------
  function wireCards() {
    $('#sections').addEventListener('change', (e) => {
      const sel = e.target.closest('.size-select');
      if (!sel) return;
      const card = sel.closest('.card');
      const el = $('[data-price]', card);
      if (!SHOW_PRICES || !el) return;
      const p = productById(card.dataset.id);
      const price = priceFor(p, sel.value);
      el.classList.toggle('ondemand', price == null);
      el.innerHTML = price == null ? 'السعر عند الطلب' : fmtPrice(price);
    });

    $('#sections').addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const p = productById(card.dataset.id);
      const size = $('.size-select', card).value;

      if (e.target.closest('[data-add]')) addToCart(p, size);

      const wa = e.target.closest('[data-wa]');
      if (wa) {
        const priceTxt = SHOW_PRICES ? (() => { const v = priceFor(p, size); return v == null ? '' : ` (${fmtPlain(v)})`; })() : '';
        wa.href = waLink(`مرحباً بوكيه 🌹\nأستفسر عن العطر: ${p.name}\nالحجم: ${size}${priceTxt}`);
      }
    });
  }

  // ---------- السلة ----------
  function bumpCart() {
    const el = $('#cartCount');
    const n = cartCount();
    el.textContent = n;
    el.classList.toggle('show', n > 0);
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  }

  function renderCart() {
    const body = $('#cartBody'), empty = $('#cartEmpty'), footer = $('#cartFooter');
    bumpCart();

    if (!cart.length) {
      body.innerHTML = '';
      empty.classList.add('show');
      footer.classList.add('hide');
      return;
    }
    empty.classList.remove('show');
    footer.classList.remove('hide');

    body.innerHTML = cart.map((it) => {
      const p = productById(it.id);
      const price = p ? priceFor(p, it.size) : null;
      const priceHtml = SHOW_PRICES
        ? `<div class="cart-item-price">${price == null ? 'عند الطلب' : fmtPlain(price * it.qty)}</div>`
        : '';
      return `
      <div class="cart-item" data-key="${it.key}">
        <div class="cart-item-visual"><div class="b"></div></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${it.name}</div>
          <div class="cart-item-size">${it.size}</div>
          ${priceHtml}
          <div class="cart-item-bottom">
            <div class="qty">
              <button data-dec aria-label="إنقاص">−</button>
              <span>${it.qty}</span>
              <button data-inc aria-label="زيادة">+</button>
            </div>
            <button class="cart-item-remove" data-remove>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
              حذف
            </button>
          </div>
        </div>
      </div>`;
    }).join('');

    const totalRow = $('.cart-total');
    const note = $('#cartPriceNote');
    if (SHOW_PRICES) {
      const { total, hasUnpriced } = cartTotals();
      totalRow.style.display = '';
      $('#cartTotal').innerHTML = total > 0
        ? fmtPrice(total) + (hasUnpriced ? ' <span style="font-size:.7rem;color:var(--ink-soft)">+ أصناف عند الطلب</span>' : '')
        : 'يُحدد عند التأكيد';
      note.hidden = !hasUnpriced;
    } else {
      totalRow.style.display = 'none';
      note.hidden = false;
      note.textContent = 'تُحدد الأسعار وتفاصيل التوصيل عند التواصل عبر واتساب 🌹';
    }
  }

  function wireCart() {
    $('#cartBody').addEventListener('click', (e) => {
      const item = e.target.closest('.cart-item');
      if (!item) return;
      const key = item.dataset.key;
      if (e.target.closest('[data-inc]')) changeQty(key, +1);
      else if (e.target.closest('[data-dec]')) changeQty(key, -1);
      else if (e.target.closest('[data-remove]')) removeItem(key);
    });
  }

  // ---------- فتح/إغلاق السلة ----------
  const overlay = $('#overlay');
  function openCart() { $('#cartDrawer').classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function closeCart() { $('#cartDrawer').classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; }

  // ---------- نافذة إتمام الطلب ----------
  function buildOrderText(form) {
    const lines = ['مرحباً بوكيه 🌹', 'أرغب بطلب العطور التالية:', ''];
    cart.forEach((it, i) => {
      let pt = '';
      if (SHOW_PRICES) {
        const p = productById(it.id);
        const price = p ? priceFor(p, it.size) : null;
        pt = `  (${price == null ? 'السعر عند الطلب' : fmtPlain(price * it.qty)})`;
      }
      lines.push(`${i + 1}. ${it.name} — ${it.size} × ${it.qty}${pt}`);
    });
    lines.push('');
    if (SHOW_PRICES) {
      const { total, hasUnpriced } = cartTotals();
      if (total > 0) { lines.push(`الإجمالي${hasUnpriced ? ' (عدا أصناف عند الطلب)' : ''}: ${fmtPlain(total)}`); lines.push(''); }
    } else {
      lines.push('برجاء إفادتي بالأسعار وتفاصيل التوصيل 🌹');
      lines.push('');
    }
    lines.push('— بيانات التوصيل —');
    lines.push(`الاسم: ${form.name.value}`);
    lines.push(`الهاتف: ${form.phone.value}`);
    lines.push(`المدينة/المنطقة: ${form.city.value}`);
    lines.push(`العنوان: ${form.address.value}`);
    if (form.notes.value.trim()) lines.push(`ملاحظات: ${form.notes.value.trim()}`);
    return lines.join('\n');
  }

  function renderCheckoutSummary() {
    const sum = $('#checkoutSummary');
    const rows = cart.map((it) => {
      let right = '';
      if (SHOW_PRICES) {
        const p = productById(it.id);
        const price = p ? priceFor(p, it.size) : null;
        right = `<span>${price == null ? 'عند الطلب' : fmtPlain(price * it.qty)}</span>`;
      }
      return `<div class="row"><span>${it.name} — ${it.size} × ${it.qty}</span>${right}</div>`;
    }).join('');
    let tail;
    if (SHOW_PRICES) {
      const { total, hasUnpriced } = cartTotals();
      tail = `<div class="row tot"><span>الإجمالي</span><span>${total > 0 ? fmtPlain(total) + (hasUnpriced ? ' + أصناف عند الطلب' : '') : 'يُحدد عند التأكيد'}</span></div>`;
    } else {
      tail = `<div class="row tot"><span>الأسعار والتوصيل</span><span>تُحدد عبر واتساب</span></div>`;
    }
    sum.innerHTML = `<h4>ملخص الطلب</h4>${rows}${tail}`;
  }

  function openCheckout() {
    if (!cart.length) { toast('سلتك فارغة 🌸'); return; }
    renderCheckoutSummary();
    $('#checkoutModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCheckout() {
    $('#checkoutModal').classList.remove('open');
    if (!$('#cartDrawer').classList.contains('open')) document.body.style.overflow = '';
  }

  // ---------- البحث ----------
  function wireSearch() {
    const input = $('#searchInput');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      $$('.card').forEach((card) => {
        const match = !q || card.dataset.search.includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      $$('.cat-section').forEach((sec) => {
        const any = $$('.card', sec).some((c) => c.style.display !== 'none');
        sec.style.display = any ? '' : 'none';
      });
      $('#noResults').hidden = visible !== 0;
    });
  }

  // ---------- مراقبة القسم النشط ----------
  function wireScrollSpy() {
    const pills = $$('.pill');
    const map = {};
    pills.forEach((p) => (map[p.dataset.cat] = p));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const id = en.target.id.replace('cat-', '');
          pills.forEach((p) => p.classList.remove('active'));
          if (map[id]) map[id].classList.add('active');
        }
      });
    }, { rootMargin: '-160px 0px -65% 0px' });
    $$('.cat-section').forEach((s) => obs.observe(s));

    $('#catpills').addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      const sec = $(`#cat-${pill.dataset.cat}`);
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---------- تنبيه ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = `<span class="ic">🌸</span> ${msg}`;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ---------- روابط واتساب الثابتة ----------
  function wireStaticWa() {
    const consultMsg = 'مرحباً بوكيه 🌹\nأرغب باستشارة لاختيار العطر المناسب لي.';
    $('#consultWa').href = waLink(consultMsg);
    $('#waFloat').href = waLink(consultMsg);
    $('#footerWa').href = waLink('مرحباً بوكيه 🌹');
    $('#cartWaBtn').addEventListener('click', () => {
      const items = cart.map((it, i) => `${i + 1}. ${it.name} — ${it.size} × ${it.qty}`).join('\n');
      const msg = cart.length
        ? `مرحباً بوكيه 🌹\nأرغب بطلب هذه العطور، وبرجاء إفادتي بالأسعار وتفاصيل التوصيل:\n${items}`
        : consultMsg;
      window.open(waLink(msg), '_blank');
    });
  }

  // ---------- ربط الأحداث العامة ----------
  function wireUI() {
    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#checkoutBtn').addEventListener('click', () => { closeCart(); openCheckout(); });
    $('#checkoutClose').addEventListener('click', closeCheckout);
    overlay.addEventListener('click', () => { closeCart(); closeMenu(); });

    $('#checkoutModal').addEventListener('click', (e) => {
      if (e.target === $('#checkoutModal')) closeCheckout();
    });

    $('#checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = buildOrderText(e.target);
      window.open(waLink(text), '_blank');
      toast('يتم تحويلك إلى واتساب لتأكيد الطلب ✓');
      cart = []; save(); renderCart();
      closeCheckout();
      e.target.reset();
    });

    // قائمة الجوال
    const nav = $('#nav');
    $('#menuToggle').addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      overlay.classList.toggle('show', open);
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });

    // ESC للإغلاق
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeCheckout(); closeMenu(); }
    });

    // ظل الهيدر عند التمرير
    const header = $('#header');
    addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), { passive: true });
  }
  function closeMenu() {
    $('#nav').classList.remove('open');
    if (!$('#cartDrawer').classList.contains('open')) overlay.classList.remove('show');
  }

  // ---------- تشغيل ----------
  function init() {
    $('#year').textContent = new Date().getFullYear();
    buildNav();
    buildCatalog();
    wireCards();
    wireCart();
    wireSearch();
    wireScrollSpy();
    wireStaticWa();
    wireUI();
    renderCart();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
