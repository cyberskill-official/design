// In-page checks for the forensic visual audit. Each function is serialized into the page by Playwright,
// so it must be self-contained (no imports, no closures).

/** Perceptual color: contrast on what is actually drawn, non-text contrast, rendered status-color distinctness. */
export function colorChecks() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = css => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = 'rgba(0,0,0,0)'; cx.fillStyle = css; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const blend = (t, b) => [0, 1, 2].map(i => t[i] * t[3] + b[i] * (1 - t[3]));
  const lin = c => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const Y = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = Y(a), y = Y(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const visible = el => { if (el.closest('[hidden],[aria-hidden="true"] .cs-visually-hidden')) return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const opacity = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
  const bgBehind = el => {
    const layers = []; let image = false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none' && !e.matches('html,body')) image = true;
      const c = rgba(cs.backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] > 0.999) break; }
    }
    let o = [255, 255, 255]; for (let i = layers.length - 1; i >= 0; i--) o = blend(layers[i], o); return { rgb: o, image };
  };
  const path = el => { const p = []; for (let e = el; e && e !== document.body && p.length < 4; e = e.parentElement) p.unshift(e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : '')); return p.join(' > '); };
  const exempt = el => el.closest('[data-disabled],[disabled],[aria-disabled="true"],.cs-visually-hidden,[data-audit-ignore]') ? 'disabled or ignored' : null;

  const text = new Map(); let id = 0;
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.nodeValue.trim() ? 1 : 2) });
  for (let n; (n = tw.nextNode());) {
    const el = n.parentElement; if (!el || el.closest('script,style,template,noscript') || !visible(el)) continue;
    const cs = getComputedStyle(el), svg = el instanceof SVGElement;
    const { rgb: bg, image } = bgBehind(svg ? el.closest('svg').parentElement : el);
    const f = rgba(svg ? cs.fill : cs.color), fg = blend([f[0], f[1], f[2], f[3] * opacity(el)], bg);
    const r = ratio(fg, bg), size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    const key = [hex(fg), hex(bg), Math.round(size), weight].join('|');
    if (!text.has(key)) {
      const g = { id: 'c' + id++, fg: hex(fg), bg: hex(bg), size, weight, ratio: +r.toFixed(2), need, sample: n.nodeValue.trim().slice(0, 48), path: path(el), count: 0, exempt: exempt(el), image };
      if (r < need && !g.exempt && !image) el.setAttribute('data-audit-c', g.id);
      text.set(key, g);
    }
    text.get(key).count++;
  }

  // Non-text contrast (WCAG 1.4.11): boundaries of form controls against what surrounds them
  const nonText = [], seen = new Set();
  for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, .cs-input-group, [role=checkbox], [role=radio], [role=switch], [role=combobox]')) {
    if (!visible(el) || exempt(el) || el.closest('.cs-input-group') && el.matches('input')) continue;
    const cs = getComputedStyle(el), outer = bgBehind(el.parentElement).rgb;
    const own = rgba(cs.backgroundColor), border = parseFloat(cs.borderTopWidth) > 0 ? rgba(cs.borderTopColor) : null;
    const edge = Math.max(border ? ratio(blend(border, outer), outer) : 0, own[3] > 0 ? ratio(blend(own, outer), outer) : 0);
    const k = [el.tagName, el.getAttribute('role'), hex(outer), edge.toFixed(1)].join('|'); if (seen.has(k)) continue; seen.add(k);
    nonText.push({ kind: el.getAttribute('role') || el.tagName.toLowerCase(), ratio: +edge.toFixed(2), bg: hex(outer), path: path(el) });
  }
  return { text: [...text.values()], nonText };
}

/** Real layout geometry: clipping, spill, overlap, touch targets, small text, lone wrapped items, long lines, fold. */
export function layoutChecks({ w, h, fold }) {
  const out = { viewport: `${w}x${h}`, pageOverflowX: document.documentElement.scrollWidth - innerWidth, clipped: [], spill: [], overlap: [], targets: [], smallText: {}, orphans: [], longLines: [], fold: [] };
  let id = 0; const mark = (el, type) => { const k = 'l' + id++; el.setAttribute('data-audit-l', k); el.setAttribute('data-audit-type', type); return k; };
  const visible = el => { if (el.closest('[hidden]')) return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const path = el => { const p = []; for (let e = el; e && e !== document.body && p.length < 4; e = e.parentElement) p.unshift(e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : '')); return p.join(' > '); };
  const pad = e => { const r = e.getBoundingClientRect(); const l = r.left + e.clientLeft, t = r.top + e.clientTop; return { l, t, r: l + e.clientWidth, b: t + e.clientHeight }; };
  // The text's own element can clip or scroll it, so start there.
  const clipper = el => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const cs = getComputedStyle(e), o = cs.overflowX + ' ' + cs.overflowY; if (/hidden|clip/.test(o)) return { e, mode: 'clip' }; if (/auto|scroll/.test(o)) return { e, mode: 'scroll' }; } return null; };
  const isBox = e => { const cs = getComputedStyle(e); return cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0; };
  const boxOf = el => { for (let e = el; e && e !== document.body; e = e.parentElement) if (isBox(e)) return e; return document.body; };
  const ignored = el => !!el.closest('[data-audit-ignore],.cs-visually-hidden,[aria-hidden="true"]');

  const texts = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.nodeValue.trim() ? 1 : 2) });
  for (let n; (n = tw.nextNode());) {
    const el = n.parentElement; if (!el || el.closest('script,style,template,noscript') || !visible(el) || ignored(el)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const rects = [...rg.getClientRects()].filter(r => r.width && r.height); if (!rects.length) continue;
    const u = rects.reduce((a, r) => ({ l: Math.min(a.l, r.left), t: Math.min(a.t, r.top), r: Math.max(a.r, r.right), b: Math.max(a.b, r.bottom) }), { l: 1e9, t: 1e9, r: -1e9, b: -1e9 });
    const txt = n.nodeValue.trim().slice(0, 40), c = clipper(el);
    const ellipsis = getComputedStyle(el).textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1;
    if (ellipsis) out.clipped.push({ k: mark(el, 'clipped'), text: txt, px: el.scrollWidth - el.clientWidth, path: path(el), why: 'truncated with ellipsis' });
    else if (c && c.mode === 'clip') { const p = pad(c.e), over = Math.max(p.l - u.l, u.r - p.r, p.t - u.t, u.b - p.b); if (over > 1) out.clipped.push({ k: mark(el, 'clipped'), text: txt, px: Math.round(over), path: path(el), why: 'cut by ' + path(c.e) }); }
    const box = boxOf(el.parentElement || el);
    if (box !== document.body && (!c || !box.contains(c.e))) { const p = pad(box), over = Math.max(p.l - u.l, u.r - p.r, p.t - u.t, u.b - p.b); if (over > 1) out.spill.push({ k: mark(el, 'spill'), text: txt, px: Math.round(over), path: path(el) }); }
    texts.push({ el, u, box: boxOf(el) });
    const size = parseFloat(getComputedStyle(el).fontSize), mono = /mono/i.test(getComputedStyle(el).fontFamily), min = mono ? 11 : 12;
    if (size < min - 0.01) { const key = `${size}px ${mono ? 'mono' : 'sans'}`; out.smallText[key] = (out.smallText[key] || 0) + 1; }
  }
  const byBox = new Map(); texts.forEach(t => { if (!byBox.has(t.box)) byBox.set(t.box, []); byBox.get(t.box).push(t); });
  for (const list of byBox.values()) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j]; if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ix = Math.min(a.u.r, b.u.r) - Math.max(a.u.l, b.u.l), iy = Math.min(a.u.b, b.u.b) - Math.max(a.u.t, b.u.t);
    if (ix > 2 && iy > 4) out.overlap.push({ k: mark(a.el, 'overlap'), a: a.el.textContent.trim().slice(0, 30), b: b.el.textContent.trim().slice(0, 30), path: path(a.el) });
  }
  // Touch targets: count an invisible ::before hit area when a component provides one.
  for (const el of document.querySelectorAll('a[href], button, summary, input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=menuitem], [role=checkbox], [role=switch], [role=radio]')) {
    if (!visible(el) || ignored(el)) continue;
    if (el.matches('a') && getComputedStyle(el).display === 'inline' && el.closest('p, li, td')) continue; // inline links in text are exempt (WCAG 2.5.8)
    const r = el.getBoundingClientRect(), b = getComputedStyle(el, '::before');
    const hitW = Math.max(r.width, b.position === 'absolute' ? parseFloat(b.width) || 0 : 0), hitH = Math.max(r.height, b.position === 'absolute' ? parseFloat(b.height) || 0 : 0);
    const min = Math.min(hitW, hitH);
    if (min < 44) out.targets.push({ k: min < 24 ? mark(el, 'target') : null, label: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('name') || '').trim().slice(0, 30), w: Math.round(hitW), h: Math.round(hitH), level: min < 24 ? 'fail' : 'below 44', path: path(el) });
  }
  // Lone item wrapped onto its own line in a wrapping row
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el); if (cs.display.indexOf('flex') < 0 || cs.flexWrap !== 'wrap' || !visible(el) || ignored(el)) continue;
    const kids = [...el.children].filter(visible); if (kids.length < 3) continue;
    const rows = []; kids.forEach(k => { const top = Math.round(k.getBoundingClientRect().top); const row = rows.find(r => Math.abs(r.top - top) < 6); row ? row.n++ : rows.push({ top, n: 1 }); });
    if (rows.length > 1 && rows[rows.length - 1].n === 1 && rows[0].n >= 3) out.orphans.push({ k: mark(kids[kids.length - 1], 'orphan'), text: kids[kids.length - 1].textContent.trim().slice(0, 30), path: path(el) });
  }
  // Line length on rendered line boxes (prose only)
  for (const el of document.querySelectorAll('.prose p, .prose li, main p')) {
    if (!visible(el) || el.closest('.demo, table')) continue;
    const rg = document.createRange(); rg.selectNodeContents(el);
    const lines = new Set([...rg.getClientRects()].filter(r => r.width > 4).map(r => Math.round(r.top / 4))).size || 1;
    const cpl = Math.round(el.textContent.trim().length / lines);
    if (lines > 1 && cpl > 85) out.longLines.push({ cpl, lines, text: el.textContent.trim().slice(0, 40) });
  }
  // Fold budget: these must be fully visible on the first screen
  for (const sel of fold || []) {
    const el = document.querySelector(sel); if (!el) { out.fold.push({ sel, visible: 'missing' }); continue; }
    const r = el.getBoundingClientRect(); out.fold.push({ sel, visible: r.bottom <= h ? 'fully' : r.top < h ? 'partly' : 'no', bottom: Math.round(r.bottom) });
  }
  return out;
}

/** Draws labelled boxes around flagged elements for the eye-check screenshots. */
export function markFindings() {
  document.querySelectorAll('.audit-box').forEach(e => e.remove());
  const color = { clipped: '#FF2D55', spill: '#FF9500', overlap: '#AF52DE', target: '#007AFF', orphan: '#34C759', contrast: '#FF2D55' };
  for (const el of document.querySelectorAll('[data-audit-l],[data-audit-c]')) {
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    const type = el.getAttribute('data-audit-type') || 'contrast', b = document.createElement('div'); b.className = 'audit-box';
    b.style.cssText = `position:absolute;left:${r.left + scrollX - 3}px;top:${r.top + scrollY - 3}px;width:${r.width + 6}px;height:${r.height + 6}px;outline:3px solid ${color[type]};z-index:2147483647;pointer-events:none;border-radius:4px`;
    const t = document.createElement('span'); t.textContent = type;
    t.style.cssText = `position:absolute;left:-3px;top:-20px;background:${color[type]};color:#fff;font:600 11px/1 system-ui;padding:3px 5px;border-radius:3px;white-space:nowrap`;
    b.appendChild(t); document.body.appendChild(b);
  }
}

/** Share of the rendered page by color role (OKLCH classes), measured on a screenshot drawn into a canvas. */
export async function colorArea(dataUrl) {
  const img = new Image(); img.src = dataUrl; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const lin = v => (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  let n = 0; const count = { neutral: 0, ink: 0, gold: 0, other: 0, vivid: 0 };
  for (let i = 0; i < d.length; i += 4 * 3) { // every third pixel is plenty
    const r = lin(d[i]), gg = lin(d[i + 1]), b = lin(d[i + 2]);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * gg + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * gg + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * gg + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    const C = Math.hypot(A, B), H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360; n++;
    if (C >= 0.1) count.vivid++;
    if (C < 0.035) count.neutral++; else if (H >= 220 && H <= 290 && L < 0.6) count.ink++; else if (H >= 55 && H <= 105 && C >= 0.06) count.gold++; else count.other++;
  }
  return Object.fromEntries(Object.entries(count).map(([k, v]) => [k, +((100 * v) / n).toFixed(1)]));
}
