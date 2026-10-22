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

// components/data/Avatar.jsx
import React from "react";
var Avatar = React.forwardRef(function Avatar2({ src, name = "", size = "md", square = false, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const initials = name ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
  return /* @__PURE__ */ React.createElement("span", { className: cx("cs-avatar", `cs-avatar--${size}`, square && "cs-avatar--square", className), role: !src && name ? "img" : void 0, "aria-label": !src && name ? name : void 0, title: name || void 0, ...props, ref: mergedNativeRef }, src ? /* @__PURE__ */ React.createElement("img", { src, alt: name }) : /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, initials));
});
Avatar.displayName = "Avatar";
var AvatarGroup = React.forwardRef(function AvatarGroup2({ className, children, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": cx("cs-avatar-group", className) }, rootProps, []), ref: mergedNativeRef }, children);
});
AvatarGroup.displayName = "AvatarGroup";

export {
  Avatar,
  AvatarGroup
};
//# sourceMappingURL=chunk-GK24BZVQ.mjs.map
