import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill PromptSuggestions — tappable "wish" starter chips for a chat/prompt. */
export const PromptSuggestions = React.forwardRef(function PromptSuggestions({ suggestions = [], onSelect, className }, forwardedRef) {
  return (
    <div ref={forwardedRef} className={cx("cs-suggest", className)}>
      {suggestions.map((s, i) => {
        const label = typeof s === "string" ? s : s.label;
        const icon = typeof s === "string" ? null : s.icon;
        return (
          <button key={i} type="button" onClick={() => onSelect && onSelect(label)}>
            {icon ?? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /></svg>}
            {label}
          </button>
        );
      })}
    </div>
  );
});
