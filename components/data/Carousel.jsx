import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Carousel — slides with prev/next + dots. children = slides. Bilingual aria. */
export const Carousel = React.forwardRef(function Carousel({ children, startIndex = 0, label, lang, className , rootProps }, forwardedRef) {
  const slides = React.Children.toArray(children);
  const clampIndex = (n) => Math.max(0, Math.min(Number.isFinite(n) ? Math.trunc(n) : 0, slides.length - 1));
  const [i, setI] = React.useState(() => clampIndex(startIndex));
  const active = clampIndex(i);
  if (i !== active) setI(active);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Carousel", L, localeMessages);
  const go = (n) => { if (slides.length) setI((n + slides.length) % slides.length); };
  return (
    <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-carousel", className) }, rootProps, ["role","aria-roledescription","aria-label"])} role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="cs-carousel__view">
        <div className="cs-carousel__window">
          <div className="cs-carousel__track" style={{ transform: "translateX(-" + active * 100 + "%)" }}>
            {slides.map((s, j) => <div key={j} className="cs-carousel__slide" role="group" aria-roledescription="slide" aria-label={`${t("slide")} ${j + 1}/${slides.length}`} aria-hidden={j !== active} ref={(el) => { if (el) el.inert = j !== active; }}>{s}</div>)}
          </div>
        </div>
        <button type="button" className="cs-carousel__nav prev" aria-label={t("prev")} disabled={slides.length < 2} onClick={() => go(active - 1)}>‹</button>
        <button type="button" className="cs-carousel__nav next" aria-label={t("next")} disabled={slides.length < 2} onClick={() => go(active + 1)}>›</button>
      </div>
      <div className="cs-sr-only" role="status" aria-live="polite" aria-atomic="true">{slides.length ? `${t("slide")} ${active + 1}/${slides.length}` : ""}</div>
      <div className="cs-carousel__dots">
        {slides.map((_, j) => <button key={j} type="button" aria-label={t("slide") + " " + (j + 1) + "/" + slides.length} aria-current={j === active} onClick={() => setI(j)} />)}
      </div>
    </div>
  );
});
Carousel.displayName = "Carousel";
