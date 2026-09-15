import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
function Row({ n, depth, columns, expanded, setExpanded }) {
  const kids = n.children || [];
  const open = expanded.includes(n.key);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("tr", { children: columns.map((c, i) => /* @__PURE__ */ jsx("td", { children: i === 0 ? /* @__PURE__ */ jsxs("span", { className: "cs-treetable__cell", style: { paddingInlineStart: depth * 18 }, children: [
      kids.length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-tree__twist", "aria-expanded": open, onClick: () => setExpanded(open ? expanded.filter((k) => k !== n.key) : [...expanded, n.key]), children: open ? "\u25BE" : "\u25B8" }) : /* @__PURE__ */ jsx("span", { className: "cs-tree__twist", "aria-hidden": "true" }),
      c.render ? c.render(n) : n[c.key]
    ] }) : c.render ? c.render(n) : n[c.key] }, c.key)) }),
    open ? kids.map((k) => /* @__PURE__ */ jsx(Row, { n: k, depth: depth + 1, columns, expanded, setExpanded }, k.key)) : null
  ] });
}
const TreeTable = React.forwardRef(function TreeTable2({ columns = [], nodes = [], caption, defaultExpanded = [], lang, className }, forwardedRef) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [ref, L] = useLang(lang);
  const t = makeT("DataGrid", L);
  return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-table-wrap", className), children: /* @__PURE__ */ jsxs("table", { className: "cs-table cs-treetable", children: [
    caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsx("th", { scope: "col", children: c.header }, c.key)) }) }),
    /* @__PURE__ */ jsx("tbody", { children: nodes.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "cs-table__empty", children: t("empty") }) }) : nodes.map((n) => /* @__PURE__ */ jsx(Row, { n, depth: 0, columns, expanded, setExpanded }, n.key)) })
  ] }) });
});
export {
  TreeTable
};
