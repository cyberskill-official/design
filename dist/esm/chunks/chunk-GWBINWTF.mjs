"use client";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/feedback/Toast.jsx
import React from "react";
var PATHS = {
  default: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  success: "M4 12.5l5 5 11-11",
  danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
};
function DefaultIcon({ variant }) {
  return /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: PATHS[variant] || PATHS.default }));
}
var ToastStack = React.forwardRef(function ToastStack2({ children, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-toast-stack", className) }, rootProps, ["role", "aria-label"]), role: "region", "aria-label": makeT("Toast", L, localeMessages)("notifications") }, children);
});
ToastStack.displayName = "ToastStack";
var Toast = React.forwardRef(function Toast2({ variant = "default", title, icon, onClose, lang, children, className, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const { scope } = useOverlayLayer({ open: true, kind: "toast", panelRef: ref, restoreFocus: false });
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, className: cx("cs-toast", `cs-toast--${variant}`, className), role: "status", ...props }, /* @__PURE__ */ React.createElement("span", { className: "cs-toast__icon", "aria-hidden": "true" }, icon ?? /* @__PURE__ */ React.createElement(DefaultIcon, { variant })), /* @__PURE__ */ React.createElement("div", null, title || title === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-toast__title" }, title) : null, children || children === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-toast__body" }, children) : null), onClose ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-toast__close", "aria-label": makeT("Toast", L, localeMessages)("dismiss"), onClick: onClose }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" }))) : null));
});
Toast.displayName = "Toast";

export {
  ToastStack,
  Toast
};
//# sourceMappingURL=chunk-GWBINWTF.mjs.map
