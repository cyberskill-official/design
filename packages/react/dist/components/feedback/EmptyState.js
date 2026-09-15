import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const EmptyState = React.forwardRef(function EmptyState2({ icon, title, children, actions, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("EmptyState", L);
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-empty", className), children: [
    /* @__PURE__ */ jsx("span", { className: "cs-empty__icon", children: icon ?? /* @__PURE__ */ jsx("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "cs-empty__title", children: title ?? t("title") }),
    children ? /* @__PURE__ */ jsx("div", { className: "cs-empty__body", children }) : null,
    actions ? /* @__PURE__ */ jsx("div", { className: "cs-empty__actions", children: actions }) : null
  ] });
});
export {
  EmptyState
};
