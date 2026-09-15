import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const CodeBlock = React.forwardRef(function CodeBlock2({ code = "", filename, language = "code", showBar = true, className }, forwardedRef) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (e) {
    }
  };
  return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-code", className), children: [
    showBar ? /* @__PURE__ */ jsxs("div", { className: "cs-code__bar", children: [
      /* @__PURE__ */ jsx("span", { children: filename || language }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-code__copy", onClick: copy, children: copied ? "Copied \u2713" : "Copy" })
    ] }) : null,
    /* @__PURE__ */ jsx("pre", { children: /* @__PURE__ */ jsx("code", { children: code }) })
  ] });
});
export {
  CodeBlock
};
