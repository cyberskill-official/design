import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill BackTop — scroll-to-top button; appears after a scroll threshold. */
export const BackTop = React.forwardRef(function BackTop({ threshold = 320, label, lang, className }, forwardedRef) {
  const [show, setShow] = React.useState(false);
  const [ref, L] = useLang(lang);
  const lbl = label != null ? label : makeT("BackTop", L)("label");
  React.useEffect(() => {
    const on = () => setShow(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  if (!show) return <span ref={mergeRefs(ref, forwardedRef)} style={{ display: "none" }} />;
  return (
    <button ref={ref} type="button" className={cx("cs-backtop", className)} aria-label={lbl}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
});
