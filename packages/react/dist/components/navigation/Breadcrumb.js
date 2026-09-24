import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Breadcrumb = React.forwardRef(function Breadcrumb2({ items = [], lang, className, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  return /* @__PURE__ */ jsx("nav", { ref: mergeRefs(ref, forwardedRef), "aria-label": makeT("Breadcrumb", L)("label"), ...props, children: /* @__PURE__ */ jsx("ol", { className: cx("cs-breadcrumb", className), children: items.map((it, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ jsx("li", { children: last ? /* @__PURE__ */ jsx("span", { className: "cs-breadcrumb__current", "aria-current": "page", children: it.label }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("a", { href: it.href || "#", children: it.label }),
      /* @__PURE__ */ jsx("span", { className: "cs-breadcrumb__sep", "aria-hidden": "true", children: "/" })
    ] }) }, i);
  }) }) });
});
export {
  Breadcrumb
};
