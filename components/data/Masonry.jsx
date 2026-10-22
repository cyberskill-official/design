import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Masonry — column-packed gallery (CSS columns). */
export const Masonry = React.forwardRef(function Masonry({ columns = 3, gap = 16, children, className, style , rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return (
    <div {...mergeTargetProps({ "className": cx("cs-masonry", className) }, rootProps, [])} style={{ ...rootProps?.style, ...({ columnCount: columns, columnGap: gap, ...style }) }}  ref={mergedNativeRef} >
      {React.Children.map(children, (c) => <div className="cs-masonry__item" style={{ marginBottom: gap }}>{c}</div>)}
    </div>
  );
});
Masonry.displayName = "Masonry";
