"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Item.jsx
import React from "react";
var Item = React.forwardRef(function Item2({
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
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const interactive = href != null || typeof onClick === "function";
  const Tag = href != null ? "a" : interactive ? "button" : "div";
  const rowProps = { ...props };
  if (Tag === "a") {
    if (disabled) {
      rowProps["aria-disabled"] = "true";
      rowProps.tabIndex = -1;
      rowProps.role = rowProps.role ?? "link";
      rowProps.onClick = (e) => e.preventDefault();
    } else {
      rowProps.href = href;
      rowProps.onClick = onClick;
    }
  } else if (Tag === "button") {
    rowProps.type = "button";
    rowProps.disabled = disabled || void 0;
    rowProps.onClick = !disabled ? onClick : void 0;
  }
  if (selected) rowProps["aria-current"] = rowProps["aria-current"] ?? "true";
  const trailExplicit = trailing !== void 0;
  const trailNode = trailExplicit ? trailing : title != null ? children : null;
  const mainExtra = trailExplicit ? children : title == null ? children : null;
  return /* @__PURE__ */ React.createElement(
    Tag,
    {
      className: cx(
        "cs-item",
        interactive && !disabled && "cs-item--interactive",
        selected && "is-selected",
        disabled && "is-disabled",
        className
      ),
      ...rowProps,
      ref: mergedNativeRef
    },
    leading != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-item__leading" }, leading) : null,
    /* @__PURE__ */ React.createElement("span", { className: "cs-item__main" }, title != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-item__title" }, title) : null, description != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-item__description" }, description) : null, mainExtra),
    trailNode != null && trailNode !== false ? /* @__PURE__ */ React.createElement("span", { className: "cs-item__trailing" }, trailNode) : null
  );
});
Item.displayName = "Item";

export {
  Item
};
//# sourceMappingURL=chunk-JKRH25UE.mjs.map
