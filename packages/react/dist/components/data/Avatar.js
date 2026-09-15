import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Avatar = React.forwardRef(function Avatar2({ src, name = "", size = "md", square = false, className, ...props }, forwardedRef) {
  const initials = name ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
  return /* @__PURE__ */ jsx("span", { ref: forwardedRef, className: cx("cs-avatar", `cs-avatar--${size}`, square && "cs-avatar--square", className), title: name || void 0, ...props, children: src ? /* @__PURE__ */ jsx("img", { src, alt: name }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: initials }) });
});
const AvatarGroup = React.forwardRef(function AvatarGroup2({ className, children }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-avatar-group", className), children });
});
export {
  Avatar,
  AvatarGroup
};
