import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const NumberField = React.forwardRef(function NumberField2({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  lang,
  className,
  children,
  ...props
}, forwardedRef) {
  const [inner, setInner] = React.useState(0);
  const val = value != null ? value : inner;
  const clamp = (n) => {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return n;
  };
  const set = (n) => {
    const c = clamp(n);
    onChange ? onChange(c) : setInner(c);
  };
  const [ref, L] = useLang(lang);
  const t = makeT("NumberField", L);
  const gid = React.useId();
  const sid = id ?? gid;
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", className), children: [
    label ? /* @__PURE__ */ jsx("label", { className: "cs-field__label", htmlFor: sid, children: label }) : null,
    /* @__PURE__ */ jsxs("div", { className: "cs-stepper", children: [
      /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("decrease"), disabled: disabled || min != null && val <= min, onClick: () => set(val - step), children: "\u2212" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ...props,
          id: sid,
          type: "number",
          value: val,
          min,
          max,
          step,
          disabled,
          "aria-label": label ? void 0 : t("value"),
          onChange: (e) => set(Number(e.target.value))
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("increase"), disabled: disabled || max != null && val >= max, onClick: () => set(val + step), children: "+" })
    ] })
  ] });
});
export {
  NumberField
};
