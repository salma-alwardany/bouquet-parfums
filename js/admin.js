/* =====================================================================
   بوكيه — لوحة التحكم  |  Bouquet admin panel
   ---------------------------------------------------------------------
   تقرأ الطلبات من Google Sheet عبر js/orders-api.js وتسمح بتغيير حالة
   الطلب، وكتابة ملاحظة داخلية، وإرسال تأكيد للعميلة على واتساب بضغطة.
   كلمة السر (ADMIN_TOKEN) تُحفظ في الجلسة فقط ولا تُكتب داخل الكود.
   ===================================================================== */
(function () {
  'use strict';

  const cfg = window.BQ_CONFIG || {};
  const app = document.getElementById('app');
  const KEY = 'bq_admin_token';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = new Intl.NumberFormat('en-US');
  const cur = (cfg.currency && cfg.currency.ar) || 'ج.م';
  const money = (n) => (n == null || n === '' ? '—' : `${nf.format(n)} ${cur}`);

  const STATUS = {
    new:       { label: 'جديد',        color: '#9A6212', bg: '#FBF1DF' },
    confirmed: { label: 'مؤكد',        color: '#1E5B8A', bg: '#E4F0F8' },
    shipped:   { label: 'تم الشحن',    color: '#6B3FA0', bg: '#F0EAF8' },
    delivered: { label: 'تم التسليم',  color: '#2E6B4F', bg: '#E4F3EB' },
    cancelled: { label: 'ملغي',        color: '#A8201A', bg: '#FAE7E6' },
  };
  const ORDER = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  const svg = (d) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    refresh: svg('<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6"/><path d="M20.5 4v5h-5"/>'),
    out: svg('<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h9"/>'),
    chev: svg('<path d="M6 9l6 6 6-6"/>'),
    down: svg('<path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>'),
    phone: svg('<path d="M21 16.5v2.6a1.8 1.8 0 0 1-2 1.8 17.8 17.8 0 0 1-7.7-2.8 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3.1 5a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.6c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14 14 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.6 1.9z"/>'),
    wa: '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2.5a9.44 9.44 0 0 0-8.1 14.3L2.6 21.5l4.83-1.27a9.44 9.44 0 1 0 4.61-17.73zm0 17.2a7.8 7.8 0 0 1-3.97-1.09l-.28-.17-2.87.75.77-2.8-.19-.29a7.8 7.8 0 1 1 6.54 3.6zm4.28-5.84c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.74.92-.13.15-.27.17-.5.06a6.4 6.4 0 0 1-3.2-2.8c-.24-.41.24-.38.69-1.27.08-.15.04-.29-.02-.4-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.3 2.6 2.6 0 0 0-.81 1.93 4.52 4.52 0 0 0 .95 2.4c.12.15 1.64 2.5 3.97 3.51 1.48.64 2.06.69 2.8.58.45-.07 1.38-.56 1.57-1.1.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.44-.27z"/></svg>',
    flower: '<svg viewBox="-6 -6 669 526" aria-hidden="true"><use href="#bq-line"/></svg>',
  };

  let token = '';
  let orders = [];
  let filter = 'all';
  let query = '';
  let openId = null;

  try { token = sessionStorage.getItem(KEY) || ''; } catch (e) {}

  // ------------------------------------------------------------ helpers
  function waPhone(raw) {
    let d = String(raw || '').replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.startsWith('20')) return d;
    if (d.startsWith('0')) return '20' + d.slice(1);
    if (/^1[0125]\d{8}$/.test(d)) return '20' + d;
    return d;
  }
  const fmtDate = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return String(iso || '');
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d);
  };
  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('is-on'), 2600);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).catch(fallback); }
    else fallback();
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;top:-1000px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    toast('تم النسخ');
  }

  // ------------------------------------------------------------- شاشات
  function gate(err) {
    app.innerHTML = `<div class="gate"><div class="gate__card">
      <img class="gate__logo" src="assets/brand/bouquet-logo-880.webp" alt="بوكيه" width="880" height="880">
      <h1>لوحة التحكم</h1>
      <p>اكتبي كلمة السر الخاصة بلوحة طلبات بوكيه.</p>
      <form id="gateForm">
        <input type="password" id="tk" placeholder="كلمة السر" autocomplete="current-password" required aria-label="كلمة السر">
        <button class="btn btn--primary btn--block" type="submit">دخول</button>
        <p class="gate__err">${esc(err || '')}</p>
      </form>
    </div></div>`;
    const f = document.getElementById('gateForm');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = document.getElementById('tk').value.trim();
      if (!v) return;
      const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'جارٍ التحقق…';
      token = v;
      try {
        await load();
        try { sessionStorage.setItem(KEY, token); } catch (err) {}
        main();
      } catch (err) {
        token = '';
        gate(err.message === 'unauthorized' ? 'كلمة السر غير صحيحة.' : 'تعذّر الاتصال: ' + err.message);
      }
    });
    document.getElementById('tk').focus();
  }

  function setupScreen() {
    app.innerHTML = `<div class="wrap"><div class="setup">
      <h2>لسه فاضل خطوة واحدة</h2>
      <p>لوحة التحكم محتاجة سجل الطلبات على جوجل شيت عشان تشتغل. الخطوات مكتوبة بالتفصيل في ملف:</p>
      <p><code>apps-script/دليل-الإعداد.md</code></p>
      <ol>
        <li>افتحي جوجل درايف واعملي Google Sheet جديد باسم «طلبات بوكيه».</li>
        <li>من قائمة <b>Extensions ← Apps Script</b> الصقي محتوى ملف <code>apps-script/Code.gs</code>.</li>
        <li>اعملي Deploy كـ Web app، واختاري <b>Anyone</b> في خانة من يستطيع الوصول.</li>
        <li>انسخي الرابط الناتج وحطيه في <code>js/config.js</code> داخل <code>backend.url</code>.</li>
      </ol>
      <p>بعدها ارفعي التعديل بـ <code>git push</code> وافتحي الصفحة دي تاني.</p>
    </div></div>`;
  }

  // ------------------------------------------------------------ البيانات
  async function load() {
    const res = await BQ.api.listOrders(token);
    orders = (res.orders || []).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }

  const visible = () => orders.filter((o) => {
    if (filter !== 'all' && (o.status || 'new') !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return [o.id, o.customer && o.customer.name, o.customer && o.customer.phone, o.customer && o.customer.city, o.customer && o.customer.govName]
      .some((x) => String(x || '').toLowerCase().includes(q));
  });

  // ------------------------------------------------------------- الواجهة
  function main() {
    const counts = { all: orders.length };
    ORDER.forEach((s) => { counts[s] = orders.filter((o) => (o.status || 'new') === s).length; });
    const now = new Date();
    const sameDay = (d) => { const x = new Date(d); return x.getDate() === now.getDate() && x.getMonth() === now.getMonth() && x.getFullYear() === now.getFullYear(); };
    const sameMonth = (d) => { const x = new Date(d); return x.getMonth() === now.getMonth() && x.getFullYear() === now.getFullYear(); };
    const live = orders.filter((o) => (o.status || 'new') !== 'cancelled');
    const sum = (arr) => arr.reduce((n, o) => n + (Number(o.subtotal) || 0), 0);

    app.innerHTML = `
      <header class="bar"><div class="wrap bar__in">
        <div class="bar__brand">
          <img src="assets/brand/flower.webp" alt="" width="34" height="27">
          <div><b>طلبات بوكيه</b><small>لوحة التحكم</small></div>
        </div>
        <button class="btn btn--line btn--sm" id="exportBtn">${I.down}<span>تصدير Excel</span></button>
        <button class="btn btn--line btn--sm" id="reloadBtn">${I.refresh}<span>تحديث</span></button>
        <button class="btn btn--line btn--sm" id="outBtn">${I.out}<span>خروج</span></button>
      </div></header>

      <main class="wrap">
        <dl class="stats">
          <div class="stat"><dt>طلبات اليوم</dt><dd>${live.filter((o) => sameDay(o.date)).length}</dd></div>
          <div class="stat"><dt>مبيعات اليوم</dt><dd>${nf.format(sum(live.filter((o) => sameDay(o.date))))} <small>${cur}</small></dd></div>
          <div class="stat"><dt>مبيعات الشهر</dt><dd>${nf.format(sum(live.filter((o) => sameMonth(o.date))))} <small>${cur}</small></dd></div>
          <div class="stat"><dt>بانتظار التأكيد</dt><dd>${counts.new}</dd></div>
        </dl>

        <div class="tools">
          <div class="chips" role="group" aria-label="تصفية حسب الحالة">
            <button class="chip${filter === 'all' ? ' is-on' : ''}" data-f="all">الكل <b>${counts.all}</b></button>
            ${ORDER.map((s) => `<button class="chip${filter === s ? ' is-on' : ''}" data-f="${s}">${STATUS[s].label} <b>${counts[s]}</b></button>`).join('')}
          </div>
          <label class="sr-only" for="q">بحث</label>
          <input type="search" id="q" placeholder="بحث بالاسم أو الرقم أو المحافظة…" value="${esc(query)}">
        </div>

        <div class="orders" id="orders">${listHTML()}</div>
      </main>`;

    document.getElementById('reloadBtn').addEventListener('click', refresh);
    document.getElementById('outBtn').addEventListener('click', () => {
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      token = ''; orders = []; gate();
    });
    document.getElementById('exportBtn').addEventListener('click', exportCsv);
    app.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; main(); }));
    const q = document.getElementById('q');
    q.addEventListener('input', () => { query = q.value.trim(); document.getElementById('orders').innerHTML = listHTML(); bindOrders(); });
    bindOrders();
  }

  function listHTML() {
    const list = visible();
    if (!list.length) {
      return `<div class="empty">${orders.length ? 'مفيش طلبات مطابقة.' : 'لسه مفيش طلبات. أول طلب هيظهر هنا تلقائيًا.'}</div>`;
    }
    return list.map(orderHTML).join('');
  }

  function orderHTML(o) {
    const st = STATUS[o.status] || STATUS.new;
    const c = o.customer || {};
    const open = o.id === openId;
    const items = Array.isArray(o.items) ? o.items : [];
    return `
    <article class="order${open ? ' is-open' : ''}" style="--st:${st.color}" data-id="${esc(o.id)}">
      <button class="order__head" type="button" data-toggle aria-expanded="${open}">
        <span class="order__id" dir="ltr">${esc(o.id)}</span>
        <span class="order__who"><b>${esc(c.name)}</b><span>${esc(c.govName || '')}${c.city ? ' — ' + esc(c.city) : ''}</span></span>
        <span class="tag" style="--bg:${st.bg};--fg:${st.color}">${st.label}</span>
        <span class="order__sum">${money(o.subtotal)}</span>
        <span class="order__date">${fmtDate(o.date)}</span>
        <span class="order__chev">${I.chev}</span>
      </button>
      <div class="order__body">
        <div class="panel">
          <h3>العطور</h3>
          <ul class="items">${items.map((i) => `
            <li>
              <img src="assets/img/${esc(i.image)}-560.webp" alt="" width="46" height="58" loading="lazy">
              <span class="t"><b>${esc(i.name)}</b><span>${esc(i.ml)} مل × ${esc(i.qty)}</span></span>
              <span class="p">${money((Number(i.price) || 0) * (Number(i.qty) || 1))}</span>
            </li>`).join('')}
          </ul>
          <h3>بيانات العميلة</h3>
          <dl class="kv">
            <dt>الاسم</dt><dd>${esc(c.name)}</dd>
            <dt>الهاتف</dt><dd class="copyable"><a href="tel:${esc(c.phone)}" dir="ltr">${esc(c.phone)}</a><button type="button" data-copy="${esc(c.phone)}">نسخ</button></dd>
            ${c.email ? `<dt>الإيميل</dt><dd dir="ltr">${esc(c.email)}</dd>` : ''}
            <dt>العنوان</dt><dd class="copyable"><span>${esc(c.govName || '')} — ${esc(c.city)} — ${esc(c.street)}</span><button type="button" data-copy="${esc([c.govName, c.city, c.street].filter(Boolean).join(' — '))}">نسخ</button></dd>
            <dt>الدفع</dt><dd>${esc(o.paymentLabel || '')}${o.ref ? ` · رقم التحويل: <b dir="ltr">${esc(o.ref)}</b>` : ''}</dd>
            ${c.notes ? `<dt>ملاحظات العميلة</dt><dd>${esc(c.notes)}</dd>` : ''}
            <dt>التاريخ</dt><dd>${fmtDate(o.date)}</dd>
          </dl>
        </div>

        <div class="panel">
          <h3>حالة الطلب</h3>
          <div class="row">
            <label class="sr-only" for="st-${esc(o.id)}">الحالة</label>
            <select id="st-${esc(o.id)}" data-status>${ORDER.map((s) => `<option value="${s}"${(o.status || 'new') === s ? ' selected' : ''}>${STATUS[s].label}</option>`).join('')}</select>
            <a class="btn btn--line btn--sm" href="tel:${esc(c.phone)}">${I.phone}<span>اتصال</span></a>
          </div>

          <h3>ملاحظة داخلية</h3>
          <div class="note-box">
            <textarea rows="2" data-note placeholder="ملاحظة تخصك أنتِ فقط — مش هتظهر للعميلة">${esc(o.adminNote || '')}</textarea>
            <div class="row"><button class="btn btn--line btn--sm" type="button" data-save-note>حفظ الملاحظة</button><span class="saved" data-saved></span></div>
          </div>

          <h3>تأكيد الطلب للعميلة</h3>
          <div class="wa-box">
            <p>راجعي الرسالة وعدّليها (خصوصًا الشحن والمدة)، وبعدين افتحي واتساب وابعتيها.</p>
            <label class="sr-only" for="wa-${esc(o.id)}">رسالة التأكيد</label>
            <textarea id="wa-${esc(o.id)}" data-wa>${esc(confirmMsg(o))}</textarea>
            <div class="row" style="margin-top:10px">
              <a class="btn btn--wa" href="#" data-wa-send>${I.wa}<span>فتح واتساب</span></a>
              <button class="btn btn--line btn--sm" type="button" data-wa-copy>نسخ الرسالة</button>
            </div>
          </div>
        </div>
      </div>
    </article>`;
  }

  function confirmMsg(o) {
    const c = o.customer || {};
    const first = String(c.name || '').trim().split(/\s+/)[0] || '';
    const items = (Array.isArray(o.items) ? o.items : []).map((i) => `• ${i.name} — ${i.ml} مل × ${i.qty}`);
    return [
      `مرحبًا ${first} 🌸`,
      `معاكِ بوكيه — تم تأكيد طلبك رقم ${o.id}`,
      '',
      ...items,
      '',
      `إجمالي العطور: ${money(o.subtotal)}`,
      'الشحن: (اكتبي رسوم الشحن)',
      'الإجمالي النهائي: (اكتبيه)',
      '',
      o.payment === 'wallet' ? 'برجاء تأكيد التحويل بعد إضافة الشحن 🤍' : 'الدفع عند الاستلام.',
      'هيوصلك خلال (المدة المتوقعة).',
      '',
      'شكرًا لثقتك في بوكيه 🤍',
    ].join('\n');
  }

  function bindOrders() {
    app.querySelectorAll('.order').forEach((el) => {
      const id = el.dataset.id;
      const o = orders.find((x) => x.id === id);
      if (!o) return;

      el.querySelector('[data-toggle]').addEventListener('click', () => {
        openId = el.classList.contains('is-open') ? null : id;
        document.getElementById('orders').innerHTML = listHTML();
        bindOrders();
        if (openId) {
          const n = app.querySelector(`.order[data-id="${CSS.escape(openId)}"]`);
          if (n) n.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });

      el.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => copy(b.dataset.copy)));

      const sel = el.querySelector('[data-status]');
      if (sel) sel.addEventListener('change', async () => {
        const prev = o.status || 'new';
        o.status = sel.value;
        try { await BQ.api.updateOrder(token, id, { status: sel.value }); toast('اتحدّثت الحالة'); main(); }
        catch (e) { o.status = prev; sel.value = prev; toast('تعذّر الحفظ: ' + e.message); }
      });

      const noteBtn = el.querySelector('[data-save-note]');
      if (noteBtn) noteBtn.addEventListener('click', async () => {
        const v = el.querySelector('[data-note]').value;
        noteBtn.disabled = true;
        try { await BQ.api.updateOrder(token, id, { adminNote: v }); o.adminNote = v; el.querySelector('[data-saved]').textContent = 'اتحفظت ✓'; }
        catch (e) { toast('تعذّر الحفظ: ' + e.message); }
        noteBtn.disabled = false;
      });

      const send = el.querySelector('[data-wa-send]');
      if (send) send.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = el.querySelector('[data-wa]').value;
        window.open(`https://wa.me/${waPhone((o.customer || {}).phone)}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      });
      const cp = el.querySelector('[data-wa-copy]');
      if (cp) cp.addEventListener('click', () => copy(el.querySelector('[data-wa]').value));
    });
  }

  async function refresh() {
    const b = document.getElementById('reloadBtn');
    if (b) b.disabled = true;
    try { await load(); main(); toast('اتحدّثت القائمة'); }
    catch (e) { toast('تعذّر التحديث: ' + e.message); if (b) b.disabled = false; }
  }

  // --------------------------------------------------------- تصدير Excel
  function exportCsv() {
    const head = ['رقم الطلب', 'التاريخ', 'الحالة', 'الاسم', 'الهاتف', 'الإيميل', 'المحافظة', 'المدينة', 'العنوان', 'الطلب', 'الإجمالي', 'الدفع', 'رقم التحويل', 'ملاحظات العميلة', 'ملاحظة داخلية'];
    const cell = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const rows = visible().map((o) => {
      const c = o.customer || {};
      const items = (Array.isArray(o.items) ? o.items : []).map((i) => `${i.name} ${i.ml}مل ×${i.qty}`).join(' | ');
      return [o.id, o.date, (STATUS[o.status] || STATUS.new).label, c.name, c.phone, c.email, c.govName, c.city, c.street, items, o.subtotal, o.paymentLabel, o.ref, c.notes, o.adminNote].map(cell).join(',');
    });
    // BOM حتى يفتح الملف بالعربية صحيحًا في Excel
    const blob = new Blob(['﻿' + [head.map(cell).join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bouquet-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // ------------------------------------------------------------- البداية
  (async function start() {
    if (!BQ.api.configured()) return setupScreen();
    if (!token) return gate();
    try { await load(); main(); }
    catch (e) { token = ''; try { sessionStorage.removeItem(KEY); } catch (err) {} gate(e.message === 'unauthorized' ? 'انتهت الجلسة، ادخلي كلمة السر تاني.' : 'تعذّر الاتصال: ' + e.message); }
  })();
})();
