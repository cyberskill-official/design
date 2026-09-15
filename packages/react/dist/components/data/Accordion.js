import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Accordion = React.forwardRef(function Accordion2({ items = [], defaultOpen = 0, allowMultiple = false, className }, forwardedRef) {
  const [open, setOpen] = React.useState(() => allowMultiple ? defaultOpen != null ? [defaultOpen] : [] : defaultOpen);
  const isOpen = (i) => allowMultiple ? open.includes(i) : open === i;
  const toggle = (i) => {
    if (allowMultiple) setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i]);
    else setOpen((o) => o === i ? -1 : i);
  };
  return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-accordion", className), children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: "cs-accordion__item", children: [
    /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-accordion__trigger", "aria-expanded": isOpen(i), onClick: () => toggle(i), children: [
      it.title,
      /* @__PURE__ */ jsx("span", { className: "cs-accordion__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
    ] }),
    isOpen(i) ? /* @__PURE__ */ jsx("div", { className: "cs-accordion__panel", children: it.content }) : null
  ] }, i)) });
});
export {
  Accordion
};
