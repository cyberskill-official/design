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
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/overlays/Popconfirm.jsx
import React from "react";
var Popconfirm = React.forwardRef(function Popconfirm2({ portal = true, placement, trigger, title, onConfirm, onCancel, okLabel, cancelLabel, lang, className, rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(floatingRef, forwardedRef);
  const [open, setOpen] = React.useState(false);
  const titleId = React.useId();
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Popconfirm", L, localeMessages);
  const floating = useFloatingPanel({ open, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 8, getAnchor: () => wrap.current?.querySelector('[aria-haspopup="dialog"]'), lang });
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
  const toggle = (event) => {
    if (!open) event.currentTarget.focus();
    setOpen((o) => !o);
  };
  const triggerNode = React.isValidElement(trigger) ? React.cloneElement(trigger, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onClick: (e) => {
      if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
      if (!e.defaultPrevented) toggle(e);
    }
  }) : /* @__PURE__ */ React.createElement("button", { type: "button", "aria-haspopup": "dialog", "aria-expanded": open, onClick: toggle }, trigger);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("span", { ref: (el) => {
    wrap.current = el;
    ref.current = el;
  }, ...mergeTargetProps({ "className": cx("cs-popconfirm", className) }, rootProps, []) }, triggerNode, open ? floating.render(/* @__PURE__ */ React.createElement("span", { className: "cs-popconfirm__panel", role: "alertdialog", "aria-labelledby": titleId, ref: mergedNativeRef }, /* @__PURE__ */ React.createElement("span", { id: titleId, className: "cs-popconfirm__title" }, title), /* @__PURE__ */ React.createElement("span", { className: "cs-popconfirm__actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--ghost cs-button--xs", onClick: () => {
    setOpen(false);
    onCancel && onCancel();
  } }, cancelLabel != null ? cancelLabel : t("cancel")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--primary cs-button--xs", onClick: () => {
    setOpen(false);
    onConfirm && onConfirm();
  } }, okLabel != null ? okLabel : t("ok"))))) : null));
});
Popconfirm.displayName = "Popconfirm";

export {
  Popconfirm
};
//# sourceMappingURL=chunk-FAVSLU7E.mjs.map
