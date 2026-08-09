import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** Move item at `from` to index `to` (shared by drag drop and move buttons). */
export function reorderItems(items, from, to) {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items;
  const next = [...items];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

/** CyberSkill Sortable — reorderable list (move buttons + HTML5 DnD enhancement). items: [{key,label}]; onChange(newItems). */
export function Sortable({ items = [], onChange, lang, className }) {
  const [dragKey, setDragKey] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Sortable", L);
  const move = (from, to) => {
    const next = reorderItems(items, from, to);
    if (next !== items) onChange && onChange(next);
  };
  const drop = () => {
    if (dragKey == null || over == null || dragKey === over) { setDragKey(null); setOver(null); return; }
    const from = items.findIndex((i) => i.key === dragKey);
    const to = items.findIndex((i) => i.key === over);
    move(from, to);
    setDragKey(null); setOver(null);
  };
  return (
    <ul ref={ref} className={cx("cs-sortable", className)}>
      {items.map((it, idx) => (
        <li key={it.key} draggable
          className={cx("cs-sortable__item", dragKey === it.key && "is-dragging", over === it.key && "is-over")}
          onDragStart={(e) => {
            if (e.target.closest && e.target.closest(".cs-sortable__ops")) { e.preventDefault(); return; }
            setDragKey(it.key);
          }}
          onDragOver={(e) => { e.preventDefault(); setOver(it.key); }}
          onDrop={drop} onDragEnd={drop}>
          <span className="cs-sortable__grip" aria-hidden="true">⠿</span>
          <span className="cs-sortable__label">{it.label}</span>
          <span className="cs-sortable__ops" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cs-button cs-button--secondary cs-button--xs"
              aria-label={t("moveUp")}
              disabled={idx === 0}
              onClick={() => move(idx, idx - 1)}
            >↑</button>
            <button
              type="button"
              className="cs-button cs-button--secondary cs-button--xs"
              aria-label={t("moveDown")}
              disabled={idx === items.length - 1}
              onClick={() => move(idx, idx + 1)}
            >↓</button>
          </span>
        </li>
      ))}
    </ul>
  );
}
