"use client";
import {
  Calendar
} from "./chunk-FEUTSZBN.mjs";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  formatDate,
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  fieldMessages,
  mergeTargetProps,
  useFieldAssociation
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/DatePicker.jsx
import React from "react";
var CAL_ICON = /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M8 3v4M16 3v4M3 10h18" }));
var DatePicker = React.forwardRef(function DatePicker2({ portal = true, placement, controlRef, value, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, rootProps, controlProps, description, error, required = false }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [requestedOpen, setOpen] = React.useState(false);
  const open = requestedOpen && !disabled;
  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  const wrap = React.useRef(null);
  const popup = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("DatePicker", L, localeMessages);
  const hasValue = Boolean(value) || value === 0;
  const ph = placeholder != null ? placeholder : t("placeholder");
  const dialogLabel = label?.trim() || placeholder?.trim() || t("placeholder");
  const floating = useFloatingPanel({ open, anchorRef: wrap, panelRef: popup, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: () => wrap.current?.querySelector(":scope > button"), lang });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "popover", panelRef: popup, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open || !floating.ready) return;
    const day = popup.current?.querySelector('[data-day][aria-pressed="true"]') || popup.current?.querySelector('[data-day][aria-current="date"]') || popup.current?.querySelector("button[data-day]");
    day?.focus();
    const d = (e) => {
      if (!floating.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", d);
    return () => {
      document.removeEventListener("mousedown", d);
    };
  }, [open, floating.ready, floating.surfaceKey]);
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : void 0;
  const control = useFieldAssociation(mergeTargetProps({
    type: "button",
    className: "cs-datepicker__field",
    disabled,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-label": label,
    "aria-labelledby": ariaLabelledBy,
    onClick: (event) => {
      if (!open) event.currentTarget.focus();
      setOpen((o) => !o);
    }
  }, controlProps, ["role", "aria-required", "type", "disabled", "name", "value", "aria-haspopup", "aria-expanded", "aria-controls"]), { description, error, requiredDescription });
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ className: cx("cs-datepicker", className) }, rootProps) }, /* @__PURE__ */ React.createElement("button", { ...control, ref: mergedControlRef }, CAL_ICON, /* @__PURE__ */ React.createElement("span", { className: hasValue ? void 0 : "ph" }, hasValue ? formatDate(value, L) : ph)), fieldMessages(control, description, error, requiredDescription), open ? floating.render(/* @__PURE__ */ React.createElement("div", { ref: popup, className: "cs-datepicker__pop", role: "dialog", "aria-label": label?.trim() ? dialogLabel : ariaLabelledBy ? void 0 : dialogLabel, "aria-labelledby": control["aria-labelledby"] }, /* @__PURE__ */ React.createElement(Calendar, { value, lang: L, onChange: (d) => {
    onChange && onChange(d);
    setOpen(false);
  } }))) : null));
});
DatePicker.displayName = "DatePicker";

export {
  DatePicker
};
//# sourceMappingURL=chunk-37AN57S5.mjs.map
