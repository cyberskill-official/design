import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const CLOCK = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ jsx("path", { d: "M12 7v5l3 3" })
] });
const TimePicker = React.forwardRef(function TimePicker2({ value = "09:00", onChange, step = 30, label, disabled = false, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("TimePicker", L);
  const stepMin = Number(step);
  const safeStep = Number.isFinite(stepMin) && stepMin > 0 ? stepMin : 30;
  const opts = [];
  for (let m = 0; m < 24 * 60; m += safeStep) {
    opts.push(String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"));
  }
  return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-timepicker", className), children: [
    CLOCK,
    /* @__PURE__ */ jsx("select", { "aria-label": label != null ? label : t("label"), disabled, value, onChange: (e) => onChange && onChange(e.target.value), children: opts.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: o }, o)) })
  ] });
});
export {
  TimePicker
};
