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
export function AIDisclosureBadge({
  label,
  details,
  lang,
  sources = [],
  className,
}) {
  const [ref, L] = useLang(lang);
  const t = makeT("AIDisclosureBadge", L);
  const [open, setOpen] = React.useState(false);
  const panel = React.useRef(null);
  const { scope } = useOverlayLayer({ open: open, kind: "popover", panelRef: panel, onEscape: () => setOpen(false) });
  const panelId = React.useId();
  const sourceList = (sources || []).filter(Boolean);
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={el => { panel.current = el; ref.current = el; }} className={cx("cs-ai-disclosure", className)}>
      <button
        type="button"
        className="cs-ai-disclosure__badge"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {label ?? t("label")}
      </button>
      {open ? (
        <span id={panelId} role="status" className="cs-ai-disclosure__panel">
          <span className="cs-ai-disclosure__details">{details ?? t("details")}</span>
          {sourceList.length ? (
            <span className="cs-ai-disclosure__sources">{t("sources")}: {sourceList.join(", ")}</span>
          ) : null}
        </span>
      ) : null}
    </span>
    </overlayScopeContext.Provider>
  );
}
