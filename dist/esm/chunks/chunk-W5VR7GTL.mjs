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

// components/feedback/ProgressBar.jsx
import React from "react";
var ProgressBar = React.forwardRef(function ProgressBar2({ value = 0, max = 100, variant, label, lang, className, rootProps }, forwardedRef) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const clamped = Math.max(0, Math.min(safeMax, Number(value) || 0));
  const pct = Math.max(0, Math.min(100, clamped / safeMax * 100));
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("ProgressBar", L, localeMessages);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: mergedNativeRef,
      ...mergeTargetProps({ "className": cx("cs-progress", variant && `cs-progress--${variant}`, className) }, rootProps, ["role", "aria-valuenow", "aria-valuemin", "aria-valuemax", "aria-label"]),
      role: "progressbar",
      "aria-valuenow": clamped,
      "aria-valuemin": 0,
      "aria-valuemax": safeMax,
      "aria-label": label ?? t("label")
    },
    /* @__PURE__ */ React.createElement("span", { className: "cs-progress__fill", style: { inlineSize: pct + "%", width: pct + "%" } })
  );
});
ProgressBar.displayName = "ProgressBar";

export {
  ProgressBar
};
//# sourceMappingURL=chunk-W5VR7GTL.mjs.map
