import { jsx } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const ProgressBar = React.forwardRef(function ProgressBar2({ value = 0, max = 100, variant, label, lang, className }, forwardedRef) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.max(0, Math.min(safeMax, Number(value) || 0));
  const pct = Math.max(0, Math.min(100, clamped / safeMax * 100));
  const [ref, L] = useLang(lang);
  const t = makeT("ProgressBar", L);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: mergeRefs(ref, forwardedRef),
      className: cx("cs-progress", variant && `cs-progress--${variant}`, className),
      role: "progressbar",
      "aria-valuenow": Math.round(clamped),
      "aria-valuemin": 0,
      "aria-valuemax": safeMax,
      "aria-label": label ?? t("label"),
      children: /* @__PURE__ */ jsx("span", { className: "cs-progress__fill", style: { inlineSize: pct + "%", width: pct + "%" } })
    }
  );
});
export {
  ProgressBar
};
