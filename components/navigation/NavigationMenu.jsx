import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill NavigationMenu — site nav; entries are links or open a rich panel of links. */
export const NavigationMenu = React.forwardRef(function NavigationMenu({ portal = true, placement, items = [], className, ...props }, forwardedRef) {
  const [open, setOpen] = React.useState(null);
  const wrap = React.useRef(null);
  const mergedNativeRef = useComposedRefs(wrap, forwardedRef);
  const popup = React.useRef(null);
  const floating = useFloatingPanel({ open: open != null, anchorRef: wrap, panelRef: popup, portal, placement: placement ?? "bottom-start", gap: 8, getAnchor: ()=>wrap.current?.querySelector('button[aria-expanded="true"]'), getInlineParent: ()=>wrap.current?.querySelector('button[aria-expanded="true"]')?.parentElement, identity: open });
  const { scope } = useOverlayLayer({ open: (open != null) && floating.ready, kind: "dropdown", panelRef: popup, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(null) });
  React.useEffect(() => {
    if (open == null) return;
    const d = (e) => { if (!floating.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  return (
    <overlayScopeContext.Provider value={scope}>
    <nav ref={mergedNativeRef} className={cx("cs-navmenu", className)} {...props}>
      {items.map((it, i) => it.panel ? (
        <span key={i} className="cs-navmenu__wrap">
          <button type="button" className={cx("cs-navmenu__top", open === i && "is-open")} aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)} onMouseEnter={() => { if (open != null && open !== i) setOpen(i); }}>{it.label} <span aria-hidden="true">▾</span></button>
          {open === i ? (
            floating.render(<span ref={popup} className="cs-navmenu__panel">
              {it.panel.map((p, j) => (
                <a key={j} href={p.href || "#"} className="cs-navmenu__card" onClick={() => setOpen(null)}>
                  <b>{p.label}</b>
                  {(p.desc || p.desc === 0) ? <small>{p.desc}</small> : null}
                </a>
              ))}
            </span>)
          ) : null}
        </span>
      ) : (
        <a key={i} href={it.href || "#"} className="cs-navmenu__top">{it.label}</a>
      ))}
    </nav>
    </overlayScopeContext.Provider>
  );
});
NavigationMenu.displayName = "NavigationMenu";
