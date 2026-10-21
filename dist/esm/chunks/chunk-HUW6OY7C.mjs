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

// components/forms/Transfer.jsx
import React from "react";
var Transfer = React.forwardRef(function Transfer2({ items = [], value = [], onChange, titles, lang, className, rootProps }, forwardedRef) {
  const [checked, setChecked] = React.useState([]);
  React.useEffect(() => {
    setChecked((current) => {
      const next = current.filter((key) => items.some((item) => item.key === key));
      return next.length === current.length ? current : next;
    });
  }, [items]);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Transfer", L, localeMessages);
  const tt = titles || [t("source"), t("target")];
  const inTarget = (k) => value.includes(k);
  const toggle = (k) => setChecked((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k]);
  const move = (toTarget) => {
    const mv = checked.filter((k) => items.some((item) => item.key === k) && inTarget(k) !== toTarget);
    if (!mv.length) return;
    onChange && onChange(toTarget ? [...value, ...mv] : value.filter((k) => !mv.includes(k)));
    setChecked([]);
  };
  const renderList = (target) => /* @__PURE__ */ React.createElement("div", { className: "cs-transfer__list" }, /* @__PURE__ */ React.createElement("div", { className: "cs-transfer__title" }, target ? tt[1] : tt[0]), /* @__PURE__ */ React.createElement("ul", null, items.filter((it) => inTarget(it.key) === target).map((it) => /* @__PURE__ */ React.createElement("li", { key: it.key }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: checked.includes(it.key), onChange: () => toggle(it.key) }), " ", it.label)))));
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-transfer", className) }, rootProps, []) }, renderList(false), /* @__PURE__ */ React.createElement("div", { className: "cs-transfer__ops" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", "aria-label": t("toTarget"), onClick: () => move(true) }, "›"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", "aria-label": t("toSource"), onClick: () => move(false) }, "‹")), renderList(true));
});
Transfer.displayName = "Transfer";

export {
  Transfer
};
//# sourceMappingURL=chunk-HUW6OY7C.mjs.map
