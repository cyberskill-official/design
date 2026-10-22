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

// components/overlays/Popover.jsx
import React from "react";
var Popover = React.forwardRef(function Popover2({ portal = true, placement, trigger, children, align = "start", open: controlled, onOpenChange, className, rootProps, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(floatingRef, forwardedRef);
  const [u, setU] = React.useState(false);
  const open = controlled != null ? controlled : u;
  const set = (v) => {
    if (controlled == null) setU(v);
    onOpenChange?.(v);
  };
  const [ref, L, localeMessages] = useLang();
  const t = makeT("Popover", L, localeMessages);
  const floating = useFloatingPanel({ open, anchorRef: ref, panelRef: floatingRef, portal, placement: placement ?? (align === "end" ? "bottom-end" : "bottom-start"), gap: 8, getAnchor: () => ref.current?.querySelector('[aria-haspopup="dialog"]') });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => set(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (!floating.contains(e.target)) set(false);
    };
    document.addEventListener("mousedown", d);
    return () => {
      document.removeEventListener("mousedown", d);
    };
  }, [open]);
  const toggle = (event) => {
    if (!open) event.currentTarget.focus();
    set(!open);
  };
  const triggerNode = React.isValidElement(trigger) ? React.cloneElement(trigger, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onClick: (e) => {
      if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
      if (!e.defaultPrevented) toggle(e);
    }
  }) : /* @__PURE__ */ React.createElement("button", { type: "button", "aria-haspopup": "dialog", "aria-expanded": open, onClick: toggle }, trigger);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("span", { ...mergeTargetProps({ className: cx("cs-popover", className) }, rootProps), ref }, triggerNode, open ? floating.render(/* @__PURE__ */ React.createElement("div", { className: cx("cs-popover__panel", align === "end" && "cs-popover__panel--end"), role: "dialog", "aria-label": ariaLabel ?? (ariaLabelledBy ? void 0 : t("panel")), "aria-labelledby": ariaLabelledBy, ref: mergedNativeRef }, children)) : null));
});
Popover.displayName = "Popover";

export {
  Popover
};
//# sourceMappingURL=chunk-BABSYWVB.mjs.map
