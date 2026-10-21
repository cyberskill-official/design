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

// components/forms/TimePicker.jsx
import React from "react";
var CLOCK = /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 7v5l3 3" }));
var TimePicker = React.forwardRef(function TimePicker2({ controlRef, value = "09:00", onChange, step = 30, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, rootProps }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("TimePicker", L, localeMessages);
  const stepMin = Number(step);
  const safeStep = Number.isInteger(stepMin) && stepMin >= 1 && stepMin <= 1440 ? stepMin : 30;
  const opts = [];
  for (let m = 0; m < 24 * 60; m += safeStep) {
    opts.push(String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"));
  }
  return /* @__PURE__ */ React.createElement("span", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-timepicker", className) }, rootProps, []) }, CLOCK, /* @__PURE__ */ React.createElement("select", { "aria-label": label != null ? label : ariaLabelledBy ? void 0 : t("label"), "aria-labelledby": ariaLabelledBy, disabled, value, onChange: (e) => onChange && onChange(e.target.value), ref: mergedControlRef }, opts.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, o))));
});
TimePicker.displayName = "TimePicker";

export {
  TimePicker
};
//# sourceMappingURL=chunk-7IJTTRPK.mjs.map
