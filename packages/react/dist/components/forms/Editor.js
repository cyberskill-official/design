import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { EDITOR_SCHEMA as editorSchema, sanitizeHtml as sanitizeEditorHtml } from "./editor-schema.js";
const EDITOR_SCHEMA = editorSchema;
function sanitizeHtml(html) {
  return sanitizeEditorHtml(html);
}
const Editor = React.forwardRef(function Editor2({ defaultValue = "", value, unsafeHtml, onChange, minHeight = 120, lang, className }, forwardedRef) {
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
    box.current.innerHTML = unsafeHtml != null ? String(unsafeHtml) : sanitizeHtml(defaultValue);
    seeded.current = true;
  }, [defaultValue, value, controlled, unsafeHtml]);
  const B = ({ c, label, children }) => /* @__PURE__ */ jsx("button", { type: "button", className: "cs-toolbar__btn", "aria-label": label, onMouseDown: (e) => {
    e.preventDefault();
    cmd(c);
  }, children });
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-editor", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "cs-editor__bar", role: "toolbar", "aria-label": t("toolbar"), children: [
      /* @__PURE__ */ jsx(B, { c: "bold", label: t("bold"), children: /* @__PURE__ */ jsx("b", { children: "B" }) }),
      /* @__PURE__ */ jsx(B, { c: "italic", label: t("italic"), children: /* @__PURE__ */ jsx("i", { children: "I" }) }),
      /* @__PURE__ */ jsx(B, { c: "insertUnorderedList", label: t("list"), children: "\u2254" })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: box,
        className: "cs-editor__area",
        contentEditable: true,
        suppressContentEditableWarning: true,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": t("area"),
        style: { minHeight },
        onInput: emit,
        onBlur: emit
      }
    )
  ] });
});
export {
  EDITOR_SCHEMA,
  Editor,
  sanitizeHtml
};
