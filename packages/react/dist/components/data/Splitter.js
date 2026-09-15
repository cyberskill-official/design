import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Splitter = React.forwardRef(function Splitter2({ start, end, initial = 50, min = 20, max = 80, height = 240, lang, className }, forwardedRef) {
  const [pct, setPct] = React.useState(initial);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Splitter", L);
  const drag = (e) => {
    e.preventDefault();
    const move = (ev) => {
      const r = wrap.current.getBoundingClientRect();
      const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      setPct(Math.min(max, Math.max(min, x / r.width * 100)));
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ jsxs("div", { ref: (el) => {
    wrap.current = el;
    ref.current = el;
  }, className: cx("cs-splitter", className), style: { height }, children: [
    /* @__PURE__ */ jsx("div", { className: "cs-splitter__pane", style: { inlineSize: pct + "%" }, children: start }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "cs-splitter__bar",
        role: "separator",
        "aria-label": t("label"),
        "aria-valuenow": Math.round(pct),
        "aria-valuemin": min,
        "aria-valuemax": max,
        tabIndex: 0,
        onPointerDown: drag,
        onKeyDown: (e) => {
          if (e.key === "ArrowLeft") setPct((p) => Math.max(min, p - 2));
          else if (e.key === "ArrowRight") setPct((p) => Math.min(max, p + 2));
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "cs-splitter__pane", style: { inlineSize: 100 - pct + "%" }, children: end })
  ] });
});
export {
  Splitter
};
