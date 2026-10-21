"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Tabs.jsx
import React from "react";
var Tabs = React.forwardRef(function Tabs2({ tabs = [], value, onChange, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Tabs", L, localeMessages);
  const refs = React.useRef([]);
  const idx = Math.max(0, tabs.findIndex((tab) => tab.value === value));
  const vertical = props["aria-orientation"] === "vertical";
  const key = (e, i) => {
    let n = null;
    if (e.key === (vertical ? "ArrowDown" : "ArrowRight")) n = (i + 1) % tabs.length;
    else if (e.key === (vertical ? "ArrowUp" : "ArrowLeft")) n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    if (onChange) onChange(tabs[n].value);
    const b = refs.current[n];
    if (b) b.focus();
  };
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, role: "tablist", "aria-label": ariaLabel ?? t("list"), className: cx("cs-tabs", className), ...props }, tabs.map((t2, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t2.value,
      type: "button",
      role: "tab",
      id: t2.id,
      "aria-controls": t2["aria-controls"],
      "aria-selected": value === t2.value,
      tabIndex: i === idx ? 0 : -1,
      ref: (el) => refs.current[i] = el,
      onKeyDown: (e) => key(e, i),
      className: "cs-tab",
      onClick: () => onChange && onChange(t2.value)
    },
    t2.label,
    t2.count != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-tab__count" }, t2.count) : null
  )));
});
Tabs.displayName = "Tabs";
var Tab = React.forwardRef(function Tab2({ selected = false, count, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("button", { type: "button", role: "tab", "aria-selected": selected, className: cx("cs-tab", className), ...props, ref: mergedNativeRef }, children, count != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-tab__count" }, count) : null);
});
Tab.displayName = "Tab";

export {
  Tabs,
  Tab
};
//# sourceMappingURL=chunk-YJNSQ5PJ.mjs.map
