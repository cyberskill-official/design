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

// components/data/Timeline.jsx
import React from "react";
var Timeline = React.forwardRef(function Timeline2({ items = [], className, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ className: cx("cs-timeline", className) }, rootProps), ref: mergedNativeRef }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: cx("cs-timeline__item", it.state === "now" && "cs-timeline__item--now", it.state === "todo" && "cs-timeline__item--todo") }, /* @__PURE__ */ React.createElement("span", { className: "cs-timeline__marker", "aria-hidden": "true" }, it.state === "todo" ? "" : it.state === "now" ? "→" : "✓"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cs-timeline__title" }, it.title), it.meta || it.meta === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-timeline__meta" }, it.meta) : null, it.body || it.body === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-timeline__body" }, it.body) : null))));
});
Timeline.displayName = "Timeline";

export {
  Timeline
};
//# sourceMappingURL=chunk-AX4JJKTY.mjs.map
