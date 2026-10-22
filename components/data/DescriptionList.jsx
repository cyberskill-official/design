import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill DescriptionList — term/value metadata grid. */
export const DescriptionList = React.forwardRef(function DescriptionList({ items = [], className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return (
    <dl className={cx("cs-dl", className)} {...props} ref={mergedNativeRef} >
      {items.map((it, i) => (
        <div key={i}>
          <dt>{it.term}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
});
DescriptionList.displayName = "DescriptionList";
