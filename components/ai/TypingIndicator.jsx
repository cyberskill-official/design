import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill TypingIndicator — animated dots for when Lumi is composing a reply. */
export const TypingIndicator = React.forwardRef(function TypingIndicator({ label, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const lbl = label != null ? label : makeT("TypingIndicator", L)("label");
  return (
    <span ref={mergeRefs(ref, forwardedRef)} className={cx("cs-typing", className)} role="status" aria-label={lbl}>
      <span /><span /><span />
    </span>
  );
});
