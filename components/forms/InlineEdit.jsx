import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
const PEN = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z" /></svg>;

/** CyberSkill InlineEdit — click-to-edit text. Enter/blur commits, Escape cancels. */
export function InlineEdit({ value, defaultValue = "", onChange, label, lang, className }) {
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const [edit, setEdit] = React.useState(false);
  const [draft, setDraft] = React.useState(val);
  const commit = () => { setEdit(false); if (draft !== val) { if (value == null) setInner(draft); onChange && onChange(draft); } };
  const [ref, L] = useLang(lang);
  const t = makeT("InlineEdit", L);
  const { scope } = useOverlayLayer({ open: edit, kind: "popover", panelRef: ref, restoreFocus: false, onEscape: () => {
    setDraft(val); setEdit(false);
    requestAnimationFrame(() => ref.current?.querySelector("button")?.focus());
  } });
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={ref} className={cx("cs-inline-edit", className)}>
      {edit ? (
        <input autoFocus value={draft} aria-label={label} onChange={(e) => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={(e) => { if (!e.nativeEvent.isComposing && e.keyCode !== 229 && e.key === "Enter") commit(); }} />
      ) : (
        <button type="button" className="cs-inline-edit__view" aria-label={t("edit") + (label ? ": " + label : "")} onClick={() => { setDraft(val); setEdit(true); }}>
          <span className={val ? undefined : "ph"}>{val || t("empty")}</span>{PEN}
        </button>
      )}
    </span>
    </overlayScopeContext.Provider>
  );
}
