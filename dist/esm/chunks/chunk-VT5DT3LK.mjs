"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
import {
  focusableSelector,
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

// components/overlays/HoverCard.jsx
import React from "react";
var HoverCard = React.forwardRef(function HoverCard2({ portal = true, placement, trigger, children, openDelay = 150, closeDelay = 200, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(floatingRef, forwardedRef);
  const [open, setOpen] = React.useState(false);
  const panel = React.useRef(null);
  const timer = React.useRef();
  const hovered = React.useRef(false);
  const focused = React.useRef(false);
  const triggerFocus = React.useRef(null);
  const sync = () => {
    clearTimeout(timer.current);
    const next = hovered.current || focused.current;
    timer.current = setTimeout(() => setOpen(next), next ? openDelay : closeDelay);
  };
  const dismiss = () => {
    clearTimeout(timer.current);
    const content = floatingRef.current;
    if (content?.contains(document.activeElement)) {
      const targets = [...panel.current.querySelectorAll(focusableSelector)].filter((el) => !content.contains(el) && el.tabIndex >= 0 && !el.disabled && !el.closest('[inert], [hidden], [aria-hidden="true"]') && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden");
      const target = targets.includes(triggerFocus.current) ? triggerFocus.current : targets[0];
      target?.focus();
    }
    clearTimeout(timer.current);
    setOpen(false);
  };
  const floating = useFloatingPanel({ open, anchorRef: panel, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 8, getAnchor: () => panel.current?.firstElementChild });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, restoreFocus: false, onEscape: dismiss });
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement(
    "span",
    {
      ref: panel,
      ...mergeTargetProps({ "className": cx("cs-hovercard", className), "onMouseEnter": () => {
        hovered.current = true;
        sync();
      }, "onMouseLeave": () => {
        hovered.current = false;
        if (!focused.current) sync();
      }, "onFocus": (e) => {
        if (!floatingRef.current?.contains(e.target)) triggerFocus.current = e.target;
        if (!floating.contains(e.relatedTarget)) {
          focused.current = true;
          sync();
        }
      }, "onBlur": (e) => {
        if (!floating.contains(e.relatedTarget)) {
          focused.current = false;
          if (!hovered.current) sync();
        }
      } }, rootProps, [])
    },
    trigger,
    open ? floating.render(/* @__PURE__ */ React.createElement("span", { className: "cs-hovercard__panel", role: "dialog", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ref: mergedNativeRef }, children)) : null
  ));
});
HoverCard.displayName = "HoverCard";

export {
  HoverCard
};
//# sourceMappingURL=chunk-VT5DT3LK.mjs.map
