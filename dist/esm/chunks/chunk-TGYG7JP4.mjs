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

// components/feedback/Result.jsx
import React from "react";
var ART = {
  success: /* @__PURE__ */ React.createElement("svg", { width: "30", height: "30", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M4 12.5l5 5 11-11" })),
  error: /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" })),
  warning: /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l10 18H2z" }), /* @__PURE__ */ React.createElement("path", { d: "M12 10v5M12 18.2v.1" })),
  info: /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 11v6M12 7.2v.1" }))
};
var Result = React.forwardRef(function Result2({ status = "info", title, children, actions, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Result", L, localeMessages);
  const tt = title != null ? title : t(status);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ className: cx("cs-result", "cs-result--" + status, className) }, rootProps, ["role"]), role: "status" }, /* @__PURE__ */ React.createElement("span", { className: "cs-result__icon", "aria-hidden": "true" }, ART[status] || ART.info), /* @__PURE__ */ React.createElement("h2", { className: "cs-result__title" }, tt), children || children === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-result__body" }, children) : null, actions || actions === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-result__actions" }, actions) : null);
});
Result.displayName = "Result";

export {
  Result
};
//# sourceMappingURL=chunk-TGYG7JP4.mjs.map
