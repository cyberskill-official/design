import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

// Encode UTF-16 code units, including lone surrogates, into whitespace-free IDs.
// Keys already identify expansion globally; no value/content serialization is inferred.
function nodeRowId(prefix, key) {
  return prefix + "-row-" + String(key).split("").map(unit => unit.charCodeAt(0).toString(16).padStart(4, "0")).join("");
}

function Row({ n, depth, columns, expanded, setExpanded, t, treeId }) {
  const labelId = React.useId();
  const actionId = labelId + "-action";
  const rowId = nodeRowId(treeId, n.key);
  const kids = n.children || [];
  const open = expanded.includes(n.key);
  return (
    <>
      <tr id={rowId}>
        {columns.map((c, i) => (
          <td key={c.key}>
            {i === 0 ? (
              <span className="cs-treetable__cell" style={{ paddingInlineStart: depth * 18 }}>
                {kids.length ? (
                  <button type="button" className="cs-tree__twist" aria-expanded={open} aria-controls={open ? kids.map(child => nodeRowId(treeId, child.key)).join(" ") : undefined} aria-labelledby={actionId + " " + labelId} onClick={() => setExpanded(current => current.includes(n.key) ? current.filter((k) => k !== n.key) : [...current, n.key])}>
                    <span id={actionId} className="cs-sr-only">{t(open ? "collapse" : "expand")}</span>
                    <span aria-hidden="true">{open ? "▾" : "▸"}</span>
                  </button>
                ) : <span className="cs-tree__twist" aria-hidden="true" />}
                <span id={labelId}>{c.render ? c.render(n) : n[c.key]}</span>
              </span>
            ) : (c.render ? c.render(n) : n[c.key])}
          </td>
        ))}
      </tr>
      {open ? kids.map((k) => <Row key={k.key} n={k} depth={depth + 1} columns={columns} expanded={expanded} setExpanded={setExpanded} t={t} treeId={treeId} />) : null}
    </>
  );
}

/** CyberSkill TreeTable — table whose first column expands nested rows. nodes: rows with children[]. */
export const TreeTable = React.forwardRef(function TreeTable({ columns = [], nodes = [], caption, defaultExpanded = [], lang, className , rootProps }, forwardedRef) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const treeId = React.useId();
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("TreeTable", L, localeMessages);
  return (
    <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-table-wrap", className) }, rootProps, [])}>
      <table className="cs-table cs-treetable">
        {(caption || caption === 0) ? <caption>{caption}</caption> : null}
        <thead><tr>{columns.map((c) => <th key={c.key} scope="col">{c.header}</th>)}</tr></thead>
        <tbody>
          {nodes.length === 0
            ? <tr><td colSpan={columns.length} className="cs-table__empty">{t("empty")}</td></tr>
            : nodes.map((n) => <Row key={n.key} n={n} depth={0} columns={columns} expanded={expanded} setExpanded={setExpanded} t={t} treeId={treeId} />)}
        </tbody>
      </table>
    </div>
  );
});
TreeTable.displayName = "TreeTable";
