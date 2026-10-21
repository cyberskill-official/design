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

// components/data/Carousel.jsx
import React from "react";
var Carousel = React.forwardRef(function Carousel2({ children, startIndex = 0, label, lang, className, rootProps }, forwardedRef) {
  const slides = React.Children.toArray(children);
  const clampIndex = (n) => Math.max(0, Math.min(Number.isFinite(n) ? Math.trunc(n) : 0, slides.length - 1));
  const [i, setI] = React.useState(() => clampIndex(startIndex));
  const active = clampIndex(i);
  if (i !== active) setI(active);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Carousel", L, localeMessages);
  const go = (n) => {
    if (slides.length) setI((n + slides.length) % slides.length);
  };
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-carousel", className) }, rootProps, ["role", "aria-roledescription", "aria-label"]), role: "group", "aria-roledescription": "carousel", "aria-label": label }, /* @__PURE__ */ React.createElement("div", { className: "cs-carousel__view" }, /* @__PURE__ */ React.createElement("div", { className: "cs-carousel__window" }, /* @__PURE__ */ React.createElement("div", { className: "cs-carousel__track", style: { transform: "translateX(-" + active * 100 + "%)" } }, slides.map((s, j) => /* @__PURE__ */ React.createElement("div", { key: j, className: "cs-carousel__slide", role: "group", "aria-roledescription": "slide", "aria-label": `${t("slide")} ${j + 1}/${slides.length}`, "aria-hidden": j !== active, ref: (el) => {
    if (el) el.inert = j !== active;
  } }, s)))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-carousel__nav prev", "aria-label": t("prev"), disabled: slides.length < 2, onClick: () => go(active - 1) }, "‹"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-carousel__nav next", "aria-label": t("next"), disabled: slides.length < 2, onClick: () => go(active + 1) }, "›")), /* @__PURE__ */ React.createElement("div", { className: "cs-sr-only", role: "status", "aria-live": "polite", "aria-atomic": "true" }, slides.length ? `${t("slide")} ${active + 1}/${slides.length}` : ""), /* @__PURE__ */ React.createElement("div", { className: "cs-carousel__dots" }, slides.map((_, j) => /* @__PURE__ */ React.createElement("button", { key: j, type: "button", "aria-label": t("slide") + " " + (j + 1) + "/" + slides.length, "aria-current": j === active, onClick: () => setI(j) }))));
});
Carousel.displayName = "Carousel";

export {
  Carousel
};
//# sourceMappingURL=chunk-4QBKN42N.mjs.map
