import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Carousel = React.forwardRef(function Carousel2({ children, startIndex = 0, label, lang, className }, forwardedRef) {
  const slides = React.Children.toArray(children);
  const [i, setI] = React.useState(Math.min(startIndex, Math.max(0, slides.length - 1)));
  const [ref, L] = useLang(lang);
  const t = makeT("Carousel", L);
  const go = (n) => setI((n + slides.length) % slides.length);
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setI(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setI(Math.max(0, slides.length - 1));
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: mergeRefs(ref, forwardedRef),
      className: cx("cs-carousel", className),
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": label,
      onKeyDown,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "cs-sr-only", "aria-live": "polite", "aria-atomic": "true", children: [
          t("slide"),
          " ",
          i + 1,
          "/",
          slides.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "cs-carousel__view", children: [
          /* @__PURE__ */ jsx("div", { className: "cs-carousel__track", style: { transform: "translateX(-" + i * 100 + "%)" }, children: slides.map((s, j) => /* @__PURE__ */ jsx("div", { className: "cs-carousel__slide", role: "group", "aria-roledescription": "slide", "aria-hidden": j !== i, "aria-label": `${j + 1} / ${slides.length}`, children: s }, j)) }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "cs-carousel__nav prev", "aria-label": t("prev"), onClick: () => go(i - 1), children: "\u2039" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "cs-carousel__nav next", "aria-label": t("next"), onClick: () => go(i + 1), children: "\u203A" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cs-carousel__dots", role: "tablist", "aria-label": label || t("slide"), children: slides.map((_, j) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "tab",
            className: "cs-carousel__dot",
            "aria-label": t("slide") + " " + (j + 1) + "/" + slides.length,
            "aria-selected": j === i,
            "aria-current": j === i ? "true" : void 0,
            tabIndex: j === i ? 0 : -1,
            onClick: () => setI(j)
          },
          j
        )) })
      ]
    }
  );
});
export {
  Carousel
};
