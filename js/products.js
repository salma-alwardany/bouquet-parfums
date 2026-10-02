/* =====================================================================
   بوكيه — بيانات العطور  |  Bouquet — product data
   ---------------------------------------------------------------------
   ⚠️ PLACEHOLDER — كل العطور في هذا الملف بيانات تجريبية للعرض فقط:
      الأسماء، الأوصاف، النوتات، الأحجام والأسعار ليست معلومات حقيقية عن
      منتجات بوكيه. استبدليها بالبيانات الفعلية قبل الإطلاق، ثم احذفي
      السطر  placeholder: true  من كل عطر تمّت مراجعته.

   لإضافة عطر جديد: انسخي أي عطر كامل (من { إلى },) وعدّلي قيمه.
   • id: اسم فريد بالإنجليزية بدون مسافات (يظهر في رابط صفحة العطر)
   • families: العائلات العطرية (floral, oriental, woody, musky, sweet, fresh)
   • notes: مفاتيح النوتات من قائمة NOTES بالأسفل (أضيفي نوتات جديدة هناك)
   • images: أسماء الصور داخل assets/img بدون اللاحقة ‎-864.webp / -560.webp
   • sizes: الأحجام بالملّيلتر وسعر كل حجم بالجنيه
   ===================================================================== */

// العائلات العطرية
window.BQ_FAMILIES = {
  floral: {
    ar: 'زهري', en: 'Floral',
    mood: {
      ar: 'بتلات ناعمة وحضور أنثوي رقيق، كباقة تُهدى في لحظة حب.',
      en: 'Soft petals and a delicate, feminine presence — like a bouquet given in a moment of love.',
    },
  },
  oriental: {
    ar: 'شرقي', en: 'Oriental',
    mood: {
      ar: 'دفء التوابل والعنبر، وغموض يشبه ليالي الشرق.',
      en: 'The warmth of spice and amber, with a mystery that recalls Eastern nights.',
    },
  },
  woody: {
    ar: 'خشبي', en: 'Woody',
    mood: {
      ar: 'أخشاب عميقة وهدوء واثق يبقى معكِ طويلًا.',
      en: 'Deep woods and a quiet confidence that lingers.',
    },
  },
  musky: {
    ar: 'مسكي', en: 'Musky',
    mood: {
      ar: 'نقاء المسك ونعومة الحرير على البشرة.',
      en: 'The purity of musk, the softness of silk on skin.',
    },
  },
  sweet: {
    ar: 'حلو', en: 'Sweet',
    mood: {
      ar: 'لمسات دافئة من الفانيليا والحلوى، شهية كالذكريات الجميلة.',
      en: 'Warm touches of vanilla and sweetness, as delicious as a fond memory.',
    },
  },
  fresh: {
    ar: 'منعش', en: 'Fresh',
    mood: {
      ar: 'نسمة صافية من الحمضيات والخضرة، كصباحٍ مشرق.',
      en: 'A clear breeze of citrus and greenery, like a bright morning.',
    },
  },
};

// قاموس النوتات العطرية (عربي / إنجليزي)
window.BQ_NOTES = {
  pinkPepper:    { ar: 'الفلفل الوردي',   en: 'Pink Pepper' },
  bergamot:      { ar: 'البرغموت',        en: 'Bergamot' },
  damaskRose:    { ar: 'الورد الدمشقي',   en: 'Damask Rose' },
  peony:         { ar: 'الفاوانيا',       en: 'Peony' },
  whiteMusk:     { ar: 'المسك الأبيض',    en: 'White Musk' },
  amber:         { ar: 'العنبر',          en: 'Amber' },
  neroli:        { ar: 'النيرولي',        en: 'Neroli' },
  pear:          { ar: 'الكمثرى',         en: 'Pear' },
  jasmine:       { ar: 'الياسمين',        en: 'Jasmine Sambac' },
  orangeBlossom: { ar: 'زهر البرتقال',    en: 'Orange Blossom' },
  cedar:         { ar: 'خشب الأرز',       en: 'Cedarwood' },
  saffron:       { ar: 'الزعفران',        en: 'Saffron' },
  cardamom:      { ar: 'الهيل',           en: 'Cardamom' },
  vanilla:       { ar: 'الفانيليا',       en: 'Vanilla' },
  benzoin:       { ar: 'البنزوين',        en: 'Benzoin' },
  labdanum:      { ar: 'اللبدانوم',       en: 'Labdanum' },
  frankincense:  { ar: 'اللبان',          en: 'Frankincense' },
  blackPepper:   { ar: 'الفلفل الأسود',   en: 'Black Pepper' },
  oud:           { ar: 'العود',           en: 'Oud' },
  rose:          { ar: 'الورد',           en: 'Rose' },
  patchouli:     { ar: 'الباتشولي',       en: 'Patchouli' },
  sandalwood:    { ar: 'خشب الصندل',      en: 'Sandalwood' },
  aldehydes:     { ar: 'الألدهيدات',      en: 'Aldehydes' },
  cottonFlower:  { ar: 'زهرة القطن',      en: 'Cotton Flower' },
  iris:          { ar: 'السوسن',          en: 'Iris' },
  cashmereWood:  { ar: 'خشب الكشمير',     en: 'Cashmere Wood' },
  bitterAlmond:  { ar: 'اللوز المر',      en: 'Bitter Almond' },
  mandarin:      { ar: 'اليوسفي',         en: 'Mandarin' },
  praline:       { ar: 'البرالين',        en: 'Praline' },
  orchid:        { ar: 'الأوركيد',        en: 'Orchid' },
  tonka:         { ar: 'حبوب التونكا',    en: 'Tonka Bean' },
  lemon:         { ar: 'الليمون',         en: 'Lemon' },
  lotus:         { ar: 'زهرة اللوتس',     en: 'Lotus' },
  violetLeaf:    { ar: 'أوراق البنفسج',   en: 'Violet Leaf' },
  vetiver:       { ar: 'نجيل الهند',      en: 'Vetiver' },
  grapefruit:    { ar: 'الجريب فروت',     en: 'Grapefruit' },
};

// نوع التركيز — PLACEHOLDER
const EDP = { ar: 'ماء عطر', en: 'Eau de Parfum' };

window.BQ_PRODUCTS = [
  {
    id: 'rose-de-nuit',
    placeholder: true,
    number: '01',
    name: { ar: 'وردة الليل', en: 'Rose de Nuit' },
    latin: 'Rose de Nuit',
    families: ['floral'],
    accent: '#EBD3D3',
    concentration: EDP,
    short: {
      ar: 'وردة داكنة تتفتح في المساء؛ رقيقة، غامضة، ولا تُنسى.',
      en: 'A dark rose that blooms at dusk — tender, mysterious, unforgettable.',
    },
    description: {
      ar: 'عطر زهري يحتفي بالوردة في أجمل لحظاتها؛ حين يهدأ النهار وتبدأ الحكاية. افتتاحية مشرقة تنساب إلى قلب من الورد والفاوانيا، ثم تستقر على قاعدة دافئة من المسك والعنبر.',
      en: 'A floral fragrance that celebrates the rose at its most beautiful — when the day grows quiet and the story begins. A luminous opening flows into a heart of rose and peony, then settles on a warm base of musk and amber.',
    },
    notes: { top: ['pinkPepper', 'bergamot'], heart: ['damaskRose', 'peony'], base: ['whiteMusk', 'amber'] },
    sizes: [{ ml: 30, price: 950 }, { ml: 50, price: 1450 }, { ml: 100, price: 2250 }],
    defaultSize: 50,
    images: ['rose-de-nuit-1', 'rose-de-nuit-2', 'rose-de-nuit-3', 'rose-de-nuit-4'],
  },
  {
    id: 'ambre-contes',
    placeholder: true,
    number: '02',
    name: { ar: 'عنبر الحكايا', en: 'Ambre des Contes' },
    latin: 'Ambre des Contes',
    families: ['oriental', 'sweet'],
    accent: '#ECDCC4',
    concentration: EDP,
    short: {
      ar: 'دفء العنبر والزعفران، كحكاية تُروى على ضوء الشموع.',
      en: 'The warmth of amber and saffron, like a tale told by candlelight.',
    },
    description: {
      ar: 'عطر شرقي دافئ يحمل روح الحكايات القديمة. يبدأ بلمسة من الزعفران والهيل، ويتوهّج قلبه بالعنبر والورد، قبل أن يذوب في قاعدة مخملية من الفانيليا والبنزوين.',
      en: 'A warm oriental fragrance carrying the soul of old tales. It opens with saffron and cardamom, glows at its heart with amber and rose, then melts into a velvety base of vanilla and benzoin.',
    },
    notes: { top: ['saffron', 'cardamom'], heart: ['amber', 'rose'], base: ['vanilla', 'benzoin', 'labdanum'] },
    sizes: [{ ml: 30, price: 1050 }, { ml: 50, price: 1600 }, { ml: 100, price: 2450 }],
    defaultSize: 50,
    images: ['ambre-contes-1', 'ambre-contes-2', 'ambre-contes-3'],
  },
  {
    id: 'jasmin-aube',
    placeholder: true,
    number: '03',
    name: { ar: 'ياسمين الفجر', en: "Jasmin de l'Aube" },
    latin: "Jasmin de l'Aube",
    families: ['floral', 'fresh'],
    accent: '#E3E6D6',
    concentration: EDP,
    short: {
      ar: 'ياسمين يستيقظ مع أول ضوء؛ نقيّ، مشرق، ومليء بالحياة.',
      en: 'Jasmine waking with the first light — pure, luminous, full of life.',
    },
    description: {
      ar: 'عطر زهري منعش يلتقط لحظة الفجر في حديقة ياسمين. نوتات مشرقة من النيرولي والكمثرى، وقلب أبيض من الياسمين وزهر البرتقال، على قاعدة ناعمة من المسك والأرز.',
      en: 'A fresh floral that captures dawn in a jasmine garden. Bright notes of neroli and pear, a white heart of jasmine and orange blossom, on a soft base of musk and cedar.',
    },
    notes: { top: ['neroli', 'pear'], heart: ['jasmine', 'orangeBlossom'], base: ['whiteMusk', 'cedar'] },
    sizes: [{ ml: 30, price: 950 }, { ml: 50, price: 1450 }, { ml: 100, price: 2250 }],
    defaultSize: 50,
    images: ['jasmin-aube-1', 'jasmin-aube-2', 'jasmin-aube-3'],
  },
  {
    id: 'oud-soir',
    placeholder: true,
    number: '04',
    name: { ar: 'عود المساء', en: 'Oud du Soir' },
    latin: 'Oud du Soir',
    families: ['woody', 'oriental'],
    accent: '#E5CFBA',
    concentration: EDP,
    short: {
      ar: 'عود وبخور في ضوء خافت؛ حضور عميق وأنيق للمساء.',
      en: 'Oud and incense in soft light — a deep, elegant presence for the evening.',
    },
    description: {
      ar: 'عطر خشبي شرقي للمساءات الخاصة. يفتتح باللبان والفلفل الأسود، ويكشف عن قلب من العود والورد، ثم يستقر على قاعدة غنية من خشب الصندل والباتشولي.',
      en: 'A woody oriental for special evenings. It opens with frankincense and black pepper, reveals a heart of oud and rose, then settles on a rich base of sandalwood and patchouli.',
    },
    notes: { top: ['frankincense', 'blackPepper'], heart: ['oud', 'rose'], base: ['sandalwood', 'patchouli'] },
    sizes: [{ ml: 30, price: 1250 }, { ml: 50, price: 1850 }, { ml: 100, price: 2850 }],
    defaultSize: 50,
    images: ['oud-soir-1', 'oud-soir-2', 'oud-soir-3'],
  },
  {
    id: 'musc-soie',
    placeholder: true,
    number: '05',
    name: { ar: 'مسك الحرير', en: 'Musc de Soie' },
    latin: 'Musc de Soie',
    families: ['musky'],
    accent: '#EEE6E1',
    concentration: EDP,
    short: {
      ar: 'مسك أبيض ناعم كالحرير على البشرة؛ نقاء يدوم.',
      en: 'White musk as soft as silk on skin — a purity that lingers.',
    },
    description: {
      ar: 'عطر مسكي هادئ يشبه ملمس الحرير. تنفتح نوتاته بخفة الألدهيدات وزهرة القطن، ويمنحه السوسن قلبًا بودريًا، بينما يحتضنه المسك الأبيض وخشب الكشمير.',
      en: 'A serene musk that feels like silk. It opens with airy aldehydes and cotton flower, finds a powdery heart of iris, and rests in the embrace of white musk and cashmere wood.',
    },
    notes: { top: ['aldehydes', 'cottonFlower'], heart: ['iris', 'orangeBlossom'], base: ['whiteMusk', 'cashmereWood'] },
    sizes: [{ ml: 30, price: 900 }, { ml: 50, price: 1350 }, { ml: 100, price: 2100 }],
    defaultSize: 50,
    images: ['musc-soie-1', 'musc-soie-2', 'musc-soie-3'],
  },
  {
    id: 'vanille-velours',
    placeholder: true,
    number: '06',
    name: { ar: 'فانيليا مخملية', en: 'Vanille Velours' },
    latin: 'Vanille Velours',
    families: ['sweet'],
    accent: '#F0DCD5',
    concentration: EDP,
    short: {
      ar: 'فانيليا دافئة ولمسة من البرالين؛ حلاوة ناعمة كالمخمل.',
      en: 'Warm vanilla with a touch of praline — a sweetness soft as velvet.',
    },
    description: {
      ar: 'عطر حلو دافئ يلتف حولك كوشاح مخملي. لمسة من اللوز المر واليوسفي في البداية، وقلب من البرالين والأوركيد، وقاعدة شهية من الفانيليا والتونكا والمسك.',
      en: 'A warm, sweet fragrance that wraps around you like a velvet shawl. Bitter almond and mandarin at first, a heart of praline and orchid, and a delicious base of vanilla, tonka and musk.',
    },
    notes: { top: ['bitterAlmond', 'mandarin'], heart: ['praline', 'orchid'], base: ['vanilla', 'tonka', 'whiteMusk'] },
    sizes: [{ ml: 30, price: 950 }, { ml: 50, price: 1450 }, { ml: 100, price: 2250 }],
    defaultSize: 50,
    images: ['vanille-velours-1', 'vanille-velours-2', 'vanille-velours-3'],
  },
  {
    id: 'brise-nil',
    placeholder: true,
    number: '07',
    name: { ar: 'نسيم النيل', en: 'Brise du Nil' },
    latin: 'Brise du Nil',
    families: ['fresh'],
    accent: '#DEE5DB',
    concentration: EDP,
    short: {
      ar: 'نسمة صافية من الحمضيات واللوتس؛ انتعاش هادئ كضفاف النهر.',
      en: 'A clear breeze of citrus and lotus — a calm freshness, like the riverbank.',
    },
    description: {
      ar: 'عطر منعش مستوحى من نسمات الماء والخضرة. يفتتح بالليمون والبرغموت، ويتفتح قلبه بزهرة اللوتس وأوراق البنفسج، على قاعدة نظيفة من نجيل الهند والمسك.',
      en: 'A fresh fragrance inspired by water breezes and greenery. It opens with lemon and bergamot, blossoms into lotus and violet leaf, on a clean base of vetiver and musk.',
    },
    notes: { top: ['lemon', 'bergamot'], heart: ['lotus', 'violetLeaf'], base: ['vetiver', 'whiteMusk'] },
    sizes: [{ ml: 30, price: 900 }, { ml: 50, price: 1350 }, { ml: 100, price: 2100 }],
    defaultSize: 50,
    images: ['brise-nil-1', 'brise-nil-2'],
  },
  {
    id: 'ombre-cedre',
    placeholder: true,
    number: '08',
    name: { ar: 'ظلّ الأرز', en: 'Ombre de Cèdre' },
    latin: 'Ombre de Cèdre',
    families: ['woody'],
    accent: '#E7DDD0',
    concentration: EDP,
    short: {
      ar: 'أرز دافئ في ظل ضوء الشمس؛ أناقة هادئة وواثقة.',
      en: 'Warm cedar in the shade of sunlight — a quiet, confident elegance.',
    },
    description: {
      ar: 'عطر خشبي أنيق يوازن بين الضوء والظل. انتعاش الجريب فروت والهيل في البداية، وقلب من الأرز والسوسن، وقاعدة دافئة من خشب الصندل ونجيل الهند.',
      en: 'An elegant woody fragrance balancing light and shade. Grapefruit and cardamom to begin, a heart of cedar and iris, and a warm base of sandalwood and vetiver.',
    },
    notes: { top: ['grapefruit', 'cardamom'], heart: ['cedar', 'iris'], base: ['sandalwood', 'vetiver'] },
    sizes: [{ ml: 30, price: 1050 }, { ml: 50, price: 1600 }, { ml: 100, price: 2450 }],
    defaultSize: 50,
    images: ['ombre-cedre-1', 'ombre-cedre-2', 'ombre-cedre-3'],
  },
];
