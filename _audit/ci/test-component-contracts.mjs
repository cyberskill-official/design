#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listPublicComponents } from "./storybook-inventory.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const button = readFileSync(join(root, "components/button/Button.jsx"), "utf8");
assert(button.includes("forwardRef"), "Button forwards ref");
assert(/ref=\{(?:ref|forwardedRef)\}/.test(button), "Button attaches ref");

const editor = readFileSync(join(root, "components/forms/Editor.jsx"), "utf8");
assert(editor.includes("sanitizeHtml"), "Editor sanitizes");
assert(/value/.test(editor), "Editor supports controlled value");

const image = readFileSync(join(root, "components/data/Image.jsx"), "utf8");
assert(image.includes("useOverlayLayer"), "Image preview uses overlay focus/restore");
assert(image.includes("aria-live"), "Image announces preview");
assert(image.includes('aria-modal="true"'), "Image preview is modal");

const sortable = readFileSync(join(root, "components/data/Sortable.jsx"), "utf8");
assert(sortable.includes("aria-live"), "Sortable live announcements");
assert(sortable.includes("aria-grabbed"), "Sortable drag semantics");

const carousel = readFileSync(join(root, "components/data/Carousel.jsx"), "utf8");
assert(carousel.includes("ArrowRight"), "Carousel keyboard");
assert(carousel.includes("aria-live"), "Carousel live region");
assert(carousel.includes("aria-roledescription"), "Carousel slide semantics");

const logo = readFileSync(join(root, "components/logo/Logo.jsx"), "utf8");
assert(/Trusted static markup/.test(logo), "Logo trusted-markup contract");

const overlay = readFileSync(join(root, "components/overlays/OverlayManager.jsx"), "utf8");
assert(overlay.includes("restoreEl"), "overlay restore-focus");
assert(overlay.includes("export function ThemeProvider"), "ThemeProvider on overlay module");

const SKIP_REF = new Set(["ThemeProvider", "OverlayProvider"]);
const modules = listPublicComponents();
const missing = [];
for (const m of modules) {
  const src = readFileSync(m.file, "utf8");
  for (const name of m.all) {
    if (SKIP_REF.has(name)) continue;
    if (!/forwardRef/.test(src)) missing.push(m.relFromRoot + "#" + name);
  }
}
assert(missing.length === 0, "interactive exports need forwardRef: " + missing.slice(0, 12).join(", "));
const withRef = modules.filter((m) => /forwardRef/.test(readFileSync(m.file, "utf8")));
assert(withRef.some((m) => m.primary === "Button"), "Button in ref set");

console.log("PASS test-component-contracts", {
  primaries: modules.length,
  forwardRef: withRef.length,
});
