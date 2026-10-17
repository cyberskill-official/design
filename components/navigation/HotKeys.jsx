import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
function match(combo, e) {
  const parts = combo.toLowerCase().split("+").map(part => part.trim());
  const key = parts.pop();
  if (!key || parts.some(part => !["mod", "ctrl", "meta", "shift", "alt"].includes(part))) return false;
  const has = name => parts.includes(name);
  const control = has("mod")
    ? (e.metaKey || e.ctrlKey) && (!has("ctrl") || e.ctrlKey) && (!has("meta") || e.metaKey)
    : e.ctrlKey === has("ctrl") && e.metaKey === has("meta");
  return control && e.shiftKey === has("shift") && e.altKey === has("alt") && e.key.toLowerCase() === key;
}

/** CyberSkill HotKeys — global keymap: bindings [{keys:"mod+k",description,onTrigger}]. "?" opens a bilingual cheat-sheet. */
export function HotKeys({ bindings = [], help = true, children, lang, className }) {
  const [show, setShow] = React.useState(false);
  const [ref, L] = useLang(lang);
  const t = makeT("HotKeys", L);
  const panel = React.useRef(null);
  const backdrop = React.useRef(null);
  const { scope } = useOverlayLayer({ open: show, kind: "modal", trapFocus: true, panelRef: panel, backdropRef: backdrop, onEscape: () => setShow(false) });
  React.useEffect(() => {
    const on = (e) => {
      if (e.defaultPrevented || e.isComposing || e.keyCode === 229) return;
      const path = e.composedPath?.() || [e.target];
      if (path.some(node => node?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(node?.tagName))) return;
      if (help && e.key === "?") { setShow((s) => !s); return; }
      for (const b of bindings) if (match(b.keys, e)) { e.preventDefault(); b.onTrigger && b.onTrigger(); return; }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [bindings, help]);
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={ref} className={cx("cs-hotkeys", className)}>
      {children}
      {show ? (
        <div ref={backdrop} className="cs-hotkeys__sheet" role="dialog" aria-modal="true" aria-label={t("title")} onClick={() => setShow(false)}>
          <div ref={panel} tabIndex={-1} className="cs-hotkeys__card" onClick={(e) => e.stopPropagation()}>
            <b>{t("title")}</b>
            <ul>
              {bindings.map((b, i) => <li key={i}><span>{b.description}</span><kbd className="cs-kbd">{b.keys}</kbd></li>)}
              <li><span>{t("toggle")}</span><kbd className="cs-kbd">?</kbd></li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
}
