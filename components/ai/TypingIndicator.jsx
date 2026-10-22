import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill TypingIndicator — animated dots for when Lumi is composing a reply. */
export const TypingIndicator = React.forwardRef(function TypingIndicator({ label, lang, className , rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("TypingIndicator", L, localeMessages)("label");
  return (
    <span ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-typing", className) }, rootProps, ["role","aria-label"])} role="status" aria-label={lbl}>
      <span /><span /><span />
    </span>
  );
});
TypingIndicator.displayName = "TypingIndicator";
