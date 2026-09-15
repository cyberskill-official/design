import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const PEN = /* @__PURE__ */ jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z" }) });
const InlineEdit = React.forwardRef(function InlineEdit2({ value, defaultValue = "", onChange, label, lang, className }, forwardedRef) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const [edit, setEdit] = React.useState(false);
  const [draft, setDraft] = React.useState(val);
  const commit = () => {
    setEdit(false);
    if (draft !== val) {
      if (value == null) setInner(draft);
      onChange && onChange(draft);
    }
  };
  const [ref, L] = useLang(lang);
  const t = makeT("InlineEdit", L);
  return /* @__PURE__ */ jsx("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-inline-edit", className), children: edit ? /* @__PURE__ */ jsx(
    "input",
    {
      autoFocus: true,
      value: draft,
      "aria-label": label,
      onChange: (e) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => {
        if (e.key === "Enter") commit();
        else if (e.key === "Escape") {
          setDraft(val);
          setEdit(false);
        }
      }
    }
  ) : /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-inline-edit__view", "aria-label": t("edit") + (label ? ": " + label : ""), onClick: () => {
    setDraft(val);
    setEdit(true);
  }, children: [
    /* @__PURE__ */ jsx("span", { className: val ? void 0 : "ph", children: val || t("empty") }),
    PEN
  ] }) });
});
export {
  InlineEdit
};
