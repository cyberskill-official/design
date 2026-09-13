#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const templates = join(root, "templates");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "_vendor" || name === "schema" || name === "email-safe") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".dc.html") || name.endsWith(".html")) out.push(full);
  }
  return out;
}

const files = walk(templates);
const interactive = files.filter((f) => {
  const src = readFileSync(f, "utf8");
  return !/omelette-owns-print/.test(src) && !/name="omelette-owns-print"/.test(src);
});

const missing = [];
for (const f of interactive) {
  const src = readFileSync(f, "utf8");
  const hasSkip = /class="cs-skip"|href="#main"/.test(src);
  const hasMain = /id="main"|<main[\s>]/.test(src);
  if (!hasSkip || !hasMain) missing.push(f.slice(root.length + 1));
}

if (missing.length) {
  console.error("FAIL test-template-landmarks — interactive templates missing skip/#main:");
  for (const m of missing.slice(0, 40)) console.error("  " + m);
  process.exit(1);
}

console.log("PASS test-template-landmarks", { interactive: interactive.length, printExempt: files.length - interactive.length });
