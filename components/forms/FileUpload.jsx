import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill FileUpload — click-or-drag dropzone. Calls onFiles(File[]) on select/drop.
 * Uses a single labeled <input type="file"> (no nested interactive) for axe name/role. */
export const FileUpload = React.forwardRef(function FileUpload({ controlRef, title, hint, accept, multiple = false, onFiles, icon, lang, className , rootProps }, forwardedRef) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(inputRef, controlRef);
  const pick = (files) => { if (files && files.length && onFiles) onFiles(multiple ? Array.from(files) : [files[0]]); };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("FileUpload", L, localeMessages);
  const tt = title != null ? title : t("title");
  const hh = hint != null ? hint : t("hint");
  const id = React.useId();
  return (
    <div
      ref={mergedNativeRef}
      {...mergeTargetProps({ "className": cx("cs-dropzone", drag && "is-dragging", className), "onDragOver": (e) => { e.preventDefault(); setDrag(true); }, "onDragLeave": () => setDrag(false), "onDrop": (e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files); }, "onClick": () => inputRef.current && inputRef.current.click() }, rootProps, [])}




    >
      <span className="cs-dropzone__icon" aria-hidden="true">
        {icon ?? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" /></svg>}
      </span>
      <label className="cs-dropzone__title" htmlFor={id}>{tt}</label>
      <span className="cs-dropzone__hint" id={id + "-hint"}>{hh}</span>
      <input
        id={id}
        ref={mergedControlRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="cs-sr-only"
        aria-describedby={id + "-hint"}
        onChange={(e) => pick(e.target.files)}
        onClick={(e) => { e.stopPropagation(); e.currentTarget.value = ""; }}
      />
    </div>
  );
});
FileUpload.displayName = "FileUpload";
