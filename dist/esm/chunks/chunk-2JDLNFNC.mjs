"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Stat.jsx
import React from "react";
var Stat = React.forwardRef(function Stat2({ label, value, delta, trend = "flat", className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const arrow = trend === "up" ? "M12 5v14M6 11l6-6 6 6" : trend === "down" ? "M12 5v14M6 13l6 6 6-6" : "M5 12h14";
  return /* @__PURE__ */ React.createElement("div", { className: cx("cs-stat", className), ...props, ref: mergedNativeRef }, /* @__PURE__ */ React.createElement("div", { className: "cs-stat__label" }, label), /* @__PURE__ */ React.createElement("div", { className: "cs-stat__value" }, value), delta != null ? /* @__PURE__ */ React.createElement("div", { className: cx("cs-stat__delta", `cs-stat__delta--${trend}`) }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: arrow })), delta) : null);
});
Stat.displayName = "Stat";

export {
  Stat
};
//# sourceMappingURL=chunk-2JDLNFNC.mjs.map
