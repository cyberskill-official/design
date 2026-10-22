"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/Switch.jsx
import React from "react";
var Switch = React.forwardRef(function Switch2({ label, disabled = false, className, children, lang, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Switch", L, localeMessages);
  const hasLabel = Boolean(label) || label === 0;
  const named = !!(hasLabel || ariaLabel || ariaLabelledby);
  const fallback = t("label");
  const { onChange, ...rest } = props;
  return /* @__PURE__ */ React.createElement("label", { ref, className: cx("cs-switch", disabled && "is-disabled", className) }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      role: "switch",
      disabled,
      "aria-label": ariaLabel ?? (named ? void 0 : fallback),
      "aria-labelledby": ariaLabelledby,
      onChange: (e) => {
        if (onChange) onChange(e);
      },
      ...rest,
      ref: mergedNativeRef
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "cs-switch__track", "aria-hidden": "true" }), hasLabel ? /* @__PURE__ */ React.createElement("span", { className: "cs-switch__label" }, label) : null);
});
Switch.displayName = "Switch";

export {
  Switch
};
//# sourceMappingURL=chunk-CLWTVJM3.mjs.map
