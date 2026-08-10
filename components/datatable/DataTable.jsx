import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Skeleton } from "../feedback/Skeleton.jsx";
import { Result } from "../feedback/Result.jsx";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill DataTable — semantic table with caption, column scope headers,
 * per-column render, and idle / loading / error / empty async states.
 * Solid surface (dense content). Reference composition for collection async
 * data (FIND-020): Skeleton rows while loading, Result on error, empty cell
 * when idle with no rows. Other data surfaces should follow the same triad.
 */
export function DataTable({
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
  className,
}) {
  const normalized = Array.isArray(rows) ? rows : [];
  const [ref, L] = useLang(lang);
  const t = makeT("DataTable", L);
  const es = emptyState != null ? emptyState : t("empty");
  const colCount = Math.max(1, (columns && columns.length) || 1);

  if (state === "loading") {
    return (
      <div ref={ref} className={cx("cs-table-wrap", className)} aria-busy="true">
        <span className="cs-sr-only">{t("loading")}</span>
        {loadingState != null ? (
          loadingState
        ) : (
          <table className="cs-table">
            {caption ? <caption>{caption}</caption> : null}
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
              {Array.from({ length: Math.max(1, loadingRows) }).map((_, i) => (
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
      <div ref={ref} className={cx("cs-table-wrap", "cs-table-wrap--status", className)} role="alert">
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
    <div ref={ref} className={cx("cs-table-wrap", className)}>
      <table className="cs-table">
        {caption ? <caption>{caption}</caption> : null}
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
}
