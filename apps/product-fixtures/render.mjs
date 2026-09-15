#!/usr/bin/env node
/**
 * In-repo proof that registered CyberSkill products can render from Stable
 * compiled packages (no raw JSX). This is not a claim of live production traffic.
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Button } from "@cyberskill/react";
import { ThemeProvider } from "@cyberskill/themes";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const requireRoot = createRequire(join(root, "package.json"));
const React = requireRoot("react");
const ledger = JSON.parse(readFileSync(join(root, "docs/adoption-ledger.json"), "utf8"));

if (!String(React.version).startsWith("19") && !String(React.version).startsWith("18")) {
  throw new Error("product fixtures expect React 18/19, got " + React.version);
}

const rendered = [];
for (const product of ledger.products) {
  const html = renderToString(
    createElement(
      ThemeProvider,
      { theme: "light", contrast: "standard" },
      createElement(Button, { "data-product": product.id }, product.name),
    ),
  );
  if (!html.includes("cs-button") && !html.includes("button")) {
    throw new Error("SSR missing button for " + product.id);
  }
  rendered.push(product.id);
}

if (rendered.length !== ledger.products.length) {
  throw new Error("product fixture count mismatch");
}

console.log("PASS product-fixtures", { react: React.version, products: rendered.length });
export { rendered };
