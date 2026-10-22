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

// components/ai/HumanReviewGate.jsx
import React from "react";
var HumanReviewGate = React.forwardRef(function HumanReviewGate2({
  risk,
  summary,
  reviewer,
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
  lang,
  className,
  rootProps
}, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("HumanReviewGate", L, localeMessages);
  const rk = risk != null ? risk : t("risk");
  const al = approveLabel != null ? approveLabel : t("approve");
  const rl = rejectLabel != null ? rejectLabel : t("reject");
  return /* @__PURE__ */ React.createElement("section", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-review-gate", className) }, rootProps, ["aria-label"]), "aria-label": t("aria") }, /* @__PURE__ */ React.createElement("div", { className: "cs-review-gate__risk" }, rk), /* @__PURE__ */ React.createElement("p", { className: "cs-review-gate__summary" }, summary), reviewer || reviewer === 0 ? /* @__PURE__ */ React.createElement("p", { className: "cs-review-gate__reviewer" }, t("reviewer"), ": ", reviewer) : null, /* @__PURE__ */ React.createElement("div", { className: "cs-review-gate__actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--secondary", onClick: onReject }, rl), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--primary", onClick: onApprove }, al)));
});
HumanReviewGate.displayName = "HumanReviewGate";

export {
  HumanReviewGate
};
//# sourceMappingURL=chunk-DHTD5KM5.mjs.map
