import { mergeRefs } from "../_utils/merge-refs.js";
import { wrapIndex } from "../_utils/roving.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Carousel — slides with prev/next + dots. children = slides. Bilingual aria. */
export const Carousel = React.forwardRef(function Carousel({ children, startIndex = 0, label, lang, className }, forwardedRef) {
  const slides = React.Children.toArray(children);
  const [i, setI] = React.useState(Math.min(startIndex, Math.max(0, slides.length - 1)));
  const [ref, L] = useLang(lang);
  const t = makeT("Carousel", L);
  const go = (delta) => setI((cur) => wrapIndex(cur, delta, slides.length));
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setI(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setI(Math.max(0, slides.length - 1));
    }
  };
  return (
    <div
      ref={mergeRefs(ref, forwardedRef)}
      className={cx("cs-carousel", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className="cs-sr-only" aria-live="polite" aria-atomic="true">
        {t("slide")} {i + 1}/{slides.length}
      </div>
      <div className="cs-carousel__view">
        <div className="cs-carousel__track" style={{ transform: "translateX(-" + i * 100 + "%)" }}>
          {slides.map((s, j) => (
            <div key={j} className="cs-carousel__slide" role="group" aria-roledescription="slide" aria-hidden={j !== i} aria-label={`${j + 1} / ${slides.length}`}>{s}</div>
          ))}
        </div>
        <button type="button" className="cs-carousel__nav prev" aria-label={t("prev")} onClick={() => go(-1)}>‹</button>
        <button type="button" className="cs-carousel__nav next" aria-label={t("next")} onClick={() => go(1)}>›</button>
      </div>
      <div className="cs-carousel__dots" role="tablist" aria-label={label || t("slide")}>
        {slides.map((_, j) => (
          <button
            key={j}
            type="button"
            role="tab"
            className="cs-carousel__dot"
            aria-label={t("slide") + " " + (j + 1) + "/" + slides.length}
            aria-selected={j === i}
            aria-current={j === i ? "true" : undefined}
            tabIndex={j === i ? 0 : -1}
            onClick={() => setI(j)}
          />
        ))}
      </div>
    </div>
  );
});
