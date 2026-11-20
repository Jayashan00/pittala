/* Router and global actions */

const ROUTES = {
  '': ['home', 'Pilimathalawa brass, direct from the makers'],
  shop: ['shop', 'Shop'], product: ['product', 'Product'], stores: ['stores', 'Shops'], store: ['store', 'Shop'],
  deals: ['deals', 'Daily deals'], craft: ['craft', 'About'], about: ['about', 'About Pilimathalawa brass'], sell: ['sell', 'Sell on Pittala'],
  register: ['register', 'Register your shop'], login: ['login', 'Sign in'], cart: ['cart', 'Cart'],
  checkout: ['checkout', 'Checkout'], order: ['order', 'Order placed'], track: ['track', 'Track order'],
  wishlist: ['wishlist', 'Wishlist'], dashboard: ['dashboard', 'Dashboard']
};

const App = {
  lastPath: null,

  parse() {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs = ''] = h.split('?');
    const parts = path.split('/').filter(Boolean);
    return { path, parts, q: Object.fromEntries(new URLSearchParams(qs)) };
  },

  render() {
    const { path, parts, q } = this.parse();
    cleanups.forEach(fn => { try { fn(); } catch (e) {} });
    cleanups = [];
    destroyCharts();
    mountQueue = [];
    const [key, title] = ROUTES[parts[0] || ''] || [null, 'Not found'];
    const page = key ? Pages[key] : Pages.notFound;
    let html;
    try { html = page(q, parts[1]); }
    catch (err) { console.error(err); html = `<div class="wrap"><div class="empty" style="padding:80px 20px"><h1>Something went wrong</h1><p>${esc(err.message)}</p><a class="btn btn-dark" href="#/">Back to home</a></div></div>`; }
    const isDash = key === 'dashboard';
    const samePath = this.lastPath === path;
    const y = window.scrollY;
    document.getElementById('hdr').innerHTML = renderHeader('/' + (parts[0] || ''));
    document.getElementById('app').innerHTML = html;
    document.getElementById('ftr').innerHTML = isDash ? '' : renderFooter();
    document.getElementById('mnav').innerHTML = renderMobileNav('/' + (parts[0] || ''));
    document.title = `${tr(title)} · Pittala.lk`;
    translateNode(document.getElementById('hdr')); translateNode(document.getElementById('app')); translateNode(document.getElementById('ftr')); translateNode(document.getElementById('mnav'));
    const appEl = document.getElementById('app'); appEl.style.animation = 'none'; void appEl.offsetWidth; appEl.style.animation = '';
    mountQueue.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
    mountQueue = [];
    tickTimers();
    bindSearch();
    observeReveals();
    window.scrollTo(0, samePath ? y : 0);
    this.lastPath = path;
  },

  refreshHeader() {
    const { parts } = this.parse();
    document.getElementById('hdr').innerHTML = renderHeader('/' + (parts[0] || ''));
    document.getElementById('mnav').innerHTML = renderMobileNav('/' + (parts[0] || ''));
    translateNode(document.getElementById('hdr')); translateNode(document.getElementById('mnav'));
    bindSearch();
    tickTimers();
  },

  currentShop() { const u = Store.user(); return u && u.shopId ? Store.shop(u.shopId) : null; }
};

let revealIO = null;
function observeReveals() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  if (revealIO) revealIO.disconnect();
  revealIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach(e => revealIO.observe(e));
}

function bindSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('q');
  const box = document.getElementById('suggest');
  if (!form) return;
  const { parts, q } = App.parse();
  if (parts[0] === 'shop' && q.q) input.value = q.q;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const cat = document.getElementById('qcat').value;
    const params = new URLSearchParams();
    if (input.value.trim()) params.set('q', input.value.trim());
    if (cat) params.set('cat', cat);
    box.classList.add('hide');
    location.hash = '#/shop' + (params.toString() ? '?' + params : '');
  });
  input.addEventListener('input', () => {
    const t = input.value.trim().toLowerCase();
    if (t.length < 2) { box.classList.add('hide'); return; }
    const prods = Store.liveProducts().filter(p => (p.name + ' ' + (p.name_si || '') + ' ' + Store.cat(p.category).name + ' ' + (Store.cat(p.category).name_si || '')).toLowerCase().includes(t)).slice(0, 6);
    const shops = Store.publishedShops().filter(s => (s.name + ' ' + (s.name_si || '')).toLowerCase().includes(t)).slice(0, 2);
    const cats = CATEGORIES.filter(c => (c.name + ' ' + c.si).toLowerCase().includes(t)).slice(0, 2);
    box.innerHTML = cats.map(c => `<a href="#/shop?cat=${c.id}">${icon('grid')}<span>in <b>${esc(c.name)}</b></span></a>`).join('')
      + shops.map(s => `<a href="#/store/${s.id}">${shopLogo(s)}<span><b>${esc(s.name)}</b><br><small class="muted">Shop</small></span></a>`).join('')
      + prods.map(p => `<a href="#/product/${p.id}"><img src="${esc(p.images[0])}" alt=""><span>${esc(p.name)}<br><small class="muted">${money(Store.priceOf(p))}${Store.soldOut(p) ? ' · sold out' : ''}</small></span></a>`).join('')
      + `<a href="#/shop?q=${encodeURIComponent(t)}">${icon('search')}<span>See all results for “${esc(t)}”</span></a>`;
    box.classList.remove('hide');
  });
  input.addEventListener('blur', () => setTimeout(() => box.classList.add('hide'), 200));
}

/* ---------- Click actions ---------- */
function addedToCart(id, n) {
  const p = Store.product(id);
  openModal({ title: 'Added to your cart', body: `<div style="display:flex;gap:14px;align-items:center"><img src="${esc(p.images[0])}" alt="" style="width:84px;height:84px;object-fit:cover;border-radius:10px"><div><b>${esc(L(p, 'name'))}</b><br><span class="muted">Qty ${n} · ${money(Store.priceOf(p) * n)}</span><br><span class="muted">Sold by ${esc(L(Store.shop(p.shopId), 'name'))}</span></div></div>`,
    foot: `<button class="btn btn-ghost" data-action="close-modal">Continue shopping</button><a class="btn btn-brass" href="#/cart" onclick="closeModal()">Go to cart (${Store.cartCount()})</a>` });
}

const Actions = {
  lang: el => { I18N.set(el.dataset.l); App.render(); toast(el.dataset.l === 'si' ? 'සිංහල භාෂාව තෝරා ඇත' : 'Language set to English'); },
  'close-modal': () => closeModal(),
  menu: () => document.getElementById('mega').classList.toggle('hide'),
  mega: el => { const m = document.getElementById('mega'); m.classList.toggle('hide'); el.setAttribute('aria-expanded', !m.classList.contains('hide')); },
  add: el => { if (Store.addToCart(el.dataset.id)) { App.refreshHeader(); addedToCart(el.dataset.id, 1); } },
  'add-qty': el => { const n = Math.max(1, +document.getElementById('qty').value || 1); if (Store.addToCart(el.dataset.id, n)) { App.refreshHeader(); addedToCart(el.dataset.id, n); } },
  'buy-now': el => { const n = Math.max(1, +document.getElementById('qty').value || 1); const line = Store.s.cart.find(l => l.productId === el.dataset.id); if (line || Store.addToCart(el.dataset.id, n)) location.hash = '#/checkout'; },
  wish: el => {
    const id = el.dataset.id; const w = Store.s.wishlist;
    const on = !w.includes(id);
    Store.s.wishlist = on ? [...w, id] : w.filter(x => x !== id);
    Store.save();
    document.querySelectorAll(`[data-action="wish"][data-id="${id}"]`).forEach(b => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    toast(on ? 'Saved to your wishlist.' : 'Removed from your wishlist.');
    if (App.parse().parts[0] === 'wishlist') App.render(); else App.refreshHeader();
  },
  notify: el => {
    const p = Store.product(el.dataset.id);
    openModal({ title: 'Tell me when it is back', body: `<p>${esc(`We will message you on WhatsApp when ${L(p, 'name')} is back in stock.`)}</p><div class="field"><label for="nPhone">WhatsApp number</label><input class="input" id="nPhone" placeholder="07X XXX XXXX"></div>`,
      foot: `<button class="btn btn-ghost" data-action="close-modal">Cancel</button><button class="btn btn-dark" data-action="notify-save" data-id="${p.id}">Notify me</button>` });
  },
  'notify-save': el => {
    const v = document.getElementById('nPhone').value;
    if (!validLKMobile(v)) { toast('Enter a valid mobile number.', true); return; }
    const p = Store.product(el.dataset.id);
    p.waitlist = [...(p.waitlist || []), { phone: v, at: Date.now() }];
    Store.save(); closeModal(); toast('Done. The shop will let you know.');
  },
  'remove-line': el => { Store.s.cart = Store.s.cart.filter(l => l.productId !== el.dataset.id); Store.save(); App.render(); },
  'reset-demo': () => { if (confirm('Reset all demo data? Anything you added will be removed.')) { Store.reset(); reg = { step: 1, d: { regionId: 'r1' } }; location.hash = '#/'; App.render(); toast('Demo data restored.'); } },
  copy: el => { const t = el.dataset.text; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Copied.')).catch(() => { prompt('Copy this:', t); }); },
  'demo-login': el => signIn(el.dataset.id, App.parse().q.next),
  logout: () => { Store.s.session = null; Store.save(); toast('Signed out.'); location.hash = '#/'; },
  forgot: () => {
    openModal({ title: 'Forgot your password?', body: `<p>Enter the email you used to buy or register. We will email your login details to it.</p><div class="field"><label for="fgE">Email</label><input class="input" id="fgE" type="email" value="${esc(document.getElementById('l-e')?.value || '')}"></div>`,
      foot: `<button class="btn btn-ghost" data-action="close-modal">Cancel</button><button class="btn btn-dark" data-action="forgot-send">Email my login details</button>` });
  },
  'forgot-send': () => {
    const e = (document.getElementById('fgE').value || '').trim().toLowerCase();
    const u = Store.s.users.find(x => x.email.toLowerCase() === e);
    closeModal();
    if (u) {
      const body = `Hello ${u.name},\n\nYou asked for your Pittala.lk login details.\n\nEmail: ${u.email}\nPassword: ${u.password}\n\nSign in: ${location.origin + location.pathname}#/login\n\nIf you did not ask for this, you can ignore this email.\n\nPittala.lk`;
      Store.s.outbox.unshift({ at: Date.now(), kind: 'reset', to: u.email, subject: 'Your Pittala.lk login details', body });
      Store.save();
      openModal({ title: 'Check your email', body: `<p>${esc(`We sent your login details to ${u.email}.`)}</p><div class="email-preview"><div class="eh"><b>Subject:</b> Your Pittala.lk login details</div><pre>${esc(body)}</pre></div>`, foot: `<a class="btn btn-ghost" href="${mailLink(u.email, 'Your Pittala.lk login details', body)}">Open in my email app</a><button class="btn btn-dark" data-action="close-modal">Done</button>` });
    } else toast('If that email has an account, the login details are on their way.');
  },
  'reg-back': () => { reg.step = Math.max(1, reg.step - 1); App.render(); },
  'view-email': el => {
    const o = Store.s.orders.find(x => x.id === el.dataset.id);
    const body = Msg.email(o);
    openModal({ title: 'Order confirmation email', body: `<div class="email-preview"><div class="eh"><b>To:</b> ${esc(o.customer.email)}<br><b>Subject:</b> Order ${esc(o.id)} received — ${esc(Store.shop(o.shopId).name)}</div><pre>${esc(body)}</pre></div>`,
      foot: `<a class="btn btn-ghost" href="${mailLink(o.customer.email, `Order ${o.id}`, body)}">${icon('mail')} Open in my email app</a><button class="btn btn-dark" data-action="close-modal">Done</button>` });
  },
  mail: el => { const m = Store.s.outbox[+el.dataset.i]; openModal({ title: m.subject, body: `<div class="email-preview"><div class="eh"><b>To:</b> ${esc(m.to)}<br><b>Sent:</b> ${fmtDateTime(m.at)}</div><pre>${esc(m.body)}</pre></div>` }); },
  order: el => openOrder(el.dataset.id, el.dataset.edit === '1'),
  'wa-sent': el => { const o = Store.s.orders.find(x => x.id === el.dataset.id); if (o) { o.waSent = Date.now(); Store.save(); setTimeout(() => { closeModal(); App.render(); toast('WhatsApp opened. Mark the order confirmed once the buyer replies.'); }, 400); } return true; },
  'order-status': el => {
    const o = Store.s.orders.find(x => x.id === el.dataset.id);
    if (el.dataset.s === 'cancelled' && !confirm(`Cancel order ${o.id}? Stock will be returned.`)) return;
    Store.setOrderStatus(o, el.dataset.s); closeModal(); App.render();
    toast(`Order ${o.id}: ${STATUS_LABEL[el.dataset.s]}. Buyer emailed.`);
    setTimeout(() => openOrder(o.id, true), 50);
  },
  print: () => window.print(),
  'edit-product': el => { const s = App.currentShop(); if (s) openProductEditor(s, el.dataset.id); },
  'dup-product': el => { const p = Store.product(el.dataset.id); Store.s.products.push({ ...JSON.parse(JSON.stringify(p)), id: 'p' + Date.now(), name: p.name + ' (copy)', sold: 0, views: 0, reviews: 0, createdAt: Date.now(), spotlight: false }); Store.save(); toast('Product duplicated.'); App.render(); },
  'del-product': el => { const p = Store.product(el.dataset.id); if (confirm(`Delete “${p.name}”? This cannot be undone.`)) { Store.s.products = Store.s.products.filter(x => x.id !== p.id); Store.s.cart = Store.s.cart.filter(l => l.productId !== p.id); Store.log(`deleted product ${p.name}`); Store.save(); App.render(); } },
  'del-coupon': el => { Store.s.coupons = Store.s.coupons.filter(c => c.code !== el.dataset.code); Store.save(); App.render(); },
  app: el => openApplication(el.dataset.id, Store.user().role),
  'app-agent-ok': el => {
    const s = Store.shop(el.dataset.id);
    s.status = 'agent_approved'; s.approvals.agentAt = Date.now(); s.payment.receivedAt = Date.now();
    Store.s.outbox.unshift({ at: Date.now(), to: 'admin@pittala.lk', subject: `Final approval needed: ${s.name}`, body: `The region agent confirmed the registration payment (${s.payment.ref}) for ${s.name}. Please review and publish.` });
    Store.s.outbox.unshift({ at: Date.now(), to: s.email, subject: 'Payment confirmed — final review in progress', body: `Hello,\n\nYour registration payment for ${s.name} has been confirmed by the region agent. The platform team will do a final review and publish your shop shortly.\n\nPittala.lk` });
    Store.log(`confirmed payment and approved ${s.name}`); Store.save(); closeModal(); App.render(); toast(`${s.name} sent to the platform for final approval.`);
  },
  'app-admin-ok': el => {
    const s = Store.shop(el.dataset.id);
    s.status = 'published'; s.approvals.adminAt = Date.now(); s.rating = s.rating || 0;
    Store.s.outbox.unshift({ at: Date.now(), to: s.email, subject: `${s.name} is live on Pittala.lk`, body: `Congratulations!\n\nYour shop is now live. Sign in to add products, set up deals and design your shop page.\n\nPittala.lk` });
    Store.log(`gave final approval and published ${s.name}`); Store.save(); closeModal(); App.render(); toast(`${s.name} is now live.`);
  },
  'app-reject': el => {
    const s = Store.shop(el.dataset.id);
    const why = (document.getElementById('rejWhy')?.value || '').trim();
    if (!why) { toast('Add a short reason so the applicant knows what to fix.', true); document.getElementById('rejWhy')?.focus(); return; }
    s.status = 'rejected'; s.rejectReason = why;
    Store.s.outbox.unshift({ at: Date.now(), to: s.email, subject: `Your Pittala.lk application for ${s.name}`, body: `Hello,\n\nYour application was not approved: ${why}\n\nReply to this email or contact the region agent to resolve it.\n\nPittala.lk` });
    Store.log(`rejected ${s.name}: ${why}`); Store.save(); closeModal(); App.render(); toast('Application rejected and applicant emailed.');
  },
  suspend: el => { const s = Store.shop(el.dataset.id); const to = s.status === 'suspended' ? 'published' : 'suspended'; if (to === 'suspended' && !confirm(`Suspend ${s.name}? Its products will be hidden from buyers.`)) return; s.status = to; Store.log(`${to === 'suspended' ? 'suspended' : 'reactivated'} ${s.name}`); Store.save(); App.render(); },
  spot: el => { const sp = Store.s.spotlights.find(x => x.id === el.dataset.id); sp.status = el.dataset.s; if (sp.status === 'active') { const p = Store.product(sp.productId); if (p) p.spotlight = true; } Store.log(`${sp.status === 'active' ? 'approved' : 'declined'} a spotlight request`); Store.save(); App.render(); },
  'view-agreement': el => {
    const s = Store.shop(el.dataset.id);
    const owner = Store.userById(s.ownerId);
    openModal({ title: 'Seller agreement', wide: true, body: agreementText({ ownerName: owner?.name, shopName: s.name, regionId: s.regionId }, s.agreement?.rate ?? Store.rates(s).total).replace('class="agreement"', 'class="agreement" style="max-height:none"') + `<p style="margin-top:14px">Signed: <span class="signature" style="display:inline-block;min-width:240px">${esc(s.agreement?.signedName || '')}</span> &nbsp; Date: ${s.agreement ? fmtDate(s.agreement.signedAt) : ''}</p>`,
      foot: `<button class="btn btn-ghost" data-action="print">${icon('print')} Print</button><button class="btn btn-dark" data-action="close-modal">Close</button>` });
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el || el.matches('input')) return;
  const fn = Actions[el.dataset.action];
  if (!fn) return;
  if (el.tagName === 'A' && el.dataset.action === 'wa-sent') { fn(el); return; } // let the link open WhatsApp
  e.preventDefault();
  fn(el);
});

/* ---------- Change actions (switches, inline inputs) ---------- */
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.stock) {
    const p = Store.product(el.dataset.stock); p.stock = Math.max(0, +el.value || 0);
    Store.save(); toast(p.stock ? `Stock set to ${p.stock}.` : 'Marked as sold out.'); App.render(); return;
  }
  const a = el.dataset.action;
  if (!a) return;
  if (a === 'toggle-soldout') { const p = Store.product(el.dataset.id); if (el.checked) { p.lastStock = p.stock || p.lastStock || 1; p.stock = 0; } else { p.stock = Math.max(1, p.lastStock || 1); } Store.log(`${el.checked ? 'marked sold out' : 'restocked'} ${p.name}`); Store.save(); toast(el.checked ? `${p.name} now shows the sold-out seal.` : `${p.name} is back in stock.`); App.render(); }
  if (a === 'toggle-active') { const p = Store.product(el.dataset.id); p.active = el.checked; Store.save(); toast(el.checked ? 'Visible to buyers.' : 'Hidden from buyers.'); }
  if (a === 'toggle-spot') { const p = Store.product(el.dataset.id); p.spotlight = el.checked; Store.save(); toast(el.checked ? 'Added to the home page spotlight.' : 'Removed from spotlight.'); }
  if (a === 'settle') { Store.markSettlement(el.dataset.key, el.dataset.field); toast(el.checked ? 'Marked as received.' : 'Marked as due.'); App.render(); }
});

/* ---------- Boot ---------- */
Store.load();
I18N.set(I18N.lang);
document.addEventListener('DOMContentLoaded', () => translateNode(document.body));
window.addEventListener('hashchange', () => App.render());
document.addEventListener('click', e => { const m = document.getElementById('mega'); if (m && !m.classList.contains('hide') && !e.target.closest('#mega, [data-action="mega"]')) m.classList.add('hide'); });
App.render();
