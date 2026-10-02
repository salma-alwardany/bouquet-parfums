/* =====================================================================
   بوكيه — سجل الطلبات  |  Bouquet orders backend (Google Apps Script)
   ---------------------------------------------------------------------
   الصق هذا الملف كاملًا في Apps Script المرتبط بجوجل شيت.
   الخطوات بالتفصيل في: apps-script/دليل-الإعداد.md

   ماذا يفعل:
     • يستقبل كل طلب من الموقع ويسجّله في الشيت
     • يبعث إيميل فوري بتفاصيل الطلب
     • يبعث رسالة تليجرام فورية (اختياري)
     • يعطي لوحة التحكم قائمة الطلبات ويحدّث حالتها
   ===================================================================== */

var PROPS = PropertiesService.getScriptProperties();
var SHEET_NAME = 'الطلبات';

var HEADERS = ['رقم الطلب', 'التاريخ', 'الحالة', 'الاسم', 'الهاتف', 'الإيميل',
  'المحافظة', 'المدينة', 'العنوان', 'الطلب', 'الإجمالي', 'الدفع',
  'رقم التحويل', 'ملاحظات العميلة', 'ملاحظة داخلية', 'بيانات (لا تعدّليها)'];

// الحالات: الكود المستخدم في الموقع ← الاسم الظاهر في الشيت
var STATUS_AR = { 'new': 'جديد', 'confirmed': 'مؤكد', 'shipped': 'تم الشحن', 'delivered': 'تم التسليم', 'cancelled': 'ملغي' };
function statusCode(ar) {
  for (var k in STATUS_AR) if (STATUS_AR[k] === String(ar).trim()) return k;
  return 'new';
}

/* ====================== الإعداد لمرة واحدة ====================== */

/**
 * شغّلي هذه الدالة مرة واحدة بعد لصق الكود.
 * تنشئ ورقة الطلبات بعناوين الأعمدة وتولّد كلمة سر للوحة التحكم.
 */
function setup() {
  var sheet = getSheet();
  if (!PROPS.getProperty('ADMIN_TOKEN')) {
    var token = Utilities.getUuid().replace(/-/g, '').slice(0, 14);
    PROPS.setProperty('ADMIN_TOKEN', token);
  }
  if (!PROPS.getProperty('NOTIFY_EMAIL')) {
    PROPS.setProperty('NOTIFY_EMAIL', Session.getEffectiveUser().getEmail());
  }
  var msg = 'تمّ الإعداد ✅\n\n'
    + 'كلمة سر لوحة التحكم: ' + PROPS.getProperty('ADMIN_TOKEN') + '\n'
    + 'إيميل الإشعارات: ' + PROPS.getProperty('NOTIFY_EMAIL') + '\n\n'
    + 'احفظي كلمة السر في مكان آمن — هتحتاجيها لفتح صفحة admin.html';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) {}
  return msg;
}

/** لتغيير إيميل الإشعارات: عدّلي السطر وشغّلي الدالة. */
function setNotifyEmail() {
  var email = 'ضعي_الإيميل_هنا@gmail.com';
  PROPS.setProperty('NOTIFY_EMAIL', email);
  Logger.log('إيميل الإشعارات الآن: ' + email);
}

/** لتفعيل تليجرام: ضعي التوكن ورقم المحادثة وشغّلي الدالة. */
function setTelegram() {
  var botToken = '';   // التوكن من BotFather
  var chatId = '';     // رقم محادثتك — استخدمي findTelegramChatId()
  PROPS.setProperty('TELEGRAM_TOKEN', botToken);
  PROPS.setProperty('TELEGRAM_CHAT', chatId);
  Logger.log('تم حفظ إعدادات تليجرام.');
}

/** بعد ما تبعتي رسالة "مرحبا" للبوت، شغّلي هذه الدالة لتعرفي رقم محادثتك. */
function findTelegramChatId() {
  var tk = PROPS.getProperty('TELEGRAM_TOKEN');
  if (!tk) { Logger.log('ضعي التوكن أولًا في setTelegram'); return; }
  var res = UrlFetchApp.fetch('https://api.telegram.org/bot' + tk + '/getUpdates', { muteHttpExceptions: true });
  var data = JSON.parse(res.getContentText());
  if (!data.result || !data.result.length) { Logger.log('ابعتي رسالة للبوت الأول ثم أعيدي المحاولة.'); return; }
  data.result.forEach(function (u) {
    var c = (u.message && u.message.chat) || (u.channel_post && u.channel_post.chat);
    if (c) Logger.log('رقم المحادثة: ' + c.id + '  (' + (c.first_name || c.title || '') + ')');
  });
}

/** اختبار سريع: يرسل إشعار تجريبي على الإيميل والتليجرام. */
function testNotification() {
  var demo = {
    id: 'BQ-TEST-0001', date: new Date().toISOString(),
    items: [{ name: 'وردة الليل', latin: 'Rose de Nuit', ml: 50, qty: 1, price: 1450 }],
    subtotal: 1450, currency: 'ج.م', payment: 'cod', paymentLabel: 'الدفع عند الاستلام', ref: '',
    customer: { name: 'طلب تجريبي', phone: '01000000000', email: '', govName: 'القاهرة', city: 'مدينة نصر', street: 'شارع ١', notes: 'ده اختبار' }
  };
  notify(demo);
  Logger.log('تم إرسال إشعار تجريبي.');
}

/* ====================== نقطة الدخول ====================== */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json({ ok: false, error: 'empty-request' });
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    // تسجيل طلب جديد — مفتوح للموقع
    if (action === 'order') return json(createOrder(body.order));

    // باقي العمليات تحتاج كلمة السر
    var token = PROPS.getProperty('ADMIN_TOKEN');
    if (!token || body.token !== token) return json({ ok: false, error: 'unauthorized' });

    if (action === 'list') return json({ ok: true, orders: listOrders() });
    if (action === 'update') return json(updateOrder(body.id, body.patch || {}));
    return json({ ok: false, error: 'unknown-action' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:system-ui;padding:40px;text-align:center">'
    + '<h2>سجل طلبات بوكيه شغّال ✅</h2>'
    + '<p>انسخي رابط هذه الصفحة وضعيه في js/config.js داخل backend.url</p></div>'
  );
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ====================== الشيت ====================== */

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var head = sheet.getRange(1, 1, 1, HEADERS.length);
    head.setFontWeight('bold').setBackground('#7D162A').setFontColor('#F8F3EE');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 140); sheet.setColumnWidth(2, 150); sheet.setColumnWidth(10, 320);
    sheet.setColumnWidth(9, 220); sheet.hideColumns(HEADERS.length);
    sheet.getRange(1, 1, 1, HEADERS.length).setHorizontalAlignment('right');
  }
  return sheet;
}

function createOrder(order) {
  if (!order || !order.id || !order.customer) return { ok: false, error: 'bad-order' };
  var sheet = getSheet();

  // تجاهل التكرار لو اتبعت نفس الطلب مرتين
  var ids = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues() : [];
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(order.id)) return { ok: true, duplicate: true };

  var c = order.customer;
  var items = (order.items || []).map(function (i) { return i.name + ' ' + i.ml + 'مل ×' + i.qty; }).join('\n');

  sheet.appendRow([
    order.id,
    order.date ? new Date(order.date) : new Date(),
    STATUS_AR[order.status] || STATUS_AR['new'],
    c.name || '', "'" + (c.phone || ''), c.email || '',
    c.govName || '', c.city || '', c.street || '',
    items, Number(order.subtotal) || 0, order.paymentLabel || '',
    order.ref ? "'" + order.ref : '', c.notes || '', '',
    JSON.stringify(order),
  ]);

  try { notify(order); } catch (e) { /* فشل الإشعار لا يفشّل تسجيل الطلب */ }
  return { ok: true, id: order.id };
}

function listOrders() {
  var sheet = getSheet();
  if (sheet.getLastRow() < 2) return [];
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    var o = {};
    try { o = JSON.parse(r[HEADERS.length - 1]) || {}; } catch (e) { o = {}; }
    o.id = String(r[0]);
    o.date = r[1] instanceof Date ? r[1].toISOString() : String(r[1]);
    o.status = statusCode(r[2]);          // الحالة من الشيت هي المرجع
    o.adminNote = String(r[14] || '');
    o.subtotal = Number(r[10]) || 0;
    o.customer = o.customer || {};
    o.customer.name = String(r[3] || o.customer.name || '');
    o.customer.phone = String(r[4] || o.customer.phone || '').replace(/^'/, '');
    out.push(o);
  }
  return out;
}

function updateOrder(id, patch) {
  var sheet = getSheet();
  if (sheet.getLastRow() < 2) return { ok: false, error: 'not-found' };
  var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) !== String(id)) continue;
    var row = i + 2;
    if (patch.status && STATUS_AR[patch.status]) sheet.getRange(row, 3).setValue(STATUS_AR[patch.status]);
    if (typeof patch.adminNote === 'string') sheet.getRange(row, 15).setValue(patch.adminNote);
    return { ok: true };
  }
  return { ok: false, error: 'not-found' };
}

/* ====================== الإشعارات ====================== */

function notify(order) {
  var c = order.customer || {};
  var money = function (n) { return Number(n || 0).toLocaleString('en-US') + ' ' + (order.currency || 'ج.م'); };
  var items = (order.items || []).map(function (i) {
    return '• ' + i.name + ' — ' + i.ml + ' مل × ' + i.qty + ' = ' + money((i.price || 0) * (i.qty || 1));
  });

  var lines = ['طلب جديد على بوكيه 🌸', 'رقم الطلب: ' + order.id, ''].concat(items, [
    '', 'إجمالي العطور: ' + money(order.subtotal), '',
    'الاسم: ' + (c.name || ''),
    'الهاتف: ' + (c.phone || ''),
    (c.email ? 'الإيميل: ' + c.email : ''),
    'العنوان: ' + [c.govName, c.city, c.street].filter(String).join(' — '),
    'الدفع: ' + (order.paymentLabel || ''),
    (order.ref ? 'رقم التحويل: ' + order.ref : ''),
    (c.notes ? 'ملاحظات العميلة: ' + c.notes : ''),
  ]).filter(function (x) { return x !== ''; });

  var text = lines.join('\n');

  // ------- إيميل
  var email = PROPS.getProperty('NOTIFY_EMAIL');
  if (email) {
    var wa = 'https://wa.me/' + waPhone(c.phone);
    var html = '<div style="font-family:system-ui,Segoe UI,Tahoma,sans-serif;direction:rtl;text-align:right;'
      + 'max-width:560px;margin:auto;border:1px solid #e8dfd6;border-radius:4px;overflow:hidden">'
      + '<div style="background:#7D162A;color:#F8F3EE;padding:18px 22px">'
      + '<div style="font-size:19px;font-weight:600">طلب جديد على بوكيه 🌸</div>'
      + '<div style="opacity:.8;font-size:13px;margin-top:3px">' + order.id + '</div></div>'
      + '<div style="padding:22px;color:#2B171B;line-height:1.9;font-size:15px">'
      + '<div style="white-space:pre-line;background:#F8F3EE;padding:14px 16px;border-radius:3px">' + escapeHtml(text) + '</div>'
      + '<p style="margin:20px 0 0"><a href="' + wa + '" style="background:#1DA851;color:#fff;padding:11px 20px;'
      + 'border-radius:3px;text-decoration:none;display:inline-block">مراسلة العميلة على واتساب</a></p>'
      + '</div></div>';
    MailApp.sendEmail({ to: email, subject: 'طلب جديد ' + order.id + ' — ' + (c.name || ''), htmlBody: html, body: text });
  }

  // ------- تليجرام
  var tk = PROPS.getProperty('TELEGRAM_TOKEN');
  var chat = PROPS.getProperty('TELEGRAM_CHAT');
  if (tk && chat) {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + tk + '/sendMessage', {
      method: 'post', muteHttpExceptions: true,
      payload: { chat_id: chat, text: text, disable_web_page_preview: 'true' },
    });
  }
}

function waPhone(raw) {
  var d = String(raw || '').replace(/\D/g, '');
  if (d.indexOf('00') === 0) d = d.slice(2);
  if (d.indexOf('20') === 0) return d;
  if (d.indexOf('0') === 0) return '20' + d.slice(1);
  return d;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
