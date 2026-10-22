"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/ai/TypingIndicator.jsx
import React from "react";
var TypingIndicator = React.forwardRef(function TypingIndicator2({ label, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("TypingIndicator", L, localeMessages)("label");
  return /* @__PURE__ */ React.createElement("span", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-typing", className) }, rootProps, ["role", "aria-label"]), role: "status", "aria-label": lbl }, /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null));
});
TypingIndicator.displayName = "TypingIndicator";

export {
  TypingIndicator
};
//# sourceMappingURL=chunk-XN74VX5H.mjs.map
