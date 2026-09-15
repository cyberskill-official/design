import { jsx } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Dock = React.forwardRef(function Dock2({ items = [], label, className }, forwardedRef) {
  const [hov, setHov] = React.useState(null);
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-dock", className), role: "toolbar", "aria-label": label, onMouseLeave: () => setHov(null), children: items.map((it, i) => {
    const d = hov == null ? 3 : Math.abs(i - hov);
    const scale = d === 0 ? 1.35 : d === 1 ? 1.15 : 1;
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: cx("cs-dock__item", it.active && "is-active"),
        "aria-label": it.label,
        title: it.label,
        style: { transform: `scale(${scale}) translateY(${d === 0 ? -6 : d === 1 ? -2 : 0}px)` },
        onMouseEnter: () => setHov(i),
        onFocus: () => setHov(i),
        onBlur: () => setHov(null),
        onClick: () => it.onSelect && it.onSelect(),
        children: it.icon
      },
      i
    );
  }) });
});
export {
  Dock
};
