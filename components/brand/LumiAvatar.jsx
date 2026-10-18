import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill LumiAvatar — the golden-genie mascot avatar. Pass `src` (e.g. lumi-poster.webp) or fall back to the ✦ glyph. */
export function LumiAvatar({ src, size = "md", ring = false, alt = "Lumi", className, ...props }) {
  return (
    <span className={cx("cs-lumi", `cs-lumi--${size}`, ring && "cs-lumi--ring", className)} role={!src && alt ? "img" : undefined} aria-label={!src && alt ? alt : undefined} {...props}>
      {src ? <img src={src} alt={alt} /> : <span aria-hidden="true">✦</span>}
    </span>
  );
}
