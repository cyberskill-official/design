import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Tour — spotlight walkthrough over target elements (by CSS selector). Controlled via open/onClose. */
export function Tour({ steps = [], open, onClose, lang, className }) {
  const [i, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const [pop, setPop] = React.useState({ top: 80, left: 40 });
  const [ref, L] = useLang(lang);
  const t = makeT("Tour", L);
  React.useEffect(() => { if (open) setI(0); }, [open]);
  React.useEffect(() => {
    if (!open || !steps[i]) return undefined;
    const el = document.querySelector(steps[i].target);
    if (el) {
      const r = el.getBoundingClientRect();
      const next = { x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12 };
      setRect(next);
      setPop({
        top: Math.min(window.innerHeight - 170, next.y + next.h + 12),
        left: Math.max(12, Math.min(window.innerWidth - 292, next.x)),
      });
    } else {
      setRect(null);
      setPop({ top: 80, left: 40 });
    }
    const k = (e) => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, i, steps, onClose]);
  if (!open || !steps.length) return <span ref={ref} style={{ display: "none" }} />;
  const s = steps[i];
  const last = i === steps.length - 1;
  return (
    <div ref={ref} className={cx("cs-tour", className)}>
      <div className="cs-tour__scrim" onClick={onClose} />
      {rect ? <div className="cs-tour__hole" style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }} /> : null}
      <div className="cs-tour__pop" role="dialog" aria-label={typeof s.title === "string" ? s.title : undefined} style={{ left: pop.left, top: pop.top }}>
        <b>{s.title}</b>
        {s.body ? <p>{s.body}</p> : null}
        <div className="cs-tour__bar">
          <span className="cs-tour__count">{(i + 1) + " / " + steps.length}</span>
          <span className="cs-tour__btns">
            <button type="button" className="cs-button cs-button--ghost cs-button--xs" onClick={onClose}>{t("skip")}</button>
            {i > 0 ? <button type="button" className="cs-button cs-button--secondary cs-button--xs" onClick={() => setI(i - 1)}>{t("back")}</button> : null}
            <button type="button" className="cs-button cs-button--primary cs-button--xs" onClick={() => (last ? onClose && onClose() : setI(i + 1))}>{last ? t("done") : t("next")}</button>
          </span>
        </div>
      </div>
    </div>
  );
}
