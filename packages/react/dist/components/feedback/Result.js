import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const ART = {
  success: /* @__PURE__ */ jsx("svg", { width: "30", height: "30", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 12.5l5 5 11-11" }) }),
  error: /* @__PURE__ */ jsx("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }),
  warning: /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { d: "M12 3l10 18H2z" }),
    /* @__PURE__ */ jsx("path", { d: "M12 10v5M12 18.2v.1" })
  ] }),
  info: /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M12 11v6M12 7.2v.1" })
  ] })
};
const Result = React.forwardRef(function Result2({ status = "info", title, children, actions, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Result", L);
  const tt = title != null ? title : t(status);
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-result", "cs-result--" + status, className), role: "status", children: [
    /* @__PURE__ */ jsx("span", { className: "cs-result__icon", "aria-hidden": "true", children: ART[status] || ART.info }),
    /* @__PURE__ */ jsx("h2", { className: "cs-result__title", children: tt }),
    children ? /* @__PURE__ */ jsx("div", { className: "cs-result__body", children }) : null,
    actions ? /* @__PURE__ */ jsx("div", { className: "cs-result__actions", children: actions }) : null
  ] });
});
export {
  Result
};
