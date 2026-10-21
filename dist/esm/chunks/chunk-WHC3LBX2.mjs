"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/DescriptionList.jsx
import React from "react";
var DescriptionList = React.forwardRef(function DescriptionList2({ items = [], className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("dl", { className: cx("cs-dl", className), ...props, ref: mergedNativeRef }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("dt", null, it.term), /* @__PURE__ */ React.createElement("dd", null, it.value))));
});
DescriptionList.displayName = "DescriptionList";

export {
  DescriptionList
};
//# sourceMappingURL=chunk-WHC3LBX2.mjs.map
