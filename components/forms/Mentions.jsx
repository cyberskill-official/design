import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

let mentionsUid = 0;

/** CyberSkill Mentions — textarea that suggests @users while typing (APG editable combobox). */
export function Mentions({ value, defaultValue = "", onChange, users = [], placeholder, rows = 3, lang, className }) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const set = (v) => { if (value == null) setInner(v); onChange && onChange(v); };
  const [q, setQ] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [listId] = React.useState(() => "cs-mentions-" + (++mentionsUid));
  const [ref, L] = useLang(lang);
  const t = makeT("Mentions", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const hits = q == null ? [] : users.filter((u) => u.toLowerCase().includes(q)).slice(0, 6);
  const open = hits.length > 0;

  React.useEffect(() => {
    setActiveIndex((i) => (hits.length ? Math.min(i, hits.length - 1) : 0));
  }, [q, users]);

  const onInput = (v) => {
    set(v);
    const m = /(^|\s)@(\w*)$/.exec(v);
    const next = m ? m[2].toLowerCase() : null;
    setQ(next);
    if (next != null) setActiveIndex(0);
  };
  const pick = (u) => { set(val.replace(/(^|\s)@\w*$/, "$1@" + u + " ")); setQ(null); };
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
    } else if (e.key === "Escape") {
      e.preventDefault();
      setQ(null);
    }
  };
  return (
    <span ref={ref} className={cx("cs-mentions", className)}>
      <textarea
        className="cs-field__control"
        rows={rows}
        value={val}
        placeholder={ph}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && hits[activeIndex] ? optionId(activeIndex) : undefined}
        onChange={(e) => onInput(e.target.value)}
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
  );
}
