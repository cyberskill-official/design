"use client";
import {
  escapeEditorText,
  sanitizeHtml
} from "./chunk-JJG5ENFU.mjs";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  useClientLayoutEffect
} from "./chunk-CQQ2JOJD.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/Editor.jsx
import React from "react";
function EditorToolbarButton({ command, label, pressed, onCommand, children }) {
  return /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-toolbar__btn", "aria-label": label, "aria-pressed": pressed, onMouseDown: (e) => e.preventDefault(), onClick: () => onCommand(command) }, children);
}
var Editor = React.forwardRef(function Editor2({ controlRef, defaultValue = "", unsafeHtml, onChange, minHeight = 120, lang, className, rootProps }, forwardedRef) {
  const box = React.useRef(null);
  const mergedControlRef = useComposedRefs(box, controlRef);
  const seeded = React.useRef(false);
  const selection = React.useRef(null);
  const [formatting, setFormatting] = React.useState({ bold: false, italic: false, insertUnorderedList: false });
  const syncFormatting = (range) => {
    const commands = ["bold", "italic", "insertUnorderedList"];
    const samples = [];
    if (!range.collapsed) {
      const walker = document.createTreeWalker(box.current, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        if (!node.length || !range.intersectsNode(node) || range.startContainer === node && range.startOffset === node.length || range.endContainer === node && range.endOffset === 0) continue;
        const style = getComputedStyle(node.parentElement);
        samples.push({
          bold: Number.parseInt(style.fontWeight, 10) >= 600,
          italic: /^(italic|oblique)/.test(style.fontStyle),
          insertUnorderedList: node.parentElement.closest("ul,ol")?.tagName === "UL"
        });
      }
    }
    const next = Object.fromEntries(commands.map((command) => {
      const values = samples.map((sample) => sample[command]);
      const value = values.length ? values.every(Boolean) ? true : values.some(Boolean) ? "mixed" : false : document.queryCommandIndeterm(command) ? "mixed" : document.queryCommandState(command);
      return [command, value];
    }));
    setFormatting((previous) => commands.every((key) => previous[key] === next[key]) ? previous : next);
  };
  const lastEmitted = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Editor", L, localeMessages);
  const rememberSelection = () => {
    const s = window.getSelection();
    if (s?.rangeCount && box.current?.contains(s.getRangeAt(0).commonAncestorContainer)) {
      selection.current = s.getRangeAt(0).cloneRange();
      syncFormatting(s.getRangeAt(0));
    }
  };
  React.useEffect(() => {
    document.addEventListener("selectionchange", rememberSelection);
    return () => document.removeEventListener("selectionchange", rememberSelection);
  }, []);
  const restoreSelection = () => {
    const el = box.current;
    if (!el) return;
    el.focus();
    const s = window.getSelection();
    const r = selection.current;
    if (r && el.contains(r.commonAncestorContainer)) {
      s.removeAllRanges();
      s.addRange(r);
    } else {
      const end = document.createRange();
      end.selectNodeContents(el);
      end.collapse(false);
      s.removeAllRanges();
      s.addRange(end);
    }
  };
  const cmd = (c) => {
    restoreSelection();
    document.execCommand(c);
    emit();
  };
  const emit = () => {
    if (!box.current) return;
    const clean = sanitizeHtml(box.current.innerHTML);
    if (box.current.innerHTML !== clean) {
      box.current.innerHTML = clean;
      selection.current = null;
      restoreSelection();
    }
    rememberSelection();
    if (lastEmitted.current !== clean) {
      lastEmitted.current = clean;
      onChange?.(clean);
    }
  };
  const insertTransfer = (data) => {
    if (!data) return;
    const html = data.getData("text/html");
    const clean = html ? sanitizeHtml(html) : escapeEditorText(data.getData("text/plain")).replace(/\r?\n/g, "<br>");
    restoreSelection();
    if (!document.execCommand("insertHTML", false, clean)) {
      const s = window.getSelection();
      if (!s?.rangeCount) return;
      const r = s.getRangeAt(0);
      const tpl = document.createElement("template");
      tpl.innerHTML = clean;
      const last = tpl.content.lastChild;
      r.deleteContents();
      r.insertNode(tpl.content);
      if (last) r.setStartAfter(last);
      r.collapse(true);
      s.removeAllRanges();
      s.addRange(r);
    }
    emit();
  };
  const paste = (e) => {
    e.preventDefault();
    rememberSelection();
    insertTransfer(e.clipboardData);
  };
  const drop = (e) => {
    e.preventDefault();
    const point = document.caretPositionFromPoint?.(e.clientX, e.clientY);
    let r = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (!r && point) {
      r = document.createRange();
      r.setStart(point.offsetNode, point.offset);
      r.collapse(true);
    }
    if (r && box.current?.contains(r.commonAncestorContainer)) selection.current = r;
    insertTransfer(e.dataTransfer);
  };
  useClientLayoutEffect(() => {
    if (!box.current || seeded.current) return;
    box.current.innerHTML = unsafeHtml != null ? String(unsafeHtml) : sanitizeHtml(defaultValue);
    lastEmitted.current = sanitizeHtml(box.current.innerHTML);
    seeded.current = true;
  }, [defaultValue, unsafeHtml]);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-editor", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement("div", { className: "cs-editor__bar", role: "toolbar", "aria-label": t("toolbar") }, /* @__PURE__ */ React.createElement(EditorToolbarButton, { onCommand: cmd, pressed: formatting.bold, command: "bold", label: t("bold") }, /* @__PURE__ */ React.createElement("b", null, "B")), /* @__PURE__ */ React.createElement(EditorToolbarButton, { onCommand: cmd, pressed: formatting.italic, command: "italic", label: t("italic") }, /* @__PURE__ */ React.createElement("i", null, "I")), /* @__PURE__ */ React.createElement(EditorToolbarButton, { onCommand: cmd, pressed: formatting.insertUnorderedList, command: "insertUnorderedList", label: t("list") }, "≔")), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: mergedControlRef,
      className: "cs-editor__area",
      contentEditable: true,
      suppressContentEditableWarning: true,
      role: "textbox",
      "aria-multiline": "true",
      "aria-label": t("area"),
      style: { minHeight },
      onInput: emit,
      onSelect: rememberSelection,
      onBlur: rememberSelection,
      onPaste: paste,
      onDrop: drop,
      onDragOver: (e) => e.preventDefault()
    }
  ));
});
Editor.displayName = "Editor";

export {
  Editor
};
//# sourceMappingURL=chunk-YA7Y7PEC.mjs.map
