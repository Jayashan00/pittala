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
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

const LOGO_MARK = `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
  <defs><linearGradient id="lg-b" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F4DE9C"/><stop offset=".5" stop-color="#C9A34E"/><stop offset="1" stop-color="#8C6A24"/></linearGradient></defs>
  <path d="M20 4c2.6 3.3 3.6 5.6 3.6 7.4A3.6 3.6 0 0 1 20 15a3.6 3.6 0 0 1-3.6-3.6C16.4 9.6 17.4 7.3 20 4z" fill="#A3301F"/>
  <path d="M7 19h26c-1.2 5.3-6.4 9-13 9S8.2 24.3 7 19z" fill="url(#lg-b)"/>
  <path d="M5 18.2h30" stroke="url(#lg-b)" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M17 28h6l1.5 5h-9z" fill="url(#lg-b)"/><rect x="12" y="33" width="16" height="3" rx="1.5" fill="url(#lg-b)"/>
</svg>`;

const SEAL = `<svg viewBox="0 0 200 200" aria-label="Sold out" role="img">
  <defs><path id="sealc" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0"/></defs>
  <circle cx="100" cy="100" r="94" fill="rgba(163,48,31,.92)"/>
  <circle cx="100" cy="100" r="86" fill="none" stroke="#F6E1DC" stroke-width="2"/>
  <circle cx="100" cy="100" r="58" fill="none" stroke="#F6E1DC" stroke-width="1.5" stroke-dasharray="3 4"/>
  <text font-family="Manrope, sans-serif" font-size="13" font-weight="800" fill="#F6E1DC" letter-spacing="3"><textPath href="#sealc">PILIMATHALAWA ✦ PITTALA.LK ✦ HANDMADE ✦ </textPath></text>
  <text x="100" y="96" text-anchor="middle" font-family="Marcellus, serif" font-size="30" fill="#fff">Sold</text>
  <text x="100" y="126" text-anchor="middle" font-family="Marcellus, serif" font-size="30" fill="#fff">out</text>
</svg>`;

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#24514A"/><stop offset="1" stop-color="#0E2421"/></linearGradient><linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#F4DE9C"/><stop offset="1" stop-color="#8C6A24"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><path d="M200 170c14 18 20 30 20 40a20 20 0 0 1-40 0c0-10 6-22 20-40z" fill="#A3301F"/><path d="M120 250h160c-7 32-38 54-80 54s-73-22-80-54z" fill="url(#b)"/><rect x="185" y="300" width="30" height="40" fill="url(#b)"/><rect x="160" y="338" width="80" height="12" rx="6" fill="url(#b)"/></svg>`);

// Any broken remote image gets a brass placeholder instead of an empty box
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
  t.textContent = msg;
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
  if (end <= Date.now()) return 'Deal ended';
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

/* ----- product card ----- */
function productCard(p, opts = {}) {
  const shop = Store.shop(p.shopId);
  const sold = Store.soldOut(p);
  const deal = Store.dealActive(p);
  const wished = Store.s.wishlist.includes(p.id);
  return `<article class="pcard ${sold ? 'is-sold' : ''}">
    <a class="pcard-media" href="#/product/${p.id}" aria-label="${esc(p.name)}">
      <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy">
      ${deal && !sold ? `<span class="tag-deal">−${p.discount}%</span>` : ''}
      ${p.badge && !sold ? `<span class="tag-badge">${esc(p.badge)}</span>` : ''}
      ${sold ? `<div class="seal">${SEAL}</div>` : ''}
    </a>
    <button class="wish ${wished ? 'on' : ''}" data-action="wish" data-id="${p.id}" aria-label="${wished ? 'Remove from' : 'Save to'} wishlist" aria-pressed="${wished}">${icon('heart')}</button>
    <div class="pcard-body">
      ${opts.hideShop ? '' : `<a class="pcard-shop" href="#/store/${shop.id}">${esc(shop.name)}</a>`}
      <h3><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
      <span class="rating">${stars(p.rating)} <span>(${p.reviews})</span></span>
      <div class="price"><b>${money(Store.priceOf(p))}</b>${deal ? `<s>${money(p.price)}</s>` : ''}</div>
      ${Store.isFlash(p) && !sold ? miniTimer(p.dealEnds) : ''}
      ${!sold && p.stock <= 3 ? `<span class="low-stock">Only ${p.stock} left</span>` : ''}
      <div class="pcard-foot">
        ${sold ? `<button class="btn btn-ghost btn-sm btn-block" data-action="notify" data-id="${p.id}">Notify me when back</button>`
               : `<button class="btn btn-dark btn-sm btn-block" data-action="add" data-id="${p.id}">${icon('cart')} Add to cart</button>`}
      </div>
    </div>
  </article>`;
}

/* ----- header / footer ----- */
function renderHeader(route) {
  const u = Store.user();
  const deals = Store.liveProducts().filter(p => Store.isFlash(p) && !Store.soldOut(p));
  const soonest = deals.sort((a, b) => a.dealEnds - b.dealEnds)[0];
  const nav = [['#/shop', 'Shop'], ['#/deals', 'Deals'], ['#/stores', 'Shops'], ['#/craft', 'Our craft'], ['#/sell', 'Sell with us'], ['#/track', 'Track order']];
  return `
  ${soonest ? `<div class="announce"><div class="wrap"><span>${icon('bolt')}</span><span>Flash deals end in <b data-countdown="${soonest.dealEnds}">${countdownText(soonest.dealEnds)}</b></span><span class="hide-sm">Cash on delivery islandwide</span><a href="#/deals">See all deals</a></div></div>` : ''}
  <header class="site-header">
    <div class="wrap">
      <button class="icon-btn menu-btn" data-action="menu" aria-label="Menu">${icon('menu')}</button>
      <a class="logo" href="#/" aria-label="Pittala.lk home">${LOGO_MARK}<span class="logo-text">Pittala<small>Pilimathalawa brass, online</small></span></a>
      <nav class="main-nav" id="mainNav">
        ${nav.map(([h, l]) => `<a href="${h}" class="${route.startsWith(h.slice(1)) ? 'active' : ''} ${l === 'Deals' ? 'deal-link' : ''}">${l}</a>`).join('')}
      </nav>
      <div class="search">${icon('search')}<input type="search" id="q" placeholder="Search lamps, statues, shops…" autocomplete="off" aria-label="Search products"><div class="search-suggest hide" id="suggest"></div></div>
      <div class="header-actions">
        <a class="icon-btn" href="#/wishlist" aria-label="Wishlist">${icon('heart')}${Store.s.wishlist.length ? `<span class="count">${Store.s.wishlist.length}</span>` : ''}</a>
        <a class="icon-btn" href="#/cart" aria-label="Cart">${icon('cart')}${Store.cartCount() ? `<span class="count">${Store.cartCount()}</span>` : ''}</a>
        ${u ? (u.role === 'customer' ? `<a class="btn btn-dark btn-sm" href="#/dashboard/orders" aria-label="My orders">${icon('user')} <span class="lbl">My orders</span></a>` : `<a class="btn btn-dark btn-sm" href="#/dashboard">${icon('grid')} <span class="lbl">Dashboard</span></a>`) : `<a class="btn btn-brass btn-sm" href="#/login" aria-label="Sign in">${icon('user')} <span class="lbl">Sign in</span></a>`}
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  const st = Store.s.settings;
  return `<footer class="site-footer"><div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href="#/">${LOGO_MARK}<span class="logo-text" style="color:#F1EBD8">Pittala</span></a>
        <p style="margin-top:14px;max-width:38ch">A marketplace for the brass workshops of Pilimathalawa, Kandy. Every order goes straight to the family that made it. Pay in cash when it reaches your door.</p>
        <p class="si" style="color:var(--brass-light);font-size:1.1rem">පිළිමතලාව පිත්තල</p>
      </div>
      <div><h4>Shop</h4>${CATEGORIES.slice(0, 6).map(c => `<a href="#/shop?cat=${c.id}">${c.name}</a>`).join('')}</div>
      <div><h4>Marketplace</h4><a href="#/stores">All shops</a><a href="#/deals">Deals & flash sales</a><a href="#/craft">The craft</a><a href="#/track">Track an order</a><a href="#/wishlist">Wishlist</a></div>
      <div><h4>For artisans</h4><a href="#/sell">Sell with us</a><a href="#/register">Register your shop</a><a href="#/login">Seller sign in</a><a href="mailto:${st.supportEmail}">${st.supportEmail}</a><a href="tel:${st.supportPhone}">${st.supportPhone}</a></div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} Pittala.lk · Pilimathalawa, Kandy, Sri Lanka</span><span>Photos: Pexels contributors · <a href="#" data-action="reset-demo" style="display:inline">Reset demo data</a></span></div>
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
