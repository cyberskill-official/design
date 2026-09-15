import React from "react";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill AIDisclosureBadge — a pill that discloses AI involvement and, when
 * expanded, explains what was generated and lists sources. Never decorative:
 * this is an explainability affordance (info-blue), not a style flourish.
 */
export const AIDisclosureBadge = React.forwardRef(function AIDisclosureBadge({
  label = "AI assisted",
  details = "This content was generated or transformed with AI assistance.",
  sources = [],
  className,
}, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const sourceList = (sources || []).filter(Boolean);
  return (
    <span ref={forwardedRef} className={cx("cs-ai-disclosure", className)}>
      <button
        type="button"
        className="cs-ai-disclosure__badge"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>
      {open ? (
        <span id={panelId} role="status" className="cs-ai-disclosure__panel">
          <span className="cs-ai-disclosure__details">{details}</span>
          {sourceList.length ? (
            <span className="cs-ai-disclosure__sources">Sources: {sourceList.join(", ")}</span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
});
