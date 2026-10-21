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

// components/forms/Toggle.jsx
import React from "react";
var Toggle = React.forwardRef(function Toggle2({ pressed, defaultPressed = false, onChange, onClick, icon, children, disabled = false, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [inner, setInner] = React.useState(defaultPressed);
  const on = pressed != null ? pressed : inner;
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Toggle", L, localeMessages);
  const hasContent = React.Children.toArray(children).some((child) => typeof child !== "string" || child.trim().length > 0);
  const flip = () => {
    const v = !on;
    if (pressed == null) setInner(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ref: mergedNativeRef,
      type: "button",
      className: cx("cs-toggle", className),
      "aria-pressed": on,
      "aria-label": ariaLabel ?? (hasContent ? void 0 : t("label")),
      disabled,
      onClick: (event) => {
        onClick?.(event);
        if (!event.defaultPrevented) flip();
      },
      ...props
    },
    icon || icon === 0 ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { display: "inline-flex" } }, icon) : null,
    children
  );
});
Toggle.displayName = "Toggle";

export {
  Toggle
};
//# sourceMappingURL=chunk-QGCPHFSI.mjs.map
