import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
let cbUid = 0;
const Combobox = React.forwardRef(function Combobox2({ options = [], value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [hl, setHl] = React.useState(0);
  const [id] = React.useState(() => "cs-cb-" + ++cbUid);
  const wrapRef = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Combobox", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const sel = options.find((o) => o.value === value) || null;
  const needle = q.trim().toLowerCase();
  const shown = needle ? options.filter((o) => String(o.label).toLowerCase().includes(needle)) : options;
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  const pick = (o) => {
    onChange && onChange(o.value);
    setQ("");
    setOpen(false);
  };
  const key = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHl((h) => Math.min(shown.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHl((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      if (open && shown[hl]) {
        e.preventDefault();
        pick(shown[hl]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(wrapRef, ref, forwardedRef), className: cx("cs-combobox", className), children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        role: "combobox",
        "aria-expanded": open,
        "aria-controls": id,
        "aria-autocomplete": "list",
        "aria-label": label,
        "aria-activedescendant": open && shown[hl] ? id + "-" + hl : void 0,
        disabled,
        placeholder: ph,
        value: open ? q : sel ? sel.label : q,
        onFocus: () => {
          setOpen(true);
          setHl(0);
        },
        onChange: (e) => {
          setQ(e.target.value);
          setOpen(true);
          setHl(0);
        },
        onKeyDown: key
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "cs-combobox__caret", "aria-hidden": "true", children: "\u25BE" }),
    open ? /* @__PURE__ */ jsx("ul", { className: "cs-combobox__list", role: "listbox", id, children: shown.length ? shown.map((o, i) => /* @__PURE__ */ jsx(
      "li",
      {
        id: id + "-" + i,
        role: "option",
        "aria-selected": o.value === value,
        className: cx("cs-combobox__opt", i === hl && "hl"),
        onMouseEnter: () => setHl(i),
        onMouseDown: (e) => {
          e.preventDefault();
          pick(o);
        },
        children: o.label
      },
      o.value
    )) : /* @__PURE__ */ jsx("li", { className: "cs-combobox__empty", children: t("empty") }) }) : null
  ] });
});
export {
  Combobox
};
