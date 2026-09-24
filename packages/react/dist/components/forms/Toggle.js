import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Toggle = React.forwardRef(function Toggle2({ pressed, defaultPressed = false, onChange, icon, children, disabled = false, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [inner, setInner] = React.useState(defaultPressed);
  const on = pressed != null ? pressed : inner;
  const [ref, L] = useLang(lang);
  const t = makeT("Toggle", L);
  const flip = () => {
    const v = !on;
    if (pressed == null) setInner(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref: mergeRefs(ref, forwardedRef),
      type: "button",
      className: cx("cs-toggle", className),
      "aria-pressed": on,
      "aria-label": ariaLabel ?? (on ? t("pressed") : t("unpressed")),
      disabled,
      onClick: flip,
      ...props,
      children: [
        icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { display: "inline-flex" }, children: icon }) : null,
        children
      ]
    }
  );
});
export {
  Toggle
};
