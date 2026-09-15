import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Switch = React.forwardRef(function Switch2({ label, disabled = false, className, children, lang, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Switch", L);
  const named = !!(label || ariaLabel || ariaLabelledby);
  const fallback = props.checked || props.defaultChecked ? t("on") : t("off");
  return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-switch", disabled && "is-disabled", className), children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "checkbox",
        role: "switch",
        disabled,
        "aria-label": ariaLabel ?? (named ? void 0 : fallback),
        "aria-labelledby": ariaLabelledby,
        ...props
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "cs-switch__track", "aria-hidden": "true" }),
    label ? /* @__PURE__ */ jsx("span", { className: "cs-switch__label", children: label }) : null
  ] });
});
export {
  Switch
};
