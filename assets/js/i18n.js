/* Sinhala / English support for the whole site.
   - Every visible text on every page (storefront, checkout, all dashboards, pop-ups,
     messages) is translated from the dictionary in i18n-si.js when Sinhala is selected.
   - Shop and product content has its own Sinhala fields (name_si, description_si,
     tagline_si, story_si, announcement_si) that shop owners fill in from the dashboard.
   - Anything without a Sinhala version falls back to English, so nothing ever breaks. */

const I18N = {
  lang: (() => { try { return localStorage.getItem('pittala-lang') || 'en'; } catch (e) { return 'en'; } })(),
  set(l) {
    this.lang = l;
    try { localStorage.setItem('pittala-lang', l); } catch (e) {}
    document.documentElement.lang = l === 'si' ? 'si' : 'en';
    document.documentElement.classList.toggle('lang-si', l === 'si');
  }
};
const isSi = () => I18N.lang === 'si';

/* Numbers, money and percentages become {0}, {1}… so one dictionary entry covers every value */
const TOKEN_RE = /Rs\.\s?[\d,]+(?:\.\d+)?[kM]?|\d[\d,]*(?:\.\d+)?%?/g;

function lookup(t) {
  if (SI_DICT[t] !== undefined) return SI_DICT[t];
  const tokens = [];
  const key = t.replace(TOKEN_RE, m => { tokens.push(m); return `{${tokens.length - 1}}`; });
  if (tokens.length && SI_DICT[key] !== undefined) return SI_DICT[key].replace(/\{(\d+)\}/g, (_, i) => tokens[+i] ?? '');
  for (const [re, rep] of (typeof SI_RULES !== 'undefined' ? SI_RULES : [])) {
    const m = t.match(re);
    if (m) return typeof rep === 'function' ? rep(...m) : t.replace(re, rep);
  }
  return undefined;
}
function trCore(t, depth = 0) {
  let out = lookup(t);
  if (out !== undefined) return out;
  if (depth > 2) return undefined;
  // prefixes / suffixes such as "› ", "· ", "✓ ", " ✕", ":"
  const m = t.match(/^([›·✓—−•]\s*)(.+?)(\s*[✕:]?)$/);
  if (m && (m[1] || m[3])) { const inner = trCore(m[2], depth + 1); if (inner !== undefined) return m[1] + inner + m[3]; }
  // composite text joined with " · "
  if (t.includes(' · ')) {
    const parts = t.split(' · ');
    let changed = false;
    const res = parts.map(p => { const v = trCore(p.trim(), depth + 1); if (v !== undefined) { changed = true; return v; } return p; });
    if (changed) return res.join(' · ');
  }
  return undefined;
}
function trText(raw) {
  if (!isSi() || !raw) return raw;
  const t = raw.trim();
  if (!t) return raw;
  const lead = raw.slice(0, raw.indexOf(t[0]));
  const trail = raw.slice(raw.lastIndexOf(t[t.length - 1]) + 1);
  const out = trCore(t);
  if (out === undefined) return /Rs\./.test(raw) ? raw.replace(/Rs\./g, 'රු.') : raw;
  return lead + out.replace(/Rs\./g, 'රු.') + trail;
}
const tr = s => trText(s);

/* Pick the Sinhala version of a data field when it exists */
function L(obj, field) {
  if (!obj) return '';
  if (isSi()) { const v = obj[field + '_si']; if (v && String(v).trim()) return v; }
  return obj[field] ?? '';
}

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'svg', 'SVG']);
function translateNode(root) {
  if (!isSi() || !root) return;
  if (root.nodeType === 3) {
    const p = root.parentElement;
    if (p && !SKIP_TAGS.has(p.tagName) && !p.closest('[data-notr]')) { const n = trText(root.data); if (n !== root.data) root.data = n; }
    return;
  }
  if (root.nodeType !== 1 || SKIP_TAGS.has(root.tagName) || (root.closest && root.closest('[data-notr]'))) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => {
      const p = n.parentElement;
      if (!p || SKIP_TAGS.has(p.tagName) || p.closest('svg') || p.closest('[data-notr]') || !n.data.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => { const v = trText(n.data); if (v !== n.data) n.data = v; });
  const els = root.querySelectorAll ? [root, ...root.querySelectorAll('[placeholder],[aria-label],[title]')] : [];
  els.forEach(el => {
    if (!el.getAttribute) return;
    ['placeholder', 'aria-label', 'title'].forEach(a => { const v = el.getAttribute(a); if (v) { const n = trText(v); if (n !== v) el.setAttribute(a, n); } });
  });
}

/* Translate anything added to the page later (pop-ups, toasts, live previews, search suggestions) */
const trObserver = new MutationObserver(muts => {
  if (!isSi()) return;
  muts.forEach(m => m.addedNodes.forEach(n => translateNode(n)));
});
document.addEventListener('DOMContentLoaded', () => {
  I18N.set(I18N.lang);
  trObserver.observe(document.body, { childList: true, subtree: true });
});

/* Browser dialogs */
const _confirm = window.confirm.bind(window), _prompt = window.prompt.bind(window);
window.confirm = m => _confirm(tr(m));
window.prompt = (m, d) => _prompt(tr(m), d);
