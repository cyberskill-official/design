"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Link.jsx
import React from "react";
var Link = React.forwardRef(function Link2({ href = "#", variant = "default", external = false, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement(
    "a",
    {
      href,
      className: cx("cs-link", variant !== "default" && "cs-link--" + variant, className),
      target: external ? "_blank" : void 0,
      rel: external ? "noopener noreferrer" : void 0,
      ...props,
      ref: mergedNativeRef
    },
    children,
    external ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, " ↗") : variant === "standalone" ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, " →") : null
  );
});
Link.displayName = "Link";

export {
  Link
};
//# sourceMappingURL=chunk-4HMDM3BI.mjs.map
