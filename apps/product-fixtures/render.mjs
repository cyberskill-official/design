#!/usr/bin/env node
/**
 * Per-product Stable-package hosts. Each registered product renders a
 * product-specific tree from compiled @cyberskill/react + @cyberskill/themes
 * and must keep its in-repo surface files. Not a claim of live traffic.
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { tokens } from "@cyberskill/tokens";
import { catalog } from "./catalog.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const requireRoot = createRequire(join(root, "package.json"));
const React = requireRoot("react");

if (!String(React.version).startsWith("19") && !String(React.version).startsWith("18")) {
  throw new Error("product fixtures expect React 18/19, got " + React.version);
}

const umber = tokens.root.color["--cs-color-brand-umber"];
if (umber !== "#45210E") throw new Error("Stable tokens missing Umber");

const build = spawnSync(process.execPath, ["apps/product-hosts/build.mjs"], {
  cwd: root,
  encoding: "utf8",
});
if (build.status !== 0) {
  throw new Error("product-hosts build failed: " + (build.stderr || build.stdout));
}
if (!existsSync(join(root, "apps/product-hosts/dist/mount.js"))) {
  throw new Error("product-hosts dist/mount.js missing");
}

const hostDir = join(root, "apps/product-hosts");
mkdirSync(hostDir, { recursive: true });

const rendered = [];
for (const product of catalog) {
  const html = renderToString(product.render());
  if (!html.includes("data-product=\"" + product.id + "\"")) {
    throw new Error(product.id + " missing data-product");
  }
  if (!html.includes("data-cs-element=\"" + product.element + "\"")) {
    throw new Error(product.id + " missing element");
  }
  if (!html.includes(product.marker)) {
    throw new Error(product.id + " missing marker " + product.marker + " in " + html.slice(0, 200));
  }
  const hostRel = "apps/product-hosts/" + product.id + ".html";
  writeFileSync(
    join(root, hostRel),
    [
      "<!DOCTYPE html>",
      '<html lang="en">',
      "<head>",
      '<meta charset="utf-8"/>',
      '<meta name="viewport" content="width=device-width, initial-scale=1"/>',
      "<title>" + product.name + " · Stable host</title>",
      '<link rel="stylesheet" href="../../packages/tokens/dist/tokens.css"/>',
      '<link rel="stylesheet" href="../../styles.css"/>',
      "</head>",
      "<body>",
      '<main id="root" data-stable-host="' + product.id + '">',
      html,
      "</main>",
      '<script type="module" src="./dist/mount.js"></script>',
      "</body>",
      "</html>",
      "",
    ].join("\n"),
  );
  const surfaces = product.surfaces.concat([hostRel]);
  for (const rel of surfaces) {
    if (!existsSync(join(root, rel))) throw new Error(product.id + " missing surface " + rel);
    const src = readFileSync(join(root, rel), "utf8");
    if (!/--cs-|styles\.css|styles\.min\.css|tokens\.css|@cyberskill\/|CyberOS|TASK-|cs-[a-z]/.test(src)) {
      throw new Error(product.id + " surface " + rel + " does not consume tokens or Stable packages");
    }
  }
  rendered.push({ id: product.id, marker: product.marker, bytes: html.length, host: hostRel });
}

if (rendered.length !== catalog.length) throw new Error("product fixture count mismatch");
const markers = new Set(rendered.map((r) => r.marker));
if (markers.size < 6) throw new Error("product fixtures are not distinct enough");

console.log("PASS product-fixtures", { react: React.version, products: rendered.length, markers: [...markers] });
export { catalog, rendered };
