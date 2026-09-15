import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill DescriptionList — term/value metadata grid. */
export const DescriptionList = React.forwardRef(function DescriptionList({ items = [], className, ...props }, forwardedRef) {
  return (
    <dl ref={forwardedRef} className={cx("cs-dl", className)} {...props}>
      {items.map((it, i) => (
        <div key={i}>
          <dt>{it.term}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
});
