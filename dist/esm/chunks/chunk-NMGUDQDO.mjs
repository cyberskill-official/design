"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Card.jsx
import React from "react";
var Card = React.forwardRef(function Card2({ interactive = false, flat = false, as, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const Tag = as || (interactive ? "button" : "div");
  return /* @__PURE__ */ React.createElement(Tag, { type: Tag === "button" ? "button" : void 0, className: cx("cs-card", flat && "cs-card--flat", interactive && "cs-card--interactive", className), ...props, ref: mergedNativeRef }, children);
});
Card.displayName = "Card";
var CardHeader = React.forwardRef(function CardHeader2({ title, subtitle, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { className: cx("cs-card__header", className), ...props, ref: mergedNativeRef }, title || title === 0 ? /* @__PURE__ */ React.createElement("h3", { className: "cs-card__title" }, title) : null, subtitle || subtitle === 0 ? /* @__PURE__ */ React.createElement("p", { className: "cs-card__subtitle" }, subtitle) : null, children);
});
CardHeader.displayName = "CardHeader";
var CardBody = React.forwardRef(function CardBody2({ className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { className: cx("cs-card__body", className), ...props, ref: mergedNativeRef }, children);
});
CardBody.displayName = "CardBody";
var CardFooter = React.forwardRef(function CardFooter2({ className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { className: cx("cs-card__footer", className), ...props, ref: mergedNativeRef }, children);
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter
};
//# sourceMappingURL=chunk-NMGUDQDO.mjs.map
