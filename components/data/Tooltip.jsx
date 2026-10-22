import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";

/** Tooltip describes one focusable trigger; rich interactive content belongs in HoverCard. */
export const Tooltip = React.forwardRef(function Tooltip({ portal = true, placement, label, children, lang, className, rootProps }, forwardedRef) {
  const bubbleRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(bubbleRef, forwardedRef);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Tooltip", L, localeMessages);
  const id = React.useId();
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const open = (hovered || focused) && !dismissed;
  const floating = useFloatingPanel({ open: open, anchorRef: ref, panelRef: bubbleRef, portal, placement: placement ?? "top", gap: 8, scroll: false, getAnchor: ()=>ref.current?.firstElementChild, lang });
  const { scope } = useOverlayLayer({ open: (open) && floating.ready, kind: "popover", panelRef: bubbleRef, surfaceKey: floating.surfaceKey, restoreFocus: false, onEscape: () => setDismissed(true) });
  const child = React.isValidElement(children) && children.type !== React.Fragment
    ? React.cloneElement(children, { "aria-describedby": [children.props["aria-describedby"], id].filter(Boolean).join(" ") })
    : <span tabIndex={0} aria-describedby={id}>{children}</span>;
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={ref} {...mergeTargetProps({
      className: cx("cs-tooltip", className),
      onMouseEnter: () => { setHovered(true); setDismissed(false); },
      onMouseLeave: () => setHovered(false),
      onFocus: () => { setFocused(true); setDismissed(false); },
      onBlur: (e) => { if (!floating.contains(e.relatedTarget)) setFocused(false); },
    }, rootProps, ["data-managed", "data-open"])} data-managed="" data-open={open ? "true" : "false"}>
      {child}
      {floating.render(<span id={id} className="cs-tooltip__bubble" role="tooltip" hidden={!open} ref={mergedNativeRef} >{label ?? t("label")}</span>)}
    </span>
    </overlayScopeContext.Provider>
  );
});
Tooltip.displayName = "Tooltip";
