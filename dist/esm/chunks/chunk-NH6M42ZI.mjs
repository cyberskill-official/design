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

// components/forms/Slider.jsx
import React from "react";
var Slider = React.forwardRef(function Slider2({ className, children, lang, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Slider", L, localeMessages);
  return /* @__PURE__ */ React.createElement("input", { ref: mergedNativeRef, type: "range", className: cx("cs-slider", className), "aria-label": ariaLabel ?? t("label"), ...props });
});
Slider.displayName = "Slider";

export {
  Slider
};
//# sourceMappingURL=chunk-NH6M42ZI.mjs.map
