import { mergeRefs } from "../_utils/merge-refs.js";
import { reduceListbox } from "../_utils/roving.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
let cbUid = 0;

/** CyberSkill Combobox — filterable single-select (input + listbox, ARIA combobox pattern). Controlled value/onChange. */
export const Combobox = React.forwardRef(function Combobox({ options = [], value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
  const [box, setBox] = React.useState({ open: false, activeIndex: 0 });
  const open = box.open;
  const hl = box.activeIndex;
  const [q, setQ] = React.useState("");
  const [id] = React.useState(() => "cs-cb-" + (++cbUid));
  const wrapRef = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Combobox", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const sel = options.find((o) => o.value === value) || null;
  const needle = q.trim().toLowerCase();
  const shown = needle ? options.filter((o) => String(o.label).toLowerCase().includes(needle)) : options;
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setBox((s) => reduceListbox(s, { type: "close" })); };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  const pick = (o) => { onChange && onChange(o.value); setQ(""); setBox((s) => reduceListbox(s, { type: "close" })); };
  const key = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setBox((s) => reduceListbox(s, { type: "move", delta: 1, max: shown.length })); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setBox((s) => reduceListbox(s, { type: "move", delta: -1, max: shown.length })); }
    else if (e.key === "Enter") { if (open && shown[hl]) { e.preventDefault(); pick(shown[hl]); } }
    else if (e.key === "Escape") { setBox((s) => reduceListbox(s, { type: "close" })); }
  };
  return (
    <div ref={mergeRefs(wrapRef, ref, forwardedRef)} className={cx("cs-combobox", className)}>
      <input role="combobox" aria-expanded={open} aria-controls={id} aria-autocomplete="list" aria-label={label}
        aria-activedescendant={open && shown[hl] ? id + "-" + hl : undefined}
        disabled={disabled} placeholder={ph} value={open ? q : (sel ? sel.label : q)}
        onFocus={() => { setBox((s) => reduceListbox(s, { type: "open", index: 0 })); }} onChange={(e) => { setQ(e.target.value); setBox((s) => reduceListbox(s, { type: "open", index: 0 })); }} onKeyDown={key} />
      <span className="cs-combobox__caret" aria-hidden="true">▾</span>
      {open ? (
        <ul className="cs-combobox__list" role="listbox" id={id}>
          {shown.length ? shown.map((o, i) => (
            <li key={o.value} id={id + "-" + i} role="option" aria-selected={o.value === value} className={cx("cs-combobox__opt", i === hl && "hl")}
              onMouseEnter={() => setBox((s) => reduceListbox(s, { type: "open", index: i }))} onMouseDown={(e) => { e.preventDefault(); pick(o); }}>{o.label}</li>
          )) : <li className="cs-combobox__empty">{t("empty")}</li>}
        </ul>
      ) : null}
    </div>
  );
});
