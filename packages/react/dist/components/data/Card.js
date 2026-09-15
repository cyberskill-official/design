import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Card = React.forwardRef(function Card2({ interactive = false, flat = false, as, className, children, ...props }, forwardedRef) {
  const Tag = as || (interactive ? "button" : "div");
  return /* @__PURE__ */ jsx(Tag, { ref: forwardedRef, className: cx("cs-card", flat && "cs-card--flat", interactive && "cs-card--interactive", className), ...props, children });
});
const CardHeader = React.forwardRef(function CardHeader2({ title, subtitle, children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-card__header", className), ...props, children: [
    title ? /* @__PURE__ */ jsx("h3", { className: "cs-card__title", children: title }) : null,
    subtitle ? /* @__PURE__ */ jsx("p", { className: "cs-card__subtitle", children: subtitle }) : null,
    children
  ] });
});
const CardBody = React.forwardRef(function CardBody2({ className, children, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-card__body", className), ...props, children });
});
const CardFooter = React.forwardRef(function CardFooter2({ className, children, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-card__footer", className), ...props, children });
});
export {
  Card,
  CardBody,
  CardFooter,
  CardHeader
};
