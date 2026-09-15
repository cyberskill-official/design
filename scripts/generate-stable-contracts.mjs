#!/usr/bin/env node
/**
 * Extract per-component Stable (and Phase-2 high-risk) contract facts from
 * source, prompts, CSS tokens, and the export registry. Generic boilerplate
 * is a failure — each page must carry facts that exist only in that module.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));

const HIGH_RISK = [
  "AlertDialog", "Carousel", "Combobox", "DataGrid", "DatePicker", "Dialog",
  "Editor", "Image", "Menu", "Sortable", "TimePicker",
];

const KEYS = ["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", " "];

function walk(dir, pred, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, pred, out);
    else if (pred(name, full)) out.push(full);
  }
  return out;
}

function firstJsdoc(src) {
  const m = src.match(/\/\*\*\s*([\s\S]*?)\*\//);
  if (!m) return "";
  return m[1].replace(/^\s*\*\s?/gm, "").replace(/@\w+.*/g, "").trim().split("\n").filter(Boolean).slice(0, 3).join(" ");
}

function promptBlurb(rel) {
  const prompt = rel.replace(/\.jsx$/, ".prompt.md");
  const full = join(root, prompt);
  if (!existsSync(full)) return "";
  const text = readFileSync(full, "utf8");
  const para = text.split(/\n\n/)[0].replace(/\*\*/g, "").replace(/\n/g, " ").trim();
  return para.slice(0, 320);
}

function propsOf(src, name) {
  const re = new RegExp(
    `(?:export\\s+(?:const|function)\\s+${name}|function\\s+${name})[\\s\\S]{0,400}?\\(\\s*\\{([^}]{0,800})\\}`,
  );
  const m = src.match(re);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((p) => p.trim().split(/[\s=:]/)[0])
    .filter((p) => p && /^[A-Za-z_][A-Za-z0-9_]*$/.test(p) && p !== "ref" && p !== "forwardedRef");
}

function rootTag(src) {
  const m = src.match(/return\s+(?:\(|)\s*<([a-z][a-z0-9]*)\b/);
  return m ? m[1] : "";
}

function classNames(src) {
  return [...new Set(
    [...src.matchAll(/["'`](cs-[a-z0-9]+(?:__[a-z0-9-]+|--[a-z0-9-]+)*)/g)].map((m) => m[1]),
  )].filter((c) => !c.endsWith("--") && !c.endsWith("__"));
}

function hostClass(name, classes) {
  const needle = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return classes.find((c) => c === "cs-" + needle || c.startsWith("cs-" + needle)) || classes[0] || "";
}

function ariaBits(src) {
  return [...new Set([
    ...[...src.matchAll(/role=["']([^"']+)/g)].map((m) => "role=" + m[1]),
    ...[...src.matchAll(/(aria-[\w-]+)=/g)].map((m) => m[1]),
  ])];
}

function keysOf(src) {
  const found = KEYS.filter((k) => src.includes(`"${k}"`) || src.includes(`'${k}'`) || src.includes(`key === "${k}"`) || src.includes(`key === '${k}'`));
  if (src.includes("useOverlayLayer") || src.includes("onEscape")) {
    if (!found.includes("Escape")) found.push("Escape");
  }
  if (src.includes("attachFocusTrap") && !found.includes("Tab")) found.push("Tab");
  return found;
}

function collectCss() {
  const files = [
    ...walk(join(root, "base"), (n) => n.endsWith(".css")),
    ...walk(join(root, "tokens"), (n) => n.endsWith(".css")),
  ];
  return files.map((f) => readFileSync(f, "utf8")).join("\n");
}

function tokensFor(classes, css) {
  const tokens = new Set();
  for (const cls of classes.slice(0, 8)) {
    const re = new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^{]*\\{[^}]{0,1200}\\}`, "g");
    for (const block of css.match(re) || []) {
      for (const t of block.matchAll(/--cs-[a-z0-9-]+/g)) tokens.add(t[0]);
    }
  }
  return [...tokens].slice(0, 16);
}

function slotsOf(props) {
  return props.filter((p) =>
    /^(children|icon|actions|title|trigger|header|footer|label|description|prefix|suffix)$/.test(p),
  );
}

function stateModel(props, src) {
  const bits = [];
  if (props.includes("value") && props.includes("onChange")) bits.push("controlled value/onChange");
  if (props.includes("defaultValue")) bits.push("uncontrolled defaultValue");
  if (props.includes("open") && (props.includes("onClose") || props.includes("onOpenChange"))) bits.push("controlled open");
  if (props.includes("disabled")) bits.push("disabled");
  if (props.includes("loading")) bits.push("loading");
  if (src.includes("aria-invalid") || props.includes("invalid") || props.includes("error")) bits.push("invalid");
  return bits;
}

function build() {
  const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
  const css = collectCss();
  const wanted = new Set([
    ...registry.exports.filter((e) => e.maturity === "stable").map((e) => e.name),
    ...HIGH_RISK,
  ]);
  const components = [];
  for (const row of registry.exports) {
    if (!wanted.has(row.name) || !row.primary && !wanted.has(row.name)) continue;
    if (components.some((c) => c.name === row.name)) continue;
    const src = readFileSync(join(root, row.sourcePath), "utf8");
    const props = propsOf(src, row.name);
    const classes = classNames(src);
    const host = hostClass(row.name, classes);
    const tokens = tokensFor(host ? [host, ...classes] : classes, css);
    const keys = keysOf(src);
    const prompt = promptBlurb(row.sourcePath);
    const jsdoc = firstJsdoc(src);
    const anatomy = [
      row.name + ".",
      jsdoc || prompt,
      rootTag(src) ? `Semantic root <${rootTag(src)}>.` : "Provider or composite root.",
      host ? `Host class ${host}.` : "",
      slotsOf(props).length ? `Slots: ${slotsOf(props).join(", ")}.` : "",
    ].filter(Boolean).join(" ");
    const keyboard = keys.length
      ? `Handles ${keys.join(", ")}.` + (src.includes("useOverlayLayer") ? " Overlay manager restores focus and locks scroll." : "")
      : row.name === "OverlayProvider"
        ? "Focus trap + Escape stack via attachFocusTrap / overlay manager."
        : "Tab and native host keyboard. No custom key handlers in source.";
    components.push({
      name: row.name,
      sourcePath: row.sourcePath,
      maturity: row.maturity,
      owner: row.owner,
      backup: row.backup,
      support: row.support,
      package: row.package,
      deprecation: row.deprecation,
      highRisk: HIGH_RISK.includes(row.name),
      root: rootTag(src),
      classes: classes.slice(0, 8),
      props,
      slots: slotsOf(props),
      aria: ariaBits(src),
      keys,
      tokens,
      forwardRef: /forwardRef/.test(src),
      overlay: src.includes("useOverlayLayer"),
      i18n: /useLang|makeT/.test(src),
      states: stateModel(props, src),
      prompt,
      jsdoc,
      anatomy,
      usage: prompt || jsdoc || `Use ${row.name} from ${row.package}.`,
      keyboard,
      ssr: /document\.|window\./.test(src.replace(/useOverlayLayer[\s\S]*?\n/g, ""))
        && !/typeof (?:document|window) === ["']undefined["']/.test(src)
        ? "Guard document/window access; prefer ThemeProvider + getThemeInitScript."
        : "No module-scope document. Safe on React 18/19 with ThemeProvider.",
    });
  }
  components.sort((a, b) => a.name.localeCompare(b.name));
  return {
    generatedBy: "scripts/generate-stable-contracts.mjs",
    headings: [
      "Anatomy", "Usage", "States", "Content", "Keyboard / AT", "Tokens",
      "Responsive / RTL / dark / high-contrast", "Code", "SSR", "Migration", "Design status",
    ],
    components,
  };
}

const data = build();
const outPath = join(root, "docs/stable-contracts.json");
const json = `${JSON.stringify(data, null, 2)}\n`;

if (args.has("--check")) {
  const current = readFileSync(outPath, "utf8");
  if (current !== json) {
    console.error("FAIL generate-stable-contracts --check: docs/stable-contracts.json stale. Run: node scripts/generate-stable-contracts.mjs");
    process.exit(1);
  }
  console.log("PASS generate-stable-contracts --check", { components: data.components.length });
  process.exit(0);
}

writeFileSync(outPath, json);
console.log("wrote", outPath, { components: data.components.length });
