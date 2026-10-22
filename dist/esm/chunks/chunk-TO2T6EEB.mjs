"use client";
import {
  Skeleton
} from "./chunk-ZULGQYO7.mjs";
import {
  Result
} from "./chunk-TGYG7JP4.mjs";
import {
  renderCount
} from "./chunk-5MIGZVWB.mjs";
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

// components/datatable/DataTable.jsx
import React from "react";
var DataTable = React.forwardRef(function DataTable2({
  caption,
  columns,
  rows,
  rowKey = "id",
  emptyState,
  state = "idle",
  errorState,
  loadingState,
  loadingRows: requestedLoadingRows = 5,
  lang,
  className,
  rootProps
}, forwardedRef) {
  const normalized = Array.isArray(rows) ? rows : [];
  const loadingRows = renderCount(requestedLoadingRows, 5, 1);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("DataTable", L, localeMessages);
  const es = emptyState != null ? emptyState : t("empty");
  const colCount = Math.max(1, columns && columns.length || 1);
  if (state === "loading") {
    return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-table-wrap", className) }, rootProps, ["aria-busy", "role"]), "aria-busy": "true" }, /* @__PURE__ */ React.createElement("span", { className: "cs-sr-only" }, t("loading")), loadingState != null ? loadingState : /* @__PURE__ */ React.createElement("table", { className: "cs-table" }, caption || caption === 0 ? /* @__PURE__ */ React.createElement("caption", null, caption) : null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, (columns || []).map((c) => /* @__PURE__ */ React.createElement("th", { key: c.key, scope: "col" }, c.header)))), /* @__PURE__ */ React.createElement("tbody", { "aria-hidden": "true" }, Array.from({ length: loadingRows }).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: i }, Array.from({ length: colCount }).map((__, j) => /* @__PURE__ */ React.createElement("td", { key: j }, /* @__PURE__ */ React.createElement(Skeleton, { lines: 1 }))))))));
  }
  if (state === "error") {
    return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-table-wrap", "cs-table-wrap--status", className) }, rootProps, ["aria-busy", "role"]), role: "alert" }, errorState != null ? errorState : /* @__PURE__ */ React.createElement(Result, { status: "error", lang: L, title: t("error") }, t("errorHint")));
  }
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-table-wrap", className) }, rootProps, ["aria-busy", "role"]) }, /* @__PURE__ */ React.createElement("table", { className: "cs-table" }, caption || caption === 0 ? /* @__PURE__ */ React.createElement("caption", null, caption) : null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, (columns || []).map((c) => /* @__PURE__ */ React.createElement("th", { key: c.key, scope: "col" }, c.header)))), /* @__PURE__ */ React.createElement("tbody", null, normalized.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: colCount, className: "cs-table__empty" }, es)) : normalized.map((row, i) => /* @__PURE__ */ React.createElement("tr", { key: row[rowKey] ?? i }, (columns || []).map((c) => /* @__PURE__ */ React.createElement("td", { key: c.key }, c.render ? c.render(row) : row[c.key])))))));
});
DataTable.displayName = "DataTable";

export {
  DataTable
};
//# sourceMappingURL=chunk-TO2T6EEB.mjs.map
