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
  lampsBuddhist: 38194826,   // brass oil lamps lit in a Sri Lankan Buddhist temple
  lampsTemple: 12321803,     // brass oil lamps burning in a Sri Lankan temple
  buddhaBrass: 1585716       // brass Buddha statue
};
const P = Object.fromEntries(Object.entries(SL_PHOTOS).map(([k, v]) => [k, PX(v)]));
const PW = Object.fromEntries(Object.entries(SL_PHOTOS).map(([k, v]) => [k, PX(v, 1600)]));


/* Sri Lankan videos (Pixabay, free licence, no attribution required) */
const VIDEOS = {
  templeLamp: 'https://cdn.pixabay.com/video/2023/05/18/163544-828200779_large.mp4'   // oil lamp burning in a Sri Lankan temple
};

const CATEGORIES = [
  { id: 'oil-lamps', name: 'Oil lamps', name_si: 'පහන්', si: 'පහන්', img: P.lampKandy },
  { id: 'buddha', name: 'Buddha statues', name_si: 'බුද්ධ ප්‍රතිමා', si: 'බුද්ධ ප්‍රතිමා', img: P.buddhaBrass },
  { id: 'karaduwa', name: 'Karaduwa & caskets', name_si: 'කරඬු සහ මංජුසා', si: 'කරඬු', img: '' },
  { id: 'pooja', name: 'Pooja & temple items', name_si: 'පූජා භාණ්ඩ', si: 'පූජා භාණ්ඩ', img: P.lampsBuddhist },
  { id: 'kendiya', name: 'Kendiya & tableware', name_si: 'කෙණ්ඩි සහ මේස භාණ්ඩ', si: 'කෙණ්ඩිය', img: '' },
  { id: 'pettagama', name: 'Pettagama & boxes', name_si: 'පෙට්ටගම් සහ පෙට්ටි', si: 'පෙට්ටගම', img: '' },
  { id: 'gifts', name: 'Gifts & souvenirs', name_si: 'තෑගි සහ සිහිවටන', si: 'තෑගි', img: '' }
];

const DISTRICTS = ['Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'];

const BANNERS = [PW.lampKandy, PW.lampsTemple, PW.lampTemple, PW.lampsBuddhist, PW.lampDecor, PW.buddhaBrass];
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
    shop({ id: 's1', name: 'Kandyan Brass House', ownerId: 'u2', regionId: 'r1', status: 'published', color: '#7B1C1C', banner: PW.lampKandy,
      tagline: 'Temple-grade pahan since 1962', story: 'Three generations of the Herath family have cast pahan and hanging lamps for viharas and devales across the hill country. Every lamp is sand-cast, chased by hand and polished in our workshop on Kandy Road.',
      phone: '0772345678', whatsapp: '0772345678', email: 'agent@pittala.lk', address: 'No. 41, Kandy Road, Pilimathalawa', est: 1962, artisans: 14,
      announcement: 'Free delivery in Kandy district this week', rating: 4.9, createdAt: now - 400 * D,
      agreement: signed('K. B. Herath', 2, now - 400 * D), payment: { ref: 'AGENT-SELF', amount: 0, at: now - 400 * D }, approvals: { agentAt: now - 400 * D, adminAt: now - 399 * D } }),
    shop({ id: 's2', name: 'Siri Pittala Works', ownerId: 'u3', regionId: 'r1', status: 'published', color: '#3A2E1A', banner: PW.buddhaBrass,
      tagline: 'Buddha statues cast in brass', story: 'Sirisena learned casting from his uncle at the age of twelve. The workshop makes seated and standing Buddha statues in brass for temples and homes.',
      phone: '0713456789', whatsapp: '0713456789', email: 'siri@pittala.lk', address: 'Galagedara Road, Pilimathalawa', est: 1988, artisans: 8,
      announcement: 'Vesak orders now open — order by 30 April', rating: 4.8, createdAt: now - 300 * D,
      agreement: signed('S. Wickramasinghe', 12, now - 300 * D), payment: { ref: 'BOC-882134', amount: 5000, at: now - 299 * D }, approvals: { agentAt: now - 299 * D, adminAt: now - 298 * D } }),
    shop({ id: 's3', name: 'Lakmini Brass Craft', ownerId: 'u4', regionId: 'r1', status: 'agent_approved', color: '#4A2C4F', banner: PW.lampDecor,
      tagline: 'Pettagama, gifts and keepsakes', story: 'A women-led workshop making pettagama, small karaduwa and gift pieces with six home-based artisans from the village.',
      phone: '0754567890', whatsapp: '0754567890', email: 'lakmini@pittala.lk', address: 'Temple Road, Pilimathalawa', est: 2009, artisans: 6, layout: 'compact', font: 'modern',
      rating: 4.7, createdAt: now - 220 * D,
      agreement: signed('L. Jayawardena', 12, now - 220 * D), payment: { ref: 'HNB-551920', amount: 5000, at: now - 219 * D }, approvals: { agentAt: now - 219 * D, adminAt: now - 218 * D } }),
    shop({ id: 's4', name: 'Dalada Pooja Bhanda', ownerId: 'u5', regionId: 'r1', status: 'published', color: '#1F3A5F', banner: PW.lampsTemple,
      tagline: 'Pooja items for viharas and homes', story: 'Heppuwa, paththara, bells and offering lamps supplied to temples across the island, and now to homes through Pittala.',
      phone: '0765678901', whatsapp: '0765678901', email: 'nimal@pittala.lk', address: 'Kadugannawa Road, Pilimathalawa', est: 1995, artisans: 10,
      rating: 4.6, createdAt: now - 150 * D,
      agreement: signed('N. Dissanayake', 12, now - 150 * D), payment: { ref: 'COM-773201', amount: 5000, at: now - 149 * D }, approvals: { agentAt: now - 149 * D, adminAt: now - 148 * D } }),
    shop({ id: 's5', name: 'Udarata Kendiya Works', ownerId: 'u6', regionId: 'r1', status: 'pending_payment', color: '#2E4A3A', banner: PW.lampTemple,
      tagline: 'Kendiya and traditional tableware', story: 'Kendiya, water pots and serving ware in the old udarata style, made to be used every day.',
      phone: '0706789012', whatsapp: '0706789012', email: 'chaminda@pittala.lk', address: 'Pilimathalawa Junction', est: 2014, artisans: 5, font: 'modern',
      announcement: 'Use code UDA5 for 5% off orders over Rs. 10,000', rating: 4.5, createdAt: now - 90 * D,
      agreement: signed('C. Rathnayake', 12, now - 90 * D), payment: { ref: 'SAM-110293', amount: 5000, at: now - 89 * D }, approvals: { agentAt: now - 89 * D, adminAt: now - 88 * D } }),
    shop({ id: 's6', name: 'Senanayake Brass Foundry', ownerId: 'u7', regionId: 'r1', status: 'pending_payment', color: '#8C4A12', banner: PW.lampsBuddhist,
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
    mk('p1', 's1', 'Traditional Pahana — 5 wick standing oil lamp, 18 inch', 'oil-lamps', 18500, { discount: 15, dealHours: 30, stock: 6, images: [P.lampKandy, P.lampTemple], badge: 'Bestseller', sold: 64, rating: 4.9, reviews: 38, dim: 'H 46 cm, base 14 cm', weight: '2.4 kg', desc: 'The lamp lit at every auspicious moment in a Sri Lankan home. Five wick spouts on a tiered stand, sand-cast in one piece and finished by hand. Ideal for Avurudu, weddings, office openings and the shrine room.', spotlight: true }),
    mk('p2', 's1', 'Temple Pahana — tall standing lamp, 3 feet', 'oil-lamps', 42000, { stock: 2, images: [P.lampTemple, P.lampKandy], badge: 'Made to order', sold: 9, rating: 5, reviews: 6, dim: 'H 91 cm', weight: '7 kg', desc: 'A tall standing lamp of the kind lit at viharas, inaugurations and weddings. Seven working days to make.' }),
    mk('p3', 's1', 'Table Pahana — compact 9 inch', 'oil-lamps', 6800, { discount: 10, stock: 0, images: [P.lampDecor], sold: 120, rating: 4.7, reviews: 51, dim: 'H 22 cm', weight: '0.9 kg', desc: 'Our smallest standing pahana, sized for apartment shrine rooms and office desks.' }),

    // Siri Pittala Works — Buddha statues
    mk('p4', 's2', 'Samadhi Buddha statue — antique finish, 12 inch', 'buddha', 32500, { discount: 12, dealHours: 50, stock: 4, images: [P.buddhaBrass], badge: 'Bestseller', sold: 33, rating: 4.9, reviews: 27, dim: 'H 30 cm', weight: '3.6 kg', finish: 'Antique patina', desc: 'Seated Buddha in the Samadhi posture, cast in brass with a dark antique finish that deepens over time.', spotlight: true }),

    // Dalada Pooja Bhanda — temple lamps and pooja sets (competes with Kandyan Brass House)
    mk('p5', 's4', 'Five wick Pahana — vihara pattern', 'oil-lamps', 16900, { discount: 5, stock: 8, images: [P.lampsTemple, P.lampsBuddhist], sold: 40, rating: 4.6, reviews: 18, dim: 'H 44 cm', weight: '2.2 kg', desc: 'A five-wick standing lamp with a vihara-pattern stem.' }),
    mk('p6', 's4', 'Pooja offering lamp set (4)', 'pooja', 12500, { discount: 18, dealHours: 70, stock: 5, images: [P.lampsBuddhist, P.lampsTemple], badge: 'Set', sold: 16, rating: 4.7, reviews: 9, desc: 'Four matching brass offering lamps for the shrine room or the temple.' })
  ];



  // ---- Sinhala content (shops can edit these in their dashboard) ----
  const SI_P = {
    p1: ['සාම්ප්‍රදායික පහන — වැටි 5 සිටුවන පොල්තෙල් පහන, අඟල් 18', 'ශ්‍රී ලාංකික නිවසක සෑම සුබ මොහොතකම දල්වන පහන. පඩි සහිත කඳක් මත වැටි පහක්, එක් කොටසක් ලෙස වැලි අච්චුවේ වාත්තු කර අතින් නිම කර ඇත. අවුරුද්ද, මංගල උත්සව, ආයතන විවෘත කිරීම් සහ පූජා කාමරයට ඉතා සුදුසුයි.'],
    p2: ['විහාර පහන — උස සිටුවන පහන, අඩි 3', 'විහාරස්ථාන, සමාරම්භක උත්සව සහ මංගල උත්සවවල දල්වන උස සිටුවන පහනකි. සෑදීමට වැඩ කරන දින හතක් ගත වේ.'],
    p3: ['මේස පහන — කුඩා, අඟල් 9', 'මහල් නිවාසවල පූජා කාමර සහ කාර්යාල මේස සඳහා සුදුසු අපගේ කුඩාම සිටුවන පහන.'],
    p4: ['සමාධි බුද්ධ ප්‍රතිමාව — පැරණි නිමාව, අඟල් 12', 'සමාධි ඉරියව්වෙන් වැඩ සිටින බුද්ධ ප්‍රතිමාව, පිත්තලෙන් වාත්තු කර කාලයත් සමඟ තවත් ගැඹුරු වන තද පැරණි නිමාවකින් යුතුයි.'],
    p5: ['වැටි 5 පහන — විහාර රටාව', 'විහාර රටාවේ කඳක් සහිත වැටි පහක සිටුවන පහනකි.'],
    p6: ['පූජා පහන් කට්ටලය (4)', 'පූජා කාමරයට හෝ විහාරස්ථානයට ගැළපෙන පිත්තල පූජා පහන් හතරක කට්ටලයකි.']
  };

  products.forEach(p => { if (SI_P[p.id]) { p.name_si = SI_P[p.id][0]; p.description_si = SI_P[p.id][1]; } });
  const SI_S = {
    s1: ['උඩරට පිත්තල නිවස', '1962 සිට විහාර ප්‍රමිතියේ පහන්', 'හේරත් පවුලේ පරම්පරා තුනක් කඳුරට පුරා විහාර හා දේවාල සඳහා පහන් සහ එල්ලෙන පහන් වාත්තු කර ඇත. සෑම පහනක්ම වැලි අච්චුවේ වාත්තු කර, අතින් කැටයම් කර, මහනුවර පාරේ පිහිටි අපගේ වැඩපොළේ ඔප දමනු ලැබේ.', 'මෙම සතියේ මහනුවර දිස්ත්‍රික්කයට නොමිලේ බෙදාහැරීම'],
    s2: ['සිරි පිත්තල වැඩපොළ', 'පිත්තලෙන් වාත්තු කළ බුද්ධ ප්‍රතිමා', 'සිරිසේන වයස අවුරුදු දොළහේදී සිය මාමාගෙන් වාත්තු කිරීම ඉගෙන ගත්තේය. මෙම වැඩපොළ විහාරස්ථාන සහ නිවෙස් සඳහා පිත්තල බුද්ධ ප්‍රතිමා නිපදවයි.', 'වෙසක් ඇණවුම් දැන් භාරගනී — අප්‍රේල් 30 ට පෙර ඇණවුම් කරන්න'],
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
    { code: 'VESAK10', shopId: 's2', type: 'pct', value: 10, minOrder: 20000, expires: now + 12 * D, uses: 2 },
    { code: 'PAHANA1000', shopId: 's1', type: 'flat', value: 1000, minOrder: 15000, expires: now + 30 * D, uses: 7 }
  ];
  const spotlights = [
    { id: 'sp1', shopId: 's4', productId: 'p6', days: 7, fee: 1500, status: 'pending', at: now - 1 * D },
    { id: 'sp2', shopId: 's1', productId: 'p1', days: 14, fee: 2500, status: 'active', at: now - 3 * D }
  ];

  return {
    version: 6, seededAt: now, settings, regions, users, shops, products, reviews, orders, coupons, spotlights,
    settlements: {}, outbox: [], activity: [
      { at: now - 3 * D, who: 'Kumara Bandara Herath', what: 'confirmed registration payment for Dilani Gift Studio' },
      { at: now - 2 * D, who: 'Ruwan Senanayake', what: 'submitted a shop application (Senanayake Brass Foundry)' }
    ],
    cart: [], wishlist: [], recent: [], session: null
  };
}
