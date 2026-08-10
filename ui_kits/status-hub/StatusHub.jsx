const { useState, useMemo } = React;

const ICON = {
  search: "M11 4a7 7 0 1 0 4.2 12.6L20 21l1.4-1.4-4.4-4.4A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z",
  close: "M6 6l12 12M18 6L6 18",
  sun: null, moon: null,
};
function Glyph({ d, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
function SearchGlyph() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={ICON.search} /></svg>;
}
function ThemeGlyph({ dark }) {
  return dark
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z"/></svg>;
}

/* Bilingual UI copy — kit fully EN⇄VN (owner decision, Jul 2026).
 * Mock-data VN variants live in data.js (window.SH_VI). */
const T = {
  en: {
    sub: "CyberSkill · one page, three lenses · Hiện Thực Hoá Ý Chí",
    updated: "Updated", portfolio: "Portfolio",
    projects: "Projects", inprog: "In progress", shipped: "Shipped", blocked: "Blocked", planned: "Planned", avg: "Avg progress",
    velocity: "Velocity · tasks shipped / week", perShipped: " shipped",
    nowTitle: "Now shipping",
    search: "Search projects…", view: "View", lenses: { board: "Board", table: "Table", releases: "Releases" },
    status: "Status", all: "All", of: "of",
    key: "Key", project: "Project", squad: "Squad", owner: "Owner", progress: "Progress",
    thisWeek: "This week", tasks: "Tasks", risk: "Risk", close: "Close",
    langBtn: "VN", theme: "Toggle theme",
  },
  vi: {
    sub: "CyberSkill · một trang, ba lăng kính · Hiện Thực Hoá Ý Chí",
    updated: "Cập nhật", portfolio: "Danh mục",
    projects: "Dự án", inprog: "Đang làm", shipped: "Đã ra mắt", blocked: "Bị chặn", planned: "Dự kiến", avg: "Tiến độ TB",
    velocity: "Tốc độ · task giao / tuần", perShipped: " đã giao",
    nowTitle: "Đang ra mắt",
    search: "Tìm dự án…", view: "Chế độ xem", lenses: { board: "Bảng công việc", table: "Bảng dữ liệu", releases: "Phát hành" },
    status: "Trạng thái", all: "Tất cả", of: "trên",
    key: "Mã", project: "Dự án", squad: "Nhóm", owner: "Phụ trách", progress: "Tiến độ",
    thisWeek: "Tuần này", tasks: "Công việc", risk: "Rủi ro", close: "Đóng",
    langBtn: "EN", theme: "Đổi giao diện",
  },
};
const statusLabels = (t) => ({ done: t.shipped, active: t.inprog, hold: t.blocked, todo: t.planned });

function Segments({ seg, className }) {
  return (
    <div className={className}>
      {seg.done > 0 && <i className="seg-done" style={{ width: seg.done + "%" }} />}
      {seg.active > 0 && <i className="seg-active" style={{ width: seg.active + "%" }} />}
      {seg.hold > 0 && <i className="seg-hold" style={{ width: seg.hold + "%" }} />}
      {seg.todo > 0 && <i className="seg-todo" style={{ width: seg.todo + "%" }} />}
    </div>
  );
}

function Drawer({ p, onClose, t }) {
  if (!p) return null;
  const SL = statusLabels(t);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={p.name}>
        <div className="dw-h">
          <div className="row">
            <span className="mono muted" style={{ fontWeight: 700 }}>{p.key}</span>
            <span className={"pill " + p.status}>{SL[p.status]}</span>
            <button className="dw-x" onClick={onClose} aria-label={t.close}><Glyph d={ICON.close} size={20} /></button>
          </div>
          <h2>{p.name}</h2>
        </div>
        <div className="dw-b">
          <p className="muted" style={{ marginTop: 0 }}>{p.blurb}</p>
          <dl className="meta">
            <div><dt>{t.owner}</dt><dd>{p.owner}</dd></div>
            <div><dt>{t.squad}</dt><dd>{p.squad}</dd></div>
            <div><dt>{t.progress}</dt><dd>{p.pct}%</dd></div>
            <div><dt>{t.updated}</dt><dd>{p.updated}</dd></div>
          </dl>
          <Segments seg={p.seg} className="minibar" />
          <div className="sect">
            <h3>{t.tasks}</h3>
            <div className="task-chips">
              {p.tasks.map((tk) => <span key={tk[0]} className={"chip " + tk[2]} title={tk[1]}>{tk[0]}</span>)}
            </div>
            <ul className="tasks">{p.tasks.map((tk) => <li key={tk[0]}>{tk[1]} — <span className="muted">{SL[tk[2]]}</span></li>)}</ul>
          </div>
          {p.risk ? <div className="sect"><h3>{t.risk}</h3><div className="risk">{p.risk}</div></div> : null}
        </div>
      </aside>
    </>
  );
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
  const VI = lang === "vi" ? (window.SH_VI || null) : null;
  const loc = (p) => VI ? { ...p,
    blurb: VI.blurbs[p.key] || p.blurb,
    risk: (VI.risks[p.key] != null ? VI.risks[p.key] : p.risk),
    owner: VI.owners[p.owner] || p.owner,
    squad: VI.squads[p.squad] || p.squad,
    updated: VI.updatedRel[p.updated] || p.updated,
  } : p;

  const counts = useMemo(() => {
    const c = { active: 0, done: 0, hold: 0 };
    D.projects.forEach((p) => { if (c[p.status] != null) c[p.status]++; });
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
  const toggleKpi = (k) => setKpi((cur) => (cur === k ? null : k));

  return (
    <div className="sh" lang={lang} data-theme={dark ? "dark" : undefined}>
      <a className="cs-skip" href="#main" style={{ position: "absolute", left: -999, width: 1, height: 1, overflow: "hidden" }}>{lang === "vi" ? "Bỏ qua đến nội dung" : "Skip to content"}</a>
      <header className="hd">
        <div className="hd-in">
          <div className="hd-id">
            <span className="hd-mark"><img src="../../assets/logo-mark.svg" alt="" /></span>
            <div>
              <h1>Status Hub</h1>
              <p className="hd-sub">{t.sub}</p>
            </div>
          </div>
          <div className="hd-side">
            <p className="hd-meta">{t.updated}<br />{VI ? VI.updated : D.updated}</p>
            <button className="btn ghost" onClick={() => setLang((l) => l === "en" ? "vi" : "en")} aria-label="Toggle language" style={{ fontWeight: 700, fontSize: 13 }}>{t.langBtn}</button>
            <button className="btn ghost" onClick={() => setDark((v) => !v)} aria-label={t.theme}><ThemeGlyph dark={dark} /></button>
          </div>
        </div>
      </header>

      <main id="main" className="wrap">
        <div className="deck">
          <section className="panel">
            <h2>{t.portfolio}</h2>
            <div className="kpis">
              <button className="kpi" data-on={kpi === null ? "1" : "0"} onClick={() => setKpi(null)}><b>{counts.total}</b><span>{t.projects}</span></button>
              <button className="kpi" data-on={kpi === "active" ? "1" : "0"} onClick={() => toggleKpi("active")}><b>{counts.active}</b><span>{t.inprog}</span></button>
              <button className="kpi" data-on={kpi === "done" ? "1" : "0"} onClick={() => toggleKpi("done")}><b>{counts.done}</b><span>{t.shipped}</span></button>
              <button className="kpi" data-on={kpi === "hold" ? "1" : "0"} onClick={() => toggleKpi("hold")}><b>{counts.hold}</b><span>{t.blocked}</span></button>
              <button className="kpi" onClick={() => setKpi(null)}><b>{counts.avg}%</b><span>{t.avg}</span></button>
            </div>
            <Segments seg={{ done: 60, active: 22, hold: 6, todo: 12 }} className="bar-seg" />
            <div className="legend">
              <span><i className="dot" style={{ background: "var(--cs-color-semantic-success)" }} />{t.shipped}</span>
              <span><i className="dot" style={{ background: "var(--cs-color-brand-ochre)" }} />{t.inprog}</span>
              <span><i className="dot" style={{ background: "var(--cs-color-semantic-danger)" }} />{t.blocked}</span>
              <span><i className="dot" style={{ background: "var(--cs-status-todo)" }} />{t.planned}</span>
            </div>
          </section>
          <section className="panel">
            <h2>{t.velocity}</h2>
            <div className="spark">
              {D.velocity.map((v) => (
                <a key={v.wk} title={v.n + t.perShipped}><b>{v.n}</b><i style={{ height: (v.n / maxV) * 72 + "px" }} /><span>{v.wk}</span></a>
              ))}
            </div>
          </section>
        </div>

        <div className="now">
          <h2>{t.nowTitle}</h2>
          {lang === "vi"
            ? <p><b>v1.6.0 — Liên kết Glass + gói Ngũ Hành v2.</b> Liên kết component <span className="mono">.cs-surface-*</span> (tùy chọn), trình kiểm 0 cảnh báo trên cả 15 gói, và kiểm tra lại APCA cho chế độ tối. Ra mắt tuần này.</p>
            : <p><b>v1.6.0 — Glass bindings + element-pack v2.</b> Opt-in <span className="mono">.cs-surface-*</span> component bindings, a zero-warning verifier across all 15 packs, and a dark-mode APCA re-check. Ships this week.</p>}
        </div>

        <div className="bar">
          <div className="bar-top">
            <label className="srch"><SearchGlyph /><input placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} /></label>
            <div
              className="lenses"
              role="tablist"
              aria-label={t.view}
              onKeyDown={(e) => {
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
              }}
            >
              {["board", "table", "releases"].map((l) => (
                <button
                  key={l}
                  className="ln"
                  role="tab"
                  aria-selected={lens === l}
                  tabIndex={lens === l ? 0 : -1}
                  onClick={() => setLens(l)}
                >{t.lenses[l]}</button>
              ))}
            </div>
            <label className="facet">{t.status}
              <select value={kpi || facet} onChange={(e) => { setFacet(e.target.value); setKpi(null); }}>
                <option value="all">{t.all}</option><option value="active">{t.inprog}</option>
                <option value="done">{t.shipped}</option><option value="hold">{t.blocked}</option>
              </select>
            </label>
            <span className="cnt">{shown.length} {t.of} {D.projects.length}</span>
          </div>
        </div>

        {lens === "board" && (
          <div className="grid">
            {shown.map((p0) => { const p = loc(p0); return (
              <button className={"card" + (p.status === "active" ? " hot" : "")} key={p.key} onClick={() => setSel(p0)}>
                <div className="card-h"><h3><span className="k mono">{p.key}</span> · {p.name}</h3><span className="pct">{p.pct}%</span></div>
                <p>{p.blurb}</p>
                <Segments seg={p.seg} className="minibar" />
                <div className="task-chips">
                  <span className={"pill " + p.status}>{SL[p.status]}</span>
                  {p.tasks.slice(0, 3).map((tk) => <span key={tk[0]} className={"chip " + tk[2]}>{tk[0]}</span>)}
                </div>
              </button>
            ); })}
          </div>
        )}

        {lens === "table" && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>{t.key}</th><th>{t.project}</th><th>{t.squad}</th><th>{t.owner}</th><th>{t.progress}</th><th>{t.status}</th></tr></thead>
              <tbody>
                {shown.map((p0) => { const p = loc(p0); return (
                  <tr key={p.key} onClick={() => setSel(p0)}>
                    <td className="mono" style={{ fontWeight: 700 }}>{p.key}</td>
                    <td>{p.name}</td><td>{p.squad}</td><td>{p.owner}</td><td>{p.pct}%</td>
                    <td><span className={"pill " + p.status}>{SL[p.status]}</span></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}

        {lens === "releases" && (
          <div className="rels">
            {D.releases.map((r) => (
              <div className={"rel" + (r.now ? " now" : "")} key={r.ver}>
                <div className="tick">{r.done ? "✓" : "→"}</div>
                <div>
                  <div className="rel-h"><b>{r.ver}</b><span className={"pill " + (r.now ? "active" : "done")}>{r.now ? t.thisWeek : t.shipped}</span><span className="muted">{VI ? (VI.relWhen[r.ver] || r.when) : r.when}</span></div>
                  <div className="rel-sec"><h4>{VI ? (VI.relTitles[r.ver] || r.title) : r.title}</h4><ul>{(VI ? (VI.relItems[r.ver] || r.items) : r.items).map((it, i) => <li key={i}>{it}</li>)}</ul></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="ft">{lang === "vi"
          ? <>CyberSkill Status Hub — bản tái hiện UI kit của design system. Dựng trên token <span className="mono">styles.css</span>. Turn Your Will Into Real.</>
          : <>CyberSkill Status Hub — a design-system UI kit recreation. Built on <span className="mono">styles.css</span> tokens. Turn Your Will Into Real.</>}</p>
      </main>

      <Drawer p={sel && loc(sel)} onClose={() => setSel(null)} t={t} />
    </div>
  );
}

window.StatusHub = StatusHub;
