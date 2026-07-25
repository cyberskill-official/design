import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Cascader — column-per-level picker for hierarchies (province → district style). */
export function Cascader({ nodes = [], value = [], onChange, placeholder, label, disabled = false, lang, className }) {
  const [open, setOpen] = React.useState(false);
  const [path, setPath] = React.useState(value);
  const wrap = React.useRef(null);
  const fieldId = React.useId();
  const [ref, L] = useLang(lang);
  const t = makeT("Cascader", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  React.useEffect(() => { setPath(value); }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  const cols = [];
  let level = nodes;
  for (let i = 0; level && level.length; i++) {
    cols.push(level);
    const pick = level.find((n) => n.key === path[i]);
    level = pick && pick.children;
  }
  const labels = [];
  { let lv = nodes; for (const k of value) { const n = (lv || []).find((x) => x.key === k); if (!n) break; labels.push(n.label); lv = n.children; } }
  return (
    <div ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-cascader", className)}>
      <button type="button" id={fieldId} className="cs-treeselect__field" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}>
        <span className={labels.length ? undefined : "ph"}>{labels.length ? labels.join(" / ") : ph}</span><span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="cs-cascader__pop">
          {cols.map((col, i) => (
            <ul key={i} role="listbox" aria-labelledby={fieldId} className="cs-cascader__col">
              {col.map((n) => (
                // role="none" — the <li> wrapper must not sit between listbox and option.
                <li key={n.key} role="none">
                  <button type="button" role="option" aria-selected={path[i] === n.key} className={cx("cs-cascader__opt", path[i] === n.key && "on")}
                    onClick={() => {
                      const next = [...path.slice(0, i), n.key];
                      setPath(next);
                      if (!(n.children && n.children.length)) { onChange && onChange(next); setOpen(false); }
                    }}>
                    {n.label}{n.children && n.children.length ? <span aria-hidden="true"> ›</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ) : null}
    </div>
  );
}
