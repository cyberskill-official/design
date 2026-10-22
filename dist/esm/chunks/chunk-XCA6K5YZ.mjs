"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/brand/LumiAvatar.jsx
import React from "react";
var LumiAvatar = React.forwardRef(function LumiAvatar2({ src, size = "md", ring = false, alt = "Lumi", className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("span", { className: cx("cs-lumi", `cs-lumi--${size}`, ring && "cs-lumi--ring", className), role: !src && alt ? "img" : void 0, "aria-label": !src && alt ? alt : void 0, ...props, ref: mergedNativeRef }, src ? /* @__PURE__ */ React.createElement("img", { src, alt }) : /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "✦"));
});
LumiAvatar.displayName = "LumiAvatar";

export {
  LumiAvatar
};
//# sourceMappingURL=chunk-XCA6K5YZ.mjs.map
