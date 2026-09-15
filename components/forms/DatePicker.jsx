import React from "react";
import { makeT, useLang, formatDate } from "../_i18n/i18n.js";
import { Calendar } from "./Calendar.jsx";
import { cx } from "../_utils/cx.js";
const CAL_ICON = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>;

/** CyberSkill DatePicker — field + popover Calendar. VN shows DD/MM/YYYY. Controlled value (Date)/onChange. */
export const DatePicker = React.forwardRef(function DatePicker({ value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("DatePicker", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  return (
    <div ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-datepicker", className)}>
      <button type="button" className="cs-datepicker__field" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}>
        {CAL_ICON}
        <span className={value ? undefined : "ph"}>{value ? formatDate(value, L) : ph}</span>
      </button>
      {open ? (
        <div className="cs-datepicker__pop" role="dialog">
          <Calendar value={value} lang={L} onChange={(d) => { onChange && onChange(d); setOpen(false); }} />
        </div>
      ) : null}
    </div>
  );
});
