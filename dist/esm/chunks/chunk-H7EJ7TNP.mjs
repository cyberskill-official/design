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

// components/forms/Combobox.jsx
import React from "react";
var Combobox = React.forwardRef(function Combobox2({ portal = true, placement, controlRef, options = [], value, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, rootProps, controlProps, description, error, required = false }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [requestedOpen, setOpen] = React.useState(false);
  const open = requestedOpen && !disabled;
  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  const [q, setQ] = React.useState("");
  const [hl, setHl] = React.useState(0);
  const id = React.useId();
  const wrapRef = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrapRef, ref, forwardedRef);
  const t = makeT("Combobox", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const sel = options.find((o) => o.value === value) || null;
  const needle = q.trim().toLowerCase();
  const shown = needle ? options.filter((o) => String(o.label).toLowerCase().includes(needle)) : options;
  const floating = useFloatingPanel({ open, anchorRef: wrapRef, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: () => wrapRef.current?.querySelector(":scope > input"), matchWidth: true, lang });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, restoreFocus: false, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (!floating.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  const pick = (o) => {
    onChange && onChange(o.value);
    setQ("");
    setOpen(false);
  };
  const key = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHl((h) => shown.length ? Math.min(shown.length - 1, h + 1) : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHl((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      if (open && shown[hl]) {
        e.preventDefault();
        pick(shown[hl]);
      }
    }
  };
  const control = useFieldAssociation(mergeTargetProps({
    role: "combobox",
    "aria-expanded": open,
    "aria-controls": open ? id : void 0,
    "aria-autocomplete": "list",
    "aria-label": label,
    "aria-labelledby": ariaLabelledBy,
    "aria-activedescendant": open && shown[hl] ? id + "-" + hl : void 0,
    disabled,
    placeholder: ph,
    value: open ? q : sel ? sel.label : q,
    onClick: () => {
      if (!disabled) setOpen(true);
    },
    onFocus: () => {
      setOpen(true);
      setHl(0);
    },
    onChange: (e) => {
      setQ(e.target.value);
      setOpen(true);
      setHl(0);
    },
    onKeyDown: key
  }, controlProps, ["type", "role", "value", "defaultValue", "onChange", "disabled", "name", "required", "aria-haspopup", "aria-expanded", "aria-controls", "aria-autocomplete", "aria-activedescendant"]), { fallbackLabel: t("label"), requiredSupported: true, description, error, required });
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: mergedNativeRef,
      ...mergeTargetProps({ className: cx("cs-combobox", className), onBlur: (e) => {
        if (!floating.contains(e.relatedTarget)) setOpen(false);
      } }, rootProps)
    },
    /* @__PURE__ */ React.createElement("input", { ...control, ref: mergedControlRef }),
    fieldMessages(control, description, error),
    /* @__PURE__ */ React.createElement("span", { className: "cs-combobox__caret", "aria-hidden": "true" }, "▾"),
    open ? floating.render(/* @__PURE__ */ React.createElement("div", { ref: floatingRef, className: "cs-combobox__popup" }, /* @__PURE__ */ React.createElement("ul", { className: "cs-combobox__list", role: "listbox", id, "aria-label": label || (ariaLabelledBy ? void 0 : t("label")), "aria-labelledby": control["aria-labelledby"] }, shown.map((o, i) => /* @__PURE__ */ React.createElement(
      "li",
      {
        key: o.value,
        id: id + "-" + i,
        role: "option",
        "aria-selected": o.value === value,
        className: cx("cs-combobox__opt", i === hl && "hl"),
        onMouseEnter: () => setHl(i),
        onMouseDown: (e) => {
          e.preventDefault();
          pick(o);
        }
      },
      o.label
    ))), !shown.length ? /* @__PURE__ */ React.createElement("div", { role: "status", className: "cs-combobox__empty" }, t("empty")) : null)) : null
  ));
});
Combobox.displayName = "Combobox";

export {
  Combobox
};
//# sourceMappingURL=chunk-H7EJ7TNP.mjs.map
