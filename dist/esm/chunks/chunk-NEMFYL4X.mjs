"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/feedback/Spinner.jsx
import React from "react";
var Spinner = React.forwardRef(function Spinner2({ size = 20, label, lang, className, style, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("Spinner", L, localeMessages)("label");
  return /* @__PURE__ */ React.createElement("span", { ref: mergedNativeRef, role: "status", "aria-label": lbl, className: cx("cs-spinner", className), style: { inlineSize: size, blockSize: size, width: size, height: size, ...style }, ...props });
});
Spinner.displayName = "Spinner";

export {
  Spinner
};
//# sourceMappingURL=chunk-NEMFYL4X.mjs.map
