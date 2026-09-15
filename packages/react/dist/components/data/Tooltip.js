import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Tooltip = React.forwardRef(function Tooltip2({ label, children, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Tooltip", L);
  return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-tooltip", className), children: [
    children,
    /* @__PURE__ */ jsx("span", { className: "cs-tooltip__bubble", role: "tooltip", children: label ?? t("label") })
  ] });
});
export {
  Tooltip
};
