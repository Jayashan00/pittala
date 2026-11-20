/* Public storefront pages */
const Pages = {};
let mountQueue = [];
let cleanups = [];
const onMount = fn => mountQueue.push(fn);
const onCleanup = fn => cleanups.push(fn);

function shopBadges(shop) {
  const b = [];
  if (Store.isAgentShop(shop)) b.push(['gold', 'Region agent']);
  if (shop.rating >= 4.8) b.push(['green', 'Top rated seller']);
  if (shop.est && shop.est < 1990) b.push(['', `Since ${shop.est}`]);
  if (shop.artisans >= 10) b.push(['', `${shop.artisans} artisans`]);
  const deals = Store.liveProducts().filter(p => p.shopId === shop.id && Store.dealActive(p)).length;
  if (deals) b.push(['red', `${deals} deal${deals > 1 ? 's' : ''} on`]);
  return b;
}
const badgeRow = shop => `<div class="badges">${shopBadges(shop).map(([c, t]) => `<span class="badge ${c}">${esc(t)}</span>`).join('')}</div>`;
const sectionHead = (title, sub = '', more = '') => `<div class="sec-head reveal"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${more}</div>`;

/* =================== HOME =================== */
// Categories shown to buyers: only those with live products, pictured with a real product photo
function liveCategories() {
  const prods = Store.liveProducts();
  return CATEGORIES.map(c => { const ps = prods.filter(p => p.category === c.id); return ps.length ? { ...c, img: ps.sort((a, b) => b.sold - a.sold)[0].images[0], count: ps.length } : null; }).filter(Boolean);
}

Pages.home = () => {
  const prods = Store.liveProducts();
  const deals = prods.filter(p => Store.isFlash(p) && !Store.soldOut(p)).sort((a, b) => a.dealEnds - b.dealEnds);
  const allDeals = prods.filter(p => Store.dealActive(p) && !Store.soldOut(p)).sort((a, b) => b.discount - a.discount);
  const popular = [...prods].sort((a, b) => b.sold - a.sold).slice(0, 10);
  const recent = Store.s.recent.map(id => Store.product(id)).filter(Boolean).slice(0, 10);
  const shops = Store.publishedShops().map(s => ({ s, st: Store.shopStats(s.id, 30), prods: prods.filter(p => p.shopId === s.id) })).sort((a, b) => (b.s.rating || 0) - (a.s.rating || 0));
  const totalSold = prods.reduce((a, p) => a + p.sold, 0);
  const artisans = Store.publishedShops().reduce((a, s) => a + (s.artisans || 0), 0);
  const st = Store.s.settings;
  const cats = liveCategories();

  onMount(mountHome);

  return `
  <section class="vhero" aria-label="Pilimathalawa brass">
    <video autoplay muted loop playsinline preload="auto" poster="${PW.lampsTemple}"><source src="${VIDEOS.templeLamp}" type="video/mp4"></video>
    <div class="wrap"><div class="inner anim-in">
      <div class="si-title" data-notr>පිළිමතලාව පාරම්පරික පිත්තල</div>
      <h1>Hand-made brass from the village of Pilimathalawa</h1>
      <p class="lede">Pahan, Buddha statues and pooja items, cast and polished by family workshops near Kandy. Buy direct from the makers and pay in cash when it arrives.</p>
      <form class="hero-search" onsubmit="event.preventDefault();location.hash='#/shop?q='+encodeURIComponent(this.elements.hq.value)"><input name="hq" placeholder="What are you looking for? Try “pahana”" aria-label="Search"><button class="btn btn-brass">Search</button></form>
      <div class="cta"><a class="btn btn-gold btn-lg" href="#/shop">Shop the collection</a><a class="btn btn-ghost btn-lg" href="#/deals">Today’s deals</a></div>
      <div class="stats"><div><b data-count="${Store.publishedShops().length}">0</b><span>family workshops</span></div><div><b data-count="${artisans}">0</b><span>artisans</span></div><div><b data-count="${totalSold}">0</b><span>pieces sold</span></div></div>
    </div></div>
  </section>

  <div class="ticker" aria-label="Highlights"><div class="track">${[0, 1].map(() => ['Cash on delivery islandwide', 'Hand-made in Pilimathalawa', `Free delivery over ${money(st.freeDeliveryOver)}`, 'Every order confirmed on WhatsApp', 'Avurudu and wedding pahan', 'Vesak and Poson collections'].map(t => `<span>${t}</span>`).join('')).join('')}</div></div>

  <div class="wrap">
    <section class="block" style="padding-top:44px">
      ${ornTitle('Shop by category')}
      <div class="cat-rail" style="--n:${cats.length}">${cats.map((c, i) => `<a class="cat reveal" style="--d:${i * 0.06}s" href="#/shop?cat=${c.id}"><div class="ring"><img src="${esc(c.img)}" alt="${esc(L(c, 'name'))}" loading="lazy"></div><b>${esc(L(c, 'name'))}</b><small>${c.count} ${c.count === 1 ? 'item' : 'items'}</small></a>`).join('')}</div>
    </section>
  </div>

  ${allDeals.length ? `<section class="block deals-band"><div class="wrap">
    <div class="sec-head reveal"><div class="deal-head"><h2>Daily deals</h2>${deals[0] ? `<span class="ends">Next deal ends in <b data-countdown="${deals[0].dealEnds}">${countdownText(deals[0].dealEnds)}</b></span>` : ''}</div><a class="link-more" href="#/deals">See all deals</a></div>
    <div class="hscroll reveal">${allDeals.map(p => productCard(p)).join('')}</div>
  </div></section>` : ''}

  <div class="wrap">
    <section class="block">
      ${sectionHead('Most popular', 'The pieces buyers order most', '<a class="link-more" href="#/shop?sort=popular">See all</a>')}
      <div class="hscroll reveal">${popular.map(p => productCard(p)).join('')}</div>
    </section>

    <section class="block" style="padding-top:0">
      <div class="vstory reveal">
        <div class="vid"><img src="${PW.lampKandy}" alt="A brass oil lamp made in the Kandy area" loading="lazy"></div>
        <div class="txt">
          <h2>Made by hand, the old udarata way</h2>
          <p>Pilimathalawa lies on the old road from Kandy to Kadugannawa. Brass workers here have made pahan, Buddha statues and pooja items for viharas and homes for generations.</p>
          <p>Molten brass is poured into sand moulds, then filed, chased with liyawela and lotus patterns, and polished to a golden shine.</p>
          <a class="btn btn-brass" href="#/about">Read the story</a> <a class="btn btn-ghost" href="#/stores">Meet the workshops</a>
        </div>
      </div>
    </section>

    <section class="block" style="padding-top:10px">
      ${ornTitle('Featured workshops', 'Family workshops of Pilimathalawa, verified by the region agent')}
      <div class="seller-row">${shops.slice(0, 4).map((x, i) => storeCard(x, i)).join('')}</div>
    </section>

    <section class="block" style="padding-top:0">
      <div class="trustbar reveal">
        <div><span><b>Cash on delivery</b><small>Pay when it arrives</small></span></div>
        <div><span><b>Islandwide delivery</b><small>Free over ${moneyShort(st.freeDeliveryOver)}</small></span></div>
        <div><span><b>Verified workshops</b><small>Approved by region agent</small></span></div>
        <div><span><b>Confirmed on WhatsApp</b><small>Before every dispatch</small></span></div>
      </div>
    </section>

    ${recent.length ? `<section class="block" style="padding-top:0">${sectionHead('Your recently viewed items')}<div class="hscroll">${recent.map(p => productCard(p)).join('')}</div></section>` : ''}

    <section class="block" style="padding-top:0">
      <div class="sellbox reveal">
        <div><h2>Own a brass workshop in Pilimathalawa?</h2><p>Open your own shop on Pittala, list your pieces with photos and take cash-on-delivery orders from all over Sri Lanka.</p>
          <div class="row-actions" style="margin-top:16px"><a class="btn btn-gold" href="#/register">Register your shop</a><a class="btn btn-ghost" href="#/sell">How it works</a></div></div>
        <div class="sell-photo"><img src="${PW.lampsBuddhist}" alt="" loading="lazy"></div>
      </div>
    </section>

    <section class="block" style="padding-top:10px">
      ${ornTitle('What buyers say')}
      <div class="quotes">${Store.s.reviews.slice(0, 3).map((r, i) => { const p = Store.product(r.productId); return `<blockquote class="quote reveal" style="--d:${i * 0.1}s"><div>${stars(r.rating)}</div><p>“${esc(r.text)}”</p><footer>${esc(r.name)} · <a class="link" href="#/product/${p.id}">${esc(L(p, 'name'))}</a></footer></blockquote>`; }).join('')}</div>
    </section>
  </div>`;
};

function mountHome() {
  // count-up numbers in the hero
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count; const t0 = performance.now(); const dur = 1600;
    const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString(); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });

}

function storeCard({ s, st, prods }, i = 0) {
  return `<a class="store-card reveal" href="#/store/${s.id}" style="--shop-c:${esc(s.color)};--d:${(i % 4) * 0.08}s">
    <div class="cover"><img src="${esc(s.banner)}" alt="" loading="lazy"></div>
    <div class="body">${shopLogo(s)}<h3>${esc(L(s, 'name'))}</h3><small class="muted">${esc(L(s, 'tagline'))}</small>
      <span class="feedback"><b>${feedbackPct(s) || '—'}%</b> positive feedback · ${st.orders} orders this month</span>
      <div class="thumbs-row">${prods.slice(0, 3).map(p => `<img src="${esc(p.images[0])}" alt="" loading="lazy">`).join('')}</div>
    </div></a>`;
}

function commissionVisual(st) {
  const total = st.platformRate + st.agentRate;
  const sale = 10000;
  return `<div class="split-visual">
    <b>How a Rs. 10,000 sale is shared</b>
    <div class="split-bar">
      <div style="width:${100 - total}%;background:#2E4A3A;color:#fff">Shop ${100 - total}%</div>
      <div style="width:${Math.max(st.agentRate, 9)}%;background:var(--gold);color:#fff">${st.agentRate}%</div>
      <div style="width:${Math.max(st.platformRate, 6)}%;background:var(--maroon);color:#fff">${st.platformRate}%</div>
    </div>
    <div class="split-legend">
      <div><span>Shop owner keeps</span><b>${money(sale * (100 - total) / 100)}</b></div>
      <div><span>Region agent, Pilimathalawa (${st.agentRate}%)</span><b>${money(sale * st.agentRate / 100)}</b></div>
      <div><span>Pittala.lk platform (${st.platformRate}%)</span><b>${money(sale * st.platformRate / 100)}</b></div>
    </div>
    <p class="muted" style="font-size:.84rem;margin:10px 0 0">Charged only on delivered orders. The region agent’s own shop pays the ${st.platformRate}% platform share only. One-time registration fee ${money(st.regFee)}.</p>
  </div>`;
}

function mountCarousel() {
  const root = document.getElementById('carousel');
  if (!root) return;
  const slides = [...root.querySelectorAll('.slide')];
  const dots = [...root.querySelectorAll('[data-slide]')];
  let i = 0, timer = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const show = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    clearTimeout(timer);
    if (!reduce) timer = setTimeout(() => show(i + 1), 6000);
  };
  dots.forEach(d => d.addEventListener('click', () => show(+d.dataset.slide)));
  root.querySelectorAll('[data-dir]').forEach(b => b.addEventListener('click', () => show(i + +b.dataset.dir)));
  root.addEventListener('mouseenter', () => clearTimeout(timer));
  root.addEventListener('mouseleave', () => show(i));
  show(0);
  onCleanup(() => clearTimeout(timer));
}

/* =================== SEARCH / CATEGORY RESULTS =================== */
Pages.shop = (q) => {
  const all = Store.liveProducts();
  const cat = q.cat || '';
  const sort = q.sort || 'best';
  const view = q.view || 'grid';
  const term = (q.q || '').toLowerCase().trim();
  const shopsSel = (q.shops || '').split(',').filter(Boolean);
  const words = term.split(/\s+/).filter(Boolean);
  let list = all.filter(p => {
    const hay = (p.name + ' ' + (p.name_si || '') + ' ' + p.description + ' ' + (p.description_si || '') + ' ' + Store.cat(p.category).name + ' ' + (Store.cat(p.category).name_si || '') + ' ' + Store.shop(p.shopId).name + ' ' + (Store.shop(p.shopId).name_si || '')).toLowerCase();
    return (!cat || p.category === cat) && words.every(w => hay.includes(w))
      && (!shopsSel.length || shopsSel.includes(p.shopId))
      && (!q.deals || Store.dealActive(p)) && (!q.instock || !Store.soldOut(p))
      && (!q.free || Store.priceOf(p) >= Store.s.settings.freeDeliveryOver)
      && (!q.min || Store.priceOf(p) >= +q.min) && (!q.max || Store.priceOf(p) <= +q.max)
      && (!q.finish || p.finish.toLowerCase().includes(q.finish));
  });
  const sorters = {
    best: (a, b) => (Store.soldOut(a) - Store.soldOut(b)) || (b.spotlight - a.spotlight) || (b.sold - a.sold),
    popular: (a, b) => b.sold - a.sold,
    low: (a, b) => Store.priceOf(a) - Store.priceOf(b),
    high: (a, b) => Store.priceOf(b) - Store.priceOf(a),
    discount: (a, b) => (Store.dealActive(b) ? b.discount : 0) - (Store.dealActive(a) ? a.discount : 0),
    ending: (a, b) => (Store.isFlash(a) ? a.dealEnds : 9e15) - (Store.isFlash(b) ? b.dealEnds : 9e15),
    new: (a, b) => b.createdAt - a.createdAt,
    rating: (a, b) => b.rating - a.rating
  };
  list.sort(sorters[sort] || sorters.best);
  const c = cat ? Store.cat(cat) : null;
  const link = patch => '#/shop?' + new URLSearchParams(Object.fromEntries(Object.entries({ ...q, ...patch }).filter(([, v]) => v !== '' && v != null))).toString();
  const countIn = id => all.filter(p => p.category === id).length;
  const activeFilters = [
    q.deals && ['deals', 'On sale'], q.instock && ['instock', 'In stock'], q.free && ['free', 'Free delivery'],
    (q.min || q.max) && ['min', `Rs. ${q.min || 0} – ${q.max || 'any'}`], q.finish && ['finish', q.finish],
    ...shopsSel.map(id => ['shops', Store.shop(id)?.name || id])
  ].filter(Boolean);

  onMount(() => {
    const f = document.getElementById('filterForm');
    if (!f) return;
    const apply = () => {
      const fd = new FormData(f);
      location.hash = link({ shops: fd.getAll('shop').join(','), deals: fd.get('deals') ? '1' : '', instock: fd.get('instock') ? '1' : '', free: fd.get('free') ? '1' : '', min: fd.get('min') || '', max: fd.get('max') || '', finish: fd.get('finish') || '' });
    };
    f.addEventListener('change', e => { if (e.target.type === 'checkbox' || e.target.type === 'radio') apply(); });
    f.addEventListener('submit', e => { e.preventDefault(); apply(); });
    const t = document.getElementById('toggleFilters');
    t && t.addEventListener('click', () => f.classList.toggle('open'));
  });

  return `<div class="wrap">
    <div class="page-head">
      <div class="crumbs"><a href="#/">Home</a> › ${c ? `<a href="#/shop">All categories</a> › ${esc(L(c, 'name'))}` : 'All categories'}</div>
      <h1>${c ? esc(c.name) : term ? `Results for “${esc(q.q)}”` : 'All Pilimathalawa brass'}</h1>
    </div>
    <div class="shop-layout">
      <form class="filters" id="filterForm">
        <div class="fgroup"><h4>Category</h4>
          <a class="flink ${!cat ? 'on' : ''}" href="${link({ cat: '' })}">All categories</a>
          ${liveCategories().map(x => `<a class="flink ${cat === x.id ? 'on' : ''}" href="${link({ cat: x.id })}">${esc(L(x, 'name'))} <span class="muted">(${countIn(x.id)})</span></a>`).join('')}
        </div>
        <div class="fgroup"><h4>Price</h4>
          <div style="display:flex;gap:6px;align-items:center"><input class="input" name="min" type="number" min="0" placeholder="Rs. min" value="${esc(q.min || '')}" style="min-height:36px"><span>to</span><input class="input" name="max" type="number" min="0" placeholder="Rs. max" value="${esc(q.max || '')}" style="min-height:36px"></div>
          <button class="btn btn-ghost btn-sm" style="margin-top:8px">Apply</button>
        </div>
        <div class="fgroup"><h4>Buying options</h4>
          <label class="chk"><input type="checkbox" name="deals" ${q.deals ? 'checked' : ''}> On sale</label>
          <label class="chk"><input type="checkbox" name="instock" ${q.instock ? 'checked' : ''}> In stock only</label>
          <label class="chk"><input type="checkbox" name="free" ${q.free ? 'checked' : ''}> Free delivery</label>
        </div>
        <div class="fgroup"><h4>Finish</h4>
          ${[['', 'Any'], ['natural', 'Natural brass'], ['gold', 'Gold plated'], ['antique', 'Antique']].map(([v, l]) => `<label class="chk"><input type="radio" name="finish" value="${v}" ${(q.finish || '') === v ? 'checked' : ''}> ${l}</label>`).join('')}
        </div>
        <div class="fgroup" style="border:0"><h4>Seller</h4>
          ${Store.publishedShops().map(s => `<label class="chk"><input type="checkbox" name="shop" value="${s.id}" ${shopsSel.includes(s.id) ? 'checked' : ''}> ${esc(L(s, 'name'))}</label>`).join('')}
        </div>
      </form>
      <div>
        <div class="result-bar">
          <span><b>${list.length}</b> results${c ? ` in ${esc(L(c, 'name'))}` : ''} <button type="button" class="btn btn-ghost btn-sm" id="toggleFilters" style="margin-left:8px">Filters</button></span>
          <div class="sort">
            <label for="sortSel">Sort:</label>
            <select id="sortSel" onchange="location.hash='${link({ sort: '' }).replace(/'/g, "\\'")}&sort='+this.value">
              ${[['best', 'Best match'], ['popular', 'Most popular'], ['ending', 'Ending soonest'], ['discount', 'Biggest discount'], ['low', 'Price: lowest first'], ['high', 'Price: highest first'], ['new', 'Newly listed'], ['rating', 'Top rated']].map(([v, l]) => `<option value="${v}" ${sort === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
            <span class="view-toggle"><a href="${link({ view: 'grid' })}" class="${view === 'grid' ? 'on' : ''}" aria-label="Gallery view">${icon('grid')}</a><a href="${link({ view: 'list' })}" class="${view === 'list' ? 'on' : ''}" aria-label="List view">${icon('menu')}</a></span>
          </div>
        </div>
        ${activeFilters.length ? `<div class="chips" style="margin-bottom:14px">${activeFilters.map(([k, l]) => `<a class="chip" href="${link(k === 'min' ? { min: '', max: '' } : k === 'shops' ? { shops: '' } : { [k]: '' })}">${esc(l)} ✕</a>`).join('')}<a class="link" href="#/shop${cat ? '?cat=' + cat : ''}" style="align-self:center;font-size:.88rem">Clear all</a></div>` : ''}
        ${list.length ? (view === 'list' ? `<div class="list-view">${list.map(listRow).join('')}</div>` : `<div class="grid">${list.map(p => productCard(p)).join('')}</div>`)
          : `<div class="empty card"><h3>No exact matches found</h3><p>Try fewer words, check the spelling, or remove a filter. You can also search for “pahana”, “karaduwa” or “kendiya”.</p><a class="btn btn-brass" href="#/shop">See all products</a></div>`}
      </div>
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
  const tab = q.tab || 'desc';
  const sold = Store.soldOut(p);
  const deal = Store.dealActive(p);
  const price = Store.priceOf(p);
  const st = Store.s.settings;
  const reviews = Store.s.reviews.filter(r => r.productId === p.id);
  const rivals = Store.liveProducts().filter(x => x.category === p.category && x.shopId !== p.shopId);
  const compare = [p, ...rivals].sort((a, b) => Store.priceOf(a) - Store.priceOf(b));
  const more = Store.liveProducts().filter(x => x.shopId === p.shopId && x.id !== p.id).slice(0, 10);
  const shopSold = Store.s.products.filter(x => x.shopId === shop.id).reduce((a, x) => a + x.sold, 0);
  const free = price >= st.freeDeliveryOver;
  const eta = fmtDay(Date.now() + 3 * 864e5);
  const eta2 = fmtDay(Date.now() + 6 * 864e5);

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
      if (!fd.get('name') || !fd.get('text')) { toast('Add your name and a few words about the item.', true); return; }
      Store.s.reviews.unshift({ id: 'rv' + Date.now(), productId: p.id, shopId: p.shopId, name: fd.get('name'), rating: +fd.get('rating'), text: fd.get('text'), at: Date.now() });
      p.reviews++; p.rating = Math.round(((p.rating * (p.reviews - 1)) + +fd.get('rating')) / p.reviews * 10) / 10;
      Store.save(); toast('Thank you — your review is published.'); App.render();
    });
  });

  const tabBase = `#/product/${p.id}?tab=`;
  return `<div class="wrap">
    <div class="page-head" style="padding-bottom:8px"><div class="crumbs"><a href="#/">Home</a> › <a href="#/shop?cat=${p.category}">${esc(L(Store.cat(p.category), 'name'))}</a> › ${esc(L(p, 'name'))}</div></div>
    <div class="pdp">
      <div class="gallery">
        <div class="thumbs">${p.images.map((im, i) => `<button data-thumb="${esc(im)}" class="${i ? '' : 'on'}" aria-label="Photo ${i + 1}"><img src="${esc(im)}" alt=""></button>`).join('')}</div>
        <div class="gallery-main" id="gMain" title="Click to zoom"><img src="${esc(p.images[0])}" alt="${esc(L(p, 'name'))}">${sold ? sealHTML(true) : ''}</div>
      </div>
      <div class="pdp-info">
        <h1>${esc(L(p, 'name'))}</h1>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:.9rem">
          <a href="${tabBase}reviews" class="rating">${stars(p.rating)} <span class="link">${p.reviews} product ratings</span></a>
          ${p.sold ? `<span class="sold-line ${p.sold >= 40 ? 'hot' : ''}">${p.sold} sold</span>` : ''}
          ${p.views > 300 ? `<span class="muted">${Math.round(p.views / 30)} viewed in the last 24 hours</span>` : ''}
        </div>
        <div class="seller-box">${shopLogo(shop)}<div style="flex:1"><b><a href="#/store/${shop.id}">${esc(L(shop, 'name'))}</a></b> <span class="muted">(${shopSold.toLocaleString()})</span><br><span class="feedback"><b>${feedbackPct(shop)}%</b> positive feedback</span></div>
          <a class="btn btn-ghost btn-sm" href="#/store/${shop.id}">Seller's other items</a></div>
        <div class="pdp-price"><b>${money(price)}</b>${deal ? `<span class="muted">Was <s>${money(p.price)}</s></span><span class="save-pill">Save ${money(p.price - price)} (${p.discount}% off)</span>` : ''}</div>
        ${Store.isFlash(p) && !sold ? `<div class="deal-box"><span><b>Deal ends in</b><br><small class="muted">Price returns to ${money(p.price)} after the timer</small></span>${bigTimer(p.dealEnds)}</div>` : ''}
        <dl class="kv">
          <dt>Condition</dt><dd><b>New</b> — handmade in Pilimathalawa</dd>
          <dt>Finish</dt><dd>${esc(p.finish)}</dd>
          <dt>Quantity</dt><dd>${sold ? '<b style="color:var(--sale)">Sold out</b>' : `<div class="qty"><button data-q="-1" aria-label="Less">−</button><input id="qty" value="1" inputmode="numeric" aria-label="Quantity"><button data-q="1" aria-label="More">+</button></div> <span class="${p.stock <= 3 ? 'low-stock' : 'muted'}" style="margin-left:8px">${p.stock <= 3 ? `Only ${p.stock} left` : `${p.stock} available`}</span>`}</dd>
        </dl>
        <div class="buy-col">
          ${sold ? `<button class="btn btn-brass" data-action="notify" data-id="${p.id}">${icon('bell')} Notify me when back in stock</button>
                    <a class="btn btn-outline" href="#/shop?cat=${p.category}">See similar items</a>`
                 : `<button class="btn btn-brass" data-action="buy-now" data-id="${p.id}">Buy it now — cash on delivery</button>
                    <button class="btn btn-outline" data-action="add-qty" data-id="${p.id}">Add to cart</button>`}
          <button class="btn btn-ghost" data-action="wish" data-id="${p.id}">${icon('heart')} ${Store.s.wishlist.includes(p.id) ? 'Watching this item' : 'Add to watchlist'}</button>
        </div>
        <dl class="kv">
          <dt>Delivery</dt><dd>${free ? '<b class="ship free">Free delivery</b>' : `<b>${esc(`${money(st.deliveryKandy)} in Kandy district, ${money(st.deliveryOther)} elsewhere`)}</b>`}<br><span class="muted">${esc(`Estimated between ${eta} and ${eta2}`)}</span></dd>
          <dt>Located in</dt><dd>${esc(shop.address)}</dd>
          <dt>Payment</dt><dd><span class="badge green">${icon('coins')} Cash on delivery</span> <span class="muted">The seller confirms with you on WhatsApp first.</span></dd>
          <dt>Questions</dt><dd><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(shop.whatsapp, `Hello ${shop.name}, I'm interested in "${p.name}" (${money(price)}) on Pittala.lk. Is it available?`)}">${icon('wa')} Ask the seller on WhatsApp</a></dd>
        </dl>
      </div>
    </div>

    <div class="tabs" role="tablist">
      ${[['desc', 'Item description'], ['specs', 'Item specifics'], ['reviews', `Ratings & reviews (${reviews.length})`], ['ship', 'Delivery & returns']].map(([k, l]) => `<button role="tab" class="${tab === k ? 'on' : ''}" onclick="location.hash='${tabBase}${k}'">${l}</button>`).join('')}
    </div>
    ${tab === 'desc' ? `<div class="dash-grid"><div><p style="font-size:1.02rem;max-width:72ch">${esc(L(p, 'description'))}</p><p class="muted">${esc(`Made by ${L(shop, 'name')}, ${shop.address}. Every piece is finished by hand, so small variations in pattern and colour are normal.`)}</p></div>
      <a class="shop-mini" href="#/store/${shop.id}" style="align-self:start">${shopLogo(shop)}<div><b>${esc(L(shop, 'name'))}</b><br><small class="muted">${esc(L(shop, 'tagline'))}</small><div style="margin-top:6px">${badgeRow(shop)}</div></div></a></div>` : ''}
    ${tab === 'specs' ? `<dl class="specs" style="max-width:640px"><dt>Category</dt><dd>${esc(L(Store.cat(p.category), 'name'))}</dd><dt>Material</dt><dd>${esc(p.material)}</dd>${p.dimensions ? `<dt>Size</dt><dd>${esc(p.dimensions)}</dd>` : ''}${p.weight ? `<dt>Weight</dt><dd>${esc(p.weight)}</dd>` : ''}<dt>Finish</dt><dd>${esc(p.finish)}</dd><dt>Made in</dt><dd>Pilimathalawa, Kandy, Sri Lanka</dd><dt>Seller</dt><dd>${esc(L(shop, 'name'))}</dd></dl>` : ''}
    ${tab === 'reviews' ? `<div class="dash-grid">
        <div>${reviews.length ? reviews.map(r => `<div style="padding:12px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between"><b>${esc(L(r, 'name'))}</b><small class="muted">${fmtDate(r.at)}</small></div>${stars(r.rating)}<p style="margin:6px 0 0">${esc(r.text)}</p></div>`).join('') : '<p class="muted">No reviews yet. Bought this item? Tell other buyers how it turned out.</p>'}</div>
        <form class="card" id="reviewForm"><h3>Write a review</h3>
          <div class="field"><label for="rn">Your name</label><input class="input" id="rn" name="name" required></div>
          <div class="field" style="margin-top:10px"><label for="rr">Rating</label><select class="input" id="rr" name="rating">${[5, 4, 3, 2, 1].map(n => `<option value="${n}">${'★'.repeat(n)} ${n}</option>`).join('')}</select></div>
          <div class="field" style="margin-top:10px"><label for="rt">Review</label><textarea class="input" id="rt" name="text" required></textarea></div>
          <button class="btn btn-brass" style="margin-top:12px">Publish review</button>
        </form></div>` : ''}
    ${tab === 'ship' ? `<div style="max-width:72ch"><p>${esc(`Delivery: ${money(st.deliveryKandy)} within Kandy district and ${money(st.deliveryOther)} to other districts. Free on orders over ${money(st.freeDeliveryOver)} from one shop.`)}</p><p>Payment: cash on delivery only. You pay the courier when the parcel reaches you.</p><p>Confirmation: the seller contacts you on WhatsApp to confirm the order before dispatch.</p><p>Returns: if an item arrives damaged, message the seller within 3 days with a photo.</p></div>` : ''}

    ${compare.length > 1 ? `<section class="block">
      ${sectionHead('Compare prices from other sellers', 'Same category, different workshops')}
      <div class="table-wrap"><table class="compare-table">
        <thead><tr><th>Item</th><th>Seller</th><th>Price</th><th>Rating</th><th>Availability</th><th></th></tr></thead>
        <tbody>${compare.slice(0, 6).map(x => { const s = Store.shop(x.shopId); return `<tr class="${x.id === p.id ? 'me' : ''}">
          <td><a href="#/product/${x.id}" style="display:flex;gap:10px;align-items:center"><img class="t-img" src="${esc(x.images[0])}" alt="">${esc(L(x, 'name'))}</a></td>
          <td>${esc(L(s, 'name'))}</td>
          <td><b>${money(Store.priceOf(x))}</b>${Store.dealActive(x) ? ` <span class="badge red">${x.discount}% off</span>` : ''}</td>
          <td>${stars(x.rating)}</td>
          <td>${Store.soldOut(x) ? '<span class="badge red">Sold out</span>' : `${x.stock} available`}</td>
          <td>${x.id === p.id ? '<small class="muted">This item</small>' : `<a class="btn btn-ghost btn-sm" href="#/product/${x.id}">View</a>`}</td></tr>`; }).join('')}</tbody>
      </table></div>
    </section>` : ''}
    ${rivals.length ? `<section class="block" style="padding-top:0">${sectionHead('Similar items from other sellers')}<div class="hscroll">${rivals.slice(0, 10).map(x => productCard(x)).join('')}</div></section>` : ''}
    ${more.length ? `<section class="block" style="padding-top:0">${sectionHead(`More from ${esc(L(shop, 'name'))}`, '', `<a class="link-more" href="#/store/${shop.id}">Visit shop</a>`)}<div class="hscroll">${more.map(x => productCard(x, { hideShop: true })).join('')}</div></section>` : ''}
  </div>`;
};

/* =================== SHOPS =================== */
Pages.stores = () => {
  const shops = Store.publishedShops().map(s => ({ s, st: Store.shopStats(s.id, 30), prods: Store.liveProducts().filter(p => p.shopId === s.id) })).sort((a, b) => b.st.revenue - a.st.revenue);
  return `<div class="wrap">
    <div class="page-head"><div class="crumbs"><a href="#/">Home</a> › Shops</div><h1>Workshops of Pilimathalawa</h1><p class="muted" style="margin:4px 0 0">Every shop is a family workshop in the village, approved by the region agent and the platform.</p></div>
    <div class="seller-row" style="margin-bottom:34px">${shops.map((x, i) => storeCard(x, i)).join('')}</div>
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
  const sold = prods.reduce((a, p) => a + p.sold, 0);
  return `<div style="--shop-c:${esc(s.color)}">
    ${q.preview ? `<div class="notice" style="margin:0;border-radius:0;text-align:center">This is a preview of your shop page.${s.status !== 'published' ? ' Buyers will see it after final approval.' : ''}</div>` : ''}
    <div class="wrap">
      <section class="store-hero"><img src="${esc(s.banner)}" alt=""></section>
      <div class="store-head f-${esc(s.font)}">
        <div class="store-logo">${esc(initials(s.name))}</div>
        <div><h1>${esc(L(s, 'name'))}</h1><div>${esc(L(s, 'tagline'))}</div>
          <div class="store-meta"><span class="feedback"><b>${feedbackPct(s) || '—'}%</b> positive feedback</span><span>${sold.toLocaleString()} items sold</span><span>Est. ${esc(s.est)}</span><span>${esc(s.address)}</span></div></div>
        <div class="store-actions">
          <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(s.whatsapp, `Hello ${s.name}, I found your shop on Pittala.lk.`)}">${icon('wa')} Contact on WhatsApp</a>
          <a class="btn btn-ghost" href="tel:${esc(s.phone)}">Call ${esc(s.phone)}</a>
        </div>
      </div>
      ${s.announcement ? `<div class="store-announce">${esc(L(s, 'announcement'))}</div>` : ''}
      <div style="margin-top:14px">${badgeRow(s)}</div>
      <div class="tabs" role="tablist">
        ${[['products', `Shop (${prods.length})`], ['deals', 'Deals & coupons'], ['about', 'About'], ['reviews', `Feedback (${reviews.length})`]].map(([k, l]) => `<button role="tab" class="${tab === k ? 'on' : ''}" onclick="location.hash='${base}tab=${k}'">${l}</button>`).join('')}
      </div>
      <div class="layout-${esc(s.layout)}">
      ${tab === 'products' ? `
        <div class="chips" style="margin-bottom:18px"><a class="chip ${!cat ? 'on' : ''}" href="${base}tab=products">All items</a>${cats.map(c => `<a class="chip ${cat === c ? 'on' : ''}" href="${base}tab=products&cat=${c}">${esc(L(Store.cat(c), 'name'))}</a>`).join('')}</div>
        ${list.length ? `<div class="grid">${list.map(p => productCard(p, { hideShop: true })).join('')}</div>` : '<div class="empty card"><h3>No items listed yet</h3></div>'}` : ''}
      ${tab === 'deals' ? `
        ${coupons.length ? `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));margin-bottom:24px">${coupons.map(couponCard).join('')}</div>` : ''}
        ${prods.filter(p => Store.dealActive(p)).length ? `<div class="grid">${prods.filter(p => Store.dealActive(p)).map(p => productCard(p, { hideShop: true })).join('')}</div>` : '<div class="empty card"><h3>No deals running right now</h3><p>Add items to your watchlist to catch the next one.</p></div>'}` : ''}
      ${tab === 'about' ? `<div class="dash-grid"><div class="card"><h3>About ${esc(L(s, 'name'))}</h3><p style="font-size:1.02rem">${esc(L(s, 'story'))}</p></div>
        <div class="card"><h3>Visit or call</h3><dl class="specs" style="grid-template-columns:110px 1fr"><dt>Address</dt><dd>${esc(s.address)}</dd><dt>Hours</dt><dd>${esc(s.hours)}</dd><dt>Phone</dt><dd>${esc(s.phone)}</dd><dt>Artisans</dt><dd>${esc(s.artisans)}</dd><dt>Established</dt><dd>${esc(s.est)}</dd></dl>
        <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/${encodeURIComponent(s.address + ', Sri Lanka')}">${icon('map')} Open in Google Maps</a></div></div>` : ''}
      ${tab === 'reviews' ? `<div class="card">${reviews.length ? reviews.map(r => { const p = Store.product(r.productId); return `<div style="padding:12px 0;border-bottom:1px solid var(--line)"><b>${esc(L(r, 'name'))}</b> ${stars(r.rating)} <small class="muted">${fmtDate(r.at)}</small><br><small>on <a class="link" href="#/product/${p.id}">${esc(L(p, 'name'))}</a></small><p style="margin:6px 0 0">${esc(r.text)}</p></div>`; }).join('') : '<p class="muted">No feedback yet.</p>'}</div>` : ''}
      </div>
      ${rivals.length ? `<section class="block">${sectionHead('Other shops making similar items')}
        <div class="seller-row">${rivals.slice(0, 4).map(x => storeCard({ s: x, st: Store.shopStats(x.id), prods: Store.liveProducts().filter(p => p.shopId === x.id) })).join('')}</div></section>` : ''}
    </div>
  </div>`;
};

function couponCard(c) {
  const s = Store.shop(c.shopId);
  return `<div class="card" style="border:2px dashed var(--gold);display:grid;gap:4px">
    <small class="muted">${esc(L(s, 'name'))}</small>
    <b style="font-size:1.5rem;color:var(--maroon)">${c.type === 'pct' ? `${c.value}% off` : `${money(c.value)} off`}</b>
    <small>On orders over ${money(c.minOrder)} · ends ${fmtDate(c.expires)}</small>
    <button class="btn btn-ghost btn-sm" data-action="copy" data-text="${esc(c.code)}" style="margin-top:6px">${icon('copy')} Copy code <b>${esc(c.code)}</b></button>
  </div>`;
}

/* =================== DEALS =================== */
Pages.deals = (q) => {
  const deals = Store.liveProducts().filter(p => Store.dealActive(p));
  const flash = deals.filter(p => Store.isFlash(p) && !Store.soldOut(p)).sort((a, b) => a.dealEnds - b.dealEnds);
  const sort = q.sort || 'ending';
  const cat = q.cat || '';
  const other = deals.filter(p => !cat || p.category === cat).sort(sort === 'biggest' ? (a, b) => b.discount - a.discount : sort === 'low' ? (a, b) => Store.priceOf(a) - Store.priceOf(b) : (a, b) => (a.dealEnds || 9e15) - (b.dealEnds || 9e15));
  const coupons = Store.s.coupons.filter(c => c.expires > Date.now() && Store.shop(c.shopId).status === 'published');
  const byShop = Store.publishedShops().map(s => ({ s, items: deals.filter(p => p.shopId === s.id) })).filter(x => x.items.length).sort((a, b) => b.items.length - a.items.length);
  const dl = patch => '#/deals?' + new URLSearchParams(Object.fromEntries(Object.entries({ ...q, ...patch }).filter(([, v]) => v))).toString();
  return `<div class="wrap">
    <div class="page-head"><div class="crumbs"><a href="#/">Home</a> › Deals</div>
      <div class="sec-head" style="margin:0"><div><h1>Daily deals</h1><p class="muted" style="margin:4px 0 0">${deals.length} items on sale from ${byShop.length} workshops. Shops set their own deals and compete on price.</p></div>${flash[0] ? `<div><small class="muted">Next deal ends in</small>${bigTimer(flash[0].dealEnds)}</div>` : ''}</div></div>
    ${flash.length ? `<section class="block" style="padding-top:10px">${sectionHead('Ending soon')}<div class="hscroll">${flash.map(p => productCard(p)).join('')}</div></section>` : ''}
    ${coupons.length ? `<section class="block" style="padding-top:0">${sectionHead('Shop coupons', 'Enter the code in your cart. Each code works with its own shop.')}<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${coupons.map(couponCard).join('')}</div></section>` : ''}
    <section class="block" style="padding-top:0">
      <div class="result-bar"><div class="chips"><a class="chip ${!cat ? 'on' : ''}" href="${dl({ cat: '' })}">All</a>${CATEGORIES.filter(c => deals.some(p => p.category === c.id)).map(c => `<a class="chip ${cat === c.id ? 'on' : ''}" href="${dl({ cat: c.id })}">${esc(L(c, 'name'))}</a>`).join('')}</div>
        <div class="sort"><label for="dsort">Sort:</label><select id="dsort" onchange="location.hash='${dl({ sort: '' })}&sort='+this.value"><option value="ending" ${sort === 'ending' ? 'selected' : ''}>Ending soonest</option><option value="biggest" ${sort === 'biggest' ? 'selected' : ''}>Biggest discount</option><option value="low" ${sort === 'low' ? 'selected' : ''}>Lowest price</option></select></div></div>
      <div class="grid">${other.map(p => productCard(p)).join('')}</div>
    </section>
    <section class="block" style="padding-top:0">${sectionHead('Deals by shop')}
      ${byShop.map(({ s, items }) => `<div style="margin-bottom:24px"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap">${shopLogo(s)}<div style="flex:1"><b>${esc(L(s, 'name'))}</b><br><small class="muted">${items.length} deal${items.length > 1 ? 's' : ''} · up to ${Math.max(...items.map(i => i.discount))}% off</small></div><a class="link-more" href="#/store/${s.id}?tab=deals">See the shop's deals</a></div>
        <div class="hscroll">${items.map(p => productCard(p, { hideShop: true })).join('')}</div></div>`).join('')}
    </section>
  </div>`;
};

/* =================== ABOUT =================== */
Pages.about = () => `<div class="wrap" style="max-width:960px;padding-bottom:20px">
    <div class="page-head"><div class="crumbs"><a href="#/">Home</a> › About</div><h1 class="serif" style="font-size:2.2rem">The brass craft of Pilimathalawa</h1></div>
    <img src="${PW.lampKandy}" alt="Brass oil lamp made in the Kandy area" style="border-radius:14px;width:100%;aspect-ratio:21/9;object-fit:cover;margin-bottom:24px">
    <div style="max-width:72ch;font-size:1.05rem">
      <p>Pilimathalawa is a town about 10 km from Kandy on the road to Kadugannawa. It sits close to the Gadaladeniya, Lankathilaka and Embekka temples, and it has long been known for traditional udarata brassware.</p>
      <p>Two kinds of work are done here. Cast work — oil lamps, Buddha statues, karaduwa and kendiya — is made by pouring molten brass into sand moulds. Sheet work — caskets, trays and pettagama — is beaten and chased by hand into patterns such as the liyawela vine and the lotus.</p>
      <p>Many workshops are small family businesses that have sold through middlemen for years. Pittala.lk lets them reach buyers directly: the shop sets its price, packs the order and collects cash on delivery.</p>
      <h2 style="margin:30px 0 10px">Caring for brass</h2>
      <p>Wipe brass with a dry cloth after use. To remove soot and tarnish from oil lamps, use a paste of tamarind or lime with a little salt, then rinse and dry well. Gold-plated and antique finishes should only be dusted.</p>
    </div>
    <div class="promo-row" style="margin-top:20px">
      <a class="promo" href="#/shop?cat=oil-lamps"><img src="${PW.lampsTemple}" alt="" loading="lazy"><div><b>Oil lamps</b><span>Pahan for home and temple</span></div></a>
      <a class="promo" href="#/shop?cat=pooja"><img src="${PW.lampsBuddhist}" alt="" loading="lazy"><div><b>Pooja items</b><span>For the shrine room</span></div></a>
      <a class="promo" href="#/shop?cat=buddha"><img src="${PW.buddhaBrass}" alt="" loading="lazy"><div><b>Buddha statues</b><span>Cast in brass</span></div></a>
    </div>
  </div>`;
Pages.craft = Pages.about;

/* =================== SELL =================== */
Pages.sell = () => {
  const st = Store.s.settings;
  const r = Store.s.regions[0];
  const features = [
    ['store', 'Your own shop page', 'Banner, colours, layout, story and an announcement bar that you control.'],
    ['tag', 'Deals with countdown timers', 'Your deals appear in Daily Deals on the home page while the timer runs.'],
    ['coins', 'Shop coupons', 'Create codes like VESAK10 with a minimum order and an end date.'],
    ['target', 'See competitor prices', 'Compare your prices with other shops selling the same kind of item.'],
    ['wa', 'One-click WhatsApp confirmation', 'Every order comes with a ready-to-send WhatsApp message for the buyer.'],
    ['mail', 'Order emails', 'You and the buyer get an email the moment an order is placed.'],
    ['chart', 'Sales dashboard', 'Daily sales, best sellers, order status and your commission statement.'],
    ['bolt', 'Home page spotlight', 'Ask for your best item to be featured on the home page.']
  ];
  return `<div class="wrap">
    <div class="page-head"><div class="crumbs"><a href="#/">Home</a> › Sell on Pittala</div><h1>Sell your brassware to all of Sri Lanka</h1><p class="muted" style="margin:6px 0 0;max-width:64ch">${esc(`Shops in the ${r.name} region are onboarded by our region agent, ${Store.userById(r.agentUserId).name}.`)}</p></div>
    <div class="dash-grid even">
      <div class="card"><h3>How to open your shop</h3>
        <div class="pipeline" style="grid-template-columns:1fr;row-gap:16px;margin:8px 0 18px">
          <div class="pipe done"><b>1. Apply and sign the agreement online</b><span>Shop details, owner details and the commission agreement.</span></div>
          <div class="pipe done"><b>2. Pay the ${money(st.regFee)} registration fee</b><span>Deposit to the region agent and enter the reference.</span></div>
          <div class="pipe done"><b>3. Region agent confirms your payment</b><span>Usually within 1–2 working days.</span></div>
          <div class="pipe current"><b>4. Platform gives final approval</b><span>Your shop goes live and you start selling.</span></div>
        </div>
        <a class="btn btn-brass" href="#/register">Start your application</a></div>
      <div class="sell-photo" style="border-radius:16px;overflow:hidden;min-height:320px"><img src="${PW.lampTemple}" alt="" loading="lazy"></div>
    </div>
    <section class="block">${sectionHead('What every shop gets')}
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${features.map(([i, t, d]) => `<div class="card" style="margin:0;border-top:3px solid var(--gold)"><h3 style="margin:0 0 4px;font-size:1.05rem">${t}</h3><p class="muted" style="margin:0;font-size:.93rem">${d}</p></div>`).join('')}</div>
    </section>
    <section class="block" style="padding-top:0"><div class="card"><h3>Common questions</h3>
      ${[['Who handles delivery?', 'You do, using your usual courier. You collect the cash on delivery and keep the delivery fee shown to the buyer.'],
         ['Can I still sell in my shop and elsewhere?', 'Yes. The agreement covers only orders placed through Pittala.lk.'],
         ['How do I know an order is genuine?', 'Every order includes the buyer’s verified mobile number. Use the WhatsApp button in your dashboard to confirm before you dispatch.']]
        .map(([a, b]) => `<details style="padding:12px 0;border-bottom:1px solid var(--line)"><summary style="font-weight:600;cursor:pointer">${a}</summary><p style="margin:8px 0 0" class="muted">${b}</p></details>`).join('')}
    </div></section>
  </div>`;
};

Pages.notFound = () => `<div class="wrap"><div class="empty" style="padding:90px 20px"><h1>We couldn’t find this page</h1><p>The link may be old, or the item may no longer be listed.</p><a class="btn btn-brass" href="#/">Go to the home page</a></div></div>`;
