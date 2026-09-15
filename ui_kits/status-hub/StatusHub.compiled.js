(() => {
  const { useState, useMemo } = React;
  const ICON = {
    search: "M11 4a7 7 0 1 0 4.2 12.6L20 21l1.4-1.4-4.4-4.4A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z",
    close: "M6 6l12 12M18 6L6 18",
    sun: null,
    moon: null
  };
  function Glyph({ d, size = 18 }) {
    return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d }));
  }
  function SearchGlyph() {
    return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: ICON.search }));
  }
  function ThemeGlyph({ dark }) {
    return dark ? /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" })) : /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" }));
  }
  const T = {
    en: {
      sub: "CyberSkill \xB7 one page, three lenses \xB7 Hi\u1EC7n Th\u1EF1c Ho\xE1 \xDD Ch\xED",
      updated: "Updated",
      portfolio: "Portfolio",
      projects: "Projects",
      inprog: "In progress",
      shipped: "Shipped",
      blocked: "Blocked",
      planned: "Planned",
      avg: "Avg progress",
      velocity: "Velocity \xB7 tasks shipped / week",
      perShipped: " shipped",
      nowTitle: "Now shipping",
      search: "Search projects\u2026",
      view: "View",
      lenses: { board: "Board", table: "Table", releases: "Releases" },
      status: "Status",
      all: "All",
      of: "of",
      key: "Key",
      project: "Project",
      squad: "Squad",
      owner: "Owner",
      progress: "Progress",
      thisWeek: "This week",
      tasks: "Tasks",
      risk: "Risk",
      close: "Close",
      langBtn: "VN",
      theme: "Toggle theme"
    },
    vi: {
      sub: "CyberSkill \xB7 m\u1ED9t trang, ba l\u0103ng k\xEDnh \xB7 Hi\u1EC7n Th\u1EF1c Ho\xE1 \xDD Ch\xED",
      updated: "C\u1EADp nh\u1EADt",
      portfolio: "Danh m\u1EE5c",
      projects: "D\u1EF1 \xE1n",
      inprog: "\u0110ang l\xE0m",
      shipped: "\u0110\xE3 ra m\u1EAFt",
      blocked: "B\u1ECB ch\u1EB7n",
      planned: "D\u1EF1 ki\u1EBFn",
      avg: "Ti\u1EBFn \u0111\u1ED9 TB",
      velocity: "T\u1ED1c \u0111\u1ED9 \xB7 task giao / tu\u1EA7n",
      perShipped: " \u0111\xE3 giao",
      nowTitle: "\u0110ang ra m\u1EAFt",
      search: "T\xECm d\u1EF1 \xE1n\u2026",
      view: "Ch\u1EBF \u0111\u1ED9 xem",
      lenses: { board: "B\u1EA3ng c\xF4ng vi\u1EC7c", table: "B\u1EA3ng d\u1EEF li\u1EC7u", releases: "Ph\xE1t h\xE0nh" },
      status: "Tr\u1EA1ng th\xE1i",
      all: "T\u1EA5t c\u1EA3",
      of: "tr\xEAn",
      key: "M\xE3",
      project: "D\u1EF1 \xE1n",
      squad: "Nh\xF3m",
      owner: "Ph\u1EE5 tr\xE1ch",
      progress: "Ti\u1EBFn \u0111\u1ED9",
      thisWeek: "Tu\u1EA7n n\xE0y",
      tasks: "C\xF4ng vi\u1EC7c",
      risk: "R\u1EE7i ro",
      close: "\u0110\xF3ng",
      langBtn: "EN",
      theme: "\u0110\u1ED5i giao di\u1EC7n"
    }
  };
  const statusLabels = (t) => ({ done: t.shipped, active: t.inprog, hold: t.blocked, todo: t.planned });
  function Segments({ seg, className }) {
    return /* @__PURE__ */ React.createElement("div", { className }, seg.done > 0 && /* @__PURE__ */ React.createElement("i", { className: "seg-done", style: { width: seg.done + "%" } }), seg.active > 0 && /* @__PURE__ */ React.createElement("i", { className: "seg-active", style: { width: seg.active + "%" } }), seg.hold > 0 && /* @__PURE__ */ React.createElement("i", { className: "seg-hold", style: { width: seg.hold + "%" } }), seg.todo > 0 && /* @__PURE__ */ React.createElement("i", { className: "seg-todo", style: { width: seg.todo + "%" } }));
  }
  function Drawer({ p, onClose, t }) {
    if (!p) return null;
    const SL = statusLabels(t);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "scrim", onClick: onClose }), /* @__PURE__ */ React.createElement("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-label": p.name }, /* @__PURE__ */ React.createElement("div", { className: "dw-h" }, /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("span", { className: "mono muted", style: { fontWeight: 700 } }, p.key), /* @__PURE__ */ React.createElement("span", { className: "pill " + p.status }, SL[p.status]), /* @__PURE__ */ React.createElement("button", { className: "dw-x", onClick: onClose, "aria-label": t.close }, /* @__PURE__ */ React.createElement(Glyph, { d: ICON.close, size: 20 }))), /* @__PURE__ */ React.createElement("h2", null, p.name)), /* @__PURE__ */ React.createElement("div", { className: "dw-b" }, /* @__PURE__ */ React.createElement("p", { className: "muted", style: { marginTop: 0 } }, p.blurb), /* @__PURE__ */ React.createElement("dl", { className: "meta" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, t.owner), /* @__PURE__ */ React.createElement("dd", null, p.owner)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, t.squad), /* @__PURE__ */ React.createElement("dd", null, p.squad)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, t.progress), /* @__PURE__ */ React.createElement("dd", null, p.pct, "%")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("dt", null, t.updated), /* @__PURE__ */ React.createElement("dd", null, p.updated))), /* @__PURE__ */ React.createElement(Segments, { seg: p.seg, className: "minibar" }), /* @__PURE__ */ React.createElement("div", { className: "sect" }, /* @__PURE__ */ React.createElement("h3", null, t.tasks), /* @__PURE__ */ React.createElement("div", { className: "task-chips" }, p.tasks.map((tk) => /* @__PURE__ */ React.createElement("span", { key: tk[0], className: "chip " + tk[2], title: tk[1] }, tk[0]))), /* @__PURE__ */ React.createElement("ul", { className: "tasks" }, p.tasks.map((tk) => /* @__PURE__ */ React.createElement("li", { key: tk[0] }, tk[1], " \u2014 ", /* @__PURE__ */ React.createElement("span", { className: "muted" }, SL[tk[2]]))))), p.risk ? /* @__PURE__ */ React.createElement("div", { className: "sect" }, /* @__PURE__ */ React.createElement("h3", null, t.risk), /* @__PURE__ */ React.createElement("div", { className: "risk" }, p.risk)) : null)));
  }
  function StatusHub() {
    const D = window.SH_DATA;
    const [dark, setDark] = useState(false);
    const [lang, setLang] = useState("en");
    const [lens, setLens] = useState("board");
    const [q, setQ] = useState("");
    const [facet, setFacet] = useState("all");
    const [kpi, setKpi] = useState(null);
    const [sel, setSel] = useState(null);
    const t = T[lang];
    const SL = statusLabels(t);
    const VI = lang === "vi" ? window.SH_VI || null : null;
    const loc = (p) => VI ? {
      ...p,
      blurb: VI.blurbs[p.key] || p.blurb,
      risk: VI.risks[p.key] != null ? VI.risks[p.key] : p.risk,
      owner: VI.owners[p.owner] || p.owner,
      squad: VI.squads[p.squad] || p.squad,
      updated: VI.updatedRel[p.updated] || p.updated
    } : p;
    const counts = useMemo(() => {
      const c = { active: 0, done: 0, hold: 0 };
      D.projects.forEach((p) => {
        if (c[p.status] != null) c[p.status]++;
      });
      const avg = Math.round(D.projects.reduce((a, p) => a + p.pct, 0) / D.projects.length);
      return { total: D.projects.length, ...c, avg };
    }, [D]);
    const shown = useMemo(() => {
      const needle = q.trim().toLowerCase();
      const eff = kpi || (facet === "all" ? null : facet);
      return D.projects.filter((p) => {
        if (eff && p.status !== eff) return false;
        if (!needle) return true;
        return (p.name + " " + p.key + " " + p.blurb).toLowerCase().includes(needle);
      });
    }, [D, q, facet, kpi]);
    const maxV = Math.max(...D.velocity.map((v) => v.n));
    const toggleKpi = (k) => setKpi((cur) => cur === k ? null : k);
    return /* @__PURE__ */ React.createElement("div", { className: "sh", lang, "data-theme": dark ? "dark" : void 0 }, /* @__PURE__ */ React.createElement("a", { className: "cs-skip", href: "#main" }, lang === "vi" ? "B\u1ECF qua \u0111\u1EBFn n\u1ED9i dung" : "Skip to content"), /* @__PURE__ */ React.createElement("header", { className: "hd" }, /* @__PURE__ */ React.createElement("div", { className: "hd-in" }, /* @__PURE__ */ React.createElement("div", { className: "hd-id" }, /* @__PURE__ */ React.createElement("span", { className: "hd-mark" }, /* @__PURE__ */ React.createElement("img", { src: "../../assets/logo-mark.svg", alt: "" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "Status Hub"), /* @__PURE__ */ React.createElement("p", { className: "hd-sub" }, t.sub))), /* @__PURE__ */ React.createElement("div", { className: "hd-side" }, /* @__PURE__ */ React.createElement("p", { className: "hd-meta" }, t.updated, /* @__PURE__ */ React.createElement("br", null), VI ? VI.updated : D.updated), /* @__PURE__ */ React.createElement("button", { className: "btn ghost", onClick: () => setLang((l) => l === "en" ? "vi" : "en"), "aria-label": "Toggle language", style: { fontWeight: 700, fontSize: 13 } }, t.langBtn), /* @__PURE__ */ React.createElement("button", { className: "btn ghost", onClick: () => setDark((v) => !v), "aria-label": t.theme }, /* @__PURE__ */ React.createElement(ThemeGlyph, { dark }))))), /* @__PURE__ */ React.createElement("main", { id: "main", className: "wrap" }, /* @__PURE__ */ React.createElement("div", { className: "deck" }, /* @__PURE__ */ React.createElement("section", { className: "panel" }, /* @__PURE__ */ React.createElement("h2", null, t.portfolio), /* @__PURE__ */ React.createElement("div", { className: "kpis" }, /* @__PURE__ */ React.createElement("button", { className: "kpi", "data-on": kpi === null ? "1" : "0", onClick: () => setKpi(null) }, /* @__PURE__ */ React.createElement("b", null, counts.total), /* @__PURE__ */ React.createElement("span", null, t.projects)), /* @__PURE__ */ React.createElement("button", { className: "kpi", "data-on": kpi === "active" ? "1" : "0", onClick: () => toggleKpi("active") }, /* @__PURE__ */ React.createElement("b", null, counts.active), /* @__PURE__ */ React.createElement("span", null, t.inprog)), /* @__PURE__ */ React.createElement("button", { className: "kpi", "data-on": kpi === "done" ? "1" : "0", onClick: () => toggleKpi("done") }, /* @__PURE__ */ React.createElement("b", null, counts.done), /* @__PURE__ */ React.createElement("span", null, t.shipped)), /* @__PURE__ */ React.createElement("button", { className: "kpi", "data-on": kpi === "hold" ? "1" : "0", onClick: () => toggleKpi("hold") }, /* @__PURE__ */ React.createElement("b", null, counts.hold), /* @__PURE__ */ React.createElement("span", null, t.blocked)), /* @__PURE__ */ React.createElement("button", { className: "kpi", onClick: () => setKpi(null) }, /* @__PURE__ */ React.createElement("b", null, counts.avg, "%"), /* @__PURE__ */ React.createElement("span", null, t.avg))), /* @__PURE__ */ React.createElement(Segments, { seg: { done: 60, active: 22, hold: 6, todo: 12 }, className: "bar-seg" }), /* @__PURE__ */ React.createElement("div", { className: "legend" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "dot", style: { background: "var(--cs-color-semantic-success)" } }), t.shipped), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "dot", style: { background: "var(--cs-color-brand-ochre)" } }), t.inprog), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "dot", style: { background: "var(--cs-color-semantic-danger)" } }), t.blocked), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "dot", style: { background: "var(--cs-status-todo)" } }), t.planned))), /* @__PURE__ */ React.createElement("section", { className: "panel" }, /* @__PURE__ */ React.createElement("h2", null, t.velocity), /* @__PURE__ */ React.createElement("div", { className: "spark" }, D.velocity.map((v) => /* @__PURE__ */ React.createElement("a", { key: v.wk, title: v.n + t.perShipped }, /* @__PURE__ */ React.createElement("b", null, v.n), /* @__PURE__ */ React.createElement("i", { style: { height: v.n / maxV * 72 + "px" } }), /* @__PURE__ */ React.createElement("span", null, v.wk)))))), /* @__PURE__ */ React.createElement("div", { className: "now" }, /* @__PURE__ */ React.createElement("h2", null, t.nowTitle), lang === "vi" ? /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "v1.6.0 \u2014 Li\xEAn k\u1EBFt Glass + g\xF3i Ng\u0169 H\xE0nh v2."), " Li\xEAn k\u1EBFt component ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, ".cs-surface-*"), " (t\xF9y ch\u1ECDn), tr\xECnh ki\u1EC3m 0 c\u1EA3nh b\xE1o tr\xEAn c\u1EA3 15 g\xF3i, v\xE0 ki\u1EC3m tra l\u1EA1i APCA cho ch\u1EBF \u0111\u1ED9 t\u1ED1i. Ra m\u1EAFt tu\u1EA7n n\xE0y.") : /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("b", null, "v1.6.0 \u2014 Glass bindings + element-pack v2."), " Opt-in ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, ".cs-surface-*"), " component bindings, a zero-warning verifier across all 15 packs, and a dark-mode APCA re-check. Ships this week.")), /* @__PURE__ */ React.createElement("div", { className: "bar" }, /* @__PURE__ */ React.createElement("div", { className: "bar-top" }, /* @__PURE__ */ React.createElement("label", { className: "srch" }, /* @__PURE__ */ React.createElement(SearchGlyph, null), /* @__PURE__ */ React.createElement("input", { placeholder: t.search, value: q, onChange: (e) => setQ(e.target.value) })), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "lenses",
        role: "tablist",
        "aria-label": t.view,
        onKeyDown: (e) => {
          const order = ["board", "table", "releases"];
          const i = order.indexOf(lens);
          let next = i;
          if (e.key === "ArrowRight") next = (i + 1) % order.length;
          else if (e.key === "ArrowLeft") next = (i - 1 + order.length) % order.length;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = order.length - 1;
          else return;
          e.preventDefault();
          setLens(order[next]);
          const tabs = e.currentTarget.querySelectorAll('[role="tab"]');
          tabs[next] && tabs[next].focus && tabs[next].focus();
        }
      },
      ["board", "table", "releases"].map((l) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: l,
          className: "ln",
          role: "tab",
          "aria-selected": lens === l,
          tabIndex: lens === l ? 0 : -1,
          onClick: () => setLens(l)
        },
        t.lenses[l]
      ))
    ), /* @__PURE__ */ React.createElement("label", { className: "facet" }, t.status, /* @__PURE__ */ React.createElement("select", { value: kpi || facet, onChange: (e) => {
      setFacet(e.target.value);
      setKpi(null);
    } }, /* @__PURE__ */ React.createElement("option", { value: "all" }, t.all), /* @__PURE__ */ React.createElement("option", { value: "active" }, t.inprog), /* @__PURE__ */ React.createElement("option", { value: "done" }, t.shipped), /* @__PURE__ */ React.createElement("option", { value: "hold" }, t.blocked))), /* @__PURE__ */ React.createElement("span", { className: "cnt" }, shown.length, " ", t.of, " ", D.projects.length))), lens === "board" && /* @__PURE__ */ React.createElement("div", { className: "grid" }, shown.map((p0) => {
      const p = loc(p0);
      return /* @__PURE__ */ React.createElement("button", { className: "card" + (p.status === "active" ? " hot" : ""), key: p.key, onClick: () => setSel(p0) }, /* @__PURE__ */ React.createElement("div", { className: "card-h" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement("span", { className: "k mono" }, p.key), " \xB7 ", p.name), /* @__PURE__ */ React.createElement("span", { className: "pct" }, p.pct, "%")), /* @__PURE__ */ React.createElement("p", null, p.blurb), /* @__PURE__ */ React.createElement(Segments, { seg: p.seg, className: "minibar" }), /* @__PURE__ */ React.createElement("div", { className: "task-chips" }, /* @__PURE__ */ React.createElement("span", { className: "pill " + p.status }, SL[p.status]), p.tasks.slice(0, 3).map((tk) => /* @__PURE__ */ React.createElement("span", { key: tk[0], className: "chip " + tk[2] }, tk[0]))));
    })), lens === "table" && /* @__PURE__ */ React.createElement("div", { className: "tbl-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "tbl" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, t.key), /* @__PURE__ */ React.createElement("th", null, t.project), /* @__PURE__ */ React.createElement("th", null, t.squad), /* @__PURE__ */ React.createElement("th", null, t.owner), /* @__PURE__ */ React.createElement("th", null, t.progress), /* @__PURE__ */ React.createElement("th", null, t.status))), /* @__PURE__ */ React.createElement("tbody", null, shown.map((p0) => {
      const p = loc(p0);
      return /* @__PURE__ */ React.createElement("tr", { key: p.key, onClick: () => setSel(p0) }, /* @__PURE__ */ React.createElement("td", { className: "mono", style: { fontWeight: 700 } }, p.key), /* @__PURE__ */ React.createElement("td", null, p.name), /* @__PURE__ */ React.createElement("td", null, p.squad), /* @__PURE__ */ React.createElement("td", null, p.owner), /* @__PURE__ */ React.createElement("td", null, p.pct, "%"), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "pill " + p.status }, SL[p.status])));
    })))), lens === "releases" && /* @__PURE__ */ React.createElement("div", { className: "rels" }, D.releases.map((r) => /* @__PURE__ */ React.createElement("div", { className: "rel" + (r.now ? " now" : ""), key: r.ver }, /* @__PURE__ */ React.createElement("div", { className: "tick" }, r.done ? "\u2713" : "\u2192"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "rel-h" }, /* @__PURE__ */ React.createElement("b", null, r.ver), /* @__PURE__ */ React.createElement("span", { className: "pill " + (r.now ? "active" : "done") }, r.now ? t.thisWeek : t.shipped), /* @__PURE__ */ React.createElement("span", { className: "muted" }, VI ? VI.relWhen[r.ver] || r.when : r.when)), /* @__PURE__ */ React.createElement("div", { className: "rel-sec" }, /* @__PURE__ */ React.createElement("h4", null, VI ? VI.relTitles[r.ver] || r.title : r.title), /* @__PURE__ */ React.createElement("ul", null, (VI ? VI.relItems[r.ver] || r.items : r.items).map((it, i) => /* @__PURE__ */ React.createElement("li", { key: i }, it)))))))), /* @__PURE__ */ React.createElement("p", { className: "ft" }, lang === "vi" ? /* @__PURE__ */ React.createElement(React.Fragment, null, "CyberSkill Status Hub \u2014 b\u1EA3n t\xE1i hi\u1EC7n UI kit c\u1EE7a design system. D\u1EF1ng tr\xEAn token ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, "styles.css"), ". Turn Your Will Into Real.") : /* @__PURE__ */ React.createElement(React.Fragment, null, "CyberSkill Status Hub \u2014 a design-system UI kit recreation. Built on ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, "styles.css"), " tokens. Turn Your Will Into Real."))), /* @__PURE__ */ React.createElement(Drawer, { p: sel && loc(sel), onClose: () => setSel(null), t }));
  }
  window.StatusHub = StatusHub;
})();
