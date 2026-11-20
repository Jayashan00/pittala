/* Seed data for the Pittala.lk demo.
   All photos are free-to-use images hosted on Pexels (pexels.com/license). */

const PX = (id, w = 1000) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const PHOTOS = {
  lampSL: 9743110,        // brass oil lamp, Sri Lankan photographer
  lampTemple: 36873193,   // lit brass lamp in a Sri Lankan temple
  lampGlow: 16457616,     // decorative brass lamp with flames
  lampFlowers: 5027991,   // brass oil lamp on tray, white flowers
  lampIntricate: 34056592,
  lampChain: 20122586,
  lampWhite: 20122582,
  lantern: 40242712,
  bazaarLamps: 18724236,
  lampTray: 34411109,
  candleHolder: 8819218,
  lampFlame: 8819140,
  ceremony: 33853980,
  ceremony2: 34899896,
  buddha: 1585716,
  figurines: 6998591,
  artisan: 26792961,
  relief: 32662216,
  goldMarket: 15755947,
  coinsTray: 14936593,
  samovars: 33782035,
  teapot: 31094854,
  bell: 37531058,
  candlesticks: 25461444,
  metalStall: 14724142,
  coffeePots: 9939082,
  copperPots: 34638107,
  marketBrass: 6808948,
  ganesha: 12573352,
  nataraja: 10899309,
  souvenirs: 6062498,
  artifacts: 30688201,
  copperSilver: 18082510,
  hookahGold: 20122616
};
const P = Object.fromEntries(Object.entries(PHOTOS).map(([k, v]) => [k, PX(v)]));
const HERO = id => PX(id, 1920);

/* Hero "film": each chapter is a full-bleed shot with slow motion.
   To use real video, put an .mp4 URL (e.g. a Pexels video file link) in `video`. */
const HERO_FILM = [
  { img: HERO(PHOTOS.lampTemple), title: 'Lit', sub: 'Temple lamps of Kandy', video: '' },
  { img: HERO(PHOTOS.artisan), title: 'Cast', sub: 'Poured by hand', video: '' },
  { img: HERO(PHOTOS.bazaarLamps), title: 'Chased', sub: 'Patterns hammered in', video: '' },
  { img: HERO(PHOTOS.lampGlow), title: 'Polished', sub: 'Brought to a mirror shine', video: '' }
];

const CATEGORIES = [
  { id: 'oil-lamps', name: 'Oil lamps', si: 'පහන්', img: P.lampSL },
  { id: 'hanging', name: 'Hanging lamps', si: 'එල්ලෙන පහන්', img: P.lantern },
  { id: 'statues', name: 'Statues & figurines', si: 'පිළිම', img: P.buddha },
  { id: 'pooja', name: 'Pooja & temple', si: 'පූජා භාණ්ඩ', img: P.bell },
  { id: 'decor', name: 'Home décor', si: 'නිවාස අලංකරණ', img: P.candlesticks },
  { id: 'kitchen', name: 'Kitchen & dining', si: 'මුළුතැන්ගෙය', img: P.teapot },
  { id: 'wall-art', name: 'Wall art', si: 'බිත්ති කලා', img: P.relief },
  { id: 'gifts', name: 'Gifts & souvenirs', si: 'තෑගි', img: P.coinsTray }
];

const DISTRICTS = ['Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'];

const BANNERS = [P.bazaarLamps, P.goldMarket, P.metalStall, P.lampTemple, P.samovars, P.ceremony, P.marketBrass, P.artifacts, P.souvenirs, P.copperPots];
const THEME_COLORS = ['#16332F', '#7A2418', '#5B4413', '#1F3A5F', '#3B2A4A', '#2B2B2B', '#2E5A3C', '#8C4A12'];

function buildSeed() {
  const now = Date.now();
  const H = 3600e3, D = 24 * H;

  const settings = {
    platformName: 'Pittala.lk',
    platformRate: 2,   // % to platform (super admin)
    agentRate: 10,     // % to region agent
    regFee: 5000,      // one-time shop registration fee (LKR), paid to the region agent
    deliveryKandy: 400,
    deliveryOther: 650,
    freeDeliveryOver: 25000,
    supportEmail: 'hello@pittala.lk',
    supportPhone: '0771234567'
  };

  const regions = [
    { id: 'r1', name: 'Pilimathalawa', district: 'Kandy', agentUserId: 'u2', agentShopId: 's1',
      bank: 'Bank of Ceylon — Pilimathalawa branch', accName: 'K. B. Herath', accNo: '0074 5521 9013' }
  ];

  const users = [
    { id: 'u1', role: 'super', name: 'Platform Admin', email: 'admin@pittala.lk', password: 'admin123', phone: '0771234567' },
    { id: 'u2', role: 'agent', name: 'Kumara Bandara Herath', email: 'agent@pittala.lk', password: 'agent123', phone: '0772345678', regionId: 'r1', shopId: 's1' },
    { id: 'u3', role: 'owner', name: 'Sirisena Wickramasinghe', email: 'siri@pittala.lk', password: 'shop123', phone: '0713456789', shopId: 's2' },
    { id: 'u4', role: 'owner', name: 'Lakmini Jayawardena', email: 'lakmini@pittala.lk', password: 'shop123', phone: '0754567890', shopId: 's3' },
    { id: 'u5', role: 'owner', name: 'Nimal Dissanayake', email: 'nimal@pittala.lk', password: 'shop123', phone: '0765678901', shopId: 's4' },
    { id: 'u6', role: 'owner', name: 'Chaminda Rathnayake', email: 'chaminda@pittala.lk', password: 'shop123', phone: '0706789012', shopId: 's5' },
    { id: 'u7', role: 'owner', name: 'Ruwan Senanayake', email: 'ruwan@pittala.lk', password: 'shop123', phone: '0778901234', shopId: 's6' },
    { id: 'u8', role: 'owner', name: 'Dilani Perera', email: 'dilani@pittala.lk', password: 'shop123', phone: '0719012345', shopId: 's7' },
    { id: 'u9', role: 'customer', name: 'Ishara Fernando', email: 'ishara@gmail.com', password: 'buyer123', phone: '0771112233' }
  ];

  const signed = (name, rate, at) => ({ signedName: name, rate, signedAt: at, version: '2026.1' });

  const shops = [
    { id: 's1', name: 'Kandyan Brass House', ownerId: 'u2', regionId: 'r1', status: 'published', color: '#16332F', banner: P.bazaarLamps,
      tagline: 'Temple-grade oil lamps since 1962', story: 'Three generations of the Herath family have cast pahana and hanging lamps for devales across the hill country. Every lamp is sand-cast, chased by hand and polished on our own wheel in Pilimathalawa.',
      phone: '0772345678', whatsapp: '0772345678', email: 'agent@pittala.lk', address: 'No. 41, Kandy Road, Pilimathalawa', est: 1962, artisans: 14, hours: 'Mon–Sat, 8.00 am – 6.00 pm',
      layout: 'classic', font: 'engraved', announcement: 'Free delivery in Kandy district this week', rating: 4.9, createdAt: now - 400 * D,
      agreement: signed('K. B. Herath', 2, now - 400 * D), payment: { ref: 'AGENT-SELF', amount: 0, at: now - 400 * D }, approvals: { agentAt: now - 400 * D, adminAt: now - 399 * D } },
    { id: 's2', name: 'Siri Pittala Works', ownerId: 'u3', regionId: 'r1', status: 'published', color: '#7A2418', banner: P.goldMarket,
      tagline: 'Statues cast in the old Kandyan style', story: 'Sirisena learned lost-wax casting from his uncle at the age of twelve. The workshop specialises in seated and standing Buddha statues, elephants and devotional figures.',
      phone: '0713456789', whatsapp: '0713456789', email: 'siri@pittala.lk', address: 'Galagedara Road, Pilimathalawa', est: 1988, artisans: 8, hours: 'Daily, 9.00 am – 5.30 pm',
      layout: 'editorial', font: 'engraved', announcement: 'Vesak pre-orders now open', rating: 4.8, createdAt: now - 300 * D,
      agreement: signed('S. Wickramasinghe', 12, now - 300 * D), payment: { ref: 'BOC-882134', amount: 5000, at: now - 299 * D }, approvals: { agentAt: now - 299 * D, adminAt: now - 298 * D } },
    { id: 's3', name: 'Lakmini Brass Craft', ownerId: 'u4', regionId: 'r1', status: 'published', color: '#5B4413', banner: P.metalStall,
      tagline: 'Small pieces, big character', story: 'A women-led studio making trays, bowls, betel sets and gift pieces. We work with six home-based artisans from the village and pay them per piece, above market rate.',
      phone: '0754567890', whatsapp: '0754567890', email: 'lakmini@pittala.lk', address: 'Temple Road, Pilimathalawa', est: 2009, artisans: 6, hours: 'Mon–Fri, 9.00 am – 5.00 pm',
      layout: 'compact', font: 'modern', announcement: '', rating: 4.7, createdAt: now - 220 * D,
      agreement: signed('L. Jayawardena', 12, now - 220 * D), payment: { ref: 'HNB-551920', amount: 5000, at: now - 219 * D }, approvals: { agentAt: now - 219 * D, adminAt: now - 218 * D } },
    { id: 's4', name: 'Dalada Metal Arts', ownerId: 'u5', regionId: 'r1', status: 'published', color: '#1F3A5F', banner: P.lampTemple,
      tagline: 'Pooja sets and temple bells', story: 'We supply bells, pooja trays and offering lamps to temples and kovils across the island, and now to homes through Pittala.',
      phone: '0765678901', whatsapp: '0765678901', email: 'nimal@pittala.lk', address: 'Kadugannawa Road, Pilimathalawa', est: 1995, artisans: 10, hours: 'Mon–Sat, 8.30 am – 5.30 pm',
      layout: 'classic', font: 'engraved', announcement: '', rating: 4.6, createdAt: now - 150 * D,
      agreement: signed('N. Dissanayake', 12, now - 150 * D), payment: { ref: 'COM-773201', amount: 5000, at: now - 149 * D }, approvals: { agentAt: now - 149 * D, adminAt: now - 148 * D } },
    { id: 's5', name: 'Hill Country Brassware', ownerId: 'u6', regionId: 'r1', status: 'published', color: '#2E5A3C', banner: P.samovars,
      tagline: 'Kitchen brass for everyday use', story: 'Kettles, kendi pitchers, rice pots and serving ware that you can actually cook and serve with. Tin-lined where it matters.',
      phone: '0706789012', whatsapp: '0706789012', email: 'chaminda@pittala.lk', address: 'Pilimathalawa Junction', est: 2014, artisans: 5, hours: 'Daily, 8.00 am – 7.00 pm',
      layout: 'classic', font: 'modern', announcement: 'Buy 2 kitchen pieces, get 5% off with code HILL5', rating: 4.5, createdAt: now - 90 * D,
      agreement: signed('C. Rathnayake', 12, now - 90 * D), payment: { ref: 'SAM-110293', amount: 5000, at: now - 89 * D }, approvals: { agentAt: now - 89 * D, adminAt: now - 88 * D } },
    // Applications in the pipeline
    { id: 's6', name: 'Senanayake Brass Foundry', ownerId: 'u7', regionId: 'r1', status: 'pending_payment', color: '#8C4A12', banner: P.artifacts,
      tagline: 'Large castings to order', story: 'Foundry work for doors, handles, temple fittings and large statues.', phone: '0778901234', whatsapp: '0778901234', email: 'ruwan@pittala.lk',
      address: 'Hantana Estate Road, Pilimathalawa', est: 2001, artisans: 9, hours: 'Mon–Sat', layout: 'classic', font: 'engraved', announcement: '', rating: 0, createdAt: now - 2 * D,
      agreement: signed('R. Senanayake', 12, now - 2 * D), payment: { ref: 'BOC-993012', amount: 5000, at: now - 2 * D, slip: '' }, approvals: {} },
    { id: 's7', name: 'Dilani Gift Studio', ownerId: 'u8', regionId: 'r1', status: 'agent_approved', color: '#3B2A4A', banner: P.souvenirs,
      tagline: 'Corporate gifts and wedding favours', story: 'Engraved brass keepsakes for weddings and corporate events.', phone: '0719012345', whatsapp: '0719012345', email: 'dilani@pittala.lk',
      address: 'Peradeniya Road, Pilimathalawa', est: 2018, artisans: 3, hours: 'Mon–Fri', layout: 'compact', font: 'modern', announcement: '', rating: 0, createdAt: now - 5 * D,
      agreement: signed('D. Perera', 12, now - 5 * D), payment: { ref: 'HNB-400128', amount: 5000, at: now - 4 * D, slip: '' }, approvals: { agentAt: now - 3 * D } }
  ];

  const mk = (id, shopId, name, category, price, opts = {}) => ({
    id, shopId, name, category, price,
    discount: opts.discount || 0,
    dealEnds: opts.dealHours ? now + opts.dealHours * H : null,
    demoDealHours: opts.dealHours || 0,
    stock: opts.stock ?? 10,
    images: opts.images,
    description: opts.desc || '',
    material: opts.material || 'Solid brass',
    dimensions: opts.dim || '',
    weight: opts.weight || '',
    finish: opts.finish || 'Hand-polished',
    badge: opts.badge || '',
    sold: opts.sold || 0,
    views: opts.views || Math.round(80 + Math.random() * 900),
    rating: opts.rating || 4.6,
    reviews: opts.reviews || 0,
    createdAt: now - (opts.age || 30) * D,
    active: true,
    spotlight: !!opts.spotlight
  });

  const products = [
    // s1 Kandyan Brass House (agent's shop)
    mk('p1', 's1', 'Traditional Pahana — 5 wick standing lamp', 'oil-lamps', 18500, { discount: 15, dealHours: 30, stock: 6, images: [P.lampSL, P.lampIntricate, P.lampFlame], badge: 'Bestseller', sold: 64, rating: 4.9, reviews: 38, dim: 'H 46 cm, base 14 cm', weight: '2.4 kg', desc: 'The lamp lit at every Sri Lankan auspicious moment. Five wick spouts on a tiered stand, sand-cast in one piece and finished by hand. Comes with a cotton-wick starter pack.', spotlight: true }),
    mk('p2', 's1', 'Devale hanging lamp with chain', 'hanging', 24500, { stock: 3, images: [P.lantern, P.lampChain], badge: 'Handmade', sold: 22, rating: 4.8, reviews: 14, dim: 'Bowl 22 cm, chain 90 cm', weight: '3.1 kg', desc: 'A seven-spout hanging lamp of the kind used in devales, with a hand-forged chain and peacock finial.' }),
    mk('p3', 's1', 'Pahana — compact table lamp', 'oil-lamps', 6800, { discount: 10, stock: 0, images: [P.lampGlow, P.lampTray], sold: 120, rating: 4.7, reviews: 51, dim: 'H 22 cm', weight: '0.9 kg', desc: 'Our smallest pahana, sized for apartment shrines and office openings.' }),
    mk('p4', 's1', 'Wedding Magul Pahana (pair)', 'oil-lamps', 42000, { stock: 2, images: [P.lampIntricate, P.ceremony2], badge: 'Made to order', sold: 9, rating: 5, reviews: 6, dim: 'H 120 cm each', weight: '11 kg each', desc: 'A matched pair of tall ceremonial lamps for poruwa ceremonies and inaugurations. Seven-day lead time.' }),
    mk('p5', 's1', 'Brass offering lamp on tray', 'pooja', 4200, { discount: 20, dealHours: 9, stock: 15, images: [P.lampFlowers, P.lampTray], sold: 41, rating: 4.6, reviews: 19, dim: 'Tray 18 cm', desc: 'A single-wick lamp seated on a scalloped tray to catch oil and flower petals.' }),

    // s2 Siri Pittala Works — statues
    mk('p6', 's2', 'Seated Buddha — Samadhi, antique finish', 'statues', 32500, { discount: 12, dealHours: 50, stock: 4, images: [P.buddha, P.figurines], badge: 'Bestseller', sold: 33, rating: 4.9, reviews: 27, dim: 'H 30 cm', weight: '3.6 kg', finish: 'Antique patina', desc: 'Lost-wax cast Buddha in the Samadhi posture with a dark antique finish that deepens over time.', spotlight: true }),
    mk('p7', 's2', 'Tibetan-style figurine set (3)', 'statues', 14800, { stock: 0, images: [P.figurines, P.buddha], sold: 18, rating: 4.7, reviews: 9, dim: 'H 9–12 cm', desc: 'A set of three small devotional figurines for a desk or shrine shelf.' }),
    mk('p8', 's2', 'Ganesha with lotus base', 'statues', 12900, { stock: 7, images: [P.ganesha], sold: 21, rating: 4.8, reviews: 11, dim: 'H 18 cm', desc: 'Seated Ganesha on a double lotus base, hand-chased details.' }),
    mk('p9', 's2', 'Nataraja — dancing figure', 'statues', 38500, { discount: 8, stock: 2, images: [P.nataraja], badge: 'Masterpiece', sold: 6, rating: 5, reviews: 4, dim: 'H 42 cm', weight: '5.2 kg', desc: 'A large dancing figure within a ring of flames. Cast in three parts and joined by hand.' }),
    mk('p10', 's2', 'Kandyan wall relief panel', 'wall-art', 27000, { stock: 5, images: [P.relief], sold: 12, rating: 4.7, reviews: 8, dim: '60 × 40 cm', desc: 'Liyawela (vine) and hamsa (swan) motifs beaten in relief on a single brass sheet, mounted on teak.' }),

    // s3 Lakmini Brass Craft — gifts/decor
    mk('p11', 's3', 'Antique coin & keepsake tray', 'gifts', 5400, { discount: 25, dealHours: 18, stock: 12, images: [P.coinsTray], sold: 58, rating: 4.6, reviews: 22, dim: '28 cm', desc: 'A hand-hammered tray that works for keys, jewellery or a betel set.' }),
    mk('p12', 's3', 'Candlestick trio', 'decor', 9200, { stock: 1, images: [P.candlesticks], badge: 'New', sold: 14, rating: 4.5, reviews: 7, dim: 'H 18, 24, 30 cm', desc: 'Three turned candlesticks in graduated heights.', age: 4 }),
    mk('p13', 's3', 'Temple bell with lotus handle', 'pooja', 3900, { discount: 10, stock: 20, images: [P.bell], sold: 77, rating: 4.7, reviews: 30, dim: 'H 16 cm', desc: 'Clear, long-ringing bell with a lotus-bud handle.' }),
    mk('p14', 's3', 'Bazaar gift box — 5 mini pieces', 'gifts', 7600, { stock: 9, images: [P.marketBrass, P.souvenirs], sold: 25, rating: 4.4, reviews: 10, desc: 'Five small brass pieces in a printed gift box — a good souvenir for visitors.' }),

    // s4 Dalada Metal Arts — pooja & lamps (competes with s1)
    mk('p15', 's4', 'Five wick pahana — temple pattern', 'oil-lamps', 16900, { discount: 5, stock: 8, images: [P.lampTemple, P.lampSL], sold: 40, rating: 4.6, reviews: 18, dim: 'H 44 cm', weight: '2.2 kg', desc: 'A five-wick standing lamp with a temple-pattern stem.' }),
    mk('p16', 's4', 'Ceremony lamp set (4)', 'pooja', 21500, { discount: 18, dealHours: 70, stock: 5, images: [P.ceremony, P.ceremony2], badge: 'Set', sold: 16, rating: 4.7, reviews: 9, desc: 'Four matching offering lamps for pooja rooms and kovils.' }),
    mk('p17', 's4', 'Aladdin-style chain lamp', 'hanging', 11800, { stock: 6, images: [P.lampChain, P.lampWhite], sold: 19, rating: 4.4, reviews: 8, desc: 'A spouted oil lamp with lid and hanging chain.' }),
    mk('p18', 's4', 'Diya candle holder set', 'pooja', 3200, { stock: 0, images: [P.candleHolder, P.lampFlame], sold: 88, rating: 4.5, reviews: 35, desc: 'Six small diya-style holders for festival nights.' }),

    // s5 Hill Country Brassware — kitchen
    mk('p19', 's5', 'Engraved brass teapot', 'kitchen', 13500, { discount: 10, dealHours: 26, stock: 7, images: [P.teapot], badge: 'Tin-lined', sold: 23, rating: 4.6, reviews: 12, dim: '1.2 L', desc: 'Tin-lined so you can brew Ceylon tea in it. Engraved body, wooden-wrapped handle.' }),
    mk('p20', 's5', 'Samovar-style water urn', 'kitchen', 29500, { stock: 2, images: [P.samovars], sold: 5, rating: 4.5, reviews: 3, dim: '6 L', desc: 'A statement urn for weddings and dansal.' }),
    mk('p21', 's5', 'Hammered serving pots (pair)', 'kitchen', 8900, { stock: 11, images: [P.copperPots, P.coffeePots], sold: 31, rating: 4.4, reviews: 13, desc: 'Two hammered serving pots with lids for curries and rice.' }),
    mk('p22', 's5', 'Coffee pot set', 'kitchen', 7400, { discount: 15, stock: 6, images: [P.coffeePots], sold: 20, rating: 4.3, reviews: 6, desc: 'Three graduated pots with long pouring spouts.' })
  ];

  const names = ['Ishara F.', 'Tharindu P.', 'Malsha K.', 'Dinesh R.', 'Sachini W.', 'Pradeep J.', 'Nethmi S.', 'Ashan M.', 'Kavindi L.', 'Ruwini D.', 'Amila G.', 'Hasini B.'];
  const lines = [
    'Heavier and better finished than the lamps I saw in Colombo shops.',
    'Arrived well packed. The shop called on WhatsApp before sending it.',
    'Exactly as pictured. Paid cash when it arrived, very easy.',
    'Bought for my sister\'s wedding — everyone asked where it was from.',
    'The polish is beautiful. Will order the matching pair.',
    'Took two extra days but the seller kept me updated.',
    'Good quality brass, you can feel the weight.',
    'Lovely detail on the chasing work.'
  ];
  const reviews = [];
  products.forEach((p, i) => {
    const n = Math.min(3, Math.max(1, Math.round(p.reviews / 10)));
    for (let k = 0; k < n; k++) {
      reviews.push({ id: `rv${i}_${k}`, productId: p.id, shopId: p.shopId, name: names[(i + k) % names.length], rating: k === 2 ? 4 : 5, text: lines[(i * 3 + k) % lines.length], at: now - (k * 9 + i) * D });
    }
  });

  // Generate orders over the past 60 days
  const custs = [
    { name: 'Ishara Fernando', phone: '0771112233', email: 'ishara@gmail.com', address: '22/4 Flower Road', city: 'Colombo 07', district: 'Colombo', postal: '00700' },
    { name: 'Tharindu Perera', phone: '0712223344', email: 'tharindu.p@gmail.com', address: '15 Lake Drive', city: 'Kandy', district: 'Kandy', postal: '20000' },
    { name: 'Malsha Kumari', phone: '0763334455', email: 'malsha.k@yahoo.com', address: '8 Temple Lane', city: 'Kurunegala', district: 'Kurunegala', postal: '60000' },
    { name: 'Dinesh Rajapaksha', phone: '0754445566', email: 'dinesh.r@gmail.com', address: '102 Main Street', city: 'Galle', district: 'Galle', postal: '80000' },
    { name: 'Sachini Wijeratne', phone: '0705556677', email: 'sachini.w@gmail.com', address: '3 Hill Street', city: 'Gampaha', district: 'Gampaha', postal: '11000' },
    { name: 'Pradeep Jayasinghe', phone: '0776667788', email: 'pradeep.j@outlook.com', address: '47 Station Road', city: 'Matara', district: 'Matara', postal: '81000' }
  ];
  const statuses = ['delivered', 'delivered', 'delivered', 'delivered', 'shipped', 'confirmed', 'packed', 'pending', 'cancelled'];
  const orders = [];
  let seq = 1040;
  const live = products.filter(p => p.price < 40000);
  for (let d = 58; d >= 0; d--) {
    const count = d < 3 ? 2 : (Math.random() < 0.55 ? 1 : (Math.random() < 0.5 ? 2 : 0));
    for (let c = 0; c < count; c++) {
      const p = live[Math.floor(Math.random() * live.length)];
      const qty = Math.random() < 0.8 ? 1 : 2;
      const cust = custs[Math.floor(Math.random() * custs.length)];
      let st = d > 10 ? (Math.random() < 0.9 ? 'delivered' : 'cancelled') : statuses[Math.floor(Math.random() * statuses.length)];
      if (d <= 1) st = Math.random() < 0.6 ? 'pending' : 'confirmed';
      const unit = Math.round(p.price * (1 - (p.discount || 0) / 100));
      const sub = unit * qty;
      const del = cust.district === 'Kandy' ? settings.deliveryKandy : settings.deliveryOther;
      const at = now - d * D - Math.floor(Math.random() * 10) * H;
      const id = 'PB' + (seq++);
      const flow = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
      const history = [];
      if (st === 'cancelled') { history.push({ s: 'pending', at }, { s: 'cancelled', at: at + 5 * H }); }
      else { flow.slice(0, flow.indexOf(st) + 1).forEach((s, i) => history.push({ s, at: at + i * 20 * H })); }
      orders.push({
        id, groupId: id, shopId: p.shopId, createdAt: at, status: st, payment: 'COD',
        items: [{ productId: p.id, name: p.name, img: p.images[0], price: unit, qty }],
        subtotal: sub, delivery: del, discount: 0, total: sub + del,
        customer: { ...cust, whatsapp: cust.phone, landmark: '', notes: '', line2: '' },
        history
      });
    }
  }

  const coupons = [
    { code: 'HILL5', shopId: 's5', type: 'pct', value: 5, minOrder: 10000, expires: now + 20 * D, uses: 4 },
    { code: 'VESAK10', shopId: 's2', type: 'pct', value: 10, minOrder: 20000, expires: now + 12 * D, uses: 2 },
    { code: 'LAMP1000', shopId: 's1', type: 'flat', value: 1000, minOrder: 15000, expires: now + 30 * D, uses: 7 }
  ];

  const spotlights = [
    { id: 'sp1', shopId: 's3', productId: 'p11', days: 7, fee: 1500, status: 'pending', at: now - 1 * D },
    { id: 'sp2', shopId: 's1', productId: 'p1', days: 14, fee: 2500, status: 'active', at: now - 3 * D }
  ];

  return {
    version: 3, seededAt: now, settings, regions, users, shops, products, reviews, orders, coupons, spotlights,
    settlements: {}, outbox: [], activity: [
      { at: now - 3 * D, who: 'Kumara Bandara Herath', what: 'confirmed registration payment for Dilani Gift Studio' },
      { at: now - 2 * D, who: 'Ruwan Senanayake', what: 'submitted a shop application (Senanayake Brass Foundry)' }
    ],
    cart: [], wishlist: [], recent: [], session: null
  };
}
