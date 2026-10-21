"use client";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/ai/PromptSuggestions.jsx
import React from "react";
var PromptSuggestions = React.forwardRef(function PromptSuggestions2({ suggestions = [], onSelect, className, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": cx("cs-suggest", className) }, rootProps, []), ref: mergedNativeRef }, suggestions.map((s, i) => {
    const label = typeof s === "string" ? s : s.label;
    const icon = typeof s === "string" ? null : s.icon;
    return /* @__PURE__ */ React.createElement("button", { key: i, type: "button", onClick: () => onSelect && onSelect(label) }, icon ?? /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" })), label);
  }));
});
PromptSuggestions.displayName = "PromptSuggestions";

export {
  PromptSuggestions
};
//# sourceMappingURL=chunk-PGIDK577.mjs.map
