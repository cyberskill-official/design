import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
function match(combo, e) {
  const parts = combo.toLowerCase().split("+");
  const key = parts[parts.length - 1];
  const mod = parts.includes("mod") ? (e.metaKey || e.ctrlKey) : true;
  const shift = parts.includes("shift") ? e.shiftKey : !e.shiftKey || key.length > 1;
  const alt = parts.includes("alt") ? e.altKey : !e.altKey;
  return mod && shift && alt && e.key.toLowerCase() === key;
}

/** CyberSkill HotKeys — global keymap: bindings [{keys:"mod+k",description,onTrigger}]. "?" opens a bilingual cheat-sheet. */
export const HotKeys = React.forwardRef(function HotKeys({ bindings = [], help = true, children, lang, className }, forwardedRef) {
  const [show, setShow] = React.useState(false);
  const [ref, L] = useLang(lang);
  const t = makeT("HotKeys", L);
  React.useEffect(() => {
    const on = (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (help && e.key === "?") { setShow((s) => !s); return; }
      if (e.key === "Escape") setShow(false);
      for (const b of bindings) if (match(b.keys, e)) { e.preventDefault(); b.onTrigger && b.onTrigger(); return; }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [bindings, help]);
  return (
    <div ref={mergeRefs(ref, forwardedRef)} className={cx("cs-hotkeys", className)}>
      {children}
      {show ? (
        <div className="cs-hotkeys__sheet" role="dialog" aria-label={t("title")} onClick={() => setShow(false)}>
          <div className="cs-hotkeys__card" onClick={(e) => e.stopPropagation()}>
            <b>{t("title")}</b>
            <ul>
              {bindings.map((b, i) => <li key={i}><span>{b.description}</span><kbd className="cs-kbd">{b.keys}</kbd></li>)}
              <li><span>{t("toggle")}</span><kbd className="cs-kbd">?</kbd></li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
});
