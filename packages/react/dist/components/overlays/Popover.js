import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Popover = React.forwardRef(function Popover2({ trigger, children, align = "start", open: controlled, onOpenChange, className }, forwardedRef) {
  const [u, setU] = React.useState(false);
  const open = controlled != null ? controlled : u;
  const set = (v) => onOpenChange ? onOpenChange(v) : setU(v);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (ref.current && !ref.current.contains(e.target)) set(false);
    };
    const k = (e) => {
      if (e.key === "Escape") set(false);
    };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", d);
      document.removeEventListener("keydown", k);
    };
  }, [open]);
  const toggle = () => set(!open);
  const triggerNode = React.isValidElement(trigger) ? React.cloneElement(trigger, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onClick: (e) => {
      if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
      if (!e.defaultPrevented) toggle();
    }
  }) : /* @__PURE__ */ jsx("button", { type: "button", "aria-haspopup": "dialog", "aria-expanded": open, onClick: toggle, children: trigger });
  return /* @__PURE__ */ jsxs("span", { className: cx("cs-popover", className), ref, children: [
    triggerNode,
    open ? /* @__PURE__ */ jsx("div", { className: cx("cs-popover__panel", align === "end" && "cs-popover__panel--end"), role: "dialog", children }) : null
  ] });
});
export {
  Popover
};
