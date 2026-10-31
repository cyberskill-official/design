import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { cx } from "../_utils/cx.js";
import { useClientLayoutEffect } from "../_utils/use-client-layout-effect.js";

/**
 * CyberSkill DataGrid — advanced table: sortable columns, selectable rows, sticky header,
 * optional column pin + client filter + row virtualization + optional column order persistence.
 */
export const DataGrid = React.forwardRef(function DataGrid({
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
  rootProps,
  filterText,
  filterKeys,
  /** When true (or rows exceed virtualThreshold), only paint a window of rows. */
  virtual = false,
  /** Row threshold that auto-enables virtualization. Default 80. */
  virtualThreshold = 80,
  /** Approximate row height for windowing. Default 36. */
  rowHeight = 36,
  /** localStorage key — when set, column key order is persisted across reloads. */
  persistKey,
}, forwardedRef) {
  const [sort, setSort] = React.useState(null); // {key, dir}
  const nameId = React.useId();
  const [scrollTop, setScrollTop] = React.useState(0);
  const estimate = Number.isFinite(rowHeight) && rowHeight > 0 ? rowHeight : 36;
  const [measuredRowHeight, setMeasuredRowHeight] = React.useState(estimate);
  const effectiveRowHeight = Math.max(estimate, measuredRowHeight);
  const [colOrder, setColOrder] = React.useState(null);
  useClientLayoutEffect(() => {
    if (!persistKey) { setColOrder(null); return; }
    try {
      const raw = localStorage.getItem("cs:datagrid:cols:" + persistKey);
      const arr = raw ? JSON.parse(raw) : null;
      setColOrder(Array.isArray(arr) ? arr : null);
    } catch (e) { setColOrder(null); }
  }, [persistKey]);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("DataGrid", L, localeMessages);

  const orderedColumns = React.useMemo(() => {
    if (!colOrder || !colOrder.length) return columns;
    const map = new Map(columns.map((c) => [c.key, c]));
    const out = [];
    for (const k of colOrder) if (map.has(k)) { out.push(map.get(k)); map.delete(k); }
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
    const val = (r) => (col && col.sortValue ? col.sortValue(r) : r[sort.key]);
    return [...filtered].sort((a, b) => { const x = val(a), y = val(b); return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === "asc" ? 1 : -1); });
  }, [filtered, sort, orderedColumns]);

  const useVirtual = virtual || sorted.length >= virtualThreshold;
  const bodyH = Math.max(0, height - 40);
  const visibleCount = useVirtual ? Math.ceil(bodyH / effectiveRowHeight) + 8 : sorted.length;
  // Data/filter changes can leave the old scroll offset beyond the new rows.
  // Keep a populated final window; removing stale padding lets the browser
  // clamp its physical scroll position to the new content height as well.
  const start = useVirtual ? Math.min(Math.max(0, sorted.length - visibleCount), Math.max(0, Math.floor(scrollTop / effectiveRowHeight) - 4)) : 0;
  const end = useVirtual ? Math.min(sorted.length, start + visibleCount) : sorted.length;
  const slice = sorted.slice(start, end);
  const padTop = useVirtual ? start * effectiveRowHeight : 0;
  const padBottom = useVirtual ? Math.max(0, (sorted.length - end) * effectiveRowHeight) : 0;

  // CSS (including larger touch controls) can exceed the caller's estimate.
  // Measure natural rendered rows before paint, without retaining the previous
  // inline floor: switching back to a denser layout must be able to shrink.
  useClientLayoutEffect(() => {
    const host = ref.current;
    if (!host || !useVirtual) return;
    const rows = [...host.querySelectorAll('tbody > tr:not([aria-hidden="true"])')];
    if (!slice.length || !rows.length) return;
    const measure = () => {
      const old = rows.map(row => row.style.height);
      rows.forEach(row => { row.style.height = ""; });
      const next = Math.max(estimate, ...rows.map(row => row.getBoundingClientRect().height));
      rows.forEach((row, i) => { row.style.height = old[i]; });
      setMeasuredRowHeight(previous => Math.abs(previous - next) > 0.01 ? next : previous);
    };
    measure();
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resize?.observe(host);
    rows.forEach(row => resize?.observe(row));
    const ancestors = new MutationObserver(measure);
    for (let node = host; node; node = node.parentElement) {
      ancestors.observe(node, { attributes: true, attributeFilter: ["class", "style", "lang", "data-cs-density", "data-cs-element", "data-cs-variant"] });
    }
    const coarse = window.matchMedia("(pointer: coarse)");
    coarse.addEventListener("change", measure);
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      resize?.disconnect();
      ancestors.disconnect();
      coarse.removeEventListener("change", measure);
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [useVirtual, slice, estimate, ref]);

  const allSel = selectable && filtered.length && filtered.every((r) => selected.includes(r[rowKey]));
  const toggleAll = () => onSelect && onSelect(allSel ? [] : filtered.map((r) => r[rowKey]));
  const toggle = (k) => onSelect && onSelect(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);

  const pinColumn = (key) => {
    if (!persistKey) return;
    const keys = orderedColumns.map((c) => c.key);
    const next = [key, ...keys.filter((k) => k !== key)];
    setColOrder(next);
    try { localStorage.setItem("cs:datagrid:cols:" + persistKey, JSON.stringify(next)); } catch (e) {}
  };

  return (
    <div
      ref={mergedNativeRef}
      {...mergeTargetProps({
        className: cx("cs-datagrid", useVirtual && "cs-datagrid--virtual", className),
        onScroll: useVirtual ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined,
      }, rootProps, ["data-virtual", "data-row-count", "data-row-height"])}
      style={{ ...rootProps?.style, maxBlockSize: height, overflow: "auto" }}
      data-virtual={useVirtual ? "true" : "false"}
      data-row-count={sorted.length}
      data-row-height={useVirtual ? effectiveRowHeight : undefined}
    >
      <table className="cs-table" aria-rowcount={useVirtual ? Math.max(2, sorted.length + 1) : undefined}>
        {(caption || caption === 0) ? <caption>{caption}</caption> : null}
        <thead>
          <tr aria-rowindex={useVirtual ? 1 : undefined}>
            {selectable ? <th scope="col" className="cs-datagrid__selcol"><label className="cs-datagrid__check"><input type="checkbox" aria-label={t("selectAll")} checked={!!allSel} onChange={toggleAll} /></label></th> : null}
            {orderedColumns.map((c, columnIndex) => (
              <th
                key={c.key}
                scope="col"
                className={c.pinned ? "cs-datagrid__pinned" : undefined}
                style={c.pinned ? { position: "sticky", insetInlineStart: 0, zIndex: 1, background: "var(--cs-color-surface-panel)" } : undefined}
                aria-sort={sort && sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
              >
                {c.sortable ? (
                  <button type="button" className="cs-datagrid__sort" onClick={() => setSort((s) => (!s || s.key !== c.key ? { key: c.key, dir: "asc" } : s.dir === "asc" ? { key: c.key, dir: "desc" } : null))}>
                    <span id={nameId + "-header-" + columnIndex}>{c.header}</span><span aria-hidden="true">{sort && sort.key === c.key ? (sort.dir === "asc" ? " ▲" : " ▼") : " ↕"}</span>
                  </button>
                ) : <span id={nameId + "-header-" + columnIndex}>{c.header}</span>}
                {persistKey ? (
                  <button
                    type="button"
                    className="cs-datagrid__pin"
                    title={t("pin")}
                    onClick={() => pinColumn(c.key)}
                    aria-label={c.header == null ? t("pinNamed").replace("{name}", c.key) : undefined}
                    aria-labelledby={c.header == null ? undefined : nameId + "-pin-start-" + columnIndex + " " + nameId + "-header-" + columnIndex + " " + nameId + "-pin-end-" + columnIndex}
                  >
                    <span className="cs-sr-only" id={nameId + "-pin-start-" + columnIndex}>{t("pinNamed").split("{name}")[0]}</span>
                    <Icon name="pin" size="sm" />
                    <span className="cs-sr-only" id={nameId + "-pin-end-" + columnIndex}>{t("pinNamed").split("{name}")[1]}</span>
                  </button>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr aria-rowindex={useVirtual ? 2 : undefined}><td colSpan={orderedColumns.length + (selectable ? 1 : 0)} className="cs-table__empty">{empty != null ? empty : t("empty")}</td></tr>
          ) : (
            <>
              {padTop > 0 ? <tr aria-hidden="true"><td colSpan={orderedColumns.length + (selectable ? 1 : 0)} style={{ height: padTop, padding: 0, border: 0 }} /></tr> : null}
              {slice.map((r, i) => {
                const k = r[rowKey] != null ? r[rowKey] : start + i;
                return (
                  <tr key={k} aria-rowindex={useVirtual ? start + i + 2 : undefined} aria-selected={selectable ? selected.includes(k) : undefined} className={selected.includes(k) ? "is-selected" : undefined} style={useVirtual ? { height: effectiveRowHeight } : undefined}>
                    {selectable ? <td className="cs-datagrid__selcol"><label className="cs-datagrid__check"><input type="checkbox" aria-label={`${t("selectRow")}: ${String(orderedColumns.map(c => r[c.key]).find(v => typeof v === "string" && v.trim()) ?? k)}`} checked={selected.includes(k)} onChange={() => toggle(k)} /></label></td> : null}
                    {orderedColumns.map((c) => (
                      <td key={c.key} className={c.pinned ? "cs-datagrid__pinned" : undefined} style={c.pinned ? { position: "sticky", insetInlineStart: 0, background: "var(--cs-color-surface-panel)" } : undefined}>
                        {c.render ? c.render(r) : r[c.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {padBottom > 0 ? <tr aria-hidden="true"><td colSpan={orderedColumns.length + (selectable ? 1 : 0)} style={{ height: padBottom, padding: 0, border: 0 }} /></tr> : null}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
});
DataGrid.displayName = "DataGrid";
