import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang, formatDate } from "../_i18n/i18n.js";
import { Calendar } from "./Calendar.js";
import { cx } from "../_utils/cx.js";
const CAL_ICON = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M8 3v4M16 3v4M3 10h18" })
] });
const DatePicker = React.forwardRef(function DatePicker2({ value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("DatePicker", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
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
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(wrap, ref, forwardedRef), className: cx("cs-datepicker", className), children: [
    /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-datepicker__field", disabled, "aria-haspopup": "dialog", "aria-expanded": open, "aria-label": label, onClick: () => setOpen((o) => !o), children: [
      CAL_ICON,
      /* @__PURE__ */ jsx("span", { className: value ? void 0 : "ph", children: value ? formatDate(value, L) : ph })
    ] }),
    open ? /* @__PURE__ */ jsx("div", { className: "cs-datepicker__pop", role: "dialog", "aria-label": label || ph, children: /* @__PURE__ */ jsx(Calendar, { value, lang: L, onChange: (d) => {
      onChange && onChange(d);
      setOpen(false);
    } }) }) : null
  ] });
});
export {
  DatePicker
};
