import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
function reorderItems(items, from, to) {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items;
  const next = [...items];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}
const Sortable = React.forwardRef(function Sortable2({ items = [], onChange, lang, className }, forwardedRef) {
  const [dragKey, setDragKey] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [live, setLive] = React.useState("");
  const [ref, L] = useLang(lang);
  const t = makeT("Sortable", L);
  const announce = (from, to) => {
    const item = items[from];
    const label = item && item.label != null ? String(item.label) : String(from + 1);
    setLive(t("moved").replace("{item}", label).replace("{position}", String(to + 1)));
  };
  const move = (from, to) => {
    const next = reorderItems(items, from, to);
    if (next !== items) {
      announce(from, to);
      onChange && onChange(next);
    }
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
  return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-sortable-wrap", className), children: [
    /* @__PURE__ */ jsx("div", { className: "cs-sr-only", "aria-live": "polite", children: live }),
    /* @__PURE__ */ jsx("ul", { ref, className: "cs-sortable", children: items.map((it, idx) => /* @__PURE__ */ jsxs(
      "li",
      {
        draggable: true,
        className: cx("cs-sortable__item", dragKey === it.key && "is-dragging", over === it.key && "is-over"),
        "aria-grabbed": dragKey === it.key,
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
        onDragEnd: drop,
        children: [
          /* @__PURE__ */ jsx("span", { className: "cs-sortable__grip", "aria-hidden": "true", children: "\u283F" }),
          /* @__PURE__ */ jsx("span", { className: "cs-sortable__label", children: it.label }),
          /* @__PURE__ */ jsxs("span", { className: "cs-sortable__ops", onMouseDown: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "cs-button cs-button--secondary cs-button--xs",
                "aria-label": t("moveUp"),
                disabled: idx === 0,
                onClick: () => move(idx, idx - 1),
                children: "\u2191"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "cs-button cs-button--secondary cs-button--xs",
                "aria-label": t("moveDown"),
                disabled: idx === items.length - 1,
                onClick: () => move(idx, idx + 1),
                children: "\u2193"
              }
            )
          ] })
        ]
      },
      it.key
    )) })
  ] });
});
export {
  Sortable,
  reorderItems
};
