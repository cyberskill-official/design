import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const SegmentedControl = React.forwardRef(function SegmentedControl2({ options = [], value, onChange, className, ...props }, forwardedRef) {
  const refs = React.useRef([]);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const key = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % options.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + options.length) % options.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = options.length - 1;
    if (n == null) return;
    e.preventDefault();
    if (onChange) onChange(options[n].value);
    const b = refs.current[n];
    if (b) b.focus();
  };
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, role: "tablist", className: cx("cs-segmented", className), ...props, children: options.map((o, i) => /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": value === o.value,
      tabIndex: i === idx ? 0 : -1,
      ref: (el) => refs.current[i] = el,
      onKeyDown: (e) => key(e, i),
      onClick: () => onChange && onChange(o.value),
      children: [
        o.icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: o.icon }) : null,
        o.label
      ]
    },
    o.value
  )) });
});
export {
  SegmentedControl
};
