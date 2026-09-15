import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill NavigationMenu — site nav; entries are links or open a rich panel of links. */
export const NavigationMenu = React.forwardRef(function NavigationMenu({ items = [], className }, forwardedRef) {
  const [open, setOpen] = React.useState(null);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    if (open == null) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(null); };
    const k = (e) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  return (
    <nav ref={wrap} className={cx("cs-navmenu", className)}>
      {items.map((it, i) => it.panel ? (
        <span key={i} className="cs-navmenu__wrap">
          <button type="button" className={cx("cs-navmenu__top", open === i && "is-open")} aria-expanded={open === i} aria-haspopup="true"
            onClick={() => setOpen(open === i ? null : i)} onMouseEnter={() => { if (open != null && open !== i) setOpen(i); }}>{it.label} <span aria-hidden="true">▾</span></button>
          {open === i ? (
            <span className="cs-navmenu__panel">
              {it.panel.map((p, j) => (
                <a key={j} href={p.href || "#"} className="cs-navmenu__card" onClick={() => setOpen(null)}>
                  <b>{p.label}</b>
                  {p.desc ? <small>{p.desc}</small> : null}
                </a>
              ))}
            </span>
          ) : null}
        </span>
      ) : (
        <a key={i} href={it.href || "#"} className="cs-navmenu__top">{it.label}</a>
      ))}
    </nav>
  );
});
