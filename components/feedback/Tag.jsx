import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Tag — chip with optional remove button. */
export const Tag = React.forwardRef(function Tag({ children, onRemove, removeLabel, lang, className, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const rl = removeLabel != null ? removeLabel : makeT("Tag", L)("remove");
  return (
    <span ref={mergeRefs(ref, forwardedRef)} className={cx("cs-tag", className)} {...props}>
      {children}
      {onRemove ? (
        <button type="button" className="cs-tag__close" aria-label={rl} onClick={onRemove}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      ) : null}
    </span>
  );
});
