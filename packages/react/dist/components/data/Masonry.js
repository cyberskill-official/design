import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Masonry = React.forwardRef(function Masonry2({ columns = 3, gap = 16, children, className, style }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-masonry", className), style: { columnCount: columns, columnGap: gap, ...style }, children: React.Children.map(children, (c) => /* @__PURE__ */ jsx("div", { className: "cs-masonry__item", style: { marginBottom: gap }, children: c })) });
});
export {
  Masonry
};
