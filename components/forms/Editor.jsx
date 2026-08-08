import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** Strip script/style/event-handler markup before injecting HTML (CDS-SEC-001). */
function sanitizeHtml(html) {
  if (html == null || html === "") return "";
  if (typeof document === "undefined") {
    return String(html)
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/javascript:/gi, "");
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = String(html);
  tpl.content.querySelectorAll("script,style,iframe,object,embed,link").forEach((n) => n.remove());
  tpl.content.querySelectorAll("*").forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (/^on/i.test(a.name) || /javascript:/i.test(a.value)) n.removeAttribute(a.name);
    });
  });
  return tpl.innerHTML;
}

/** CyberSkill Editor — light rich-text (contentEditable): bold · italic · bullet list. onChange(html). */
export function Editor({ defaultValue = "", onChange, minHeight = 120, lang, className }) {
  const box = React.useRef(null);
  const seeded = React.useRef(false);
  const [ref, L] = useLang(lang);
  const t = makeT("Editor", L);
  const cmd = (c) => { document.execCommand(c); box.current && box.current.focus(); emit(); };
  const emit = () => { onChange && box.current && onChange(box.current.innerHTML); };
  React.useLayoutEffect(() => {
    if (!box.current || seeded.current) return;
    box.current.innerHTML = sanitizeHtml(defaultValue);
    seeded.current = true;
  }, [defaultValue]);
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
      />
    </div>
  );
}
