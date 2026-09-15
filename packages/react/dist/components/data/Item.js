import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Item = React.forwardRef(function Item2({
  leading,
  trailing,
  title,
  description,
  selected = false,
  disabled = false,
  href,
  onClick,
  children,
  className,
  ...props
}, forwardedRef) {
  const interactive = !disabled && (href != null || typeof onClick === "function");
  const Tag = href != null && !disabled ? "a" : interactive ? "button" : "div";
  const rowProps = { ...props };
  if (Tag === "a") {
    rowProps.href = href;
    if (disabled) rowProps["aria-disabled"] = true;
  } else if (Tag === "button") {
    rowProps.type = "button";
    rowProps.disabled = disabled || void 0;
    rowProps.onClick = onClick;
  } else if (disabled) {
    rowProps["aria-disabled"] = true;
  }
  if (selected) rowProps["aria-current"] = rowProps["aria-current"] ?? "true";
  const trailExplicit = trailing !== void 0;
  const trailNode = trailExplicit ? trailing : title != null ? children : null;
  const mainExtra = trailExplicit ? children : title == null ? children : null;
  return /* @__PURE__ */ jsxs(
    Tag,
    {
      ref: forwardedRef,
      className: cx(
        "cs-item",
        interactive && "cs-item--interactive",
        selected && "is-selected",
        disabled && "is-disabled",
        className
      ),
      ...rowProps,
      children: [
        leading != null ? /* @__PURE__ */ jsx("span", { className: "cs-item__leading", children: leading }) : null,
        /* @__PURE__ */ jsxs("span", { className: "cs-item__main", children: [
          title != null ? /* @__PURE__ */ jsx("span", { className: "cs-item__title", children: title }) : null,
          description != null ? /* @__PURE__ */ jsx("span", { className: "cs-item__description", children: description }) : null,
          mainExtra
        ] }),
        trailNode != null && trailNode !== false ? /* @__PURE__ */ jsx("span", { className: "cs-item__trailing", children: trailNode }) : null
      ]
    }
  );
});
export {
  Item
};
