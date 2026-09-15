import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { cx } from "../_utils/cx.js";
const DataGrid = React.forwardRef(function DataGrid2({
  columns = [],
  rows = [],
  rowKey = "id",
  selectable = false,
  selected = [],
  onSelect,
  height = 280,
  caption,
  empty,
  lang,
  className,
  filterText,
  filterKeys,
  /** When true (or rows exceed virtualThreshold), only paint a window of rows. */
  virtual = false,
  /** Row threshold that auto-enables virtualization. Default 80. */
  virtualThreshold = 80,
  /** Approximate row height for windowing. Default 36. */
  rowHeight = 36,
  /** localStorage key — when set, column key order is persisted across reloads. */
  persistKey
}, forwardedRef) {
  const [sort, setSort] = React.useState(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [colOrder, setColOrder] = React.useState(() => {
    if (!persistKey) return null;
    try {
      const raw = localStorage.getItem("cs:datagrid:cols:" + persistKey);
      const arr = raw ? JSON.parse(raw) : null;
      return Array.isArray(arr) ? arr : null;
    } catch (e) {
      return null;
    }
  });
  const [ref, L] = useLang(lang);
  const t = makeT("DataGrid", L);
  const orderedColumns = React.useMemo(() => {
    if (!colOrder || !colOrder.length) return columns;
    const map = new Map(columns.map((c) => [c.key, c]));
    const out = [];
    for (const k of colOrder) if (map.has(k)) {
      out.push(map.get(k));
      map.delete(k);
    }
    for (const c of map.values()) out.push(c);
    return out;
  }, [columns, colOrder]);
  const filtered = React.useMemo(() => {
    const q = (filterText == null ? "" : String(filterText)).trim().toLowerCase();
    if (!q) return rows;
    const keys = filterKeys && filterKeys.length ? filterKeys : orderedColumns.map((c) => c.key);
    return rows.filter((r) => keys.some((k) => String(r[k] == null ? "" : r[k]).toLowerCase().includes(q)));
  }, [rows, filterText, filterKeys, orderedColumns]);
  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = orderedColumns.find((c) => c.key === sort.key);
    const val = (r) => col && col.sortValue ? col.sortValue(r) : r[sort.key];
    return [...filtered].sort((a, b) => {
      const x = val(a), y = val(b);
      return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });
  }, [filtered, sort, orderedColumns]);
  const useVirtual = virtual || sorted.length >= virtualThreshold;
  const bodyH = Math.max(0, height - 40);
  const start = useVirtual ? Math.max(0, Math.floor(scrollTop / rowHeight) - 4) : 0;
  const visibleCount = useVirtual ? Math.ceil(bodyH / rowHeight) + 8 : sorted.length;
  const end = useVirtual ? Math.min(sorted.length, start + visibleCount) : sorted.length;
  const slice = sorted.slice(start, end);
  const padTop = useVirtual ? start * rowHeight : 0;
  const padBottom = useVirtual ? Math.max(0, (sorted.length - end) * rowHeight) : 0;
  const allSel = selectable && filtered.length && filtered.every((r) => selected.includes(r[rowKey]));
  const toggleAll = () => onSelect && onSelect(allSel ? [] : filtered.map((r) => r[rowKey]));
  const toggle = (k) => onSelect && onSelect(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);
  const pinColumn = (key) => {
    if (!persistKey) return;
    const keys = orderedColumns.map((c) => c.key);
    const next = [key, ...keys.filter((k) => k !== key)];
    setColOrder(next);
    try {
      localStorage.setItem("cs:datagrid:cols:" + persistKey, JSON.stringify(next));
    } catch (e) {
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: mergeRefs(ref, forwardedRef),
      className: cx("cs-datagrid", useVirtual && "cs-datagrid--virtual", className),
      style: { maxBlockSize: height, overflow: "auto" },
      onScroll: useVirtual ? (e) => setScrollTop(e.currentTarget.scrollTop) : void 0,
      "data-virtual": useVirtual ? "true" : "false",
      "data-row-count": sorted.length,
      children: /* @__PURE__ */ jsxs("table", { className: "cs-table", children: [
        caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          selectable ? /* @__PURE__ */ jsx("th", { scope: "col", className: "cs-datagrid__selcol", children: /* @__PURE__ */ jsx("input", { type: "checkbox", "aria-label": t("selectAll"), checked: !!allSel, onChange: toggleAll }) }) : null,
          orderedColumns.map((c) => /* @__PURE__ */ jsxs(
            "th",
            {
              scope: "col",
              className: c.pinned ? "cs-datagrid__pinned" : void 0,
              style: c.pinned ? { position: "sticky", insetInlineStart: 0, zIndex: 1, background: "var(--cs-color-surface-panel)" } : void 0,
              "aria-sort": sort && sort.key === c.key ? sort.dir === "asc" ? "ascending" : "descending" : void 0,
              children: [
                c.sortable ? /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-datagrid__sort", onClick: () => setSort((s) => !s || s.key !== c.key ? { key: c.key, dir: "asc" } : s.dir === "asc" ? { key: c.key, dir: "desc" } : null), children: [
                  c.header,
                  /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: sort && sort.key === c.key ? sort.dir === "asc" ? " \u25B2" : " \u25BC" : " \u2195" })
                ] }) : c.header,
                persistKey ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "cs-datagrid__pin",
                    title: t("pin"),
                    onClick: () => pinColumn(c.key),
                    "aria-label": t("pinNamed").replace("{name}", String(c.header != null ? c.header : c.key)),
                    children: /* @__PURE__ */ jsx(Icon, { name: "pin", size: "sm" })
                  }
                ) : null
              ]
            },
            c.key
          ))
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: sorted.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: orderedColumns.length + (selectable ? 1 : 0), className: "cs-table__empty", children: empty != null ? empty : t("empty") }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          padTop > 0 ? /* @__PURE__ */ jsx("tr", { "aria-hidden": "true", children: /* @__PURE__ */ jsx("td", { colSpan: orderedColumns.length + (selectable ? 1 : 0), style: { height: padTop, padding: 0, border: 0 } }) }) : null,
          slice.map((r, i) => {
            const k = r[rowKey] != null ? r[rowKey] : start + i;
            return /* @__PURE__ */ jsxs("tr", { className: selected.includes(k) ? "is-selected" : void 0, style: useVirtual ? { height: rowHeight } : void 0, children: [
              selectable ? /* @__PURE__ */ jsx("td", { className: "cs-datagrid__selcol", children: /* @__PURE__ */ jsx("input", { type: "checkbox", "aria-label": t("selectRow"), checked: selected.includes(k), onChange: () => toggle(k) }) }) : null,
              orderedColumns.map((c) => /* @__PURE__ */ jsx("td", { className: c.pinned ? "cs-datagrid__pinned" : void 0, style: c.pinned ? { position: "sticky", insetInlineStart: 0, background: "var(--cs-color-surface-panel)" } : void 0, children: c.render ? c.render(r) : r[c.key] }, c.key))
            ] }, k);
          }),
          padBottom > 0 ? /* @__PURE__ */ jsx("tr", { "aria-hidden": "true", children: /* @__PURE__ */ jsx("td", { colSpan: orderedColumns.length + (selectable ? 1 : 0), style: { height: padBottom, padding: 0, border: 0 } }) }) : null
        ] }) })
      ] })
    }
  );
});
export {
  DataGrid
};
