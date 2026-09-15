#!/usr/bin/env node
/**
 * Contract for Firefox/WebKit, mobile, 320/200%/400% zoom, forced-colors,
 * reduced-motion, RTL, and pseudo-locale. The Playwright job runs the live
 * matrix; this Node test locks the policy files and fixture coverage.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
assert(pkg.engines && pkg.engines.node, "engines.node");
assert(Array.isArray(pkg.browserslist) && pkg.browserslist.length >= 4, "browserslist policy");

const support = readFileSync(join(root, "docs/support-matrix.md"), "utf8");
assert(/Firefox/.test(support) && /WebKit|Safari/.test(support), "browser matrix documented");
assert(/200%/.test(support) && /400%/.test(support), "200% and 400% zoom documented");
assert(/forced-colors|Forced colors/i.test(support), "forced-colors documented");
assert(/pseudo-locale|en-XA/i.test(support), "pseudo-locale documented");
assert(/RTL|dir="rtl"/i.test(support), "RTL documented");
assert(/## CSS capabilities/.test(support), "CSS capability matrix documented");
assert(/backdrop-filter/.test(support) && /@supports/.test(support), "backdrop-filter fallback documented");
assert(/-webkit-backdrop-filter/.test(support), "webkit backdrop prefix documented");
assert(/color-mix/.test(support), "color-mix policy documented");

const glass = readFileSync(join(root, "base/glass.css"), "utf8");
assert(
  glass.includes("@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))"),
  "glass.css @supports backdrop fallback",
);
assert(glass.includes("-webkit-backdrop-filter"), "glass.css webkit backdrop prefix");
assert(glass.includes("color-mix"), "glass.css color-mix wash");

const workflow = readFileSync(join(root, ".github/workflows/design-system-gates.yml"), "utf8");
assert(/firefox/i.test(workflow) && /webkit/i.test(workflow), "CI installs Firefox/WebKit");
assert(/inclusive-matrix/.test(workflow), "inclusive-matrix job");

const zoom = readFileSync(join(root, "_audit/zoom-text-spacing.html"), "utf8");
assert(/400%|320/.test(zoom), "existing 320/400 zoom harness");

const i18n = readFileSync(join(root, "components/_i18n/i18n.js"), "utf8");
assert(i18n.includes("pseudo"), "pseudo-locale resolver");
assert(i18n.includes("localeForLang"), "locale negotiation");

const matrix = readFileSync(join(root, "_audit/ci/inclusive-matrix.mjs"), "utf8");
assert(matrix.includes('zoom = "2"'), "200% zoom is executed, not only documented");
assert(matrix.includes('zoom = "4"'), "400% zoom is executed, not only documented");
assert(/isMobile|390/.test(matrix), "mobile viewport is executed");
assert(/media: ["']print["']/.test(matrix), "print media is executed");

console.log("PASS test-inclusive-matrix");
