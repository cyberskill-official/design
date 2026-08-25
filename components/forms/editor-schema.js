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

/** Strip disallowed nodes/attrs and dangerous markup before inject or emit. */
export function sanitizeHtml(html) {
  if (html == null || html === "") return "";
  const raw = String(html);
  if (typeof document === "undefined") {
    let s = raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<(iframe|object|embed|link|meta|base)[\s\S]*?>/gi, "")
      .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/javascript:/gi, "");
    s = s.replace(/<\/?([a-z0-9:-]+)(\s[^>]*)?>/gi, (m, tag) => {
      const t = tag.toLowerCase();
      if (!ALLOWED.has(t)) return "";
      if (t === "br") return "<br>";
      const close = m.startsWith("</");
      return close ? `</${t}>` : `<${t}>`;
    });
    return s;
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = raw;
  tpl.content.querySelectorAll("script,style,iframe,object,embed,link,meta,base").forEach((n) => n.remove());
  const walk = (node) => {
    const kids = [...node.childNodes];
    for (const child of kids) {
      if (child.nodeType === 1) {
        const el = child;
        const tag = el.tagName.toLowerCase();
        if (!ALLOWED.has(tag)) {
          while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
          el.remove();
          continue;
        }
        [...el.attributes].forEach((a) => el.removeAttribute(a.name));
        walk(el);
      }
    }
  };
  walk(tpl.content);
  return tpl.innerHTML;
}
