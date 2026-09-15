#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const productsMd = readFileSync(join(root, "docs/products.md"), "utf8");
const productRows = [...productsMd.matchAll(/^\| \*\*([^*]+)\*\*/gm)].map((m) => m[1].trim());
assert(productRows.length === 8, "expected 8 products.md rows, got " + productRows.length);

const ledger = JSON.parse(readFileSync(join(root, "docs/adoption-ledger.json"), "utf8"));
assert(ledger.threshold === 0.8, "80% threshold");
assert(Array.isArray(ledger.products) && ledger.products.length === productRows.length, "ledger covers products.md");

const allowed = new Set(ledger.stablePackages);
const proven = ledger.products.filter((p) => {
  const surfaces = Array.isArray(p.surfaces) && p.surfaces.length >= 1 && p.surfaces.every((rel) => existsSync(join(root, rel)));
  return allowed.has(p.package) && existsSync(join(root, p.fixture)) && surfaces && p.marker;
});
const rate = proven.length / productRows.length;
assert(rate >= ledger.threshold, "adoption " + rate + " < " + ledger.threshold);

const markers = ledger.products.map((p) => p.marker);
assert(new Set(markers).size >= 6, "per-product markers must be distinct, not one shared Button");

const review = JSON.parse(readFileSync(join(root, "docs/governance-review.json"), "utf8"));
assert(review.tokenDriftIncidents === 0, "token drift must stay zero");
assert(review.deprecationMigrationRate >= 0.9, "deprecation migrations must exceed 90%");
assert(review.supportTickets && typeof review.supportTickets.inRepoCount === "number", "ticket baseline recorded");

const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
const deprecated = registry.exports.filter((e) => e.deprecation);
assert(deprecated.length === review.deprecatedExports, "governance deprecated count matches registry");
const names = registry.exports.map((e) => e.name);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
assert(dupes.length === review.duplicateComponentCount, "duplicate export names match governance");
if (deprecated.length === 0) {
  assert(review.deprecationMigrationRate === 1, "no deprecations ⇒ rate 1");
}

const tokenBind = [
  "ui_kits/status-hub/index.html",
  "ui_kits/website/index.html",
  "templates/delivery-kickoff/ds-base.js",
  "templates/bod-memo/ds-base.js",
  "templates/hr-announcement/ds-base.js",
];
for (const rel of tokenBind) {
  assert(
    readFileSync(join(root, rel), "utf8").includes("packages/tokens/dist/tokens.css"),
    rel + " must load @cyberskill/tokens/css",
  );
}

const ssr = spawnSync(process.execPath, ["apps/product-fixtures/render.mjs"], {
  cwd: root,
  encoding: "utf8",
});
if (ssr.status !== 0) {
  console.error(ssr.stdout || ssr.stderr);
  throw new Error("product fixtures SSR failed");
}

for (const product of ledger.products) {
  const host = join(root, "apps/product-hosts", product.id + ".html");
  assert(existsSync(host), "missing Stable host " + product.id);
  const hostSrc = readFileSync(host, "utf8");
  assert(hostSrc.includes("packages/tokens/dist/tokens.css"), product.id + " host must load tokens.css");
  assert(hostSrc.includes('data-product="' + product.id + '"'), product.id + " host missing SSR tree");
}

console.log("PASS test-adoption-slo", {
  products: productRows.length,
  proven: proven.length,
  rate,
  tokenDriftIncidents: review.tokenDriftIncidents,
  ticketBaseline: review.supportTickets.inRepoCount,
});
