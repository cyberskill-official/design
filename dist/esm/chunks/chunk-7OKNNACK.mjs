"use client";
import {
  useFieldAssociation
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/textfield/TextField.jsx
import React from "react";
var TextField = React.forwardRef(function TextField2({
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
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const hasLabel = typeof label === "string" ? label.trim().length > 0 : Boolean(label) || label === 0;
  const labelId = hasLabel ? inputId + "-label" : void 0;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : void 0);
  const descriptionId = hasDescription ? `${inputId}-description` : void 0;
  const errorId = hasError ? `${inputId}-error` : void 0;
  const control = useFieldAssociation(
    { ...props, id: inputId, "aria-labelledby": labelledBy },
    { description, error, nativeRequired: true, requiredSupported: true }
  );
  if (props["aria-labelledby"] != null || props["aria-label"] != null) {
    control["aria-labelledby"] = labelledBy;
    control["aria-label"] = props["aria-label"];
  }
  const invalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";
  return /* @__PURE__ */ React.createElement(
    "label",
    {
      className: cx("cs-field", disabled && "is-disabled", invalid && "is-invalid", className),
      htmlFor: inputId
    },
    /* @__PURE__ */ React.createElement("span", { id: labelId, className: "cs-field__label" }, label),
    hasDescription ? /* @__PURE__ */ React.createElement("span", { id: descriptionId, className: "cs-field__description" }, description) : null,
    /* @__PURE__ */ React.createElement(
      "input",
      {
        ...control,
        id: inputId,
        disabled,
        readOnly,
        "aria-invalid": control["aria-invalid"],
        "aria-labelledby": control["aria-labelledby"],
        "aria-describedby": control["aria-describedby"],
        className: "cs-field__control",
        ref: mergedNativeRef
      }
    ),
    hasError ? /* @__PURE__ */ React.createElement("span", { id: errorId, className: "cs-field__error", role: "alert" }, error) : null
  );
});
TextField.displayName = "TextField";

export {
  TextField
};
//# sourceMappingURL=chunk-7OKNNACK.mjs.map
