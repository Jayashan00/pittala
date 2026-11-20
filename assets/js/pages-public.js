/* Public storefront pages */
const Pages = {};
let mountQueue = [];
let cleanups = [];
const onMount = fn => mountQueue.push(fn);
const onCleanup = fn => cleanups.push(fn);

function shopBadges(shop) {
  const b = [];
  if (Store.isAgentShop(shop)) b.push(['gold', 'Region agent']);
  if (shop.rating >= 4.8) b.push(['green', 'Top rated']);
  if (shop.artisans >= 10) b.push(['', `${shop.artisans} artisans`]);
  if (shop.est && shop.est < 1990) b.push(['amber', `Since ${shop.est}`]);
  const deals = Store.liveProducts().filter(p => p.shopId === shop.id && Store.dealActive(p)).length;
  if (deals) b.push(['red', `${deals} deal${deals > 1 ? 's' : ''} on`]);
  return b;
}
const badgeRow = shop => `<div class="badges">${shopBadges(shop).map(([c, t]) => `<span class="badge ${c}">${esc(t)}</span>`).join('')}</div>`;

/* =================== HOME =================== */
Pages.home = () => {
  const prods = Store.liveProducts();
  const deals = prods.filter(p => Store.isFlash(p) && !Store.soldOut(p)).sort((a, b) => a.dealEnds - b.dealEnds);
  const trending = [...prods].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const spotlight = prods.filter(p => p.spotlight).slice(0, 2);
  const board = Store.publishedShops().map(s => ({ s, st: Store.shopStats(s.id, 30) })).sort((a, b) => b.st.revenue - a.st.revenue);
  const maxRev = Math.max(1, ...board.map(b => b.st.revenue));
  const st = Store.s.settings;
  const totalSold = prods.reduce((a, p) => a + p.sold, 0);

  onMount(mountHeroFilm);

  return `
  <section class="hero" aria-label="Pilimathalawa brass">
    <div class="hero-film" id="heroFilm">
      ${HERO_FILM.map((f, i) => `<div class="frame ${i === 0 ? 'on' : ''}">${f.video ? `<video src="${esc(f.video)}" muted playsinline loop poster="${esc(f.img)}"></video>` : `<img src="${esc(f.img)}" alt="" ${i ? 'loading="lazy"' : ''}>`}</div>`).join('')}
    </div>
    <div class="wrap">
      <div class="hero-si" aria-hidden="true">පිළිමතලාව</div>
      <h1>Brass from the village that lights Kandy’s temples</h1>
      <p class="hero-lede">For generations, the workshops of Pilimathalawa have cast the pahana, bells and statues found in homes and devales across Sri Lanka. Buy straight from the families who make them, and pay in cash when your piece arrives.</p>
      <div class="hero-cta">
        <a class="btn btn-brass" href="#/shop">Browse the collection</a>
        <a class="btn btn-ghost" href="#/deals">${icon('bolt')} Today’s deals</a>
      </div>
    </div>
    <div class="hero-chapters"><div class="wrap">
      ${HERO_FILM.map((f, i) => `<button class="chapter ${i === 0 ? 'on' : ''}" data-chapter="${i}"><div class="bar"><i></i></div><strong>${esc(f.title)}</strong><span>${esc(f.sub)}</span></button>`).join('')}
      <button class="hero-pause" id="heroPause" aria-label="Pause film">${icon('pause')}</button>
    </div></div>
  </section>

  <section class="block" style="padding-bottom:36px">
    <div class="wrap">
      <div class="sec-head"><div><h2>Shop by craft</h2><p>Eight traditions, each made by specialists in the village.</p></div><a class="link-more" href="#/shop">All products</a></div>
      <div class="cat-rail">
        ${CATEGORIES.map(c => `<a class="cat" href="#/shop?cat=${c.id}"><div class="ring"><img src="${esc(c.img)}" alt="" loading="lazy"></div><b>${esc(c.name)}</b><small class="si">${esc(c.si)}</small></a>`).join('')}
      </div>
    </div>
  </section>

  ${deals.length ? `<section class="block deals-band">
    <div class="wrap">
      <div class="sec-head">
        <div><h2>Flash deals</h2><p>Shops are competing for your order. Prices go back up when the clock runs out.</p></div>
        <div>${bigTimer(deals[0].dealEnds)}</div>
      </div>
      <div class="hscroll">${deals.map(p => productCard(p)).join('')}</div>
      <p style="margin-top:18px"><a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.4)" href="#/deals">All deals and coupons</a></p>
    </div>
  </section>` : ''}

  <section class="block">
    <div class="wrap">
      <div class="sec-head"><div><h2>What people are buying</h2><p>Most-ordered pieces this month. Some sell out quickly, so save the ones you like.</p></div><a class="link-more" href="#/shop?sort=popular">See more</a></div>
      <div class="grid">${trending.map(p => productCard(p)).join('')}</div>
    </div>
  </section>

  <section class="block craft">
    <div class="wrap craft-grid">
      <figure class="craft-img" style="margin:0"><img src="${P.artisan}" alt="An artisan finishing a cast brass figure" loading="lazy"><figcaption>Every piece on Pittala is finished by hand. Shops list who made it and how long it took.</figcaption></figure>
      <div>
        <div class="vine" style="margin-bottom:18px"></div>
        <h2>How a Pilimathalawa lamp is made</h2>
        <p style="margin-top:12px;color:#B9C6BF">The village sits on the old road between Kandy and the lowlands. Its brass workers supplied the temples and households of the hill country, and many workshops still use the same moulds, tools and patterns.</p>
        <ol class="steps">
          <li><div><b>Moulding</b><p>A wax or wooden pattern is pressed into clay and sand to make the mould.</p></div></li>
          <li><div><b>Casting</b><p>Molten brass, an alloy of copper and zinc, is poured in by hand and left to cool.</p></div></li>
          <li><div><b>Chasing</b><p>Artisans hammer in liyawela vines, lotus petals and hamsa birds with small punches.</p></div></li>
          <li><div><b>Polishing</b><p>The piece is filed, buffed on a wheel and polished to its golden shine.</p></div></li>
        </ol>
        <div class="craft-stats">
          <div><b>${Store.publishedShops().length}</b><span>workshops online</span></div>
          <div><b>${Store.publishedShops().reduce((a, s) => a + (s.artisans || 0), 0)}</b><span>artisans earning</span></div>
          <div><b>${totalSold.toLocaleString()}</b><span>pieces sold</span></div>
        </div>
        <p style="margin-top:26px"><a class="btn btn-brass" href="#/craft">Read the full story</a></p>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head"><div><h2>Shops competing this month</h2><p>Ranked by sales over the last 30 days. Better prices, deals and photos move shops up the board.</p></div><a class="link-more" href="#/stores">All shops</a></div>
      <div class="board">
        <div class="board-row head"><span>Rank</span><span>Shop</span><span>Sales, 30 days</span><span>Orders</span><span>Rating</span><span></span></div>
        ${board.map((b, i) => `<div class="board-row">
          <span class="rank">${i + 1}</span>
          <a class="shop-chip" href="#/store/${b.s.id}">${shopLogo(b.s)}<span><b>${esc(b.s.name)}</b><br><small class="muted">${esc(b.s.tagline)}</small></span></a>
          <div><b>${moneyShort(b.st.revenue)}</b><div class="bar-mini"><i style="width:${Math.round(b.st.revenue / maxRev * 100)}%"></i></div></div>
          <span>${b.st.orders}</span>
          <span class="rating">${stars(b.s.rating)} ${b.s.rating}</span>
          <a class="btn btn-ghost btn-sm" href="#/store/${b.s.id}">Visit shop</a>
        </div>`).join('')}
      </div>
    </div>
  </section>

  ${spotlight.length ? `<section class="block" style="padding-top:0">
    <div class="wrap">
      <div class="sec-head"><div><h2>In the spotlight</h2><p>Pieces their shops have chosen to promote this week.</p></div></div>
      <div class="dash-grid even">${spotlight.map(p => { const s = Store.shop(p.shopId); return `
        <a href="#/product/${p.id}" class="store-hero" style="--shop-c:${esc(s.color)};border-radius:18px;min-height:340px">
          <img src="${esc(p.images[0])}" alt="" loading="lazy">
          <div class="wrap" style="padding:24px"><div><span class="badge gold">${esc(s.name)}</span><h2 style="margin-top:10px;color:#fff">${esc(p.name)}</h2>
          <div class="price" style="color:#fff"><b>${money(Store.priceOf(p))}</b>${Store.dealActive(p) ? `<s style="color:#ddd">${money(p.price)}</s>` : ''}</div></div></div>
        </a>`; }).join('')}</div>
    </div>
  </section>` : ''}

  <section class="block" style="background:var(--surface-2)">
    <div class="wrap sell">
      <div>
        <h2>Run a brass workshop in Pilimathalawa?</h2>
        <p style="margin:14px 0 0;color:var(--ink-2)">Open your own shop page, list your pieces with photos, run deals with countdown timers and take cash-on-delivery orders from anywhere in Sri Lanka. You only pay when you sell.</p>
        <div class="pipeline">
          <div class="pipe done"><b>Apply</b><span>Sign the agreement online</span></div>
          <div class="pipe done"><b>Pay & verify</b><span>Region agent confirms</span></div>
          <div class="pipe done"><b>Final check</b><span>Platform approves</span></div>
          <div class="pipe current"><b>Go live</b><span>Start selling</span></div>
        </div>
        <a class="btn btn-dark" href="#/register">Register your shop</a> <a class="btn btn-ghost" href="#/sell">How it works</a>
      </div>
      ${commissionVisual(st)}
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head"><div><h2>From buyers</h2></div></div>
      <div class="quotes">
        ${Store.s.reviews.slice(0, 3).map(r => { const p = Store.product(r.productId); return `<blockquote class="quote" style="margin:0"><p>“${esc(r.text)}”</p><footer>${stars(r.rating)} ${esc(r.name)} bought <a href="#/product/${p.id}" style="text-decoration:underline">${esc(p.name)}</a></footer></blockquote>`; }).join('')}
      </div>
    </div>
  </section>`;
};

function commissionVisual(st) {
  const total = st.platformRate + st.agentRate;
  const sale = 10000;
  return `<div class="split-visual">
    <h3>Where a Rs. 10,000 sale goes</h3>
    <div class="split-bar">
      <div style="width:${100 - total}%;background:var(--patina-700);color:#fff">Shop keeps ${100 - total}%</div>
      <div style="width:${Math.max(st.agentRate, 8)}%;background:var(--brass);color:#2A1E05">${st.agentRate}%</div>
      <div style="width:${Math.max(st.platformRate, 5)}%;background:var(--lacquer);color:#fff">${st.platformRate}%</div>
    </div>
    <div class="split-legend">
      <div><span>Shop owner</span><b>${money(sale * (100 - total) / 100)}</b></div>
      <div><span>Region agent (Pilimathalawa)</span><b>${money(sale * st.agentRate / 100)}</b></div>
      <div><span>Pittala.lk platform</span><b>${money(sale * st.platformRate / 100)}</b></div>
    </div>
    <p class="muted" style="font-size:.85rem;margin:12px 0 0">Total commission ${total}%, charged only on delivered orders. The region agent’s own shop pays the ${st.platformRate}% platform share only. One-time registration fee ${money(st.regFee)}.</p>
  </div>`;
}

function mountHeroFilm() {
  const root = document.getElementById('heroFilm');
  if (!root) return;
  const frames = [...root.querySelectorAll('.frame')];
  const chapters = [...document.querySelectorAll('.chapter')];
  const DUR = 7000;
  let i = 0, timer = null, paused = false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const show = n => {
    i = (n + frames.length) % frames.length;
    frames.forEach((f, k) => {
      f.classList.toggle('on', k === i);
      const v = f.querySelector('video'); if (v) { k === i ? v.play().catch(() => {}) : v.pause(); }
      const img = f.querySelector('img'); if (img && k === i) { img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; }
    });
    chapters.forEach((c, k) => {
      c.classList.remove('on', 'done');
      const bar = c.querySelector('i'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      if (k < i) c.classList.add('done');
      if (k === i) { c.classList.add('on'); c.style.setProperty('--dur', DUR + 'ms'); c.querySelector('i').style.animationPlayState = paused ? 'paused' : 'running'; }
    });
    clearTimeout(timer);
    if (!paused && !reduce) timer = setTimeout(() => show(i + 1), DUR);
  };
  chapters.forEach((c, k) => c.addEventListener('click', () => show(k)));
  const pb = document.getElementById('heroPause');
  pb && pb.addEventListener('click', () => {
    paused = !paused;
    pb.innerHTML = icon(paused ? 'play' : 'pause');
    pb.setAttribute('aria-label', paused ? 'Play film' : 'Pause film');
    show(i);
  });
  if (reduce) paused = true;
  show(0);
  onCleanup(() => clearTimeout(timer));
}

/* =================== SHOP / CATALOGUE =================== */
Pages.shop = (q) => {
  const all = Store.liveProducts();
  const cat = q.cat || '';
  const sort = q.sort || 'featured';
  const term = (q.q || '').toLowerCase();
  const shopsSel = (q.shops || '').split(',').filter(Boolean);
  let list = all.filter(p => (!cat || p.category === cat)
    && (!term || (p.name + ' ' + p.description + ' ' + Store.shop(p.shopId).name).toLowerCase().includes(term))
    && (!shopsSel.length || shopsSel.includes(p.shopId))
    && (!q.deals || Store.dealActive(p))
    && (!q.instock || !Store.soldOut(p))
    && (!q.min || Store.priceOf(p) >= +q.min)
    && (!q.max || Store.priceOf(p) <= +q.max));
  const sorters = {
    featured: (a, b) => (Store.soldOut(a) - Store.soldOut(b)) || (b.spotlight - a.spotlight) || (b.sold - a.sold),
    popular: (a, b) => b.sold - a.sold,
    low: (a, b) => Store.priceOf(a) - Store.priceOf(b),
    high: (a, b) => Store.priceOf(b) - Store.priceOf(a),
    discount: (a, b) => (Store.dealActive(b) ? b.discount : 0) - (Store.dealActive(a) ? a.discount : 0),
    new: (a, b) => b.createdAt - a.createdAt,
    rating: (a, b) => b.rating - a.rating
  };
  list.sort(sorters[sort] || sorters.featured);
  const c = cat ? Store.cat(cat) : null;
  const link = patch => '#/shop?' + new URLSearchParams(Object.fromEntries(Object.entries({ ...q, ...patch }).filter(([, v]) => v !== '' && v != null))).toString();

  onMount(() => {
    const f = document.getElementById('filterForm');
    if (!f) return;
    f.addEventListener('change', () => {
      const fd = new FormData(f);
      const next = { cat, sort, q: q.q || '', shops: fd.getAll('shop').join(','), deals: fd.get('deals') ? '1' : '', instock: fd.get('instock') ? '1' : '', min: fd.get('min') || '', max: fd.get('max') || '' };
      location.hash = link(next).slice(1) ? link(next) : '#/shop';
    });
  });

  return `<div class="wrap">
    <div class="page-head">
      <div class="crumbs"><a href="#/">Home</a> / ${c ? `<a href="#/shop">Shop</a> / ${esc(c.name)}` : 'Shop'}</div>
      <h1 style="font-size:clamp(2rem,4vw,3rem)">${c ? esc(c.name) : term ? `Results for “${esc(q.q)}”` : 'All Pilimathalawa brass'}</h1>
      <p class="muted" style="margin-top:6px">${list.length} piece${list.length === 1 ? '' : 's'} from ${new Set(list.map(p => p.shopId)).size} shops</p>
    </div>
    <div class="toolbar">
      <div class="chips">
        <a class="chip ${!cat ? 'on' : ''}" href="${link({ cat: '' })}">All</a>
        ${CATEGORIES.map(x => `<a class="chip ${cat === x.id ? 'on' : ''}" href="${link({ cat: x.id })}">${esc(x.name)}</a>`).join('')}
      </div>
      <select class="input" style="width:auto" onchange="location.hash='${link({ sort: '' }).replace(/'/g, "\\'")}&sort='+this.value" aria-label="Sort">
        ${[['featured', 'Featured'], ['popular', 'Most popular'], ['discount', 'Biggest discount'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['new', 'Newest'], ['rating', 'Top rated']].map(([v, l]) => `<option value="${v}" ${sort === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>
    <div class="shop-layout">
      <form class="filters" id="filterForm" onsubmit="return false">
        <div><h4>Offers</h4>
          <label class="chk"><input type="checkbox" name="deals" ${q.deals ? 'checked' : ''}> On discount</label>
          <label class="chk"><input type="checkbox" name="instock" ${q.instock ? 'checked' : ''}> Hide sold out</label>
        </div>
        <div><h4>Price (Rs.)</h4>
          <div style="display:flex;gap:8px"><input class="input" name="min" type="number" min="0" placeholder="Min" value="${esc(q.min || '')}"><input class="input" name="max" type="number" min="0" placeholder="Max" value="${esc(q.max || '')}"></div>
        </div>
        <div><h4>Shops</h4>
          ${Store.publishedShops().map(s => `<label class="chk"><input type="checkbox" name="shop" value="${s.id}" ${shopsSel.includes(s.id) ? 'checked' : ''}> ${esc(s.name)}</label>`).join('')}
        </div>
        <a class="btn btn-ghost btn-sm" href="#/shop">Clear filters</a>
      </form>
      <div>${list.length ? `<div class="grid">${list.map(p => productCard(p)).join('')}</div>` : `<div class="empty card"><h3>Nothing matches those filters</h3><p>Try removing a filter or searching a different word, such as “pahana” or “bell”.</p><a class="btn btn-dark" href="#/shop">Show all products</a></div>`}</div>
    </div>
  </div>`;
};

/* =================== PRODUCT =================== */
Pages.product = (q, id) => {
  const p = Store.product(id);
  if (!p || !p.active) return Pages.notFound();
  const shop = Store.shop(p.shopId);
  if (shop.status !== 'published') return Pages.notFound();
  p.views++;
  Store.s.recent = [p.id, ...Store.s.recent.filter(x => x !== p.id)].slice(0, 12);
  Store.save();
  const sold = Store.soldOut(p);
  const deal = Store.dealActive(p);
  const price = Store.priceOf(p);
  const reviews = Store.s.reviews.filter(r => r.productId === p.id);
  const rivals = Store.liveProducts().filter(x => x.category === p.category && x.shopId !== p.shopId);
  const compare = [p, ...rivals].sort((a, b) => Store.priceOf(a) - Store.priceOf(b));
  const more = Store.liveProducts().filter(x => x.shopId === p.shopId && x.id !== p.id).slice(0, 4);
  const recent = Store.s.recent.filter(x => x !== p.id).map(x => Store.product(x)).filter(Boolean).slice(0, 4);
  const shareText = `Look at this ${p.name} from ${shop.name} on Pittala.lk: ${location.href}`;

  onMount(() => {
    const main = document.getElementById('gMain');
    document.querySelectorAll('[data-thumb]').forEach(b => b.addEventListener('click', () => {
      main.querySelector('img').src = b.dataset.thumb;
      document.querySelectorAll('[data-thumb]').forEach(x => x.classList.toggle('on', x === b));
    }));
    main && main.addEventListener('click', () => main.classList.toggle('zoom'));
    main && main.addEventListener('mousemove', e => {
      if (!main.classList.contains('zoom')) return;
      const r = main.getBoundingClientRect();
      main.querySelector('img').style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
    });
    const qty = document.getElementById('qty');
    document.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => { qty.value = Math.min(p.stock, Math.max(1, +qty.value + +b.dataset.q)); }));
    const rf = document.getElementById('reviewForm');
    rf && rf.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(rf);
      if (!fd.get('name') || !fd.get('text')) { toast('Add your name and a few words about the piece.', true); return; }
      Store.s.reviews.unshift({ id: 'rv' + Date.now(), productId: p.id, shopId: p.shopId, name: fd.get('name'), rating: +fd.get('rating'), text: fd.get('text'), at: Date.now() });
      p.reviews++; p.rating = Math.round(((p.rating * (p.reviews - 1)) + +fd.get('rating')) / p.reviews * 10) / 10;
      Store.save(); toast('Thanks — your review is published.'); App.render();
    });
  });

  return `<div class="wrap">
    <div class="page-head" style="padding-bottom:10px"><div class="crumbs"><a href="#/">Home</a> / <a href="#/shop?cat=${p.category}">${esc(Store.cat(p.category).name)}</a> / ${esc(p.name)}</div></div>
    <div class="pdp">
      <div>
        <div class="gallery-main" id="gMain" title="Click to zoom">
          <img src="${esc(p.images[0])}" alt="${esc(p.name)}">
          ${sold ? `<div class="seal">${SEAL}</div>` : ''}
          ${deal && !sold ? `<span class="tag-deal" style="font-size:.9rem">−${p.discount}%</span>` : ''}
        </div>
        ${p.images.length > 1 ? `<div class="thumbs">${p.images.map((im, i) => `<button data-thumb="${esc(im)}" class="${i ? '' : 'on'}" aria-label="Photo ${i + 1}"><img src="${esc(im)}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="pdp-info">
        <a href="#/store/${shop.id}" class="pcard-shop" style="font-size:.9rem">${esc(shop.name)}</a>
        <h1>${esc(p.name)}</h1>
        <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
          <span class="rating">${stars(p.rating)} ${p.rating} · ${p.reviews} reviews</span>
          <span class="muted" style="font-size:.85rem">${p.sold} sold · ${p.views} views</span>
          ${p.badge ? `<span class="badge gold">${esc(p.badge)}</span>` : ''}
        </div>
        <div class="pdp-price"><b>${money(price)}</b>${deal ? `<s class="muted">${money(p.price)}</s><span class="save-pill">You save ${money(p.price - price)}</span>` : ''}</div>
        ${Store.isFlash(p) && !sold ? `<div class="deal-box"><div><b>Flash deal</b><br><small>Price returns to ${money(p.price)} when the timer ends</small></div>${bigTimer(p.dealEnds)}</div>` : ''}
        ${sold ? `<div class="notice red"><b>Sold out.</b> ${esc(shop.name)} makes these in small batches. Ask to be told when it is back, or see similar pieces from other shops below.</div>`
               : p.stock <= 3 ? `<p class="low-stock">Only ${p.stock} left in stock</p>` : `<p class="muted" style="font-size:.9rem">${p.stock} in stock, ready to dispatch</p>`}
        <p>${esc(p.description)}</p>
        <div class="buy-row">
          ${sold ? `<button class="btn btn-dark" data-action="notify" data-id="${p.id}">${icon('bell')} Notify me when back</button>` : `
          <div class="qty"><button data-q="-1" aria-label="Less">−</button><input id="qty" value="1" inputmode="numeric" aria-label="Quantity"><button data-q="1" aria-label="More">+</button></div>
          <button class="btn btn-dark" data-action="add-qty" data-id="${p.id}">${icon('cart')} Add to cart</button>
          <button class="btn btn-brass" data-action="buy-now" data-id="${p.id}">Buy now, pay on delivery</button>`}
          <button class="icon-btn ${Store.s.wishlist.includes(p.id) ? 'on' : ''}" data-action="wish" data-id="${p.id}" aria-label="Save to wishlist">${icon('heart')}</button>
        </div>
        <div class="buy-row" style="margin-top:-6px">
          <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(shop.whatsapp, `Hello ${shop.name}, I'm interested in "${p.name}" (${money(price)}) on Pittala.lk. Is it available?`)}">${icon('wa')} Ask the shop on WhatsApp</a>
          <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(shareText)}">Share</a>
        </div>
        <dl class="specs">
          <dt>Material</dt><dd>${esc(p.material)}</dd>
          ${p.dimensions ? `<dt>Size</dt><dd>${esc(p.dimensions)}</dd>` : ''}
          ${p.weight ? `<dt>Weight</dt><dd>${esc(p.weight)}</dd>` : ''}
          <dt>Finish</dt><dd>${esc(p.finish)}</dd>
          <dt>Made in</dt><dd>Pilimathalawa, Kandy</dd>
        </dl>
        <div class="trust">
          <div>${icon('coins')} Cash on delivery only</div>
          <div>${icon('truck')} ${money(Store.s.settings.deliveryKandy)} in Kandy, ${money(Store.s.settings.deliveryOther)} elsewhere</div>
          <div>${icon('shield')} Shop confirms by WhatsApp first</div>
        </div>
        <a class="shop-mini" href="#/store/${shop.id}">${shopLogo(shop)}<div style="flex:1"><b>${esc(shop.name)}</b><br><small class="muted">${esc(shop.tagline)}</small><div style="margin-top:6px">${badgeRow(shop)}</div></div></a>
      </div>
    </div>

    ${compare.length > 1 ? `<section class="block" style="padding-top:20px">
      <div class="sec-head"><div><h2>Compare with other shops</h2><p>Same category, different workshops. Prices update as shops run deals.</p></div></div>
      <div class="table-wrap"><table class="compare-table">
        <thead><tr><th>Piece</th><th>Shop</th><th>Price</th><th>Rating</th><th>Stock</th><th></th></tr></thead>
        <tbody>${compare.slice(0, 6).map(x => { const s = Store.shop(x.shopId); return `<tr class="${x.id === p.id ? 'me' : ''}">
          <td><a href="#/product/${x.id}" style="display:flex;gap:10px;align-items:center"><img class="t-img" src="${esc(x.images[0])}" alt="">${esc(x.name)}</a></td>
          <td>${esc(s.name)}</td>
          <td><b>${money(Store.priceOf(x))}</b>${Store.dealActive(x) ? ` <span class="badge red">−${x.discount}%</span>` : ''}</td>
          <td>${stars(x.rating)}</td>
          <td>${Store.soldOut(x) ? '<span class="badge red">Sold out</span>' : x.stock}</td>
          <td>${x.id === p.id ? '<small class="muted">Viewing</small>' : `<a class="btn btn-ghost btn-sm" href="#/product/${x.id}">View</a>`}</td></tr>`; }).join('')}</tbody>
      </table></div>
    </section>` : ''}

    <section class="block" style="padding-top:10px">
      <div class="dash-grid">
        <div class="card"><h3>Reviews (${reviews.length})</h3>
          ${reviews.length ? reviews.map(r => `<div style="padding:12px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between"><b>${esc(r.name)}</b><small class="muted">${fmtDate(r.at)}</small></div>${stars(r.rating)}<p style="margin:6px 0 0">${esc(r.text)}</p></div>`).join('') : '<p class="muted">No reviews yet. Bought this piece? Tell others how it turned out.</p>'}
        </div>
        <form class="card" id="reviewForm"><h3>Write a review</h3>
          <div class="field"><label for="rn">Your name</label><input class="input" id="rn" name="name" required></div>
          <div class="field" style="margin-top:10px"><label for="rr">Rating</label><select class="input" id="rr" name="rating">${[5, 4, 3, 2, 1].map(n => `<option value="${n}">${'★'.repeat(n)} ${n}</option>`).join('')}</select></div>
          <div class="field" style="margin-top:10px"><label for="rt">Review</label><textarea class="input" id="rt" name="text" required></textarea></div>
          <button class="btn btn-dark" style="margin-top:12px">Publish review</button>
        </form>
      </div>
    </section>

    ${rivals.length ? `<section class="block" style="padding-top:10px"><div class="sec-head"><div><h2>Similar pieces from other shops</h2></div></div><div class="grid">${rivals.slice(0, 4).map(x => productCard(x)).join('')}</div></section>` : ''}
    ${more.length ? `<section class="block" style="padding-top:10px"><div class="sec-head"><div><h2>More from ${esc(shop.name)}</h2></div><a class="link-more" href="#/store/${shop.id}">Visit shop</a></div><div class="grid">${more.map(x => productCard(x, { hideShop: true })).join('')}</div></section>` : ''}
    ${recent.length ? `<section class="block" style="padding-top:10px"><div class="sec-head"><div><h2>Recently viewed</h2></div></div><div class="grid">${recent.map(x => productCard(x)).join('')}</div></section>` : ''}
  </div>`;
};

/* =================== STORES =================== */
Pages.stores = () => {
  const shops = Store.publishedShops().map(s => ({ s, st: Store.shopStats(s.id, 30), prods: Store.liveProducts().filter(p => p.shopId === s.id) }))
    .sort((a, b) => b.st.revenue - a.st.revenue);
  return `<div class="wrap">
    <div class="page-head"><div class="crumbs"><a href="#/">Home</a> / Shops</div><h1 style="font-size:clamp(2rem,4vw,3rem)">The workshops of Pilimathalawa</h1><p class="muted" style="margin-top:6px;max-width:60ch">Each shop is a family business in the village, approved by the region agent and the platform before going live.</p></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));padding-bottom:60px">
      ${shops.map(({ s, st, prods }) => `<a class="store-card" href="#/store/${s.id}" style="--shop-c:${esc(s.color)}">
        <div class="cover"><img src="${esc(s.banner)}" alt="" loading="lazy"></div>
        <div class="body">${shopLogo(s)}<h3>${esc(s.name)}</h3><small class="muted">${esc(s.tagline)}</small>
          <span class="rating">${stars(s.rating)} ${s.rating} · ${prods.length} products · ${st.orders} orders this month</span>
          ${badgeRow(s)}
          <div class="thumbs-row">${prods.slice(0, 3).map(p => `<img src="${esc(p.images[0])}" alt="" loading="lazy">`).join('')}</div>
        </div></a>`).join('')}
    </div>
  </div>`;
};

Pages.store = (q, id) => {
  const s = Store.shop(id);
  if (!s || (s.status !== 'published' && !q.preview)) return Pages.notFound();
  const tab = q.tab || 'products';
  const prods = Store.s.products.filter(p => p.shopId === s.id && p.active);
  const cat = q.cat || '';
  const cats = [...new Set(prods.map(p => p.category))];
  const list = prods.filter(p => !cat || p.category === cat).sort((a, b) => (Store.soldOut(a) - Store.soldOut(b)) || b.sold - a.sold);
  const reviews = Store.s.reviews.filter(r => r.shopId === s.id);
  const coupons = Store.s.coupons.filter(c => c.shopId === s.id && c.expires > Date.now());
  const rivals = Store.publishedShops().filter(x => x.id !== s.id && Store.liveProducts().some(p => p.shopId === x.id && cats.includes(p.category)));
  const base = `#/store/${s.id}?${q.preview ? 'preview=1&' : ''}`;
  return `<div style="--shop-c:${esc(s.color)}">
    ${q.preview ? `<div class="notice" style="margin:0;border-radius:0;text-align:center">Preview of your shop page. ${s.status !== 'published' ? 'Buyers will see it after final approval.' : ''}</div>` : ''}
    <section class="store-hero f-${esc(s.font)}">
      <img src="${esc(s.banner)}" alt="">
      <div class="wrap">
        <div class="store-logo">${esc(initials(s.name))}</div>
        <div><h1>${esc(s.name)}</h1><div style="font-size:1.05rem;opacity:.95">${esc(s.tagline)}</div>
          <div class="store-meta"><span>${stars(s.rating)} ${s.rating || 'New'}</span><span>${prods.length} products</span><span>Est. ${esc(s.est)}</span><span>${esc(s.address)}</span></div></div>
        <div class="store-actions">
          <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(s.whatsapp, `Hello ${s.name}, I found your shop on Pittala.lk.`)}">${icon('wa')} WhatsApp</a>
          <a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.5)" href="tel:${esc(s.phone)}">Call ${esc(s.phone)}</a>
        </div>
      </div>
    </section>
    ${s.announcement ? `<div class="store-announce">${esc(s.announcement)}</div>` : ''}
    <div class="wrap layout-${esc(s.layout)}">
      <div style="margin-top:16px">${badgeRow(s)}</div>
      <div class="tabs" role="tablist">
        ${[['products', 'Products'], ['deals', 'Deals & coupons'], ['about', 'About the shop'], ['reviews', `Reviews (${reviews.length})`]].map(([k, l]) => `<button role="tab" class="${tab === k ? 'on' : ''}" onclick="location.hash='${base}tab=${k}'">${l}</button>`).join('')}
      </div>
      ${tab === 'products' ? `
        <div class="chips" style="margin-bottom:18px"><a class="chip ${!cat ? 'on' : ''}" href="${base}tab=products">All</a>${cats.map(c => `<a class="chip ${cat === c ? 'on' : ''}" href="${base}tab=products&cat=${c}">${esc(Store.cat(c).name)}</a>`).join('')}</div>
        ${list.length ? `<div class="grid">${list.map(p => productCard(p, { hideShop: true })).join('')}</div>` : '<div class="empty card"><h3>No products listed yet</h3></div>'}` : ''}
      ${tab === 'deals' ? `
        ${coupons.length ? `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));margin-bottom:24px">${coupons.map(couponCard).join('')}</div>` : ''}
        ${prods.filter(p => Store.dealActive(p)).length ? `<div class="grid">${prods.filter(p => Store.dealActive(p)).map(p => productCard(p, { hideShop: true })).join('')}</div>` : '<div class="empty card"><h3>No deals running right now</h3><p>Save the shop’s products to your wishlist to catch the next one.</p></div>'}` : ''}
      ${tab === 'about' ? `<div class="dash-grid"><div class="card"><h3>Our story</h3><p style="font-size:1.05rem">${esc(s.story)}</p></div>
        <div class="card"><h3>Visit or call</h3><dl class="specs" style="grid-template-columns:110px 1fr"><dt>Address</dt><dd>${esc(s.address)}</dd><dt>Hours</dt><dd>${esc(s.hours)}</dd><dt>Phone</dt><dd>${esc(s.phone)}</dd><dt>Artisans</dt><dd>${esc(s.artisans)}</dd><dt>Established</dt><dd>${esc(s.est)}</dd></dl>
        <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/${encodeURIComponent(s.address + ', Sri Lanka')}">${icon('map')} Open in Maps</a></div></div>` : ''}
      ${tab === 'reviews' ? `<div class="card">${reviews.length ? reviews.map(r => { const p = Store.product(r.productId); return `<div style="padding:12px 0;border-bottom:1px solid var(--line)"><b>${esc(r.name)}</b> on <a href="#/product/${p.id}" style="text-decoration:underline">${esc(p.name)}</a><br>${stars(r.rating)} <small class="muted">${fmtDate(r.at)}</small><p style="margin:6px 0 0">${esc(r.text)}</p></div>`; }).join('') : '<p class="muted">No reviews yet.</p>'}</div>` : ''}

      ${rivals.length ? `<section class="block" style="padding-bottom:30px"><div class="sec-head"><div><h2>Shops making similar pieces</h2><p>Compare styles and prices before you decide.</p></div></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${rivals.slice(0, 3).map(x => `<a class="shop-mini" href="#/store/${x.id}" style="margin:0">${shopLogo(x)}<div><b>${esc(x.name)}</b><br><small class="muted">${esc(x.tagline)}</small><br><span class="rating">${stars(x.rating)} ${x.rating}</span></div></a>`).join('')}</div></section>` : ''}
    </div>
  </div>`;
};

function couponCard(c) {
  const s = Store.shop(c.shopId);
  return `<div class="card" style="border:2px dashed var(--brass);display:grid;gap:6px">
    <small class="muted">${esc(s.name)}</small>
    <b style="font-family:var(--font-display);font-size:1.6rem">${c.type === 'pct' ? `${c.value}% off` : `${money(c.value)} off`}</b>
    <small>On orders over ${money(c.minOrder)} · ends ${fmtDate(c.expires)}</small>
    <button class="btn btn-ghost btn-sm" data-action="copy" data-text="${esc(c.code)}">${icon('copy')} Code: <b>${esc(c.code)}</b></button>
  </div>`;
}

/* =================== DEALS =================== */
Pages.deals = (q) => {
  const deals = Store.liveProducts().filter(p => Store.dealActive(p));
  const flash = deals.filter(p => Store.isFlash(p) && !Store.soldOut(p)).sort((a, b) => a.dealEnds - b.dealEnds);
  const sort = q.sort || 'ending';
  const other = [...deals].sort(sort === 'biggest' ? (a, b) => b.discount - a.discount : (a, b) => (a.dealEnds || 9e15) - (b.dealEnds || 9e15));
  const coupons = Store.s.coupons.filter(c => c.expires > Date.now() && Store.shop(c.shopId).status === 'published');
  const byShop = Store.publishedShops().map(s => ({ s, items: deals.filter(p => p.shopId === s.id) })).filter(x => x.items.length).sort((a, b) => b.items.length - a.items.length);
  return `
  <section class="deals-band" style="padding:56px 0">
    <div class="wrap"><div class="sec-head" style="margin:0"><div><h1 style="color:#fff">Deals & flash sales</h1><p>${deals.length} pieces discounted across ${byShop.length} shops. Shops set their own deals and compete for the lowest price.</p></div>${flash[0] ? `<div><small style="opacity:.8">Next deal ends in</small>${bigTimer(flash[0].dealEnds)}</div>` : ''}</div></div>
  </section>
  <div class="wrap">
    ${flash.length ? `<section class="block" style="padding-bottom:20px"><div class="sec-head"><div><h2>Ending soon</h2></div></div><div class="hscroll">${flash.map(p => productCard(p)).join('')}</div></section>` : ''}
    ${coupons.length ? `<section class="block" style="padding:20px 0"><div class="sec-head"><div><h2>Shop coupons</h2><p>Enter the code in your cart. Each code works with its own shop.</p></div></div><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${coupons.map(couponCard).join('')}</div></section>` : ''}
    <section class="block" style="padding:20px 0">
      <div class="sec-head"><div><h2>Deals by shop</h2></div></div>
      ${byShop.map(({ s, items }) => `<div class="card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap">${shopLogo(s)}<div style="flex:1"><b>${esc(s.name)}</b><br><small class="muted">${items.length} deal${items.length > 1 ? 's' : ''} · up to ${Math.max(...items.map(i => i.discount))}% off</small></div><a class="btn btn-ghost btn-sm" href="#/store/${s.id}?tab=deals">Shop’s deals</a></div>
        <div class="hscroll">${items.map(p => productCard(p, { hideShop: true })).join('')}</div></div>`).join('')}
    </section>
    <section class="block" style="padding-top:20px">
      <div class="toolbar"><h2>Every discount</h2><div class="chips"><a class="chip ${sort === 'ending' ? 'on' : ''}" href="#/deals?sort=ending">Ending soonest</a><a class="chip ${sort === 'biggest' ? 'on' : ''}" href="#/deals?sort=biggest">Biggest discount</a></div></div>
      <div class="grid">${other.map(p => productCard(p)).join('')}</div>
    </section>
  </div>`;
};

/* =================== CRAFT =================== */
Pages.craft = () => `
  <section class="hero" style="min-height:60vh"><div class="hero-film"><div class="frame on"><img src="${HERO(PHOTOS.ceremony)}" alt=""></div></div>
    <div class="wrap" style="min-height:60vh"><div class="hero-si" aria-hidden="true">පිත්තල</div><h1>The craft of Pilimathalawa</h1><p class="hero-lede">A village of metalworkers on the road out of Kandy, where brass is still poured, chased and polished by hand.</p></div></section>
  <div class="wrap" style="max-width:820px">
    <section class="block">
      <div class="vine" style="margin-bottom:24px"></div>
      <h2>A village built around a furnace</h2>
      <p style="font-size:1.1rem;margin-top:14px">Pilimathalawa lies a few kilometres west of Kandy. Its brass and bronze workshops grew up serving the temples, devales and households of the old Kandyan kingdom, and the skills have been passed down inside families ever since.</p>
      <p>Walk down the main road today and you will hear hammers before you see the shops. Most workshops are small: a furnace at the back, a polishing wheel, and a front room crowded with lamps and statues. Many families sell through middlemen in Colombo and Kandy, who keep most of the price.</p>
      <p>Pittala.lk exists so that buyers can order directly from those families. The shop sets the price, ships the piece and collects the cash on delivery.</p>
    </section>
    <figure style="margin:0 0 40px"><img src="${P.relief}" alt="Brass relief panel" style="border-radius:18px;width:100%;aspect-ratio:16/9;object-fit:cover"><figcaption class="muted" style="font-size:.85rem;margin-top:8px">Relief work uses small punches to raise vines, lotus petals and birds from a flat sheet.</figcaption></figure>
    <section style="padding-bottom:40px">
      <h2>What brass is, and how to care for it</h2>
      <p style="margin-top:14px">Brass is an alloy of copper and zinc. More copper gives a warmer, redder tone; more zinc gives a paler gold. Pilimathalawa workshops mix their own alloys for colour and for how cleanly the metal fills the mould.</p>
      <p>To keep the shine, wipe pieces with a dry cloth. For oil lamps, a paste of tamarind or lime with a little salt removes soot and tarnish. Rinse and dry well. Antique and patina finishes should only be dusted.</p>
      <h3 style="margin:26px 0 10px">The pieces you will find</h3>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">${CATEGORIES.map(c => `<a class="cat" href="#/shop?cat=${c.id}"><div class="ring"><img src="${esc(c.img)}" alt="" loading="lazy"></div><b>${esc(c.name)}</b></a>`).join('')}</div>
    </section>
  </div>`;

/* =================== SELL WITH US =================== */
Pages.sell = () => {
  const st = Store.s.settings;
  const r = Store.s.regions[0];
  const features = [
    ['store', 'Your own shop page', 'Banner, colours, layout, story and announcement bar that you control.'],
    ['tag', 'Deals with countdown timers', 'Flash sales appear on the home page and the deals page while the clock runs.'],
    ['coins', 'Shop coupons', 'Create codes like VESAK10 with minimum order and expiry dates.'],
    ['target', 'Competitor insights', 'See where your price sits against other shops in the same category.'],
    ['wa', 'One-click WhatsApp confirmation', 'Every order creates a ready-to-send WhatsApp message to the buyer.'],
    ['mail', 'Automatic order emails', 'Buyer and shop receive an email the moment an order is placed.'],
    ['chart', 'Sales dashboard', 'Daily sales, best sellers, order status and what you owe in commission.'],
    ['bolt', 'Spotlight promotion', 'Request a home-page spotlight for your best piece.']
  ];
  return `<div class="wrap">
    <div class="page-head"><div class="crumbs"><a href="#/">Home</a> / Sell with us</div><h1 style="font-size:clamp(2rem,4vw,3rem)">Sell your brass to all of Sri Lanka</h1><p class="muted" style="margin-top:8px;max-width:62ch">Open a shop on Pittala.lk, list your pieces and take cash-on-delivery orders. Shops in the ${esc(r.name)} region are onboarded by our region agent, ${esc(Store.userById(r.agentUserId).name)}.</p></div>
    <div class="sell" style="padding-bottom:40px">
      <div class="card">
        <h3>How approval works</h3>
        <ol class="steps" style="margin-top:6px">
          <li><div><b style="color:var(--ink)">Fill in the application and sign the agreement</b><p class="muted">Shop details, owner details and the commission agreement, all online.</p></div></li>
          <li><div><b style="color:var(--ink)">Pay the ${money(st.regFee)} registration fee</b><p class="muted">Deposit to the region agent’s account and enter the reference. Upload the slip if you have it.</p></div></li>
          <li><div><b style="color:var(--ink)">Region agent verifies payment</b><p class="muted">The agent confirms the payment and approves your application.</p></div></li>
          <li><div><b style="color:var(--ink)">Platform gives final approval</b><p class="muted">Your shop goes live and you can start adding products straight away.</p></div></li>
        </ol>
        <a class="btn btn-dark" href="#/register" style="margin-top:16px">Start your application</a>
      </div>
      ${commissionVisual(st)}
    </div>
    <section class="block" style="padding-top:20px">
      <div class="sec-head"><div><h2>What every shop gets</h2></div></div>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${features.map(([i, t, d]) => `<div class="card">${icon(i)}<h3 style="margin:10px 0 6px;font-size:1.15rem">${t}</h3><p class="muted" style="margin:0;font-size:.92rem">${d}</p></div>`).join('')}</div>
    </section>
    <section class="block" style="padding-top:10px">
      <div class="card"><h3>Common questions</h3>
        ${[['When do I pay commission?', `Commission is ${st.platformRate + st.agentRate}% of delivered order value (excluding delivery fees), settled monthly. Cancelled or returned orders are not charged.`],
           ['Who handles delivery?', 'You do, using your preferred courier. You collect cash on delivery and keep the delivery fee shown to the buyer.'],
           ['Can I sell outside the platform?', 'Yes. The agreement covers only orders placed through Pittala.lk.'],
           ['How do I know an order is real?', 'Every order includes the buyer’s verified mobile number. Use the WhatsApp button in your dashboard to confirm before you dispatch.']]
          .map(([a, b]) => `<details style="padding:12px 0;border-bottom:1px solid var(--line)"><summary style="font-weight:700;cursor:pointer">${a}</summary><p style="margin:8px 0 0" class="muted">${b}</p></details>`).join('')}
      </div>
    </section>
  </div>`;
};

Pages.notFound = () => `<div class="wrap"><div class="empty" style="padding:100px 20px"><h1>Page not found</h1><p>The link may be old, or the shop may no longer be listed.</p><a class="btn btn-dark" href="#/">Back to home</a></div></div>`;
