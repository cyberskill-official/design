"use client";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Dock.jsx
import React from "react";
var Dock = React.forwardRef(function Dock2({ items = [], label, className, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [hov, setHov] = React.useState(null);
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": cx("cs-dock", className), "onMouseLeave": () => setHov(null) }, rootProps, ["role", "aria-label"]), role: "toolbar", "aria-label": label, ref: mergedNativeRef }, items.map((it, i) => {
    const d = hov == null ? 3 : Math.abs(i - hov);
    const scale = d === 0 ? 1.35 : d === 1 ? 1.15 : 1;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        type: "button",
        className: cx("cs-dock__item", it.active && "is-active"),
        "aria-label": it.label,
        title: it.label,
        style: { transform: `scale(${scale}) translateY(${d === 0 ? -6 : d === 1 ? -2 : 0}px)` },
        onMouseEnter: () => setHov(i),
        onFocus: () => setHov(i),
        onBlur: () => setHov(null),
        onClick: () => it.onSelect && it.onSelect()
      },
      it.icon
    );
  }));
});
Dock.displayName = "Dock";

export {
  Dock
};
//# sourceMappingURL=chunk-WVSM6INE.mjs.map
