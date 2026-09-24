import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Sidebar = React.forwardRef(function Sidebar2({ label, children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("nav", { ref: forwardedRef, className: cx("cs-sidebar", className), ...props, children: [
    label ? /* @__PURE__ */ jsx("div", { className: "cs-sidebar__label", children: label }) : null,
    children
  ] });
});
const NavItem = React.forwardRef(function NavItem2({ icon, active = false, trail, href, onClick, children, className, ...props }, forwardedRef) {
  const Tag = href ? "a" : "button";
  return /* @__PURE__ */ jsxs(Tag, { ref: forwardedRef, className: cx("cs-nav-item", active && "is-active", className), href, "aria-current": active ? "page" : void 0, onClick, ...props, children: [
    icon ? /* @__PURE__ */ jsx("span", { className: "cs-nav-item__icon", children: icon }) : null,
    /* @__PURE__ */ jsx("span", { children }),
    trail != null ? /* @__PURE__ */ jsx("span", { className: "cs-nav-item__trail", children: trail }) : null
  ] });
});
export {
  NavItem,
  Sidebar
};
