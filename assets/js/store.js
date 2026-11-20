/* State, persistence and business rules.
   Frontend-only demo: data lives in the browser (localStorage) so the client
   can click through every role. Swap these functions for API calls later. */

const KEY = 'pittala-state-v4';
let memoryFallback = null;

const Store = {
  s: null,

  load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = memoryFallback; }
    if (raw) { try { this.s = JSON.parse(raw); } catch (e) { this.s = null; } }
    if (!this.s || this.s.version !== 4) this.s = buildSeed();
    this.refreshDemoDeals();
    this.save();
  },

  save() {
    const raw = JSON.stringify(this.s);
    try { localStorage.setItem(KEY, raw); }
    catch (e) {
      memoryFallback = raw;
      if (e && e.name === 'QuotaExceededError') toast('Browser storage is full. Use smaller images or reset the demo data.', true);
    }
  },

  reset() { this.s = buildSeed(); this.save(); },

  // Keep the demo lively: if a seeded flash deal has expired, roll it forward.
  refreshDemoDeals() {
    const now = Date.now();
    this.s.products.forEach(p => {
      if (p.demoDealHours && p.dealEnds && p.dealEnds < now) p.dealEnds = now + p.demoDealHours * 3600e3;
    });
  },

  log(what) {
    const u = this.user();
    this.s.activity.unshift({ at: Date.now(), who: u ? u.name : 'Visitor', what });
    this.s.activity = this.s.activity.slice(0, 200);
  },

  /* ----- lookups ----- */
  user() { return this.s.session ? this.s.users.find(u => u.id === this.s.session) : null; },
  userById(id) { return this.s.users.find(u => u.id === id); },
  shop(id) { return this.s.shops.find(x => x.id === id); },
  product(id) { return this.s.products.find(x => x.id === id); },
  region(id) { return this.s.regions.find(r => r.id === id); },
  cat(id) { return CATEGORIES.find(c => c.id === id) || { id, name: id, img: '' }; },
  publishedShops() { return this.s.shops.filter(x => x.status === 'published'); },
  liveProducts() {
    const ok = new Set(this.publishedShops().map(x => x.id));
    return this.s.products.filter(p => p.active && ok.has(p.shopId));
  },
  isAgentShop(shop) { const r = this.region(shop.regionId); return !!r && r.agentShopId === shop.id; },
  myShop() { const u = this.user(); return u && u.shopId ? this.shop(u.shopId) : null; },

  /* ----- pricing ----- */
  dealActive(p) { return p.discount > 0 && (!p.dealEnds || p.dealEnds > Date.now()); },
  isFlash(p) { return this.dealActive(p) && !!p.dealEnds; },
  priceOf(p) { return this.dealActive(p) ? Math.round(p.price * (1 - p.discount / 100)) : p.price; },
  soldOut(p) { return p.stock <= 0; },

  /* ----- commission ----- */
  rates(shop) {
    const st = this.s.settings;
    const agent = this.isAgentShop(shop) ? 0 : st.agentRate;
    return { platform: st.platformRate, agent, total: st.platformRate + agent };
  },
  commission(shop, amount) {
    const r = this.rates(shop);
    const platform = Math.round(amount * r.platform / 100);
    const agent = Math.round(amount * r.agent / 100);
    return { platform, agent, total: platform + agent, net: amount - platform - agent, rates: r };
  },

  /* ----- stats ----- */
  shopStats(shopId, sinceDays = 30) {
    const since = Date.now() - sinceDays * 864e5;
    const os = this.s.orders.filter(o => o.shopId === shopId);
    const recent = os.filter(o => o.createdAt >= since && o.status !== 'cancelled');
    const delivered = os.filter(o => o.status === 'delivered');
    const revenue = recent.reduce((a, o) => a + o.subtotal, 0);
    const items = recent.reduce((a, o) => a + o.items.reduce((b, i) => b + i.qty, 0), 0);
    return { orders: recent.length, revenue, items, delivered: delivered.length, all: os };
  },
  deliveryFee(district, subtotal) {
    const st = this.s.settings;
    if (subtotal >= st.freeDeliveryOver) return 0;
    return district === 'Kandy' ? st.deliveryKandy : st.deliveryOther;
  },

  /* ----- cart ----- */
  cartLines() {
    return this.s.cart.map(l => ({ ...l, p: this.product(l.productId) })).filter(l => l.p);
  },
  cartCount() { return this.s.cart.reduce((a, l) => a + l.qty, 0); },
  addToCart(pid, qty = 1) {
    const p = this.product(pid);
    if (!p || this.soldOut(p)) { toast('This piece is sold out.', true); return false; }
    const line = this.s.cart.find(l => l.productId === pid);
    const want = (line ? line.qty : 0) + qty;
    if (want > p.stock) { toast(`Only ${p.stock} available from this shop.`, true); return false; }
    if (line) line.qty = want; else this.s.cart.push({ productId: pid, qty });
    this.save();
    return true;
  },

  /* ----- orders ----- */
  placeOrder(customer, couponCodes = {}) {
    const lines = this.cartLines();
    const byShop = {};
    lines.forEach(l => { (byShop[l.p.shopId] = byShop[l.p.shopId] || []).push(l); });
    const groupId = 'PB' + (Date.now() % 1e7).toString().padStart(7, '0');
    const created = [];
    let n = 0;
    Object.entries(byShop).forEach(([shopId, ls]) => {
      const items = ls.map(l => ({ productId: l.p.id, name: l.p.name, img: l.p.images[0], price: this.priceOf(l.p), qty: l.qty }));
      const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
      const cp = couponCodes[shopId];
      const discount = cp ? this.couponValue(cp, subtotal) : 0;
      const delivery = this.deliveryFee(customer.district, subtotal - discount);
      const id = Object.keys(byShop).length > 1 ? `${groupId}-${String.fromCharCode(65 + n++)}` : groupId;
      const order = { id, groupId, shopId, createdAt: Date.now(), status: 'pending', payment: 'COD', items, subtotal: subtotal - discount, discount, coupon: cp ? cp.code : '', delivery, total: subtotal - discount + delivery, customer: { ...customer }, history: [{ s: 'pending', at: Date.now() }] };
      this.s.orders.push(order);
      ls.forEach(l => { l.p.stock = Math.max(0, l.p.stock - l.qty); l.p.sold += l.qty; });
      if (cp) cp.uses++;
      created.push(order);
      // Automatic emails (queued in outbox; wire a real mail service in production)
      const shop = this.shop(shopId);
      this.s.outbox.unshift({ at: Date.now(), to: customer.email, subject: `Order ${id} received — ${shop.name}`, body: Msg.email(order) });
      this.s.outbox.unshift({ at: Date.now(), to: shop.email, subject: `New COD order ${id} — please confirm with buyer`, body: Msg.shopEmail(order) });
    });
    this.s.cart = [];
    this.log(`placed order ${groupId} (${created.length} shop${created.length > 1 ? 's' : ''})`);
    this.save();
    return { groupId, orders: created };
  },
  setOrderStatus(order, s) {
    if (order.status === s) return;
    if (s === 'cancelled' && order.status !== 'cancelled') {
      order.items.forEach(i => { const p = this.product(i.productId); if (p) { p.stock += i.qty; p.sold = Math.max(0, p.sold - i.qty); } });
    }
    order.status = s;
    order.history.push({ s, at: Date.now() });
    const shop = this.shop(order.shopId);
    this.s.outbox.unshift({ at: Date.now(), to: order.customer.email, subject: `Order ${order.id} is now ${STATUS_LABEL[s]}`, body: `Hello ${order.customer.name},\n\nYour order ${order.id} from ${shop.name} is now: ${STATUS_LABEL[s]}.\n\nTotal payable on delivery: ${money(order.total)}\n\nThank you for supporting Pilimathalawa artisans.\nPittala.lk` });
    this.log(`marked order ${order.id} as ${STATUS_LABEL[s]}`);
    this.save();
  },

  couponFor(code, shopId) {
    code = (code || '').trim().toUpperCase();
    return this.s.coupons.find(c => c.code === code && c.shopId === shopId && c.expires > Date.now());
  },
  couponValue(c, subtotal) {
    if (subtotal < c.minOrder) return 0;
    return c.type === 'pct' ? Math.round(subtotal * c.value / 100) : Math.min(c.value, subtotal);
  },

  /* ----- settlements (monthly commission dues) ----- */
  monthKey(ts) { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; },
  statements(shopIds) {
    const rows = {};
    this.s.orders.filter(o => o.status === 'delivered' && (!shopIds || shopIds.includes(o.shopId))).forEach(o => {
      const shop = this.shop(o.shopId);
      const k = `${o.shopId}|${this.monthKey(o.createdAt)}`;
      if (!rows[k]) rows[k] = { key: k, shop, month: this.monthKey(o.createdAt), sales: 0, platform: 0, agent: 0, orders: 0 };
      const c = this.commission(shop, o.subtotal);
      rows[k].sales += o.subtotal; rows[k].platform += c.platform; rows[k].agent += c.agent; rows[k].orders++;
    });
    return Object.values(rows).map(r => ({ ...r, state: this.s.settlements[r.key] || { agentPaid: false, platformPaid: false } }))
      .sort((a, b) => b.month.localeCompare(a.month) || a.shop.name.localeCompare(b.shop.name));
  },
  markSettlement(key, field) {
    const st = this.s.settlements[key] || { agentPaid: false, platformPaid: false };
    st[field] = !st[field];
    st[field + 'At'] = Date.now();
    this.s.settlements[key] = st;
    this.save();
  }
};

const STATUS_LABEL = { pending: 'Awaiting confirmation', confirmed: 'Confirmed', packed: 'Packed', shipped: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled' };
const SHOP_STATUS_LABEL = { pending_payment: 'Awaiting agent approval', agent_approved: 'Awaiting final approval', published: 'Live', rejected: 'Needs changes', suspended: 'Suspended' };
const ORDER_FLOW = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

/* ----- formatting ----- */
const money = n => 'Rs. ' + Math.round(n || 0).toLocaleString('en-LK');
const moneyShort = n => n >= 1e6 ? 'Rs. ' + (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? 'Rs. ' + (n / 1e3).toFixed(1) + 'k' : money(n);
const fmtDate = ts => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtDateTime = ts => new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const ago = ts => { const m = Math.round((Date.now() - ts) / 6e4); if (m < 60) return `${m} min ago`; const h = Math.round(m / 60); if (h < 24) return `${h} h ago`; return `${Math.round(h / 24)} d ago`; };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = name => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const monthName = key => { const [y, m] = key.split('-'); return new Date(+y, +m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); };

/* Sri Lankan phone helpers */
const normPhone = v => (v || '').replace(/[^\d+]/g, '');
const validLKMobile = v => /^(?:\+94|94|0)?7\d{8}$/.test(normPhone(v));
const toWaNumber = v => { const d = normPhone(v).replace(/^\+/, ''); if (d.startsWith('94')) return d; if (d.startsWith('0')) return '94' + d.slice(1); return '94' + d; };
const waLink = (phone, text) => `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(text)}`;
const mailLink = (to, subject, body) => `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/* ----- message templates ----- */
const Msg = {
  itemsText(o) { return o.items.map(i => `• ${i.qty} × ${i.name} — ${money(i.price * i.qty)}`).join('\n'); },
  addr(c) { return [c.address, c.line2, c.city, c.district + ' District', c.postal].filter(Boolean).join(', '); },
  // Shop → buyer: sent by the shop owner with one click after the order arrives
  waToBuyer(o) {
    const shop = Store.shop(o.shopId);
    return `Ayubowan ${o.customer.name} 🙏\n\nThis is *${shop.name}* (Pilimathalawa) via Pittala.lk.\nWe received your order *${o.id}*:\n\n${this.itemsText(o)}\n${o.discount ? `Discount: -${money(o.discount)}\n` : ''}Delivery: ${o.delivery ? money(o.delivery) : 'Free'}\n*Total to pay on delivery: ${money(o.total)}*\n\nDeliver to:\n${this.addr(o.customer)}${o.customer.landmark ? `\nLandmark: ${o.customer.landmark}` : ''}\nPhone: ${o.customer.phone}\n\nPlease reply *YES* to confirm and we will dispatch within 2 working days. Thank you!`;
  },
  waStatus(o) {
    const shop = Store.shop(o.shopId);
    return `Hello ${o.customer.name}, update from *${shop.name}*:\nYour order *${o.id}* is now *${STATUS_LABEL[o.status]}*.\nAmount to pay on delivery: ${money(o.total)}.\nTrack: ${location.origin}${location.pathname}#/track?id=${o.id}`;
  },
  // Buyer → shop: optional, from the order success page
  waToShop(o) {
    return `Hello ${Store.shop(o.shopId).name}, I placed order *${o.id}* on Pittala.lk.\n\n${this.itemsText(o)}\nTotal (COD): ${money(o.total)}\n\nName: ${o.customer.name}\nPhone: ${o.customer.phone}\nAddress: ${this.addr(o.customer)}`;
  },
  email(o) {
    const shop = Store.shop(o.shopId);
    return `Hello ${o.customer.name},\n\nThank you for your order with ${shop.name} on Pittala.lk.\n\nOrder number: ${o.id}\nPayment: Cash on delivery\n\n${this.itemsText(o)}\n${o.discount ? `Discount (${o.coupon}): -${money(o.discount)}\n` : ''}Delivery: ${o.delivery ? money(o.delivery) : 'Free'}\nTotal to pay on delivery: ${money(o.total)}\n\nDelivery address:\n${this.addr(o.customer)}\n\nThe shop will contact you on WhatsApp (${o.customer.whatsapp || o.customer.phone}) to confirm before dispatch.\n\nShop contact: ${shop.phone}\n\nPittala.lk — Pilimathalawa brass, direct from the makers.`;
  },
  shopEmail(o) {
    return `New cash-on-delivery order ${o.id}\n\n${this.itemsText(o)}\nTotal to collect: ${money(o.total)}\n\nBuyer: ${o.customer.name}\nPhone: ${o.customer.phone}\nWhatsApp: ${o.customer.whatsapp}\nEmail: ${o.customer.email}\nAddress: ${this.addr(o.customer)}\nLandmark: ${o.customer.landmark || '-'}\nNotes: ${o.customer.notes || '-'}\n\nOpen your dashboard and press "Send WhatsApp confirmation" to confirm with the buyer.`;
  }
};
