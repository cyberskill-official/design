import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Dock — icon dock with hover magnification. items: {icon,label,onSelect,active}. */
export const Dock = React.forwardRef(function Dock({ items = [], label, className , rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [hov, setHov] = React.useState(null);
  return (
    <div {...mergeTargetProps({ "className": cx("cs-dock", className), "onMouseLeave": () => setHov(null) }, rootProps, ["role","aria-label"])} role="toolbar" aria-label={label}  ref={mergedNativeRef} >
      {items.map((it, i) => {
        const d = hov == null ? 3 : Math.abs(i - hov);
        const scale = d === 0 ? 1.35 : d === 1 ? 1.15 : 1;
        return (
          <button key={i} type="button" className={cx("cs-dock__item", it.active && "is-active")} aria-label={it.label} title={it.label}
            style={{ transform: `scale(${scale}) translateY(${d === 0 ? -6 : d === 1 ? -2 : 0}px)` }}
            onMouseEnter={() => setHov(i)} onFocus={() => setHov(i)} onBlur={() => setHov(null)} onClick={() => it.onSelect && it.onSelect()}>
            {it.icon}
          </button>
        );
      })}
    </div>
  );
});
Dock.displayName = "Dock";
