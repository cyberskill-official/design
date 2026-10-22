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

// components/data/Masonry.jsx
import React from "react";
var Masonry = React.forwardRef(function Masonry2({ columns = 3, gap = 16, children, className, style, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": cx("cs-masonry", className) }, rootProps, []), style: { ...rootProps?.style, ...{ columnCount: columns, columnGap: gap, ...style } }, ref: mergedNativeRef }, React.Children.map(children, (c) => /* @__PURE__ */ React.createElement("div", { className: "cs-masonry__item", style: { marginBottom: gap } }, c)));
});
Masonry.displayName = "Masonry";

export {
  Masonry
};
//# sourceMappingURL=chunk-SKA3ER65.mjs.map
