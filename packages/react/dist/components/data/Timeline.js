import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Timeline = React.forwardRef(function Timeline2({ items = [], className }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-timeline", className), children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: cx("cs-timeline__item", it.state === "now" && "cs-timeline__item--now", it.state === "todo" && "cs-timeline__item--todo"), children: [
    /* @__PURE__ */ jsx("span", { className: "cs-timeline__marker", "aria-hidden": "true", children: it.state === "todo" ? "" : it.state === "now" ? "\u2192" : "\u2713" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "cs-timeline__title", children: it.title }),
      it.meta ? /* @__PURE__ */ jsx("div", { className: "cs-timeline__meta", children: it.meta }) : null,
      it.body ? /* @__PURE__ */ jsx("div", { className: "cs-timeline__body", children: it.body }) : null
    ] })
  ] }, i)) });
});
export {
  Timeline
};
