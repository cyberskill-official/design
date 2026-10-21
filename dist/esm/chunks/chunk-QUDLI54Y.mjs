"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/button/FloatingActionButton.jsx
import React from "react";
var FloatingActionButton = React.forwardRef(function FloatingActionButton2({ portal = true, placement, controlRef, icon, label, actions = [], onClick, position = "fixed", className, rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [open, setOpen] = React.useState(false);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const floating = useFloatingPanel({ open: open && actions.length > 0, anchorRef: panel, panelRef: floatingRef, portal, placement: placement ?? "top-end", gap: 10, tabOrder: "before", getAnchor: () => panel.current?.querySelector(".cs-fab__main") });
  const { scope } = useOverlayLayer({ open: open && actions.length > 0 && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  const main = () => {
    if (actions.length) setOpen((o) => !o);
    else onClick && onClick();
  };
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-fab", position === "static" && "cs-fab--static", className) }, rootProps, []) }, open && actions.length ? floating.render(/* @__PURE__ */ React.createElement("div", { ref: floatingRef, className: cx("cs-fab__dial", position === "static" && "cs-fab__dial--static") }, actions.map((a, i) => /* @__PURE__ */ React.createElement("button", { key: i, type: "button", className: "cs-fab__mini", "aria-label": a.label, title: a.label, onClick: () => {
    setOpen(false);
    a.onSelect && a.onSelect();
  } }, a.icon)))) : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-fab__main", "aria-label": label, "aria-expanded": actions.length ? open : void 0, onClick: main, ref: mergedControlRef }, icon)));
});
FloatingActionButton.displayName = "FloatingActionButton";

export {
  FloatingActionButton
};
//# sourceMappingURL=chunk-QUDLI54Y.mjs.map
