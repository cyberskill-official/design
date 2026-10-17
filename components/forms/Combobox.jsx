import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill Combobox — filterable single-select (input + listbox, ARIA combobox pattern). Controlled value/onChange. */
export function Combobox({ options = [], value, onChange, placeholder, label, disabled = false, lang, className }) {
  const [requestedOpen, setOpen] = React.useState(false);
  // Disable the mounted surface immediately and discard its previous open state.
  const open = requestedOpen && !disabled;
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const [q, setQ] = React.useState("");
  const [hl, setHl] = React.useState(0);
  const id = React.useId();
  const wrapRef = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Combobox", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const sel = options.find((o) => o.value === value) || null;
  const needle = q.trim().toLowerCase();
  const shown = needle ? options.filter((o) => String(o.label).toLowerCase().includes(needle)) : options;
  const { scope } = useOverlayLayer({ open, kind: "dropdown", panelRef: wrapRef, restoreFocus: false, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  const pick = (o) => { onChange && onChange(o.value); setQ(""); setOpen(false); };
  const key = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHl((h) => Math.min(shown.length - 1, h + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHl((h) => Math.max(0, h - 1)); }
    else if (e.key === "Enter") { if (open && shown[hl]) { e.preventDefault(); pick(shown[hl]); } }
  };
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={(el) => { wrapRef.current = el; ref.current = el; }} className={cx("cs-combobox", className)}>
      <input role="combobox" aria-expanded={open} aria-controls={id} aria-autocomplete="list" aria-label={label}
        aria-activedescendant={open && shown[hl] ? id + "-" + hl : undefined}
        disabled={disabled} placeholder={ph} value={open ? q : (sel ? sel.label : q)}
        onClick={() => { if (!disabled) setOpen(true); }}
        onFocus={() => { setOpen(true); setHl(0); }} onChange={(e) => { setQ(e.target.value); setOpen(true); setHl(0); }} onKeyDown={key} />
      <span className="cs-combobox__caret" aria-hidden="true">▾</span>
      {open ? (
        <ul className="cs-combobox__list" role="listbox" id={id}>
          {shown.length ? shown.map((o, i) => (
            <li key={o.value} id={id + "-" + i} role="option" aria-selected={o.value === value} className={cx("cs-combobox__opt", i === hl && "hl")}
              onMouseEnter={() => setHl(i)} onMouseDown={(e) => { e.preventDefault(); pick(o); }}>{o.label}</li>
          )) : <li className="cs-combobox__empty">{t("empty")}</li>}
        </ul>
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
}
