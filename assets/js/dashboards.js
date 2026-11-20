/* Dashboards for every role */

const ROLE_LABEL = { super: 'Super admin', agent: 'Region agent', owner: 'Shop owner', customer: 'Buyer' };
let charts = [];
function chart(id, cfg) {
  onMount(() => {
    const el = document.getElementById(id);
    if (!el || !window.Chart) return;
    const css = getComputedStyle(document.documentElement);
    Chart.defaults.color = css.getPropertyValue('--ink-3').trim() || '#7B8783';
    Chart.defaults.borderColor = css.getPropertyValue('--line').trim() || '#D9E0DA';
    Chart.defaults.font.family = 'Manrope, system-ui, sans-serif';
    if (cfg.data) {
      if (cfg.data.labels) cfg.data.labels = cfg.data.labels.map(l => tr(String(l)));
      (cfg.data.datasets || []).forEach(d => { if (d.label) d.label = tr(d.label); });
    }
    charts.push(new Chart(el, cfg));
  });
}
function destroyCharts() { charts.forEach(c => { try { c.destroy(); } catch (e) {} }); charts = []; }

const BRASS = '#B8862B', PATINA = '#7B1C1C', LACQ = '#C8102E';
const kpi = (label, value, sub = '', cls = '') => `<div class="kpi ${cls}"><span>${label}</span><b>${value}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;

function dailySeries(orders, days = 30, valueFn = o => o.subtotal) {
  const labels = [], data = [];
  const start = new Date(); start.setHours(0, 0, 0, 0);
  for (let d = days - 1; d >= 0; d--) {
    const from = start.getTime() - d * 864e5, to = from + 864e5;
    labels.push(fmtShort(from));
    data.push(orders.filter(o => o.status !== 'cancelled' && o.createdAt >= from && o.createdAt < to).reduce((a, o) => a + valueFn(o), 0));
  }
  return { labels, data };
}
const lineCfg = (labels, sets) => ({
  type: 'line',
  data: { labels, datasets: sets.map(s => ({ tension: .35, fill: !!s.fill, pointRadius: 0, borderWidth: 2, ...s })) },
  options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: sets.length > 1 } }, scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { ticks: { callback: v => v >= 1000 ? (v / 1000) + 'k' : v } } } }
});
const barCfg = (labels, data, color = BRASS, horizontal = false) => ({
  type: 'bar', data: { labels, datasets: [{ data, backgroundColor: color, borderRadius: 6 }] },
  options: { indexAxis: horizontal ? 'y' : 'x', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: !horizontal } } } }
});
const doughnutCfg = (labels, data, colors) => ({ type: 'doughnut', data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { position: 'bottom' } } } });

/* ---------------- Layout ---------------- */
function navFor(u) {
  const pendingApps = Store.s.shops.filter(s => s.status === 'pending_payment' && s.regionId === u.regionId).length;
  const finalApps = Store.s.shops.filter(s => s.status === 'agent_approved').length;
  const myOrdersPending = u.shopId ? Store.s.orders.filter(o => o.shopId === u.shopId && o.status === 'pending').length : 0;
  const spotPending = Store.s.spotlights.filter(s => s.status === 'pending').length;
  if (u.role === 'super') return [
    ['grp', 'Platform'], ['overview', 'Overview', 'chart'], ['approvals', 'Final approvals', 'check', finalApps], ['shops', 'All shops', 'store'], ['regions', 'Regions & agents', 'map'],
    ['grp', 'Trade'], ['orders', 'All orders', 'box'], ['buyers', 'Buyers', 'users'], ['products', 'Products', 'grid'], ['commissions', 'Commissions', 'coins'], ['spotlights', 'Spotlight requests', 'bolt', spotPending],
    ['grp', 'System'], ['outbox', 'Email outbox', 'mail'], ['activity', 'Activity log', 'doc'], ['settings', 'Settings', 'settings']];
  if (u.role === 'agent') return [
    ['grp', `Region · ${Store.region(u.regionId).name}`], ['overview', 'Region overview', 'chart'], ['applications', 'Shop applications', 'check', pendingApps], ['region-shops', 'Region shops', 'store'], ['region-orders', 'Region orders', 'box'], ['collections', 'Commission collection', 'coins'],
    ['grp', 'My shop'], ['shop', 'My shop sales', 'chart'], ['products', 'Products', 'grid'], ['orders', 'Orders', 'box', myOrdersPending], ['deals', 'Deals & coupons', 'tag'], ['design', 'Shop design', 'brush'], ['insights', 'Competitor insights', 'target'], ['statement', 'Statement & agreement', 'doc']];
  if (u.role === 'owner' && Store.shop(u.shopId)?.status !== 'published') return [
    ['grp', 'Application'], ['overview', 'Application status', 'check'], ['statement', 'My agreement', 'doc'],
    ['grp', 'Get ready'], ['products', 'Prepare products', 'grid'], ['design', 'Shop design', 'brush'], ['profile', 'Contact details', 'settings']];
  if (u.role === 'owner') return [
    ['grp', 'My shop'], ['overview', 'Overview', 'chart'], ['products', 'Products', 'grid'], ['orders', 'Orders', 'box', myOrdersPending], ['deals', 'Deals & coupons', 'tag'], ['design', 'Shop design', 'brush'], ['insights', 'Competitor insights', 'target'], ['reviews', 'Reviews', 'star'], ['statement', 'Statement & agreement', 'doc'], ['profile', 'Contact details', 'settings']];
  return [['grp', 'My account'], ['orders', 'My orders', 'box'], ['profile', 'Profile', 'user']];
}

Pages.dashboard = (q, section) => {
  const u = Store.user();
  if (!u) { location.hash = '#/login?next=' + encodeURIComponent(location.hash); return ''; }
  const nav = navFor(u);
  const first = nav.find(n => n[0] !== 'grp')[0];
  section = section || first;
  const views = DashViews[u.role];
  const view = views[section] || views[first];
  const shop = u.shopId ? Store.shop(u.shopId) : null;
  return `<div class="dash">
    <aside class="dash-side">
      <div class="dash-user"><span class="avatar">${esc(initials(u.name))}</span><div><b>${esc(L(u, 'name'))}</b><span>${ROLE_LABEL[u.role]}${shop ? ` · ${esc(L(shop, 'name'))}` : ''}</span></div></div>
      <nav class="dash-nav">
        ${nav.map(n => n[0] === 'grp' ? `<div class="grp">${esc(n[1])}</div>` : `<a href="#/dashboard/${n[0]}" class="${section === n[0] ? 'on' : ''}">${icon(n[2])} ${n[1]}${n[3] ? `<span class="pill">${n[3]}</span>` : ''}</a>`).join('')}
        <div class="grp">Account</div>
        ${shop && shop.status === 'published' ? `<a href="#/store/${shop.id}">${icon('eye')} View my shop</a>` : ''}
        <a href="#/" >${icon('store')} Marketplace</a>
        <a href="#" data-action="logout">${icon('out')} Sign out</a>
      </nav>
    </aside>
    <main class="dash-main">${view(q, u)}</main>
  </div>`;
};

const head = (title, sub = '', actions = '') => `<div class="dash-title"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="row-actions">${actions}</div></div>`;

/* ---------------- Shared: orders ---------------- */
function ordersTable(orders, q, opts = {}) {
  const f = q.status || 'all';
  const term = (q.q || '').toLowerCase();
  const list = orders.filter(o => (f === 'all' || o.status === f) && (!term || (o.id + o.customer.name + o.customer.phone + o.customer.city).toLowerCase().includes(term))).sort((a, b) => b.createdAt - a.createdAt);
  const counts = s => orders.filter(o => o.status === s).length;
  const base = location.hash.split('?')[0];
  return `<div class="toolbar">
      <div class="chips">${['all', ...ORDER_FLOW, 'cancelled'].map(s => `<a class="chip ${f === s ? 'on' : ''}" href="${base}?status=${s}">${s === 'all' ? 'All' : STATUS_LABEL[s]} (${s === 'all' ? orders.length : counts(s)})</a>`).join('')}</div>
      <form onsubmit="event.preventDefault();location.hash='${base}?status=${f}&q='+encodeURIComponent(this.elements.q.value)"><input class="input" name="q" placeholder="Search order, name, phone…" value="${esc(q.q || '')}" style="min-width:240px"></form>
    </div>
    ${list.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>Order</th>${opts.showShop ? '<th>Shop</th>' : ''}<th>Buyer</th><th>Items</th><th>Total (COD)</th><th>Status</th><th>WhatsApp</th><th></th></tr></thead><tbody>
      ${list.map(o => `<tr>
        <td><b>${esc(o.id)}</b><br><small class="muted">${fmtDateTime(o.createdAt)}</small></td>
        ${opts.showShop ? `<td>${esc(L(Store.shop(o.shopId), 'name'))}</td>` : ''}
        <td>${esc(L(o.customer, 'name'))}<br><small class="muted">${esc(o.customer.city)}, ${esc(o.customer.district)}</small></td>
        <td>${o.items.map(i => `${i.qty} × ${esc(itemName(i))}`).join('<br>')}</td>
        <td><b>${money(o.total)}</b></td>
        <td>${statusPill(o.status)}</td>
        <td>${o.waSent ? `<span class="badge green">Sent ${ago(o.waSent)}</span>` : o.status === 'pending' ? '<span class="badge amber">Not sent</span>' : '<span class="muted">—</span>'}</td>
        <td><div class="row-actions">${opts.edit ? `<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(o.customer.whatsapp || o.customer.phone, o.status === 'pending' ? Msg.waToBuyer(o) : Msg.waStatus(o))}" data-action="wa-sent" data-id="${o.id}" title="Send WhatsApp">${icon('wa')}</a>` : ''}<button class="btn btn-ghost btn-sm" data-action="order" data-id="${o.id}" data-edit="${opts.edit ? 1 : 0}">Open</button></div></td>
      </tr>`).join('')}</tbody></table></div>` : `<div class="card empty"><h3>No orders here</h3><p>${f === 'pending' ? 'New orders will appear here. You will also get an email.' : 'Try a different filter.'}</p></div>`}`;
}

function openOrder(id, canEdit) {
  const o = Store.s.orders.find(x => x.id === id);
  if (!o) return;
  const shop = Store.shop(o.shopId);
  const c = o.customer;
  const com = Store.commission(shop, o.subtotal);
  const wa = o.status === 'pending' ? Msg.waToBuyer(o) : Msg.waStatus(o);
  const next = ORDER_FLOW[ORDER_FLOW.indexOf(o.status) + 1];
  const emailBody = Msg.email(o);
  openModal({
    title: `Order ${o.id}`, wide: true,
    body: `<div class="dash-grid" style="grid-template-columns:1.2fr 1fr;margin:0">
      <div>
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap">${statusPill(o.status)}<small class="muted">Placed ${fmtDateTime(o.createdAt)} · Cash on delivery</small></div>
        ${o.items.map(i => `<div class="line-item" style="grid-template-columns:56px 1fr auto"><img src="${esc(i.img)}" alt="" style="width:56px;height:56px"><span>${i.qty} × ${esc(itemName(i))}<br><small class="muted">${money(i.price)} each</small></span><b>${money(i.price * i.qty)}</b></div>`).join('')}
        ${o.discount ? `<div class="sum-row"><span>Coupon ${esc(o.coupon)}</span><span>−${money(o.discount)}</span></div>` : ''}
        <div class="sum-row"><span>Delivery fee</span><span>${o.delivery ? money(o.delivery) : 'Free'}</span></div>
        <div class="sum-row total"><span>Collect on delivery</span><span>${money(o.total)}</span></div>
        <div class="card" style="margin-top:14px;background:var(--surface-2)"><b>Commission on this order</b>
          <div class="sum-row"><span>Platform (${com.rates.platform}%)</span><span>${money(com.platform)}</span></div>
          <div class="sum-row"><span>Region agent (${com.rates.agent}%)${com.rates.agent === 0 ? ' — agent’s own shop' : ''}</span><span>${money(com.agent)}</span></div>
          <div class="sum-row"><b>Shop keeps</b><b>${money(com.net + o.delivery)}</b></div>
          <small class="muted">Charged only when delivered.</small></div>
        <h4 style="margin:18px 0 8px;font-family:var(--font-body);font-weight:800">Timeline</h4>
        <ul class="timeline">${o.history.map(h => `<li><b>${STATUS_LABEL[h.s]}</b> <span class="muted">${fmtDateTime(h.at)}</span></li>`).join('')}${o.waSent ? `<li><b>WhatsApp sent to buyer</b> <span class="muted">${fmtDateTime(o.waSent)}</span></li>` : ''}</ul>
      </div>
      <div>
        <div class="card" style="margin-bottom:14px"><b>Buyer</b>
          <dl class="specs" style="grid-template-columns:96px 1fr;margin:10px 0 0;font-size:.88rem">
            <dt>Name</dt><dd>${esc(L(c, 'name'))}</dd><dt>Mobile</dt><dd><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></dd><dt>WhatsApp</dt><dd>${esc(c.whatsapp || c.phone)}</dd><dt>Email</dt><dd>${esc(c.email)}</dd>
            <dt>Address</dt><dd>${esc(Msg.addr(c))}</dd>${c.landmark ? `<dt>Landmark</dt><dd>${esc(c.landmark)}</dd>` : ''}${c.time ? `<dt>Deliver</dt><dd>${esc(c.time)}</dd>` : ''}${c.notes ? `<dt>Notes</dt><dd>${esc(c.notes)}</dd>` : ''}
          </dl></div>
        <b>WhatsApp message (ready to send)</b>
        <div class="wa-preview" style="margin:8px 0 10px"><div class="wa-bubble">${esc(wa)}</div></div>
        <div class="row-actions">
          <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(c.whatsapp || c.phone, wa)}" data-action="wa-sent" data-id="${o.id}">${icon('wa')} Send on WhatsApp</a>
          <button class="btn btn-ghost btn-sm" data-action="copy" data-text="${esc(wa)}">${icon('copy')} Copy text</button>
          <a class="btn btn-ghost btn-sm" href="${mailLink(c.email, `Your order ${o.id} — ${shop.name}`, emailBody)}">${icon('mail')} Email buyer</a>
        </div>
      </div></div>`,
    foot: `<button class="btn btn-ghost" data-action="print">${icon('print')} Print packing slip</button>
      ${canEdit && o.status !== 'cancelled' && o.status !== 'delivered' ? `<button class="btn btn-ghost" data-action="order-status" data-id="${o.id}" data-s="cancelled">Cancel order</button>` : ''}
      ${canEdit && next ? `<button class="btn btn-dark" data-action="order-status" data-id="${o.id}" data-s="${next}">Mark as ${STATUS_LABEL[next].toLowerCase()}</button>` : ''}`
  });
}

/* ---------------- Shared: products ---------------- */
function productsView(shop, q) {
  const list = Store.s.products.filter(p => p.shopId === shop.id).sort((a, b) => b.createdAt - a.createdAt);
  return `${head('Products', `${list.length} listed · ${list.filter(p => Store.soldOut(p)).length} sold out · ${list.filter(p => Store.dealActive(p)).length} on discount`, `<button class="btn btn-brass" data-action="edit-product" data-id="">${icon('plus')} Add product</button>`)}
    ${list.length ? `<div class="table-wrap"><table class="t"><thead><tr><th></th><th>Product</th><th>Price</th><th>Deal</th><th>Stock</th><th>Sold</th><th>Views</th><th>Sold-out seal</th><th>Visible</th><th></th></tr></thead><tbody>
    ${list.map(p => `<tr>
      <td><img class="t-img" src="${esc(p.images[0] || FALLBACK_IMG)}" alt=""></td>
      <td><b>${esc(L(p, 'name'))}</b><br><small class="muted">${esc(L(Store.cat(p.category), 'name'))}</small></td>
      <td>${money(Store.priceOf(p))}${Store.dealActive(p) ? `<br><s class="muted">${money(p.price)}</s>` : ''}</td>
      <td>${Store.dealActive(p) ? `<span class="badge red">−${p.discount}%</span>${p.dealEnds ? `<br><small data-countdown="${p.dealEnds}">${countdownText(p.dealEnds)}</small>` : ''}` : '<span class="muted">—</span>'}</td>
      <td><input class="input" style="width:74px;min-height:34px;padding:4px 8px" type="number" min="0" value="${p.stock}" data-stock="${p.id}" aria-label="Stock"></td>
      <td>${p.sold}</td><td>${p.views}</td>
      <td><label class="switch" title="Mark as sold out"><input type="checkbox" data-action="toggle-soldout" data-id="${p.id}" ${Store.soldOut(p) ? 'checked' : ''}><span></span></label>${p.waitlist && p.waitlist.length ? `<br><small class="badge amber" title="Buyers asked to be told when it is back">${icon('bell')} ${p.waitlist.length} waiting</small>` : ''}</td>
      <td><label class="switch" title="Show in shop"><input type="checkbox" data-action="toggle-active" data-id="${p.id}" ${p.active ? 'checked' : ''}><span></span></label></td>
      <td><div class="row-actions"><button class="btn btn-ghost btn-sm" data-action="edit-product" data-id="${p.id}">Edit</button><button class="btn btn-ghost btn-sm" data-action="dup-product" data-id="${p.id}">Duplicate</button><button class="btn btn-ghost btn-sm" data-action="del-product" data-id="${p.id}" aria-label="Delete">${icon('x')}</button></div></td>
    </tr>`).join('')}</tbody></table></div>` : `<div class="card empty"><h3>Add your first product</h3><p>Good photos and a clear description sell best. You can add several photos per piece.</p><button class="btn btn-brass" data-action="edit-product" data-id="">Add product</button></div>`}`;
}

function openProductEditor(shop, id) {
  const p = id ? Store.product(id) : { id: '', shopId: shop.id, name: '', category: (shop.cats && shop.cats[0]) || 'oil-lamps', price: '', discount: 0, dealEnds: null, stock: 1, images: [], description: '', material: 'Solid brass', dimensions: '', weight: '', finish: 'Hand-polished', badge: '', active: true };
  let imgs = [...p.images];
  const toLocal = ts => { if (!ts) return ''; const d = new Date(ts); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
  const library = [...new Set(Object.values(P))];
  const back = openModal({
    title: id ? 'Edit product' : 'Add product', wide: true,
    body: `<form id="pForm" class="dash-grid" style="grid-template-columns:1.4fr 1fr;margin:0" novalidate>
      <div class="form-grid">
        <div class="field full"><label>Product name</label><input class="input" name="name" value="${esc(p.name)}" placeholder="e.g. Five wick pahana, 18 inch"></div>
        <div class="field full si-field"><label>Product name</label><input class="input" name="name_si" value="${esc(p.name_si || '')}" placeholder="උදා: වැටි 5 පහන, අඟල් 18" lang="si"></div>
        <div class="field"><label>Category</label><select class="input" name="category">${CATEGORIES.map(c => `<option value="${c.id}" ${p.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
        <div class="field"><label>Label on photo</label><select class="input" name="badge">${['', 'New', 'Bestseller', 'Handmade', 'Made to order', 'Limited', 'Masterpiece', 'Set'].map(b => `<option ${p.badge === b ? 'selected' : ''} value="${b}">${b || 'None'}</option>`).join('')}</select></div>
        <div class="field"><label>Price (Rs.)</label><input class="input" name="price" type="number" min="0" value="${esc(p.price)}"></div>
        <div class="field"><label>Stock</label><input class="input" name="stock" type="number" min="0" value="${esc(p.stock)}"><span class="hint">Set to 0 to show the sold-out seal.</span></div>
        <div class="field"><label>Discount %</label><input class="input" name="discount" type="number" min="0" max="90" value="${esc(p.discount)}"></div>
        <div class="field"><label>Deal ends (leave blank for no timer)</label><input class="input" name="dealEnds" type="datetime-local" value="${toLocal(p.dealEnds)}"></div>
        <div class="field"><label>Material</label><input class="input" name="material" value="${esc(p.material)}"></div>
        <div class="field"><label>Finish</label><input class="input" name="finish" value="${esc(p.finish)}"></div>
        <div class="field"><label>Size</label><input class="input" name="dimensions" value="${esc(p.dimensions)}" placeholder="H 46 cm, base 14 cm"></div>
        <div class="field"><label>Weight</label><input class="input" name="weight" value="${esc(p.weight)}" placeholder="2.4 kg"></div>
        <div class="field full"><label>Description</label><textarea class="input" name="description" placeholder="How it is made, where it is used, what makes it special">${esc(p.description)}</textarea></div>
        <div class="field full si-field"><label>Description</label><textarea class="input" name="description_si" lang="si" placeholder="නිපදවන ආකාරය, භාවිතය, විශේෂත්වය">${esc(p.description_si || '')}</textarea><span class="hint">Buyers who choose Sinhala see these. Leave empty to show the English text.</span></div>
        <div class="field full"><label>Photos (first photo is the cover)</label>
          <div class="img-pick" id="imgList"></div>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <label class="upload-drop" style="flex:1;min-width:180px">${icon('plus')} Upload photos<input type="file" accept="image/*" multiple class="sr" id="pFiles"></label>
            <div style="flex:1;min-width:200px;display:flex;gap:6px"><input class="input" id="pUrl" placeholder="or paste an image link"><button type="button" class="btn btn-ghost btn-sm" id="pUrlAdd">Add</button></div>
          </div>
          <details style="margin-top:10px"><summary style="cursor:pointer;font-size:.88rem;font-weight:700">Pick from the photo library</summary><div class="img-pick" style="margin-top:8px">${library.map(src => `<button type="button" data-lib="${esc(src)}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div></details>
        </div>
      </div>
      <div class="sticky-col"><b style="display:block;margin-bottom:8px">Live preview</b><div id="pPreview" style="max-width:280px"></div><p class="muted" style="font-size:.84rem;margin-top:10px">This is how buyers see your product card, including the discount tag, timer and sold-out seal.</p></div>
    </form>`,
    foot: `<button class="btn btn-ghost" data-action="close-modal">Cancel</button><button class="btn btn-brass" id="pSave">${id ? 'Save changes' : 'Publish product'}</button>`
  });
  const f = back.querySelector('#pForm');
  const read = () => {
    const v = Object.fromEntries(new FormData(f));
    return { ...p, id: p.id || 'preview', name: v.name || 'Product name', category: v.category, badge: v.badge, price: +v.price || 0, stock: Math.max(0, +v.stock || 0), discount: Math.min(90, Math.max(0, +v.discount || 0)), dealEnds: v.dealEnds ? new Date(v.dealEnds).getTime() : null, material: v.material, finish: v.finish, dimensions: v.dimensions, weight: v.weight, description: v.description, name_si: v.name_si, description_si: v.description_si, images: imgs.length ? imgs : [FALLBACK_IMG], rating: p.rating || 0, reviews: p.reviews || 0 };
  };
  const draw = () => {
    back.querySelector('#imgList').innerHTML = imgs.map((src, i) => `<button type="button" class="${i ? '' : 'on'}" data-cover="${i}" title="Make cover"><img src="${esc(src)}" alt=""><span class="x" data-rm="${i}" aria-label="Remove">×</span></button>`).join('') || '<small class="muted">No photos yet.</small>';
    back.querySelector('#pPreview').innerHTML = productCard(read(), { preview: true }).replace(/href="#\/[^"]*"/g, 'href="javascript:void(0)"').replace(/data-action="[^"]*"/g, '');
  };
  f.addEventListener('input', draw);
  back.querySelector('#imgList').addEventListener('click', e => {
    const rm = e.target.closest('[data-rm]'); const cv = e.target.closest('[data-cover]');
    if (rm) { imgs.splice(+rm.dataset.rm, 1); draw(); return; }
    if (cv) { const i = +cv.dataset.cover; imgs.unshift(imgs.splice(i, 1)[0]); draw(); }
  });
  back.querySelectorAll('[data-lib]').forEach(b => b.addEventListener('click', () => { if (!imgs.includes(b.dataset.lib)) imgs.push(b.dataset.lib); draw(); }));
  back.querySelector('#pFiles').addEventListener('change', async e => {
    for (const file of e.target.files) { try { imgs.push(await fileToDataURL(file)); } catch (err) { toast('Could not read that image.', true); } }
    draw();
  });
  back.querySelector('#pUrlAdd').addEventListener('click', () => { const u = back.querySelector('#pUrl').value.trim(); if (/^https?:\/\//.test(u)) { imgs.push(u); back.querySelector('#pUrl').value = ''; draw(); } else toast('Paste a full image link starting with https://', true); });
  back.querySelector('#pSave').addEventListener('click', () => {
    const v = read();
    if (!f.elements.name.value.trim()) { toast('Give the product a name.', true); return; }
    if (!(v.price > 0)) { toast('Enter a price.', true); return; }
    if (!imgs.length) { toast('Add at least one photo.', true); return; }
    const data = { name: f.elements.name.value.trim(), category: v.category, badge: v.badge, price: v.price, stock: v.stock, discount: v.discount, dealEnds: v.discount ? v.dealEnds : null, material: v.material, finish: v.finish, dimensions: v.dimensions, weight: v.weight, description: v.description, name_si: (v.name_si || '').trim(), description_si: (v.description_si || '').trim(), images: imgs };
    if (id) { Object.assign(Store.product(id), data); Store.log(`updated product ${data.name}`); }
    else {
      Store.s.products.push({ ...data, id: 'p' + Date.now(), shopId: shop.id, sold: 0, views: 0, rating: 0, reviews: 0, createdAt: Date.now(), active: true, spotlight: false, demoDealHours: 0 });
      Store.log(`added product ${data.name}`);
    }
    Store.save(); closeModal(); toast(id ? 'Product updated.' : 'Product published.'); App.render();
  });
  draw();
}

/* ---------------- Shared: deals, coupons, spotlight ---------------- */
function dealsView(shop) {
  const prods = Store.s.products.filter(p => p.shopId === shop.id && p.active);
  const coupons = Store.s.coupons.filter(c => c.shopId === shop.id);
  const spots = Store.s.spotlights.filter(s => s.shopId === shop.id);
  onMount(() => {
    document.querySelectorAll('[data-deal-form]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const p = Store.product(f.dataset.dealForm);
      const v = Object.fromEntries(new FormData(f));
      const pct = Math.min(90, Math.max(0, +v.pct || 0));
      p.discount = pct;
      p.dealEnds = pct && +v.hours ? Date.now() + +v.hours * 3600e3 : null;
      p.demoDealHours = 0;
      Store.log(pct ? `started a ${pct}% deal on ${p.name}` : `ended the deal on ${p.name}`);
      Store.save(); toast(pct ? `Deal live: ${pct}% off ${p.name}` : 'Deal ended.'); App.render();
    }));
    const cf = document.getElementById('couponForm');
    cf && cf.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(cf));
      const code = (v.code || '').trim().toUpperCase().replace(/\s+/g, '');
      if (!/^[A-Z0-9]{4,15}$/.test(code)) { toast('Use 4–15 letters or numbers for the code.', true); return; }
      if (Store.s.coupons.some(c => c.code === code)) { toast('That code is already in use. Try another.', true); return; }
      if (!(+v.value > 0)) { toast('Enter the discount amount.', true); return; }
      Store.s.coupons.push({ code, shopId: shop.id, type: v.type, value: +v.value, minOrder: +v.minOrder || 0, expires: Date.now() + (+v.days || 7) * 864e5, uses: 0 });
      Store.log(`created coupon ${code}`); Store.save(); toast(`Coupon ${code} created.`); App.render();
    });
    const sf = document.getElementById('spotForm');
    sf && sf.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(sf));
      Store.s.spotlights.unshift({ id: 'sp' + Date.now(), shopId: shop.id, productId: v.productId, days: +v.days, fee: +v.days === 14 ? 2500 : 1500, status: 'pending', at: Date.now() });
      Store.log(`requested a spotlight for ${Store.product(v.productId).name}`); Store.save(); toast('Spotlight request sent to the platform.'); App.render();
    });
  });
  return `${head('Deals & coupons', 'Discounts with a timer appear in Flash deals on the home page and the deals page. Buyers see the countdown on every card.')}
    <div class="card"><h3>Product deals</h3>
    <div class="table-wrap" style="border:0"><table class="t"><thead><tr><th>Product</th><th>Price now</th><th>Current deal</th><th>Set a deal</th></tr></thead><tbody>
    ${prods.map(p => `<tr><td style="display:flex;gap:10px;align-items:center"><img class="t-img" src="${esc(p.images[0])}" alt=""><span><b>${esc(L(p, 'name'))}</b>${Store.soldOut(p) ? '<br><span class="badge red">Sold out</span>' : ''}</span></td>
      <td>${money(Store.priceOf(p))}<br><small class="muted">Regular ${money(p.price)}</small></td>
      <td>${Store.dealActive(p) ? `<span class="badge red">−${p.discount}%</span> ${p.dealEnds ? `<small data-countdown="${p.dealEnds}">${countdownText(p.dealEnds)}</small>` : '<small class="muted">no end date</small>'}` : '<span class="muted">None</span>'}</td>
      <td><form data-deal-form="${p.id}" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
        <input class="input" name="pct" type="number" min="0" max="90" value="${Store.dealActive(p) ? p.discount : 10}" style="width:70px;min-height:34px" aria-label="Discount percent">%
        <select class="input" name="hours" style="width:auto;min-height:34px" aria-label="Duration"><option value="6">6 hours</option><option value="24" selected>24 hours</option><option value="72">3 days</option><option value="168">7 days</option><option value="0">No timer</option></select>
        <button class="btn btn-red btn-sm">${Store.dealActive(p) ? 'Update' : 'Start deal'}</button>
        ${Store.dealActive(p) ? `<button class="btn btn-ghost btn-sm" onclick="this.form.pct.value=0">End</button>` : ''}
      </form></td></tr>`).join('')}
    </tbody></table></div></div>
    <div class="dash-grid even">
      <div class="card"><h3>Coupons</h3>
        ${coupons.length ? coupons.map(c => `<div class="sum-row" style="border-bottom:1px solid var(--line);padding:10px 0"><span><b>${esc(c.code)}</b> · ${c.type === 'pct' ? c.value + '%' : money(c.value)} off over ${money(c.minOrder)}<br><small class="muted">${c.expires > Date.now() ? `Ends ${fmtDate(c.expires)}` : 'Expired'} · used ${c.uses} times</small></span><button class="btn btn-ghost btn-sm" data-action="del-coupon" data-code="${esc(c.code)}">Delete</button></div>`).join('') : '<p class="muted">No coupons yet.</p>'}
        <form id="couponForm" class="form-grid" style="margin-top:14px">
          <div class="field"><label>Code</label><input class="input" name="code" placeholder="VESAK10"></div>
          <div class="field"><label>Type</label><select class="input" name="type"><option value="pct">% off</option><option value="flat">Rs. off</option></select></div>
          <div class="field"><label>Amount</label><input class="input" name="value" type="number" min="1"></div>
          <div class="field"><label>Minimum order (Rs.)</label><input class="input" name="minOrder" type="number" min="0" value="0"></div>
          <div class="field"><label>Valid for (days)</label><input class="input" name="days" type="number" min="1" value="14"></div>
          <div class="field" style="align-self:end"><button class="btn btn-dark">Create coupon</button></div>
        </form></div>
      <div class="card"><h3>Spotlight on the home page</h3>
        <p class="muted" style="font-size:.92rem">Feature one product in the “In the spotlight” section. Requests are approved by the platform. Fee is added to your monthly statement.</p>
        <form id="spotForm" class="form-grid">
          <div class="field full"><label>Product</label><select class="input" name="productId">${prods.map(p => `<option value="${p.id}">${esc(L(p, 'name'))}</option>`).join('')}</select></div>
          <div class="field"><label>Duration</label><select class="input" name="days"><option value="7">7 days — Rs. 1,500</option><option value="14">14 days — Rs. 2,500</option></select></div>
          <div class="field" style="align-self:end"><button class="btn btn-brass" ${prods.length ? '' : 'disabled'}>Request spotlight</button></div>
        </form>
        ${spots.length ? `<div style="margin-top:14px">${spots.map(s => `<div class="sum-row"><span>${esc(L(Store.product(s.productId), 'name'))} · ${s.days} days</span><span class="status st-${s.status === 'active' ? 'delivered' : s.status === 'declined' ? 'cancelled' : 'pending'}">${s.status}</span></div>`).join('')}</div>` : ''}
      </div>
    </div>`;
}

/* ---------------- Shared: shop design ---------------- */
function designView(shop) {
  const d = { name_si: '', tagline_si: '', story_si: '', announcement_si: '', ...shop };
  onMount(() => {
    const f = document.getElementById('designForm');
    const prev = document.getElementById('designPreview');
    const paint = () => {
      prev.innerHTML = `<div style="--shop-c:${esc(d.color)}"><section class="store-hero"><img src="${esc(d.banner)}" alt=""></section>
        <div class="store-head f-${esc(d.font)}"><div class="store-logo">${esc(initials(d.name))}</div><div><h1 style="font-size:1.3rem">${esc(L(d, 'name'))}</h1><div class="muted">${esc(L(d, 'tagline'))}</div></div></div>
        <div style="padding:0 14px">${d.announcement ? `<div class="store-announce">${esc(L(d, 'announcement'))}</div>` : ''}
        <div class="layout-${esc(d.layout)}" style="margin-top:14px"><div class="grid">${Store.s.products.filter(p => p.shopId === shop.id).slice(0, d.layout === 'compact' ? 4 : d.layout === 'editorial' ? 2 : 3).map(p => productCard(p, { hideShop: true, preview: true })).join('') || '<p class="muted">Your products will appear here.</p>'}</div></div></div></div>`;
      document.querySelectorAll('[data-color]').forEach(b => b.classList.toggle('on', b.dataset.color === d.color));
      document.querySelectorAll('[data-banner]').forEach(b => b.classList.toggle('on', b.dataset.banner === d.banner));
    };
    f.addEventListener('input', e => { if (e.target.name && e.target.name in d) { d[e.target.name] = e.target.value; paint(); } });
    f.addEventListener('change', e => { if (e.target.name && e.target.name in d) { d[e.target.name] = e.target.value; paint(); } });
    document.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => { d.color = b.dataset.color; f.elements.color.value = d.color; paint(); }));
    document.querySelectorAll('[data-banner]').forEach(b => b.addEventListener('click', () => { d.banner = b.dataset.banner; paint(); }));
    document.getElementById('bannerFile').addEventListener('change', async e => { if (e.target.files[0]) { d.banner = await fileToDataURL(e.target.files[0], 1600); paint(); } });
    f.addEventListener('submit', e => {
      e.preventDefault();
      ['color', 'banner', 'tagline', 'story', 'announcement', 'layout', 'font', 'hours', 'name_si', 'tagline_si', 'story_si', 'announcement_si'].forEach(k => { shop[k] = d[k] || ''; });
      shop.designed = true;
      Store.log(`updated the design of ${shop.name}`); Store.save(); toast('Shop design saved. Buyers see the changes now.'); App.render();
    });
    paint();
  });
  return `${head('Shop design', 'Make your shop stand out from the others. Changes show in the preview before you save.', `<a class="btn btn-ghost" href="#/store/${shop.id}?preview=1">${icon('eye')} Open full page</a>`)}
    <form id="designForm" class="dash-grid" style="grid-template-columns:1fr 1.15fr">
      <div class="card">
        <div class="field"><label>Shop colour</label><div class="swatches">${THEME_COLORS.map(c => `<button type="button" class="swatch" style="background:${c}" data-color="${c}" aria-label="Colour ${c}"></button>`).join('')}<input type="color" name="color" value="${esc(shop.color)}" aria-label="Custom colour" style="width:42px;height:42px;border:0;background:none;padding:0"></div></div>
        <div class="field" style="margin-top:16px"><label>Banner photo</label><div class="img-pick">${BANNERS.map(b => `<button type="button" data-banner="${esc(b)}"><img src="${esc(b)}" alt="" loading="lazy"></button>`).join('')}</div>
          <label class="upload-drop" style="margin-top:8px">${icon('plus')} Upload your own workshop photo<input type="file" id="bannerFile" accept="image/*" class="sr"></label></div>
        <div class="field" style="margin-top:16px"><label>Tagline</label><input class="input" name="tagline" maxlength="70" value="${esc(shop.tagline)}"></div>
        <div class="field" style="margin-top:12px"><label>Announcement bar</label><input class="input" name="announcement" maxlength="90" value="${esc(shop.announcement)}" placeholder="e.g. Free delivery in Kandy this week"></div>
        <div class="field" style="margin-top:12px"><label>Your story</label><textarea class="input" name="story">${esc(shop.story)}</textarea></div>
        <div style="margin-top:16px;display:grid;gap:12px"><b>Sinhala version of your shop page</b>
          <div class="field si-field"><label>Shop name</label><input class="input" name="name_si" lang="si" value="${esc(shop.name_si || '')}" placeholder="උදා: හේරත් පිත්තල වැඩපොළ"></div>
          <div class="field si-field"><label>Tagline</label><input class="input" name="tagline_si" lang="si" maxlength="90" value="${esc(shop.tagline_si || '')}"></div>
          <div class="field si-field"><label>Announcement bar</label><input class="input" name="announcement_si" lang="si" maxlength="120" value="${esc(shop.announcement_si || '')}"></div>
          <div class="field si-field"><label>Your story</label><textarea class="input" name="story_si" lang="si">${esc(shop.story_si || '')}</textarea></div>
        </div>
        <div class="field" style="margin-top:12px"><label>Opening hours</label><input class="input" name="hours" value="${esc(shop.hours)}"></div>
        <div class="form-grid" style="margin-top:12px">
          <div class="field"><label>Product layout</label>${[['classic', 'Classic grid'], ['editorial', 'Large photos'], ['compact', 'Compact']].map(([v, l]) => `<label class="chk"><input type="radio" name="layout" value="${v}" ${shop.layout === v ? 'checked' : ''}> ${l}</label>`).join('')}</div>
          <div class="field"><label>Title style</label>${[['engraved', 'Engraved serif'], ['modern', 'Modern bold']].map(([v, l]) => `<label class="chk"><input type="radio" name="font" value="${v}" ${shop.font === v ? 'checked' : ''}> ${l}</label>`).join('')}</div>
        </div>
        <button class="btn btn-brass" style="margin-top:16px">Save design</button>
      </div>
      <div><div class="preview-frame" id="designPreview"></div></div>
    </form>`;
}

/* ---------------- Shared: competitor insights ---------------- */
function insightsView(shop) {
  const mine = Store.s.products.filter(p => p.shopId === shop.id && p.active);
  const live = Store.liveProducts();
  const myCats = [...new Set(mine.map(p => p.category))];
  const rows = mine.map(p => {
    const others = live.filter(x => x.category === p.category && x.shopId !== shop.id);
    const prices = others.map(x => Store.priceOf(x));
    const all = [...prices, Store.priceOf(p)];
    const min = Math.min(...all), max = Math.max(...all);
    const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : Store.priceOf(p);
    const rank = [...all].sort((a, b) => a - b).indexOf(Store.priceOf(p)) + 1;
    const diff = prices.length ? Math.round((Store.priceOf(p) - avg) / avg * 100) : 0;
    const dealsOn = others.filter(x => Store.dealActive(x)).length;
    let tip;
    if (Store.soldOut(p)) tip = `Sold out. ${p.views} people viewed it — restock to catch that demand.`;
    else if (!others.length) tip = 'No direct competitors yet. Good photos and a clear description help it rank.';
    else if (diff > 15) tip = `${diff}% above the category average. A ${Math.min(25, Math.ceil(diff / 10) * 5)}% flash deal would make it noticeably more competitive${diff > 50 ? ', or explain in the description what justifies the higher price (size, weight, detail)' : ''}.`;
    else if (dealsOn && !Store.dealActive(p)) tip = `${dealsOn} competitor${dealsOn > 1 ? 's have' : ' has'} a deal running in this category. Consider a short 24-hour deal.`;
    else if (p.rating && p.rating < 4.5) tip = 'Rating is below 4.5. Confirming orders quickly on WhatsApp tends to lift reviews.';
    else if (diff < -10) tip = `Priced ${Math.abs(diff)}% below average. There may be room to raise the price.`;
    else tip = 'Well positioned on price. Keep stock up and photos fresh.';
    return { p, others, min, max, avg, rank, total: all.length, diff, tip };
  });
  const catDemand = CATEGORIES.map(c => live.filter(p => p.category === c.id).reduce((a, p) => a + p.sold, 0));
  const rivals = Store.publishedShops().filter(s => s.id !== shop.id).map(s => {
    const ps = live.filter(p => p.shopId === s.id && myCats.includes(p.category));
    return { s, ps, deals: ps.filter(p => Store.dealActive(p)).length, avgDisc: ps.length ? Math.round(ps.filter(p => Store.dealActive(p)).reduce((a, p) => a + p.discount, 0) / Math.max(1, ps.filter(p => Store.dealActive(p)).length)) : 0, st: Store.shopStats(s.id) };
  }).filter(x => x.ps.length).sort((a, b) => b.st.revenue - a.st.revenue);
  chart('demandChart', barCfg(CATEGORIES.map(c => c.name), catDemand, CATEGORIES.map(c => myCats.includes(c.id) ? LACQ : BRASS), true));
  return `${head('Competitor insights', 'How your prices and deals compare with other shops selling in the same categories.')}
    <div class="dash-grid">
      <div class="card"><h3>Your products against the market</h3>
        ${rows.length ? rows.map(r => `<div class="insight"><img src="${esc(r.p.images[0])}" alt=""><div>
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>${esc(L(r.p, 'name'))}</b><span>${money(Store.priceOf(r.p))} · <b>#${r.rank}</b> cheapest of ${r.total}</span></div>
          ${r.others.length ? `<div class="range-track" title="Price range in category"><div class="band" style="left:0;right:0"></div><div class="avg" style="left:${(r.avg - r.min) / Math.max(1, r.max - r.min) * 100}%" title="Average"></div><div class="me" style="left:${(Store.priceOf(r.p) - r.min) / Math.max(1, r.max - r.min) * 100}%"></div></div>
          <small class="muted">${money(r.min)} lowest · ${money(r.avg)} average · ${money(r.max)} highest</small>` : ''}
          <p style="margin:6px 0 0;font-size:.9rem">${icon('target')} ${esc(r.tip)}</p>
          ${r.others.length ? `<details style="margin-top:6px"><summary style="cursor:pointer;font-size:.85rem;font-weight:700">See ${r.others.length} competing piece${r.others.length > 1 ? 's' : ''}</summary>${r.others.map(x => `<div class="sum-row" style="font-size:.86rem"><a href="#/product/${x.id}" style="text-decoration:underline">${esc(L(x, 'name'))}</a><span>${esc(L(Store.shop(x.shopId), 'name'))} · ${money(Store.priceOf(x))}${Store.dealActive(x) ? ` <span class="badge red">−${x.discount}%</span>` : ''}${Store.soldOut(x) ? ' <span class="badge red">sold out</span>' : ''}</span></div>`).join('')}</details>` : ''}
        </div></div>`).join('') : '<p class="muted">Add products to see how they compare.</p>'}
      </div>
      <div>
        <div class="card"><h3>What buyers are ordering</h3><p class="muted" style="font-size:.85rem;margin-top:-8px">Units sold by category across the marketplace. Your categories in red.</p><div class="chart-box"><canvas id="demandChart"></canvas></div></div>
        <div class="card"><h3>Shops in your categories</h3>
          ${rivals.map(x => `<div class="sum-row" style="padding:10px 0;border-bottom:1px solid var(--line)"><a href="#/store/${x.s.id}" style="display:flex;gap:10px;align-items:center">${shopLogo(x.s)}<span><b>${esc(L(x.s, 'name'))}</b><br><small class="muted">${x.ps.length} competing pieces · ${stars(x.s.rating)}</small></span></a><span style="text-align:right">${x.deals ? `<span class="badge red">${x.deals} deal${x.deals > 1 ? 's' : ''}, avg ${x.avgDisc}%</span>` : '<small class="muted">No deals</small>'}<br><small class="muted">${moneyShort(x.st.revenue)} / 30d</small></span></div>`).join('') || '<p class="muted">No competitors yet.</p>'}
        </div>
      </div>
    </div>`;
}

/* ---------------- Shared: statement & agreement ---------------- */
function statementView(shop) {
  if (shop.status !== 'published') return `${head('My agreement', 'The agreement you signed when you applied. Commission applies once your shop is live.')}
    <div class="card"><dl class="specs" style="grid-template-columns:150px 1fr"><dt>Signed by</dt><dd>${esc(shop.agreement?.signedName || '')}</dd><dt>Date</dt><dd>${shop.agreement ? fmtDate(shop.agreement.signedAt) : ''}</dd><dt>Commission</dt><dd>${Store.rates(shop).total}% of delivered orders (${Store.rates(shop).agent}% region agent + ${Store.rates(shop).platform}% platform)</dd><dt>Registration fee</dt><dd>${money(shop.payment?.amount)} · ref ${esc(shop.payment?.ref || '')}</dd></dl>
    <button class="btn btn-ghost btn-sm" data-action="view-agreement" data-id="${shop.id}">${icon('doc')} View & print agreement</button></div>`;
  const rows = Store.statements([shop.id]);
  const r = Store.rates(shop);
  const owing = rows.filter(x => !x.state.agentPaid || !x.state.platformPaid).reduce((a, x) => a + (x.state.agentPaid ? 0 : x.agent) + (x.state.platformPaid ? 0 : x.platform), 0);
  return `${head('Statement & agreement', `Your commission rate is ${r.total}% (${r.agent}% region agent + ${r.platform}% platform), on delivered orders only.`)}
    <div class="kpis">${kpi('Commission outstanding', money(owing), 'across unpaid months', owing ? 'red' : '')}${kpi('Delivered sales, all time', money(rows.reduce((a, x) => a + x.sales, 0)))}${kpi('Commission paid', money(rows.reduce((a, x) => a + (x.state.agentPaid ? x.agent : 0) + (x.state.platformPaid ? x.platform : 0), 0)))}</div>
    <div class="table-wrap" style="margin-bottom:16px"><table class="t"><thead><tr><th>Month</th><th>Delivered orders</th><th>Sales</th><th>Agent ${r.agent}%</th><th>Platform ${r.platform}%</th><th>Status</th></tr></thead><tbody>
      ${rows.map(x => `<tr><td><b>${monthName(x.month)}</b></td><td>${x.orders}</td><td>${money(x.sales)}</td><td>${money(x.agent)} ${r.agent ? (x.state.agentPaid ? '<span class="badge green">paid</span>' : '<span class="badge amber">due</span>') : ''}</td><td>${money(x.platform)} ${x.state.platformPaid ? '<span class="badge green">paid</span>' : '<span class="badge amber">due</span>'}</td><td>${(x.state.agentPaid || !r.agent) && x.state.platformPaid ? statusPill('delivered').replace('Delivered', 'Settled') : '<span class="status st-pending">Open</span>'}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">No delivered orders yet.</td></tr>'}
    </tbody></table></div>
    <div class="card"><h3>Your signed agreement</h3>
      <dl class="specs" style="grid-template-columns:150px 1fr"><dt>Signed by</dt><dd>${esc(shop.agreement?.signedName || '')}</dd><dt>Date</dt><dd>${shop.agreement ? fmtDate(shop.agreement.signedAt) : ''}</dd><dt>Commission</dt><dd>${r.total}%</dd><dt>Registration fee</dt><dd>${shop.payment?.amount ? `${money(shop.payment.amount)} · ref ${esc(shop.payment.ref)}` : 'Not applicable (region agent)'}</dd></dl>
      <button class="btn btn-ghost btn-sm" data-action="view-agreement" data-id="${shop.id}">${icon('doc')} View & print agreement</button></div>`;
}

/* ---------------- Shared: shop overview ---------------- */
function shopOverview(shop, u, title) {
  const st30 = Store.shopStats(shop.id, 30);
  const all = st30.all;
  const pending = all.filter(o => o.status === 'pending');
  const s = dailySeries(all, 30);
  const prods = Store.s.products.filter(p => p.shopId === shop.id);
  const top = [...prods].sort((a, b) => b.sold - a.sold).slice(0, 6);
  const com = Store.commission(shop, all.filter(o => o.status === 'delivered' && o.createdAt > Date.now() - 30 * 864e5).reduce((a, o) => a + o.subtotal, 0));
  const statusCounts = ORDER_FLOW.map(x => all.filter(o => o.status === x).length);
  const board = Store.publishedShops().map(x => ({ x, r: Store.shopStats(x.id).revenue })).sort((a, b) => b.r - a.r);
  const myRank = board.findIndex(b => b.x.id === shop.id) + 1;
  const lowStock = prods.filter(p => p.active && p.stock > 0 && p.stock <= 2);
  const soldOut = prods.filter(p => p.active && p.stock <= 0);
  if (shop.status === 'published') {
    chart('salesChart', lineCfg(s.labels, [{ label: 'Sales', data: s.data, borderColor: PATINA, backgroundColor: 'rgba(123,28,28,.08)', fill: true }]));
    chart('statusChart', doughnutCfg(ORDER_FLOW.map(x => STATUS_LABEL[x]), statusCounts, ['#E0A030', '#4A7BC0', '#8C6BC9', '#2E9AA6', '#1E7B34']));
  }
  return `${head(title || `Ayubowan, ${esc(u.name.split(' ')[0])}`, `${esc(L(shop, 'name'))} · ${SHOP_STATUS_LABEL[shop.status]}`, shop.status === 'published' ? `<a class="btn btn-ghost" href="#/store/${shop.id}">${icon('eye')} View shop</a><button class="btn btn-brass" data-action="edit-product" data-id="">${icon('plus')} Add product</button>` : '')}
    ${shop.status !== 'published' ? `<div class="card" style="margin-bottom:16px"><h3>Your application</h3>${applicationPipeline(shop)}<p class="muted">While you wait, set up your <a href="#/dashboard/design" style="text-decoration:underline">shop design</a> and <a href="#/dashboard/products" style="text-decoration:underline">add products</a> so you are ready on day one.</p></div>` : ''}
    ${pending.length ? `<div class="notice"><b>${pending.length} new order${pending.length > 1 ? 's' : ''} waiting for confirmation.</b> Send each buyer the WhatsApp confirmation, then mark the order confirmed. <a href="#/dashboard/orders?status=pending" style="text-decoration:underline">Open orders</a></div>` : ''}
    ${soldOut.length || lowStock.length ? `<div class="notice red">${soldOut.length ? `<b>${soldOut.length} sold out:</b> ${soldOut.map(p => esc(p.name)).join(', ')}. ` : ''}${lowStock.length ? `<b>Low stock:</b> ${lowStock.map(p => `${esc(L(p, 'name'))} (${p.stock})`).join(', ')}.` : ''} <a href="#/dashboard/products" style="text-decoration:underline">Update stock</a></div>` : ''}
    <div class="kpis">
      ${kpi('Sales, last 30 days', money(st30.revenue), `${st30.orders} orders · ${st30.items} pieces`, 'accent')}
      ${kpi('You keep (delivered)', money(com.net), `after ${com.rates.total}% commission`)}
      ${kpi('Leaderboard rank', myRank ? `#${myRank}` : '—', `of ${board.length} shops this month`)}
      ${kpi('Awaiting confirmation', pending.length, 'orders', pending.length ? 'red' : '')}
      ${kpi('Live deals', prods.filter(p => Store.dealActive(p)).length, `${prods.filter(p => p.active).length} active products`)}
    </div>
    ${shop.status === 'published' ? `<div class="dash-grid">
      <div class="card"><h3>Daily sales</h3><div class="chart-box"><canvas id="salesChart"></canvas></div></div>
      <div class="card"><h3>Orders by status</h3><div class="chart-box"><canvas id="statusChart"></canvas></div></div>
    </div>` : ''}
    <div class="dash-grid">
      <div class="card"><h3>Best sellers</h3>${top.map(p => `<div class="sum-row" style="align-items:center;padding:8px 0;border-bottom:1px solid var(--line)"><span style="display:flex;gap:10px;align-items:center"><img class="t-img" src="${esc(p.images[0])}" alt="">${esc(L(p, 'name'))}${Store.soldOut(p) ? ' <span class="badge red">sold out</span>' : ''}</span><span><b>${p.sold}</b> sold</span></div>`).join('') || '<p class="muted">No products yet.</p>'}</div>
      <div class="card"><h3>Latest orders</h3>${all.sort((a, b) => b.createdAt - a.createdAt).slice(0, 6).map(o => `<div class="sum-row" style="padding:8px 0;border-bottom:1px solid var(--line)"><span><b>${esc(o.id)}</b> · ${esc(L(o.customer, 'name'))}<br><small class="muted">${ago(o.createdAt)}</small></span><span style="text-align:right">${money(o.total)}<br>${statusPill(o.status)}</span></div>`).join('') || '<p class="muted">No orders yet.</p>'}</div>
    </div>`;
}

/* ---------------- Views by role ---------------- */
const DashViews = { owner: {}, agent: {}, super: {}, customer: {} };

/* Shop owner */
DashViews.owner.overview = (q, u) => { const s = Store.shop(u.shopId); return s.status === 'published' ? shopOverview(s, u) : applicationView(s, u); };

function applicationView(shop, u) {
  const r = Store.region(shop.regionId);
  const agent = Store.userById(r.agentUserId);
  const prods = Store.s.products.filter(p => p.shopId === shop.id);
  const checklist = [
    ['Application and agreement submitted', true, '#/dashboard/statement'],
    ['Add at least 3 products with photos', prods.length >= 3, '#/dashboard/products', `${prods.length} added`],
    ['Write your shop story', (shop.story || '').trim().length > 20, '#/dashboard/design'],
    ['Choose your shop colour and banner', !!shop.designed, '#/dashboard/design'],
    ['Check your WhatsApp number for orders', !!shop.whatsapp, '#/dashboard/profile', shop.whatsapp]
  ];
  onMount(() => {
    const f = document.getElementById('resubmit');
    if (!f) return;
    let slip = '';
    f.querySelector('#reSlip').addEventListener('change', async e => { if (e.target.files[0]) { slip = await fileToDataURL(e.target.files[0], 1000); toast('Slip attached.'); } });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f));
      if ((v.ref || '').trim().length < 4) { toast('Enter the payment reference.', true); return; }
      shop.payment = { ...shop.payment, ref: v.ref.trim(), at: Date.now(), slip: slip || shop.payment.slip, note: v.note || '' };
      shop.status = 'pending_payment'; shop.approvals = {}; shop.resubmittedAt = Date.now(); shop.rejectReason = '';
      Store.s.outbox.unshift({ at: Date.now(), to: agent.email, subject: `Application resubmitted: ${shop.name}`, body: `${u.name} updated the application for ${shop.name}.\nNew payment reference: ${shop.payment.ref}\nNote: ${v.note || '-'}\n\nPlease verify in your dashboard.` });
      Store.log(`resubmitted the application for ${shop.name}`); Store.save(); toast('Application sent back to the region agent.'); App.render();
    });
  });
  const next = {
    pending_payment: `<h3>Waiting for the region agent</h3><p>${esc(`${agent.name}, the ${r.name} region agent, is checking that your ${money(shop.payment.amount)} registration fee has reached the account below. This usually takes 1–2 working days. You will get an email as soon as it is confirmed.`)}</p>
      <dl class="specs" style="grid-template-columns:150px 1fr"><dt>Your reference</dt><dd>${esc(shop.payment.ref)}</dd><dt>Paid to</dt><dd>${esc(r.accName)}, ${esc(r.bank)}, ${esc(r.accNo)}</dd><dt>Submitted</dt><dd>${fmtDateTime(shop.payment.at)}</dd></dl>
      <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(agent.phone, `Hello ${agent.name}, I applied to open "${shop.name}" on Pittala.lk. Payment reference: ${shop.payment.ref}. Could you please confirm?`)}">${icon('wa')} Message the agent</a>`,
    agent_approved: `<h3>Payment confirmed — final review</h3><p>${esc(`The region agent confirmed your payment on ${fmtDate(shop.approvals.agentAt)}.`)} The Pittala.lk platform team is doing a final check of your shop details. Once approved, your shop and products go live immediately and you will receive an email.</p>`,
    rejected: `<h3>Your application needs changes</h3><div class="notice red"><b>Reason:</b> ${esc(shop.rejectReason || 'Not given')}</div><p>Fix the issue and send the application back to the region agent.</p>
      <form id="resubmit" class="form-grid"><div class="field"><label>Payment reference</label><input class="input" name="ref" value="${esc(shop.payment.ref)}"></div>
      <div class="field"><label>New deposit slip (optional)</label><label class="upload-drop" style="padding:10px">${icon('doc')} Choose photo<input type="file" id="reSlip" accept="image/*" class="sr"></label></div>
      <div class="field full"><label>Note to the agent</label><input class="input" name="note" placeholder="e.g. Paid again on 21 Nov from my HNB account"></div>
      <div class="field"><button class="btn btn-brass">Resubmit application</button></div></form>`,
    suspended: `<h3>Shop suspended</h3><p>Your shop is hidden from buyers. Contact the region agent to resolve this.</p><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(agent.phone, `Hello ${agent.name}, about my suspended shop ${shop.name} on Pittala.lk.`)}">${icon('wa')} Message the agent</a>`
  }[shop.status] || '';
  return `${head('Your shop application', `${esc(L(shop, 'name'))} · ${SHOP_STATUS_LABEL[shop.status]}`)}
    <div class="card" style="margin-bottom:16px"><h3>Approval progress</h3>${applicationPipeline(shop).replace(/<div class="notice red">[\s\S]*$/, '')}</div>
    <div class="dash-grid">
      <div class="card">${next}</div>
      <div class="card"><h3>Get ready while you wait</h3><p class="muted" style="font-size:.9rem;margin-top:-6px">Shops that are ready on day one get their first orders faster.</p>
        ${checklist.map(([t, done, href, extra]) => `<a href="${href}" class="sum-row" style="padding:10px 0;border-bottom:1px solid var(--line);align-items:center"><span style="display:flex;gap:10px;align-items:center"><span class="avatar" style="width:28px;height:28px;${done ? '' : 'background:var(--surface-2);color:var(--ink-3)'}">${done ? icon('check') : ''}</span>${t}</span><small class="muted">${esc(extra || (done ? 'Done' : 'To do'))}</small></a>`).join('')}
      </div>
    </div>`;
}
DashViews.owner.products = (q, u) => productsView(Store.shop(u.shopId), q);
DashViews.owner.orders = (q, u) => `${head('Orders', 'Every order is cash on delivery. Confirm with the buyer on WhatsApp before you dispatch.')}${ordersTable(Store.s.orders.filter(o => o.shopId === u.shopId), q, { edit: true })}`;
DashViews.owner.deals = (q, u) => dealsView(Store.shop(u.shopId));
DashViews.owner.design = (q, u) => designView(Store.shop(u.shopId));
DashViews.owner.insights = (q, u) => insightsView(Store.shop(u.shopId));
DashViews.owner.statement = (q, u) => statementView(Store.shop(u.shopId));
DashViews.owner.reviews = (q, u) => {
  const rs = Store.s.reviews.filter(r => r.shopId === u.shopId);
  return `${head('Reviews', `${rs.length} reviews · average ${rs.length ? (rs.reduce((a, r) => a + r.rating, 0) / rs.length).toFixed(1) : '—'}`)}
  <div class="card">${rs.map(r => { const p = Store.product(r.productId); return `<div style="padding:12px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><b>${esc(L(r, 'name'))} · ${stars(r.rating)}</b><small class="muted">${fmtDate(r.at)}</small></div><small class="muted">${esc(p?.name || '')}</small><p style="margin:6px 0 0">${esc(r.text)}</p></div>`; }).join('') || '<p class="muted">No reviews yet.</p>'}</div>`;
};
DashViews.owner.profile = (q, u) => {
  const s = Store.shop(u.shopId);
  onMount(() => {
    const f = document.getElementById('profForm');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f));
      if (!validLKMobile(v.phone) || !validLKMobile(v.whatsapp)) { toast('Enter valid Sri Lankan mobile numbers.', true); return; }
      Object.assign(s, { phone: v.phone, whatsapp: v.whatsapp, email: v.email, address: v.address, est: +v.est || s.est, artisans: +v.artisans || s.artisans });
      u.name = v.owner || u.name;
      Store.save(); toast('Contact details saved.'); App.render();
    });
  });
  return `${head('Contact details', 'Buyers see these on your shop page. Order messages are sent from your WhatsApp number.')}
    <form class="card" id="profForm" style="max-width:720px"><div class="form-grid">
      <div class="field"><label>Owner name</label><input class="input" name="owner" value="${esc(u.name)}"></div>
      <div class="field"><label>Shop email (receives order emails)</label><input class="input" name="email" type="email" value="${esc(s.email)}"></div>
      <div class="field"><label>Phone</label><input class="input" name="phone" value="${esc(s.phone)}"></div>
      <div class="field"><label>WhatsApp</label><input class="input" name="whatsapp" value="${esc(s.whatsapp)}"></div>
      <div class="field full"><label>Address</label><input class="input" name="address" value="${esc(s.address)}"></div>
      <div class="field"><label>Established</label><input class="input" name="est" type="number" value="${esc(s.est)}"></div>
      <div class="field"><label>Artisans</label><input class="input" name="artisans" type="number" value="${esc(s.artisans)}"></div>
    </div><button class="btn btn-dark" style="margin-top:16px">Save details</button></form>`;
};

/* Region agent: own shop reuses owner views */
['products', 'orders', 'deals', 'design', 'insights', 'statement'].forEach(k => { DashViews.agent[k] = DashViews.owner[k]; });
DashViews.agent.shop = (q, u) => shopOverview(Store.shop(u.shopId), u, 'My shop sales');

DashViews.agent.overview = (q, u) => {
  const r = Store.region(u.regionId);
  const shops = Store.s.shops.filter(s => s.regionId === r.id);
  const live = shops.filter(s => s.status === 'published');
  const ids = live.map(s => s.id);
  const orders = Store.s.orders.filter(o => ids.includes(o.shopId));
  const s = dailySeries(orders, 30);
  const earn = dailySeries(orders.filter(o => !Store.isAgentShop(Store.shop(o.shopId))), 30, o => Math.round(o.subtotal * Store.s.settings.agentRate / 100));
  const since = Date.now() - 30 * 864e5;
  const delivered30 = orders.filter(o => o.status === 'delivered' && o.createdAt > since);
  const myEarn = delivered30.reduce((a, o) => a + Store.commission(Store.shop(o.shopId), o.subtotal).agent, 0);
  const owed = Store.statements(ids).filter(x => !x.state.agentPaid).reduce((a, x) => a + x.agent, 0);
  const apps = shops.filter(x => x.status === 'pending_payment');
  const byShop = live.filter(x => !Store.isAgentShop(x)).map(x => ({ x, v: Store.commission(x, Store.shopStats(x.id).revenue).agent }));
  chart('regionChart', lineCfg(s.labels, [{ label: 'Region sales', data: s.data, borderColor: PATINA, backgroundColor: 'rgba(123,28,28,.08)', fill: true }, { label: `Your ${Store.s.settings.agentRate}%`, data: earn.data, borderColor: BRASS }]));
  chart('agentShops', barCfg(byShop.map(b => b.x.name), byShop.map(b => b.v), BRASS, true));
  return `${head(`${esc(L(r, 'name'))} region`, `You onboard and support shops in ${esc(L(r, 'name'))}, and earn ${Store.s.settings.agentRate}% of their delivered sales. Your own shop pays only the ${Store.s.settings.platformRate}% platform share.`)}
    ${apps.length ? `<div class="notice"><b>${apps.length} application${apps.length > 1 ? 's' : ''} waiting for payment verification.</b> <a href="#/dashboard/applications" style="text-decoration:underline">Review now</a></div>` : ''}
    <div class="kpis">
      ${kpi(`Your ${Store.s.settings.agentRate}% earned, 30 days`, money(myEarn), 'on delivered orders', 'accent')}
      ${kpi('Outstanding from shops', money(owed), 'agent share not yet collected', owed ? 'red' : '')}
      ${kpi('Region sales, 30 days', money(orders.filter(o => o.createdAt > since && o.status !== 'cancelled').reduce((a, o) => a + o.subtotal, 0)))}
      ${kpi('Live shops', live.length, `${apps.length} awaiting you · ${shops.filter(x => x.status === 'agent_approved').length} with platform`)}
    </div>
    <div class="dash-grid">
      <div class="card"><h3>Region sales and your share</h3><div class="chart-box"><canvas id="regionChart"></canvas></div></div>
      <div class="card"><h3>Your share by shop, 30 days</h3><div class="chart-box"><canvas id="agentShops"></canvas></div></div>
    </div>
    <div class="card"><h3>Region shops</h3>${regionShopsTable(shops, true)}</div>`;
};

function regionShopsTable(shops, isAgent) {
  return `<div class="table-wrap" style="border:0"><table class="t"><thead><tr><th>Shop</th><th>Owner</th><th>Status</th><th>Products</th><th>Sales 30d</th><th>Rate</th><th></th></tr></thead><tbody>
    ${shops.map(s => { const o = Store.userById(s.ownerId); const st = Store.shopStats(s.id); return `<tr>
      <td><span class="shop-chip">${shopLogo(s)}<span><b>${esc(L(s, 'name'))}</b><br><small class="muted">${esc(Store.region(s.regionId)?.name || '')}</small></span></span></td>
      <td>${esc(o?.name || '')}<br><small class="muted">${esc(s.phone)}</small></td>
      <td>${statusPill(s.status)}</td>
      <td>${Store.s.products.filter(p => p.shopId === s.id).length}</td>
      <td>${money(st.revenue)}</td>
      <td>${Store.rates(s).total}%${Store.isAgentShop(s) ? ' <span class="badge gold">agent</span>' : ''}</td>
      <td><div class="row-actions">
        ${s.status === 'published' ? `<a class="btn btn-ghost btn-sm" href="#/store/${s.id}">View</a>` : `<button class="btn btn-ghost btn-sm" data-action="app" data-id="${s.id}">Review</button>`}
        <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(s.whatsapp, `Hello ${o?.name || ''}, this is the Pittala.lk ${isAgent ? 'region agent' : 'team'}.`)}">${icon('wa')}</a>
        ${!Store.isAgentShop(s) && (s.status === 'published' || s.status === 'suspended') ? `<button class="btn btn-ghost btn-sm" data-action="suspend" data-id="${s.id}">${s.status === 'suspended' ? 'Reactivate' : 'Suspend'}</button>` : ''}
      </div></td></tr>`; }).join('')}
  </tbody></table></div>`;
}

DashViews.agent.applications = (q, u) => {
  const shops = Store.s.shops.filter(s => s.regionId === u.regionId && ['pending_payment', 'agent_approved', 'rejected'].includes(s.status)).sort((a, b) => b.createdAt - a.createdAt);
  return `${head('Shop applications', `Confirm the ${money(Store.s.settings.regFee)} registration fee has reached your account, then approve. The platform gives final approval and publishes the shop.`)}
    ${shops.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>Shop</th><th>Applied</th><th>Payment reference</th><th>Agreement</th><th>Status</th><th></th></tr></thead><tbody>
    ${shops.map(s => `<tr><td><span class="shop-chip">${shopLogo(s)}<span><b>${esc(L(s, 'name'))}</b><br><small class="muted">${esc(Store.userById(s.ownerId)?.name || '')}</small></span></span></td>
      <td>${fmtDate(s.createdAt)}</td><td><b>${esc(s.payment?.ref || '')}</b><br><small class="muted">${esc(s.payment?.method || 'Bank deposit')} · ${money(s.payment?.amount)}</small></td>
      <td>${s.agreement ? `Signed ${s.agreement.rate}%` : '—'}</td><td>${statusPill(s.status)}</td>
      <td><button class="btn ${s.status === 'pending_payment' ? 'btn-brass' : 'btn-ghost'} btn-sm" data-action="app" data-id="${s.id}">${s.status === 'pending_payment' ? 'Verify & approve' : 'View'}</button></td></tr>`).join('')}
    </tbody></table></div>` : '<div class="card empty"><h3>No applications right now</h3><p>Share the registration link with workshops in your region: <b>#/register</b></p></div>'}`;
};
DashViews.agent['region-shops'] = (q, u) => `${head('Region shops')}<div class="card">${regionShopsTable(Store.s.shops.filter(s => s.regionId === u.regionId && ['published', 'suspended'].includes(s.status)), true)}</div>`;
DashViews.agent['region-orders'] = (q, u) => {
  const ids = Store.s.shops.filter(s => s.regionId === u.regionId).map(s => s.id);
  return `${head('Region orders', 'All orders from shops in your region. Shops manage their own orders; you can view details and follow up.')}${ordersTable(Store.s.orders.filter(o => ids.includes(o.shopId)), q, { showShop: true })}`;
};
DashViews.agent.collections = (q, u) => {
  const ids = Store.s.shops.filter(s => s.regionId === u.regionId).map(s => s.id);
  const rows = Store.statements(ids);
  return `${head('Commission collection', `Collect the ${Store.s.settings.agentRate}% agent share from each shop monthly. The ${Store.s.settings.platformRate}% platform share is settled with the platform.`)}
    <div class="kpis">${kpi('Collected', money(rows.filter(r => r.state.agentPaid).reduce((a, r) => a + r.agent, 0)), '', 'accent')}${kpi('Still to collect', money(rows.filter(r => !r.state.agentPaid).reduce((a, r) => a + r.agent, 0)), '', 'red')}${kpi('Platform share (region)', money(rows.reduce((a, r) => a + r.platform, 0)))}</div>
    ${settlementTable(rows, 'agent')}`;
};

function settlementTable(rows, mode) {
  return `<div class="table-wrap"><table class="t"><thead><tr><th>Month</th><th>Shop</th><th>Delivered sales</th><th>Agent share</th><th>Platform share</th><th>${mode === 'agent' ? 'Agent share received' : 'Platform share received'}</th><th></th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${monthName(r.month)}</td><td>${esc(L(r.shop, 'name'))}</td><td>${money(r.sales)}</td><td>${money(r.agent)}</td><td>${money(r.platform)}</td>
      <td>${mode === 'agent' && r.agent === 0 ? '<span class="muted">Own shop</span>' : `<label class="switch"><input type="checkbox" data-action="settle" data-key="${esc(r.key)}" data-field="${mode === 'agent' ? 'agentPaid' : 'platformPaid'}" ${r.state[mode === 'agent' ? 'agentPaid' : 'platformPaid'] ? 'checked' : ''}><span></span></label>`}</td>
      <td><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(r.shop.whatsapp, `Hello ${r.shop.name}, your Pittala.lk commission for ${monthName(r.month)}: sales ${money(r.sales)}, ${mode === 'agent' ? `agent share ${money(r.agent)}` : `platform share ${money(r.platform)}`}. Thank you!`)}">${icon('wa')} Remind</a></td></tr>`).join('') || '<tr><td colspan="7" class="muted">No delivered orders yet.</td></tr>'}
  </tbody></table></div>`;
}

function openApplication(id, role) {
  const s = Store.shop(id);
  const o = Store.userById(s.ownerId);
  const canAgent = role === 'agent' && s.status === 'pending_payment';
  const canAdmin = role === 'super' && s.status === 'agent_approved';
  openModal({
    title: s.name, wide: true,
    body: `${applicationPipeline(s)}
      <div class="dash-grid even" style="margin:0">
        <div class="card"><b>Shop</b><dl class="specs" style="grid-template-columns:120px 1fr;font-size:.9rem"><dt>Tagline</dt><dd>${esc(L(s, 'tagline'))}</dd><dt>Address</dt><dd>${esc(s.address)}</dd><dt>Region</dt><dd>${esc(Store.region(s.regionId)?.name || '')}</dd><dt>Established</dt><dd>${esc(s.est)}</dd><dt>Artisans</dt><dd>${esc(s.artisans)}</dd></dl></div>
        <div class="card"><b>Owner</b><dl class="specs" style="grid-template-columns:120px 1fr;font-size:.9rem"><dt>Name</dt><dd>${esc(o?.name || '')}</dd><dt>NIC</dt><dd>${esc(o?.nic || '—')}</dd><dt>Mobile</dt><dd>${esc(s.phone)}</dd><dt>WhatsApp</dt><dd>${esc(s.whatsapp)}</dd><dt>Email</dt><dd>${esc(s.email)}</dd></dl></div>
        <div class="card"><b>Registration payment</b><dl class="specs" style="grid-template-columns:120px 1fr;font-size:.9rem"><dt>Amount</dt><dd>${money(s.payment?.amount)}</dd><dt>Reference</dt><dd>${esc(s.payment?.ref || '')}</dd><dt>Method</dt><dd>${esc(s.payment?.method || 'Bank deposit')}</dd><dt>Submitted</dt><dd>${s.payment ? fmtDateTime(s.payment.at) : ''}</dd></dl>${s.payment?.slip ? `<img src="${s.payment.slip}" alt="Deposit slip" style="max-height:220px;border-radius:8px">` : '<small class="muted">No slip uploaded.</small>'}</div>
        <div class="card"><b>Agreement</b><p style="font-size:.9rem;margin:8px 0">${esc(`Signed by ${s.agreement?.signedName || ''} on ${s.agreement ? fmtDate(s.agreement.signedAt) : ''} at ${s.agreement?.rate}% commission.`)}</p><button class="btn btn-ghost btn-sm" data-action="view-agreement" data-id="${s.id}">Read agreement</button></div>
      </div>
      ${(canAgent || canAdmin) ? `<div class="field" style="margin-top:14px"><label for="rejWhy">Reason if rejecting (sent to the applicant)</label><input class="input" id="rejWhy" placeholder="e.g. Payment not received yet"></div>` : ''}`,
    foot: `${canAgent || canAdmin ? `<button class="btn btn-ghost" data-action="app-reject" data-id="${s.id}">Reject</button>` : ''}
      ${canAgent ? `<button class="btn btn-brass" data-action="app-agent-ok" data-id="${s.id}">${icon('check')} Payment received — approve</button>` : ''}
      ${canAdmin ? `<button class="btn btn-brass" data-action="app-admin-ok" data-id="${s.id}">${icon('check')} Approve & publish shop</button>` : ''}
      <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(s.whatsapp, `Hello ${o?.name || ''}, about your Pittala.lk application for ${s.name}:`)}">${icon('wa')} WhatsApp applicant</a>`
  });
}

/* Super admin */
DashViews.super.overview = () => {
  const os = Store.s.orders;
  const since = Date.now() - 30 * 864e5;
  const recent = os.filter(o => o.createdAt > since && o.status !== 'cancelled');
  const delivered = os.filter(o => o.status === 'delivered');
  let plat = 0, agent = 0;
  delivered.forEach(o => { const c = Store.commission(Store.shop(o.shopId), o.subtotal); plat += c.platform; agent += c.agent; });
  const gmvAll = delivered.reduce((a, o) => a + o.subtotal, 0);
  const s = dailySeries(os, 30);
  const p = dailySeries(os, 30, o => Store.commission(Store.shop(o.shopId), o.subtotal).platform);
  const shops = Store.publishedShops().map(x => ({ x, r: Store.shopStats(x.id).revenue })).sort((a, b) => b.r - a.r);
  const statusCounts = [...ORDER_FLOW, 'cancelled'].map(x => os.filter(o => o.status === x).length);
  chart('gmvChart', lineCfg(s.labels, [{ label: 'Marketplace sales', data: s.data, borderColor: PATINA, backgroundColor: 'rgba(123,28,28,.08)', fill: true }, { label: 'Platform 2%', data: p.data, borderColor: LACQ }]));
  chart('splitChart', doughnutCfg(['Shops keep', 'Region agents', 'Platform'], [gmvAll - plat - agent, agent, plat], ['#2E4A3A', BRASS, PATINA]));
  chart('statusBar', barCfg([...ORDER_FLOW, 'cancelled'].map(x => STATUS_LABEL[x]), statusCounts, ['#E0A030', '#4A7BC0', '#8C6BC9', '#2E9AA6', '#1E7B34', LACQ]));
  chart('shopBar', barCfg(shops.map(b => b.x.name), shops.map(b => b.r), BRASS, true));
  const finals = Store.s.shops.filter(x => x.status === 'agent_approved');
  return `${head('Platform overview', 'Everything across every region, shop and order.')}
    ${finals.length ? `<div class="notice"><b>${finals.length} shop${finals.length > 1 ? 's' : ''} approved by the region agent and waiting for your final approval.</b> <a href="#/dashboard/approvals" style="text-decoration:underline">Review</a></div>` : ''}
    <div class="kpis">
      ${kpi('Platform earnings (2%)', money(plat), 'delivered orders, all time', 'accent')}
      ${kpi('Agent earnings (10%)', money(agent), 'paid to region agents')}
      ${kpi('Sales, last 30 days', money(recent.reduce((a, o) => a + o.subtotal, 0)), `${recent.length} orders`)}
      ${kpi('Live shops', Store.publishedShops().length, `${Store.s.shops.filter(x => x.status === 'pending_payment').length} with agent · ${finals.length} with you`)}
      ${kpi('Products listed', Store.liveProducts().length, `${Store.liveProducts().filter(x => Store.soldOut(x)).length} sold out · ${Store.liveProducts().filter(x => Store.dealActive(x)).length} on deal`)}
    </div>
    <div class="dash-grid"><div class="card"><h3>Daily sales and platform share</h3><div class="chart-box"><canvas id="gmvChart"></canvas></div></div><div class="card"><h3>Where the money goes</h3><div class="chart-box"><canvas id="splitChart"></canvas></div></div></div>
    <div class="dash-grid even"><div class="card"><h3>Orders by status</h3><div class="chart-box"><canvas id="statusBar"></canvas></div></div><div class="card"><h3>Shop sales, 30 days</h3><div class="chart-box"><canvas id="shopBar"></canvas></div></div></div>
    <div class="card"><h3>Recent activity</h3><ul class="timeline">${Store.s.activity.slice(0, 10).map(a => `<li><b>${esc(a.who)}</b> ${esc(a.what)} <span class="muted">${ago(a.at)}</span></li>`).join('')}</ul></div>`;
};
DashViews.super.approvals = () => {
  const finals = Store.s.shops.filter(x => x.status === 'agent_approved');
  const withAgent = Store.s.shops.filter(x => x.status === 'pending_payment');
  const row = s => `<tr><td><span class="shop-chip">${shopLogo(s)}<span><b>${esc(L(s, 'name'))}</b><br><small class="muted">${esc(Store.userById(s.ownerId)?.name || '')}</small></span></span></td><td>${esc(Store.region(s.regionId)?.name || '')}</td><td>${esc(s.payment?.ref || '')}</td><td>${s.approvals.agentAt ? fmtDate(s.approvals.agentAt) : '—'}</td><td>${statusPill(s.status)}</td><td><button class="btn ${s.status === 'agent_approved' ? 'btn-brass' : 'btn-ghost'} btn-sm" data-action="app" data-id="${s.id}">${s.status === 'agent_approved' ? 'Final review' : 'View'}</button></td></tr>`;
  return `${head('Final approvals', 'Shops reach you after the region agent confirms the registration payment. Approving publishes the shop to buyers.')}
    <div class="card"><h3>Waiting for you (${finals.length})</h3>${finals.length ? `<div class="table-wrap" style="border:0"><table class="t"><thead><tr><th>Shop</th><th>Region</th><th>Payment ref</th><th>Agent approved</th><th>Status</th><th></th></tr></thead><tbody>${finals.map(row).join('')}</tbody></table></div>` : '<p class="muted">Nothing to approve.</p>'}</div>
    <div class="card"><h3>With region agents (${withAgent.length})</h3>${withAgent.length ? `<div class="table-wrap" style="border:0"><table class="t"><thead><tr><th>Shop</th><th>Region</th><th>Payment ref</th><th>Agent approved</th><th>Status</th><th></th></tr></thead><tbody>${withAgent.map(row).join('')}</tbody></table></div>` : '<p class="muted">None.</p>'}</div>`;
};
DashViews.super.shops = () => `${head('All shops', `${Store.s.shops.length} shops across ${Store.s.regions.length} region${Store.s.regions.length > 1 ? 's' : ''}`)}<div class="card">${regionShopsTable(Store.s.shops, false)}</div>`;
DashViews.super.regions = () => {
  onMount(() => {
    const f = document.getElementById('regionForm');
    f && f.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f));
      if (!v.name || !v.agentName || !validLKMobile(v.agentPhone) || !/@/.test(v.agentEmail || '')) { toast('Fill in the region and agent details.', true); return; }
      const rid = 'r' + Date.now(), uid = 'u' + Date.now();
      Store.s.users.push({ id: uid, role: 'agent', name: v.agentName, email: v.agentEmail, password: 'agent123', phone: v.agentPhone, regionId: rid, shopId: null });
      Store.s.regions.push({ id: rid, name: v.name, district: v.district, agentUserId: uid, agentShopId: null, bank: v.bank || '', accName: v.agentName, accNo: v.accNo || '' });
      Store.log(`created region ${v.name} with agent ${v.agentName}`); Store.save(); toast(`Region ${v.name} created. Agent password: agent123`); App.render();
    });
  });
  return `${head('Regions & agents', 'Each region has one agent who onboards shops and earns the agent share. The agent’s own shop pays only the platform share.')}
    <div class="table-wrap" style="margin-bottom:16px"><table class="t"><thead><tr><th>Region</th><th>District</th><th>Agent</th><th>Agent’s shop</th><th>Shops</th><th>Payout account</th></tr></thead><tbody>
      ${Store.s.regions.map(r => { const a = Store.userById(r.agentUserId); const s = r.agentShopId ? Store.shop(r.agentShopId) : null; return `<tr><td><b>${esc(L(r, 'name'))}</b></td><td>${esc(r.district)}</td><td>${esc(a?.name || '—')}<br><small class="muted">${esc(a?.phone || '')}</small></td><td>${s ? esc(s.name) : '<span class="muted">None yet</span>'}</td><td>${Store.s.shops.filter(x => x.regionId === r.id).length}</td><td><small>${esc(r.bank)}<br>${esc(r.accNo)}</small></td></tr>`; }).join('')}
    </tbody></table></div>
    <form class="card" id="regionForm"><h3>Add a region</h3><div class="form-grid">
      <div class="field"><label>Region name</label><input class="input" name="name" placeholder="e.g. Kiriwaththuduwa"></div>
      <div class="field"><label>District</label><select class="input" name="district">${DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('')}</select></div>
      <div class="field"><label>Agent full name</label><input class="input" name="agentName"></div>
      <div class="field"><label>Agent mobile</label><input class="input" name="agentPhone"></div>
      <div class="field"><label>Agent email (sign-in)</label><input class="input" name="agentEmail" type="email"></div>
      <div class="field"><label>Bank & branch</label><input class="input" name="bank"></div>
      <div class="field"><label>Account number</label><input class="input" name="accNo"></div>
    </div><button class="btn btn-dark" style="margin-top:14px">Create region</button></form>`;
};
DashViews.super.buyers = () => {
  const buyers = Store.s.users.filter(x => x.role === 'customer');
  const ordersOf = b => Store.s.orders.filter(o => o.customer.email === b.email);
  return `${head('Buyers', 'Buyer accounts are created automatically at checkout. Login details are emailed to the buyer.')}
    <div class="table-wrap"><table class="t"><thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Joined</th><th>Orders</th><th>Spent</th></tr></thead><tbody>
    ${buyers.map(b => { const os = ordersOf(b); return `<tr><td><b>${esc(L(b, 'name'))}</b></td><td>${esc(b.email)}</td><td>${esc(b.phone)}</td><td>${b.createdAt ? fmtDate(b.createdAt) : '—'}</td><td>${os.length}</td><td>${money(os.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.total, 0))}</td></tr>`; }).join('') || '<tr><td colspan="6" class="muted">No buyers yet.</td></tr>'}
    </tbody></table></div>`;
};
DashViews.super.orders = (q) => `${head('All orders')}${ordersTable(Store.s.orders, q, { showShop: true, edit: true })}`;
DashViews.super.products = (q) => {
  const term = (q.q || '').toLowerCase();
  const list = Store.s.products.filter(p => !term || (p.name + Store.shop(p.shopId).name).toLowerCase().includes(term));
  return `${head('Products', 'Hide listings that break the rules, or feature great pieces on the home page.')}
    <form class="toolbar" onsubmit="event.preventDefault();location.hash='#/dashboard/products?q='+encodeURIComponent(this.elements.q.value)"><input class="input" name="q" value="${esc(q.q || '')}" placeholder="Search products or shops" style="max-width:320px"></form>
    <div class="table-wrap"><table class="t"><thead><tr><th></th><th>Product</th><th>Shop</th><th>Price</th><th>Stock</th><th>Sold</th><th>Visible</th><th>Spotlight</th></tr></thead><tbody>
    ${list.map(p => `<tr><td><img class="t-img" src="${esc(p.images[0])}" alt=""></td><td><a href="#/product/${p.id}"><b>${esc(L(p, 'name'))}</b></a><br><small class="muted">${esc(L(Store.cat(p.category), 'name'))}</small></td><td>${esc(L(Store.shop(p.shopId), 'name'))}</td><td>${money(Store.priceOf(p))}${Store.dealActive(p) ? ` <span class="badge red">−${p.discount}%</span>` : ''}</td><td>${p.stock || '<span class="badge red">Sold out</span>'}</td><td>${p.sold}</td>
      <td><label class="switch"><input type="checkbox" data-action="toggle-active" data-id="${p.id}" ${p.active ? 'checked' : ''}><span></span></label></td>
      <td><label class="switch"><input type="checkbox" data-action="toggle-spot" data-id="${p.id}" ${p.spotlight ? 'checked' : ''}><span></span></label></td></tr>`).join('')}
    </tbody></table></div>`;
};
DashViews.super.commissions = () => {
  const rows = Store.statements();
  return `${head('Commissions', 'Monthly commission per shop. Mark the platform share as received when it arrives.')}
    <div class="kpis">${kpi('Platform share received', money(rows.filter(r => r.state.platformPaid).reduce((a, r) => a + r.platform, 0)), '', 'accent')}${kpi('Platform share due', money(rows.filter(r => !r.state.platformPaid).reduce((a, r) => a + r.platform, 0)), '', 'red')}${kpi('Agent share (all regions)', money(rows.reduce((a, r) => a + r.agent, 0)))}</div>
    ${settlementTable(rows, 'platform')}`;
};
DashViews.super.spotlights = () => `${head('Spotlight requests', 'Approved products appear in the home page spotlight.')}
  <div class="table-wrap"><table class="t"><thead><tr><th>Product</th><th>Shop</th><th>Duration</th><th>Fee</th><th>Requested</th><th>Status</th><th></th></tr></thead><tbody>
  ${Store.s.spotlights.map(s => { const p = Store.product(s.productId); return `<tr><td>${esc(p?.name || '')}</td><td>${esc(L(Store.shop(s.shopId), 'name'))}</td><td>${s.days} days</td><td>${money(s.fee)}</td><td>${fmtDate(s.at)}</td><td><span class="status st-${s.status === 'active' ? 'delivered' : s.status === 'declined' ? 'cancelled' : 'pending'}">${s.status}</span></td>
    <td>${s.status === 'pending' ? `<div class="row-actions"><button class="btn btn-brass btn-sm" data-action="spot" data-id="${s.id}" data-s="active">Approve</button><button class="btn btn-ghost btn-sm" data-action="spot" data-id="${s.id}" data-s="declined">Decline</button></div>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="muted">No requests.</td></tr>'}
  </tbody></table></div>`;
DashViews.super.outbox = () => `${head('Email outbox', 'Emails sent automatically on new orders, status changes and applications. Connect a mail service (see README) to deliver them for real.')}
  <div class="table-wrap"><table class="t"><thead><tr><th>Sent</th><th>To</th><th>Subject</th><th></th></tr></thead><tbody>
  ${Store.s.outbox.slice(0, 100).map((m, i) => `<tr><td>${fmtDateTime(m.at)}</td><td>${esc(m.to)}</td><td>${esc(m.subject)}</td><td><button class="btn btn-ghost btn-sm" data-action="mail" data-i="${i}">Open</button></td></tr>`).join('') || '<tr><td colspan="4" class="muted">No emails yet. Place an order to see one.</td></tr>'}
  </tbody></table></div>`;
DashViews.super.activity = () => `${head('Activity log')}<div class="card"><ul class="timeline">${Store.s.activity.map(a => `<li><b>${esc(a.who)}</b> ${esc(a.what)} <span class="muted">${fmtDateTime(a.at)}</span></li>`).join('')}</ul></div>`;
DashViews.super.settings = () => {
  const st = Store.s.settings;
  onMount(() => {
    const f = document.getElementById('setForm');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f));
      ['platformRate', 'agentRate', 'regFee', 'deliveryKandy', 'deliveryOther', 'freeDeliveryOver'].forEach(k => { st[k] = Math.max(0, +v[k] || 0); });
      st.supportEmail = v.supportEmail; st.supportPhone = v.supportPhone;
      Store.log('updated platform settings'); Store.save(); toast('Settings saved.'); App.render();
    });
  });
  return `${head('Settings', 'Commission rates apply to new calculations straight away.')}
    <form class="card" id="setForm" style="max-width:760px"><div class="form-grid">
      <div class="field"><label>Platform commission %</label><input class="input" name="platformRate" type="number" step="0.5" value="${st.platformRate}"></div>
      <div class="field"><label>Region agent commission %</label><input class="input" name="agentRate" type="number" step="0.5" value="${st.agentRate}"></div>
      <div class="field"><label>Registration fee (Rs.)</label><input class="input" name="regFee" type="number" value="${st.regFee}"></div>
      <div class="field"><label>Free delivery over (Rs.)</label><input class="input" name="freeDeliveryOver" type="number" value="${st.freeDeliveryOver}"></div>
      <div class="field"><label>Delivery fee, Kandy district</label><input class="input" name="deliveryKandy" type="number" value="${st.deliveryKandy}"></div>
      <div class="field"><label>Delivery fee, other districts</label><input class="input" name="deliveryOther" type="number" value="${st.deliveryOther}"></div>
      <div class="field"><label>Support email</label><input class="input" name="supportEmail" value="${esc(st.supportEmail)}"></div>
      <div class="field"><label>Support phone</label><input class="input" name="supportPhone" value="${esc(st.supportPhone)}"></div>
    </div><button class="btn btn-dark" style="margin-top:16px">Save settings</button></form>
    <div class="card" style="max-width:760px"><h3>Demo data</h3><p class="muted">Restores the sample shops, products and orders. Anything you added will be removed.</p><button class="btn btn-ghost" data-action="reset-demo">Reset demo data</button></div>`;
};

/* Customer */
DashViews.customer.orders = (q, u) => {
  const mine = Store.s.orders.filter(o => o.customer.email === u.email || normPhone(o.customer.phone).slice(-9) === normPhone(u.phone).slice(-9)).sort((a, b) => b.createdAt - a.createdAt);
  return `${head('My orders', 'Pay each shop in cash when your parcel arrives.', '<a class="btn btn-brass" href="#/shop">Shop more</a>')}
    ${mine.length ? mine.map(o => { const s = Store.shop(o.shopId); return `<div class="card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px"><div style="display:flex;gap:10px;align-items:center">${shopLogo(s)}<div><b>${esc(o.id)}</b> · ${esc(L(s, 'name'))}<br><small class="muted">${fmtDateTime(o.createdAt)}</small></div></div><div style="text-align:right">${statusPill(o.status)}<br><b>${money(o.total)}</b></div></div>
      <div style="margin-top:10px">${o.items.map(i => `<span class="badge" style="margin:2px">${i.qty} × ${esc(itemName(i))}</span>`).join('')}</div>
      <div class="row-actions" style="margin-top:12px"><a class="btn btn-ghost btn-sm" href="#/track?id=${o.id}&phone=${encodeURIComponent(o.customer.phone)}">Track</a><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(s.whatsapp, `Hello ${s.name}, about my order ${o.id}:`)}">${icon('wa')} Message shop</a>${o.status === 'delivered' ? `<a class="btn btn-ghost btn-sm" href="#/product/${o.items[0].productId}">Write a review</a>` : ''}</div></div>`; }).join('') : '<div class="card empty"><h3>No orders yet</h3><a class="btn btn-dark" href="#/shop">Start shopping</a></div>'}`;
};
DashViews.customer.profile = (q, u) => {
  onMount(() => {
    const f = document.getElementById('pwForm');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f));
      if (v.current !== u.password) { toast('Your current password is not correct.', true); return; }
      if ((v.next || '').length < 6) { toast('Use at least 6 characters.', true); return; }
      if (v.next !== v.next2) { toast('New passwords do not match.', true); return; }
      u.password = v.next;
      Store.s.outbox.unshift({ at: Date.now(), to: u.email, subject: 'Your Pittala.lk password was changed', body: `Hello ${u.name},\n\nYour password was changed on ${fmtDateTime(Date.now())}. If this wasn't you, reply to this email straight away.\n\nPittala.lk` });
      Store.save(); toast('Password changed.'); App.render();
    });
  });
  return `${head('Profile', 'Your account was created automatically with your first order.')}
    <div class="dash-grid even"><div class="card"><h3>Your details</h3><dl class="specs" style="grid-template-columns:90px 1fr"><dt>Name</dt><dd>${esc(L(u, 'name'))}</dd><dt>Email</dt><dd>${esc(u.email)}</dd><dt>Mobile</dt><dd>${esc(u.phone)}</dd><dt>Joined</dt><dd>${u.createdAt ? fmtDate(u.createdAt) : '—'}</dd></dl><p class="muted" style="font-size:.9rem">These are filled in for you at checkout.</p></div>
    <form class="card" id="pwForm"><h3>Change password</h3>
      <div class="field"><label>Current password</label><input class="input" name="current" type="password" autocomplete="current-password"></div>
      <div class="field" style="margin-top:10px"><label>New password</label><input class="input" name="next" type="password" autocomplete="new-password"></div>
      <div class="field" style="margin-top:10px"><label>Repeat new password</label><input class="input" name="next2" type="password" autocomplete="new-password"></div>
      <button class="btn btn-dark" style="margin-top:14px">Change password</button></form></div>`;
};
