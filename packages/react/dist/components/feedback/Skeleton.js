import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Skeleton = React.forwardRef(function Skeleton2({ variant = "block", width, height, lines, radius, className, style }, forwardedRef) {
  if (lines) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className, "aria-hidden": "true", role: "presentation", children: Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ jsx("span", { className: "cs-skeleton cs-skeleton--text", style: { width: i === lines - 1 ? "70%" : "100%" } }, i)) });
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cx("cs-skeleton", variant === "circle" && "cs-skeleton--circle", className),
      "aria-hidden": "true",
      style: { display: "block", width, height, borderRadius: radius, ...style }
    }
  );
});
export {
  Skeleton
};
