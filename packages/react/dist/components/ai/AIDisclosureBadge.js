import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const AIDisclosureBadge = React.forwardRef(function AIDisclosureBadge2({
  label = "AI assisted",
  details = "This content was generated or transformed with AI assistance.",
  sources = [],
  className
}, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const sourceList = (sources || []).filter(Boolean);
  return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-ai-disclosure", className), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "cs-ai-disclosure__badge",
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: () => setOpen((v) => !v),
        children: label
      }
    ),
    open ? /* @__PURE__ */ jsxs("span", { id: panelId, role: "status", className: "cs-ai-disclosure__panel", children: [
      /* @__PURE__ */ jsx("span", { className: "cs-ai-disclosure__details", children: details }),
      sourceList.length ? /* @__PURE__ */ jsxs("span", { className: "cs-ai-disclosure__sources", children: [
        "Sources: ",
        sourceList.join(", ")
      ] }) : null
    ] }) : null
  ] });
});
export {
  AIDisclosureBadge
};
