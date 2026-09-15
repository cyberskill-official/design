#!/usr/bin/env node
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renameImport } from "../../packages/codemods/transforms/rename-import.js";
import { wrapThemeProvider } from "../../packages/codemods/transforms/wrap-theme-provider.js";

function assert(c, m) {
  if (!c) throw new Error(m);
}

const dir = mkdtempSync(join(tmpdir(), "cs-codemod-"));
try {
  const renameFile = join(dir, "app.js");
  writeFileSync(renameFile, 'import { Button } from "@cyberskill/design";\n');
  const renamed = renameImport([renameFile]);
  assert(renamed.changed === 1, "rename-import changed");
  assert(readFileSync(renameFile, "utf8").includes('@cyberskill/react'), "rename target");

  const wrapFile = join(dir, "main.js");
  writeFileSync(wrapFile, 'import { createRoot } from "react-dom/client";\ncreateRoot(document.body);\n');
  const wrapped = wrapThemeProvider([wrapFile]);
  assert(wrapped.changed === 1, "wrap-theme-provider changed");
  const wrappedSrc = readFileSync(wrapFile, "utf8");
  assert(wrappedSrc.includes("ThemeProvider"), "ThemeProvider import");
  assert(wrapThemeProvider([wrapFile]).changed === 0, "wrap is idempotent");
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log("PASS test-codemods");
