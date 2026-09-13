import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { sanitizeHtml as sanitizeUntrustedHtml } from "../_utils/sanitize-html.js";

export function sanitizeHtml(html) {
  return sanitizeUntrustedHtml(html);
}

/** CyberSkill Editor — light rich-text (contentEditable): bold · italic · bullet list. onChange(html). */
export function Editor({ defaultValue = "", value, onChange, minHeight = 120, lang, className }) {
  const box = React.useRef(null);
  const seeded = React.useRef(false);
  const [ref, L] = useLang(lang);
  const t = makeT("Editor", L);
  const controlled = value != null;
  const cmd = (c) => {
    document.execCommand(c);
    box.current && box.current.focus();
    emit();
  };
  const emit = () => {
    if (!onChange || !box.current) return;
    onChange(sanitizeHtml(box.current.innerHTML));
  };
  React.useLayoutEffect(() => {
    if (!box.current) return;
    if (controlled) {
      const next = sanitizeHtml(value);
      if (box.current.innerHTML !== next) box.current.innerHTML = next;
      return;
    }
    if (seeded.current) return;
    box.current.innerHTML = sanitizeHtml(defaultValue);
    seeded.current = true;
  }, [defaultValue, value, controlled]);
  const B = ({ c, label, children }) => (
    <button type="button" className="cs-toolbar__btn" aria-label={label} onMouseDown={(e) => { e.preventDefault(); cmd(c); }}>{children}</button>
  );
  return (
    <div ref={ref} className={cx("cs-editor", className)}>
      <div className="cs-editor__bar" role="toolbar" aria-label={t("toolbar")}>
        <B c="bold" label={t("bold")}><b>B</b></B>
        <B c="italic" label={t("italic")}><i>I</i></B>
        <B c="insertUnorderedList" label={t("list")}>≔</B>
      </div>
      <div
        ref={box}
        className="cs-editor__area"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={t("area")}
        style={{ minHeight }}
        onInput={emit}
        onBlur={emit}
      />
    </div>
  );
}
