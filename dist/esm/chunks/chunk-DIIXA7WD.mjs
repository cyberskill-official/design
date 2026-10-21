"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Breadcrumb.jsx
import React from "react";
var Breadcrumb = React.forwardRef(function Breadcrumb2({ items = [], lang, className, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  return /* @__PURE__ */ React.createElement("nav", { ref: mergedNativeRef, "aria-label": makeT("Breadcrumb", L, localeMessages)("label"), ...props }, /* @__PURE__ */ React.createElement("ol", { className: cx("cs-breadcrumb", className) }, items.map((it, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ React.createElement("li", { key: i }, last ? /* @__PURE__ */ React.createElement("span", { className: "cs-breadcrumb__current", "aria-current": "page" }, it.label) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", { href: it.href || "#" }, it.label), /* @__PURE__ */ React.createElement("span", { className: "cs-breadcrumb__sep", "aria-hidden": "true" }, "/")));
  })));
});
Breadcrumb.displayName = "Breadcrumb";

export {
  Breadcrumb
};
//# sourceMappingURL=chunk-DIIXA7WD.mjs.map
