import React from "react";

let FieldContext;
/** Association metadata only; form values and validation stay in Form's controller. */
export function fieldAssociationContext() {
  if (!FieldContext) FieldContext = React.createContext(null);
  return FieldContext;
}
export function mergeIds(...values) {
  return [...new Set(values.filter(Boolean).flatMap(value => String(value).trim().split(/\s+/)).filter(Boolean))].join(" ") || undefined;
}
export function associateFieldProps(props, field, { id, fallbackLabel, requiredSupported = false, nativeRequired = false } = {}) {
  const explicitLabel = typeof props["aria-label"] === "string" && props["aria-label"].trim() ? props["aria-label"] : undefined;
  const labelledBy = mergeIds(props["aria-labelledby"]) || (!explicitLabel ? field?.labelId : undefined);
  const result = { ...props, id: props.id ?? id ?? field?.controlId,
    "aria-labelledby": labelledBy,
    "aria-label": explicitLabel ?? (labelledBy ? undefined : fallbackLabel),
    "aria-describedby": mergeIds(props["aria-describedby"], field?.descriptionId, field?.errorId),
    "aria-invalid": field?.invalid ? true : props["aria-invalid"],
  };
  if (requiredSupported) result["aria-required"] = field?.required ? true : props["aria-required"];
  if (nativeRequired) result.required = field?.required ? true : props.required;
  return result;
}
export function useFieldAssociation(props = {}, options = {}) {
  const field = React.useContext(fieldAssociationContext());
  const generated = React.useId();
  // A field may contain several participating controls. Share descriptions, never IDs.
  const id = props.id ?? options.id ?? generated;
  const hasError = Boolean(options.error) || options.error === 0;
  const hasDescription = Boolean(options.description) || options.description === 0;
  const result = associateFieldProps(props, field, { ...options, id });
  result["aria-describedby"] = mergeIds(result["aria-describedby"], hasDescription ? id + "-description" : undefined, hasError ? id + "-error" : undefined, options.requiredDescription ? id + "-required" : undefined);
  if (hasError) result["aria-invalid"] = true;
  if (options.requiredSupported && options.required) result["aria-required"] = true;
  if (options.nativeRequired && options.required) result.required = true;
  return result;
}
export function fieldMessages(control, description, error, requiredDescription) {
  const hasError = Boolean(error) || error === 0;
  const hasDescription = Boolean(description) || description === 0;
  return React.createElement(React.Fragment, null,
    requiredDescription ? React.createElement("span", { id: control.id + "-required", style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" } }, requiredDescription) : null,
    hasDescription ? React.createElement("span", { id: control.id + "-description", className: "cs-field__description" }, description) : null,
    hasError ? React.createElement("span", { id: control.id + "-error", className: "cs-field__error", role: "alert" }, error) : null);
}
/** Internal handlers run first; target bags cannot replace owned semantics/state. */
export function mergeTargetProps(base = {}, extra = {}, protectedKeys = []) {
  const denied = new Set(["__proto__", "constructor", "prototype", "ref", "key", "children", "dangerouslySetInnerHTML", ...protectedKeys]);
  const result = { ...base };
  for (const [key, value] of Object.entries(extra || {})) {
    if (denied.has(key) || value === undefined) continue;
    if (key === "className") result.className = [base.className, value].filter(Boolean).join(" ");
    else if (key === "style") result.style = { ...base.style, ...value };
    else if (/^on[A-Z]/.test(key) && typeof base[key] === "function") {
      if (typeof value === "function") result[key] = (...args) => { base[key](...args); value(...args); };
    }
    else result[key] = value;
  }
  return result;
}
