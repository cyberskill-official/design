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

// components/feedback/Tag.jsx
import React from "react";
var Tag = React.forwardRef(function Tag2({ children, onRemove, removeLabel, lang, className, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const rl = removeLabel != null ? removeLabel : makeT("Tag", L, localeMessages)("remove");
  return /* @__PURE__ */ React.createElement("span", { ref: mergedNativeRef, className: cx("cs-tag", className), ...props }, children, onRemove ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-tag__close", "aria-label": rl, onClick: onRemove }, /* @__PURE__ */ React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" }))) : null);
});
Tag.displayName = "Tag";

export {
  Tag
};
//# sourceMappingURL=chunk-OOZKMXYB.mjs.map
