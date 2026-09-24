import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const ContextMenu = React.forwardRef(function ContextMenu2({ items = [], children, lang, className }, forwardedRef) {
  const [pos, setPos] = React.useState(null);
  const [ref, L] = useLang(lang);
  const t = makeT("ContextMenu", L);
  React.useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const k = (e) => {
      if (e.key === "Escape") setPos(null);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", k);
    };
  }, [pos]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: mergeRefs(ref, forwardedRef),
      className: cx("cs-ctxmenu-zone", className),
      onContextMenu: (e) => {
        e.preventDefault();
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      },
      children: [
        children,
        pos ? /* @__PURE__ */ jsx("div", { className: "cs-menu__list", role: "menu", "aria-label": t("menu"), style: { position: "absolute", insetInlineStart: pos.x, insetBlockStart: pos.y }, children: items.map((it, i) => it === "-" ? /* @__PURE__ */ jsx("div", { className: "cs-menu__sep" }, i) : /* @__PURE__ */ jsx("button", { type: "button", role: "menuitem", className: cx("cs-menu__item", it.danger && "cs-menu__item--danger"), onClick: () => {
          setPos(null);
          it.onSelect && it.onSelect();
        }, children: it.label }, i)) }) : null
      ]
    }
  );
});
export {
  ContextMenu
};
