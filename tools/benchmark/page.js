// In-page measurements for the quality benchmark. benchHelpers() is installed once per page (addInitScript)
// as window.__bench; every other function is serialized into the page by Playwright and uses only those helpers.

export function benchHelpers() {
  let ctx;
  const g = () => (ctx ??= Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true }));
  const rgba = css => { const c = g(); c.clearRect(0, 0, 1, 1); c.fillStyle = 'rgba(0,0,0,0)'; c.fillStyle = css; c.fillRect(0, 0, 1, 1); const d = c.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const blend = (t, b) => [0, 1, 2].map(i => t[i] * t[3] + b[i] * (1 - t[3]));
  const lin = v => (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  const Y = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = Y(a), y = Y(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const oklab = c => {
    const [r, gg, b] = c.slice(0, 3).map(lin);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * gg + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * gg + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * gg + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  };
  const dE = (a, b) => { const p = oklab(a), q = oklab(b); return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
  const srOnly = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)' || (cs.position === 'absolute' && parseFloat(cs.width) <= 1 && parseFloat(cs.height) <= 1 && /hidden|clip/.test(cs.overflow))) return true; } return false; };
  const visible = el => { if (!el || el.closest('[hidden], [inert]') || srOnly(el)) return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const bgBehind = el => {
    const layers = [];
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] > 0.999) break; } }
    let o = [255, 255, 255]; for (let i = layers.length - 1; i >= 0; i--) o = blend(layers[i], o); return o;
  };
  const path = el => { const p = []; for (let e = el; e && e !== document.body && p.length < 3; e = e.parentElement) p.unshift(e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].filter(c => !c.startsWith('sb-')).slice(0, 2).join('.') : '')); return p.join(' > '); };
  const inStory = el => !!el.closest('#storybook-root, .cs-portal-host, [data-base-ui-portal], body > [role="dialog"], body > [role="alertdialog"]');
  const disabled = el => !!el.closest('[disabled], [aria-disabled="true"], [data-disabled]');
  const named = el => el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') ?? '').split(/\s+/).map(id => document.getElementById(id)?.textContent ?? '').join(' ').trim() || el.labels?.[0]?.textContent;
  const label = el => (named(el) || el.textContent || el.getAttribute('placeholder') || el.getAttribute('name') || el.getAttribute('role') || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
  window.__bench = { rgba, blend, ratio, hex, oklab, dE, visible, srOnly, bgBehind, path, inStory, disabled, label };
}

/** D2: the indicator of every checked, selected or pressed item against what is next to it. */
export function stateIndicators() {
  const B = window.__bench, out = [], seen = new Set();
  const sel = '[aria-checked="true"], [aria-checked="mixed"], [aria-selected="true"], [aria-pressed="true"], [data-checked], [data-pressed], [data-selected], a[aria-current="page"], button[aria-current="page"]';
  // A selected table row is shown by its checkbox; the row tint is decoration.
  for (const el of document.querySelectorAll(sel)) {
    if (seen.has(el) || el.matches('input, tr, [role="row"], [role="rowgroup"]') || el.closest('nav[aria-label*="readcrumb"], .cs-breadcrumbs') || !B.inStory(el) || !B.visible(el) || B.disabled(el)) continue;
    seen.add(el);
    const outer = B.bgBehind(el.parentElement), cs = getComputedStyle(el), own = B.rgba(cs.backgroundColor), ownBg = own[3] > 0 ? B.blend(own, outer) : outer;
    const c = [];
    if (own[3] > 0) c.push(B.ratio(ownBg, outer));
    for (const s of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none') c.push(B.ratio(B.blend(B.rgba(cs[`border${s}Color`]), outer), outer));
    for (const layer of cs.boxShadow === 'none' ? [] : cs.boxShadow.split(/,(?![^(]*\))/)) {
      const m = layer.match(/(rgba?\([^)]*\)|color\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\))/); if (!m) continue;
      const base = /inset/.test(layer) ? ownBg : outer; c.push(B.ratio(B.blend(B.rgba(m[1]), base), base));
    }
    for (const p of ['::before', '::after']) {
      const ps = getComputedStyle(el, p); if (ps.content === 'none' || ps.display === 'none' || (parseFloat(ps.width) === 0 && parseFloat(ps.height) === 0)) continue;
      const pb = B.rgba(ps.backgroundColor); if (pb[3] > 0) c.push(B.ratio(B.blend(pb, ownBg), ownBg));
      if (parseFloat(ps.borderTopWidth) > 0 || parseFloat(ps.borderBottomWidth) > 0) c.push(B.ratio(B.blend(B.rgba(parseFloat(ps.borderTopWidth) > 0 ? ps.borderTopColor : ps.borderBottomColor), ownBg), ownBg));
    }
    // an indicator drawn by a sibling over or under the item (Base UI Tabs.Indicator)
    const er = el.getBoundingClientRect();
    for (const sib of el.parentElement?.children ?? []) {
      if (sib === el || sib.matches('button, a, input, [role="tab"], [role="button"], [role="radio"], [role="option"], [role="menuitem"]') || !B.visible(sib)) continue;
      const sr = sib.getBoundingClientRect(); if (sr.right <= er.left || sr.left >= er.right || sr.bottom < er.top - 2 || sr.top > er.bottom + 2) continue;
      const ss = getComputedStyle(sib), sb = B.rgba(ss.backgroundColor);
      if (sb[3] > 0) c.push(B.ratio(B.blend(sb, outer), outer));
      if (parseFloat(ss.borderBottomWidth) > 0) c.push(B.ratio(B.blend(B.rgba(ss.borderBottomColor), outer), outer));
    }
    let kids = 0;
    for (const k of el.querySelectorAll('*')) {
      if (kids > 8) break;
      if (!B.visible(k)) continue; kids++;
      const ks = getComputedStyle(k);
      if (k instanceof SVGElement) { if (k.tagName === 'svg') c.push(B.ratio(B.blend(B.rgba(ks.color), ownBg), ownBg)); continue; }
      const kb = B.rgba(ks.backgroundColor); if (kb[3] > 0) c.push(B.ratio(B.blend(kb, ownBg), ownBg));
    }
    const kind = el.getAttribute('role') || el.tagName.toLowerCase();
    out.push({ kind, label: B.label(el), ratio: +Math.max(1, ...c).toFixed(2), path: B.path(el) });
  }
  return out;
}

/** D2: boundaries of form controls (WCAG 1.4.11): the control's own edge, or the bordered box around it within two levels. */
export function controlBoundaries() {
  const B = window.__bench, out = [], seen = new Set();
  const edge = (e, outer) => {
    const cs = getComputedStyle(e), own = B.rgba(cs.backgroundColor);
    const sides = ['Top', 'Right', 'Bottom', 'Left'].filter(s => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none');
    return Math.max(0, ...sides.map(s => B.ratio(B.blend(B.rgba(cs[`border${s}Color`]), outer), outer)), own[3] > 0 ? B.ratio(B.blend(own, outer), outer) : 0);
  };
  for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), textarea, [role="checkbox"], [role="radio"], [role="switch"], [role="combobox"]')) {
    if (!B.inStory(el) || !B.visible(el) || B.disabled(el) || el.closest('[data-audit-ignore]')) continue;
    let best = 0, at = el;
    for (let e = el, k = 0; e && k < 3; e = e.parentElement, k++) { const r = edge(e, B.bgBehind(e.parentElement)); if (r > best) { best = r; at = e; } if (best >= 3) break; }
    const key = B.path(at); if (seen.has(key)) continue; seen.add(key);
    out.push({ kind: el.getAttribute('role') || el.tagName.toLowerCase(), ratio: +best.toFixed(2), path: key, label: B.label(el) });
  }
  return out;
}

/** D15: glyph ink (stacked Vietnamese marks included) against the box that clips it. Input values use their inner line box. */
export function inkChecks() {
  const B = window.__bench, out = [];
  const cv = document.createElement('canvas').getContext('2d');
  const fontOf = cs => `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const measure = (cs, text) => { cv.font = fontOf(cs); return cv.measureText(text); };
  const px = v => parseFloat(v) || 0;
  const clipBox = el => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none') return null; // clamped on purpose
      if (cs.overflowY === 'visible') continue; // overflow-x: clip leaves the vertical axis unclipped
      const r = e.getBoundingClientRect(), top = r.top + e.clientTop;
      // a scroll box loses only what lies beyond its scrollable area
      return /auto|scroll/.test(cs.overflowY) ? { top: top - e.scrollTop, bottom: top - e.scrollTop + e.scrollHeight, e } : { top, bottom: top + e.clientHeight, e };
    }
    return null;
  };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.nodeValue.trim() ? 1 : 2) });
  for (let n; (n = tw.nextNode());) {
    const el = n.parentElement;
    if (!el || el.closest('script, style, template, noscript, svg') || !B.inStory(el) || !B.visible(el)) continue;
    const box = clipBox(el); if (!box) continue;
    const cs = getComputedStyle(el), m = measure(cs, n.nodeValue), rg = document.createRange(); rg.selectNodeContents(n);
    let worst = 0;
    for (const r of rg.getClientRects()) {
      if (!r.width || r.bottom < box.top || r.top > box.bottom) continue; // a line scrolled or clamped away entirely
      const base = r.bottom - m.fontBoundingBoxDescent;
      worst = Math.max(worst, box.top - (base - m.actualBoundingBoxAscent), base + m.actualBoundingBoxDescent - box.bottom);
    }
    out.push({ text: n.nodeValue.trim().slice(0, 32), px: +worst.toFixed(1), path: B.path(el), pass: worst <= 0.5 });
  }
  for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), textarea')) {
    if (!B.inStory(el) || !B.visible(el)) continue;
    const text = el.value || el.getAttribute('placeholder'); if (!text) continue;
    const cs = getComputedStyle(el), m = measure(cs, el.tagName === 'TEXTAREA' ? text.split('\n')[0] : text), font = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    const r = el.getBoundingClientRect(), cTop = r.top + el.clientTop + px(cs.paddingTop), cH = el.clientHeight - px(cs.paddingTop) - px(cs.paddingBottom);
    const lh = cs.lineHeight === 'normal' ? font : px(cs.lineHeight);
    let top, H;
    if (el.tagName === 'TEXTAREA') { top = r.top + el.clientTop; H = Infinity; } // first line, clipped by the padding box top
    else { H = Math.min(cH, Math.max(lh, font)); top = cTop + (cH - H) / 2; } // the inner line box, centered in the content box
    const lineTop = el.tagName === 'TEXTAREA' ? cTop + (lh - font) / 2 : top + (H - font) / 2, base = lineTop + m.fontBoundingBoxAscent;
    const worst = Math.max(top - (base - m.actualBoundingBoxAscent), H === Infinity ? 0 : base + m.actualBoundingBoxDescent - (top + H));
    out.push({ text: text.slice(0, 32), px: +worst.toFixed(1), path: B.path(el), pass: worst <= 0.5 });
  }
  return out;
}

/** D14: in dark mode, a large opaque near-white neutral surface is a patch left from light mode. */
export function lightPatches() {
  const B = window.__bench, out = [];
  for (const el of document.querySelectorAll('#storybook-root *, .cs-portal-host *')) {
    if (el.closest('svg, img, video, canvas, iframe, [data-theme="light"], button, a, input, [role="button"], [role="tab"], [role="option"]')) continue;
    const r = el.getBoundingClientRect(); if (r.width < 120 || r.height < 48) continue;
    const c = B.rgba(getComputedStyle(el).backgroundColor); if (c[3] < 0.9 || !B.visible(el)) continue;
    const [L, a, b] = B.oklab(c);
    if (L > 0.85 && Math.hypot(a, b) < 0.05) out.push({ path: B.path(el), color: B.hex(c), size: `${Math.round(r.width)}x${Math.round(r.height)}` });
  }
  return out;
}

/** D12: anything still animating with reduced motion requested. */
export function runningMotion() {
  return document.getAnimations().filter(a => a.playState === 'running').map(a => {
    const t = a.effect?.getComputedTiming?.() ?? {}, el = a.effect?.target;
    return { el, name: a.animationName || a.transitionProperty || 'animation', duration: t.duration, iterations: t.iterations };
  }).filter(x => x.el && window.__bench.inStory(x.el) && (x.iterations === Infinity || x.duration > 200))
    .map(x => ({ name: x.name, duration: Math.round(x.duration), iterations: String(x.iterations), path: window.__bench.path(x.el) }));
}

/** D13: font size of each text run, in document order. */
export function textSizes() {
  const out = [], tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.nodeValue.trim() ? 1 : 2) });
  for (let n; (n = tw.nextNode()) && out.length < 400;) {
    const el = n.parentElement; if (!el || el.closest('script, style, svg') || !window.__bench.inStory(el) || !window.__bench.visible(el)) continue;
    out.push({ size: parseFloat(getComputedStyle(el).fontSize), text: n.nodeValue.trim().slice(0, 32), path: window.__bench.path(el) });
  }
  return out;
}

/** D11: in forced colors, form controls keep a boundary and checked or selected items still differ from their siblings. */
export function forcedColorChecks() {
  const B = window.__bench, boundaries = [], states = [];
  const hasEdge = e => { const cs = getComputedStyle(e); return ['Top', 'Right', 'Bottom', 'Left'].some(s => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none') || (parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none'); };
  for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), textarea, [role="combobox"], [role="checkbox"], [role="radio"], [role="switch"], [role="spinbutton"]')) {
    if (!B.inStory(el) || !B.visible(el) || B.disabled(el)) continue;
    let ok = false; for (let e = el, i = 0; e && i < 3 && !ok; e = e.parentElement, i++) ok = hasEdge(e);
    boundaries.push({ label: B.label(el), path: B.path(el), pass: ok });
  }
  const sig = el => {
    const cs = getComputedStyle(el), pseudo = p => { const s = getComputedStyle(el, p); return s.content === 'none' ? '' : [s.content, s.width, s.height, s.backgroundColor, s.borderTopWidth, s.borderTopColor, s.borderBottomWidth].join(); };
    const icons = [...el.querySelectorAll('svg')].filter(B.visible).length;
    return [cs.borderTopWidth, cs.borderBottomWidth, cs.borderLeftWidth, cs.borderTopColor, cs.borderBottomColor, cs.outlineStyle, cs.outlineColor, cs.backgroundColor, cs.color, cs.textDecorationLine, icons, pseudo('::before'), pseudo('::after'), cs.boxShadow].join('|');
  };
  const on = '[aria-checked="true"], [aria-selected="true"], [aria-pressed="true"], [data-checked], [data-pressed], [aria-current="page"]';
  for (const el of document.querySelectorAll(on)) {
    if (el.matches('input, tr, [role="row"]') || !B.inStory(el) || !B.visible(el) || B.disabled(el)) continue;
    const role = el.getAttribute('role'), peers = [...(el.parentElement?.children ?? [])].filter(p => p !== el && !p.matches(on) && B.visible(p) && !B.disabled(p) && p.tagName === el.tagName && p.getAttribute('role') === role);
    if (!peers.length) continue;
    states.push({ label: B.label(el), path: B.path(el), pass: sig(el) !== sig(peers[0]) });
  }
  return { boundaries, states };
}

/** D16: long content must stay inside each data-bench="container". */
export function containerChecks() {
  const B = window.__bench, out = [];
  for (const c of document.querySelectorAll('[data-bench="container"]')) {
    const cr = c.getBoundingClientRect(), width = c.getAttribute('data-bench-width');
    for (const kid of c.children) {
      if (!B.visible(kid)) continue;
      const kr = kid.getBoundingClientRect(); let over = Math.max(0, kr.right - cr.right, cr.left - kr.left);
      const tw = document.createTreeWalker(kid, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.nodeValue.trim() ? 1 : 2) });
      for (let n; (n = tw.nextNode());) {
        const el = n.parentElement; if (!B.visible(el)) continue;
        // text that scrolls or truncates inside the component is contained; only text drawn past the edge counts
        let held = false; for (let e = el; e && e !== kid; e = e.parentElement) if (getComputedStyle(e).overflowX !== 'visible') held = true;
        if (held) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const r of rg.getClientRects()) over = Math.max(over, r.right - Math.min(kr.right, cr.right) - 1);
      }
      out.push({ label: `${(kid.className.baseVal ?? kid.className).split(' ')[0] || kid.tagName.toLowerCase()} @${width}px`, px: Math.round(over), pass: over <= 1 });
    }
  }
  return out;
}

/** D17: each control in error vs the same control valid. */
export function invalidChecks() {
  const B = window.__bench, out = [];
  const boxSel = '.cs-input-group, textarea, [role="combobox"], [role="checkbox"], [role="radio"], [role="spinbutton"], input:not([type=hidden]):not([aria-hidden="true"])';
  const boxOf = root => {
    for (const el of root.querySelectorAll(`${boxSel}, [class*="zone"], [class*="otp"] input, [class*="trigger"]`)) {
      if (!B.visible(el)) continue;
      for (let e = el, i = 0; e && e !== root && i < 3; e = e.parentElement, i++) { const cs = getComputedStyle(e); if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') return e; }
    }
    return null;
  };
  for (const v of document.querySelectorAll('[data-bench-state="valid"]')) {
    const name = v.getAttribute('data-bench-control'), inv = document.querySelector(`[data-bench-control="${name}"][data-bench-state="invalid"]`); if (!inv) continue;
    const flagged = [...inv.querySelectorAll('[aria-invalid="true"]')].filter(e => !e.matches('[aria-hidden="true"], input[type=hidden]'));
    // the description may sit on the control or on its group (OTP slots, radio groups), which screen readers read on entry
    const holders = flagged.flatMap(e => [e, e.closest('[role="group"], [role="radiogroup"], fieldset')]).filter(Boolean);
    const ids = holders.flatMap(e => `${e.getAttribute('aria-describedby') ?? ''} ${e.getAttribute('aria-errormessage') ?? ''}`.split(/\s+/)).filter(Boolean);
    const shown = t => B.visible(t) || [...t.querySelectorAll('*')].some(B.visible); // display: contents wrappers have no box of their own
    const linked = ids.some(id => { const t = document.getElementById(id); return t && shown(t) && /Fix this field/.test(t.textContent); });
    const a = boxOf(v), b = boxOf(inv);
    let dE = 0, ratio = 0;
    if (a && b) { const outer = B.bgBehind(b.parentElement), ca = B.blend(B.rgba(getComputedStyle(a).borderTopColor), outer), cb = B.blend(B.rgba(getComputedStyle(b).borderTopColor), outer); dE = B.dE(ca, cb); ratio = B.ratio(cb, outer); }
    out.push({ name, announced: flagged.length > 0, linked, dE: +dE.toFixed(1), ratio: +ratio.toFixed(2), box: b ? B.path(b) : 'no bordered box found' });
  }
  return out;
}

/** D18: each data-bench-scope resolves the tokens of its own theme, and popups opened inside it follow. */
export function scopeChecks() {
  const B = window.__bench, out = [], TOKENS = ['--background', '--foreground', '--primary', '--panel', '--border'];
  const probe = (theme, fn) => { const d = document.createElement('div'); d.setAttribute('data-theme', theme); d.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px'; document.body.appendChild(d); try { return fn(d); } finally { d.remove(); } };
  for (const scope of document.querySelectorAll('[data-bench-scope]')) {
    const theme = scope.getAttribute('data-bench-scope'), cs = getComputedStyle(scope);
    const want = probe(theme, d => TOKENS.map(t => getComputedStyle(d).getPropertyValue(t).trim()));
    const got = TOKENS.map(t => cs.getPropertyValue(t).trim());
    out.push({ what: `${theme} section tokens`, pass: got.every((v, i) => v === want[i]), detail: TOKENS.filter((t, i) => got[i] !== want[i]).join(', ') });
  }
  for (const pop of document.querySelector('[data-bench-scope="dark"]') ? document.querySelectorAll('.cs-popover') : []) {
    if (!B.visible(pop)) continue;
    const host = pop.closest('[data-theme]'), theme = host?.getAttribute('data-theme') ?? 'none';
    const want = probe('dark', d => { const c = pop.cloneNode(false); d.appendChild(c); return getComputedStyle(c).backgroundColor; });
    out.push({ what: 'popup opened in the dark section', pass: theme === 'dark' && getComputedStyle(pop).backgroundColor === want, detail: `theme ${theme}, background ${getComputedStyle(pop).backgroundColor} (dark: ${want})` });
  }
  return out;
}

/** D19: the signal color of each status tone (the most colorful of its fill, border, text and icon), and whether it has an icon and text. */
export function toneColors() {
  const B = window.__bench, out = [];
  for (const wrap of document.querySelectorAll('[data-bench-tone]')) {
    const el = wrap.querySelector('.cs-badge, .cs-alert') ?? wrap.firstElementChild; if (!el || !B.visible(el)) continue;
    const outer = B.bgBehind(wrap), cs = getComputedStyle(el), fill = B.blend(B.rgba(cs.backgroundColor), outer);
    const colors = [fill, B.blend(B.rgba(cs.color), fill)];
    if (parseFloat(cs.borderTopWidth) > 0) colors.push(B.blend(B.rgba(cs.borderTopColor), outer));
    if (parseFloat(cs.borderLeftWidth) > 0) colors.push(B.blend(B.rgba(cs.borderLeftColor), outer));
    const icon = [...el.querySelectorAll('svg')].find(B.visible);
    if (icon) colors.push(B.blend(B.rgba(getComputedStyle(icon).color), fill));
    const chroma = c => { const [, a, b] = B.oklab(c); return Math.hypot(a, b); };
    const signal = colors.reduce((best, c) => (chroma(c) > chroma(best) ? c : best), colors[0]);
    out.push({ group: wrap.getAttribute('data-bench-group'), tone: wrap.getAttribute('data-bench-tone'), signal: B.hex(signal), icon: !!icon, text: el.textContent.trim().length > 0 });
  }
  return out;
}

/** D4: every visible, enabled control, and whether Tab reached it (itself, inside it, or through its arrow-key group). */
export function reach() {
  const B = window.__bench, out = [];
  const sel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="slider"], [role="combobox"], [role="spinbutton"], [role="textbox"], [tabindex]:not([tabindex="-1"])';
  const group = '[role="radiogroup"], [role="tablist"], [role="toolbar"], [role="menu"], [role="menubar"], [role="listbox"], [role="grid"], [role="tree"], [role="treegrid"], [role="group"]';
  for (const el of document.querySelectorAll(sel)) {
    if (!B.inStory(el) || !B.visible(el) || B.disabled(el) || el.closest('[aria-hidden="true"]') || el.matches('[role="menuitem"], [role="option"], [role="menuitemcheckbox"], [role="menuitemradio"]')) continue;
    let viaGroup = false;
    for (let g = el.closest(group); g && !viaGroup; g = g.parentElement?.closest(group)) viaGroup = !!g.querySelector('[data-bench-tab]');
    const grid = el.closest('[role="grid"], [role="treegrid"]');
    for (let up = grid?.parentElement, k = 0; up && k < 4 && !viaGroup; up = up.parentElement, k++) viaGroup = [...up.querySelectorAll('[role="grid"] [data-bench-tab], [role="treegrid"] [data-bench-tab]')].length > 0;
    const reached = viaGroup || el.hasAttribute('data-bench-tab') || !!el.querySelector('[data-bench-tab]') || !!el.closest('label')?.querySelector('[data-bench-tab]');
    out.push({ label: B.label(el), path: B.path(el), reached });
  }
  return out;
}

/** D3/D9: style signature of the focused element, its three nearest ancestors and its pseudo-elements. */
export function focusSnapshot(i) {
  const el = document.querySelector(`[data-bench-tab="${i}"]`); if (!el) return null;
  const chain = []; for (let e = el, k = 0; e && e !== document.body && k < 4; e = e.parentElement, k++) chain.push(e);
  return chain.map(e => { const cs = getComputedStyle(e), b = getComputedStyle(e, '::before'), a = getComputedStyle(e, '::after'), r = e.getBoundingClientRect();
    return { sig: [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderTopColor, cs.borderBottomColor, cs.backgroundColor, b.content, b.boxShadow, b.borderTopColor, b.outlineStyle, a.content, a.boxShadow, a.borderTopColor, a.outlineStyle].join('|'), rect: { x: r.left, y: r.top, w: r.width, h: r.height } }; });
}

/** Between screenshots of a region focused (a) and not (b): pixels whose color changed by 3:1 (2.4.13), and pixels that changed and stand 3:1 against the background (1.4.11). */
export async function pixelDiff([a, b]) {
  let w = 0, h = 0;
  const load = async src => { const im = new Image(); im.src = src; await im.decode(); w = im.width; h = im.height; const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0); return g.getImageData(0, 0, w, h).data; };
  const A = await load(a), Bv = await load(b), lin = v => (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  const Y = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
  // the background is what is actually drawn around the control: the most common color on the unfocused region's edge
  // (a portalled toast sits over the page, not over its DOM parents)
  const counts = new Map(), edge = [];
  for (let x = 0; x < w; x++) edge.push(x, (h - 1) * w + x); for (let y = 0; y < h; y++) edge.push(y * w, y * w + w - 1);
  for (const p of edge) { const k = `${Bv[p * 4]},${Bv[p * 4 + 1]},${Bv[p * 4 + 2]}`; counts.set(k, (counts.get(k) ?? 0) + 1); }
  const top = [...counts].sort((x, y) => y[1] - x[1])[0][0].split(',').map(Number);
  const yb = 0.2126 * lin(top[0]) + 0.7152 * lin(top[1]) + 0.0722 * lin(top[2]), r = (p, q) => (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05);
  let n3 = 0, aa = 0;
  for (let i = 0; i < A.length; i += 4) { const y1 = Y(A, i), y2 = Y(Bv, i), change = r(y1, y2); if (change >= 3) n3++; if (change >= 3 || (change >= 1.2 && r(y1, yb) >= 3)) aa++; } // adjacent to what it replaced, or to the surroundings
  return { n3, aa };
}

/** D3 (2.4.11): some of the focused control (the element, or its ancestor `depth` levels up) is visible, not covered by other content. */
export function notObscured(depth) {
  const el = document.activeElement; if (!el) return false;
  let box = el; const own = el.getBoundingClientRect();
  if (own.width < 4 || own.height < 4) for (let k = 0; k < depth && box.parentElement; k++) box = box.parentElement; // a visually hidden input: its wrapper is what shows
  const rect = box.getBoundingClientRect();
  const pts = [[0.5, 0.5], [0.15, 0.2], [0.85, 0.2], [0.15, 0.8], [0.85, 0.8]].map(([fx, fy]) => [rect.left + rect.width * fx, rect.top + rect.height * fy]).filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);
  if (!pts.length) return true; // scrolled out of view: nothing to judge
  return pts.some(([x, y]) => { const hit = document.elementFromPoint(x, y); return !!hit && (box.contains(hit) || hit.contains(el) || hit.closest('label')?.contains(el)); });
}

/** Waits two frames and for running transitions to end (at most 500ms), so styles are read in their final state. */
export async function settle() {
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await Promise.race([Promise.allSettled(document.getAnimations().filter(a => a.playState === 'running' && a.effect?.getComputedTiming?.().iterations !== Infinity).map(a => a.finished)), new Promise(r => setTimeout(r, 500))]);
}
