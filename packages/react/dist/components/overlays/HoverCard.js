import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const HoverCard = React.forwardRef(function HoverCard2({ trigger, children, openDelay = 150, closeDelay = 200, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const t1 = React.useRef();
  const t2 = React.useRef();
  const show = () => {
    clearTimeout(t2.current);
    t1.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    clearTimeout(t1.current);
    t2.current = setTimeout(() => setOpen(false), closeDelay);
  };
  React.useEffect(() => () => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
  }, []);
  return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-hovercard", className), onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide, children: [
    trigger,
    open ? /* @__PURE__ */ jsx("span", { className: "cs-hovercard__panel", role: "dialog", children }) : null
  ] });
});
export {
  HoverCard
};
