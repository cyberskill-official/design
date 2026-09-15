import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Tree } from "../data/Tree.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill TreeSelect — field opening a Tree; picking a node sets the value. */
export const TreeSelect = React.forwardRef(function TreeSelect({ nodes = [], value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("TreeSelect", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const find = (ns) => { for (const n of ns) { if (n.key === value) return n; const c = n.children && find(n.children); if (c) return c; } return null; };
  const sel = find(nodes);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  return (
    <div ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-treeselect", className)}>
      <button type="button" className="cs-treeselect__field" disabled={disabled} aria-haspopup="tree" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}>
        <span className={sel ? undefined : "ph"}>{sel ? sel.label : ph}</span><span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="cs-treeselect__pop">
          <Tree nodes={nodes} selected={value} defaultOpen lang={L} onSelect={(k, n) => { if (!(n.children && n.children.length)) { onChange && onChange(k, n); setOpen(false); } }} />
        </div>
      ) : null}
    </div>
  );
});
