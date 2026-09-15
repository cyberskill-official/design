import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill LumiAvatar — the golden-genie mascot avatar. Pass `src` (e.g. lumi-poster.webp) or fall back to the ✦ glyph. */
export const LumiAvatar = React.forwardRef(function LumiAvatar({ src, size = "md", ring = false, alt = "Lumi", className, ...props }, forwardedRef) {
  return (
    <span ref={forwardedRef} className={cx("cs-lumi", `cs-lumi--${size}`, ring && "cs-lumi--ring", className)} {...props}>
      {src ? <img src={src} alt={alt} /> : <span aria-hidden="true">✦</span>}
    </span>
  );
});
