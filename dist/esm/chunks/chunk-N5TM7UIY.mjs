"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/ai/CitationList.jsx
import React from "react";
var CitationList = React.forwardRef(function CitationList2({ label, items = [], lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const heading = label !== void 0 ? label : makeT("CitationList", L, localeMessages)("sources");
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-citations", className) }, rootProps, []) }, heading || heading === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-citations__label" }, heading) : null, items.map((it, i) => {
    const inner = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "cs-citation__num" }, i + 1), /* @__PURE__ */ React.createElement("span", { className: "cs-citation__text" }, it.title, it.source || it.source === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-citation__src" }, " · ", it.source) : null));
    return it.href ? /* @__PURE__ */ React.createElement("a", { key: i, className: "cs-citation", href: it.href, target: "_blank", rel: "noreferrer" }, inner) : /* @__PURE__ */ React.createElement("div", { key: i, className: "cs-citation" }, inner);
  }));
});
CitationList.displayName = "CitationList";

export {
  CitationList
};
//# sourceMappingURL=chunk-N5TM7UIY.mjs.map
