import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Tabs = React.forwardRef(function Tabs2({ tabs = [], value, onChange, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Tabs", L);
  const refs = React.useRef([]);
  const idx = Math.max(0, tabs.findIndex((tab) => tab.value === value));
  const key = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    if (onChange) onChange(tabs[n].value);
    const b = refs.current[n];
    if (b) b.focus();
  };
  return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), role: "tablist", "aria-label": ariaLabel ?? t("list"), className: cx("cs-tabs", className), ...props, children: tabs.map((t2, i) => /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": value === t2.value,
      tabIndex: i === idx ? 0 : -1,
      ref: (el) => refs.current[i] = el,
      onKeyDown: (e) => key(e, i),
      className: "cs-tab",
      onClick: () => onChange && onChange(t2.value),
      children: [
        t2.label,
        t2.count != null ? /* @__PURE__ */ jsx("span", { className: "cs-tab__count", children: t2.count }) : null
      ]
    },
    t2.value
  )) });
});
const Tab = React.forwardRef(function Tab2({ selected = false, count, children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("button", { ref: forwardedRef, type: "button", role: "tab", "aria-selected": selected, className: cx("cs-tab", className), ...props, children: [
    children,
    count != null ? /* @__PURE__ */ jsx("span", { className: "cs-tab__count", children: count }) : null
  ] });
});
export {
  Tab,
  Tabs
};
