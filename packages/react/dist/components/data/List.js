import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const List = React.forwardRef(function List2({ className, children, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, role: "list", className: cx("cs-list", className), ...props, children });
});
const ListItem = React.forwardRef(function ListItem2({ lead, title, subtitle, trail, onClick, children, className, ...props }, forwardedRef) {
  const interactive = !!onClick;
  const Tag = interactive ? "button" : "div";
  return /* @__PURE__ */ jsxs(Tag, { ref: forwardedRef, role: "listitem", className: cx("cs-list__item", interactive && "cs-list__item--button", className), onClick, ...props, children: [
    lead != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__lead", children: lead }) : null,
    /* @__PURE__ */ jsxs("span", { className: "cs-list__main", children: [
      title != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__title", children: title }) : null,
      subtitle != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__sub", children: subtitle }) : null,
      children
    ] }),
    trail != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__trail", children: trail }) : null
  ] });
});
export {
  List,
  ListItem
};
