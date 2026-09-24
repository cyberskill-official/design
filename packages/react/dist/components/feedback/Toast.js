import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const PATHS = {
  default: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  success: "M4 12.5l5 5 11-11",
  danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
};
function DefaultIcon({ variant }) {
  return /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: PATHS[variant] || PATHS.default }) });
}
const ToastStack = React.forwardRef(function ToastStack2({ children, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-toast-stack", className), role: "region", "aria-label": makeT("Toast", L)("notifications"), children });
});
const Toast = React.forwardRef(function Toast2({ variant = "default", title, icon, onClose, lang, children, className, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-toast", `cs-toast--${variant}`, className), role: "status", ...props, children: [
    /* @__PURE__ */ jsx("span", { className: "cs-toast__icon", "aria-hidden": "true", children: icon ?? /* @__PURE__ */ jsx(DefaultIcon, { variant }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      title ? /* @__PURE__ */ jsx("div", { className: "cs-toast__title", children: title }) : null,
      children ? /* @__PURE__ */ jsx("div", { className: "cs-toast__body", children }) : null
    ] }),
    onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-toast__close", "aria-label": makeT("Toast", L)("dismiss"), onClick: onClose, children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) }) : null
  ] });
});
export {
  Toast,
  ToastStack
};
