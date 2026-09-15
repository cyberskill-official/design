import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const NavigationMenu = React.forwardRef(function NavigationMenu2({ items = [], className }, forwardedRef) {
  const [open, setOpen] = React.useState(null);
  const wrap = React.useRef(null);
  React.useEffect(() => {
    if (open == null) return;
    const d = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(null);
    };
    const k = (e) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", d);
      document.removeEventListener("keydown", k);
    };
  }, [open]);
  return /* @__PURE__ */ jsx("nav", { ref: wrap, className: cx("cs-navmenu", className), children: items.map((it, i) => it.panel ? /* @__PURE__ */ jsxs("span", { className: "cs-navmenu__wrap", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: cx("cs-navmenu__top", open === i && "is-open"),
        "aria-expanded": open === i,
        "aria-haspopup": "true",
        onClick: () => setOpen(open === i ? null : i),
        onMouseEnter: () => {
          if (open != null && open !== i) setOpen(i);
        },
        children: [
          it.label,
          " ",
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u25BE" })
        ]
      }
    ),
    open === i ? /* @__PURE__ */ jsx("span", { className: "cs-navmenu__panel", children: it.panel.map((p, j) => /* @__PURE__ */ jsxs("a", { href: p.href || "#", className: "cs-navmenu__card", onClick: () => setOpen(null), children: [
      /* @__PURE__ */ jsx("b", { children: p.label }),
      p.desc ? /* @__PURE__ */ jsx("small", { children: p.desc }) : null
    ] }, j)) }) : null
  ] }, i) : /* @__PURE__ */ jsx("a", { href: it.href || "#", className: "cs-navmenu__top", children: it.label }, i)) });
});
export {
  NavigationMenu
};
