import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
const PEN = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z" /></svg>;

/** CyberSkill InlineEdit — click-to-edit text. Enter/blur commits, Escape cancels. */
export const InlineEdit = React.forwardRef(function InlineEdit({ controlRef, value, defaultValue = "", onChange, label, lang, className , rootProps }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const [edit, setEdit] = React.useState(false);
  const [draft, setDraft] = React.useState(val);
  const cancellingRef = React.useRef(false);
  const commit = () => {
    if (cancellingRef.current) { cancellingRef.current = false; return; }
    setEdit(false);
    if (draft !== val) { if (value == null) setInner(draft); onChange && onChange(draft); }
  };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("InlineEdit", L, localeMessages);
  const { scope } = useOverlayLayer({ open: edit, kind: "popover", panelRef: ref, restoreFocus: false, onEscape: () => {
    cancellingRef.current = true;
    setDraft(val); setEdit(false);
    requestAnimationFrame(() => ref.current?.querySelector("button")?.focus());
  } });
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-inline-edit", className) }, rootProps, [])}>
      {edit ? (
        <input autoFocus value={draft} aria-label={label || t("edit")} onChange={(e) => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={(e) => { if (!e.nativeEvent.isComposing && e.keyCode !== 229 && e.key === "Enter") commit(); }}  ref={mergedControlRef} />
      ) : (
        <button type="button" className="cs-inline-edit__view" aria-label={t("edit") + (label ? ": " + label : "")} onClick={() => { cancellingRef.current = false; setDraft(val); setEdit(true); }}>
          <span className={val ? undefined : "ph"}>{val || t("empty")}</span>{PEN}
        </button>
      )}
    </span>
    </overlayScopeContext.Provider>
  );
});
InlineEdit.displayName = "InlineEdit";
