"use client";
import {
  mergeIds
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/Checkbox.jsx
import React from "react";
var Checkbox = React.forwardRef(function Checkbox2({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const generatedId = React.useId();
  const hasLabel = Boolean(label) || label === 0;
  const hasDescription = Boolean(description) || description === 0;
  const labelId = hasLabel ? generatedId + "-label" : void 0;
  const descriptionId = hasDescription ? generatedId + "-description" : void 0;
  const labelledBy = props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : void 0);
  const describedBy = mergeIds(props["aria-describedby"], descriptionId);
  return /* @__PURE__ */ React.createElement("label", { className: cx("cs-check", disabled && "is-disabled", className) }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", disabled, ...props, "aria-labelledby": labelledBy, "aria-describedby": describedBy, ref: mergedNativeRef }), /* @__PURE__ */ React.createElement("span", { className: "cs-check__text" }, /* @__PURE__ */ React.createElement("span", { id: labelId }, label), description || description === 0 ? /* @__PURE__ */ React.createElement("span", { id: descriptionId, className: "cs-check__desc" }, description) : null));
});
Checkbox.displayName = "Checkbox";

export {
  Checkbox
};
//# sourceMappingURL=chunk-YJDC6NPP.mjs.map
