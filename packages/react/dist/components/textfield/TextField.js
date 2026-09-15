import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const TextField = React.forwardRef(function TextField2({
  id,
  label,
  description,
  error,
  disabled = false,
  readOnly = false,
  className,
  children,
  // never rendered on purpose: keeps stray children out of {...props} → void <input>
  ...props
}, forwardedRef) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : void 0;
  const errorId = error ? `${inputId}-error` : void 0;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs(
    "label",
    {
      ref: forwardedRef,
      className: cx("cs-field", disabled && "is-disabled", error && "is-invalid", className),
      htmlFor: inputId,
      children: [
        /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }),
        description ? /* @__PURE__ */ jsx("span", { id: descriptionId, className: "cs-field__description", children: description }) : null,
        /* @__PURE__ */ jsx(
          "input",
          {
            ...props,
            id: inputId,
            disabled,
            readOnly,
            "aria-invalid": error ? true : void 0,
            "aria-describedby": describedBy,
            className: "cs-field__control"
          }
        ),
        error ? /* @__PURE__ */ jsx("span", { id: errorId, className: "cs-field__error", role: "alert", children: error }) : null
      ]
    }
  );
});
export {
  TextField
};
