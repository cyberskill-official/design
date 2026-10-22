import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill AIDisclosureBadge — a pill that discloses AI involvement and, when
 * expanded, explains what was generated and lists sources. Never decorative:
 * this is an explainability affordance (info-blue), not a style flourish.
 * The caller owns accurate disclosure and sources; the UI does not detect AI
 * involvement, verify provenance or establish human approval.
 */
export const AIDisclosureBadge = React.forwardRef(function AIDisclosureBadge({ portal = true, placement, controlRef,
  label,
  details,
  lang,
  sources = [],
  className,
 rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("AIDisclosureBadge", L, localeMessages);
  const [open, setOpen] = React.useState(false);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, ref, forwardedRef);
  const floating = useFloatingPanel({ open: open, anchorRef: panel, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 8, getAnchor: ()=>panel.current?.querySelector(".cs-ai-disclosure__badge"), lang });
  const { scope } = useOverlayLayer({ open: (open) && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  const panelId = React.useId();
  const sourceList = (sources || []).filter(Boolean);
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-ai-disclosure", className) }, rootProps, [])}>
      <button
        type="button"
        className="cs-ai-disclosure__badge"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
       ref={mergedControlRef} >
        {label ?? t("label")}
      </button>
      {open ? (
        floating.render(<span ref={floatingRef} id={panelId} role="status" className="cs-ai-disclosure__panel">
          <span className="cs-ai-disclosure__details">{details ?? t("details")}</span>
          {sourceList.length ? (
            <span className="cs-ai-disclosure__sources">{t("sources")}: {sourceList.join(", ")}</span>
          ) : null}
        </span>)
      ) : null}
    </span>
    </overlayScopeContext.Provider>
  );
});
AIDisclosureBadge.displayName = "AIDisclosureBadge";
