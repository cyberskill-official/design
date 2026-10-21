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

// components/data/Sortable.jsx
import React from "react";
function reorderItems(items, from, to) {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items;
  const next = [...items];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}
var Sortable = React.forwardRef(function Sortable2({ items = [], onChange, lang, className, rootProps }, forwardedRef) {
  const [dragKey, setDragKey] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Sortable", L, localeMessages);
  const move = (from, to) => {
    const next = reorderItems(items, from, to);
    if (next !== items) onChange && onChange(next);
  };
  const drop = () => {
    if (dragKey == null || over == null || dragKey === over) {
      setDragKey(null);
      setOver(null);
      return;
    }
    const from = items.findIndex((i) => i.key === dragKey);
    const to = items.findIndex((i) => i.key === over);
    move(from, to);
    setDragKey(null);
    setOver(null);
  };
  return /* @__PURE__ */ React.createElement("ul", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-sortable", className) }, rootProps, []) }, items.map((it, idx) => /* @__PURE__ */ React.createElement(
    "li",
    {
      key: it.key,
      draggable: true,
      className: cx("cs-sortable__item", dragKey === it.key && "is-dragging", over === it.key && "is-over"),
      onDragStart: (e) => {
        if (e.target.closest && e.target.closest(".cs-sortable__ops")) {
          e.preventDefault();
          return;
        }
        setDragKey(it.key);
      },
      onDragOver: (e) => {
        e.preventDefault();
        setOver(it.key);
      },
      onDrop: drop,
      onDragEnd: () => {
        setDragKey(null);
        setOver(null);
      }
    },
    /* @__PURE__ */ React.createElement("span", { className: "cs-sortable__grip", "aria-hidden": "true" }, "⠿"),
    /* @__PURE__ */ React.createElement("span", { className: "cs-sortable__label" }, it.label),
    /* @__PURE__ */ React.createElement("span", { className: "cs-sortable__ops", onMouseDown: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "cs-button cs-button--secondary cs-button--xs",
        "aria-label": t("moveUp"),
        disabled: idx === 0,
        onClick: (e) => {
          const sibling = idx - 1 === 0 ? e.currentTarget.nextElementSibling : null;
          move(idx, idx - 1);
          if (sibling) requestAnimationFrame(() => sibling.focus());
        }
      },
      "↑"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "cs-button cs-button--secondary cs-button--xs",
        "aria-label": t("moveDown"),
        disabled: idx === items.length - 1,
        onClick: (e) => {
          const sibling = idx + 1 === items.length - 1 ? e.currentTarget.previousElementSibling : null;
          move(idx, idx + 1);
          if (sibling) requestAnimationFrame(() => sibling.focus());
        }
      },
      "↓"
    ))
  )));
});
Sortable.displayName = "Sortable";

export {
  reorderItems,
  Sortable
};
//# sourceMappingURL=chunk-TNHQB6CI.mjs.map
