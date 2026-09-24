import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Menubar — app-style horizontal menu bar. menus: [{label, items:[{label,onSelect,danger}|"-"]}]. */
export const Menubar = React.forwardRef(function Menubar({ menus = [], className }, forwardedRef) {
  const [open, setOpen] = React.useState(null);
  const [focusI, setFocusI] = React.useState(0);
  const wrap = React.useRef(null);
  const btns = React.useRef([]);
  React.useEffect(() => {
    if (open == null) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(null); };
    const k = (e) => { if (e.key === "Escape") { const i = open; setOpen(null); const b = btns.current[i]; if (b) b.focus(); } };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  const nav = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % menus.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + menus.length) % menus.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = menus.length - 1;
    else if (e.key === "ArrowDown") { e.preventDefault(); setOpen(i); return; }
    if (n == null) return;
    e.preventDefault(); setFocusI(n); if (open != null) setOpen(n);
    const b = btns.current[n]; if (b) b.focus();
  };
  return (
    <div ref={wrap} className={cx("cs-menubar", className)} role="menubar">
      {menus.map((m, i) => (
        <span key={i} className="cs-menubar__wrap">
          <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open === i} tabIndex={i === focusI ? 0 : -1}
            ref={(el) => (btns.current[i] = el)} onKeyDown={(e) => nav(e, i)} onFocus={() => setFocusI(i)}
            className={cx("cs-menubar__top", open === i && "is-open")}
            onClick={() => setOpen(open === i ? null : i)} onMouseEnter={() => { if (open != null && open !== i) setOpen(i); }}>{m.label}</button>
          {open === i ? (
            <span className="cs-menu__list" role="menu">
              {m.items.map((it, j) => it === "-"
                ? <span key={j} className="cs-menu__sep" />
                : <button key={j} type="button" role="menuitem" className={cx("cs-menu__item", it.danger && "cs-menu__item--danger")} onClick={() => { setOpen(null); it.onSelect && it.onSelect(); }}>{it.label}</button>)}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
});
