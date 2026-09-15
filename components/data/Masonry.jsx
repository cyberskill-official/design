import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Masonry — column-packed gallery (CSS columns). */
export const Masonry = React.forwardRef(function Masonry({ columns = 3, gap = 16, children, className, style }, forwardedRef) {
  return (
    <div ref={forwardedRef} className={cx("cs-masonry", className)} style={{ columnCount: columns, columnGap: gap, ...style }}>
      {React.Children.map(children, (c) => <div className="cs-masonry__item" style={{ marginBottom: gap }}>{c}</div>)}
    </div>
  );
});
