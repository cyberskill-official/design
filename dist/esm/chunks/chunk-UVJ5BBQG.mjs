"use client";
import {
  renderCount
} from "./chunk-5MIGZVWB.mjs";
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

// components/ai/ConfidenceMeter.jsx
import React from "react";
var TONE = {
  low: { color: "var(--cs-color-semantic-danger)", textColor: "var(--cs-color-semantic-danger-text)", label: "Low", fill: 2 },
  medium: { color: "var(--cs-color-semantic-warning)", textColor: "var(--cs-color-semantic-warning-text)", label: "Medium", fill: 3 },
  high: { color: "var(--cs-color-semantic-success)", textColor: "var(--cs-color-semantic-success-text)", label: "High", fill: 5 }
};
var ConfidenceMeter = React.forwardRef(function ConfidenceMeter2({ value, level, segments = 5, label, lang, className, rootProps }, forwardedRef) {
  let tone, filled;
  const segs = renderCount(Number(segments) || 5, 5, 1);
  if (value != null) {
    const v = Math.max(0, Math.min(1, Number(value) || 0));
    tone = v < 0.4 ? "low" : v < 0.75 ? "medium" : "high";
    filled = Math.max(0, Math.min(segs, Math.round(v * segs)));
  } else {
    tone = TONE[level] ? level : "medium";
    filled = Math.max(0, Math.min(segs, Math.round(TONE[tone].fill / 5 * segs)));
  }
  const meta = TONE[tone];
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const nameId = React.useId();
  const t = makeT("ConfidenceMeter", L, localeMessages);
  const lbl = label != null ? label : t("label");
  const levelText = t(tone);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-confidence", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement("div", { className: "cs-confidence__head" }, /* @__PURE__ */ React.createElement("span", { id: nameId + "-label" }, lbl), /* @__PURE__ */ React.createElement("span", { id: nameId + "-level", className: "cs-confidence__level", style: { color: meta.textColor } }, levelText)), /* @__PURE__ */ React.createElement("div", { className: "cs-confidence__track", role: "meter", "aria-valuemin": 0, "aria-valuemax": segs, "aria-valuenow": filled, "aria-labelledby": nameId + "-label " + nameId + "-level" }, Array.from({ length: segs }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "cs-confidence__seg", style: i < filled ? { background: meta.color } : void 0 }))));
});
ConfidenceMeter.displayName = "ConfidenceMeter";

export {
  ConfidenceMeter
};
//# sourceMappingURL=chunk-UVJ5BBQG.mjs.map
