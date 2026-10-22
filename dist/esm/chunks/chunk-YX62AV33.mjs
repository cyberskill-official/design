"use client";
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

// components/feedback/EmptyState.jsx
import React from "react";
var EmptyState = React.forwardRef(function EmptyState2({ icon, title, children, actions, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("EmptyState", L, localeMessages);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ className: cx("cs-empty", className) }, rootProps) }, /* @__PURE__ */ React.createElement("span", { className: "cs-empty__icon" }, icon ?? /* @__PURE__ */ React.createElement("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6" }))), /* @__PURE__ */ React.createElement("div", { className: "cs-empty__title" }, title ?? t("title")), children || children === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-empty__body" }, children) : null, actions || actions === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-empty__actions" }, actions) : null);
});
EmptyState.displayName = "EmptyState";

export {
  EmptyState
};
//# sourceMappingURL=chunk-YX62AV33.mjs.map
