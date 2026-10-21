"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
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

// components/forms/ColorPicker.jsx
import React from "react";
var SWATCHES = ["#F4BA17", "#C77B4A", "#E0632B", "#C43D1F", "#7A9B57", "#3E5A2E", "#4E8E9B", "#2E5E7E", "#BFB29B", "#45210E"];
var ColorPicker = React.forwardRef(function ColorPicker2({ portal = true, placement, controlRef, value = "#F4BA17", onChange, swatches = SWATCHES, label, "aria-labelledby": ariaLabelledBy, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState(value);
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("ColorPicker", L, localeMessages);
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : void 0;
  const control = useFieldAssociation(
    {
      id: controlProps?.id ?? id,
      "aria-label": controlProps?.["aria-label"] ?? (controlProps?.["aria-labelledby"] || ariaLabelledBy ? void 0 : label ? label + ": " + value : void 0),
      "aria-labelledby": controlProps?.["aria-labelledby"] ?? ariaLabelledBy,
      "aria-describedby": controlProps?.["aria-describedby"],
      "aria-invalid": controlProps?.["aria-invalid"]
    },
    { fallbackLabel: (label || t("label")) + ": " + value, description, error, requiredDescription }
  );
  React.useEffect(() => setHex(value), [value]);
  const floating = useFloatingPanel({ open, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: () => wrap.current?.querySelector(":scope > button"), lang });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (!floating.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", d);
    return () => {
      document.removeEventListener("mousedown", d);
    };
  }, [open]);
  const commit = (v) => {
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange && onChange(v);
    }
  };
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("span", { ref: mergedNativeRef, ...mergeTargetProps({ className: cx("cs-colorpicker", className) }, rootProps) }, /* @__PURE__ */ React.createElement("button", { ...mergeTargetProps({ ...control, type: "button", className: "cs-colorpicker__field", "aria-expanded": open, onClick: () => setOpen((o) => !o) }, controlProps, ["id", "role", "type", "name", "value", "defaultValue", "disabled", "required", "aria-required", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-haspopup", "aria-expanded", "aria-controls", "aria-activedescendant"]), ref: mergedControlRef }, /* @__PURE__ */ React.createElement("i", { style: { background: value } }), /* @__PURE__ */ React.createElement("code", null, value)), open ? floating.render(/* @__PURE__ */ React.createElement("span", { ref: floatingRef, className: "cs-colorpicker__pop", role: "dialog", "aria-label": control["aria-labelledby"] ? void 0 : controlProps?.["aria-label"] || label || t("label"), "aria-labelledby": control["aria-labelledby"] }, /* @__PURE__ */ React.createElement("span", { className: "cs-colorpicker__grid" }, swatches.map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s,
      type: "button",
      "aria-label": s,
      "aria-pressed": s.toLowerCase() === String(value).toLowerCase(),
      style: { background: s },
      className: s.toLowerCase() === String(value).toLowerCase() ? "on" : void 0,
      onClick: () => {
        onChange && onChange(s);
        setOpen(false);
      }
    }
  ))), /* @__PURE__ */ React.createElement("span", { className: "cs-colorpicker__hex" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: hex,
      "aria-label": t("hex"),
      onChange: (e) => setHex(e.target.value),
      onKeyDown: (e) => {
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        if (e.key === "Enter") {
          e.preventDefault();
          commit(hex);
          setOpen(false);
        }
      },
      onBlur: () => commit(hex)
    }
  )))) : null, fieldMessages(control, description, error, requiredDescription)));
});
ColorPicker.displayName = "ColorPicker";

export {
  ColorPicker
};
//# sourceMappingURL=chunk-7HTAAMIY.mjs.map
