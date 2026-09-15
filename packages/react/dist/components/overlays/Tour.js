import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Tour = React.forwardRef(function Tour2({ steps = [], open, onClose, lang, className }, forwardedRef) {
  const [i, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const [pop, setPop] = React.useState({ top: 80, left: 40 });
  const [ref, L] = useLang(lang);
  const t = makeT("Tour", L);
  React.useEffect(() => {
    if (open) setI(0);
  }, [open]);
  React.useEffect(() => {
    if (!open || !steps[i]) return void 0;
    const el = document.querySelector(steps[i].target);
    if (el) {
      const r = el.getBoundingClientRect();
      const next = { x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12 };
      setRect(next);
      setPop({
        top: Math.min(window.innerHeight - 170, next.y + next.h + 12),
        left: Math.max(12, Math.min(window.innerWidth - 292, next.x))
      });
    } else {
      setRect(null);
      setPop({ top: 80, left: 40 });
    }
    const k = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, i, steps, onClose]);
  if (!open || !steps.length) return /* @__PURE__ */ jsx("span", { ref: mergeRefs(ref, forwardedRef), style: { display: "none" } });
  const s = steps[i];
  const last = i === steps.length - 1;
  return /* @__PURE__ */ jsxs("div", { ref, className: cx("cs-tour", className), children: [
    /* @__PURE__ */ jsx("div", { className: "cs-tour__scrim", onClick: onClose }),
    rect ? /* @__PURE__ */ jsx("div", { className: "cs-tour__hole", style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h } }) : null,
    /* @__PURE__ */ jsxs("div", { className: "cs-tour__pop", role: "dialog", "aria-label": typeof s.title === "string" ? s.title : void 0, style: { left: pop.left, top: pop.top }, children: [
      /* @__PURE__ */ jsx("b", { children: s.title }),
      s.body ? /* @__PURE__ */ jsx("p", { children: s.body }) : null,
      /* @__PURE__ */ jsxs("div", { className: "cs-tour__bar", children: [
        /* @__PURE__ */ jsx("span", { className: "cs-tour__count", children: i + 1 + " / " + steps.length }),
        /* @__PURE__ */ jsxs("span", { className: "cs-tour__btns", children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--ghost cs-button--xs", onClick: onClose, children: t("skip") }),
          i > 0 ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", onClick: () => setI(i - 1), children: t("back") }) : null,
          /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--primary cs-button--xs", onClick: () => last ? onClose && onClose() : setI(i + 1), children: last ? t("done") : t("next") })
        ] })
      ] })
    ] })
  ] });
});
export {
  Tour
};
