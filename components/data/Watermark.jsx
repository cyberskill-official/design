import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Watermark — repeats rotated text behind children (draft/confidential marking).
 * An alpha mask lets CSS resolve the inherited color live, including theme changes. */
export const Watermark = React.forwardRef(function Watermark({ text = "CyberSkill", opacity = 0.09, gap = 140, rotate = -22, children, className, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${gap}" height="${gap}"><text x="50%" y="50%" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="700" fill="black" fill-opacity="${opacity}" text-anchor="middle" transform="rotate(${rotate} ${gap / 2} ${gap / 2})">${String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`
  );
  return (
    <div {...mergeTargetProps({ className: cx("cs-watermark", className) }, rootProps)} style={{ ...rootProps?.style, position: "relative" }} ref={mergedNativeRef} >
      {children}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundColor: "var(--cs-color-text-primary, #45210E)", maskImage: `url("data:image/svg+xml,${svg}")`, WebkitMaskImage: `url("data:image/svg+xml,${svg}")`, maskRepeat: "repeat", WebkitMaskRepeat: "repeat" }} />
    </div>
  );
});
Watermark.displayName = "Watermark";
