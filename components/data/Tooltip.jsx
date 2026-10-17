import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";

/** Tooltip describes one focusable trigger; rich interactive content belongs in HoverCard. */
export function Tooltip({ label, children, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Tooltip", L);
  const id = React.useId();
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const open = (hovered || focused) && !dismissed;
  const { scope } = useOverlayLayer({ open, kind: "popover", panelRef: ref, restoreFocus: false, onEscape: () => setDismissed(true) });
  const child = React.isValidElement(children) && children.type !== React.Fragment
    ? React.cloneElement(children, { "aria-describedby": [children.props["aria-describedby"], id].filter(Boolean).join(" ") })
    : <span tabIndex={0} aria-describedby={id}>{children}</span>;
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={ref} className={cx("cs-tooltip", className)} data-managed="" data-open={open ? "true" : "false"}
      onMouseEnter={() => { setHovered(true); setDismissed(false); }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => { setFocused(true); setDismissed(false); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      {child}
      <span id={id} className="cs-tooltip__bubble" role="tooltip" hidden={!open}>{label ?? t("label")}</span>
    </span>
    </overlayScopeContext.Provider>
  );
}
