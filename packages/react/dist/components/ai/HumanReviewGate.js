import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const HumanReviewGate = React.forwardRef(function HumanReviewGate2({
  risk,
  summary,
  reviewer,
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
  lang,
  className
}, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("HumanReviewGate", L);
  const rk = risk != null ? risk : t("risk");
  const al = approveLabel != null ? approveLabel : t("approve");
  const rl = rejectLabel != null ? rejectLabel : t("reject");
  return /* @__PURE__ */ jsxs("section", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-review-gate", className), "aria-label": t("aria"), children: [
    /* @__PURE__ */ jsx("div", { className: "cs-review-gate__risk", children: rk }),
    /* @__PURE__ */ jsx("p", { className: "cs-review-gate__summary", children: summary }),
    reviewer ? /* @__PURE__ */ jsxs("p", { className: "cs-review-gate__reviewer", children: [
      t("reviewer"),
      ": ",
      reviewer
    ] }) : null,
    /* @__PURE__ */ jsxs("div", { className: "cs-review-gate__actions", children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary", onClick: onReject, children: rl }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--primary", onClick: onApprove, children: al })
    ] })
  ] });
});
export {
  HumanReviewGate
};
