/* CyberSkill i18n — shared bilingual helper (v3 Batch 0).
 * Vietnamese-first: default 'vi'. A component resolves its language from an explicit
 * `lang` prop → nearest [lang] ancestor → document <html lang> → 'vi'. Built-in UI
 * strings live in strings.js (EN + VI parity, enforced by _audit/bilingual-parity.html).
 * Import from a component:  import { makeT, resolveLang, formatDate } from "../_i18n/i18n.js"; */
import React from "react";
import { strings as STRINGS } from "./strings.js";

export function resolveLang(propLang, el) {
  const norm = (l) => (!l ? null : String(l).toLowerCase().startsWith("vi") ? "vi" : "en");
  let l = norm(propLang);
  if (!l && el && el.closest) { const a = el.closest("[lang]"); if (a) l = norm(a.getAttribute("lang")); }
  if (!l && typeof document !== "undefined") l = norm(document.documentElement.getAttribute("lang"));
  return l || "vi";
}

export function tr(component, key, lang) {
  const c = STRINGS[component] || {};
  const table = c[lang] || c.vi || c.en || {};
  if (table[key] != null) return table[key];
  const en = c.en || {};
  return en[key] != null ? en[key] : key;
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

/** VN date = DD/MM/YYYY; EN = 02 Jul 2026. */
export function formatDate(d, lang) {
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return "";
  if (lang === "vi") {
    const p = (n) => String(n).padStart(2, "0");
    return p(dt.getDate()) + "/" + p(dt.getMonth() + 1) + "/" + dt.getFullYear();
  }
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
export function monthName(i, lang) { return lang === "vi" ? VI_MONTHS[i] : new Date(2000, i, 1).toLocaleDateString("en-US", { month: "long" }); }
export function formatNumber(n, lang) { if (n == null || isNaN(n)) return ""; return new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US").format(n); }

/**
 * Format a money amount. Currency is independent of display language when options are used.
 *
 * Call shapes (FIND-025):
 * - Legacy: `formatCurrency(amount, "en"|"vi")` — preserves prior presentation
 *   (EN→USD-style `$1,234,567`; VI→`1.234.567 ₫`).
 * - Preferred: `formatCurrency(amount, { currency, locale?, lang? })` —
 *   `Intl.NumberFormat(locale, { style: "currency", currency })`.
 *   `locale` defaults from `lang` (`vi`→`vi-VN`, else `en-US`).
 */
export function formatCurrency(n, langOrOpts) {
  if (n == null || isNaN(n)) return "";
  const opts = langOrOpts && typeof langOrOpts === "object" ? langOrOpts : null;
  if (opts && opts.currency) {
    let locale = opts.locale;
    if (!locale) {
      locale = opts.lang === "vi" ? "vi-VN" : "en-US";
    }
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: String(opts.currency).toUpperCase(),
      currencyDisplay: "symbol",
    }).format(Number(n));
  }
  const lang = typeof langOrOpts === "string" ? langOrOpts : (opts && opts.lang) || "en";
  return lang === "vi"
    ? new Intl.NumberFormat("vi-VN").format(n) + "\u00a0₫"
    : "$" + new Intl.NumberFormat("en-US").format(n);
}
