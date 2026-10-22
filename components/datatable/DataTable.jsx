import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Skeleton } from "../feedback/Skeleton.jsx";
import { Result } from "../feedback/Result.jsx";
import { cx } from "../_utils/cx.js";
import { renderCount } from "../_utils/renderCount.js";

/**
 * CyberSkill DataTable — semantic table with caption, column scope headers,
 * per-column render, and idle / loading / error / empty async states.
 * Solid surface (dense content). Reference composition for collection async
 * data (FIND-020): Skeleton rows while loading, Result on error, empty cell
 * when idle with no rows. Other data surfaces should follow the same triad.
 */
export const DataTable = React.forwardRef(function DataTable({
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
 rootProps }, forwardedRef) {
  const normalized = Array.isArray(rows) ? rows : [];
  const loadingRows = renderCount(requestedLoadingRows, 5, 1);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("DataTable", L, localeMessages);
  const es = emptyState != null ? emptyState : t("empty");
  const colCount = Math.max(1, (columns && columns.length) || 1);

  if (state === "loading") {
    return (
      <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-table-wrap", className) }, rootProps, ["aria-busy","role"])} aria-busy="true">
        <span className="cs-sr-only">{t("loading")}</span>
        {loadingState != null ? (
          loadingState
        ) : (
          <table className="cs-table">
            {(caption || caption === 0) ? <caption>{caption}</caption> : null}
            <thead>
              <tr>
                {(columns || []).map((c) => (
                  <th key={c.key} scope="col">
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody aria-hidden="true">
              {Array.from({ length: loadingRows }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: colCount }).map((__, j) => (
                    <td key={j}>
                      <Skeleton lines={1} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-table-wrap", "cs-table-wrap--status", className) }, rootProps, ["aria-busy","role"])} role="alert">
        {errorState != null ? (
          errorState
        ) : (
          <Result status="error" lang={L} title={t("error")}>
            {t("errorHint")}
          </Result>
        )}
      </div>
    );
  }

  return (
    <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-table-wrap", className) }, rootProps, ["aria-busy","role"])}>
      <table className="cs-table">
        {(caption || caption === 0) ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {(columns || []).map((c) => (
              <th key={c.key} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {normalized.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="cs-table__empty">
                {es}
              </td>
            </tr>
          ) : (
            normalized.map((row, i) => (
              <tr key={row[rowKey] ?? i}>
                {(columns || []).map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
DataTable.displayName = "DataTable";
