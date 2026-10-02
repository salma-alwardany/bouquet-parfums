/* =====================================================================
   بوكيه — الاتصال بسجل الطلبات (Google Apps Script)
   Bouquet — orders backend adapter
   ---------------------------------------------------------------------
   كل الاتصال بالخادم يمر من هنا. لو أردتِ لاحقًا تغيير مكان تخزين
   الطلبات (Supabase، متجر حقيقي…) يكفي استبدال محتوى هذا الملف
   مع الإبقاء على نفس أسماء الدوال.

   ملاحظة تقنية: Google Apps Script لا يدعم طلبات preflight، لذلك
   نرسل البيانات بنوع text/plain وهو ما يتجنّبها (الخادم يفكّ الـJSON).
   ===================================================================== */
(function () {
  'use strict';

  const cfg = window.BQ_CONFIG || {};
  const URL_ = (cfg.backend && cfg.backend.url) || '';
  const QUEUE_KEY = 'bq_outbox_v1';
  const TIMEOUT = 20000;

  const configured = () => /^https?:\/\/.+/.test(URL_);

  async function call(payload) {
    if (!configured()) throw new Error('backend-not-configured');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
    try {
      const res = await fetch(URL_, {
        method: 'POST',
        // text/plain يتجنّب طلب preflight الذي لا يدعمه Apps Script
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('http-' + res.status);
      const data = await res.json();
      if (!data || data.ok !== true) throw new Error((data && data.error) || 'server-error');
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  // ------------------------------------------------- صندوق الصادر
  // لو فشل الإرسال (نت مقطوع مثلًا) نحفظ الطلب ونعيد المحاولة لاحقًا،
  // حتى لا يضيع أي طلب. الطلب يُحفظ أيضًا على جهاز العميلة في كل الأحوال.
  const readQueue = () => { try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch (e) { return []; } };
  const writeQueue = (q) => { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-30))); } catch (e) {} };

  function enqueue(order) {
    const q = readQueue();
    if (!q.some((o) => o.id === order.id)) { q.push(order); writeQueue(q); }
  }

  async function flush() {
    if (!configured()) return { sent: 0, left: readQueue().length };
    const q = readQueue();
    if (!q.length) return { sent: 0, left: 0 };
    let sent = 0;
    const left = [];
    for (const order of q) {
      try { await call({ action: 'order', order }); sent++; }
      catch (e) { left.push(order); }
    }
    writeQueue(left);
    return { sent, left: left.length };
  }

  /**
   * إرسال طلب جديد. لا ترمي استثناءً أبدًا — ترجع حالة الإرسال
   * حتى لا يتعطّل إتمام الطلب على العميلة لو الخادم غير مضبوط أو النت ضعيف.
   */
  async function submitOrder(order) {
    if (!configured()) return { ok: false, reason: 'not-configured' };
    try {
      await call({ action: 'order', order });
      return { ok: true };
    } catch (e) {
      enqueue(order);
      return { ok: false, reason: String(e.message || e) };
    }
  }

  // ------------------------------------------------- لوحة التحكم
  const listOrders = (token) => call({ action: 'list', token });
  const updateOrder = (token, id, patch) => call({ action: 'update', token, id, patch });

  window.BQ = window.BQ || {};
  window.BQ.api = { configured, submitOrder, listOrders, updateOrder, flush, pending: () => readQueue().length };

  // محاولة صامتة لإرسال أي طلبات عالقة عند فتح الموقع
  if (configured() && readQueue().length) setTimeout(flush, 2500);
})();
