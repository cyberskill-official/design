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

// components/data/Tooltip.jsx
import React from "react";
var Tooltip = React.forwardRef(function Tooltip2({ portal = true, placement, label, children, lang, className, rootProps }, forwardedRef) {
  const bubbleRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(bubbleRef, forwardedRef);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Tooltip", L, localeMessages);
  const id = React.useId();
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const open = (hovered || focused) && !dismissed;
  const floating = useFloatingPanel({ open, anchorRef: ref, panelRef: bubbleRef, portal, placement: placement ?? "top", gap: 8, scroll: false, getAnchor: () => ref.current?.firstElementChild, lang });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "popover", panelRef: bubbleRef, surfaceKey: floating.surfaceKey, restoreFocus: false, onEscape: () => setDismissed(true) });
  const child = React.isValidElement(children) && children.type !== React.Fragment ? React.cloneElement(children, { "aria-describedby": [children.props["aria-describedby"], id].filter(Boolean).join(" ") }) : /* @__PURE__ */ React.createElement("span", { tabIndex: 0, "aria-describedby": id }, children);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("span", { ref, ...mergeTargetProps({
    className: cx("cs-tooltip", className),
    onMouseEnter: () => {
      setHovered(true);
      setDismissed(false);
    },
    onMouseLeave: () => setHovered(false),
    onFocus: () => {
      setFocused(true);
      setDismissed(false);
    },
    onBlur: (e) => {
      if (!floating.contains(e.relatedTarget)) setFocused(false);
    }
  }, rootProps, ["data-managed", "data-open"]), "data-managed": "", "data-open": open ? "true" : "false" }, child, floating.render(/* @__PURE__ */ React.createElement("span", { id, className: "cs-tooltip__bubble", role: "tooltip", hidden: !open, ref: mergedNativeRef }, label ?? t("label")))));
});
Tooltip.displayName = "Tooltip";

export {
  Tooltip
};
//# sourceMappingURL=chunk-JDI3UMJW.mjs.map
