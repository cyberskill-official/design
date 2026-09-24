import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const FloatingActionButton = React.forwardRef(function FloatingActionButton2({ icon, label, actions = [], onClick, position = "fixed", className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const main = () => {
    if (actions.length) setOpen((o) => !o);
    else onClick && onClick();
  };
  return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-fab", position === "static" && "cs-fab--static", className), children: [
    open && actions.length ? /* @__PURE__ */ jsx("div", { className: "cs-fab__dial", children: actions.map((a, i) => /* @__PURE__ */ jsx("button", { type: "button", className: "cs-fab__mini", "aria-label": a.label, title: a.label, onClick: () => {
      setOpen(false);
      a.onSelect && a.onSelect();
    }, children: a.icon }, i)) }) : null,
    /* @__PURE__ */ jsx("button", { type: "button", className: "cs-fab__main", "aria-label": label, "aria-expanded": actions.length ? open : void 0, onClick: main, children: icon })
  ] });
});
export {
  FloatingActionButton
};
