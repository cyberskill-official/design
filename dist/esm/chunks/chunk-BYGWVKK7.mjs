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

// components/data/Accordion.jsx
import React from "react";
var Accordion = React.forwardRef(function Accordion2({ items = [], defaultOpen = 0, allowMultiple = false, className, rootProps }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const id = React.useId();
  const [open, setOpen] = React.useState(() => defaultOpen != null && defaultOpen >= 0 ? [defaultOpen] : []);
  React.useEffect(() => {
    if (!allowMultiple) setOpen((current) => current.length > 1 ? current.slice(0, 1) : current);
  }, [allowMultiple]);
  const isOpen = (i) => allowMultiple ? open.includes(i) : open[0] === i;
  const toggle = (i) => {
    if (allowMultiple) setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i]);
    else setOpen((o) => o[0] === i ? [] : [i]);
  };
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": cx("cs-accordion", className) }, rootProps, []), ref: mergedNativeRef }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { className: "cs-accordion__item", key: i }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, font: "inherit" } }, /* @__PURE__ */ React.createElement("button", { id: `${id}-trigger-${i}`, type: "button", className: "cs-accordion__trigger", "aria-expanded": isOpen(i), "aria-controls": isOpen(i) ? `${id}-panel-${i}` : void 0, onClick: () => toggle(i) }, it.title, /* @__PURE__ */ React.createElement("span", { className: "cs-accordion__chevron", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 9l6 6 6-6" }))))), isOpen(i) ? /* @__PURE__ */ React.createElement("div", { id: `${id}-panel-${i}`, "aria-labelledby": `${id}-trigger-${i}`, className: "cs-accordion__panel" }, it.content) : null)));
});
Accordion.displayName = "Accordion";

export {
  Accordion
};
//# sourceMappingURL=chunk-BYGWVKK7.mjs.map
