import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";

import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
const SWATCHES = ["#F4BA17", "#C77B4A", "#E0632B", "#C43D1F", "#7A9B57", "#3E5A2E", "#4E8E9B", "#2E5E7E", "#BFB29B", "#45210E"];

/** CyberSkill ColorPicker — curated brand swatches + custom hex input. */
export const ColorPicker = React.forwardRef(function ColorPicker({ portal = true, placement, controlRef, value = "#F4BA17", onChange, swatches = SWATCHES, label, "aria-labelledby": ariaLabelledBy, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState(value);
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("ColorPicker", L, localeMessages);
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : undefined;
  const control = useFieldAssociation({ id: controlProps?.id ?? id,
    "aria-label": controlProps?.["aria-label"] ?? (controlProps?.["aria-labelledby"] || ariaLabelledBy ? undefined : (label ? label + ": " + value : undefined)),
    "aria-labelledby": controlProps?.["aria-labelledby"] ?? ariaLabelledBy,
    "aria-describedby": controlProps?.["aria-describedby"], "aria-invalid": controlProps?.["aria-invalid"] },
    { fallbackLabel: (label || t("label")) + ": " + value, description, error, requiredDescription });
  React.useEffect(() => setHex(value), [value]);
  const floating = useFloatingPanel({ open: open, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: ()=>wrap.current?.querySelector(":scope > button"), lang });
  const { scope } = useOverlayLayer({ open: (open) && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (!floating.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  const commit = (v) => { if (/^#[0-9a-fA-F]{6}$/.test(v)) { onChange && onChange(v); } };
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={mergedNativeRef} {...mergeTargetProps({ className: cx("cs-colorpicker", className) }, rootProps)}>
      <button {...mergeTargetProps({ ...control, type: "button", className: "cs-colorpicker__field", "aria-expanded": open, onClick: () => setOpen(o => !o) }, controlProps, ["id", "role", "type", "name", "value", "defaultValue", "disabled", "required", "aria-required", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-haspopup", "aria-expanded", "aria-controls", "aria-activedescendant"])} ref={mergedControlRef} >
        <i style={{ background: value }} /><code>{value}</code>
      </button>
      {open ? (
        floating.render(<span ref={floatingRef} className="cs-colorpicker__pop" role="dialog" aria-label={control["aria-labelledby"] ? undefined : (controlProps?.["aria-label"] || label || t("label"))} aria-labelledby={control["aria-labelledby"]}>
          <span className="cs-colorpicker__grid">
            {swatches.map((s) => (
              <button key={s} type="button" aria-label={s} aria-pressed={s.toLowerCase() === String(value).toLowerCase()} style={{ background: s }} className={s.toLowerCase() === String(value).toLowerCase() ? "on" : undefined}
                onClick={() => { onChange && onChange(s); setOpen(false); }} />
            ))}
          </span>
          <span className="cs-colorpicker__hex">
            <input value={hex} aria-label={t("hex")} onChange={(e) => setHex(e.target.value)}
              onKeyDown={(e) => { if (e.nativeEvent.isComposing || e.keyCode === 229) return; if (e.key === "Enter") { e.preventDefault(); commit(hex); setOpen(false); } }} onBlur={() => commit(hex)} />
          </span>
        </span>)
      ) : null}
      {fieldMessages(control, description, error, requiredDescription)}
    </span>
    </overlayScopeContext.Provider>
  );
});
ColorPicker.displayName = "ColorPicker";
