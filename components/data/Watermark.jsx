import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Watermark — repeats rotated text behind children (draft/confidential marking).
 * Fill colour is read from --cs-color-text-primary at render time (data-URIs cannot resolve CSS vars). */
export function Watermark({ text = "CyberSkill", opacity = 0.09, gap = 140, rotate = -22, children, className }) {
  const host = React.useRef(null);
  const [fill, setFill] = React.useState("#45210E");
  React.useLayoutEffect(() => {
    if (!host.current || typeof getComputedStyle === "undefined") return;
    const c = getComputedStyle(host.current).getPropertyValue("--cs-color-text-primary").trim();
    if (c) setFill(c);
  }, []);
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${gap}" height="${gap}"><text x="50%" y="50%" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="700" fill="${fill}" fill-opacity="${opacity}" text-anchor="middle" transform="rotate(${rotate} ${gap / 2} ${gap / 2})">${String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`
  );
  return (
    <div ref={host} className={cx("cs-watermark", className)} style={{ position: "relative" }}>
      {children}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,${svg}")` }} />
    </div>
  );
}
