/* =====================================================================
   بوكيه — حالة المتجر (السلة، المفضلة، الطلبات، البيانات)
   Bouquet — store state, persisted in localStorage.
   ---------------------------------------------------------------------
   عند ربط الموقع لاحقًا بنظام متجر حقيقي (Shopify / WooCommerce / API)
   يكفي استبدال دوال هذا الملف مع الإبقاء على نفس الأسماء.
   ===================================================================== */
(function () {
  'use strict';

  const KEYS = { cart: 'bq_cart_v2', wish: 'bq_wish_v1', orders: 'bq_orders_v1', profile: 'bq_profile_v1' };

  const read = (k, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  const byId = {};
  (window.BQ_PRODUCTS || []).forEach((p) => { byId[p.id] = p; });

  let cart = read(KEYS.cart, []).filter((i) => byId[i.id]);
  let wish = read(KEYS.wish, []).filter((id) => byId[id]);

  const lineKey = (id, ml) => `${id}@${ml}`;

  function sizeOf(p, ml) {
    return p.sizes.find((s) => s.ml === ml) || p.sizes.find((s) => s.ml === p.defaultSize) || p.sizes[0];
  }

  const store = {
    product: (id) => byId[id],
    products: () => window.BQ_PRODUCTS || [],
    sizeOf,

    // ---------- السلة ----------
    cart: () => cart.map((i) => {
      const p = byId[i.id]; const s = sizeOf(p, i.ml);
      return { ...i, key: lineKey(i.id, i.ml), product: p, price: s.price, total: s.price * i.qty };
    }),
    cartCount: () => cart.reduce((n, i) => n + i.qty, 0),
    cartSubtotal: () => store.cart().reduce((n, i) => n + i.total, 0),

    add(id, ml, qty) {
      const p = byId[id]; if (!p) return;
      ml = sizeOf(p, ml).ml; qty = Math.max(1, qty || 1);
      const found = cart.find((i) => i.id === id && i.ml === ml);
      if (found) found.qty = Math.min(20, found.qty + qty);
      else cart.push({ id, ml, qty });
      write(KEYS.cart, cart);
      emit('bq:cart', { action: 'add', id, ml, qty });
    },
    setQty(key, qty) {
      const i = cart.find((x) => lineKey(x.id, x.ml) === key); if (!i) return;
      if (qty <= 0) return store.remove(key);
      i.qty = Math.min(20, qty);
      write(KEYS.cart, cart);
      emit('bq:cart', { action: 'qty' });
    },
    remove(key) {
      cart = cart.filter((x) => lineKey(x.id, x.ml) !== key);
      write(KEYS.cart, cart);
      emit('bq:cart', { action: 'remove' });
    },
    clearCart() { cart = []; write(KEYS.cart, cart); emit('bq:cart', { action: 'clear' }); },

    // ---------- المفضلة ----------
    wishlist: () => wish.map((id) => byId[id]).filter(Boolean),
    isWished: (id) => wish.includes(id),
    toggleWish(id) {
      if (!byId[id]) return false;
      const on = !wish.includes(id);
      wish = on ? [...wish, id] : wish.filter((x) => x !== id);
      write(KEYS.wish, wish);
      emit('bq:wish', { id, on });
      return on;
    },

    // ---------- الطلبات والبيانات ----------
    orders: () => read(KEYS.orders, []),
    addOrder(order) { const o = read(KEYS.orders, []); o.unshift(order); write(KEYS.orders, o.slice(0, 50)); },
    profile: () => read(KEYS.profile, {}),
    saveProfile(p) { write(KEYS.profile, p); },
    clearAll() {
      Object.values(KEYS).forEach((k) => { try { localStorage.removeItem(k); } catch (e) {} });
      cart = []; wish = [];
      emit('bq:cart', { action: 'clear' }); emit('bq:wish', {});
    },
  };

  // مزامنة بين النوافذ المفتوحة
  window.addEventListener('storage', (e) => {
    if (e.key === KEYS.cart) { cart = read(KEYS.cart, []).filter((i) => byId[i.id]); emit('bq:cart', { action: 'sync' }); }
    if (e.key === KEYS.wish) { wish = read(KEYS.wish, []).filter((id) => byId[id]); emit('bq:wish', {}); }
  });

  window.BQ = window.BQ || {};
  window.BQ.store = store;
})();
