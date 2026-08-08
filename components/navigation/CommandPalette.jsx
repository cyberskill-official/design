import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "../overlays/OverlayManager.jsx";

/** CyberSkill CommandPalette — ⌘K overlay with search + grouped actions. Controlled via open/onClose. */
export function CommandPalette({ open, onClose, placeholder, groups = [], lang, className }) {
  const [q, setQ] = React.useState("");
  const panel = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    preferFocusSelector: ".cs-cmdk__search input",
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel,
  });

  const [ref, L] = useLang(lang);
  const t = makeT("CommandPalette", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  if (!open) return null;
  const needle = q.trim().toLowerCase();
  return (
    <div
      ref={(el) => {
        ref.current = el;
        panel.current = el;
      }}
      className="cs-cmdk-scrim"
      onClick={onClose}
    >
      <div className={cx("cs-cmdk", className)} role="dialog" aria-modal="true" aria-label={t("aria")} onClick={(e) => e.stopPropagation()}>
        <div className="cs-cmdk__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={ph} />
          <span className="cs-kbd">{t("esc")}</span>
        </div>
        <div className="cs-cmdk__list">
          {groups.map((g, gi) => {
            const items = (g.items || []).filter((it) => !needle || String(it.label).toLowerCase().includes(needle));
            if (!items.length) return null;
            return (
              <React.Fragment key={gi}>
                {g.label ? <div className="cs-cmdk__label">{g.label}</div> : null}
                {items.map((it, ii) => (
                  <button key={ii} type="button" className="cs-cmdk__item" onClick={() => { it.onSelect && it.onSelect(); onClose && onClose(); }}>
                    {it.icon ? <span aria-hidden="true">{it.icon}</span> : null}
                    <span>{it.label}</span>
                    {it.shortcut ? <span className="cs-kbd">{it.shortcut}</span> : null}
                  </button>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
