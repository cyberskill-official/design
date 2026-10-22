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

// components/datatable/TreeTable.jsx
import React from "react";
function nodeRowId(prefix, key) {
  return prefix + "-row-" + String(key).split("").map((unit) => unit.charCodeAt(0).toString(16).padStart(4, "0")).join("");
}
function Row({ n, depth, columns, expanded, setExpanded, t, treeId }) {
  const labelId = React.useId();
  const actionId = labelId + "-action";
  const rowId = nodeRowId(treeId, n.key);
  const kids = n.children || [];
  const open = expanded.includes(n.key);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("tr", { id: rowId }, columns.map((c, i) => /* @__PURE__ */ React.createElement("td", { key: c.key }, i === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-treetable__cell", style: { paddingInlineStart: depth * 18 } }, kids.length ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-tree__twist", "aria-expanded": open, "aria-controls": open ? kids.map((child) => nodeRowId(treeId, child.key)).join(" ") : void 0, "aria-labelledby": actionId + " " + labelId, onClick: () => setExpanded((current) => current.includes(n.key) ? current.filter((k) => k !== n.key) : [...current, n.key]) }, /* @__PURE__ */ React.createElement("span", { id: actionId, className: "cs-sr-only" }, t(open ? "collapse" : "expand")), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, open ? "▾" : "▸")) : /* @__PURE__ */ React.createElement("span", { className: "cs-tree__twist", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { id: labelId }, c.render ? c.render(n) : n[c.key])) : c.render ? c.render(n) : n[c.key]))), open ? kids.map((k) => /* @__PURE__ */ React.createElement(Row, { key: k.key, n: k, depth: depth + 1, columns, expanded, setExpanded, t, treeId })) : null);
}
var TreeTable = React.forwardRef(function TreeTable2({ columns = [], nodes = [], caption, defaultExpanded = [], lang, className, rootProps }, forwardedRef) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const treeId = React.useId();
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("TreeTable", L, localeMessages);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-table-wrap", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement("table", { className: "cs-table cs-treetable" }, caption || caption === 0 ? /* @__PURE__ */ React.createElement("caption", null, caption) : null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, columns.map((c) => /* @__PURE__ */ React.createElement("th", { key: c.key, scope: "col" }, c.header)))), /* @__PURE__ */ React.createElement("tbody", null, nodes.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: columns.length, className: "cs-table__empty" }, t("empty"))) : nodes.map((n) => /* @__PURE__ */ React.createElement(Row, { key: n.key, n, depth: 0, columns, expanded, setExpanded, t, treeId })))));
});
TreeTable.displayName = "TreeTable";

export {
  TreeTable
};
//# sourceMappingURL=chunk-3MCNCG2L.mjs.map
