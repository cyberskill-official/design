import { jsx } from "react/jsx-runtime";
import React from "react";
import { CS_LOGO_VIEWBOX, CS_LOGO_MARK_INNER } from "./logo-data.js";
import { cx } from "../_utils/cx.js";
const Logo = React.forwardRef(function Logo2({ size = 32, title = "CyberSkill", decorative = false, className, ...props }, forwardedRef) {
  const safeTitle = String(title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return /* @__PURE__ */ jsx(
    "svg",
    {
      ref: forwardedRef,
      ...props,
      className: cx("cs-logo", className),
      width: size,
      height: size,
      viewBox: CS_LOGO_VIEWBOX,
      xmlns: "http://www.w3.org/2000/svg",
      role: decorative ? void 0 : "img",
      "aria-hidden": decorative ? true : void 0,
      "aria-label": decorative ? void 0 : title,
      dangerouslySetInnerHTML: { __html: (decorative ? "" : `<title>${safeTitle}</title>`) + CS_LOGO_MARK_INNER }
    }
  );
});
export {
  Logo
};
