import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Skeleton } from "../feedback/Skeleton.jsx";
import { Result } from "../feedback/Result.jsx";
import { cx } from "../_utils/cx.js";
const DataTable = React.forwardRef(function DataTable2({
  caption,
  columns,
  rows,
  rowKey = "id",
  emptyState,
  state = "idle",
  errorState,
  loadingState,
  loadingRows = 5,
  lang,
  className
}, forwardedRef) {
  const normalized = Array.isArray(rows) ? rows : [];
  const [ref, L] = useLang(lang);
  const t = makeT("DataTable", L);
  const es = emptyState != null ? emptyState : t("empty");
  const colCount = Math.max(1, columns && columns.length || 1);
  if (state === "loading") {
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-table-wrap", className), "aria-busy": "true", children: [
      /* @__PURE__ */ jsx("span", { className: "cs-sr-only", children: t("loading") }),
      loadingState != null ? loadingState : /* @__PURE__ */ jsxs("table", { className: "cs-table", children: [
        caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: (columns || []).map((c) => /* @__PURE__ */ jsx("th", { scope: "col", children: c.header }, c.key)) }) }),
        /* @__PURE__ */ jsx("tbody", { "aria-hidden": "true", children: Array.from({ length: Math.max(1, loadingRows) }).map((_, i) => /* @__PURE__ */ jsx("tr", { children: Array.from({ length: colCount }).map((__, j) => /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Skeleton, { lines: 1 }) }, j)) }, i)) })
      ] })
    ] });
  }
  if (state === "error") {
    return /* @__PURE__ */ jsx("div", { ref, className: cx("cs-table-wrap", "cs-table-wrap--status", className), role: "alert", children: errorState != null ? errorState : /* @__PURE__ */ jsx(Result, { status: "error", lang: L, title: t("error"), children: t("errorHint") }) });
  }
  return /* @__PURE__ */ jsx("div", { ref, className: cx("cs-table-wrap", className), children: /* @__PURE__ */ jsxs("table", { className: "cs-table", children: [
    caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: (columns || []).map((c) => /* @__PURE__ */ jsx("th", { scope: "col", children: c.header }, c.key)) }) }),
    /* @__PURE__ */ jsx("tbody", { children: normalized.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: colCount, className: "cs-table__empty", children: es }) }) : normalized.map((row, i) => /* @__PURE__ */ jsx("tr", { children: (columns || []).map((c) => /* @__PURE__ */ jsx("td", { children: c.render ? c.render(row) : row[c.key] }, c.key)) }, row[rowKey] ?? i)) })
  ] }) });
});
export {
  DataTable
};
