import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Transfer = React.forwardRef(function Transfer2({ items = [], value = [], onChange, titles, lang, className }, forwardedRef) {
  const [checked, setChecked] = React.useState([]);
  const [ref, L] = useLang(lang);
  const t = makeT("Transfer", L);
  const tt = titles || [t("source"), t("target")];
  const inTarget = (k) => value.includes(k);
  const toggle = (k) => setChecked((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k]);
  const move = (toTarget) => {
    const mv = checked.filter((k) => inTarget(k) !== toTarget);
    if (!mv.length) return;
    onChange && onChange(toTarget ? [...value, ...mv] : value.filter((k) => !mv.includes(k)));
    setChecked([]);
  };
  const List = ({ target }) => /* @__PURE__ */ jsxs("div", { className: "cs-transfer__list", children: [
    /* @__PURE__ */ jsx("div", { className: "cs-transfer__title", children: target ? tt[1] : tt[0] }),
    /* @__PURE__ */ jsx("ul", { children: items.filter((it) => inTarget(it.key) === target).map((it) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", { children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", checked: checked.includes(it.key), onChange: () => toggle(it.key) }),
      " ",
      it.label
    ] }) }, it.key)) })
  ] });
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-transfer", className), children: [
    /* @__PURE__ */ jsx(List, { target: false }),
    /* @__PURE__ */ jsxs("div", { className: "cs-transfer__ops", children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", "aria-label": t("toTarget"), onClick: () => move(true), children: "\u203A" }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", "aria-label": t("toSource"), onClick: () => move(false), children: "\u2039" })
    ] }),
    /* @__PURE__ */ jsx(List, { target: true })
  ] });
});
export {
  Transfer
};
