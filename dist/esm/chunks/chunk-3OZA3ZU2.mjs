"use client";
import {
  CS_LOGO_MARK_INNER,
  CS_LOGO_VIEWBOX
} from "./chunk-W2F6SXG5.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/logo/Logo.jsx
import React from "react";
var Logo = React.forwardRef(function Logo2({ size = 32, title = "CyberSkill", decorative = false, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const safeTitle = String(title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      ...props,
      className: cx("cs-logo", className),
      width: size,
      height: size,
      viewBox: CS_LOGO_VIEWBOX,
      xmlns: "http://www.w3.org/2000/svg",
      role: decorative ? void 0 : "img",
      "aria-hidden": decorative ? true : void 0,
      "aria-label": decorative ? void 0 : title,
      dangerouslySetInnerHTML: { __html: (decorative ? "" : `<title>${safeTitle}</title>`) + CS_LOGO_MARK_INNER },
      ref: mergedNativeRef
    }
  );
});
Logo.displayName = "Logo";

export {
  Logo
};
//# sourceMappingURL=chunk-3OZA3ZU2.mjs.map
