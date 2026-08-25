/* CyberSkill i18n — shared locale helper (v3 Batch 0 + TASK-IMP-026 locale spike).
 * Vietnamese-first: default 'vi'. A component resolves its language from an explicit
 * `lang` prop → nearest [lang] ancestor → document <html lang> → 'vi'.
 * Language axis values are BCP-47 primary subtags (en · vi · ja spike). Built-in UI
 * strings live in strings.js (EN + VI required; optional locales gated by bilingual-parity).
 * Import from a component:  import { makeT, resolveLang, formatDate } from "../_i18n/i18n.js"; */
import React from "react";
import { strings as STRINGS } from "./strings.js";

/** Locales with known registry tables or formatting branches. Spike: ja (TASK-IMP-026). */
export const KNOWN_LOCALES = Object.freeze(["vi", "en", "ja"]);

/**
 * Normalize a lang / BCP-47 / display label to a primary language subtag.
 * Returns null when empty so callers can fall through to Vietnamese-first default.
 */
export function primaryLang(tag) {
  if (tag == null) return null;
  const raw = String(tag).trim();
  if (!raw) return null;
  const lower = raw.toLowerCase().replace(/_/g, "-");
  if (lower === "tiếng việt" || lower === "tieng viet") return "vi";
  if (lower === "english") return "en";
  if (lower === "日本語" || lower === "japanese") return "ja";
  if (lower.startsWith("vi")) return "vi";
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("ja")) return "ja";
  const primary = lower.split("-")[0];
  return primary || null;
}

export function resolveLang(propLang, el) {
  let l = primaryLang(propLang);
  if (!l && el && el.closest) {
    const a = el.closest("[lang]");
    if (a) l = primaryLang(a.getAttribute("lang"));
  }
  if (!l && typeof document !== "undefined") {
    l = primaryLang(document.documentElement.getAttribute("lang"));
  }
  return l || "vi";
}

export function tr(component, key, lang) {
  const c = STRINGS[component] || {};
  const want = primaryLang(lang) || "vi";
  const table = c[want] || c.en || c.vi || {};
  if (table[key] != null) return table[key];
  const en = c.en || {};
  if (en[key] != null) return en[key];
  const vi = c.vi || {};
  return vi[key] != null ? vi[key] : key;
}

/** Bind a component + language once: const t = makeT("Pagination", lang); t("next"). */
export function makeT(component, lang) { return (key) => tr(component, key, lang); }

/** React hook: attach the returned ref to the component root; resolves language from an
 * explicit prop → nearest [lang] ancestor (e.g. a template's VN wrapper) → <html lang> → 'vi'.
 * Corrects to the ancestor value in a layout effect (before paint). */
export function useLang(propLang) {
  const ref = React.useRef(null);
  const [lang, setLang] = React.useState(() => resolveLang(propLang, null));
  React.useLayoutEffect(() => {
    const el = ref.current;
    setLang(resolveLang(propLang, el));
    if (!el || propLang) return undefined;
    // Re-resolve when an ancestor [lang] changes (template Language axis / __dcSetProps).
    const obs = new MutationObserver(() => setLang(resolveLang(propLang, el)));
    let node = el.parentElement;
    while (node) {
      obs.observe(node, { attributes: true, attributeFilter: ["lang"] });
      node = node.parentElement;
    }
    return () => obs.disconnect();
  }, [propLang]);
  return [ref, lang];
}

const VI_MONTHS = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];

/** VN date = DD/MM/YYYY; EN = 02 Jul 2026; JA = 2026/07/02. */
export function formatDate(d, lang) {
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return "";
  const L = primaryLang(lang) || "vi";
  if (L === "vi") {
    const p = (n) => String(n).padStart(2, "0");
    return p(dt.getDate()) + "/" + p(dt.getMonth() + 1) + "/" + dt.getFullYear();
  }
  if (L === "ja") {
    return dt.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
  }
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
export function monthName(i, lang) {
  const L = primaryLang(lang) || "vi";
  if (L === "vi") return VI_MONTHS[i];
  if (L === "ja") return new Date(2000, i, 1).toLocaleDateString("ja-JP", { month: "long" });
  return new Date(2000, i, 1).toLocaleDateString("en-US", { month: "long" });
}
export function formatNumber(n, lang) {
  if (n == null || isNaN(n)) return "";
  const L = primaryLang(lang) || "vi";
  const locale = L === "vi" ? "vi-VN" : L === "ja" ? "ja-JP" : "en-US";
  return new Intl.NumberFormat(locale).format(n);
}

/**
 * Format a money amount. Currency is independent of display language when options are used.
 *
 * Call shapes (FIND-025):
 * - Legacy: `formatCurrency(amount, "en"|"vi")` — preserves prior presentation
 *   (EN→USD-style `$1,234,567`; VI→`1.234.567 ₫`).
 * - Preferred: `formatCurrency(amount, { currency, locale?, lang? })` —
 *   `Intl.NumberFormat(locale, { style: "currency", currency })`.
 *   `locale` defaults from `lang` (`vi`→`vi-VN`, `ja`→`ja-JP`, else `en-US`).
 */
export function formatCurrency(n, langOrOpts) {
  if (n == null || isNaN(n)) return "";
  const opts = langOrOpts && typeof langOrOpts === "object" ? langOrOpts : null;
  if (opts && opts.currency) {
    let locale = opts.locale;
    if (!locale) {
      const L = primaryLang(opts.lang) || "en";
      locale = L === "vi" ? "vi-VN" : L === "ja" ? "ja-JP" : "en-US";
    }
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: String(opts.currency).toUpperCase(),
      currencyDisplay: "symbol",
    }).format(Number(n));
  }
  const lang = typeof langOrOpts === "string" ? langOrOpts : (opts && opts.lang) || "en";
  const L = primaryLang(lang) || "en";
  return L === "vi"
    ? new Intl.NumberFormat("vi-VN").format(n) + "\u00a0₫"
    : "$" + new Intl.NumberFormat("en-US").format(n);
}
