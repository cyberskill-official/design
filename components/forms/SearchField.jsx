import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill SearchField — pill search input with icon + clear. Controlled or uncontrolled. */
// `children` is destructured but never rendered on purpose: keeps stray children out of {...props} → void <input>.
export function SearchField({ value, defaultValue = "", onChange, onClear, disabled = false, readOnly = false, placeholder, lang, className, children, ...props }) {
  const [inner, setInner] = React.useState(() => defaultValue == null ? "" : String(defaultValue));
  const val = value != null ? value : inner;
  const set = (v) => { if (disabled || readOnly) return; if (value == null) setInner(v); onChange?.(v); };
  const [ref, L] = useLang(lang);
  const t = makeT("SearchField", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  return (
    <div ref={ref} className={cx("cs-search", className)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
      <input {...props} type="text" role="searchbox" value={val} disabled={disabled} readOnly={readOnly} placeholder={ph} onChange={(e) => set(e.target.value)} />
      {String(val).length ? (
        <button type="button" className="cs-search__clear" aria-label={t("clear")} disabled={disabled || readOnly} onClick={() => { if (disabled || readOnly) return; set(""); onClear && onClear(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      ) : null}
    </div>
  );
}
