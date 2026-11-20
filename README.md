# Pittala.lk — Pilimathalawa Brass Marketplace (frontend)

A multi-shop marketplace for the brass workshops of Pilimathalawa, Kandy.
This is the **complete frontend**: every page, role and flow works in the browser
using demo data stored in `localStorage`, so the client can click through everything.

## Deploy to Vercel

1. Put this folder in a Git repo (GitHub/GitLab) **or** use the Vercel CLI.
2. **Vercel dashboard:** *Add New → Project → Import* the repo.
   Framework preset: **Other**. Build command: *none*. Output directory: `./` (root).
3. **CLI:** `npm i -g vercel` then run `vercel` inside this folder, then `vercel --prod`.

No build step is needed — it is plain HTML, CSS and JavaScript.

## Demo accounts

There are three account roles, plus buyers who never need to register in advance.

| Role | Email | Password |
|---|---|---|
| Super admin (platform, 2%) | admin@pittala.lk | admin123 |
| Region agent (Pilimathalawa, 10%) | agent@pittala.lk | agent123 |
| Shop owner | siri@pittala.lk | shop123 |

**Buyers** browse and order as guests. At checkout they give their name, mobile (SMS-verified),
email and address and choose a password; the account is created automatically, they are signed in,
and their login details are emailed to them. Returning buyers enter their existing password at checkout
or use "Forgot password" on the sign-in page.

**New shop owners** register at `#/register`. Their login details are emailed and they are signed in
straight away to an *Application status* workspace that follows the approval workflow:
1. Owner submits application, signs the agreement and pays the registration fee to the region agent.
2. Region agent verifies the payment and approves (or sends it back with a reason).
3. Super admin gives final approval and the shop goes live; the full shop dashboard unlocks.
If sent back, the owner fixes the issue (e.g. new payment reference/slip) and resubmits from the same page.
While waiting, owners can already add products, design the shop and check contact details.

"Reset demo data" is in the footer and in Super admin → Settings.

## Roles and business rules

- **Commission:** 12% on delivered orders = **10% region agent + 2% platform**.
  The region agent's own shop pays **2% only**. Rates are editable in Super admin → Settings.
- **Shop onboarding:** apply → sign agreement online → pay registration fee to the region agent →
  **agent verifies payment and approves** → **super admin gives final approval** → shop is published.
- **Payments:** cash on delivery only. Checkout collects verified mobile (SMS code), WhatsApp,
  email, full address, district, postal code, landmark and delivery time.
- **Orders:** split per shop. Each order creates automatic emails (buyer + shop) and a
  ready-to-send WhatsApp message. The shop owner clicks **Send on WhatsApp** (opens `wa.me`, no API).
- **Sold out:** stock 0 (or the sold-out switch) puts a stamped seal on the product photo.
- **Deals:** percentage discount + optional countdown; flash deals feature on the home page and deals page.
- **Coupons, spotlight requests, shop design (colour, banner, layout, story), competitor insights,
  monthly commission statements and settlements** are all in the dashboards.

## Folder structure

```
index.html
assets/css/styles.css
assets/js/data.js          seed data + Pexels photo IDs + hero film config
assets/js/store.js         state, commission maths, orders, message templates
assets/js/ui.js            header, footer, product card, sold-out seal, modal, timers
assets/js/pages-public.js  home, shop, product, shops, shop page, deals, craft, sell
assets/js/pages-flow.js    cart, checkout (COD), order success, tracking, register, sign in
assets/js/dashboards.js    super admin, region agent, shop owner and buyer dashboards
assets/js/app.js           router and actions
```

## Hero film / videos

The hero plays a cross-fading "film" of four chapters (Lit, Cast, Chased, Polished).
To use real video clips, open `assets/js/data.js` and put an `.mp4` link in the `video`
field of any entry in `HERO_FILM` (for example a Pexels video file link). The photo is kept as the poster.

## Photos

All product and banner photos are free-to-use images from Pexels (pexels.com/license).
Replace them with the shops' own photos as soon as they are available — shop owners can
upload photos directly in the product editor and the shop design page.

## Connecting a backend (next phase)

Everything that reads or writes data goes through `Store` in `assets/js/store.js`.
Replace those functions with API calls (e.g. Supabase, Firebase or a Node/Laravel API):

- **Auth:** replace demo passwords with real authentication. In production, email a *set-password link*
  instead of the password itself (the demo emails the password because that was the requested flow).
- **Emails:** the `outbox` entries are where a mail service (Resend, SendGrid, EmailJS) should be called.
- **SMS code:** checkout shows the code in a toast for the demo; connect an SMS gateway
  (e.g. Notify.lk, Dialog/Mobitel bulk SMS) for real verification.
- **Images:** move uploads to storage (Supabase Storage, Cloudinary, S3) instead of the browser.
