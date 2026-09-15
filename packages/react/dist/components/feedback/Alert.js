import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const PATHS = {
  info: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  success: "M4 12.5l5 5 11-11",
  warning: "M12 3l9 16H3z M12 10v4 M12 17h.01",
  danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
};
function DefaultIcon({ variant }) {
  return /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: PATHS[variant] || PATHS.info }) });
}
const Alert = React.forwardRef(function Alert2({ variant = "info", title, icon, children, onDismiss, lang, className, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Alert", L);
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), role: "status", className: cx("cs-alert", `cs-alert--${variant}`, className), ...props, children: [
    /* @__PURE__ */ jsx("span", { className: "cs-alert__icon", children: icon ?? /* @__PURE__ */ jsx(DefaultIcon, { variant }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      title ? /* @__PURE__ */ jsx("p", { className: "cs-alert__title", children: title }) : null,
      children ? /* @__PURE__ */ jsx("div", { className: "cs-alert__body", children }) : null
    ] }),
    onDismiss ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-alert__dismiss", "aria-label": t("dismiss"), onClick: onDismiss, children: "\xD7" }) : null
  ] });
});
export {
  Alert
};
