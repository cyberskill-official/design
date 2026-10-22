"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Collapsible.jsx
import React from "react";
var Collapsible = React.forwardRef(function Collapsible2({
  controlRef,
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  trigger,
  children,
  className,
  ...props
}, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const uncontrolled = open === void 0;
  const [internal, setInternal] = React.useState(!!defaultOpen);
  const isOpen = uncontrolled ? internal : !!open;
  const setOpen = (next) => {
    if (uncontrolled) setInternal(next);
    onOpenChange?.(next);
  };
  const label = title ?? trigger;
  const panelId = React.useId();
  const triggerId = React.useId();
  return /* @__PURE__ */ React.createElement("div", { className: cx("cs-collapsible", className), ...props, ref: mergedNativeRef }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      id: triggerId,
      className: "cs-collapsible__trigger",
      "aria-expanded": isOpen,
      "aria-controls": isOpen ? panelId : void 0,
      onClick: () => setOpen(!isOpen),
      ref: mergedControlRef
    },
    /* @__PURE__ */ React.createElement("span", { className: "cs-collapsible__label" }, label),
    /* @__PURE__ */ React.createElement("span", { className: "cs-collapsible__chevron", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 9l6 6 6-6" })))
  ), isOpen ? /* @__PURE__ */ React.createElement("div", { id: panelId, role: "region", "aria-labelledby": triggerId, className: "cs-collapsible__panel" }, children) : null);
});
Collapsible.displayName = "Collapsible";

export {
  Collapsible
};
//# sourceMappingURL=chunk-OC3WK36Y.mjs.map
