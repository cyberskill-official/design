import React from "react";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
import { useViewportPanel } from "../_utils/use-viewport-panel.js";

/** CyberSkill NavigationMenu — site nav; entries are links or open a rich panel of links. */
export function NavigationMenu({ items = [], className }) {
  const [open, setOpen] = React.useState(null);
  const wrap = React.useRef(null);
  const popup = React.useRef(null);
  useViewportPanel(popup, open != null, open);
  const { scope } = useOverlayLayer({ open: open != null, kind: "dropdown", panelRef: wrap, onEscape: () => setOpen(null) });
  React.useEffect(() => {
    if (open == null) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  return (
    <overlayScopeContext.Provider value={scope}>
    <nav ref={wrap} className={cx("cs-navmenu", className)}>
      {items.map((it, i) => it.panel ? (
        <span key={i} className="cs-navmenu__wrap">
          <button type="button" className={cx("cs-navmenu__top", open === i && "is-open")} aria-expanded={open === i} aria-haspopup="true"
            onClick={() => setOpen(open === i ? null : i)} onMouseEnter={() => { if (open != null && open !== i) setOpen(i); }}>{it.label} <span aria-hidden="true">▾</span></button>
          {open === i ? (
            <span ref={popup} className="cs-navmenu__panel">
              {it.panel.map((p, j) => (
                <a key={j} href={p.href || "#"} className="cs-navmenu__card" onClick={() => setOpen(null)}>
                  <b>{p.label}</b>
                  {(p.desc || p.desc === 0) ? <small>{p.desc}</small> : null}
                </a>
              ))}
            </span>
          ) : null}
        </span>
      ) : (
        <a key={i} href={it.href || "#"} className="cs-navmenu__top">{it.label}</a>
      ))}
    </nav>
    </overlayScopeContext.Provider>
  );
}
