import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const SWATCHES = ["#F4BA17", "#C77B4A", "#E0632B", "#C43D1F", "#7A9B57", "#3E5A2E", "#4E8E9B", "#2E5E7E", "#BFB29B", "#45210E"];
const ColorPicker = React.forwardRef(function ColorPicker2({ value = "#F4BA17", onChange, swatches = SWATCHES, label, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState(value);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("ColorPicker", L);
  React.useEffect(() => setHex(value), [value]);
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
  const commit = (v) => {
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange && onChange(v);
    }
  };
  return /* @__PURE__ */ jsxs("span", { ref: (el) => {
    wrap.current = el;
    ref.current = el;
  }, className: cx("cs-colorpicker", className), children: [
    /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-colorpicker__field", "aria-label": (label || t("label")) + ": " + value, "aria-expanded": open, onClick: () => setOpen((o) => !o), children: [
      /* @__PURE__ */ jsx("i", { style: { background: value } }),
      /* @__PURE__ */ jsx("code", { children: value })
    ] }),
    open ? /* @__PURE__ */ jsxs("span", { className: "cs-colorpicker__pop", role: "dialog", "aria-label": label || t("label"), children: [
      /* @__PURE__ */ jsx("span", { className: "cs-colorpicker__grid", children: swatches.map((s) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": s,
          "aria-pressed": s.toLowerCase() === String(value).toLowerCase(),
          style: { background: s },
          className: s.toLowerCase() === String(value).toLowerCase() ? "on" : void 0,
          onClick: () => {
            onChange && onChange(s);
            setOpen(false);
          }
        },
        s
      )) }),
      /* @__PURE__ */ jsx("span", { className: "cs-colorpicker__hex", children: /* @__PURE__ */ jsx(
        "input",
        {
          value: hex,
          "aria-label": t("hex"),
          onChange: (e) => setHex(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              commit(hex);
              setOpen(false);
            }
          },
          onBlur: () => commit(hex)
        }
      ) })
    ] }) : null
  ] });
});
export {
  ColorPicker
};
