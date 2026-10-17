import React from "react";
import { useClientLayoutEffect } from "../_utils/use-client-layout-effect.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill Menubar — app-style horizontal menu bar. menus: [{label, items:[{label,onSelect,danger}|"-"]}]. */
export function Menubar({ menus = [], className }) {
  const [open, setOpen] = React.useState(null);
  const [focusI, setFocusI] = React.useState(0);
  const wrap = React.useRef(null);
  const id = React.useId();
  const itemFocus = React.useRef(null);
  const menuRefs = React.useRef([]);
  useClientLayoutEffect(() => {
    if (open == null || itemFocus.current == null) return;
    const items = menuRefs.current[open]?.querySelectorAll('[role="menuitem"]');
    const target = itemFocus.current; itemFocus.current = null;
    (target === -1 ? items?.[items.length - 1] : items?.[0])?.focus();
  }, [open]);
  const btns = React.useRef([]);
  const { scope } = useOverlayLayer({ open: open != null, kind: "dropdown", panelRef: wrap, restoreFocus: false, onEscape: () => { setOpen(null); btns.current[open]?.focus(); } });
  React.useEffect(() => {
    if (open == null) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  const nav = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % menus.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + menus.length) % menus.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = menus.length - 1;
    else if (["ArrowDown", "ArrowUp"].includes(e.key)) { e.preventDefault(); itemFocus.current = e.key === "ArrowUp" ? -1 : 0; if (open === i) { const items = menuRefs.current[i]?.querySelectorAll('[role="menuitem"]'); (itemFocus.current === -1 ? items?.[items.length - 1] : items?.[0])?.focus(); itemFocus.current = null; } else setOpen(i); return; }
    if (n == null) return;
    e.preventDefault(); setFocusI(n); if (open != null) setOpen(n);
    const b = btns.current[n]; if (b) b.focus();
  };
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={wrap} className={cx("cs-menubar", className)} role="menubar">
      {menus.map((m, i) => (
        <span key={i} className="cs-menubar__wrap">
          <button id={`${id}-top-${i}`} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open === i} tabIndex={i === focusI ? 0 : -1}
            ref={(el) => (btns.current[i] = el)} onKeyDown={(e) => nav(e, i)} onFocus={() => setFocusI(i)}
            className={cx("cs-menubar__top", open === i && "is-open")}
            onClick={() => setOpen(open === i ? null : i)} onMouseEnter={() => { if (open != null && open !== i) setOpen(i); }}>{m.label}</button>
          {open === i ? (
            <span className="cs-menu__list" role="menu" aria-labelledby={`${id}-top-${i}`} ref={el => { menuRefs.current[i] = el; }} onKeyDown={e => {
              const items = [...e.currentTarget.querySelectorAll('[role="menuitem"]')];
              const current = items.indexOf(document.activeElement);
              let next;
              if (e.key === "ArrowDown") next = (current + 1) % items.length;
              else if (e.key === "ArrowUp") next = (current - 1 + items.length) % items.length;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = items.length - 1;
              else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault(); const target = (i + (e.key === "ArrowRight" ? 1 : -1) + menus.length) % menus.length;
                itemFocus.current = 0; setFocusI(target); setOpen(target); return;
              } else if (e.key === "Tab") { setOpen(null); btns.current[i]?.focus(); return; }
              else return;
              e.preventDefault(); items[next]?.focus();
            }}>
              {m.items.map((it, j) => it === "-"
                ? <span key={j} className="cs-menu__sep" role="separator" />
                : <button key={j} type="button" role="menuitem" className={cx("cs-menu__item", it.danger && "cs-menu__item--danger")} onClick={() => { setOpen(null); btns.current[i]?.focus(); it.onSelect && it.onSelect(); }}>{it.label}</button>)}
            </span>
          ) : null}
        </span>
      ))}
    </div>
    </overlayScopeContext.Provider>
  );
}
