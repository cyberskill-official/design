import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const DescriptionList = React.forwardRef(function DescriptionList2({ items = [], className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsx("dl", { ref: forwardedRef, className: cx("cs-dl", className), ...props, children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("dt", { children: it.term }),
    /* @__PURE__ */ jsx("dd", { children: it.value })
  ] }, i)) });
});
export {
  DescriptionList
};
