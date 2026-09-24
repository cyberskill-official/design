import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const TagInput = React.forwardRef(function TagInput2({
  id,
  label,
  value,
  defaultValue = [],
  onChange,
  placeholder,
  max,
  disabled = false,
  lang,
  className
}, forwardedRef) {
  const [inner, setInner] = React.useState(defaultValue);
  const tags = value != null ? value : inner;
  const [q, setQ] = React.useState("");
  const set = (arr) => {
    if (value == null) setInner(arr);
    onChange && onChange(arr);
  };
  const add = (s) => {
    s = s.trim();
    if (!s) return;
    if (tags.includes(s)) {
      setQ("");
      return;
    }
    if (max != null && tags.length >= max) return;
    set([...tags, s]);
    setQ("");
  };
  const [ref, L] = useLang(lang);
  const t = makeT("TagInput", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const gid = React.useId();
  const sid = id ?? gid;
  return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", className), htmlFor: sid, children: [
    label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
    /* @__PURE__ */ jsxs("div", { className: "cs-taginput", children: [
      tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "cs-tag", children: [
        tag,
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "cs-tag__close",
            "aria-label": t("remove") + " " + tag,
            onClick: () => set(tags.filter((x) => x !== tag)),
            disabled,
            children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) })
          }
        )
      ] }, tag)),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: sid,
          value: q,
          placeholder: tags.length ? "" : ph,
          disabled,
          "aria-label": label ? void 0 : ph,
          onChange: (e) => setQ(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(q);
            } else if (e.key === "Backspace" && !q && tags.length) {
              set(tags.slice(0, -1));
            }
          },
          onBlur: () => add(q)
        }
      )
    ] })
  ] });
});
export {
  TagInput
};
