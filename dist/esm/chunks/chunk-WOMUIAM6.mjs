"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/List.jsx
import React from "react";
var List = React.forwardRef(function List2({ className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("div", { role: "list", className: cx("cs-list", className), ...props, ref: mergedNativeRef }, children);
});
List.displayName = "List";
var ListItem = React.forwardRef(function ListItem2({ lead, title, subtitle, trail, onClick, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const interactive = !!onClick;
  const Tag = interactive ? "button" : "div";
  const row = /* @__PURE__ */ React.createElement(Tag, { ref: interactive ? void 0 : mergedNativeRef, type: Tag === "button" ? "button" : void 0, role: interactive ? void 0 : "listitem", className: cx("cs-list__item", interactive && "cs-list__item--button", className), onClick, ...props }, lead != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-list__lead" }, lead) : null, /* @__PURE__ */ React.createElement("span", { className: "cs-list__main" }, title != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-list__title" }, title) : null, subtitle != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-list__sub" }, subtitle) : null, children), trail != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-list__trail" }, trail) : null);
  return interactive ? /* @__PURE__ */ React.createElement("div", { role: "listitem", ref: mergedNativeRef }, row) : row;
});
ListItem.displayName = "ListItem";

export {
  List,
  ListItem
};
//# sourceMappingURL=chunk-WOMUIAM6.mjs.map
