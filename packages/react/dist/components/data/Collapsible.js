import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Collapsible = React.forwardRef(function Collapsible2({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  trigger,
  children,
  className,
  ...props
}, forwardedRef) {
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
  return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-collapsible", className), ...props, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        id: triggerId,
        className: "cs-collapsible__trigger",
        "aria-expanded": isOpen,
        "aria-controls": panelId,
        onClick: () => setOpen(!isOpen),
        children: [
          /* @__PURE__ */ jsx("span", { className: "cs-collapsible__label", children: label }),
          /* @__PURE__ */ jsx("span", { className: "cs-collapsible__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
        ]
      }
    ),
    isOpen ? /* @__PURE__ */ jsx("div", { id: panelId, role: "region", "aria-labelledby": triggerId, className: "cs-collapsible__panel", children }) : null
  ] });
});
export {
  Collapsible
};
