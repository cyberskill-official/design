import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Spinner — indeterminate loading indicator. */
export const Spinner = React.forwardRef(function Spinner({ size = 20, label, lang, className, style, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("Spinner", L, localeMessages)("label");
  return <span ref={mergedNativeRef} role="status" aria-label={lbl} className={cx("cs-spinner", className)} style={{ inlineSize: size, blockSize: size, width: size, height: size, ...style }} {...props} />;
});
Spinner.displayName = "Spinner";
