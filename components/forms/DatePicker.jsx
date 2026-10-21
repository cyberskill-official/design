import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang, formatDate } from "../_i18n/i18n.js";
import { Calendar } from "./Calendar.jsx";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";
const CAL_ICON = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>;

/** CyberSkill DatePicker — field + popover Calendar. VN shows DD/MM/YYYY. Controlled value (Date)/onChange. */
export const DatePicker = React.forwardRef(function DatePicker({ portal = true, placement, controlRef, value, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, rootProps, controlProps, description, error, required = false }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [requestedOpen, setOpen] = React.useState(false);
  // Disable the mounted surface immediately and discard its previous open state.
  const open = requestedOpen && !disabled;
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const wrap = React.useRef(null);
  const popup = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("DatePicker", L, localeMessages);
  const hasValue = Boolean(value) || value === 0;
  const ph = placeholder != null ? placeholder : t("placeholder");
  const dialogLabel = label?.trim() || placeholder?.trim() || t("placeholder");
  const floating = useFloatingPanel({ open: open, anchorRef: wrap, panelRef: popup, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: ()=>wrap.current?.querySelector(":scope > button"), lang });
  const { scope } = useOverlayLayer({ open: (open) && floating.ready, kind: "popover", panelRef: popup, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open || !floating.ready) return;
    const day = popup.current?.querySelector('[data-day][aria-pressed="true"]')
      || popup.current?.querySelector('[data-day][aria-current="date"]')
      || popup.current?.querySelector("button[data-day]");
    day?.focus();
    const d = (e) => { if (!floating.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open, floating.ready, floating.surfaceKey]);
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : undefined;
  const control = useFieldAssociation(mergeTargetProps({ type: "button", className: "cs-datepicker__field", disabled,
    "aria-haspopup": "dialog", "aria-expanded": open, "aria-label": label, "aria-labelledby": ariaLabelledBy,
    onClick: event => { if (!open) event.currentTarget.focus(); setOpen(o => !o); },
  }, controlProps, ["role", "aria-required", "type", "disabled", "name", "value", "aria-haspopup", "aria-expanded", "aria-controls"]), { description, error, requiredDescription });
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={mergedNativeRef} {...mergeTargetProps({ className: cx("cs-datepicker", className) }, rootProps)}>
      <button {...control} ref={mergedControlRef} >
        {CAL_ICON}
        <span className={hasValue ? undefined : "ph"}>{hasValue ? formatDate(value, L) : ph}</span>
      </button>
      {fieldMessages(control, description, error, requiredDescription)}
      {open ? (
        floating.render(<div ref={popup} className="cs-datepicker__pop" role="dialog" aria-label={label?.trim() ? dialogLabel : (ariaLabelledBy ? undefined : dialogLabel)} aria-labelledby={control["aria-labelledby"]}>
          <Calendar value={value} lang={L} onChange={(d) => { onChange && onChange(d); setOpen(false); }} />
        </div>)
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
});
DatePicker.displayName = "DatePicker";
