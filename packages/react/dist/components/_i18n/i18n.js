import React from "react";
import { strings as STRINGS } from "./strings.js";
const knownLocales = Object.freeze(["vi", "en", "ja"]);
function primaryLang(tag) {
  if (tag == null) return null;
  const raw = String(tag).trim();
  if (!raw) return null;
  const lower = raw.toLowerCase().replace(/_/g, "-");
  if (lower === "pseudo" || lower === "en-xa" || lower.startsWith("en-xa")) return "pseudo";
  if (lower === "ti\u1EBFng vi\u1EC7t" || lower === "tieng viet") return "vi";
  if (lower === "english") return "en";
  if (lower === "\u65E5\u672C\u8A9E" || lower === "japanese") return "ja";
  if (lower.startsWith("vi")) return "vi";
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("ja")) return "ja";
  const primary = lower.split("-")[0];
  return primary || null;
}
function localeForLang(lang) {
  const L = primaryLang(lang) || "vi";
  if (L === "vi") return "vi-VN";
  if (L === "ja") return "ja-JP";
  return "en-US";
}
function applyPseudo(str) {
  if (str == null) return str;
  return "\u27E6" + String(str) + "\u27E7";
}
function resolveLang(propLang, el) {
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
function tr(component, key, lang) {
  const c = STRINGS[component] || {};
  const want = primaryLang(lang) === "pseudo" ? "en" : primaryLang(lang) || "vi";
  const table = c[want] || c.en || c.vi || {};
  let out;
  if (table[key] != null) out = table[key];
  else {
    const en = c.en || {};
    if (en[key] != null) out = en[key];
    else {
      const vi = c.vi || {};
      out = vi[key] != null ? vi[key] : key;
    }
  }
  return primaryLang(lang) === "pseudo" ? applyPseudo(out) : out;
}
function makeT(component, lang) {
  return (key) => tr(component, key, lang);
}
function useLang(propLang) {
  const ref = React.useRef(null);
  const [lang, setLang] = React.useState(() => resolveLang(propLang, null));
  React.useLayoutEffect(() => {
    const el = ref.current;
    setLang(resolveLang(propLang, el));
    if (!el || propLang) return void 0;
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
const VI_MONTHS = ["Th\xE1ng 1", "Th\xE1ng 2", "Th\xE1ng 3", "Th\xE1ng 4", "Th\xE1ng 5", "Th\xE1ng 6", "Th\xE1ng 7", "Th\xE1ng 8", "Th\xE1ng 9", "Th\xE1ng 10", "Th\xE1ng 11", "Th\xE1ng 12"];
function formatDate(d, lang) {
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
function monthName(i, lang) {
  const L = primaryLang(lang) || "vi";
  if (L === "vi") return VI_MONTHS[i];
  if (L === "ja") return new Date(2e3, i, 1).toLocaleDateString("ja-JP", { month: "long" });
  return new Date(2e3, i, 1).toLocaleDateString("en-US", { month: "long" });
}
function formatNumber(n, lang) {
  if (n == null || isNaN(n)) return "";
  return new Intl.NumberFormat(localeForLang(lang)).format(n);
}
function formatCurrency(n, langOrOpts) {
  if (n == null || isNaN(n)) return "";
  const opts = langOrOpts && typeof langOrOpts === "object" ? langOrOpts : null;
  if (opts && opts.currency) {
    let locale = opts.locale;
    if (!locale) locale = localeForLang(opts.lang || "en");
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: String(opts.currency).toUpperCase(),
      currencyDisplay: "symbol"
    }).format(Number(n));
  }
  const lang = typeof langOrOpts === "string" ? langOrOpts : opts && opts.lang || "en";
  const L = primaryLang(lang) || "en";
  return L === "vi" ? new Intl.NumberFormat("vi-VN").format(n) + "\xA0\u20AB" : "$" + new Intl.NumberFormat("en-US").format(n);
}
export {
  applyPseudo,
  formatCurrency,
  formatDate,
  formatNumber,
  knownLocales,
  localeForLang,
  makeT,
  monthName,
  primaryLang,
  resolveLang,
  tr,
  useLang
};
