/* =====================================================================
   بوكيه — الترجمة (عربي / إنجليزي)  |  Bouquet — translations
   ---------------------------------------------------------------------
   كل نصوص الواجهة هنا. في HTML: data-i18n="key" (نص)، data-i18n-html
   (نص يحتوي <br>)، data-i18n-attr="placeholder:key; aria-label:key".
   ===================================================================== */
(function () {
  'use strict';

  const DICT = {
    // ---------- عام ----------
    'skip':            { ar: 'تخطي إلى المحتوى', en: 'Skip to content' },
    'brand':           { ar: 'بوكيه', en: 'Bouquet' },
    'lang.switch':     { ar: 'EN', en: 'ع' },
    'lang.switchLabel':{ ar: 'Switch to English', en: 'التبديل إلى العربية' },
    'close':           { ar: 'إغلاق', en: 'Close' },
    'ml':              { ar: 'مل', en: 'ml' },
    'priceOnRequest':  { ar: 'السعر عند الطلب', en: 'Price on request' },
    'from':            { ar: 'ابتداءً من', en: 'From' },

    // ---------- التنقل ----------
    'nav.home':        { ar: 'الرئيسية', en: 'Home' },
    'nav.collection':  { ar: 'المجموعة', en: 'Collection' },
    'nav.discover':    { ar: 'اكتشفي عطرك', en: 'Find your scent' },
    'nav.story':       { ar: 'قصتنا', en: 'Our story' },
    'nav.contact':     { ar: 'تواصلي معنا', en: 'Contact' },
    'nav.search':      { ar: 'بحث', en: 'Search' },
    'nav.account':     { ar: 'حسابي', en: 'Account' },
    'nav.wishlist':    { ar: 'المفضلة', en: 'Wishlist' },
    'nav.cart':        { ar: 'السلة', en: 'Bag' },
    'nav.menu':        { ar: 'القائمة', en: 'Menu' },
    'nav.main':        { ar: 'التنقل الرئيسي', en: 'Main navigation' },

    // ---------- الواجهة الرئيسية ----------
    'hero.title':      { ar: 'عِطرٌ يُحكى', en: 'A Story Told in Scent' },
    'hero.cta1':       { ar: 'اكتشفي العطور', en: 'Discover the fragrances' },
    'hero.cta2':       { ar: 'استكشفي مجموعتنا', en: 'Explore our collection' },
    'hero.scroll':     { ar: 'مرّري للأسفل', en: 'Scroll' },
    'hero.logoAlt':    { ar: 'شعار بوكيه — عطور', en: 'Bouquet Parfums logo' },
    'hero.videoLabel': { ar: 'مشاهد من عالم بوكيه: دخان عطري، بتلات، وزجاجة العطر', en: 'Scenes from the world of Bouquet: scented smoke, petals and the perfume bottle' },

    // ---------- المقدمة ----------
    'intro.title':     { ar: 'بوكيه… حكاية تبدأ بعطر', en: 'Bouquet… a story that begins with a scent' },
    'intro.body':      { ar: 'نصنع عطورًا تحمل أكثر من رائحة؛<br>تحمل إحساسًا، وذكرى، وحضورًا لا يُنسى.', en: 'We create fragrances that carry more than a scent —<br>a feeling, a memory, and an unforgettable presence.' },

    // ---------- المشهد التوقيعي ----------
    'sig.line1':       { ar: 'من الزهرة…', en: 'From the flower…' },
    'sig.line2':       { ar: '…إلى العطر', en: '…to the fragrance' },
    'sig.label':       { ar: 'من الزهرة إلى العطر', en: 'From the flower to the fragrance' },
    'sig.caption':     { ar: 'كل زجاجة من بوكيه تبدأ بزهرة.', en: 'Every Bouquet bottle begins with a flower.' },

    // ---------- المجموعة ----------
    'col.title':       { ar: 'مجموعتنا', en: 'Our Collection' },
    'col.lead':        { ar: 'عطور صُمّمت لتُروى، لكلٍّ منها شخصيتها وحكايتها.', en: 'Fragrances composed to be told — each with its own character and story.' },
    'col.viewAll':     { ar: 'عرض كل العطور', en: 'View all fragrances' },

    // ---------- بطاقة العطر ----------
    'card.discover':   { ar: 'اكتشفي العطر', en: 'Discover' },
    'card.add':        { ar: 'أضيفي إلى السلة', en: 'Add to bag' },
    'card.wishAdd':    { ar: 'أضيفي إلى المفضلة', en: 'Add to wishlist' },
    'card.wishRemove': { ar: 'إزالة من المفضلة', en: 'Remove from wishlist' },
    'toast.added':     { ar: 'أُضيف «{name}» إلى السلة', en: '“{name}” was added to your bag' },
    'toast.wishOn':    { ar: 'أُضيف «{name}» إلى المفضلة', en: '“{name}” saved to your wishlist' },
    'toast.wishOff':   { ar: 'أُزيل «{name}» من المفضلة', en: '“{name}” removed from your wishlist' },
    'toast.view':      { ar: 'عرض السلة', en: 'View bag' },

    // ---------- اكتشفي عطرك ----------
    'disc.title':      { ar: 'اكتشفي عطرك', en: 'Find your scent' },
    'disc.subtitle':   { ar: 'كل عطر يحكي شخصية مختلفة.', en: 'Every fragrance tells a different personality.' },
    'disc.all':        { ar: 'الكل', en: 'All' },
    'disc.allMood':    { ar: 'ثمانية عطور، ثماني حكايات. اختاري العائلة التي تشبهكِ.', en: 'Eight fragrances, eight stories. Choose the family that feels like you.' },
    'disc.empty':      { ar: 'لا توجد عطور في هذه العائلة بعد.', en: 'No fragrances in this family yet.' },
    'disc.filters':    { ar: 'العائلات العطرية', en: 'Olfactive families' },

    // ---------- رحلة العطر ----------
    'jour.title':      { ar: 'رحلة العطر', en: 'The Fragrance Journey' },
    'jour.lead':       { ar: 'من اللمسة الأولى حتى الأثر الأخير، يتكشّف العطر على ثلاث مراحل.', en: 'From the first touch to the last trace, a fragrance unfolds in three movements.' },
    'jour.choose':     { ar: 'اختاري عطرًا', en: 'Choose a fragrance' },
    'jour.top':        { ar: 'المقدمة', en: 'The opening' },
    'jour.heart':      { ar: 'القلب', en: 'The heart' },
    'jour.base':       { ar: 'القاعدة', en: 'The trail' },
    'jour.topHint':    { ar: 'الانطباع الأول', en: 'The first impression' },
    'jour.heartHint':  { ar: 'روح العطر', en: 'The soul of the scent' },
    'jour.baseHint':   { ar: 'الأثر الذي يبقى', en: 'The trace that stays' },
    'jour.view':       { ar: 'اكتشفي «{name}»', en: 'Discover {name}' },

    // ---------- العطر المميز ----------
    'feat.notes':      { ar: 'النوتات', en: 'Notes' },

    // ---------- قصتنا ----------
    'story.title':     { ar: 'وراء كل عطر… حكاية', en: 'Behind every fragrance… a story' },
    'story.p1':        { ar: 'في بوكيه نؤمن أن العطر ليس ما نضعه فحسب، بل ما نتركه خلفنا: أثرٌ خفيف في المكان، وذكرى تعود كلما مرّت النسمة ذاتها.', en: 'At Bouquet we believe a fragrance is not only what we wear, but what we leave behind: a gentle trace in a room, and a memory that returns whenever the same breeze passes by.' },
    'story.p2':        { ar: 'استلهمنا اسمنا من باقة الزهور؛ تلك اللحظة التي تجتمع فيها الألوان والروائح لتقول ما تعجز عنه الكلمات. ومن الزهرة نبدأ دائمًا، ثم نبحث عن الإحساس الذي نريد له أن يبقى.', en: 'Our name comes from the bouquet — that moment when colours and scents come together to say what words cannot. We always begin with a flower, then search for the feeling we want to stay.' },
    'story.p3':        { ar: 'نؤلّف كل عطر بعناية كي يصبح جزءًا من حضورك وملامح حكايتك أنتِ؛ لأن العطر هوية، وأجمل الحكايات تلك التي تُروى بلا كلمات.', en: 'Each fragrance is composed with care to become part of your presence and the shape of your own story — because fragrance is identity, and the most beautiful stories are told without words.' },
    'story.quote':     { ar: 'لأن العطر هوية.', en: 'Because fragrance is identity.' },
    'story.imgAlt':    { ar: 'زهور عنابية داكنة في ضوء دافئ', en: 'Deep burgundy flowers in warm light' },

    // ---------- الفوتر ----------
    'foot.newsTitle':  { ar: 'كوني أول من يعرف جديد بوكيه', en: 'Be the first to hear what’s new at Bouquet' },
    'foot.newsLead':   { ar: 'إصدارات جديدة، وحكايات عطرية، ودعوات خاصة… مرة واحدة كل فترة.', en: 'New releases, scented stories and private invitations… only now and then.' },
    'foot.email':      { ar: 'بريدك الإلكتروني', en: 'Your email' },
    'foot.subscribe':  { ar: 'اشتركي', en: 'Subscribe' },
    'foot.thanks':     { ar: 'شكرًا لكِ، ستصلك أخبارنا قريبًا.', en: 'Thank you — you’ll hear from us soon.' },
    'foot.badEmail':   { ar: 'يرجى كتابة بريد إلكتروني صحيح.', en: 'Please enter a valid email address.' },
    'foot.explore':    { ar: 'تصفّحي', en: 'Explore' },
    'foot.care':       { ar: 'خدمة العملاء', en: 'Client care' },
    'foot.service':    { ar: 'خدمة العملاء', en: 'Customer service' },
    'foot.shipping':   { ar: 'الشحن والإرجاع', en: 'Shipping & returns' },
    'foot.privacy':    { ar: 'سياسة الخصوصية', en: 'Privacy policy' },
    'foot.terms':      { ar: 'الشروط والأحكام', en: 'Terms & conditions' },
    'foot.follow':     { ar: 'تابعينا', en: 'Follow us' },
    'foot.whatsapp':   { ar: 'واتساب', en: 'WhatsApp' },
    'foot.rights':     { ar: '© {y} بوكيه — عطور. جميع الحقوق محفوظة.', en: '© {y} Bouquet Parfums. All rights reserved.' },

    // ---------- السلة ----------
    'cart.title':      { ar: 'سلة التسوق', en: 'Your bag' },
    'cart.empty':      { ar: 'سلتك فارغة… حتى الآن.', en: 'Your bag is empty… for now.' },
    'cart.emptyCta':   { ar: 'اكتشفي العطور', en: 'Discover the fragrances' },
    'cart.subtotal':   { ar: 'المجموع الفرعي', en: 'Subtotal' },
    'cart.shipNote':   { ar: 'تُحدَّد رسوم الشحن عند إتمام الطلب.', en: 'Shipping is calculated at checkout.' },
    'cart.checkout':   { ar: 'إتمام الطلب', en: 'Checkout' },
    'cart.continue':   { ar: 'متابعة التسوق', en: 'Continue shopping' },
    'cart.remove':     { ar: 'إزالة', en: 'Remove' },
    'cart.qty':        { ar: 'الكمية', en: 'Quantity' },
    'cart.inc':        { ar: 'زيادة الكمية', en: 'Increase quantity' },
    'cart.dec':        { ar: 'تقليل الكمية', en: 'Decrease quantity' },
    'cart.count':      { ar: 'عدد القطع: {n}', en: '{n} item(s)' },

    // ---------- المفضلة ----------
    'wish.title':      { ar: 'المفضلة', en: 'Wishlist' },
    'wish.empty':      { ar: 'لم تضيفي عطورًا إلى المفضلة بعد.', en: 'You haven’t saved any fragrances yet.' },

    // ---------- البحث ----------
    'search.label':    { ar: 'ابحثي في عطور بوكيه', en: 'Search Bouquet fragrances' },
    'search.ph':       { ar: 'ابحثي عن عطر، نوتة، أو عائلة عطرية…', en: 'Search a fragrance, a note or a family…' },
    'search.suggest':  { ar: 'اقتراحات', en: 'Suggestions' },
    'search.none':     { ar: 'لا نتائج لـ «{q}»', en: 'No results for “{q}”' },
    'search.count':    { ar: 'عدد النتائج: {n}', en: '{n} result(s)' },

    // ---------- صفحة العطر ----------
    'pdp.home':        { ar: 'الرئيسية', en: 'Home' },
    'pdp.collection':  { ar: 'المجموعة', en: 'Collection' },
    'pdp.family':      { ar: 'العائلة العطرية', en: 'Olfactive family' },
    'pdp.size':        { ar: 'اختاري الحجم', en: 'Choose a size' },
    'pdp.qty':         { ar: 'الكمية', en: 'Quantity' },
    'pdp.add':         { ar: 'أضيفي إلى السلة', en: 'Add to bag' },
    'pdp.buy':         { ar: 'اشتري الآن', en: 'Buy now' },
    'pdp.wishAdd':     { ar: 'أضيفي إلى المفضلة', en: 'Add to wishlist' },
    'pdp.wishOn':      { ar: 'في المفضلة', en: 'In your wishlist' },
    'pdp.journey':     { ar: 'رحلة العطر', en: 'The Fragrance Journey' },
    'pdp.related':     { ar: 'قد يعجبك أيضًا', en: 'You may also like' },
    'pdp.details':     { ar: 'تفاصيل العطر', en: 'Details' },
    'pdp.concentration':{ ar: 'التركيز', en: 'Concentration' },
    'pdp.sizes':       { ar: 'الأحجام المتاحة', en: 'Available sizes' },
    'pdp.delivery':    { ar: 'التوصيل والإرجاع', en: 'Delivery & returns' },
    'pdp.deliveryText':{ ar: 'يُضاف هنا ملخص سياسة التوصيل والإرجاع الخاصة ببوكيه (المدة، المناطق، والرسوم).', en: 'A summary of Bouquet’s delivery and returns policy (timing, areas and fees) goes here.' },
    'pdp.deliveryMore':{ ar: 'اقرئي السياسة كاملة', en: 'Read the full policy' },
    'pdp.notFound':    { ar: 'لم نجد هذا العطر.', en: 'We couldn’t find this fragrance.' },
    'pdp.back':        { ar: 'العودة إلى المجموعة', en: 'Back to the collection' },
    'pdp.gallery':     { ar: 'صور العطر', en: 'Product images' },
    'pdp.imageN':      { ar: 'الصورة {n}', en: 'Image {n}' },
    'pdp.total':       { ar: 'الإجمالي', en: 'Total' },

    // ---------- إتمام الطلب ----------
    'co.title':        { ar: 'إتمام الطلب', en: 'Checkout' },
    'co.contact':      { ar: 'بيانات التواصل', en: 'Contact' },
    'co.address':      { ar: 'عنوان التوصيل', en: 'Delivery address' },
    'co.payment':      { ar: 'طريقة الدفع', en: 'Payment' },
    'co.name':         { ar: 'الاسم الكامل', en: 'Full name' },
    'co.phone':        { ar: 'رقم الهاتف (واتساب)', en: 'Phone (WhatsApp)' },
    'co.email':        { ar: 'البريد الإلكتروني (اختياري)', en: 'Email (optional)' },
    'co.gov':          { ar: 'المحافظة', en: 'Governorate' },
    'co.govChoose':    { ar: 'اختاري المحافظة', en: 'Choose a governorate' },
    'co.city':         { ar: 'المدينة / المنطقة', en: 'City / area' },
    'co.street':       { ar: 'العنوان بالتفصيل', en: 'Street address' },
    'co.streetPh':     { ar: 'الشارع، رقم المبنى، الدور، علامة مميزة', en: 'Street, building, floor, landmark' },
    'co.notes':        { ar: 'ملاحظات على الطلب (اختياري)', en: 'Order notes (optional)' },
    'co.notesPh':      { ar: 'هدية؟ اكتبي رسالة الإهداء هنا…', en: 'A gift? Write your message here…' },
    'co.cod':          { ar: 'الدفع عند الاستلام', en: 'Cash on delivery' },
    'co.codHint':      { ar: 'ادفعي نقدًا عند استلام طلبك.', en: 'Pay in cash when your order arrives.' },
    'co.card':         { ar: 'الدفع بالبطاقة', en: 'Card payment' },
    'co.cardHint':     { ar: 'قريبًا', en: 'Coming soon' },
    'co.save':         { ar: 'احفظي بياناتي على هذا الجهاز لطلبات قادمة', en: 'Save my details on this device for next time' },
    'co.summary':      { ar: 'ملخص الطلب', en: 'Order summary' },
    'co.edit':         { ar: 'تعديل السلة', en: 'Edit bag' },
    'co.shipping':     { ar: 'الشحن', en: 'Shipping' },
    'co.shippingTBD':  { ar: 'يُحدَّد حسب المحافظة', en: 'Set by governorate' },
    'co.total':        { ar: 'الإجمالي', en: 'Total' },
    'co.place':        { ar: 'تأكيد الطلب عبر واتساب', en: 'Place order via WhatsApp' },
    'co.placeNote':    { ar: 'سيُفتح واتساب برسالة فيها تفاصيل طلبك، لنؤكده معكِ ونرتّب التوصيل.', en: 'WhatsApp will open with your order details so we can confirm it with you and arrange delivery.' },
    'co.required':     { ar: 'هذا الحقل مطلوب', en: 'This field is required' },
    'co.badPhone':     { ar: 'يرجى إدخال رقم هاتف صحيح', en: 'Please enter a valid phone number' },
    'co.badEmail':     { ar: 'يرجى إدخال بريد إلكتروني صحيح', en: 'Please enter a valid email' },
    'co.fixErrors':    { ar: 'يرجى مراجعة الحقول المطلوبة.', en: 'Please review the required fields.' },
    'co.emptyTitle':   { ar: 'سلتك فارغة', en: 'Your bag is empty' },
    'co.emptyText':    { ar: 'أضيفي عطرًا واحدًا على الأقل لإتمام الطلب.', en: 'Add at least one fragrance to check out.' },
    'co.thanks':       { ar: 'شكرًا لكِ', en: 'Thank you' },
    'co.thanksText':   { ar: 'سجّلنا طلبك رقم {id}. أرسلي الرسالة المفتوحة في واتساب لنؤكد الطلب معكِ ونرتّب التوصيل.', en: 'We’ve recorded your order {id}. Send the message that opened in WhatsApp so we can confirm it and arrange delivery.' },
    'co.resend':       { ar: 'فتح واتساب مرة أخرى', en: 'Open WhatsApp again' },
    'co.backHome':     { ar: 'العودة إلى الرئيسية', en: 'Back to home' },
    'co.secure':       { ar: 'لا نطلب أي بيانات بطاقة على هذا الموقع.', en: 'We never ask for card details on this site.' },

    // رسالة واتساب
    'wa.greeting':     { ar: 'مرحبًا بوكيه 🌸 أودّ تأكيد هذا الطلب:', en: 'Hello Bouquet 🌸 I’d like to confirm this order:' },
    'wa.order':        { ar: 'رقم الطلب', en: 'Order' },
    'wa.customer':     { ar: 'بيانات العميلة', en: 'Customer' },
    'wa.payment':      { ar: 'الدفع', en: 'Payment' },
    'wa.notes':        { ar: 'ملاحظات', en: 'Notes' },

    // ---------- الحساب ----------
    'acc.title':       { ar: 'حسابي', en: 'My account' },
    'acc.welcome':     { ar: 'أهلًا بكِ في بوكيه', en: 'Welcome to Bouquet' },
    'acc.device':      { ar: 'تُحفظ بياناتك وطلباتك ومفضلتك على هذا الجهاز فقط.', en: 'Your details, orders and wishlist are saved on this device only.' },
    'acc.signin':      { ar: 'تسجيل الدخول وإنشاء حساب', en: 'Sign in & create account' },
    'acc.signinSoon':  { ar: 'قريبًا — يتطلب ربط الموقع بنظام متجر.', en: 'Coming soon — requires connecting a store backend.' },
    'acc.orders':      { ar: 'طلباتي', en: 'My orders' },
    'acc.wishlist':    { ar: 'المفضلة', en: 'Wishlist' },
    'acc.details':     { ar: 'بياناتي', en: 'My details' },
    'acc.noOrders':    { ar: 'لا توجد طلبات بعد.', en: 'No orders yet.' },
    'acc.save':        { ar: 'حفظ البيانات', en: 'Save details' },
    'acc.saved':       { ar: 'تم حفظ بياناتك.', en: 'Your details were saved.' },
    'acc.clear':       { ar: 'مسح بياناتي من هذا الجهاز', en: 'Clear my data from this device' },
    'acc.cleared':     { ar: 'تم مسح البيانات.', en: 'Your data was cleared.' },
    'acc.orderItems':  { ar: 'عدد القطع: {n}', en: '{n} item(s)' },
    'acc.status':      { ar: 'بانتظار التأكيد عبر واتساب', en: 'Awaiting WhatsApp confirmation' },

    // ---------- السياسات ----------
    'pol.title':       { ar: 'خدمة العملاء', en: 'Client care' },
    'pol.lead':        { ar: 'كل ما تحتاجين معرفته عن الطلب، والتوصيل، وبياناتك.', en: 'Everything you need to know about ordering, delivery and your data.' },
    'pol.contactText': { ar: 'فريقنا سعيد بمساعدتك في اختيار عطرك أو متابعة طلبك. تواصلي معنا مباشرة عبر واتساب.', en: 'Our team is happy to help you choose a fragrance or follow up on an order. Reach us directly on WhatsApp.' },
    'pol.chat':        { ar: 'تحدّثي معنا عبر واتساب', en: 'Chat with us on WhatsApp' },
    'pol.shipText':    { ar: 'يُضاف هنا نص سياسة الشحن والإرجاع الفعلية: مناطق التوصيل، المدة المتوقعة، رسوم الشحن لكل محافظة، وشروط الاستبدال والإرجاع.', en: 'Bouquet’s actual shipping & returns policy goes here: delivery areas, expected timing, shipping fees per governorate, and exchange/return conditions.' },
    'pol.privacyText1':{ ar: 'يحفظ هذا الموقع محتوى سلتك ومفضلتك وبيانات التوصيل التي تختارين حفظها داخل متصفحك على جهازك فقط، ولا تُرسل إلى أي خادم.', en: 'This website keeps your bag, wishlist and any delivery details you choose to save inside your browser on your device only; they are not sent to any server.' },
    'pol.privacyText2':{ ar: 'عند تأكيد الطلب، تُرسل تفاصيله إلى بوكيه عبر واتساب بعد موافقتك. يُضاف هنا نص سياسة الخصوصية الكاملة للمتجر.', en: 'When you place an order, its details are sent to Bouquet through WhatsApp with your approval. The store’s full privacy policy goes here.' },
    'pol.termsText':   { ar: 'يُضاف هنا نص الشروط والأحكام الخاصة ببوكيه.', en: 'Bouquet’s terms & conditions go here.' },

    // ---------- شارة المحتوى التجريبي ----------
    'ph.badge':        { ar: 'محتوى تجريبي', en: 'Placeholder content' },
    'ph.hint':         { ar: 'إظهار/إخفاء إطار المحتوى المؤقت الذي يجب استبداله قبل الإطلاق', en: 'Show/hide outlines around placeholder content to replace before launch' },
  };

  const KEY = 'bq_lang';
  const cfg = window.BQ_CONFIG || {};
  let lang = cfg.defaultLang || 'ar';
  try { const s = localStorage.getItem(KEY); if (s === 'ar' || s === 'en') lang = s; } catch (e) {}

  function t(key, vars) {
    const e = DICT[key];
    let s = e ? (e[lang] != null ? e[lang] : e.ar) : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }
  // اختيار النص المناسب من كائن {ar, en}
  function L(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] != null ? obj[lang] : obj.ar;
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((x) => x && x.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
  }

  function setDocLang() {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    setDocLang();
    apply();
    document.dispatchEvent(new CustomEvent('bq:lang', { detail: { lang } }));
  }

  // يُطبَّق مبكرًا لتفادي وميض الاتجاه
  setDocLang();

  window.BQ = window.BQ || {};
  window.BQ.i18n = {
    t, L, apply, setLang,
    get lang() { return lang; },
    toggle() { setLang(lang === 'ar' ? 'en' : 'ar'); },
  };
})();
