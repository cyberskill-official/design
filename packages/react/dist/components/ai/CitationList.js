import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const CitationList = React.forwardRef(function CitationList2({ label = "Sources", items = [], className }, forwardedRef) {
  return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-citations", className), children: [
    label ? /* @__PURE__ */ jsx("div", { className: "cs-citations__label", children: label }) : null,
    items.map((it, i) => {
      const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "cs-citation__num", children: i + 1 }),
        /* @__PURE__ */ jsxs("span", { className: "cs-citation__text", children: [
          it.title,
          it.source ? /* @__PURE__ */ jsxs("span", { className: "cs-citation__src", children: [
            " \xB7 ",
            it.source
          ] }) : null
        ] })
      ] });
      return it.href ? /* @__PURE__ */ jsx("a", { className: "cs-citation", href: it.href, target: "_blank", rel: "noreferrer", children: inner }, i) : /* @__PURE__ */ jsx("div", { className: "cs-citation", children: inner }, i);
    })
  ] });
});
export {
  CitationList
};
