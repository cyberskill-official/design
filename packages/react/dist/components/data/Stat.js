import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Stat = React.forwardRef(function Stat2({ label, value, delta, trend = "flat", className, ...props }, forwardedRef) {
  const arrow = trend === "up" ? "M12 5v14M6 11l6-6 6 6" : trend === "down" ? "M12 5v14M6 13l6 6 6-6" : "M5 12h14";
  return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-stat", className), ...props, children: [
    /* @__PURE__ */ jsx("div", { className: "cs-stat__label", children: label }),
    /* @__PURE__ */ jsx("div", { className: "cs-stat__value", children: value }),
    delta != null ? /* @__PURE__ */ jsxs("div", { className: cx("cs-stat__delta", `cs-stat__delta--${trend}`), children: [
      /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: arrow }) }),
      delta
    ] }) : null
  ] });
});
export {
  Stat
};
