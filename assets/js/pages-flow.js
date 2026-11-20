/* Cart, checkout, tracking, registration and sign-in */

let appliedCoupons = {}; // shopId -> coupon
let otp = { code: null, phone: null, verified: false };

function cartGroups() {
  const groups = {};
  Store.cartLines().forEach(l => { (groups[l.p.shopId] = groups[l.p.shopId] || []).push(l); });
  return Object.entries(groups).map(([shopId, lines]) => {
    const shop = Store.shop(shopId);
    const subtotal = lines.reduce((a, l) => a + Store.priceOf(l.p) * l.qty, 0);
    const cp = appliedCoupons[shopId];
    const discount = cp ? Store.couponValue(cp, subtotal) : 0;
    return { shop, lines, subtotal, discount, coupon: cp };
  });
}

Pages.cart = () => {
  const groups = cartGroups();
  if (!groups.length) return `<div class="wrap"><div class="empty" style="padding:90px 20px"><h1 style="font-size:2.2rem">Your cart is empty</h1><p>Start with a pahana, a bell or one of today’s deals.</p><a class="btn btn-dark" href="#/shop">Browse products</a> <a class="btn btn-ghost" href="#/deals">See deals</a></div></div>`;
  const sub = groups.reduce((a, g) => a + g.subtotal - g.discount, 0);
  onMount(() => {
    document.querySelectorAll('[data-cq]').forEach(b => b.addEventListener('click', () => {
      const line = Store.s.cart.find(l => l.productId === b.dataset.id);
      const p = Store.product(b.dataset.id);
      line.qty = Math.min(p.stock, Math.max(1, line.qty + +b.dataset.cq));
      Store.save(); App.render();
    }));
    document.querySelectorAll('[data-coupon]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const shopId = f.dataset.coupon;
      const code = new FormData(f).get('code');
      const c = Store.couponFor(code, shopId);
      const g = groups.find(x => x.shop.id === shopId);
      if (!c) { toast('That code is not valid for this shop.', true); return; }
      if (g.subtotal < c.minOrder) { toast(`Spend ${money(c.minOrder)} or more with this shop to use ${c.code}.`, true); return; }
      appliedCoupons[shopId] = c; toast(`${c.code} applied.`); App.render();
    }));
  });
  return `<div class="wrap">
    <div class="page-head"><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Your cart</h1><p class="muted" style="margin-top:6px">Items from different shops are packed and delivered separately, each with its own cash-on-delivery payment.</p></div>
    <div class="two-col">
      <div>${groups.map(g => `<div class="card shop-group">
        <div class="shop-group-head"><a href="#/store/${g.shop.id}" style="display:flex;gap:10px;align-items:center">${shopLogo(g.shop)}${esc(L(g.shop, 'name'))}</a><span>${money(g.subtotal)}</span></div>
        ${g.lines.map(l => `<div class="line-item">
          <a href="#/product/${l.p.id}"><img src="${esc(l.p.images[0])}" alt=""></a>
          <div><a href="#/product/${l.p.id}"><b>${esc(L(l.p, 'name'))}</b></a><div class="price"><b>${money(Store.priceOf(l.p))}</b>${Store.dealActive(l.p) ? `<s>${money(l.p.price)}</s>` : ''}</div>
            ${Store.isFlash(l.p) ? miniTimer(l.p.dealEnds) : ''}
            <div style="display:flex;gap:10px;align-items:center;margin-top:8px"><div class="qty"><button data-cq="-1" data-id="${l.p.id}" aria-label="Less">−</button><input value="${l.qty}" readonly aria-label="Quantity"><button data-cq="1" data-id="${l.p.id}" aria-label="More">+</button></div>
            <button class="btn btn-ghost btn-sm" data-action="remove-line" data-id="${l.p.id}">Remove</button></div></div>
          <b>${money(Store.priceOf(l.p) * l.qty)}</b></div>`).join('')}
        <form data-coupon="${g.shop.id}" style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
          ${g.coupon ? `<span class="badge green">${icon('check')} ${esc(g.coupon.code)} saves ${money(g.discount)}</span>` : `<input class="input" name="code" placeholder="Coupon for ${esc(L(g.shop, 'name'))}" style="max-width:240px"><button class="btn btn-ghost btn-sm">Apply</button>`}
        </form></div>`).join('')}</div>
      <aside class="card summary"><h3>Order summary</h3>
        ${groups.map(g => `<div class="sum-row"><span>${esc(L(g.shop, 'name'))}</span><span>${money(g.subtotal - g.discount)}</span></div>`).join('')}
        <div class="sum-row"><span>Delivery</span><span class="muted">Calculated at checkout</span></div>
        <div class="sum-row total"><span>Subtotal</span><span>${money(sub)}</span></div>
        <div class="cod-box" style="margin:14px 0">${icon('coins')}<div><b>Cash on delivery</b><br><small class="muted">The only payment method. Pay each shop when your parcel arrives.</small></div></div>
        <a class="btn btn-brass btn-block" href="#/checkout">Continue to delivery details</a>
      </aside>
    </div></div>`;
};

Pages.checkout = () => {
  const groups = cartGroups();
  if (!groups.length) { location.hash = '#/cart'; return ''; }
  const u = Store.user();
  const pre = u && u.role === 'customer' ? { name: u.name, phone: u.phone, email: u.email } : {};
  onMount(() => {
    const f = document.getElementById('coForm');
    const recalc = () => {
      const district = f.district.value;
      let total = 0;
      document.querySelectorAll('[data-del]').forEach(el => {
        const g = groups.find(x => x.shop.id === el.dataset.del);
        const fee = district ? Store.deliveryFee(district, g.subtotal - g.discount) : null;
        el.textContent = fee === null ? '—' : fee ? money(fee) : 'Free';
        total += g.subtotal - g.discount + (fee || 0);
      });
      document.getElementById('coTotal').textContent = money(total);
    };
    f.district.addEventListener('change', recalc);
    f.sameWa.addEventListener('change', () => { f.whatsapp.disabled = f.sameWa.checked; if (f.sameWa.checked) f.whatsapp.value = f.phone.value; });
    f.phone.addEventListener('input', () => { if (f.sameWa.checked) f.whatsapp.value = f.phone.value; if (normPhone(f.phone.value) !== otp.phone) { otp.verified = false; document.getElementById('otpState').innerHTML = ''; } });
    document.getElementById('sendOtp').addEventListener('click', () => {
      if (!validLKMobile(f.phone.value)) { showErr(f.phone, 'Enter a Sri Lankan mobile number, e.g. 0771234567'); return; }
      otp = { code: String(Math.floor(1000 + Math.random() * 9000)), phone: normPhone(f.phone.value), verified: false };
      document.getElementById('otpRow').classList.remove('hide');
      toast(`SMS preview (demo): your Pittala code is ${otp.code}`);
    });
    document.getElementById('checkOtp').addEventListener('click', () => {
      if (f.otp.value.trim() === otp.code) { otp.verified = true; document.getElementById('otpRow').classList.add('hide'); document.getElementById('otpState').innerHTML = `<span class="badge green">${icon('check')} Number verified</span>`; }
      else toast('That code does not match. Check the SMS and try again.', true);
    });
    f.addEventListener('submit', e => {
      e.preventDefault();
      f.querySelectorAll('.err').forEach(x => x.remove()); f.querySelectorAll('.bad').forEach(x => x.classList.remove('bad'));
      const v = Object.fromEntries(new FormData(f));
      v.whatsapp = f.sameWa.checked ? v.phone : v.whatsapp;
      let ok = true;
      const need = (el, cond, msg) => { if (!cond) { showErr(el, msg); ok = false; } };
      need(f.elements['name'], (v.name || '').trim().split(/\s+/).length >= 2, 'Enter your first and last name');
      need(f.phone, validLKMobile(v.phone), 'Enter a valid mobile number, e.g. 0771234567');
      need(f.whatsapp, validLKMobile(v.whatsapp), 'Enter a valid WhatsApp number');
      need(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email || ''), 'Enter a valid email so we can send your order confirmation');
      need(f.address, (v.address || '').trim().length >= 6, 'Enter house number and street');
      need(f.city, (v.city || '').trim().length >= 2, 'Enter your town or city');
      need(f.district, !!v.district, 'Choose your district');
      need(f.postal, /^\d{5}$/.test(v.postal || ''), 'Postal codes in Sri Lanka have 5 digits');
      if (!otp.verified || otp.phone !== normPhone(v.phone)) { showErr(f.phone, 'Verify this number with the SMS code first'); ok = false; }
      // Guest checkout creates (or links) a buyer account automatically
      const existing = !u && v.email ? Store.s.users.find(x => x.email.toLowerCase() === v.email.trim().toLowerCase()) : null;
      if (!u) {
        const pw = f.elements.password;
        if (existing && existing.role !== 'customer') need(pw, false, 'This email belongs to a seller account. Use a different email to buy.');
        else if (existing) need(pw, existing.password === v.password, 'You already have an account with this email. Enter that password, or use “Forgot password” on the sign-in page.');
        else {
          need(pw, (v.password || '').length >= 6, 'Create a password with at least 6 characters');
          need(f.elements.password2, v.password === v.password2, 'Passwords do not match');
        }
      }
      need(f.confirm, f.confirm.checked, 'Please confirm your details are correct');
      if (!ok) { const first = f.querySelector('.bad'); first && first.focus(); toast('Some details need fixing before we can place the order.', true); return; }
      const customer = { name: v.name.trim(), phone: v.phone, whatsapp: v.whatsapp, email: v.email.trim(), address: v.address.trim(), line2: (v.line2 || '').trim(), city: v.city.trim(), district: v.district, postal: v.postal, landmark: (v.landmark || '').trim(), notes: (v.notes || '').trim(), time: v.time };
      const res = Store.placeOrder(customer, appliedCoupons);
      appliedCoupons = {}; otp = { code: null, phone: null, verified: false };
      let acct = '';
      if (!u) {
        if (existing) { Store.s.session = existing.id; acct = 'linked'; }
        else {
          const nu = { id: 'u' + Date.now(), role: 'customer', name: customer.name, email: customer.email, password: v.password, phone: customer.phone, createdAt: Date.now() };
          Store.s.users.push(nu);
          Store.s.session = nu.id;
          Store.s.outbox.unshift({ at: Date.now(), kind: 'account', to: nu.email, subject: 'Your Pittala.lk account is ready', body: accountEmail(nu, res.groupId) });
          Store.log(`buyer account created for ${nu.email} at checkout`);
          acct = 'new';
        }
        Store.save();
      }
      location.hash = `#/order/${res.groupId}${acct ? '?acct=' + acct : ''}`;
    });
  });
  return `<div class="wrap">
    <div class="page-head"><div class="crumbs"><a href="#/cart">Cart</a> / Delivery details</div><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Where should we deliver?</h1><p class="muted" style="margin-top:6px">Shops use these details to confirm your order on WhatsApp and to deliver. Please make sure they are complete.</p></div>
    <form class="two-col" id="coForm" novalidate>
      <div>
        <div class="card"><h3>Contact</h3><div class="form-grid">
          <div class="field full"><label for="f-name">Full name</label><input class="input" id="f-name" name="name" autocomplete="name" value="${esc(pre.name || '')}" required></div>
          <div class="field"><label for="f-phone">Mobile number</label><div style="display:flex;gap:8px"><input class="input" id="f-phone" name="phone" inputmode="tel" autocomplete="tel" placeholder="07X XXX XXXX" value="${esc(pre.phone || '')}"><button type="button" class="btn btn-ghost btn-sm" id="sendOtp">Send code</button></div><span id="otpState"></span></div>
          <div class="field"><label for="f-wa">WhatsApp number</label><input class="input" id="f-wa" name="whatsapp" inputmode="tel" disabled value="${esc(pre.phone || '')}"><label class="chk"><input type="checkbox" name="sameWa" checked> Same as mobile</label></div>
          <div class="field full hide" id="otpRow"><label for="f-otp">Enter the 4-digit code we sent to your phone</label><div style="display:flex;gap:8px;max-width:280px"><input class="input" id="f-otp" name="otp" inputmode="numeric" maxlength="4"><button type="button" class="btn btn-dark btn-sm" id="checkOtp">Verify</button></div></div>
          <div class="field full"><label for="f-email">Email</label><input class="input" id="f-email" name="email" type="email" autocomplete="email" value="${esc(pre.email || '')}"><span class="hint">Your order confirmation is sent here.</span></div>
          ${u ? `<div class="field full"><span class="badge green">${icon('check')} Signed in as ${esc(u.email)} — this order is saved to your account</span></div>` : `
          <div class="field full" style="border-top:1px dashed var(--line);padding-top:12px"><b>Your account</b><span class="hint">No sign-up needed. We create your account with this order so you can track it, and email your login details to you.</span></div>
          <div class="field"><label for="f-pw">Create a password</label><input class="input" id="f-pw" name="password" type="password" autocomplete="new-password" placeholder="At least 6 characters"></div>
          <div class="field"><label for="f-pw2">Confirm password</label><input class="input" id="f-pw2" name="password2" type="password" autocomplete="new-password"><span class="hint">Already bought from us? Enter your existing password.</span></div>`}
        </div></div>
        <div class="card"><h3>Delivery address</h3><div class="form-grid">
          <div class="field full"><label for="f-a1">House number and street</label><input class="input" id="f-a1" name="address" autocomplete="address-line1"></div>
          <div class="field full"><label for="f-a2">Apartment, lane or area (optional)</label><input class="input" id="f-a2" name="line2" autocomplete="address-line2"></div>
          <div class="field"><label for="f-city">Town / city</label><input class="input" id="f-city" name="city" autocomplete="address-level2"></div>
          <div class="field"><label for="f-dist">District</label><select class="input" id="f-dist" name="district"><option value="">Choose district</option>${DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('')}</select></div>
          <div class="field"><label for="f-post">Postal code</label><input class="input" id="f-post" name="postal" inputmode="numeric" maxlength="5" autocomplete="postal-code"></div>
          <div class="field"><label for="f-time">Best time to deliver</label><select class="input" id="f-time" name="time"><option value="Any time">Any time</option><option value="Morning (8–12)">Morning (8–12)</option><option value="Afternoon (12–4)">Afternoon (12–4)</option><option value="Evening (4–7)">Evening (4–7)</option></select></div>
          <div class="field full"><label for="f-land">Nearest landmark</label><input class="input" id="f-land" name="landmark" placeholder="e.g. opposite the temple, next to Keells"></div>
          <div class="field full"><label for="f-notes">Notes for the shop (optional)</label><textarea class="input" id="f-notes" name="notes" placeholder="Gift wrapping, engraving request, gate code…"></textarea></div>
        </div></div>
      </div>
      <aside class="card summary"><h3>Your order</h3>
        ${groups.map(g => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><b>${esc(L(g.shop, 'name'))}</b>
          ${g.lines.map(l => `<div class="sum-row"><span>${l.qty} × ${esc(L(l.p, 'name'))}</span><span>${money(Store.priceOf(l.p) * l.qty)}</span></div>`).join('')}
          ${g.discount ? `<div class="sum-row"><span>Coupon ${esc(g.coupon.code)}</span><span>−${money(g.discount)}</span></div>` : ''}
          <div class="sum-row"><span>Delivery</span><span data-del="${g.shop.id}">—</span></div></div>`).join('')}
        <div class="sum-row total"><span>Total to pay on delivery</span><span id="coTotal">${money(groups.reduce((a, g) => a + g.subtotal - g.discount, 0))}</span></div>
        <div class="cod-box" style="margin:14px 0">${icon('coins')}<div><b>Cash on delivery</b><br><small class="muted">No card or bank details needed.</small></div></div>
        <label class="chk" style="align-items:flex-start"><input type="checkbox" name="confirm"> <span>My name, phone number and address are correct. I understand the shop will call or WhatsApp me to confirm.</span></label>
        <button class="btn btn-brass btn-block" style="margin-top:14px">Place order</button>
      </aside>
    </form></div>`;
};

function accountEmail(u, orderId) {
  const site = location.origin + location.pathname;
  return `Hello ${u.name},\n\nThank you for ${orderId ? `your order ${orderId}` : 'joining'} on Pittala.lk. We created an account for you so you can track your orders and buy again faster.\n\nYour login details\nEmail: ${u.email}\nPassword: ${u.password}\n\nSign in: ${site}#/login\n\nFor your security, keep this email private. You can change your password any time under Profile after signing in.\n\nPittala.lk — Pilimathalawa brass, direct from the makers.`;
}
function sellerEmail(u, shop) {
  const site = location.origin + location.pathname;
  return `Hello ${u.name},\n\nThank you for applying to open "${shop.name}" on Pittala.lk.\n\nYour login details\nEmail: ${u.email}\nPassword: ${u.password}\nSign in: ${site}#/login\n\nWhat happens next\n1. The region agent checks that your ${money(shop.payment.amount)} registration fee (reference ${shop.payment.ref}) has arrived.\n2. The agent approves your application.\n3. The Pittala.lk platform team gives final approval and your shop goes live.\n\nWe will email you at every step. While you wait, sign in to add products and design your shop page so you are ready on day one.\n\nPittala.lk`;
}

function showErr(el, msg) {
  el.classList.add('bad');
  const box = el.closest('.field') || el.parentElement;
  if (box.querySelector('.err')) return;
  const s = document.createElement('span'); s.className = 'err'; s.textContent = msg; box.appendChild(s);
}

Pages.order = (q, gid) => {
  const orders = Store.s.orders.filter(o => o.groupId === gid);
  if (!orders.length) return Pages.notFound();
  const c = orders[0].customer;
  const acctMailIdx = Store.s.outbox.findIndex(m => m.kind === 'account' && m.to === c.email);
  const acctMail = Store.s.outbox[acctMailIdx];
  const acctBox = q.acct === 'new' ? `<div class="card" style="border:2px solid var(--brass);margin-bottom:16px"><div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap"><span class="avatar">${icon('user')}</span><div style="flex:1;min-width:220px"><b>Your Pittala.lk account is ready</b><p class="muted" style="margin:4px 0 10px">${esc(`We created an account for ${c.email} and emailed your login details. You are signed in now and can follow this order any time from My orders.`)}</p>
      <div class="row-actions">${acctMail ? `<button class="btn btn-ghost btn-sm" data-action="mail" data-i="${acctMailIdx}">${icon('mail')} View the email</button><a class="btn btn-ghost btn-sm" href="${mailLink(c.email, acctMail.subject, acctMail.body)}">Open in my email app</a>` : ''}<a class="btn btn-dark btn-sm" href="#/dashboard/orders">My orders</a></div></div></div></div>`
    : q.acct === 'linked' ? `<div class="notice">This order was added to your existing account. <a href="#/dashboard/orders" style="text-decoration:underline">See all your orders</a></div>` : '';
  return `<div class="wrap" style="max-width:900px;padding-bottom:60px">
    <div class="page-head" style="text-align:center">
      <div style="width:70px;height:70px;border-radius:50%;background:var(--patina-900);color:var(--brass-light);display:grid;place-items:center;margin:0 auto 16px">${icon('check')}</div>
      <h1 style="font-size:clamp(2rem,4vw,2.8rem)">Thank you, ${esc(c.name.split(' ')[0])}</h1>
      <p class="muted" style="margin-top:8px">${esc(`Order ${gid} has been placed. A confirmation email is on its way to ${c.email}. Each shop will WhatsApp you on ${c.whatsapp} before dispatch.`)}</p>
    </div>
    ${acctBox}
    ${orders.map(o => { const s = Store.shop(o.shopId); return `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div style="display:flex;gap:10px;align-items:center">${shopLogo(s)}<div><b>${esc(L(s, 'name'))}</b><br><small class="muted">Order ${esc(o.id)}</small></div></div>${statusPill(o.status)}</div>
      ${o.items.map(i => `<div class="line-item" style="grid-template-columns:60px 1fr auto"><img src="${esc(i.img)}" alt="" style="width:60px;height:60px"><span>${i.qty} × ${esc(itemName(i))}</span><b>${money(i.price * i.qty)}</b></div>`).join('')}
      ${o.discount ? `<div class="sum-row"><span>Coupon ${esc(o.coupon)}</span><span>−${money(o.discount)}</span></div>` : ''}
      <div class="sum-row"><span>Delivery</span><span>${o.delivery ? money(o.delivery) : 'Free'}</span></div>
      <div class="sum-row total"><span>Pay on delivery</span><span>${money(o.total)}</span></div>
      <div class="row-actions" style="margin-top:14px">
        <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(s.whatsapp, Msg.waToShop(o))}">${icon('wa')} Message the shop on WhatsApp</a>
        <button class="btn btn-ghost btn-sm" data-action="view-email" data-id="${o.id}">${icon('mail')} View confirmation email</button>
        <a class="btn btn-ghost btn-sm" href="#/track?id=${o.id}&phone=${encodeURIComponent(c.phone)}">Track this order</a>
      </div></div>`; }).join('')}
    <p style="text-align:center;margin-top:24px"><a class="btn btn-dark" href="#/shop">Continue shopping</a></p>
  </div>`;
};

Pages.track = (q) => {
  const id = (q.id || '').trim().toUpperCase();
  const phone = q.phone || '';
  let result = '';
  if (id) {
    const o = Store.s.orders.find(x => x.id.toUpperCase() === id);
    if (!o || (phone && normPhone(o.customer.phone).slice(-9) !== normPhone(phone).slice(-9))) {
      result = `<div class="notice red">${esc(`We could not find order ${id} with that phone number. Check the order number in your email.`)}</div>`;
    } else {
      const s = Store.shop(o.shopId);
      const idx = ORDER_FLOW.indexOf(o.status);
      result = `<div class="card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px"><div><b>Order ${esc(o.id)}</b><br><small class="muted">${esc(L(s, 'name'))} · placed ${fmtDateTime(o.createdAt)}</small></div>${statusPill(o.status)}</div>
        ${o.status === 'cancelled' ? '<p class="notice red" style="margin-top:14px">This order was cancelled.</p>' : `<div class="pipeline" style="grid-template-columns:repeat(5,1fr)">${ORDER_FLOW.map((st, i) => `<div class="pipe ${i < idx ? 'done' : i === idx ? 'current' : ''}"><b>${STATUS_LABEL[st]}</b>${o.history.find(h => h.s === st) ? `<span>${fmtDateTime(o.history.find(h => h.s === st).at)}</span>` : ''}</div>`).join('')}</div>`}
        <div class="sum-row total"><span>Amount to pay on delivery</span><span>${money(o.total)}</span></div>
        <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(s.whatsapp, `Hello ${s.name}, checking on my order ${o.id}.`)}">${icon('wa')} Ask the shop</a></div>`;
    }
  }
  return `<div class="wrap" style="max-width:820px;padding-bottom:60px">
    <div class="page-head"><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Track your order</h1><p class="muted" style="margin-top:6px">Use the order number from your confirmation email and the mobile number you ordered with.</p></div>
    <form class="card" onsubmit="event.preventDefault();location.hash='#/track?id='+encodeURIComponent(this.elements.oid.value)+'&phone='+encodeURIComponent(this.elements.phone.value)">
      <div class="form-grid"><div class="field"><label for="t-id">Order number</label><input class="input" id="t-id" name="oid" value="${esc(id)}" placeholder="PB1234567"></div>
      <div class="field"><label for="t-ph">Mobile number</label><input class="input" id="t-ph" name="phone" value="${esc(phone)}" placeholder="07X XXX XXXX"></div></div>
      <button class="btn btn-dark" style="margin-top:14px">Track order</button></form>
    ${result}</div>`;
};

Pages.wishlist = () => {
  const items = Store.s.wishlist.map(id => Store.product(id)).filter(Boolean);
  return `<div class="wrap" style="padding-bottom:60px"><div class="page-head"><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Saved pieces</h1><p class="muted" style="margin-top:6px">Prices and stock update live. Sold-out pieces show a seal until the shop restocks.</p></div>
    ${items.length ? `<div class="grid">${items.map(p => productCard(p)).join('')}</div>` : `<div class="empty card"><h3>Nothing saved yet</h3><p>Tap the heart on any piece to keep it here.</p><a class="btn btn-dark" href="#/shop">Browse products</a></div>`}</div>`;
};

/* =================== SHOP REGISTRATION =================== */
let reg = { step: 1, d: { regionId: 'r1' } };

function agreementText(d, rate) {
  const st = Store.s.settings;
  const r = Store.region(d.regionId) || Store.s.regions[0];
  const agentName = Store.userById(r.agentUserId)?.name || 'the region agent';
  if (isSi()) return `<div class="agreement" id="agreeBox" data-notr>
    <p><b>Pittala.lk විකුණුම්කරු ගිවිසුම</b> — 2026.1 අනුවාදය</p>
    <p>මෙම ගිවිසුම <b>${esc(d.shopName || '[වෙළඳසැලේ නම]')}</b> ("වෙළඳසැල") හි හිමිකරු <b>${esc(d.ownerName || '[හිමිකරුගේ නම]')}</b>, ${esc(r.name)} කලාපයේ කලාපීය නියෝජිත <b>${esc(agentName)}</b> ("නියෝජිත") සහ Pittala.lk ("වේදිකාව") අතර වේ.</p>
    <h4>1. කොමිස් මුදල</h4>
    <p>වේදිකාව හරහා ලැබී භාරදුන් සෑම ඇණවුමකම වටිනාකමින් (බෙදාහැරීමේ ගාස්තු හැර) <b>${rate}%</b> ක කොමිස් මුදලක් ගෙවීමට වෙළඳසැල එකඟ වේ. එයින් <b>${st.agentRate}%</b> නියෝජිතට සහ <b>${st.platformRate}%</b> වේදිකාවට ගෙවිය යුතුය. අවලංගු කළ සහ ආපසු ලැබුණු ඇණවුම් සඳහා කොමිස් අය නොකෙරේ.</p>
    <h4>2. ලියාපදිංචි ගාස්තුව</h4>
    <p>අනුමැතියට පෙර <b>${money(st.regFee).replace('Rs.', 'රු.')}</b> ක එක් වරක් පමණක් ගෙවන, ආපසු නොගෙවන ලියාපදිංචි ගාස්තුවක් නියෝජිතට ගෙවිය යුතුය. නියෝජිත ගෙවීම තහවුරු කළ පසු වේදිකාව අවසන් අනුමැතිය ලබා දී වෙළඳසැල ප්‍රකාශයට පත් කරයි.</p>
    <h4>3. ගෙවීම් සහ පියවීම්</h4>
    <p>සියලුම ගැනුම්කරු ගෙවීම් භාණ්ඩ ලැබුණු විට මුදල් ගෙවීමේ ක්‍රමයට වන අතර ඒවා වෙළඳසැල විසින් එකතු කරයි. කොමිස් මුදල මාසිකව ගණනය කර ඊළඟ මාසයේ 10 වැනිදාට පෙර පියවිය යුතුය. ප්‍රකාශන වෙළඳසැල් පාලක පුවරුවේ ලබා ගත හැක.</p>
    <h4>4. ලැයිස්තුගත කිරීම් සහ මිල</h4>
    <p>වෙළඳසැල සිය මිල, වට්ටම් සහ කූපන් තීරණය කරන අතර නිවැරදි ඡායාරූප, විස්තර, ද්‍රව්‍ය සහ තොග තොරතුරු සඳහා වගකිව යුතුය. භාණ්ඩ සැබෑ පිත්තලෙන් හෝ සඳහන් කළ ලෝහයෙන් සාදා තිබිය යුතුය.</p>
    <h4>5. ඇණවුම් සහ බෙදාහැරීම</h4>
    <p>වෙළඳසැල සෑම ඇණවුමක්ම පැය 24 ක් ඇතුළත ගැනුම්කරු සමඟ (WhatsApp හෝ දුරකථනයෙන්) තහවුරු කර, පෙන්වා ඇති කාලය තුළ යවා, ඇණවුමේ තත්ත්වය යාවත්කාලීනව තබා ගත යුතුය.</p>
    <h4>6. හැසිරීම</h4>
    <p>කොමිස් මඟහැරීම සඳහා වේදිකාවේ ගැනුම්කරුවන් පිටත විකුණුම්වලට යොමු නොකළ යුතුය. නැවත නැවත අවලංගු කිරීම්, වැරදි ලැයිස්තු හෝ නොගෙවූ කොමිස් සඳහා නියෝජිත හෝ වේදිකාව වෙළඳසැල අත්හිටුවිය හැක.</p>
    <h4>7. කාලසීමාව</h4>
    <p>කිසියම් පාර්ශ්වයක් දින 30 ක ලිඛිත දැනුම්දීමක් ලබා දෙන තෙක් මෙම ගිවිසුම බලාත්මකව පවතී. අවසන් කිරීමට පෙර භාරදුන් ඇණවුම් සඳහා කොමිස් මුදල ගෙවිය යුතුමය.</p>
  </div>`;
  return `<div class="agreement" id="agreeBox">
    <p><b>Pittala.lk Seller Agreement</b> — version 2026.1</p>
    <p>This agreement is between <b>${esc(d.ownerName || '[Owner name]')}</b>, owner of <b>${esc(d.shopName || '[Shop name]')}</b> (“the Shop”); <b>${esc(agentName)}</b>, Region Agent for ${esc(L(r, 'name'))} (“the Agent”); and Pittala.lk (“the Platform”).</p>
    <h4>1. Commission</h4>
    <p>The Shop agrees to pay a commission of <b>${rate}%</b> on the value of every delivered order placed through the Platform, excluding delivery fees. Of this, <b>${st.agentRate}%</b> is payable to the Agent and <b>${st.platformRate}%</b> to the Platform. Cancelled and returned orders are not charged.</p>
    <h4>2. Registration fee</h4>
    <p>A one-time, non-refundable registration fee of <b>${money(st.regFee)}</b> is payable to the Agent before approval. The Agent confirms receipt; the Platform then gives final approval and publishes the Shop.</p>
    <h4>3. Payment and settlement</h4>
    <p>All buyer payments are cash on delivery, collected by the Shop. Commission is calculated monthly and settled by the 10th of the following month. Statements are available in the Shop dashboard.</p>
    <h4>4. Listings and pricing</h4>
    <p>The Shop sets its own prices, discounts and coupons, and is responsible for accurate photos, descriptions, materials and stock. Items must be made of genuine brass or the metal stated.</p>
    <h4>5. Orders and delivery</h4>
    <p>The Shop confirms every order with the buyer (by WhatsApp or phone) within 24 hours, dispatches within the time shown and keeps the order status updated.</p>
    <h4>6. Conduct</h4>
    <p>The Shop will not move Platform buyers to off-platform sales to avoid commission. The Agent or Platform may suspend a Shop for repeated cancellations, false listings or unpaid commission.</p>
    <h4>7. Term</h4>
    <p>This agreement continues until either party gives 30 days’ written notice. Commission on orders delivered before termination remains payable.</p>
  </div>`;
}

Pages.register = () => {
  const st = Store.s.settings;
  const d = reg.d;
  const step = reg.step;
  const r = Store.region(d.regionId) || Store.s.regions[0];
  const agentUser = Store.userById(r.agentUserId);
  const steps = ['Shop details', 'Owner & login', 'Agreement', 'Registration fee', 'Submitted'];

  onMount(() => {
    const f = document.getElementById('regForm');
    if (!f) return;
    const slip = document.getElementById('slipFile');
    slip && slip.addEventListener('change', async () => {
      if (!slip.files[0]) return;
      d.slip = await fileToDataURL(slip.files[0], 1000);
      document.getElementById('slipPrev').innerHTML = `<img src="${d.slip}" alt="Deposit slip" style="max-height:160px;border-radius:8px">`;
    });
    const sig = f.querySelector('[name="signedName"]');
    sig && sig.addEventListener('input', () => { document.getElementById('sigPreview').textContent = sig.value; });
    f.addEventListener('submit', e => {
      e.preventDefault();
      f.querySelectorAll('.err').forEach(x => x.remove()); f.querySelectorAll('.bad').forEach(x => x.classList.remove('bad'));
      const v = Object.fromEntries(new FormData(f));
      let ok = true;
      const need = (name, cond, msg) => { if (!cond) { showErr(f.querySelector(`[name="${name}"]`), msg); ok = false; } };
      if (step === 1) {
        need('shopName', (v.shopName || '').trim().length >= 3, 'Enter your shop name');
        need('address', (v.address || '').trim().length >= 6, 'Enter the workshop address');
        need('tagline', (v.tagline || '').trim().length >= 5, 'Add a one-line description');
        if (ok && Store.s.shops.some(s => s.name.toLowerCase() === v.shopName.trim().toLowerCase())) { showErr(f.elements.shopName, 'A shop with this name already exists'); ok = false; }
        v.cats = new FormData(f).getAll('cats');
      } else if (step === 2) {
        need('ownerName', (v.ownerName || '').trim().split(/\s+/).length >= 2, 'Enter your full name');
        need('nic', /^(\d{9}[VvXx]|\d{12})$/.test((v.nic || '').trim()), 'Enter a valid NIC (e.g. 851234567V or 198512345678)');
        need('phone', validLKMobile(v.phone), 'Enter a valid mobile number');
        need('whatsapp', validLKMobile(v.whatsapp), 'Enter a valid WhatsApp number');
        need('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email || ''), 'Enter a valid email');
        need('password', (v.password || '').length >= 6, 'Use at least 6 characters');
        if (ok && Store.s.users.some(u => u.email.toLowerCase() === v.email.toLowerCase())) { showErr(f.elements.email, 'This email already has an account. Sign in instead.'); ok = false; }
      } else if (step === 3) {
        need('agree', f.elements.agree.checked, 'You need to accept the agreement to continue');
        need('signedName', (v.signedName || '').trim().length >= 3, 'Type your name as your signature');
      } else if (step === 4) {
        need('payRef', (v.payRef || '').trim().length >= 4, 'Enter the deposit or transfer reference');
      }
      if (!ok) { toast('Please fix the highlighted fields.', true); return; }
      Object.assign(d, v);
      if (step === 4) submitApplication();
      else { reg.step++; App.render(); window.scrollTo(0, 0); }
    });
  });

  let body = '';
  if (step === 1) body = `<div class="form-grid">
      <div class="field full"><label>Shop name</label><input class="input" name="shopName" value="${esc(d.shopName || '')}" placeholder="e.g. Herath Brass Works"></div>
      <div class="field"><label>Region</label><select class="input" name="regionId">${Store.s.regions.map(x => `<option value="${x.id}" ${x.id === d.regionId ? 'selected' : ''}>${esc(L(x, 'name'))}, ${esc(x.district)}</option>`).join('')}</select></div>
      <div class="field"><label>Year established</label><input class="input" name="est" type="number" min="1900" max="${new Date().getFullYear()}" value="${esc(d.est || '')}"></div>
      <div class="field full"><label>Workshop address</label><input class="input" name="address" value="${esc(d.address || '')}"></div>
      <div class="field full"><label>One-line description</label><input class="input" name="tagline" maxlength="70" value="${esc(d.tagline || '')}" placeholder="e.g. Hand-cast temple lamps and bells"></div>
      <div class="field si-field"><label>Shop name</label><input class="input" name="shopName_si" lang="si" value="${esc(d.shopName_si || '')}" placeholder="උදා: හේරත් පිත්තල වැඩපොළ"></div>
      <div class="field si-field"><label>One-line description</label><input class="input" name="tagline_si" lang="si" maxlength="90" value="${esc(d.tagline_si || '')}" placeholder="උදා: අතින් වාත්තු කළ විහාර පහන්"></div>
      <div class="field"><label>Number of artisans</label><input class="input" name="artisans" type="number" min="1" value="${esc(d.artisans || '')}"></div>
      <div class="field full"><label>What do you make?</label><div style="display:flex;flex-wrap:wrap;gap:4px 16px">${CATEGORIES.map(c => `<label class="chk"><input type="checkbox" name="cats" value="${c.id}" ${(d.cats || []).includes(c.id) ? 'checked' : ''}> ${esc(L(c, 'name'))}</label>`).join('')}</div></div>
    </div>`;
  if (step === 2) body = `<div class="form-grid">
      <div class="field"><label>Owner’s full name</label><input class="input" name="ownerName" value="${esc(d.ownerName || '')}"></div>
      <div class="field"><label>NIC number</label><input class="input" name="nic" value="${esc(d.nic || '')}"></div>
      <div class="field"><label>Mobile</label><input class="input" name="phone" inputmode="tel" value="${esc(d.phone || '')}" placeholder="07X XXX XXXX"></div>
      <div class="field"><label>WhatsApp for orders</label><input class="input" name="whatsapp" inputmode="tel" value="${esc(d.whatsapp || '')}"><span class="hint">Order confirmations are sent from this number.</span></div>
      <div class="field"><label>Email</label><input class="input" name="email" type="email" value="${esc(d.email || '')}"><span class="hint">You will receive order emails here.</span></div>
      <div class="field"><label>Create a password</label><input class="input" name="password" type="password" value="${esc(d.password || '')}"></div>
    </div>`;
  if (step === 3) body = `${agreementText(d, st.agentRate + st.platformRate)}
      <label class="chk" style="margin-top:14px"><input type="checkbox" name="agree" ${d.agree ? 'checked' : ''}> I have read and accept the ${st.agentRate + st.platformRate}% commission agreement.</label>
      <div class="form-grid" style="margin-top:12px"><div class="field"><label>Type your full name to sign</label><input class="input" name="signedName" value="${esc(d.signedName || '')}"></div>
      <div class="field"><label>Signature</label><div class="signature" id="sigPreview">${esc(d.signedName || '')}</div><span class="hint">Signed ${fmtDate(Date.now())}</span></div></div>`;
  if (step === 4) body = `<div class="notice">${esc(`Deposit ${money(st.regFee)} to the ${r.name} region agent, then enter the reference below. Your application goes to the agent for payment verification.`)}</div>
      <dl class="specs" style="grid-template-columns:160px 1fr"><dt>Account name</dt><dd>${esc(r.accName)}</dd><dt>Bank</dt><dd>${esc(r.bank)}</dd><dt>Account number</dt><dd>${esc(r.accNo)}</dd><dt>Agent</dt><dd>${esc(agentUser?.name || '')}, ${esc(agentUser?.phone || '')}</dd><dt>Reference to use</dt><dd>${esc((d.shopName || '').toUpperCase().slice(0, 18))}</dd></dl>
      <div class="form-grid"><div class="field"><label>Deposit / transfer reference</label><input class="input" name="payRef" value="${esc(d.payRef || '')}" placeholder="e.g. BOC-123456"></div>
      <div class="field"><label>Payment method</label><select class="input" name="payMethod"><option value="Bank deposit">Bank deposit</option><option value="Online transfer">Online transfer</option><option value="Cash to agent">Cash to agent</option></select></div>
      <div class="field full"><label>Deposit slip (optional)</label><label class="upload-drop">${icon('doc')} Choose a photo of the slip<input type="file" id="slipFile" accept="image/*" class="sr"></label><div id="slipPrev">${d.slip ? `<img src="${d.slip}" alt="" style="max-height:160px;border-radius:8px">` : ''}</div></div></div>
      <p style="margin-top:12px"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(agentUser?.phone || '', `Hello ${agentUser?.name || ''}, I have applied to open "${d.shopName}" on Pittala.lk and paid the registration fee. Reference: `)}">${icon('wa')} Tell the agent on WhatsApp</a></p>`;
  if (step === 5) {
    const s = Store.shop(reg.createdShopId);
    body = `<div style="text-align:center;padding:10px 0 20px"><h2>Application submitted</h2><p class="muted" style="margin-top:8px">${esc(`${s?.name || ''} is with the region agent for payment verification.`)}</p></div>
      ${applicationPipeline(s)}
      <div class="notice">${esc(`Your login details have been emailed to ${d.email}. You are signed in now: follow your application, add products and design your shop while you wait. Buyers will see your shop after final approval.`)}</div>
      <a class="btn btn-dark" href="#/dashboard">Go to my application</a>`;
  }

  return `<div class="wrap" style="max-width:900px;padding-bottom:60px">
    <div class="page-head"><div class="crumbs"><a href="#/sell">Sell with us</a> / Register</div><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Register your shop</h1></div>
    <div class="stepper">${steps.map((t, i) => `<div class="${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}"><b>${i + 1 < step ? '✓ ' : ''}${t}</b>Step ${i + 1}</div>`).join('')}</div>
    <form class="card" id="regForm" novalidate>${body}
      ${step < 5 ? `<div style="display:flex;justify-content:space-between;margin-top:20px">${step > 1 ? `<button type="button" class="btn btn-ghost" data-action="reg-back">Back</button>` : '<span></span>'}<button class="btn btn-brass">${step === 4 ? 'Submit application' : 'Continue'}</button></div>` : ''}
    </form></div>`;
};

function applicationPipeline(s) {
  if (!s) return '';
  const order = ['pending_payment', 'agent_approved', 'published'];
  const idx = s.status === 'rejected' ? -1 : order.indexOf(s.status);
  const items = [
    ['Application & agreement', s.createdAt, 'Shop owner'],
    ['Payment verified', s.approvals.agentAt, 'Region agent'],
    ['Final approval', s.approvals.adminAt, 'Platform admin'],
    ['Shop is live', s.status === 'published' ? s.approvals.adminAt : null, 'Visible to buyers']
  ];
  return `<div class="pipeline">${items.map(([t, at, who], i) => {
    const cls = s.status === 'published' ? 'done' : i <= idx ? 'done' : i === idx + 1 ? 'current' : '';
    const note = s.status === 'rejected' && i === 0 ? 'Needs changes' : at && cls === 'done' ? fmtDate(at) : cls === 'current' ? 'In progress' : '';
    return `<div class="pipe ${cls}"><b>${t}</b><span>${who}</span><br><span>${note}</span></div>`;
  }).join('')}</div>${s.status === 'rejected' ? `<div class="notice red"><b>Application not approved.</b> ${esc(s.rejectReason || '')}</div>` : ''}`;
}

function submitApplication() {
  const d = reg.d;
  const st = Store.s.settings;
  const uid = 'u' + Date.now(), sid = 's' + Date.now();
  Store.s.users.push({ id: uid, role: 'owner', name: d.ownerName.trim(), email: d.email.trim(), password: d.password, phone: d.phone, nic: d.nic, shopId: sid });
  Store.s.shops.push({
    id: sid, name: d.shopName.trim(), ownerId: uid, regionId: d.regionId, status: 'pending_payment',
    color: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)], banner: BANNERS[Math.floor(Math.random() * BANNERS.length)],
    tagline: d.tagline.trim(), story: '', name_si: (d.shopName_si || '').trim(), tagline_si: (d.tagline_si || '').trim(), phone: d.phone, whatsapp: d.whatsapp, email: d.email.trim(), address: d.address.trim(),
    est: +d.est || new Date().getFullYear(), artisans: +d.artisans || 1, hours: 'Mon–Sat', layout: 'classic', font: 'engraved', announcement: '', rating: 0, cats: d.cats || [],
    createdAt: Date.now(), agreement: { signedName: d.signedName.trim(), rate: st.agentRate + st.platformRate, signedAt: Date.now(), version: '2026.1' },
    payment: { ref: d.payRef.trim(), method: d.payMethod, amount: st.regFee, at: Date.now(), slip: d.slip || '' }, approvals: {}
  });
  const r = Store.region(d.regionId);
  const agent = Store.userById(r.agentUserId);
  Store.s.outbox.unshift({ at: Date.now(), to: agent.email, subject: `New shop application: ${d.shopName}`, body: `${d.ownerName} applied to open "${d.shopName}" in ${r.name}.\nPayment reference: ${d.payRef}\nPlease verify the ${money(st.regFee)} registration fee and approve in your dashboard.` });
  Store.s.activity.unshift({ at: Date.now(), who: d.ownerName, what: `submitted a shop application (${d.shopName})` });
  const newUser = Store.userById(uid);
  Store.s.outbox.unshift({ at: Date.now(), kind: 'account', to: newUser.email, subject: `Application received: ${d.shopName} — your Pittala.lk login`, body: sellerEmail(newUser, Store.shop(sid)) });
  Store.s.session = uid;
  Store.save();
  reg.createdShopId = sid;
  reg.step = 5;
  App.render();
  window.scrollTo(0, 0);
}

/* =================== LOGIN =================== */
Pages.login = (q) => {
  const demo = [
    ['u1', 'Super admin', 'Monitors everything: approvals, all shops, commissions, settings.'],
    ['u2', 'Region agent', 'Pilimathalawa agent. Approves shops, collects 10%, runs his own shop.'],
    ['u3', 'Shop owner', 'Siri Pittala Works. Products, orders, deals, shop design.']
  ];
  onMount(() => {
    const f = document.getElementById('loginForm');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(f));
      const u = Store.s.users.find(x => x.email.toLowerCase() === (v.email || '').trim().toLowerCase() && x.password === v.password);
      if (!u) { toast('Email or password is incorrect.', true); return; }
      signIn(u.id, q.next);
    });
  });
  return `<div class="wrap" style="max-width:980px;padding-bottom:60px">
    <div class="page-head"><h1 style="font-size:clamp(2rem,4vw,2.8rem)">Sign in</h1><p class="muted" style="margin-top:6px">One sign-in for buyers, shop owners, the region agent and platform admins.</p></div>
    <div class="dash-grid even">
      <form class="card" id="loginForm">
        <div class="field"><label for="l-e">Email</label><input class="input" id="l-e" name="email" type="email" autocomplete="username"></div>
        <div class="field" style="margin-top:12px"><label for="l-p">Password</label><input class="input" id="l-p" name="password" type="password" autocomplete="current-password"></div>
        <button class="btn btn-dark btn-block" style="margin-top:16px">Sign in</button>
        <p style="margin:12px 0 0;font-size:.88rem"><a href="#" data-action="forgot" style="text-decoration:underline">Forgot password?</a></p>
        <p class="muted" style="font-size:.88rem;margin:14px 0 0">New workshop? <a href="#/register" style="text-decoration:underline">Register your shop</a>.<br>Buying? No sign-up needed — your account is created at checkout and your login details are emailed to you.</p>
      </form>
      <div><h3 style="margin-bottom:12px">Demo accounts</h3><div class="role-cards" style="grid-template-columns:1fr">
        ${demo.map(([id, t, d]) => { const u = Store.userById(id); return u ? `<button class="role-card" data-action="demo-login" data-id="${id}"><b>${t}</b><span>${d}</span><small class="muted">${esc(u.email)} / ${esc(u.password)}</small></button>` : ''; }).join('')}
      </div></div>
    </div></div>`;
};

function signIn(uid, next) {
  Store.s.session = uid;
  Store.save();
  const u = Store.user();
  toast(`Signed in as ${u.name}`);
  location.hash = next ? decodeURIComponent(next) : (u.role === 'customer' ? '#/dashboard/orders' : '#/dashboard');
}
