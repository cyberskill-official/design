import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Tree } from "../data/Tree.js";
import { cx } from "../_utils/cx.js";
const TreeSelect = React.forwardRef(function TreeSelect2({ nodes = [], value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("TreeSelect", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const find = (ns) => {
    for (const n of ns) {
      if (n.key === value) return n;
      const c = n.children && find(n.children);
      if (c) return c;
    }
    return null;
  };
  const sel = find(nodes);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    const k = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", d);
      document.removeEventListener("keydown", k);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { ref: (el) => {
    wrap.current = el;
    ref.current = el;
  }, className: cx("cs-treeselect", className), children: [
    /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-treeselect__field", disabled, "aria-haspopup": "tree", "aria-expanded": open, "aria-label": label, onClick: () => setOpen((o) => !o), children: [
      /* @__PURE__ */ jsx("span", { className: sel ? void 0 : "ph", children: sel ? sel.label : ph }),
      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u25BE" })
    ] }),
    open ? /* @__PURE__ */ jsx("div", { className: "cs-treeselect__pop", children: /* @__PURE__ */ jsx(Tree, { nodes, selected: value, defaultOpen: true, lang: L, onSelect: (k, n) => {
      if (!(n.children && n.children.length)) {
        onChange && onChange(k, n);
        setOpen(false);
      }
    } }) }) : null
  ] });
});
export {
  TreeSelect
};
