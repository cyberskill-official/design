import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Tabs — data-driven tablist, controlled by value/onChange. Ochre underline on active. */
export const Tabs = React.forwardRef(function Tabs({ tabs = [], value, onChange, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Tabs", L, localeMessages);
  const refs = React.useRef([]);
  const idx = Math.max(0, tabs.findIndex((tab) => tab.value === value));
  const vertical = props["aria-orientation"] === "vertical";
  const key = (e, i) => {
    let n = null;
    if (e.key === (vertical ? "ArrowDown" : "ArrowRight")) n = (i + 1) % tabs.length;
    else if (e.key === (vertical ? "ArrowUp" : "ArrowLeft")) n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    if (onChange) onChange(tabs[n].value);
    const b = refs.current[n]; if (b) b.focus();
  };
  return (
    <div ref={mergedNativeRef} role="tablist" aria-label={ariaLabel ?? t("list")} className={cx("cs-tabs", className)} {...props}>
      {tabs.map((t, i) => (
        <button key={t.value} type="button" role="tab" id={t.id} aria-controls={t["aria-controls"]} aria-selected={value === t.value} tabIndex={i === idx ? 0 : -1}
          ref={(el) => (refs.current[i] = el)} onKeyDown={(e) => key(e, i)}
          className="cs-tab" onClick={() => onChange && onChange(t.value)}>
          {t.label}
          {t.count != null ? <span className="cs-tab__count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
});
Tabs.displayName = "Tabs";

/** A single tab button, for hand-composed tablists. */
export const Tab = React.forwardRef(function Tab({ selected = false, count, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return (
    <button type="button" role="tab" aria-selected={selected} className={cx("cs-tab", className)} {...props} ref={mergedNativeRef} >
      {children}
      {count != null ? <span className="cs-tab__count">{count}</span> : null}
    </button>
  );
});
Tab.displayName = "Tab";
