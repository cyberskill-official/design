#!/usr/bin/env node
/**
 * Wrap capitalized React component exports in React.forwardRef and attach
 * ref to the first returned host. Skips providers and files already wrapped.
 */
import { transformSync } from "esbuild";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["ThemeProvider", "OverlayProvider"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".jsx")) out.push(full);
  }
  return out;
}

function matchingParen(src, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function matchingBrace(src, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function attachRef(body) {
  if (/\bmergeRefs\(ref, forwardedRef\)/.test(body) || /\bref=\{forwardedRef\}/.test(body)) {
    return body;
  }
  const ret = body.search(/return\s*\(/);
  const start = ret >= 0 ? ret : body.search(/return\s*</);
  if (start < 0) return body;
  const slice = body.slice(start);
  const tag = slice.match(/<([A-Za-z][A-Za-z0-9.]*)/);
  if (!tag || tag[1] === "Fragment") return body;
  const abs = start + tag.index + tag[0].length;
  const untilGt = body.indexOf(">", abs);
  if (untilGt < 0) return body;
  const open = body.slice(abs, untilGt);
  if (/\bref=\{ref\}/.test(open)) {
    return (
      body.slice(0, abs) +
      open.replace(/ref=\{ref\}/, "ref={mergeRefs(ref, forwardedRef)}") +
      body.slice(abs + open.length)
    );
  }
  if (/\bref=/.test(open)) return body;
  return body.slice(0, abs) + " ref={forwardedRef}" + body.slice(abs);
}

function transformJsx(src) {
  if (!src.includes("import React from")) {
    src = `import React from "react";\n` + src;
  }
  let out = "";
  let cursor = 0;
  const re = /export function ([A-Z][A-Za-z0-9]*)\(/g;
  let m;
  let changed = false;
  while ((m = re.exec(src))) {
    const name = m[1];
    if (SKIP.has(name)) continue;
    const parenOpen = m.index + m[0].length - 1;
    const parenClose = matchingParen(src, parenOpen);
    if (parenClose < 0) continue;
    let i = parenClose + 1;
    while (src[i] && /\s/.test(src[i])) i++;
    if (src[i] !== "{") continue;
    const braceClose = matchingBrace(src, i);
    if (braceClose < 0) continue;
    out += src.slice(cursor, m.index);
    const params = src.slice(parenOpen + 1, parenClose);
    const body = attachRef(src.slice(i + 1, braceClose));
    out += `export const ${name} = React.forwardRef(function ${name}(${params}, forwardedRef) {${body}});`;
    cursor = braceClose + 1;
    changed = true;
    re.lastIndex = cursor;
  }
  out += src.slice(cursor);
  if (out.includes("mergeRefs(") && !out.includes("merge-refs.js")) {
    out = `import { mergeRefs } from "../_utils/merge-refs.js";\n` + out;
  }
  return { src: out, changed };
}

function transformDts(src) {
  return src.replace(
    /export function ([A-Z][A-Za-z0-9]*)\(props: ([^)]+)\): React\.ReactElement(?: \| null)?;/g,
    (full, name, props) => {
      if (SKIP.has(name)) return full;
      return `export const ${name}: React.ForwardRefExoticComponent<\n  ${props} & React.RefAttributes<HTMLElement>\n>;`;
    },
  );
}

const files = walk(join(root, "components"));
let jsxCount = 0;
let dtsCount = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  if (before.includes("React.forwardRef") && !/export function [A-Z]/.test(before)) continue;
  const { src, changed } = transformJsx(before);
  if (changed) {
    try {
      transformSync(src, { loader: "jsx", jsx: "automatic", format: "esm" });
    } catch (err) {
      console.error("SKIP syntax after transform", file, err.message);
      continue;
    }
    writeFileSync(file, src);
    jsxCount++;
    const dts = file.replace(/\.jsx$/, ".d.ts");
    try {
      const dtsSrc = readFileSync(dts, "utf8");
      const next = transformDts(dtsSrc);
      if (next !== dtsSrc) {
        writeFileSync(dts, next);
        dtsCount++;
      }
    } catch {
      /* no dts */
    }
  }
}
console.log("PASS apply-forward-ref", { jsx: jsxCount, dts: dtsCount });
