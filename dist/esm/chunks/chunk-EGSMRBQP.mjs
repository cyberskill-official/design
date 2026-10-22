"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Sidebar.jsx
import React from "react";
var Sidebar = React.forwardRef(function Sidebar2({ label, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const labelId = React.useId();
  const hasLabel = Boolean(label) || label === 0;
  return /* @__PURE__ */ React.createElement("nav", { className: cx("cs-sidebar", className), "aria-labelledby": hasLabel ? labelId : void 0, ...props, ref: mergedNativeRef }, hasLabel ? /* @__PURE__ */ React.createElement("div", { id: labelId, className: "cs-sidebar__label" }, label) : null, children);
});
Sidebar.displayName = "Sidebar";
var NavItem = React.forwardRef(function NavItem2({ icon, active = false, trail, href, onClick, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const Tag = href ? "a" : "button";
  return /* @__PURE__ */ React.createElement(Tag, { type: Tag === "button" ? "button" : void 0, className: cx("cs-nav-item", active && "is-active", className), href, "aria-current": active ? "page" : void 0, onClick, ...props, ref: mergedNativeRef }, icon || icon === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-nav-item__icon" }, icon) : null, /* @__PURE__ */ React.createElement("span", null, children), trail != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-nav-item__trail" }, trail) : null);
});
NavItem.displayName = "NavItem";

export {
  Sidebar,
  NavItem
};
//# sourceMappingURL=chunk-EGSMRBQP.mjs.map
