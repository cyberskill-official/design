import { parseEditorFragment } from "./editor-parser.js";

/**
 * Editor HTML schema + sanitizer (CDS-SEC-001 / TASK-IMP-029).
 * Plain ESM — importable from Node gates and from Editor.jsx.
 */

export const EDITOR_SCHEMA = Object.freeze({
  tags: Object.freeze(["p", "br", "b", "i", "strong", "em", "ul", "ol", "li", "div", "span"]),
  /** Attributes allowed per tag (empty ⇒ strip all attrs). */
  attrs: Object.freeze({}),
});

const ALLOWED = new Set(EDITOR_SCHEMA.tags);
const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
const DROP_CONTENT = new Set([
  "script", "style", "iframe", "object", "embed", "link", "meta", "base",
  "template", "noscript", "noframes", "xmp", "plaintext", "textarea", "title",
]);

/** Escape text for HTML element content, never for attributes, URLs or scripts. */
export function escapeEditorText(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Parse inertly, then construct a new attribute-free HTML fragment. Node and
 * browsers use identical parsing and policy. Unknown HTML containers unwrap
 * only after their descendants have been visited; foreign/raw-text subtrees
 * are discarded. No input markup is copied into the result.
 */
export function sanitizeHtml(html) {
  if (html == null || html === "") return "";
  const fragment = parseEditorFragment(String(html), { scriptingEnabled: true });
  const pending = [...fragment.childNodes].reverse();
  const output = [];
  while (pending.length) {
    const node = pending.pop();
    if (typeof node === "string") { output.push(node); continue; }
    if (node.nodeName === "#text") { output.push(escapeEditorText(node.value)); continue; }
    const tag = node.tagName;
    if (!tag || node.namespaceURI !== HTML_NAMESPACE || DROP_CONTENT.has(tag)) continue;
    if (ALLOWED.has(tag)) {
      output.push(`<${tag}>`);
      if (tag === "br") continue;
      pending.push(`</${tag}>`);
    }
    for (let i = (node.childNodes?.length || 0) - 1; i >= 0; i--) pending.push(node.childNodes[i]);
  }
  return output.join("");
}
