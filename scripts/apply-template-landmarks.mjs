#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const templates = join(root, "templates");
const SKIP =
  '<a class="cs-skip" href="#main">Skip to main content</a>\n';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "_vendor" || name === "schema" || name === "email-safe") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

let changed = 0;
for (const file of walk(templates)) {
  let src = readFileSync(file, "utf8");
  if (/omelette-owns-print/.test(src)) continue;
  let next = src;
  if (!/<main[\s>]/.test(next) && !/\sid="main"/.test(next)) {
    if (/<body[^>]*>/i.test(next)) {
      next = next.replace(/<body([^>]*)>/i, `<body$1>\n<main id="main">`);
      if (/<\/body>/i.test(next)) next = next.replace(/<\/body>/i, "</main>\n</body>");
    }
  } else if (/<main(?![^>]*\bid=)/.test(next)) {
    next = next.replace(/<main(\s|>)/, '<main id="main"$1');
  }
  if (!/class="cs-skip"|href="#main"/.test(next)) {
    if (/<body[^>]*>/i.test(next)) {
      next = next.replace(/<body([^>]*)>/i, `<body$1>\n${SKIP}`);
    } else if (/<x-dc>/i.test(next)) {
      next = next.replace(/<x-dc>/i, `<x-dc>\n${SKIP}`);
    }
  }
  if (next !== src) {
    writeFileSync(file, next);
    changed += 1;
  }
}
console.log("apply-template-landmarks", { changed });
