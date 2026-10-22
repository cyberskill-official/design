"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/feedback/Alert.jsx
import React from "react";
var PATHS = {
  info: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  success: "M4 12.5l5 5 11-11",
  warning: "M12 3l9 16H3z M12 10v4 M12 17h.01",
  danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
};
function DefaultIcon({ variant }) {
  return /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: PATHS[variant] || PATHS.info }));
}
var Alert = React.forwardRef(function Alert2({ variant = "info", title, icon, children, onDismiss, lang, className, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Alert", L, localeMessages);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, role: "status", className: cx("cs-alert", `cs-alert--${variant}`, className), ...props }, /* @__PURE__ */ React.createElement("span", { className: "cs-alert__icon" }, icon ?? /* @__PURE__ */ React.createElement(DefaultIcon, { variant })), /* @__PURE__ */ React.createElement("div", null, title || title === 0 ? /* @__PURE__ */ React.createElement("p", { className: "cs-alert__title" }, title) : null, children || children === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-alert__body" }, children) : null), onDismiss ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-alert__dismiss", "aria-label": t("dismiss"), onClick: onDismiss }, "×") : null);
});
Alert.displayName = "Alert";

export {
  Alert
};
//# sourceMappingURL=chunk-UFE32JPH.mjs.map
