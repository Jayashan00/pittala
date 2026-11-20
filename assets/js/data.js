/* Seed data for the Pittala.lk demo.
   Photos: only Sri Lankan images (Pexels free licence, pexels.com/license).
   Items with no free photo available (karaduwa, kendiya, pettagama, heppuwa…) use
   clean product renders from productArt(). Shops replace these with their own photos
   from the dashboard (Products → Edit → Photos). */

const PX = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const SL_PHOTOS = {
  lampKandy: 9743110,        // brass oil lamp, photographed in Kandy
  lampDecor: 16457616,       // decorative brass lamp, Sri Lankan photographer
  lampTemple: 36873193,      // lit brass lamp in a Sri Lankan temple
  lampsBuddhist: 38194826,   // oil lamps in a Sri Lankan Buddhist temple
  lampsTemple: 12321803,     // oil lamps burning in a Sri Lankan temple
  lightingLamp: 36481272,    // hands lighting a lamp, Sri Lankan temple
  buddhaBrass: 1585716,      // brass Buddha figurine
  gadaladeniya: 29035392,    // Gadaladeniya temple, Pilimathalawa
  daladaMaligawa: 38253196,  // Temple of the Tooth, Kandy
  bahiravokanda: 33404365,   // Bahiravokanda Buddha, Kandy
  offering: 38194824,        // flower offering at a Sri Lankan shrine
  templeInterior: 2365974,   // temple interior, Panadura
  templeFacade: 38194825     // temple facade, Peliyagoda
};
const P = Object.fromEntries(Object.entries(SL_PHOTOS).map(([k, v]) => [k, PX(v)]));
const PW = Object.fromEntries(Object.entries(SL_PHOTOS).map(([k, v]) => [k, PX(v, 1600)]));


/* Sri Lankan videos (Pixabay, free licence, no attribution required) */
const VIDEOS = {
  templeLamp: 'https://cdn.pixabay.com/video/2023/05/18/163544-828200779_large.mp4',   // oil lamp in a Sri Lankan temple
  buddhistTemple: 'https://cdn.pixabay.com/video/2022/01/22/105333-670062565_large.mp4', // Buddhist temple, Sri Lanka
  rockTemple: 'https://cdn.pixabay.com/video/2024/10/17/236710_large.mp4',            // temple on a rock, Matale
  lakeTemple: 'https://cdn.pixabay.com/video/2025/04/16/272321_large.mp4'             // temple in a lake, Welioya
};

/* ---------- Product renders (studio-style) for items without a free photo ---------- */
function productArt(type, tone = 'brass') {
  const tones = {
    brass: ['#5E420F', '#B8862B', '#F3DD9B', '#C79A3A', '#5E420F'],
    gold: ['#7A5A12', '#E2B53F', '#FFF1B8', '#E0B13A', '#7A5A12'],
    antique: ['#2E2412', '#6F5524', '#B89A5A', '#6B5122', '#2E2412']
  }[tone];
  const shapes = {
    karaduwa: `<rect x="120" y="318" width="160" height="18" rx="3" fill="url(#m)"/><rect x="134" y="300" width="132" height="20" rx="3" fill="url(#m)"/>
      <path d="M140 302 C140 214 260 214 260 302 Z" fill="url(#m)"/><rect x="176" y="222" width="48" height="18" rx="2" fill="url(#m)"/>
      <path d="M182 224 L218 224 L204 112 L196 112 Z" fill="url(#m)"/>${[206, 190, 174, 158, 142, 126].map((y, i) => `<rect x="${184 + i * 2.2}" y="${y}" width="${32 - i * 4.4}" height="5" rx="2" fill="url(#m)"/>`).join('')}
      <circle cx="200" cy="105" r="8" fill="url(#m)"/><path d="M150 268 Q200 252 250 268" stroke="#5E420F" stroke-width="2" fill="none" opacity=".5"/>`,
    kendiya: `<ellipse cx="200" cy="330" rx="42" ry="8" fill="url(#m)"/><circle cx="200" cy="255" r="78" fill="url(#m)"/>
      <rect x="184" y="150" width="32" height="40" fill="url(#m)"/><ellipse cx="200" cy="150" rx="30" ry="9" fill="url(#m)"/>
      <path d="M262 236 L322 168 L332 176 L276 248 Z" fill="url(#m)"/><ellipse cx="327" cy="171" rx="8" ry="4" fill="#3B2A0A"/>
      <path d="M140 250 Q200 230 260 250" stroke="#5E420F" stroke-width="2" fill="none" opacity=".45"/><path d="M135 270 Q200 252 265 270" stroke="#5E420F" stroke-width="2" fill="none" opacity=".45"/>`,
    pettagama: `<rect x="105" y="196" width="190" height="110" rx="6" fill="url(#m)"/><path d="M105 200 Q105 150 200 146 Q295 150 295 200 Z" fill="url(#m)"/>
      <rect x="112" y="304" width="18" height="22" fill="url(#m)"/><rect x="270" y="304" width="18" height="22" fill="url(#m)"/>
      <rect x="140" y="148" width="10" height="158" fill="#5E420F" opacity=".35"/><rect x="250" y="148" width="10" height="158" fill="#5E420F" opacity=".35"/>
      <circle cx="200" cy="232" r="16" fill="url(#m)" stroke="#5E420F" stroke-width="2"/><rect x="197" y="230" width="6" height="12" fill="#3B2A0A"/>`,
    heppuwa: `<ellipse cx="200" cy="330" rx="62" ry="12" fill="url(#m)"/><path d="M186 216 L214 216 L222 322 L178 322 Z" fill="url(#m)"/>
      <ellipse cx="200" cy="250" rx="22" ry="8" fill="url(#m)"/><path d="M92 176 Q200 262 308 176 Z" fill="url(#m)"/>
      <ellipse cx="200" cy="176" rx="108" ry="18" fill="url(#m)" stroke="#5E420F" stroke-width="1.5"/>`,
    paththara: `<ellipse cx="200" cy="322" rx="70" ry="12" fill="url(#m)"/><path d="M110 214 Q110 318 200 318 Q290 318 290 214 Z" fill="url(#m)"/>
      <path d="M118 212 Q200 132 282 212 Z" fill="url(#m)"/><ellipse cx="200" cy="212" rx="86" ry="10" fill="url(#m)" stroke="#5E420F" stroke-width="1.5"/>
      <path d="M190 150 Q200 118 210 150 Z" fill="url(#m)"/>`,
    punkalasa: `<ellipse cx="200" cy="330" rx="46" ry="9" fill="url(#m)"/><path d="M130 250 Q130 326 200 326 Q270 326 270 250 Q270 196 222 186 L178 186 Q130 196 130 250 Z" fill="url(#m)"/>
      <ellipse cx="200" cy="184" rx="40" ry="10" fill="url(#m)"/>${[-60, -38, -18, 0, 18, 38, 60].map(a => `<path d="M200 182 Q${200 + a * 1.2} ${120 + Math.abs(a) * .6} ${200 + a * 1.9} ${92 + Math.abs(a) * 1.3}" stroke="url(#m)" stroke-width="9" stroke-linecap="round" fill="none"/>`).join('')}
      <circle cx="200" cy="168" r="16" fill="url(#m)"/>`,
    bell: `<path d="M140 300 Q140 186 200 180 Q260 186 260 300 Z" fill="url(#m)"/><ellipse cx="200" cy="300" rx="66" ry="12" fill="url(#m)" stroke="#5E420F" stroke-width="1.5"/>
      <rect x="192" y="140" width="16" height="42" fill="url(#m)"/><path d="M200 92 Q226 120 200 146 Q174 120 200 92 Z" fill="url(#m)"/><circle cx="200" cy="318" r="9" fill="url(#m)"/>`
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6E3DE"/></radialGradient>
    <linearGradient id="m" x1="0" x2="1">${tones.map((c, i) => `<stop offset="${i / (tones.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient>
    <radialGradient id="sh"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="400" fill="url(#bg)"/><ellipse cx="200" cy="340" rx="130" ry="16" fill="url(#sh)"/>${shapes[type]}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
const ART = {
  karaduwaGold: productArt('karaduwa', 'gold'), karaduwa: productArt('karaduwa'), karaduwaAntique: productArt('karaduwa', 'antique'),
  kendiya: productArt('kendiya'), kendiyaAntique: productArt('kendiya', 'antique'),
  pettagama: productArt('pettagama'), pettagamaAntique: productArt('pettagama', 'antique'),
  heppuwa: productArt('heppuwa'), heppuwaGold: productArt('heppuwa', 'gold'),
  paththara: productArt('paththara'), punkalasa: productArt('punkalasa', 'gold'), bell: productArt('bell')
};

/* ---------- Home page banners ---------- */
const HERO_SLIDES = [
  { img: PW.lampKandy, bg: '#7B1C1C', kicker: 'Oil lamps · පහන්', title: 'Hand-cast pahan from Pilimathalawa', text: 'Standing, hanging and table lamps made by family workshops near Kandy. Up to 20% off this week.', cta: 'Shop oil lamps', href: '#/shop?cat=oil-lamps' },
  { img: PW.offering, bg: '#1F3A5F', kicker: 'Pooja & temple', title: 'Everything for the shrine room', text: 'Heppuwa, paththara, punkalasa, karaduwa and Buddha statues, direct from the makers.', cta: 'Shop pooja items', href: '#/shop?cat=pooja' },
  { img: PW.gadaladeniya, bg: '#3A2E1A', kicker: 'From the brass village', title: 'Buy direct from Pilimathalawa', text: 'Every order goes straight to the workshop that made it. Pay in cash when it reaches your door.', cta: 'Browse the shops', href: '#/stores' },
  { img: PW.lightingLamp, bg: '#2E4A3A', kicker: 'For brass workshops', title: 'Open your shop on Pittala', text: 'List your products, run deals and take cash-on-delivery orders from all over Sri Lanka.', cta: 'Start selling', href: '#/sell' }
];

const CATEGORIES = [
  { id: 'oil-lamps', name: 'Oil lamps', name_si: 'පහන්', si: 'පහන්', img: P.lampKandy },
  { id: 'buddha', name: 'Buddha statues', name_si: 'බුද්ධ ප්‍රතිමා', si: 'බුද්ධ ප්‍රතිමා', img: P.buddhaBrass },
  { id: 'karaduwa', name: 'Karaduwa & caskets', name_si: 'කරඬු සහ මංජුසා', si: 'කරඬු', img: ART.karaduwaGold },
  { id: 'pooja', name: 'Pooja & temple items', name_si: 'පූජා භාණ්ඩ', si: 'පූජා භාණ්ඩ', img: P.lampsBuddhist },
  { id: 'kendiya', name: 'Kendiya & tableware', name_si: 'කෙණ්ඩි සහ මේස භාණ්ඩ', si: 'කෙණ්ඩිය', img: ART.kendiya },
  { id: 'pettagama', name: 'Pettagama & boxes', name_si: 'පෙට්ටගම් සහ පෙට්ටි', si: 'පෙට්ටගම', img: ART.pettagama },
  { id: 'gifts', name: 'Gifts & souvenirs', name_si: 'තෑගි සහ සිහිවටන', si: 'තෑගි', img: P.lampDecor }
];

const DISTRICTS = ['Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'];

const BANNERS = [PW.gadaladeniya, PW.daladaMaligawa, PW.lampsTemple, PW.offering, PW.templeInterior, PW.templeFacade, PW.bahiravokanda, PW.lampsBuddhist];
const THEME_COLORS = ['#7B1C1C', '#1F3A5F', '#3A2E1A', '#2E4A3A', '#4A2C4F', '#2B2B2B', '#8C4A12', '#0F5257'];

function buildSeed() {
  const now = Date.now();
  const H = 3600e3, D = 24 * H;

  const settings = {
    platformName: 'Pittala.lk', platformRate: 2, agentRate: 10, regFee: 5000,
    deliveryKandy: 400, deliveryOther: 650, freeDeliveryOver: 25000,
    supportEmail: 'hello@pittala.lk', supportPhone: '0771234567'
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
    { id: 'u9', role: 'customer', name: 'Ishara Fernando', email: 'ishara@gmail.com', password: 'buyer123', phone: '0771112233', createdAt: now - 40 * D }
  ];

  const signed = (name, rate, at) => ({ signedName: name, rate, signedAt: at, version: '2026.1' });
  const shop = (o) => ({ layout: 'classic', font: 'engraved', announcement: '', hours: 'Mon–Sat, 8.30 am – 5.30 pm', designed: true, ...o });

  const shops = [
    shop({ id: 's1', name: 'Kandyan Brass House', ownerId: 'u2', regionId: 'r1', status: 'published', color: '#7B1C1C', banner: PW.gadaladeniya,
      tagline: 'Temple-grade pahan since 1962', story: 'Three generations of the Herath family have cast pahan and hanging lamps for viharas and devales across the hill country. Every lamp is sand-cast, chased by hand and polished in our workshop on Kandy Road.',
      phone: '0772345678', whatsapp: '0772345678', email: 'agent@pittala.lk', address: 'No. 41, Kandy Road, Pilimathalawa', est: 1962, artisans: 14,
      announcement: 'Free delivery in Kandy district this week', rating: 4.9, createdAt: now - 400 * D,
      agreement: signed('K. B. Herath', 2, now - 400 * D), payment: { ref: 'AGENT-SELF', amount: 0, at: now - 400 * D }, approvals: { agentAt: now - 400 * D, adminAt: now - 399 * D } }),
    shop({ id: 's2', name: 'Siri Pittala Works', ownerId: 'u3', regionId: 'r1', status: 'published', color: '#3A2E1A', banner: PW.daladaMaligawa,
      tagline: 'Buddha statues and karaduwa', story: 'Sirisena learned casting from his uncle at the age of twelve. The workshop makes seated Buddha statues, karaduwa and manjusawa for temples and homes.',
      phone: '0713456789', whatsapp: '0713456789', email: 'siri@pittala.lk', address: 'Galagedara Road, Pilimathalawa', est: 1988, artisans: 8,
      announcement: 'Vesak orders now open — order by 30 April', rating: 4.8, createdAt: now - 300 * D,
      agreement: signed('S. Wickramasinghe', 12, now - 300 * D), payment: { ref: 'BOC-882134', amount: 5000, at: now - 299 * D }, approvals: { agentAt: now - 299 * D, adminAt: now - 298 * D } }),
    shop({ id: 's3', name: 'Lakmini Brass Craft', ownerId: 'u4', regionId: 'r1', status: 'published', color: '#4A2C4F', banner: PW.templeInterior,
      tagline: 'Pettagama, gifts and keepsakes', story: 'A women-led workshop making pettagama, small karaduwa and gift pieces with six home-based artisans from the village.',
      phone: '0754567890', whatsapp: '0754567890', email: 'lakmini@pittala.lk', address: 'Temple Road, Pilimathalawa', est: 2009, artisans: 6, layout: 'compact', font: 'modern',
      rating: 4.7, createdAt: now - 220 * D,
      agreement: signed('L. Jayawardena', 12, now - 220 * D), payment: { ref: 'HNB-551920', amount: 5000, at: now - 219 * D }, approvals: { agentAt: now - 219 * D, adminAt: now - 218 * D } }),
    shop({ id: 's4', name: 'Dalada Pooja Bhanda', ownerId: 'u5', regionId: 'r1', status: 'published', color: '#1F3A5F', banner: PW.lampsTemple,
      tagline: 'Pooja items for viharas and homes', story: 'Heppuwa, paththara, bells and offering lamps supplied to temples across the island, and now to homes through Pittala.',
      phone: '0765678901', whatsapp: '0765678901', email: 'nimal@pittala.lk', address: 'Kadugannawa Road, Pilimathalawa', est: 1995, artisans: 10,
      rating: 4.6, createdAt: now - 150 * D,
      agreement: signed('N. Dissanayake', 12, now - 150 * D), payment: { ref: 'COM-773201', amount: 5000, at: now - 149 * D }, approvals: { agentAt: now - 149 * D, adminAt: now - 148 * D } }),
    shop({ id: 's5', name: 'Udarata Kendiya Works', ownerId: 'u6', regionId: 'r1', status: 'published', color: '#2E4A3A', banner: PW.templeFacade,
      tagline: 'Kendiya and traditional tableware', story: 'Kendiya, water pots and serving ware in the old udarata style, made to be used every day.',
      phone: '0706789012', whatsapp: '0706789012', email: 'chaminda@pittala.lk', address: 'Pilimathalawa Junction', est: 2014, artisans: 5, font: 'modern',
      announcement: 'Use code UDA5 for 5% off orders over Rs. 10,000', rating: 4.5, createdAt: now - 90 * D,
      agreement: signed('C. Rathnayake', 12, now - 90 * D), payment: { ref: 'SAM-110293', amount: 5000, at: now - 89 * D }, approvals: { agentAt: now - 89 * D, adminAt: now - 88 * D } }),
    shop({ id: 's6', name: 'Senanayake Brass Foundry', ownerId: 'u7', regionId: 'r1', status: 'pending_payment', color: '#8C4A12', banner: PW.bahiravokanda,
      tagline: 'Large castings to order', story: 'Foundry work for temple fittings and large statues.', phone: '0778901234', whatsapp: '0778901234', email: 'ruwan@pittala.lk',
      address: 'Hantana Estate Road, Pilimathalawa', est: 2001, artisans: 9, rating: 0, createdAt: now - 2 * D, designed: false,
      agreement: signed('R. Senanayake', 12, now - 2 * D), payment: { ref: 'BOC-993012', amount: 5000, at: now - 2 * D, slip: '' }, approvals: {} }),
    shop({ id: 's7', name: 'Dilani Gift Studio', ownerId: 'u8', regionId: 'r1', status: 'agent_approved', color: '#0F5257', banner: PW.lampsBuddhist,
      tagline: 'Wedding and corporate brass gifts', story: 'Engraved brass keepsakes for weddings and corporate events.', phone: '0719012345', whatsapp: '0719012345', email: 'dilani@pittala.lk',
      address: 'Peradeniya Road, Pilimathalawa', est: 2018, artisans: 3, rating: 0, createdAt: now - 5 * D, designed: false,
      agreement: signed('D. Perera', 12, now - 5 * D), payment: { ref: 'HNB-400128', amount: 5000, at: now - 4 * D, slip: '' }, approvals: { agentAt: now - 3 * D } })
  ];

  const mk = (id, shopId, name, category, price, opts = {}) => ({
    id, shopId, name, category, price,
    discount: opts.discount || 0, dealEnds: opts.dealHours ? now + opts.dealHours * H : null, demoDealHours: opts.dealHours || 0,
    stock: opts.stock ?? 10, images: opts.images, description: opts.desc || '',
    material: opts.material || 'Solid brass', dimensions: opts.dim || '', weight: opts.weight || '', finish: opts.finish || 'Natural brass, hand-polished',
    badge: opts.badge || '', sold: opts.sold || 0, views: opts.views || Math.round(80 + Math.random() * 900),
    rating: opts.rating || 4.6, reviews: opts.reviews || 0, createdAt: now - (opts.age || 30) * D, active: true, spotlight: !!opts.spotlight, demoDealHours2: 0
  });

  const products = [
    // Kandyan Brass House — oil lamps (region agent's own shop)
    mk('p1', 's1', 'Traditional Pahana — 5 wick standing oil lamp, 18 inch', 'oil-lamps', 18500, { discount: 15, dealHours: 30, stock: 6, images: [P.lampKandy, P.lampDecor], badge: 'Bestseller', sold: 64, rating: 4.9, reviews: 38, dim: 'H 46 cm, base 14 cm', weight: '2.4 kg', desc: 'The lamp lit at every auspicious moment in a Sri Lankan home. Five wick spouts on a tiered stand, sand-cast in one piece and finished by hand. Ideal for Avurudu, weddings, office openings and the shrine room.', spotlight: true }),
    mk('p2', 's1', 'Kukula Pahana — ceremonial lamp, 5 feet', 'oil-lamps', 68000, { stock: 2, images: [P.lampTemple, P.lampKandy], badge: 'Made to order', sold: 9, rating: 5, reviews: 6, dim: 'H 152 cm', weight: '14 kg', desc: 'The tall rooster-topped ceremonial lamp used at inaugurations, weddings and national events. Seven working days to make.' }),
    mk('p3', 's1', 'Table Pahana — compact 9 inch', 'oil-lamps', 6800, { discount: 10, stock: 0, images: [P.lampDecor, P.lampKandy], sold: 120, rating: 4.7, reviews: 51, dim: 'H 22 cm', weight: '0.9 kg', desc: 'Our smallest standing pahana, sized for apartment shrine rooms and office desks.' }),
    mk('p4', 's1', 'Pol Thel Pahana — hanging lamp with chain', 'oil-lamps', 24500, { stock: 3, images: [P.lampTemple, P.lampsTemple], badge: 'Handmade', sold: 22, rating: 4.8, reviews: 14, dim: 'Bowl 22 cm, chain 90 cm', weight: '3.1 kg', desc: 'A seven-wick hanging lamp of the kind seen in viharas and walauwas, with a hand-forged chain.' }),

    // Siri Pittala Works — Buddha statues & karaduwa
    mk('p5', 's2', 'Samadhi Buddha statue — antique finish, 12 inch', 'buddha', 32500, { discount: 12, dealHours: 50, stock: 4, images: [P.buddhaBrass], badge: 'Bestseller', sold: 33, rating: 4.9, reviews: 27, dim: 'H 30 cm', weight: '3.6 kg', finish: 'Antique patina', desc: 'Seated Buddha in the Samadhi posture, cast in brass with a dark antique finish that deepens over time.', spotlight: true }),
    mk('p6', 's2', 'Samadhi Buddha statue — gold plated, 8 inch', 'buddha', 21500, { stock: 6, images: [P.buddhaBrass], sold: 19, rating: 4.8, reviews: 12, dim: 'H 20 cm', finish: 'Gold plated', desc: 'A smaller seated Buddha with a bright gold-plated finish for the home shrine.' }),
    mk('p7', 's2', 'Gold plated Karaduwa with chains — 3 feet', 'karaduwa', 145000, { discount: 8, stock: 1, images: [ART.karaduwaGold, ART.karaduwa], badge: 'Masterpiece', sold: 4, rating: 5, reviews: 3, dim: 'H 91 cm', weight: '9 kg', finish: 'Gold plated', desc: 'A dagoba-shaped relic casket with chuda manikya, decorative chains and lens ornament. Made to order for temples and home shrines.' }),
    mk('p8', 's2', 'Brass Karaduwa — 12 inch', 'karaduwa', 28500, { stock: 5, images: [ART.karaduwa, ART.karaduwaGold], sold: 16, rating: 4.8, reviews: 9, dim: 'H 30 cm', desc: 'A table-size karaduwa in natural brass for the home shrine room.' }),
    mk('p9', 's2', 'Manjusawa relic box — antique finish', 'pettagama', 18900, { stock: 3, images: [ART.pettagamaAntique], sold: 7, rating: 4.7, reviews: 4, dim: '20 × 14 × 16 cm', finish: 'Antique patina', desc: 'A small domed relic box with hinged lid and lock plate.' }),

    // Lakmini Brass Craft — pettagama, gifts, small karaduwa
    mk('p10', 's3', 'Brass Pettagama jewellery chest', 'pettagama', 16500, { discount: 20, dealHours: 18, stock: 8, images: [ART.pettagama, ART.pettagamaAntique], badge: 'New', sold: 21, rating: 4.6, reviews: 11, dim: '24 × 16 × 18 cm', desc: 'A miniature of the traditional pettagama chest, with brass straps and a working lock. A lovely wedding gift.', age: 5 }),
    mk('p11', 's3', 'Mini Karaduwa keepsake — 6 inch', 'gifts', 6900, { stock: 14, images: [ART.karaduwaGold], sold: 46, rating: 4.7, reviews: 18, dim: 'H 15 cm', finish: 'Gold plated', desc: 'A small gold-plated karaduwa, popular as a Vesak or Poson gift.' }),
    mk('p12', 's3', 'Mini Pahana gift set with wicks', 'gifts', 4900, { discount: 10, stock: 2, images: [P.lampDecor], sold: 58, rating: 4.6, reviews: 22, dim: 'H 15 cm', desc: 'A small pahana in a gift box with cotton wicks — ideal for Avurudu and housewarming gifts.' }),
    mk('p13', 's3', 'Punkalasa pair — gold plated', 'pooja', 14500, { stock: 6, images: [ART.punkalasa], sold: 15, rating: 4.7, reviews: 7, dim: 'H 26 cm each', finish: 'Gold plated', desc: 'A pair of punkalasa (pots of plenty) with coconut-flower crowns, used at weddings and openings.' }),

    // Dalada Pooja Bhanda — pooja items, lamps (competes with s1)
    mk('p14', 's4', 'Five wick Pahana — vihara pattern', 'oil-lamps', 16900, { discount: 5, stock: 8, images: [P.lampsTemple, P.lampTemple], sold: 40, rating: 4.6, reviews: 18, dim: 'H 44 cm', weight: '2.2 kg', desc: 'A five-wick standing lamp with a vihara-pattern stem.' }),
    mk('p15', 's4', 'Pooja offering lamp set (4)', 'pooja', 12500, { discount: 18, dealHours: 70, stock: 5, images: [P.lampsBuddhist, P.lampsTemple], badge: 'Set', sold: 16, rating: 4.7, reviews: 9, desc: 'Four matching offering lamps for the shrine room or the temple.' }),
    mk('p16', 's4', 'Brass Heppuwa (tazza) — 10 inch', 'pooja', 8900, { stock: 9, images: [ART.heppuwa, ART.heppuwaGold], sold: 28, rating: 4.6, reviews: 12, dim: 'Dia 25 cm, H 20 cm', desc: 'The footed offering tray used for flowers and food offerings at the shrine.' }),
    mk('p17', 's4', 'Paththara alms bowl with lid and stand', 'pooja', 11800, { stock: 7, images: [ART.paththara], sold: 19, rating: 4.7, reviews: 8, dim: 'Dia 22 cm', desc: 'A brass alms bowl set with lid and stand, used for dana and temple offerings.' }),
    mk('p18', 's4', 'Temple bell with lotus-bud handle', 'pooja', 3900, { discount: 10, stock: 0, images: [ART.bell], sold: 77, rating: 4.7, reviews: 30, dim: 'H 16 cm', desc: 'Clear, long-ringing bell with a lotus-bud handle.' }),

    // Udarata Kendiya Works — kendiya & tableware
    mk('p19', 's5', 'Traditional Kendiya water pot', 'kendiya', 13500, { discount: 10, dealHours: 26, stock: 7, images: [ART.kendiya, ART.kendiyaAntique], badge: 'Bestseller', sold: 23, rating: 4.6, reviews: 12, dim: '1.2 L', desc: 'The spouted water vessel of the old udarata households, engraved with liyawela bands.' }),
    mk('p20', 's5', 'Antique-finish Kendiya — large', 'kendiya', 19500, { stock: 3, images: [ART.kendiyaAntique, ART.kendiya], sold: 8, rating: 4.5, reviews: 4, dim: '2 L', finish: 'Antique patina', desc: 'A larger kendiya with an aged finish, made for display.' }),
    mk('p21', 's5', 'Gold plated Heppuwa — wedding table', 'kendiya', 15900, { stock: 5, images: [ART.heppuwaGold, ART.heppuwa], sold: 12, rating: 4.4, reviews: 5, finish: 'Gold plated', desc: 'A footed tray for the poruwa ceremony and the wedding table.' }),
    mk('p22', 's5', 'Kendiya miniature souvenir', 'gifts', 3500, { discount: 15, stock: 20, images: [ART.kendiya], sold: 31, rating: 4.3, reviews: 6, dim: 'H 10 cm', desc: 'A small kendiya — a light, easy-to-pack souvenir of Sri Lanka.' })
  ];


  // ---- Sinhala content (shops can edit these in their dashboard) ----
  const SI_P = {
    p1: ['සාම්ප්‍රදායික පහන — වැටි 5 සිටුවන පොල්තෙල් පහන, අඟල් 18', 'ශ්‍රී ලාංකික නිවසක සෑම සුබ මොහොතකම දල්වන පහන. පඩි සහිත කඳක් මත වැටි පහක්, එක් කොටසක් ලෙස වැලි අච්චුවේ වාත්තු කර අතින් නිම කර ඇත. අවුරුද්ද, මංගල උත්සව, ආයතන විවෘත කිරීම් සහ පූජා කාමරයට ඉතා සුදුසුයි.'],
    p2: ['කුකුළු පහන — උත්සව පහන, අඩි 5', 'සමාරම්භක උත්සව, මංගල උත්සව සහ ජාතික උත්සවවලදී භාවිත වන කුකුළු රූපය සහිත උස උත්සව පහන. සෑදීමට වැඩ කරන දින හතක් ගත වේ.'],
    p3: ['මේස පහන — කුඩා, අඟල් 9', 'මහල් නිවාසවල පූජා කාමර සහ කාර්යාල මේස සඳහා සුදුසු අපගේ කුඩාම සිටුවන පහන.'],
    p4: ['පොල්තෙල් එල්ලෙන පහන — දම්වැල සහිතව', 'විහාර සහ වළව්වල දක්නට ලැබෙන ආකාරයේ වැටි හතක එල්ලෙන පහනක්, අතින් තැනූ දම්වැලක් සමඟ.'],
    p5: ['සමාධි බුද්ධ ප්‍රතිමාව — පැරණි නිමාව, අඟල් 12', 'සමාධි ඉරියව්වෙන් වැඩ සිටින බුද්ධ ප්‍රතිමාව, පිත්තලෙන් වාත්තු කර කාලයත් සමඟ තවත් ගැඹුරු වන තද පැරණි නිමාවකින් යුතුයි.'],
    p6: ['සමාධි බුද්ධ ප්‍රතිමාව — රන් ආලේපිත, අඟල් 8', 'නිවසේ පූජාසනය සඳහා දීප්තිමත් රන් ආලේපිත නිමාවක් සහිත කුඩා බුද්ධ ප්‍රතිමාවකි.'],
    p7: ['දම්වැල් සහිත රන් ආලේපිත කරඬුව — අඩි 3', 'චූඩාමාණික්‍යය, අලංකාර දම්වැල් සහ කාච අලංකරණ සහිත දාගැබ් හැඩැති ධාතු කරඬුවකි. විහාරස්ථාන සහ නිවෙස් පූජාසන සඳහා ඇණවුම් මත සාදනු ලැබේ.'],
    p8: ['පිත්තල කරඬුව — අඟල් 12', 'නිවසේ පූජා කාමරය සඳහා ස්වභාවික පිත්තල නිමාවෙන් යුත් මේස ප්‍රමාණයේ කරඬුවකි.'],
    p9: ['මංජුසාව (ධාතු පෙට්ටිය) — පැරණි නිමාව', 'සරනේරු සහිත පියනක් සහ අගුලු තහඩුවක් ඇති කුඩා ධාතු පෙට්ටියකි.'],
    p10: ['පිත්තල පෙට්ටගම — ආභරණ පෙට්ටිය', 'පිත්තල පටි සහ ක්‍රියාකාරී අගුලක් සහිත සාම්ප්‍රදායික පෙට්ටගමේ කුඩා අනුරුවකි. මනරම් මංගල තෑග්ගකි.'],
    p11: ['කුඩා කරඬු සිහිවටනය — අඟල් 6', 'වෙසක් හෝ පොසොන් තෑග්ගක් ලෙස ජනප්‍රිය කුඩා රන් ආලේපිත කරඬුවකි.'],
    p12: ['වැටි සහිත කුඩා පහන් තෑගි කට්ටලය', 'කපු වැටි සමඟ තෑගි පෙට්ටියක ඇති කුඩා පහනක් — අවුරුදු සහ ගෘහප්‍රවේශ තෑගි සඳහා ඉතා සුදුසුයි.'],
    p13: ['පුන්කලස් යුගලය — රන් ආලේපිත', 'මංගල උත්සව සහ විවෘත කිරීම් සඳහා භාවිත කරන පොල් මල් සහිත පුන්කලස් යුගලයකි.'],
    p14: ['වැටි 5 පහන — විහාර රටාව', 'විහාර රටාවේ කඳක් සහිත වැටි පහක සිටුවන පහනකි.'],
    p15: ['පූජා පහන් කට්ටලය (4)', 'පූජා කාමරයට හෝ විහාරස්ථානයට ගැළපෙන පූජා පහන් හතරක කට්ටලයකි.'],
    p16: ['පිත්තල හෙප්පුව — අඟල් 10', 'පූජාසනයේ මල් සහ ආහාර පූජා සඳහා භාවිත කරන පාදය සහිත පූජා තැටිය.'],
    p17: ['පියන සහ පාදය සහිත පාත්තරය', 'දානය සහ විහාරස්ථාන පූජා සඳහා භාවිත කරන පියන සහ පාදය සහිත පිත්තල පාත්තර කට්ටලයකි.'],
    p18: ['නෙළුම් කැකුළු මිට සහිත ඝණ්ටාරය', 'නෙළුම් කැකුළු හැඩැති මිටක් සහිත, පැහැදිලිව දිගු වේලාවක් නාද වන ඝණ්ටාරයකි.'],
    p19: ['සාම්ප්‍රදායික කෙණ්ඩිය', 'ලියවැල් පටි කැටයම් කළ, පැරණි උඩරට නිවෙස්වල භාවිත වූ හොට සහිත ජල භාජනය.'],
    p20: ['පැරණි නිමාවේ කෙණ්ඩිය — විශාල', 'ප්‍රදර්ශනය සඳහා සාදන ලද, පැරණි පෙනුමක් ඇති විශාල කෙණ්ඩියකි.'],
    p21: ['රන් ආලේපිත හෙප්පුව — මංගල මේසය', 'පෝරුව චාරිත්‍රය සහ මංගල මේසය සඳහා පාදය සහිත තැටියකි.'],
    p22: ['කුඩා කෙණ්ඩි සිහිවටනය', 'ශ්‍රී ලංකාවේ සැහැල්ලු, ඇසුරුම් කිරීමට පහසු කුඩා කෙණ්ඩි සිහිවටනයකි.']
  };
  products.forEach(p => { if (SI_P[p.id]) { p.name_si = SI_P[p.id][0]; p.description_si = SI_P[p.id][1]; } });
  const SI_S = {
    s1: ['උඩරට පිත්තල නිවස', '1962 සිට විහාර ප්‍රමිතියේ පහන්', 'හේරත් පවුලේ පරම්පරා තුනක් කඳුරට පුරා විහාර හා දේවාල සඳහා පහන් සහ එල්ලෙන පහන් වාත්තු කර ඇත. සෑම පහනක්ම වැලි අච්චුවේ වාත්තු කර, අතින් කැටයම් කර, මහනුවර පාරේ පිහිටි අපගේ වැඩපොළේ ඔප දමනු ලැබේ.', 'මෙම සතියේ මහනුවර දිස්ත්‍රික්කයට නොමිලේ බෙදාහැරීම'],
    s2: ['සිරි පිත්තල වැඩපොළ', 'බුද්ධ ප්‍රතිමා සහ කරඬු', 'සිරිසේන වයස අවුරුදු දොළහේදී සිය මාමාගෙන් වාත්තු කිරීම ඉගෙන ගත්තේය. මෙම වැඩපොළ විහාරස්ථාන සහ නිවෙස් සඳහා බුද්ධ ප්‍රතිමා, කරඬු සහ මංජුසා නිපදවයි.', 'වෙසක් ඇණවුම් දැන් භාරගනී — අප්‍රේල් 30 ට පෙර ඇණවුම් කරන්න'],
    s3: ['ලක්මිණි පිත්තල කලා', 'පෙට්ටගම්, තෑගි සහ සිහිවටන', 'ගම්මානයේ නිවෙස්වල සිට වැඩ කරන කාන්තා ශිල්පීන් හය දෙනෙකු සමඟ පෙට්ටගම්, කුඩා කරඬු සහ තෑගි භාණ්ඩ සාදන කාන්තාවන් මෙහෙයවන වැඩපොළකි.', ''],
    s4: ['දළදා පූජා භාණ්ඩ', 'විහාර සහ නිවෙස් සඳහා පූජා භාණ්ඩ', 'දිවයින පුරා විහාරස්ථානවලට හෙප්පු, පාත්තර, ඝණ්ටාර සහ පූජා පහන් සපයන අපි දැන් Pittala.lk හරහා නිවෙස්වලටද සපයමු.', ''],
    s5: ['උඩරට කෙණ්ඩි වැඩපොළ', 'කෙණ්ඩි සහ සාම්ප්‍රදායික මේස භාණ්ඩ', 'පැරණි උඩරට ශෛලියෙන්, දිනපතා භාවිතයට සුදුසු කෙණ්ඩි, ජල භාජන සහ පිළිගැන්වීමේ භාණ්ඩ.', 'රු. 10,000 ට වැඩි ඇණවුම් සඳහා UDA5 කේතයෙන් 5% වට්ටමක්'],
    s6: ['සේනානායක පිත්තල වාත්තු පොළ', 'ඇණවුම් මත විශාල වාත්තු', 'විහාරස්ථාන සවිකිරීම් සහ විශාල ප්‍රතිමා සඳහා වාත්තු කටයුතු.', ''],
    s7: ['දිලානි තෑගි ස්ටූඩියෝ', 'මංගල සහ ආයතනික පිත්තල තෑගි', 'මංගල උත්සව සහ ආයතනික උත්සව සඳහා කැටයම් කළ පිත්තල සිහිවටන.', '']
  };
  shops.forEach(x => { const v = SI_S[x.id]; if (v) { x.name_si = v[0]; x.tagline_si = v[1]; x.story_si = v[2]; x.announcement_si = v[3]; } });

  const names = ['Ishara F.', 'Tharindu P.', 'Malsha K.', 'Dinesh R.', 'Sachini W.', 'Pradeep J.', 'Nethmi S.', 'Ashan M.', 'Kavindi L.', 'Ruwini D.', 'Amila G.', 'Hasini B.'];
  const lines = [
    'Heavier and better finished than the ones I saw in Colombo shops.',
    'Arrived well packed. The shop called on WhatsApp before sending it.',
    'Exactly as described. Paid cash when it arrived, very easy.',
    'Bought for my sister’s wedding — everyone asked where it was from.',
    'The polish is beautiful. Will order the matching pair.',
    'Took two extra days but the seller kept me updated.',
    'Good quality brass, you can feel the weight.',
    'Lovely detail on the engraving.'
  ];
  const reviews = [];
  products.forEach((p, i) => {
    const n = Math.min(3, Math.max(1, Math.round(p.reviews / 10)));
    for (let k = 0; k < n; k++) reviews.push({ id: `rv${i}_${k}`, productId: p.id, shopId: p.shopId, name: names[(i + k) % names.length], rating: k === 2 ? 4 : 5, text: lines[(i * 3 + k) % lines.length], at: now - (k * 9 + i) * D });
  });

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
      if (st === 'cancelled') history.push({ s: 'pending', at }, { s: 'cancelled', at: at + 5 * H });
      else flow.slice(0, flow.indexOf(st) + 1).forEach((s, i) => history.push({ s, at: at + i * 20 * H }));
      orders.push({ id, groupId: id, shopId: p.shopId, createdAt: at, status: st, payment: 'COD',
        items: [{ productId: p.id, name: p.name, img: p.images[0], price: unit, qty }],
        subtotal: sub, delivery: del, discount: 0, total: sub + del,
        customer: { ...cust, whatsapp: cust.phone, landmark: '', notes: '', line2: '' }, history });
    }
  }

  const coupons = [
    { code: 'UDA5', shopId: 's5', type: 'pct', value: 5, minOrder: 10000, expires: now + 20 * D, uses: 4 },
    { code: 'VESAK10', shopId: 's2', type: 'pct', value: 10, minOrder: 20000, expires: now + 12 * D, uses: 2 },
    { code: 'PAHANA1000', shopId: 's1', type: 'flat', value: 1000, minOrder: 15000, expires: now + 30 * D, uses: 7 }
  ];
  const spotlights = [
    { id: 'sp1', shopId: 's3', productId: 'p10', days: 7, fee: 1500, status: 'pending', at: now - 1 * D },
    { id: 'sp2', shopId: 's1', productId: 'p1', days: 14, fee: 2500, status: 'active', at: now - 3 * D }
  ];

  return {
    version: 5, seededAt: now, settings, regions, users, shops, products, reviews, orders, coupons, spotlights,
    settlements: {}, outbox: [], activity: [
      { at: now - 3 * D, who: 'Kumara Bandara Herath', what: 'confirmed registration payment for Dilani Gift Studio' },
      { at: now - 2 * D, who: 'Ruwan Senanayake', what: 'submitted a shop application (Senanayake Brass Foundry)' }
    ],
    cart: [], wishlist: [], recent: [], session: null
  };
}
