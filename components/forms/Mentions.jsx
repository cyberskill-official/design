import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill Mentions — textarea that suggests @users while typing (APG editable combobox). */
export function Mentions({ value, defaultValue = "", onChange, users = [], placeholder, rows = 3, lang, className, "aria-label": ariaLabel }) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const set = (v) => { if (value == null) setInner(v); onChange && onChange(v); };
  const [q, setQ] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const caretRef = React.useRef(null);
  const listId = React.useId();
  const [ref, L] = useLang(lang);
  const t = makeT("Mentions", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const hits = q == null ? [] : users.filter((u) => u.toLowerCase().includes(q)).slice(0, 6);
  const open = hits.length > 0;

  const { scope } = useOverlayLayer({ open, kind: "dropdown", panelRef: ref, restoreFocus: false, onEscape: () => setQ(null) });
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setQ(null); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  React.useEffect(() => {
    setActiveIndex((i) => (hits.length ? Math.min(i, hits.length - 1) : 0));
  }, [q, users]);

  const onInput = (e) => {
    const v = e.target.value;
    set(v);
    const caret = typeof e.target.selectionStart === "number" ? e.target.selectionStart : v.length;
    caretRef.current = caret;
    const head = v.slice(0, caret);
    const m = /(^|\s)@(\w*)$/.exec(head);
    const next = m ? m[2].toLowerCase() : null;
    setQ(next);
    if (next != null) setActiveIndex(0);
  };
  const pick = (u) => {
    const caret = typeof caretRef.current === "number" ? caretRef.current : val.length;
    const head = val.slice(0, caret);
    const tail = val.slice(caret);
    set(head.replace(/(^|\s)@\w*$/, "$1@" + u + " ") + tail);
    setQ(null);
  };
  const optionId = (i) => listId + "-opt-" + i;
  const onKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(hits.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      if (hits[activeIndex]) { e.preventDefault(); pick(hits[activeIndex]); }
    }
  };
  return (
    <overlayScopeContext.Provider value={scope}>
    <span
      ref={ref}
      className={cx("cs-mentions", className)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setQ(null); }}
    >
      <textarea
        className="cs-field__control"
        rows={rows}
        value={val}
        placeholder={ph}
        aria-label={ariaLabel || ph}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && hits[activeIndex] ? optionId(activeIndex) : undefined}
        onChange={onInput}
        onKeyDown={onKeyDown}
      />
      {open ? (
        <span className="cs-mentions__pop" role="listbox" id={listId}>
          {hits.map((u, i) => (
            <button
              key={u}
              type="button"
              id={optionId(i)}
              role="option"
              aria-selected={i === activeIndex}
              className={cx(i === activeIndex && "hl")}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(u); }}
            >@{u}</button>
          ))}
        </span>
      ) : null}
    </span>
    </overlayScopeContext.Provider>
  );
}
