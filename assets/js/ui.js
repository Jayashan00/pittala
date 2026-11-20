/* Shared UI building blocks */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
  heart: '<path d="M12 20s-7-4.4-9.2-8.7C1.3 8.2 3.1 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.6 0 5.4 3.7 3.9 6.8C19 15.6 12 20 12 20z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  wa: '<path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-1.9z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-6.5 7S5 17.5 4 15l-1.4-3a1.4 1.4 0 0 1 2.4-1.4L8 14"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.4"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M10 20v-5h4v5"/>',
  brush: '<path d="M14 4l6 6-8.5 8.5a3 3 0 0 1-4.2 0l-1.8-1.8a3 3 0 0 1 0-4.2z"/><path d="M4 20c0-2 1-3 3-3"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.7-2.7-3-6-3"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.5c2.6 0 4.5 1.4 5.3 4"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  out: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  print: '<path d="M7 9V3h10v6M7 18H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="M7 5v14l12-7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

const LOGO_MARK = `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
  <circle cx="20" cy="20" r="19" fill="#7A1712" stroke="#DDB04A" stroke-width="1.2"/>
  <path class="flame" d="M20 7.5c2.2 2.7 3 4.6 3 6.1a3 3 0 0 1-6 0c0-1.5.8-3.4 3-6.1z" fill="#FFE7A3"/>
  <path d="M10.5 18.5h19c-.9 4-4.8 6.8-9.5 6.8s-8.6-2.8-9.5-6.8z" fill="#DDB04A"/>
  <path d="M17.6 25.2h4.8l1 4.3h-6.8z" fill="#DDB04A"/><rect x="13.5" y="29.3" width="13" height="2.6" rx="1.3" fill="#DDB04A"/>
</svg>`;
const ORN = `<svg viewBox="0 0 30 18" aria-hidden="true"><path d="M15 2 C19 7 19 11 15 16 C11 11 11 7 15 2Z" fill="currentColor"/><path d="M15 16 C9 15 5 12 3 8 C8 8 12 10 15 16Z M15 16 C21 15 25 12 27 8 C22 8 18 10 15 16Z" fill="currentColor" opacity=".7"/></svg>`;
const ornTitle = (title, sub = '') => `<div class="orn-title reveal"><h2>${title}</h2><div class="orn"></div>${sub ? `<p>${sub}</p>` : ''}</div>`;
const brandName = () => isSi() ? 'පිත්තල' : 'Pittala';
const brandSub = () => isSi() ? 'පිළිමතලාව පිත්තල පොළ' : 'Pilimathalawa Brass Bazaar';

const sealHTML = (lg = false) => `<div class="seal ${lg ? 'seal-lg' : ''}" aria-label="Sold out"><div class="seal-stamp">SOLD OUT<small>PILIMATHALAWA</small></div></div>`;
const SEAL = sealHTML();

const FALLBACK_IMG = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#EFEFEF"/><g fill="none" stroke="#B5B5B5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="120" y="140" width="160" height="120" rx="12"/><circle cx="170" cy="185" r="14"/><path d="M128 250l50-46 34 30 26-20 42 36"/></g><text x="200" y="300" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#9A9A9A">Photo unavailable</text></svg>');

document.addEventListener('error', e => {
  const t = e.target;
  if (t && t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = '1'; t.src = FALLBACK_IMG; }
}, true);

/* ----- toast & modal ----- */
function toast(msg, isErr = false) {
  let box = document.querySelector('.toasts');
  if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = 'toast' + (isErr ? ' err' : '');
  t.textContent = tr(msg);
  box.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}

function openModal({ title, body, foot = '', wide = false, onOpen }) {
  closeModal();
  const back = document.createElement('div');
  back.className = 'modal-back';
  back.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal-head"><h3>${esc(title)}</h3><button class="icon-btn" data-action="close-modal" aria-label="Close">${icon('x')}</button></div>
    <div class="modal-body">${body}</div>${foot ? `<div class="modal-foot">${foot}</div>` : ''}</div>`;
  back.addEventListener('click', e => { if (e.target === back) closeModal(); });
  document.body.appendChild(back);
  document.body.style.overflow = 'hidden';
  if (onOpen) onOpen(back);
  const f = back.querySelector('.modal-body input:not([type="checkbox"]):not([type="file"]), .modal-body select, .modal-body textarea');
  (f || back.querySelector('[data-action="close-modal"]')).focus({ preventScroll: true });
  return back;
}
function closeModal() { document.querySelectorAll('.modal-back').forEach(m => m.remove()); document.body.style.overflow = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ----- small pieces ----- */
const stars = r => { const f = Math.round(r); return `<span class="stars" aria-label="${r} out of 5">${'★'.repeat(f)}${'☆'.repeat(5 - f)}</span>`; };
const shopLogo = (shop, cls = 'shop-logo') => `<span class="${cls}" style="background:${esc(shop.color)}">${esc(initials(shop.name))}</span>`;
const statusPill = s => `<span class="status st-${s}">${esc(STATUS_LABEL[s] || SHOP_STATUS_LABEL[s] || s)}</span>`;

function countdownParts(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor(t % 86400 / 3600), m: Math.floor(t % 3600 / 60), s: t % 60 };
}
const pad = n => String(n).padStart(2, '0');
function countdownText(end) {
  const c = countdownParts(end - Date.now());
  if (end <= Date.now()) return tr('Deal ended');
  return (c.d ? `${c.d}d ` : '') + `${pad(c.h)}:${pad(c.m)}:${pad(c.s)}`;
}
const miniTimer = end => `<span class="mini-timer">${icon('clock')}<span data-countdown="${end}">${countdownText(end)}</span> left</span>`;
const bigTimer = end => `<div class="big-timer" data-bigtimer="${end}">${['d', 'h', 'm', 's'].map(k => `<div class="u"><b data-k="${k}">00</b><small>${{ d: 'days', h: 'hours', m: 'min', s: 'sec' }[k]}</small></div>`).join('')}</div>`;

function tickTimers() {
  document.querySelectorAll('[data-countdown]').forEach(el => { el.textContent = countdownText(+el.dataset.countdown); });
  document.querySelectorAll('[data-bigtimer]').forEach(el => {
    const c = countdownParts(+el.dataset.bigtimer - Date.now());
    el.querySelectorAll('[data-k]').forEach(b => { b.textContent = pad(c[b.dataset.k]); });
  });
}
setInterval(tickTimers, 1000);


const itemName = i => { const p = Store.product(i.productId); return p ? L(p, 'name') : i.name; };
/* ----- product card ----- */
function shipText(p) {
  const st = Store.s.settings;
  return Store.priceOf(p) >= st.freeDeliveryOver ? '<span class="ship free">Free delivery</span>' : `<span class="ship">+${money(st.deliveryOther)} delivery · Cash on delivery</span>`;
}
function feedbackPct(shop) { return shop.rating ? Math.min(100, 95 + (shop.rating - 4) * 5).toFixed(1) : null; }

function productCard(p, opts = {}) {
  const shop = Store.shop(p.shopId);
  const sold = Store.soldOut(p);
  const deal = Store.dealActive(p);
  const wished = Store.s.wishlist.includes(p.id);
  return `<article class="pcard ${sold ? 'is-sold' : ''}">
    <a class="pcard-media" href="#/product/${p.id}" aria-label="${esc(L(p, 'name'))}">
      <img src="${esc(p.images[0])}" alt="${esc(L(p, 'name'))}" loading="lazy">
      ${deal && !sold ? `<span class="deal-ribbon">−${p.discount}%</span>` : p.badge && !sold ? `<span class="tag-badge">${esc(p.badge)}</span>` : ''}
      ${sold ? SEAL : ''}
    </a>
    <button class="wish ${wished ? 'on' : ''}" data-action="wish" data-id="${p.id}" aria-label="${wished ? 'Remove from' : 'Add to'} watchlist" aria-pressed="${wished}">${icon('heart')}</button>
    ${sold ? '' : `<button class="btn btn-brass btn-sm quick-add" data-action="add" data-id="${p.id}">${icon('cart')} Add to cart</button>`}
    <div class="pcard-body">
      <h3><a href="#/product/${p.id}">${esc(L(p, 'name'))}</a></h3>
      <div class="price"><b>${money(Store.priceOf(p))}</b>${deal ? `<s>${money(p.price)}</s><span class="off">${p.discount}% off</span>` : ''}</div>
      ${Store.isFlash(p) && !sold ? miniTimer(p.dealEnds) : ''}
      ${sold ? '<span class="sold-line hot">Sold out</span>' : shipText(p)}
      ${!sold && p.stock <= 3 ? `<span class="low-stock">Only ${p.stock} left</span>` : p.sold >= 40 ? `<span class="sold-line hot">${p.sold} sold</span>` : p.sold ? `<span class="sold-line">${p.sold} sold</span>` : ''}
      ${opts.hideShop ? '' : `<a class="pcard-shop" href="#/store/${shop.id}">${esc(L(shop, 'name'))}${shop.rating ? ` · ${feedbackPct(shop)}% positive` : ''}</a>`}
    </div>
  </article>`;
}

function listRow(p) {
  const shop = Store.shop(p.shopId);
  const sold = Store.soldOut(p);
  const deal = Store.dealActive(p);
  return `<article class="lrow ${sold ? 'is-sold' : ''} pcard">
    <a class="pcard-media" href="#/product/${p.id}"><img src="${esc(p.images[0])}" alt="${esc(L(p, 'name'))}" loading="lazy">${sold ? SEAL : ''}</a>
    <div>
      <h3><a href="#/product/${p.id}">${esc(L(p, 'name'))}</a></h3>
      <span class="muted" style="font-size:.85rem">${esc(L(Store.cat(p.category), 'name'))} · ${esc(p.finish)}</span>
      <div class="price"><b>${money(Store.priceOf(p))}</b>${deal ? `<s>${money(p.price)}</s><span class="off">${p.discount}% off</span>` : ''}</div>
      <div class="meta">
        ${Store.isFlash(p) && !sold ? `<span>${miniTimer(p.dealEnds)}</span>` : ''}
        <span>${sold ? '<b style="color:var(--sale)">Sold out</b>' : shipText(p)}</span>
        <span>${p.sold} sold · <span class="rating">${stars(p.rating)} (${p.reviews})</span></span>
        <span>Seller: <a class="link" href="#/store/${shop.id}">${esc(L(shop, 'name'))}</a>${shop.rating ? ` (${feedbackPct(shop)}% positive)` : ''} · Pilimathalawa, Kandy</span>
      </div>
      <div class="row-actions" style="margin-top:10px">${sold ? `<button class="btn btn-ghost btn-sm" data-action="notify" data-id="${p.id}">Notify me when back</button>` : `<button class="btn btn-brass btn-sm" data-action="add" data-id="${p.id}">Add to cart</button>`}
        <button class="btn btn-ghost btn-sm" data-action="wish" data-id="${p.id}">${icon('heart')} ${Store.s.wishlist.includes(p.id) ? 'Watching' : 'Watch'}</button></div>
    </div>
  </article>`;
}

/* ----- header / footer ----- */
function renderHeader(route) {
  const u = Store.user();
  const { q } = App.parse();
  const deals = Store.liveProducts().filter(p => Store.isFlash(p) && !Store.soldOut(p)).length;
  const cat = route === '/shop' ? (q.cat || '') : '';
  const greet = u ? `Hi <b>${esc(u.name.split(' ')[0])}</b>! <a class="link" href="#" data-action="logout">Sign out</a>` : `Hi! <a class="link" href="#/login">Sign in</a> or buy as a guest`;
  return `
  <div class="topbar"><div class="wrap">
    <span>${greet}</span>
    <a href="#/deals" class="deal-pill">Daily Deals${deals ? ` (${deals})` : ''}</a>
    <a href="#/stores" class="hide-md">Shops</a>
    <a href="#/track" class="hide-md">Track order</a>
    <span class="sp"></span>
    <a href="#/sell">Sell on Pittala</a>
    <a href="#/about" class="hide-md">About Pilimathalawa brass</a>
    <span class="lang-toggle" role="group" aria-label="Language"><button data-action="lang" data-l="si" class="${isSi() ? 'on' : ''}" data-notr>සිංහල</button><button data-action="lang" data-l="en" class="${isSi() ? '' : 'on'}" data-notr>English</button></span>
  </div></div>
  <header class="site-header">
    <div class="wrap head-main">
      <a class="logo" href="#/" aria-label="Pittala.lk home">${LOGO_MARK}<span class="logo-text" data-notr>${brandName()}<small>${brandSub()}</small></span></a>
      <button class="cat-btn" data-action="mega" aria-expanded="false">Shop by category ${icon('menu')}</button>
      <form class="search" id="searchForm" role="search">
        <div class="search-box">${icon('search')}<input type="search" id="q" placeholder="Search for pahana, karaduwa, Buddha statue…" autocomplete="off" aria-label="Search"></div>
        <select id="qcat" aria-label="Category"><option value="">All categories</option>${liveCategories().map(c => `<option value="${c.id}" ${cat === c.id ? 'selected' : ''}>${esc(L(c, 'name'))}</option>`).join('')}</select>
        <button class="search-go">Search</button>
        <div class="search-suggest hide" id="suggest"></div>
      </form>
      <div class="header-actions">
        <button class="icon-btn lang-mini" data-action="lang" data-l="${isSi() ? 'en' : 'si'}" aria-label="Change language" data-notr style="font-weight:700;font-size:.8rem;width:auto;padding:0 8px;border-radius:14px">${isSi() ? 'EN' : 'සිං'}</button>
        <a class="icon-btn" href="#/wishlist" aria-label="Watchlist">${icon('heart')}${Store.s.wishlist.length ? `<span class="count">${Store.s.wishlist.length}</span>` : ''}</a>
        <a class="icon-btn" href="#/cart" aria-label="Cart">${icon('cart')}${Store.cartCount() ? `<span class="count">${Store.cartCount()}</span>` : ''}</a>
        ${u ? (u.role === 'customer' ? `<a class="btn btn-ghost btn-sm" href="#/dashboard/orders">${icon('user')} <span class="lbl">My orders</span></a>` : `<a class="btn btn-brass btn-sm" href="#/dashboard">${icon('grid')} <span class="lbl">Dashboard</span></a>`) : ''}
      </div>
    </div>
    <nav class="catbar" aria-label="Categories"><div class="wrap">
      <a href="#/" class="${route === '/' ? 'on' : ''}">Home</a>
      ${liveCategories().map(c => `<a href="#/shop?cat=${c.id}" class="${cat === c.id ? 'on' : ''}">${esc(L(c, 'name'))}</a>`).join('')}
      <a href="#/deals" class="deal ${route === '/deals' ? 'on' : ''}">Deals</a>
      <a href="#/stores" class="${route.startsWith('/store') ? 'on' : ''}">Shops</a>
    </div></nav>
    <div class="mega hide" id="mega"><div class="wrap">
      ${liveCategories().map(c => `<a href="#/shop?cat=${c.id}"><img src="${esc(c.img)}" alt=""><span><b>${esc(L(c, 'name'))}</b><small>${c.count} ${c.count === 1 ? 'item' : 'items'}</small></span></a>`).join('')}
      <a href="#/deals"><span><b>Daily deals</b><small>Discounts with timers</small></span></a>
    </div></div>
  </header>`;
}

function renderMobileNav(route) {
  const u = Store.user();
  const items = [['#/', 'home', 'Home', route === '/'], ['#/shop', 'grid', 'Shop', route === '/shop'], ['#/deals', 'bolt', 'Deals', route === '/deals'], ['#/cart', 'cart', 'Cart', route === '/cart' || route === '/checkout'], [u ? (u.role === 'customer' ? '#/dashboard/orders' : '#/dashboard') : '#/login', 'user', u ? 'Account' : 'Sign in', route === '/dashboard' || route === '/login']];
  return `<nav class="mnav" aria-label="Main">${items.map(([h, i, l, on]) => `<a href="${h}" class="${on ? 'on' : ''}">${icon(i)}${i === 'cart' && Store.cartCount() ? `<span class="count">${Store.cartCount()}</span>` : ''}<span>${l}</span></a>`).join('')}</nav>`;
}

function renderFooter() {
  const st = Store.s.settings;
  return `<footer class="site-footer"><div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href="#/">${LOGO_MARK}<span class="logo-text" data-notr>${brandName()}<small>${brandSub()}</small></span></a>
        <p style="margin-top:12px;max-width:40ch">The online marketplace of the brass workshops of Pilimathalawa, Kandy. Every order goes straight to the family that made it.</p>
        <div class="pay-badges"><span>Cash on delivery</span><span>Islandwide delivery</span><span>Verified sellers</span></div>
      </div>
      <div><h4>Shop</h4>${liveCategories().map(c => `<a href="#/shop?cat=${c.id}">${esc(L(c, 'name'))}</a>`).join('')}</div>
      <div><h4>Buy</h4><a href="#/deals">Daily deals</a><a href="#/stores">All shops</a><a href="#/track">Track an order</a><a href="#/wishlist">Watchlist</a><a href="#/login">Sign in</a></div>
      <div><h4>Sell</h4><a href="#/sell">Sell on Pittala</a><a href="#/register">Register your shop</a><a href="#/login">Seller sign in</a><h4 style="margin-top:14px">Contact</h4><a href="mailto:${esc(st.supportEmail)}">${esc(st.supportEmail)}</a><a href="tel:${esc(st.supportPhone)}">${esc(st.supportPhone)}</a></div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} Pittala.lk — Pilimathalawa, Kandy, Sri Lanka</span><span>Photos and videos: Sri Lankan creators on Pexels and Pixabay · <a href="#" data-action="reset-demo" style="display:inline">Reset demo data</a></span></div>
  </div></footer>`;
}

/* Image resize helper for uploads (keeps browser storage small) */
function fileToDataURL(file, max = 900) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = r.result;
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
