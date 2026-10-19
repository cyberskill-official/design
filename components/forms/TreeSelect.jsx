import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Tree } from "../data/Tree.jsx";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill TreeSelect — field opening a Tree; picking a node sets the value. */
export function TreeSelect({ nodes = [], value, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className }) {
  const [requestedOpen, setOpen] = React.useState(false);
  // Disable the mounted surface immediately and discard its previous open state.
  const open = requestedOpen && !disabled;
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("TreeSelect", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const find = (ns) => { for (const n of ns) { if (n.key === value) return n; const c = n.children && find(n.children); if (c) return c; } return null; };
  const sel = find(nodes);
  const { scope } = useOverlayLayer({ open, kind: "popover", panelRef: wrap, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-treeselect", className)}>
      <button type="button" className="cs-treeselect__field" disabled={disabled} aria-haspopup="tree" aria-expanded={open} aria-label={label} aria-labelledby={ariaLabelledBy} onClick={() => setOpen((o) => !o)}>
        <span className={sel ? undefined : "ph"}>{sel ? sel.label : ph}</span><span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="cs-treeselect__pop">
          <Tree aria-label={label || (ariaLabelledBy ? undefined : ph)} aria-labelledby={ariaLabelledBy} nodes={nodes} selected={value} defaultOpen lang={L} onSelect={(k, n) => { if (!(n.children && n.children.length)) { onChange && onChange(k, n); setOpen(false); } }} />
        </div>
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
}
