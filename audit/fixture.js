/* CyberSkill v2.4.0 audit fixture — collects raw computed values; verify.js judges them. */
(function () {
  var PROPS = ["--_cs-border-subtle", "--_cs-border-strong", "--_cs-surface-scrim",
    "--cs-glass-whisper-bg", "--cs-glass-whisper-border", "--cs-glass-light-bg", "--cs-glass-light-border",
    "--cs-glass-standard-bg", "--cs-glass-standard-border", "--cs-glass-heavy-bg", "--cs-glass-heavy-border"];
  var SCOPES = [["", "Thổ · default", "no attribute"], ["tho", "Thổ", "data-cs-element=tho"], ["moc", "Mộc", "data-cs-element=moc"],
    ["hoa", "Hỏa", "data-cs-element=hoa"], ["kim", "Kim", "data-cs-element=kim"], ["thuy", "Thủy", "data-cs-element=thuy"]];
  var fx = window.__fx;
  var opposite = fx.root === "dark" ? "light" : "dark";
  document.getElementById("fx-nest").setAttribute("data-theme", opposite);
  document.getElementById("fx-back").setAttribute("data-theme", fx.root);
  if (fx.el) document.getElementById("fx-root").setAttribute("data-cs-element", fx.el);

  var rows = document.getElementById("fx-ring-rows");
  SCOPES.forEach(function (s) {
    var r = document.createElement("div");
    r.className = "fx-ring-row"; r.setAttribute("data-scope", s[0] || "default");
    if (s[0]) r.setAttribute("data-cs-element", s[0]);
    r.innerHTML = '<div class="fx-lab">' + s[1] + '<small>' + s[2] + '</small></div>' +
      '<div class="fx-cell"><div class="cs-cal__grid"><button class="sel" type="button" aria-pressed="true">18</button></div><small>cal .sel</small></div>' +
      '<div class="fx-cell"><div class="cs-fab"><button class="cs-fab__main" type="button" aria-label="Make a wish">✦</button></div></div>' +
      '<div class="fx-cell"><div class="cs-timeline"><div class="cs-timeline__item cs-timeline__item--now"><span class="cs-timeline__marker"></span></div></div><small>timeline now</small></div>' +
      '<div class="fx-cell"><div class="cs-steps"><div class="cs-step cs-step--active"><span class="cs-step__marker">2</span></div></div><small>step active</small></div>';
    rows.appendChild(r);
  });

  function cs(el) { return getComputedStyle(el); }
  function timeout(p, ms) { return Promise.race([p, new Promise(function (r) { setTimeout(r, ms); })]); }
  function probe(scope, prop, value) {
    var i = document.createElement("i"); i.className = "fx-p"; i.style[prop] = value; scope.appendChild(i);
    var out = cs(i)[prop]; i.remove(); return out;
  }
  function props(scope) {
    var o = {}; PROPS.forEach(function (p) { o[p] = probe(scope, "backgroundColor", "var(" + p + ")"); }); return o;
  }
  function box(el) { var s = cs(el); return { boxShadow: s.boxShadow, bg: s.backgroundColor }; }
  function fontOf(s) { return s.fontStyle + " " + s.fontWeight + " " + s.fontSize + " " + s.fontFamily; }
  function ink(el, text) {
    var s = cs(el), c = document.createElement("canvas").getContext("2d");
    c.font = fontOf(s); var m = c.measureText(text);
    return { ascent: m.actualBoundingBoxAscent, descent: m.actualBoundingBoxDescent, font: c.font };
  }

  async function measure() {
    await window.__fxReady;
    try { await timeout(document.fonts.load('800 60px "Be Vietnam Pro"', "Hệ thống Ổ"), 4000); await timeout(document.fonts.ready, 4000); } catch (e) {}
    await new Promise(function (r) { setTimeout(r, 80); });
    var root = document.getElementById("fx-root"), nest = document.getElementById("fx-nest"), back = document.getElementById("fx-back");
    var m = { v: fx.v, root: fx.root, props: { root: props(root), nest: props(nest), back: props(back) } };
    m.scrim = {
      rootPage: probe(root, "backgroundColor", "var(--cs-color-surface-page)"), rootScrim: m.props.root["--_cs-surface-scrim"], rootPanel: probe(root, "backgroundColor", "var(--cs-color-surface-panel)"),
      nestPage: probe(nest, "backgroundColor", "var(--cs-color-surface-page)"), nestScrim: m.props.nest["--_cs-surface-scrim"], nestPanel: probe(nest, "backgroundColor", "var(--cs-color-surface-panel)"),
      nestOverlay: cs(document.getElementById("fx-overlay")).backgroundColor
    };
    function btn(id) { var s = cs(document.getElementById(id)); return { opacity: s.opacity, cursor: s.cursor }; }
    m.buttons = { loading: btn("fx-btn-loading"), loadingOnly: btn("fx-btn-loading-only"), disabled: btn("fx-btn-disabled") };
    var d = cs(document.getElementById("fx-dialog"));
    m.dialog = { radius: d.borderTopLeftRadius, radiusLg: probe(nest, "borderTopLeftRadius", "var(--cs-radius-lg)") };
    m.combo = {
      cls: cs(document.getElementById("fx-cb-class")).borderTopColor, aria: cs(document.getElementById("fx-cb-aria")).borderTopColor,
      valid: cs(document.getElementById("fx-cb-valid")).borderTopColor,
      danger: probe(root, "color", "var(--cs-color-semantic-danger)"), panel: probe(root, "backgroundColor", "var(--cs-color-surface-panel)")
    };
    m.rings = {};
    Array.prototype.forEach.call(document.querySelectorAll(".fx-ring-row"), function (r) {
      m.rings[r.getAttribute("data-scope")] = {
        strong: probe(r, "color", "var(--cs-accent-strong)"), panel: probe(r, "backgroundColor", "var(--cs-color-surface-panel)"),
        cal: box(r.querySelector(".cs-cal__grid button.sel")), fab: box(r.querySelector(".cs-fab__main")),
        timeline: box(r.querySelector(".cs-timeline__item--now .cs-timeline__marker")), step: box(r.querySelector(".cs-step--active .cs-step__marker"))
      };
    });
    function lh(id) { var e = document.getElementById(id), s = cs(e); return { lh: s.lineHeight, fs: s.fontSize, lang: e.closest("[lang]").getAttribute("lang") }; }
    var dispVi = document.getElementById("fx-disp-vi");
    m.type = { dispVi: lh("fx-disp-vi"), dispFluidVi: lh("fx-dispf-vi"), dispEn: lh("fx-disp-en"), ink: ink(dispVi, dispVi.textContent) };
    var b = cs(document.getElementById("fx-badge"));
    m.type.badge = { lh: b.lineHeight, fs: b.fontSize, pt: b.paddingTop, pr: b.paddingRight, pb: b.paddingBottom, pl: b.paddingLeft };
    var tipEl = document.getElementById("fx-tip"), t = cs(tipEl), rect = tipEl.getBoundingClientRect();
    m.type.tip = { ws: t.whiteSpace, maxw: t.maxInlineSize || t.maxWidth, shadow: t.boxShadow, w: rect.width, h: rect.height, lh: t.lineHeight, pt: t.paddingTop, pb: t.paddingBottom };
    return m;
  }
  window.CSAudit = { measure: measure, PROPS: PROPS, SCOPES: SCOPES };
})();
