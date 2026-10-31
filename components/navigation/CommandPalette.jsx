import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { formatNumber, makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { notifyClosed } from "../_utils/open-change.js";

/** CyberSkill CommandPalette — ⌘K overlay with search + grouped actions. Controlled via open/onClose. */
export const CommandPalette = React.forwardRef(function CommandPalette({ controlRef, open, onClose, onOpenChange, placeholder, groups = [], lang, className , rootProps }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [q, setQ] = React.useState("");
  const panel = React.useRef(null);
  const closeRef = React.useRef(null);
  closeRef.current = () => notifyClosed(onOpenChange, onClose);

  const { scope } = useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    preferFocusSelector: ".cs-cmdk__search input",
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel,
  });

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("CommandPalette", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  if (!open) return null;
  const needle = q.trim().toLowerCase();
  const filteredGroups = groups.map(g => ({
    ...g,
    items: (g.items || []).filter(it => !needle || String(it.label).toLowerCase().includes(needle)),
  }));
  const resultCount = filteredGroups.reduce((count, group) => count + group.items.length, 0);
  const resultStatus = resultCount === 0 ? t("empty")
    : t(resultCount === 1 ? "oneResult" : "results").replace("{count}", formatNumber(resultCount, L));
  return (
    <overlayScopeContext.Provider value={scope}>
    <div
      ref={(el) => {
        ref.current = el;
        panel.current = el;
      }}
      className="cs-cmdk-scrim"
      onClick={() => closeRef.current()}
    >
      <div {...mergeTargetProps({ "className": cx("cs-cmdk", className), "onClick": (e) => e.stopPropagation() }, rootProps, ["role","aria-modal","aria-label"])} role="dialog" aria-modal="true" aria-label={t("aria")}  ref={mergedNativeRef} >
        <div className="cs-cmdk__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input aria-label={ph} value={q} onChange={(e) => setQ(e.target.value)} placeholder={ph}  ref={mergedControlRef} />
          <span className="cs-kbd">{t("esc")}</span>
        </div>
        <div className="cs-cmdk__list">
          <div className="cs-cmdk__status" role="status" aria-live="polite" aria-atomic="true">{resultStatus}</div>
          {filteredGroups.map((g, gi) => {
            const items = g.items;
            if (!items.length) return null;
            return (
              <React.Fragment key={gi}>
                {(g.label || g.label === 0) ? <div className="cs-cmdk__label">{g.label}</div> : null}
                {items.map((it, ii) => (
                  <button key={ii} type="button" className="cs-cmdk__item" onClick={() => { it.onSelect && it.onSelect(); setQ(""); closeRef.current(); }}>
                    {(it.icon || it.icon === 0) ? <span aria-hidden="true">{it.icon}</span> : null}
                    <span>{it.label}</span>
                    {(it.shortcut || it.shortcut === 0) ? <span className="cs-kbd">{it.shortcut}</span> : null}
                  </button>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
    </overlayScopeContext.Provider>
  );
});
CommandPalette.displayName = "CommandPalette";
