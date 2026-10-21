import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill BackTop — scroll-to-top button; appears after a scroll threshold. */
export const BackTop = React.forwardRef(function BackTop({ threshold = 320, label, lang, className , rootProps }, forwardedRef) {
  const [show, setShow] = React.useState(false);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("BackTop", L, localeMessages)("label");
  React.useEffect(() => {
    const on = () => setShow(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  if (!show) return <span ref={ref} style={{ display: "none" }} />;
  return (
    <button ref={mergedNativeRef} type="button" {...mergeTargetProps({ "className": cx("cs-backtop", className), "onClick": () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }) }, rootProps, ["type","aria-label"])} aria-label={lbl}
      >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
});
BackTop.displayName = "BackTop";
