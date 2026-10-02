/* =====================================================================
   بوكيه — بيانات العطور والأسعار
   ---------------------------------------------------------------------
   • لإضافة الأسعار: عدّلي القيم في SIZE_PRICES (سعر موحّد حسب الحجم)
     أو ضعي سعرًا خاصًا لعطر معيّن داخل خانة prices في المنتج نفسه.
   • القيمة null تعني "السعر عند الطلب" وتظهر للزبون كذلك.
   • العملة تُضبط من المتغير CURRENCY.
   ===================================================================== */

const CURRENCY = 'ج.م'; // الجنيه المصري

// الأسعار متغيّرة، لذلك لا تُعرض على الموقع: الزبون يختار العطور فتُجمَّع القائمة
// وتُرسل عبر واتساب ليتم تحديد السعر وتفاصيل التوصيل في المحادثة.
// اجعليها true لاحقًا لو رغبتِ بعرض الأسعار (مع تعبئة جدول SIZE_PRICES أدناه).
const SHOW_PRICES = false;

// رقم واتساب المتجر بصيغة دولية بدون + أو أصفار بادئة (مصر تبدأ بـ 20)
const SHOP_WHATSAPP = '201032107992';

// أحجام ومقاييس العطور المتاحة
const ALL_SIZES = ['ربع تولة', 'نصف تولة', 'تولة كامل', '10 مل', '20 مل', '25 مل', '50 مل'];

// جدول الأسعار حسب الحجم (سعر موحّد لكل الأنواع ما لم يُحدد سعر خاص للعطر)
// املئي الأرقام عند توفّر قائمة الأسعار، واتركي null لما لم يُحدد بعد.
const SIZE_PRICES = {
  'ربع تولة': null,
  'نصف تولة': null,
  'تولة كامل': null,
  '10 مل': null,
  '20 مل': null,
  '25 مل': null,
  '50 مل': null,
};

// الفئات
const CATEGORIES = [
  { id: 'women',     name: 'العطور النسائية',        sub: 'أناقة وأنوثة',                 emoji: '👗' },
  { id: 'women-vip', name: 'نسائي VIP',              sub: 'تشكيلة مميّزة وفاخرة',          emoji: '💎' },
  { id: 'men',       name: 'العطور الرجالية',        sub: 'حضور وثبات',                    emoji: '🧥' },
  { id: 'unisex',    name: 'مشترك — نسائي ورجالي',   sub: 'يناسب الجميع',                 emoji: '🤝' },
  { id: 'musk',      name: 'المسك',                  sub: 'نقاء وعبق',                    emoji: '🤍' },
  { id: 'oud',       name: 'العود الشرقي',           sub: 'عبق أصيل ومعتّق',              emoji: '🪵' },
  { id: 'spanish',   name: 'عطور أسبانية',           sub: 'وارد الإمارات',                emoji: '🌹' },
];

// شارات تعريفية
const BADGES = {
  vip:     { label: 'VIP',        cls: 'badge-vip' },
  spanish: { label: 'أسباني',     cls: 'badge-spanish' },
  kids:    { label: 'مناسب للأطفال', cls: 'badge-kids' },
};

// قائمة العطور — كل عطر يأخذ كل الأحجام افتراضيًا.
// لتخصيص أحجام عطر معيّن أضيفي: sizes: ['تولة كامل','50 مل']
// لتخصيص سعر عطر معيّن أضيفي: prices: { 'تولة كامل': 25000 }
const PRODUCTS = [
  // ===== نسائي =====
  { id: 'so-scandal',     name: 'سو سكندال',                 en: 'So Scandal',                 category: 'women' },
  { id: 'olympea',        name: 'أولمبيا',                   en: 'Olympéa',                    category: 'women' },
  { id: 'scandal-jpg',    name: 'سكندال جان بول',            en: 'Scandal — Jean Paul Gaultier', category: 'women' },
  { id: 'tosca',          name: 'توسكا',                     en: 'Tosca',                      category: 'women' },
  { id: 'chador',         name: 'شادور',                     en: 'Chador',                     category: 'women' },
  { id: 'cacilia',        name: 'كاسيليا',                   en: '',                           category: 'women' },
  { id: 'si-passione',    name: 'سي باشن أرماني الأحمر',     en: 'Sì Passione — Armani',       category: 'women' },
  { id: 'escape',         name: 'اسكيب',                     en: 'Escape',                     category: 'women' },
  { id: 'weekend',        name: 'ويك اند',                   en: 'Weekend',                    category: 'women' },
  { id: 'burberry',       name: 'بربري',                     en: 'Burberry',                   category: 'women' },
  { id: 'midnight',       name: 'ميد نايت',                  en: 'Midnight',                   category: 'women' },
  { id: 'gucci-rush',     name: 'جوتشي راش',                 en: 'Gucci Rush',                 category: 'women' },
  { id: 'escada-sunset',  name: 'اسكادا تاتش صن سِت',         en: 'Escada Sunset',              category: 'women' },
  { id: 'escada-coll',    name: 'اسكادا كولكشن',             en: 'Escada Collection',          category: 'women' },
  { id: 'escada-cherry',  name: 'اسكادا شيري',               en: 'Escada Cherry in the Air',   category: 'women' },
  { id: 'vs-verysexy',    name: 'فيري سكسي ناو',             en: 'Very Sexy Now — Victoria’s Secret', category: 'women' },
  { id: 'vs-heavenly',    name: 'لاف از هيفنلي',             en: 'Love is Heavenly — Victoria’s Secret', category: 'women' },
  { id: 'vs-sosexy',      name: 'سو سكسي',                   en: 'So Sexy — Victoria’s Secret', category: 'women' },
  { id: 'vs-bombshell',   name: 'بومب شيل',                  en: 'Bombshell — Victoria’s Secret', category: 'women' },
  { id: 'vs-wildsecret',  name: 'وايلد سيكرت',               en: 'Wild Secret — Victoria’s Secret', category: 'women' },
  { id: 'vs-pinkcurrant', name: 'بينك كرنت',                 en: 'Pink Currant — Victoria’s Secret', category: 'women' },
  { id: 'coolwater-blue', name: 'كول ووتر بلو',              en: 'Cool Water Blue',            category: 'women' },
  { id: 'pure-xs-w',      name: 'بيور XS',                   en: 'Pure XS',                    category: 'women' },
  { id: 'good-girl',      name: 'جود جيرل',                  en: 'Good Girl',                  category: 'women' },
  { id: 'chills',         name: 'تشيلز',                     en: '',                           category: 'women' },
  { id: 'crazy-love',     name: 'كريزي لاف',                 en: 'Crazy Love',                 category: 'women' },
  { id: 'lvb-flora',      name: 'لافي إيه بيل فلورا',         en: 'La Vie Est Belle Florale',   category: 'women' },
  { id: 'givenchy-elixir',name: 'جيفنشي أنج أو إترانج إليكسير', en: 'Givenchy — Ange ou Démon Élixir', category: 'women' },
  { id: 'givenchy-ange',  name: 'جيفنشي أنج إيه ديمون',       en: 'Givenchy — Ange ou Démon',   category: 'women' },
  { id: 'tresor',         name: 'تريزور لانكوم',             en: 'Trésor — Lancôme',           category: 'women' },

  // ===== نسائي VIP =====
  { id: 'cobra',          name: 'كوبرا',                     en: 'Cobra',                      category: 'women-vip', badges: ['vip'] },
  { id: 'musk-pomegranate', name: 'مسك رمان',                en: 'Pomegranate Musk',           category: 'women-vip', badges: ['vip'] },
  { id: 'khamrah',        name: 'خُمرة لطافة',               en: 'Khamrah — Lattafa',          category: 'women-vip', badges: ['vip'] },
  { id: 'sensual',        name: 'سينشوال',                   en: 'Sensual',                    category: 'women-vip', badges: ['vip'] },
  { id: 'escada-moonsparkle', name: 'اسكادا مون سباركل',     en: 'Escada Moon Sparkle',        category: 'women-vip', badges: ['vip'] },
  { id: 'mancera-crush',  name: 'مانسيرا انستانت كراش',      en: 'Mancera Instant Crush',      category: 'women-vip', badges: ['vip'] },
  { id: 'cavalli',        name: 'روبرتو كافالي',             en: 'Roberto Cavalli',            category: 'women-vip', badges: ['vip'] },

  // ===== رجالي =====
  { id: 'bleu-chanel',    name: 'بلو دي شانيل',              en: 'Bleu de Chanel',             category: 'men' },
  { id: 'silver-scent',   name: 'سلفر سنت',                  en: 'Silver Scent',               category: 'men' },
  { id: 'boss',           name: 'بوس',                       en: 'Boss',                       category: 'men' },
  { id: 'eternity',       name: 'اترنتي',                    en: 'Eternity',                   category: 'men' },
  { id: 'voyage',         name: 'فوياج',                     en: 'Voyage',                     category: 'men' },
  { id: 'dunhill-fresh',  name: 'دنهيل فريش',                en: 'Dunhill Fresh',              category: 'men' },
  { id: 'dunhill-desire', name: 'دنهيل ديزاير',              en: 'Dunhill Desire',             category: 'men' },
  { id: 'platinum',       name: 'بلاتينيوم',                 en: 'Platinum',                   category: 'men' },
  { id: '3g',             name: 'ثري جي 3G',                 en: '3G',                         category: 'men' },
  { id: 'gk',             name: 'جي كي',                     en: 'G.K',                        category: 'men' },
  { id: 'black-opium',    name: 'بلاك أوبيوم',               en: 'Black Opium',                category: 'men' },
  { id: 'joop-nightflight',name: 'نايت فلايت جوب',           en: 'Joop! Nightflight',          category: 'men' },
  { id: 'lacoste-ess',    name: 'لاكوست اسنشيال',            en: 'Lacoste Essential',          category: 'men' },
  { id: 'sauvage',        name: 'سوفاج',                     en: 'Sauvage — Dior',             category: 'men' },
  { id: 'invictus',       name: 'انفيكتوس',                  en: 'Invictus',                   category: 'men' },
  { id: 'black-xs',       name: 'بلاك لكزس',                 en: 'Black XS',                   category: 'men' },
  { id: 'sculpture',      name: 'سكلبتشر',                   en: 'Sculpture',                  category: 'men' },
  { id: 'coolwater',      name: 'كول ووتر',                  en: 'Cool Water',                 category: 'men' },
  { id: 'one-million',    name: 'وان مليون',                 en: 'One Million',                category: 'men' },
  { id: '212-sexy',       name: '212 سكسي',                  en: '212 Sexy',                   category: 'men' },
  { id: 'open',           name: 'اوبن',                      en: 'Open',                       category: 'men' },
  { id: 'dior-homme-sport',name: 'ديور هوم سبورت',           en: 'Dior Homme Sport',           category: 'men' },
  { id: 'gucci-guilty',   name: 'جوتشي جيلتي',               en: 'Gucci Guilty',               category: 'men' },

  // ===== مشترك =====
  { id: 'arababura',      name: 'أرابورا',                   en: '',                           category: 'unisex' },
  { id: 'oud-bouquet',    name: 'عود بوكيه',                 en: 'Oud Bouquet',                category: 'unisex' },

  // ===== المسك =====
  { id: 'white-musk',     name: 'مسك أبيض متسلق مخصوص',       en: 'Special White Musk',         category: 'musk' },

  // ===== العود الشرقي =====
  { id: 'oud-white',      name: 'عود أبيض',                  en: 'White Oud',                  category: 'oud' },
  { id: 'oud-sheikha',    name: 'عود شيخة',                  en: 'Sheikha Oud',                category: 'oud' },
  { id: 'oud-woody',      name: 'عود وودي',                  en: 'Woody Oud',                  category: 'oud' },
  { id: 'oud-montale',    name: 'عود مونتال',                en: 'Montale Oud',                category: 'oud' },
  { id: 'oud-royal',      name: 'عود رويال',                 en: 'Royal Oud',                  category: 'oud' },
  { id: 'oud-madawi',     name: 'عود مضاوي',                 en: 'Madawi Oud',                 category: 'oud' },
  { id: 'saudi-fruits',   name: 'فواكه سعودي',               en: 'Saudi Fruits',               category: 'oud', badges: ['kids'], note: 'رائحة مناسبة للأطفال' },

  // ===== أسباني (وارد الإمارات) =====
  { id: 'escada-taj',     name: 'اسكادا تاج',                en: 'Escada Taj',                 category: 'spanish', badges: ['spanish'] },
  { id: 'escada-moon',    name: 'اسكادا مون',                en: 'Escada Moon',                category: 'spanish', badges: ['spanish'] },
  { id: 'mashaer-gold',   name: 'مشاعر جولد',                en: 'Mashaer Gold',               category: 'spanish', badges: ['spanish'] },
  { id: 'chance-tendre',  name: 'شانيل شانس تندر',           en: 'Chanel Chance Eau Tendre',   category: 'spanish', badges: ['spanish'] },
];

// سعر عطر معيّن بحجم معيّن (سعر خاص إن وُجد، وإلا السعر الموحّد حسب الحجم)
function priceFor(product, size) {
  if (product.prices && product.prices[size] != null) return product.prices[size];
  return SIZE_PRICES[size];
}

function sizesFor(product) {
  return product.sizes && product.sizes.length ? product.sizes : ALL_SIZES;
}
