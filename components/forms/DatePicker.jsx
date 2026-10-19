import React from "react";
import { makeT, useLang, formatDate } from "../_i18n/i18n.js";
import { Calendar } from "./Calendar.jsx";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
import { useViewportPanel } from "../_utils/use-viewport-panel.js";
const CAL_ICON = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>;

/** CyberSkill DatePicker — field + popover Calendar. VN shows DD/MM/YYYY. Controlled value (Date)/onChange. */
export function DatePicker({ value, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className }) {
  const [requestedOpen, setOpen] = React.useState(false);
  // Disable the mounted surface immediately and discard its previous open state.
  const open = requestedOpen && !disabled;
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const wrap = React.useRef(null);
  const popup = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("DatePicker", L);
  const hasValue = Boolean(value) || value === 0;
  const ph = placeholder != null ? placeholder : t("placeholder");
  const dialogLabel = label?.trim() || placeholder?.trim() || t("placeholder");
  const { scope } = useOverlayLayer({ open, kind: "popover", panelRef: wrap, onEscape: () => setOpen(false) });
  useViewportPanel(popup, open);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-datepicker", className)}>
      <button type="button" className="cs-datepicker__field" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-label={label} aria-labelledby={ariaLabelledBy} onClick={() => setOpen((o) => !o)}>
        {CAL_ICON}
        <span className={hasValue ? undefined : "ph"}>{hasValue ? formatDate(value, L) : ph}</span>
      </button>
      {open ? (
        <div ref={popup} className="cs-datepicker__pop" role="dialog" aria-label={label?.trim() ? dialogLabel : (ariaLabelledBy ? undefined : dialogLabel)} aria-labelledby={ariaLabelledBy}>
          <Calendar value={value} lang={L} onChange={(d) => { onChange && onChange(d); setOpen(false); }} />
        </div>
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
}
