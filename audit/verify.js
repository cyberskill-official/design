/* CyberSkill Design System — v2.4.0 verification runner.
 * Loads the same fixture against v2.4.0 (styles.css) and the v2.3.1 tag (dist/styles.min.css),
 * plus static/live checks of the guideline, deck and A4 templates, then scores 7 dimensions. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "text") e.textContent = attrs[k]; else if (k === "html") e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }

  /* ---------- colour maths ---------- */
  function num(x) { x = String(x).trim(); return x.endsWith("%") ? parseFloat(x) / 100 : parseFloat(x); }
  function oklabToRgb(L, a, b) {
    var l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.291485548 * b;
    var l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    var r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    function enc(x) { x = Math.max(0, Math.min(1, x)); return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; }
    return { r: enc(r), g: enc(g), b: enc(bb) };
  }
  function parseColor(s) {
    s = (s || "").trim(); if (!s || s === "transparent" || s === "none") return { r: 0, g: 0, b: 0, a: 0 };
    var m, p;
    if ((m = s.match(/^rgba?\(([^)]+)\)$/i))) { p = m[1].split(/[\s,\/]+/).filter(Boolean); return { r: num(p[0]) / 255, g: num(p[1]) / 255, b: num(p[2]) / 255, a: p[3] != null ? num(p[3]) : 1 }; }
    if ((m = s.match(/^color\(srgb\s+([^)]+)\)$/i))) { p = m[1].split(/[\s\/]+/).filter(Boolean); return { r: num(p[0]), g: num(p[1]), b: num(p[2]), a: p[3] != null ? num(p[3]) : 1 }; }
    if ((m = s.match(/^oklab\(([^)]+)\)$/i))) { p = m[1].split(/[\s\/]+/).filter(Boolean); var c = oklabToRgb(num(p[0]), parseFloat(p[1]), parseFloat(p[2])); c.a = p[3] != null ? num(p[3]) : 1; return c; }
    if ((m = s.match(/^oklch\(([^)]+)\)$/i))) { p = m[1].split(/[\s\/]+/).filter(Boolean); var C = parseFloat(p[1]), H = parseFloat(p[2]) * Math.PI / 180; var c2 = oklabToRgb(num(p[0]), C * Math.cos(H), C * Math.sin(H)); c2.a = p[3] != null ? num(p[3]) : 1; return c2; }
    if ((m = s.match(/^#([0-9a-f]{6})$/i))) { var n = parseInt(m[1], 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255, a: 1 }; }
    return null;
  }
  function eq(a, b) { var x = parseColor(a), y = parseColor(b); if (!x || !y) return a === b; if (x.a === 0 && y.a === 0) return true; return ["r", "g", "b", "a"].every(function (k) { return Math.abs(x[k] - y[k]) < 0.006; }); }
  function over(fg, bg) { var f = parseColor(fg), b = parseColor(bg); return { r: f.a * f.r + (1 - f.a) * b.r, g: f.a * f.g + (1 - f.a) * b.g, b: f.a * f.b + (1 - f.a) * b.b, a: 1 }; }
  function lin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(c) { c = typeof c === "string" ? parseColor(c) : c; return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function okL(c) { c = typeof c === "string" ? parseColor(c) : c; var r = lin(c.r), g = lin(c.g), b = lin(c.b);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s; }
  function hex(c) { c = typeof c === "string" ? parseColor(c) : c; if (!c) return "?"; var h = "#" + [c.r, c.g, c.b].map(function (v) { return ("0" + Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16)).slice(-2); }).join("").toUpperCase(); return c.a < 0.999 ? h + " / " + Math.round(c.a * 100) + "%" : h; }
  function splitTop(s) { var out = [], d = 0, cur = ""; for (var i = 0; i < s.length; i++) { var ch = s[i]; if (ch === "(") d++; if (ch === ")") d--; if (ch === "," && d === 0) { out.push(cur.trim()); cur = ""; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; }
  function layers(bs) {
    if (!bs || bs === "none") return [];
    return splitTop(bs).map(function (l) {
      var inset = /\binset\b/.test(l), rest = l.replace(/\binset\b/, "").trim();
      var cm = rest.match(/(rgba?\([^)]*\)|color\([^)]*\)|oklab\([^)]*\)|oklch\([^)]*\)|#[0-9a-f]{3,8}\b|transparent)/i), color = cm ? cm[0] : "";
      var n = rest.replace(color, "").trim().split(/\s+/).filter(Boolean).map(parseFloat);
      return { inset: inset, color: color, x: n[0] || 0, y: n[1] || 0, blur: n[2] || 0, spread: n[3] || 0 };
    });
  }
  function insetRing(bs, spread) { return layers(bs).filter(function (l) { return l.inset && !l.x && !l.y && !l.blur && Math.abs(l.spread - spread) < 0.01; })[0] || null; }
  function px(v) { return parseFloat(v); }
  function ratio(o) { return px(o.lh) / px(o.fs); }
  function f2(n, d) { return (Math.round(n * Math.pow(10, d == null ? 2 : d)) / Math.pow(10, d == null ? 2 : d)).toString(); }

  /* ---------- loaders ---------- */
  function frame(src, w, h) {
    return new Promise(function (res) {
      var f = el("iframe", { class: "au-hidden", title: "audit probe", tabindex: "-1", "aria-hidden": "true" });
      f.style.width = (w || 1280) + "px"; f.style.height = (h || 900) + "px";
      f.onload = function () { res(f); }; f.src = src; $("#au-frames").appendChild(f);
    });
  }
  function wait(fn, ms) { var t0 = Date.now(); return new Promise(function (res) { (function tick() { var v = null; try { v = fn(); } catch (e) {} if (v || Date.now() - t0 > (ms || 12000)) return res(v || null); setTimeout(tick, 150); })(); }); }
  function txt(u) { return fetch(u, { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : null; }).catch(function () { return null; }); }
  function timeout(p, ms, fallback) { return Promise.race([p, new Promise(function (r) { setTimeout(function () { r(fallback); }, ms); })]); }
  async function fixture(v, root) { var f = await timeout(frame("fixture.html?v=" + v + "&root=" + root), 15000, null); if (!f) return null; var api = await wait(function () { return f.contentWindow.CSAudit; }); return api ? timeout(api.measure(), 15000, null) : null; }

  /* ---------- static parsers ---------- */
  function slateHex(t) { var m = t && t.match(/class="sw" style="background:(#[0-9A-Fa-f]{6})"><\/span>Slate EN italic/); return m ? m[1].toUpperCase() : null; }
  function deckLH(t) { var m = t && t.match(/\.display\s*\{[^}]*line-height:\s*([\d.]+)/); return m ? parseFloat(m[1]) : null; }
  function dieuSizes(t) {
    return [1, 2, 3].map(function (n) {
      if (!t) return null; var m = new RegExp(">ĐIỀU " + n + "(?![0-9])").exec(t); if (!m) return null;
      var pre = t.slice(0, m.index), s = pre.lastIndexOf('style="'); if (s < 0) return null;
      var style = pre.slice(s + 7, pre.indexOf('"', s + 7)), fm = style.match(/font-size:\s*([\d.]+)px/); return fm ? parseFloat(fm[1]) : null;
    });
  }
  function designRadius(t) { var m = t && t.match(/`--cs-radius-lg` \(`(\d+(?:\.\d+)?)px`\) for [^;]*`\.cs-dialog`/); return m ? parseFloat(m[1]) : 14; }

  /* ---------- live document probes (v2.4.0 only) ---------- */
  async function liveDocs() {
    var out = {};
    var fd = await frame("../guidelines/documents.html", 1280, 700), dd = fd.contentDocument;
    var sw = await wait(function () { return Array.prototype.filter.call(dd.querySelectorAll(".chip"), function (c) { return /Slate/.test(c.textContent); }).map(function (c) { return c.querySelector(".sw"); })[0]; }, 6000);
    out.slate = sw ? fd.contentWindow.getComputedStyle(sw).backgroundColor : null;
    var fk = await frame("../ui_kits/deck/index.html", 1280, 720);
    var disp = await wait(function () { return fk.contentDocument.querySelector(".display"); }, 6000);
    out.deck = disp ? ratio({ lh: fk.contentWindow.getComputedStyle(disp).lineHeight, fs: fk.contentWindow.getComputedStyle(disp).fontSize }) : null;
    async function dieu(path) {
      var f = await frame(path, 1100, 1400);
      var hs = await wait(function () { var a = Array.prototype.filter.call(f.contentDocument.querySelectorAll("h2,h3,div,p"), function (h) { return /^ĐIỀU [1-3](?![0-9])/.test((h.firstChild && h.firstChild.nodeValue || "").trim()); }); return a.length >= 3 ? a : null; }, 15000);
      if (!hs) return [null, null, null];
      return [1, 2, 3].map(function (n) { var h = hs.filter(function (x) { return new RegExp("^ĐIỀU " + n + "(?![0-9])").test(x.firstChild.nodeValue.trim()); })[0]; return h ? px(f.contentWindow.getComputedStyle(h).fontSize) : null; });
    }
    var both = await Promise.all([dieu("../templates/vn-termination-decision/VnTerminationDecision.dc.html"), dieu("../templates/vn-appointment-transfer/VnAppointmentTransfer.dc.html")]);
    out.term = both[0]; out.appt = both[1];
    return out;
  }

  /* ---------- checks ---------- */
  var DIMS = [
    { id: "D1", sec: 1, name: "Theme scoping & token recomputation", vi: "Phạm vi giao diện & tính lại token" },
    { id: "D2", sec: 1, name: "Depth & modal separation", vi: "Chiều sâu & tách lớp modal" },
    { id: "D3", sec: 2, name: "Component state contracts", vi: "Hợp đồng trạng thái component" },
    { id: "D4", sec: 2, name: "Accessibility — non-text contrast", vi: "Tiếp cận — tương phản phi văn bản" },
    { id: "D5", sec: 2, name: "Ngũ Hành element-scope fidelity", vi: "Độ trung thực theo hành" },
    { id: "D6", sec: 3, name: "Vietnamese-first typography", vi: "Chữ ưu tiên tiếng Việt" },
    { id: "D7", sec: 4, name: "Documents & presentation fidelity", vi: "Tài liệu & trình chiếu" }
  ];
  var MARKERS = [["cal", ".cs-cal__grid button.sel"], ["fab", ".cs-fab__main"], ["timeline", ".cs-timeline__item--now .cs-timeline__marker"], ["step", ".cs-step--active .cs-step__marker"]];
  var SCOPE_NAMES = { default: "Thổ · default", tho: "Thổ", moc: "Mộc", hoa: "Hỏa", kim: "Kim", thuy: "Thủy" };

  function buildChecks(PROPS, spec) {
    var C = [];
    function add(dim, title, target, expect, fn, control) { C.push({ dim: dim, title: title, target: target, expect: expect, fn: fn, control: !!control }); }
    PROPS.forEach(function (p) {
      add("D1", "Nested scopes recompute " + p, "base/glass.css", "nested dark = dark root · nested light = light root",
        function (X) { var L = X.L.props, D = X.D.props; var ok = eq(L.nest[p], D.root[p]) && eq(D.nest[p], L.root[p]) && eq(L.back[p], L.root[p]); return { pass: ok, value: "nested dark " + hex(L.nest[p]) + " · dark root " + hex(D.root[p]) }; });
    });
    function dL(page, scrim) { var c = over(scrim, page); return { c: c, d: okL(c) - okL(page) }; }
    function sv(page, scrim) { var r = dL(page, scrim); return "page " + hex(page) + " → " + hex(r.c) + " · ΔL " + (r.d >= 0 ? "+" : "") + f2(r.d, 3); }
    add("D2", "Dark root: scrim never lightens the dark page", "--_cs-surface-scrim", "OKLab ΔL ≤ +0.01", function (X) { var s = X.D.scrim; return { pass: dL(s.rootPage, s.rootScrim).d <= 0.01, value: sv(s.rootPage, s.rootScrim) }; });
    add("D2", "Dark root: scrimmed backdrop sits below the dialog panel", "--_cs-surface-scrim vs --cs-color-surface-panel", "backdrop luminance < panel", function (X) { var s = X.D.scrim, c = over(s.rootScrim, s.rootPage); return { pass: lum(c) < lum(s.rootPanel), value: "backdrop " + hex(c) + " · panel " + hex(s.rootPanel) + " · " + f2(contrast(c, s.rootPanel)) + ":1" }; });
    add("D2", "Dark root: scrim darkens the dark page by ≥ 1 JND", "--_cs-surface-scrim", "OKLab ΔL ≤ −0.02", function (X) { var s = X.D.scrim; return { pass: dL(s.rootPage, s.rootScrim).d <= -0.02, value: sv(s.rootPage, s.rootScrim) }; });
    add("D2", "Nested dark in light page: scrim never lightens the dark surface", "--_cs-surface-scrim (nested)", "OKLab ΔL ≤ +0.01", function (X) { var s = X.L.scrim; return { pass: dL(s.nestPage, s.nestScrim).d <= 0.01, value: sv(s.nestPage, s.nestScrim) }; });
    add("D2", "Nested dark in light page: backdrop sits below the dialog panel", "--_cs-surface-scrim (nested)", "backdrop luminance < panel", function (X) { var s = X.L.scrim, c = over(s.nestScrim, s.nestPage); return { pass: lum(c) < lum(s.nestPanel), value: "backdrop " + hex(c) + " · panel " + hex(s.nestPanel) }; });
    add("D2", "Light root: scrim darkens the paper page", "--_cs-surface-scrim", "OKLab ΔL ≤ −0.02", function (X) { var s = X.L.scrim; return { pass: dL(s.rootPage, s.rootScrim).d <= -0.02, value: sv(s.rootPage, s.rootScrim) }; }, true);
    add("D2", "Dialog overlay paints the scoped scrim", ".cs-dialog__overlay", "overlay = scope scrim", function (X) { return { pass: eq(X.L.scrim.nestOverlay, X.L.scrim.nestScrim), value: hex(X.L.scrim.nestOverlay) }; }, true);
    add("D3", "Loading button opacity", ".cs-button.is-loading (with .is-disabled, as rendered)", "0.88", function (X) { var o = X.L.buttons.loading.opacity; return { pass: Math.abs(o - 0.88) < 0.005, value: o }; });
    add("D3", "Loading button cursor", ".cs-button.is-loading", "progress", function (X) { var c = X.L.buttons.loading.cursor; return { pass: c === "progress", value: c }; });
    add("D3", "Disabled button opacity", ".cs-button.is-disabled", "0.58", function (X) { var o = X.L.buttons.disabled.opacity; return { pass: Math.abs(o - 0.58) < 0.005, value: o }; });
    add("D3", "Disabled button cursor", ".cs-button.is-disabled", "not-allowed", function (X) { var c = X.L.buttons.disabled.cursor; return { pass: c === "not-allowed", value: c }; });
    add("D3", "Dialog radius matches DESIGN.md", ".cs-dialog", spec.radius + "px (--cs-radius-lg)", function (X) { var r = px(X.L.dialog.radius); return { pass: Math.abs(r - spec.radius) < 0.01, value: X.L.dialog.radius }; });
    add("D3", "Dialog radius resolves through --cs-radius-lg", ".cs-dialog", "= var(--cs-radius-lg)", function (X) { return { pass: X.L.dialog.radius === X.L.dialog.radiusLg, value: X.L.dialog.radius + " vs " + X.L.dialog.radiusLg }; });
    [["L", "light"], ["D", "dark"]].forEach(function (t) {
      add("D3", "Invalid combobox (.is-invalid) border · " + t[1], ".is-invalid .cs-combobox input", "--cs-color-semantic-danger", function (X) { var m = X[t[0]].combo; return { pass: eq(m.cls, m.danger), value: hex(m.cls) + " (danger " + hex(m.danger) + ")" }; });
      add("D3", "Invalid combobox (aria-invalid) border · " + t[1], '.cs-combobox input[aria-invalid="true"]', "--cs-color-semantic-danger", function (X) { var m = X[t[0]].combo; return { pass: eq(m.aria, m.danger), value: hex(m.aria) }; });
    });
    MARKERS.forEach(function (mk) {
      add("D4", "Marker boundary ≥ 3:1 against panel — " + mk[0], mk[1], "min ≥ 3:1 across 12 scopes (WCAG 1.4.11)", function (X) {
        var worst = Infinity, where = "";
        [["L", "light"], ["D", "dark"]].forEach(function (t) { var R = X[t[0]].rings; Object.keys(R).forEach(function (s) {
          var r = R[s], ring = insetRing(r[mk[0]].boxShadow, 2), c = Math.max(contrast(over(r[mk[0]].bg, r.panel), r.panel), ring ? contrast(over(ring.color, r.panel), r.panel) : 1);
          if (c < worst) { worst = c; where = SCOPE_NAMES[s] + " " + t[1]; } }); });
        return { pass: worst >= 3, value: "min " + f2(worst) + ":1 · " + where };
      });
    });
    [["L", "light"], ["D", "dark"]].forEach(function (t) {
      add("D4", "Invalid border ≥ 3:1 against panel · " + t[1], '.cs-combobox input[aria-invalid="true"]', "≥ 3:1", function (X) { var m = X[t[0]].combo, c = contrast(over(m.aria, m.panel), m.panel); return { pass: c >= 3, value: f2(c) + ":1" }; });
    });
    [["L", "light"], ["D", "dark"]].forEach(function (t) {
      ["default", "tho", "moc", "hoa", "kim", "thuy"].forEach(function (s) {
        add("D5", "2px accent-strong rings · " + SCOPE_NAMES[s] + " · " + t[1], s === "default" ? "no data-cs-element" : 'data-cs-element="' + s + '"', "4/4 markers: inset 0 0 0 2px var(--cs-accent-strong)", function (X) {
          var r = X[t[0]].rings[s], ok = 0; MARKERS.forEach(function (mk) { var ring = insetRing(r[mk[0]].boxShadow, 2); if (ring && eq(ring.color, r.strong)) ok++; });
          return { pass: ok === 4, value: ok + "/4 · strong " + hex(r.strong) };
        });
      });
    });
    add("D6", "VI .cs-display line-height", ':lang(vi) .cs-display', "1.22", function (X) { var v = ratio(X.L.type.dispVi); return { pass: Math.abs(v - 1.22) < 0.006, value: f2(v, 3) }; });
    add("D6", "VI .cs-display--fluid line-height", ':lang(vi) .cs-display--fluid', "1.22", function (X) { var v = ratio(X.L.type.dispFluidVi); return { pass: Math.abs(v - 1.22) < 0.006, value: f2(v, 3) }; });
    add("D6", "EN .cs-display inside a VI page keeps tight 1.15", '<html lang="vi"> … <div lang="en"> .cs-display', "1.15", function (X) { var v = ratio(X.L.type.dispEn); return { pass: Math.abs(v - 1.15) < 0.006, value: f2(v, 3) }; });
    add("D6", "Stacked-diacritic clearance at display size", ".cs-display · “Hệ thống … Đổi mới sáng tạo”", "line-height ≥ ink ascent + descent", function (X) { var t = X.L.type, lh = px(t.dispVi.lh), inkH = t.ink.ascent + t.ink.descent, g = lh - inkH; return { pass: g >= 0, value: (g >= 0 ? "+" : "") + f2(g, 1) + "px (lh " + f2(lh, 1) + " · ink " + f2(inkH, 1) + ")" }; });
    add("D6", "Badge line-height", ".cs-badge", "1.2", function (X) { var v = ratio(X.L.type.badge); return { pass: Math.abs(v - 1.2) < 0.01, value: f2(v, 3) }; });
    add("D6", "Badge padding", ".cs-badge", "3px 9px", function (X) { var b = X.L.type.badge; return { pass: px(b.pt) === 3 && px(b.pb) === 3 && px(b.pl) === 9 && px(b.pr) === 9, value: b.pt + " " + b.pr }; });
    add("D6", "Tooltip white-space", ".cs-tooltip__bubble", "normal", function (X) { return { pass: X.L.type.tip.ws === "normal", value: X.L.type.tip.ws }; });
    add("D6", "Tooltip max-inline-size", ".cs-tooltip__bubble", "240px", function (X) { return { pass: X.L.type.tip.maxw === "240px", value: X.L.type.tip.maxw }; });
    add("D6", "Tooltip 1px inset border", ".cs-tooltip__bubble", "inset 0 0 0 1px", function (X) { return { pass: !!insetRing(X.L.type.tip.shadow, 1), value: insetRing(X.L.type.tip.shadow, 1) ? "present" : "absent" }; });
    add("D6", "VI tooltip wraps within 240px", ".cs-tooltip__bubble", "width ≤ 240px · ≥ 2 lines", function (X) { var t = X.L.type.tip, lines = Math.round((t.h - px(t.pt) - px(t.pb)) / px(t.lh)); return { pass: t.w <= 240.5 && lines >= 2, value: f2(t.w, 0) + "px · " + lines + " line" + (lines === 1 ? "" : "s") }; });
    function docCheck(title, target, expect, sv, lv, ok) { add("D7", title, target, expect, function (X) { var s = sv(X.S), l = X.live ? lv(X.live) : undefined, pass = ok(s) && (l === undefined || l === null || ok(l)); return { pass: pass, value: String(s) + (l !== undefined ? " · live " + (l === null ? "n/a" : (typeof l === "number" ? f2(l, 3) : l)) : "") }; }); }
    docCheck("Slate EN italic swatch", "guidelines/documents.html", "#26323A", function (S) { return S.slate; }, function (L) { return L.slate ? hex(L.slate) : null; }, function (v) { return String(v).toUpperCase() === "#26323A"; });
    docCheck("Deck .display line-height", "ui_kits/deck/index.html", "1.12", function (S) { return S.deck; }, function (L) { return L.deck; }, function (v) { return Math.abs(parseFloat(v) - 1.12) < 0.006; });
    [1, 2, 3].forEach(function (n) {
      docCheck("ĐIỀU " + n + " heading · Termination decision", "VnTerminationDecision.dc.html", "13.5px", function (S) { return S.term[n - 1]; }, function (L) { return L.term[n - 1]; }, function (v) { return parseFloat(v) === 13.5; });
    });
    [1, 2, 3].forEach(function (n) {
      docCheck("ĐIỀU " + n + " heading · Appointment / transfer", "VnAppointmentTransfer.dc.html", "13.5px", function (S) { return S.appt[n - 1]; }, function (L) { return L.appt[n - 1]; }, function (v) { return parseFloat(v) === 13.5; });
    });
    var REC = {
      "Dark root: scrim darkens the dark page by ≥ 1 JND": "The v2.4.0 scrim's inner colour (OKLab L ≈ 0.19) is almost the dark page's own lightness (≈ 0.20), so over a bare dark page it stops the v2.3.1 lightening but does not visibly dim. Separation currently comes from the dialog panel and the xl shadow. If bare-page dimming is wanted, deepen the mix under [data-theme=\"dark\"] (more #050403 or a higher alpha) and re-run.",
      "EN .cs-display inside a VI page keeps tight 1.15": "`:lang(vi) :is(.cs-display, .cs-display--fluid)` uses a descendant combinator, so an English display heading inside a lang=\"vi\" document also gets 1.22. Writing `:is(.cs-display, .cs-display--fluid):lang(vi)` follows the element's own language and keeps EN blocks at the 1.15 tight ramp."
    };
    C.forEach(function (c) { c.rec = REC[c.title] || ""; });
    return C;
  }

  /* ---------- run ---------- */
  var RESULT = null;
  async function run() {
    var btn = $("#au-run"); btn.disabled = true; $("#au-frames").innerHTML = "";
    status("Loading fixtures · Đang tải dữ liệu kiểm thử…");
    var t0 = performance.now();
    var fx = await Promise.all([fixture("current", "light"), fixture("current", "dark"), fixture("baseline", "light"), fixture("baseline", "dark")]);
    var cur = { L: fx[0], D: fx[1] }, base = { L: fx[2], D: fx[3] };
    status("Reading documents, deck and A4 templates…");
    var files = await Promise.all(["../guidelines/documents.html", "../ui_kits/deck/index.html", "../templates/vn-termination-decision/VnTerminationDecision.dc.html", "../templates/vn-appointment-transfer/VnAppointmentTransfer.dc.html",
      "baseline-v2.3.1/guidelines/documents.html.txt", "baseline-v2.3.1/ui_kits/deck/index.html.txt", "baseline-v2.3.1/templates/VnTerminationDecision.dc.html.txt", "baseline-v2.3.1/templates/VnAppointmentTransfer.dc.html.txt", "../DESIGN.md"].map(txt));
    cur.S = { slate: slateHex(files[0]), deck: deckLH(files[1]), term: dieuSizes(files[2]), appt: dieuSizes(files[3]) };
    base.S = { slate: slateHex(files[4]), deck: deckLH(files[5]), term: dieuSizes(files[6]), appt: dieuSizes(files[7]) };
    status("Rendering live documents (v2.4.0)…");
    try { cur.live = await liveDocs(); } catch (e) { cur.live = null; }
    if (!cur.L || !base.L) { status("Fixture failed to load — check console."); btn.disabled = false; return; }
    var checks = buildChecks(window.__auProps || Object.keys(cur.L.props.root), { radius: designRadius(files[8]) });
    checks.forEach(function (c) { try { c.base = c.fn(base); } catch (e) { c.base = { pass: false, value: "error: " + e.message }; } try { c.cur = c.fn(cur); } catch (e) { c.cur = { pass: false, value: "error: " + e.message }; }
      c.state = c.base.pass && c.cur.pass ? "holds" : (!c.base.pass && c.cur.pass ? "fixed" : (c.base.pass ? "regressed" : "open")); });
    RESULT = { when: new Date().toISOString(), ms: Math.round(performance.now() - t0), ua: navigator.userAgent, checks: checks.map(function (c) { return { dim: c.dim, title: c.title, target: c.target, expect: c.expect, control: c.control, v231: c.base, v240: c.cur, state: c.state }; }), raw: { v240: cur, v231: base } };
    render(checks); btn.disabled = false;
    try { console.info("[cs-audit] " + checks.map(function (c) { return c.dim + " " + c.state.toUpperCase() + " | " + c.title + " | 2.3.1=" + c.base.value + " | 2.4.0=" + c.cur.value; }).join("\n")); } catch (e) {}
    status("Ran " + checks.length + " checks in " + (RESULT.ms / 1000).toFixed(1) + "s · " + new Date().toLocaleString());
  }
  function status(t) { $("#au-status").textContent = t; }

  /* ---------- render ---------- */
  function score(checks, dim, key) { var a = checks.filter(function (c) { return c.dim === dim; }); var p = a.filter(function (c) { return c[key].pass; }).length; return { p: p, n: a.length, s: a.length ? 10 * p / a.length : 0 }; }
  var STATE = { fixed: ["Fixed", "Đã khắc phục"], holds: ["Holds", "Giữ vững"], open: ["Open", "Còn mở"], regressed: ["Regressed", "Thoái lui"] };
  function badge(pass) { return el("span", { class: "au-pf " + (pass ? "is-pass" : "is-fail"), text: pass ? "PASS" : "FAIL" }); }
  function render(checks) {
    var sb = $("#au-score"); sb.innerHTML = "";
    var tb = 0, tc = 0;
    DIMS.forEach(function (d) {
      var b = score(checks, d.id, "base"), c = score(checks, d.id, "cur"); tb += b.s; tc += c.s;
      var delta = c.s - b.s;
      sb.appendChild(el("div", { class: "au-dim" }, [
        el("div", { class: "au-dim__name" }, [el("b", { text: d.id + " · " + d.name }), el("span", { text: d.vi + " · §" + d.sec })]),
        el("div", { class: "au-bars" }, [
          el("div", { class: "au-bar" }, [el("i", { class: "au-bar__fill is-base", style: "inline-size:" + b.s * 10 + "%" }), el("span", { text: "v2.3.1 " + f2(b.s, 1) + " · " + b.p + "/" + b.n })]),
          el("div", { class: "au-bar" }, [el("i", { class: "au-bar__fill is-cur", style: "inline-size:" + c.s * 10 + "%" }), el("span", { text: "v2.4.0 " + f2(c.s, 1) + " · " + c.p + "/" + c.n })])
        ]),
        el("div", { class: "au-delta" + (delta > 0 ? " is-up" : delta < 0 ? " is-down" : ""), text: (delta > 0 ? "+" : "") + f2(delta, 1) })
      ]));
    });
    $("#au-overall-base").textContent = f2(tb / DIMS.length, 1);
    $("#au-overall-cur").textContent = f2(tc / DIMS.length, 1);
    var counts = { fixed: 0, holds: 0, open: 0, regressed: 0 }; checks.forEach(function (c) { counts[c.state]++; });
    $("#au-counts").textContent = counts.fixed + " fixed · " + counts.holds + " hold · " + counts.open + " open · " + counts.regressed + " regressed · " + checks.length + " checks";
    [1, 2, 3, 4].forEach(function (sec) {
      var host = $("#au-checks-" + sec); host.innerHTML = "";
      DIMS.filter(function (d) { return d.sec === sec; }).forEach(function (d) {
        var t = el("table", { class: "au-table" }), thead = el("thead", null, [el("tr", null, ["Check", "Expected", "v2.3.1", "v2.4.0", "Result"].map(function (h) { return el("th", { text: h }); }))]), tbody = el("tbody");
        checks.filter(function (c) { return c.dim === d.id; }).forEach(function (c) {
          tbody.appendChild(el("tr", { "data-state": c.state }, [
            el("td", null, [el("b", { text: c.title }), el("code", { text: c.target }), c.control ? el("small", { text: "control" }) : null]),
            el("td", { class: "au-mono", text: c.expect }),
            el("td", null, [badge(c.base.pass), el("div", { class: "au-val", text: String(c.base.value) })]),
            el("td", null, [badge(c.cur.pass), el("div", { class: "au-val", text: String(c.cur.value) })]),
            el("td", null, [el("span", { class: "au-state is-" + c.state, text: STATE[c.state][0] }), el("small", { text: STATE[c.state][1] })])
          ]));
        });
        t.appendChild(thead); t.appendChild(tbody);
        host.appendChild(el("h4", { class: "au-dimhead", text: d.id + " · " + d.name }));
        host.appendChild(el("div", { class: "au-tablewrap" }, [t]));
      });
    });
    applyFilter();
    var fh = $("#au-findings"); fh.innerHTML = "";
    var issues = checks.filter(function (c) { return c.state === "open" || c.state === "regressed"; });
    if (!issues.length) fh.appendChild(el("p", { text: "No open or regressed checks in v2.4.0." }));
    issues.forEach(function (c) { fh.appendChild(el("div", { class: "au-finding" }, [el("span", { class: "au-state is-" + c.state, text: STATE[c.state][0] }), el("div", null, [el("b", { text: c.dim + " · " + c.title }), el("div", { class: "au-val", text: "v2.4.0: " + c.cur.value }), c.rec ? el("p", { text: c.rec }) : null])])); });
  }
  function applyFilter() { var f = document.querySelector('input[name="au-filter"]:checked').value; document.querySelectorAll(".au-table tbody tr").forEach(function (tr) { var s = tr.getAttribute("data-state"); tr.hidden = !(f === "all" || (f === "fixed" && s === "fixed") || (f === "issues" && (s === "open" || s === "regressed"))); }); }

  /* ---------- specimen + preview ---------- */
  var lastSrc = "";
  function jump() { var f = $("#au-specimen"), a = $("#au-sp-a").value; try { var t = f.contentDocument && f.contentDocument.getElementById(a); if (t) f.contentWindow.scrollTo(0, t.offsetTop - 8); } catch (e) {} }
  function specimen() {
    var f = $("#au-specimen"), v = $("#au-sp-v").value, r = $("#au-sp-t").value, e = $("#au-sp-e").value;
    var src = "fixture.html?v=" + v + "&root=" + r + (e ? "&el=" + e : "");
    if (src === lastSrc) { jump(); return; }
    lastSrc = src; f.onload = jump; f.src = src;
  }
  function preview(src, label) { var d = $("#au-preview"); $("#au-preview-frame").src = src; $("#au-preview-title").textContent = label; d.showModal(); }

  document.addEventListener("DOMContentLoaded", function () {
    $("#au-run").addEventListener("click", run);
    document.querySelectorAll('input[name="au-filter"]').forEach(function (i) { i.addEventListener("change", applyFilter); });
    ["#au-sp-v", "#au-sp-t", "#au-sp-e", "#au-sp-a"].forEach(function (s) { $(s).addEventListener("change", specimen); });
    document.querySelectorAll("[data-preview]").forEach(function (b) { b.addEventListener("click", function () { preview(b.getAttribute("data-preview"), b.textContent); }); });
    $("#au-preview-close").addEventListener("click", function () { $("#au-preview").close(); $("#au-preview-frame").src = "about:blank"; });
    $("#au-export").addEventListener("click", function () { if (!RESULT) return; var a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(RESULT, null, 2)], { type: "application/json" })), download: "cyberskill-design-v2.4.0-verification.json" }); document.body.appendChild(a); a.click(); a.remove(); });
    specimen(); run();
  });
})();
