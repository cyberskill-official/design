import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "./OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill Tour — spotlight walkthrough over target elements (by CSS selector). Controlled via open/onClose. */
export function Tour({ steps = [], open, onClose, lang, className }) {
  const [storedIndex, setI] = React.useState(0);
  const i = Math.max(0, Math.min(storedIndex, steps.length - 1));
  if (storedIndex !== i) setI(i);
  const [rect, setRect] = React.useState(null);
  const [pop, setPop] = React.useState({ top: 80, left: 40 });
  const [ref, L] = useLang(lang);
  const t = makeT("Tour", L);
  const panel = React.useRef(null);
  const titleId = React.useId();
  const backdrop = React.useRef(null);
  const { scope } = useOverlayLayer({ open: !!open && steps.length > 0, kind: "modal", trapFocus: true, panelRef: panel, backdropRef: backdrop, onEscape: onClose });
  React.useEffect(() => { if (open) setI(0); }, [open]);
  const target = steps[i]?.target;
  React.useEffect(() => {
    if (!open || !target) return undefined;
    let frame;
    let previous;
    const measure = () => {
      const el = document.querySelector(target);
      const r = el?.getBoundingClientRect();
      const next = r ? { x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12 } : null;
      const position = next ? {
        top: Math.min(window.innerHeight - 170, next.y + next.h + 12),
        left: Math.max(12, Math.min(window.innerWidth - 292, next.x)),
      } : { top: 80, left: 40 };
      const signature = JSON.stringify([next, position]);
      if (signature !== previous) {
        previous = signature;
        setRect(next);
        setPop(position);
      }
      // Layout shifts and transformed/replaced targets need not emit resize or scroll.
      frame = requestAnimationFrame(measure);
    };
    measure();
    return () => cancelAnimationFrame(frame);
  }, [open, target]);
  if (!open || !steps.length) return <span ref={ref} style={{ display: "none" }} />;
  const s = steps[i];
  const last = i === steps.length - 1;
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={ref} className={cx("cs-tour", className)}>
      <div ref={backdrop} className="cs-tour__scrim" onClick={onClose} />
      {rect ? <div className="cs-tour__hole" style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }} /> : null}
      <div ref={panel} tabIndex={-1} className="cs-tour__pop" role="dialog" aria-modal="true" aria-labelledby={titleId} style={{ left: pop.left, top: pop.top }}>
        <b id={titleId}>{s.title}</b>
        {(s.body || s.body === 0) ? <p>{s.body}</p> : null}
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
    </overlayScopeContext.Provider>
  );
}
