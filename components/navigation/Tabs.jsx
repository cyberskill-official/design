import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Tabs — data-driven tablist, controlled by value/onChange. Ochre underline on active. */
export function Tabs({ tabs = [], value, onChange, lang, className, "aria-label": ariaLabel, ...props }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Tabs", L);
  const refs = React.useRef([]);
  const idx = Math.max(0, tabs.findIndex((tab) => tab.value === value));
  const key = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    if (onChange) onChange(tabs[n].value);
    const b = refs.current[n]; if (b) b.focus();
  };
  return (
    <div ref={ref} role="tablist" aria-label={ariaLabel ?? t("list")} className={cx("cs-tabs", className)} {...props}>
      {tabs.map((t, i) => (
        <button key={t.value} type="button" role="tab" aria-selected={value === t.value} tabIndex={i === idx ? 0 : -1}
          ref={(el) => (refs.current[i] = el)} onKeyDown={(e) => key(e, i)}
          className="cs-tab" onClick={() => onChange && onChange(t.value)}>
          {t.label}
          {t.count != null ? <span className="cs-tab__count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

/** A single tab button, for hand-composed tablists. */
export function Tab({ selected = false, count, children, className, ...props }) {
  return (
    <button type="button" role="tab" aria-selected={selected} className={cx("cs-tab", className)} {...props}>
      {children}
      {count != null ? <span className="cs-tab__count">{count}</span> : null}
    </button>
  );
}
