/**
 * Trusted-HTML sanitizer for Editor (and any future rich-text surface).
 *
 * Contract (enterprise consumers):
 * - Default trust: untrusted author HTML. Scripts, event handlers, and
 *   embedded browsing contexts are stripped.
 * - URL schemes allowed on href/src/cite: http, https, mailto, tel.
 * - Relative URLs (no scheme) are kept.
 * - data: and blob: are denied on navigable URLs (XSS / tracking).
 * - SSR path uses the same tag/attr/scheme rules via regex (no DOM).
 *
 * Consumers who must render already-trusted CMS HTML should sanitize on the
 * server with the same allowlists, then set a CSP that forbids script-src
 * unsafe-inline for user content. See docs/trusted-html.md.
 */

export const ALLOWED_URL_SCHEMES = Object.freeze(["http:", "https:", "mailto:", "tel:"]);

export const REMOVED_TAGS = Object.freeze([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
  "input",
  "textarea",
  "select",
  "button",
  "svg",
  "math",
]);

const URL_ATTRS = new Set(["href", "src", "cite", "action", "formaction", "xlink:href"]);

export function isAllowedUrl(value) {
  if (value == null) return false;
  const raw = String(value).trim();
  if (!raw) return false;
  if (/^\/(?!\/)/.test(raw) || raw.startsWith("#") || raw.startsWith("?")) return true;
  if (/^[^a-zA-Z]/.test(raw) && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) return true;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) return true;
  try {
    const u = new URL(raw, "https://cyberskill.invalid/");
    return ALLOWED_URL_SCHEMES.includes(u.protocol);
  } catch {
    return false;
  }
}

function stripByRegex(html) {
  let out = String(html);
  for (const tag of REMOVED_TAGS) {
    const re = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi");
    out = out.replace(re, "");
    out = out.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
  }
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  out = out.replace(/\s(href|src|cite|action|formaction)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi, (m, attr, _q, d, s, b) => {
    const val = d != null ? d : s != null ? s : b;
    return isAllowedUrl(val) ? m : "";
  });
  out = out.replace(/javascript:/gi, "");
  out = out.replace(/data:/gi, "");
  return out;
}

export function sanitizeHtml(html) {
  if (html == null || html === "") return "";
  if (typeof document === "undefined") return stripByRegex(html);
  const tpl = document.createElement("template");
  tpl.innerHTML = String(html);
  tpl.content.querySelectorAll(REMOVED_TAGS.join(",")).forEach((n) => n.remove());
  tpl.content.querySelectorAll("*").forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (/^on/i.test(a.name)) {
        n.removeAttribute(a.name);
        return;
      }
      if (URL_ATTRS.has(a.name.toLowerCase()) && !isAllowedUrl(a.value)) {
        n.removeAttribute(a.name);
        return;
      }
      if (/javascript:/i.test(a.value) || /data:/i.test(a.value)) {
        n.removeAttribute(a.name);
      }
    });
  });
  return tpl.innerHTML;
}
