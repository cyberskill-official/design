import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill FloatingActionButton — round primary action; optional speed-dial actions. */
export const FloatingActionButton = React.forwardRef(function FloatingActionButton({ portal = true, placement, controlRef, icon, label, actions = [], onClick, position = "fixed", className , rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [open, setOpen] = React.useState(false);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const floating = useFloatingPanel({ open: open && actions.length > 0, anchorRef: panel, panelRef: floatingRef, portal, placement: placement ?? "top-end", gap: 10, tabOrder: "before", getAnchor: ()=>panel.current?.querySelector(".cs-fab__main") });
  const { scope } = useOverlayLayer({ open: (open && actions.length > 0) && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  const main = () => { if (actions.length) setOpen((o) => !o); else onClick && onClick(); };
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-fab", position === "static" && "cs-fab--static", className) }, rootProps, [])}>
      {open && actions.length ? (
        floating.render(<div ref={floatingRef} className={cx("cs-fab__dial", position === "static" && "cs-fab__dial--static")}>
          {actions.map((a, i) => (
            <button key={i} type="button" className="cs-fab__mini" aria-label={a.label} title={a.label} onClick={() => { setOpen(false); a.onSelect && a.onSelect(); }}>{a.icon}</button>
          ))}
        </div>)
      ) : null}
      <button type="button" className="cs-fab__main" aria-label={label} aria-expanded={actions.length ? open : undefined} onClick={main} ref={mergedControlRef} >{icon}</button>
    </div>
    </overlayScopeContext.Provider>
  );
});
FloatingActionButton.displayName = "FloatingActionButton";
