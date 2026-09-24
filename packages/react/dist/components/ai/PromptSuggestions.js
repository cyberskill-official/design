import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const PromptSuggestions = React.forwardRef(function PromptSuggestions2({ suggestions = [], onSelect, className }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-suggest", className), children: suggestions.map((s, i) => {
    const label = typeof s === "string" ? s : s.label;
    const icon = typeof s === "string" ? null : s.icon;
    return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onSelect && onSelect(label), children: [
      icon ?? /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }) }),
      label
    ] }, i);
  }) });
});
export {
  PromptSuggestions
};
