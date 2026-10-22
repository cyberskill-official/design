// In-repo deterministic build for _ds_bundle.js.
//
// Reproduces the Claude Design compiler's consumer contract so JSX edits can be
// rebuilt locally instead of going silently stale:
//   • single classic script (IIFE) that assigns window.<namespace> (namespace is
//     read from _ds_manifest.json — the manifest and bundle must never drift)
//   • React is NOT bundled: modules reference the global React provided by the
//     consumer (script tags, or _esm/cs.mjs which self-ensures React 19.2.8 (umd-react))
//   • every source module is wrapped in its own try/IIFE and pushes load
//     errors onto <namespace>.__errors; authored paths survive in source maps
//   • modules share values through a private __ds_scope object; ESM imports
//     between sources become destructured reads of that scope (dependencies are
//     ordered first, so values exist at read time)
//   • exports whose names start with an uppercase letter are exposed on the
//     namespace; explicitly registered publicHooks are also exposed. Other
//     lowercase exports stay scope-internal (header lists them under
//     unexposedExports)
//   • line 1 is a `/* @ds-bundle: {...} */` JSON header: format 4, namespace,
//     components (name + sourcePath), sourceHashes (first 12 hex chars of the
//     sha256 of every source file), inlinedExternals, unexposedExports
//
// Determinism: source discovery is glob+byte-sort (no OS readdir order), module
// order is Kahn's topological sort with byte-wise min-path tie-breaking (exactly
// reproduces the compiler's observed order), hashes are content-derived, and no
// timestamp is written anywhere. Same sources + same esbuild version (pinned via
// package-lock) ⇒ byte-identical bundle.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";
import MagicString from "magic-string";
import {parse} from "@babel/parser";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const BUNDLE_PATH = join(REPO_ROOT, "_ds_bundle.js");
export const BUNDLE_MAP_PATH = join(REPO_ROOT, "_ds_bundle.js.map");

/** Public library sources only (FIND-025). UI kits + image-slot stay authoring-local. */
const SOURCE_DIRS = ["components"];
const SOURCE_FILES = ["tokens/tokens.js"];

const shortHash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 12);

function walk(dir, out) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(jsx|js)$/.test(name) && !name.endsWith(".d.ts")) out.push(full);
  }
}

/** All bundled source paths, repo-relative POSIX, byte-sorted. */
export function collectSources(root = REPO_ROOT) {
  const abs = [];
  for (const dir of SOURCE_DIRS) walk(join(root, dir), abs);
  for (const f of SOURCE_FILES) abs.push(join(root, f));
  return abs
    .map((p) => relative(root, p).split("\\").join("/"))
    .sort(byteCompare);
}

/** Byte-wise (code-unit) comparison — matches the compiler's path ordering. */
function byteCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Parse the /* @ds-bundle: {...} *\/ header off the first line of a bundle. */
export function parseBundleHeader(bundleText) {
  const firstLine = bundleText.slice(0, bundleText.indexOf("\n"));
  const m = firstLine.match(/^\/\* @ds-bundle: (.*) \*\/$/);
  if (!m) throw new Error("_ds_bundle.js: missing /* @ds-bundle: ... */ header on line 1");
  return JSON.parse(m[1]);
}

const IMPORT_RE = /^import\s+(?:([A-Za-z_$][\w$]*)|\{([^}]*)\})\s+from\s+["']([^"']+)["'];?\s*$/;

/** Scope key for a module's default export (nothing consumes these today, but
 *  the compiler emitted them, so keep the shape: prefix + path + short hash). */
function defaultScopeName(sourcePath) {
  const stem = sourcePath.replace(/\.(jsx|js)$/, "").replace(/[^A-Za-z0-9]+/g, "_");
  const suffix = parseInt(createHash("sha256").update(sourcePath).digest("hex").slice(0, 10), 16)
    .toString(36)
    .slice(0, 6);
  return `__ds_default_${stem}_${suffix}`;
}

/**
 * Turn one ESM source into an IIFE-safe module body:
 *   imports  → destructured reads of __ds_scope (React import dropped — global)
 *   exports  → plain declarations, collected for the scope assignment
 * Returns { code, exports:[{name, kind}], deps:[repoRelPath] }.
 */
function rewriteModule(sourcePath, source) {
  const deps = [];
  const scopeReads = [];
  const exports = [];
  const lines = source.split("\n");
  const mapped = new MagicString(source);
  // Keep significant literal whitespace, but encode it rather than emitting
  // trailing spaces in generated lines (the authored logo data uses these).
  const visit = (node, parent) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "TemplateLiteral" && !node.expressions.length && parent?.type !== "TaggedTemplateExpression" && /[ \t]+\r?\n/.test(node.quasis[0].value.raw)) {
      mapped.overwrite(node.start, node.end, JSON.stringify(node.quasis[0].value.cooked));
    }
    for (const [key, value] of Object.entries(node)) {
      if (["loc", "start", "end"].includes(key)) continue;
      if (Array.isArray(value)) for (const child of value) visit(child, node);
      else if (value && typeof value === "object") visit(value, node);
    }
  };
  visit(parse(source, {sourceType: "module", plugins: ["jsx"]}));
  let offset = 0;

  for (const line of lines) {
    const start = offset;
    offset += line.length + 1;
    const end = Math.min(offset, source.length);
    const im = line.match(IMPORT_RE);
    if (im) {
      const [, defaultName, named, spec] = im;
      mapped.remove(start, end);
      if (spec === "react") continue; // global React — never bundled
      if (spec === "react-dom") {
        if (defaultName || named?.trim() !== "createPortal") throw new Error(`${sourcePath}: only the named createPortal ReactDOM peer import is supported`);
        // Some legacy consumers load ReactDOM after this bundle. Resolve the
        // peer when a portal is actually requested, preserving SSR evaluation.
        scopeReads.push('const createPortal = (...args) => { if (typeof ReactDOM === "undefined" || typeof ReactDOM.createPortal !== "function") throw new Error("ReactDOM.createPortal peer is required to render a portal"); return ReactDOM.createPortal(...args); };');
        continue;
      }
      if (!spec.startsWith(".")) throw new Error(`${sourcePath}: unsupported external import "${spec}"`);
      const depPath = posix.join(posix.dirname(sourcePath), spec);
      deps.push(depPath);
      if (defaultName) {
        scopeReads.push(`const ${defaultName} = __ds_scope.${defaultScopeName(depPath)};`);
      }
      if (named) {
        const picks = named
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const alias = s.match(/^([\w$]+)\s+as\s+([\w$]+)$/);
            return alias ? `${alias[1]}: ${alias[2]}` : s;
          });
        scopeReads.push(`const { ${picks.join(", ")} } = __ds_scope;`);
      }
      continue;
    }

    const decl = line.match(/^export\s+(async\s+function|function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/);
    if (decl) {
      exports.push({ name: decl[2], kind: "named" });
      mapped.remove(start, start + line.match(/^export\s+/)[0].length);
      continue;
    }

    const dflt = line.match(/^export\s+default\s+([A-Za-z_$][\w$]*);?\s*$/);
    if (dflt) {
      exports.push({ name: dflt[1], kind: "default" });
      mapped.remove(start, end);
      continue; // the identifier already exists; scope assignment re-exposes it
    }
    if (/^export[\s{]/.test(line)) throw new Error(`${sourcePath}: unsupported export syntax: ${line.trim()}`);

  }

  if (scopeReads.length) mapped.prepend(scopeReads.join("\n") + "\n");
  return { code: mapped.toString(), map: mapped.generateMap({hires: true, source: sourcePath, includeContent: true}).toString(), exports, deps };
}

/** Kahn's algorithm, always emitting the byte-smallest ready path. */
function topoOrder(paths, depsByPath) {
  const pending = new Set(paths);
  const order = [];
  while (pending.size) {
    const ready = [...pending]
      .filter((p) => depsByPath.get(p).every((d) => !pending.has(d)))
      .sort(byteCompare);
    if (!ready.length) throw new Error("circular import among: " + [...pending].join(", "));
    pending.delete(ready[0]);
    order.push(ready[0]);
  }
  return order;
}

export function buildBundle(root = REPO_ROOT) {
  const catalog = JSON.parse(readFileSync(join(root, "scripts/catalog-source.json"), "utf8"));
  const namespace = catalog.namespace;
  if (!/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(namespace)) {
    throw new Error(`_ds_manifest.json namespace "${namespace}" does not match CyberSkillDesignSystem_<6hex>`);
  }

  const sources = collectSources(root);
  const modules = new Map();
  const sourceHashes = {};

  for (const path of sources) {
    const raw = readFileSync(join(root, path));
    sourceHashes[path] = shortHash(raw);
    const { code, map, exports, deps } = rewriteModule(path, raw.toString("utf8"));
    for (const d of deps) {
      if (!sources.includes(d)) throw new Error(`${path}: import resolves outside the source set: ${d}`);
    }
    const transformed = transformSync(code + "\n//# sourceMappingURL=data:application/json;base64," + Buffer.from(map).toString("base64"), {
      sourcemap: "external",
      sourcefile: path,
      loader: "jsx",
      jsx: "transform",
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
      target: "es2020",
      charset: "utf8",
    });
    const compiled = transformed.code.replace(/\n+$/, "");
    modules.set(path, { compiled, map: JSON.parse(transformed.map), exports, deps });
  }

  const order = topoOrder(sources, new Map(sources.map((p) => [p, modules.get(p).deps])));

  // ---- header ----------------------------------------------------------------
  const components = [];
  const publicHooks = catalog.publicHooks || [];
  if (!Array.isArray(publicHooks) || publicHooks.some(item => !item || !/^use[A-Z][A-Za-z0-9]*$/.test(item.name) || typeof item.sourcePath !== "string") || new Set(publicHooks.map(item => item.name)).size !== publicHooks.length) throw Error("Invalid explicit public hook membership");
  const pendingHooks = new Set(publicHooks.map(item => item.name));
  const unexposed = [];
  for (const path of sources) {
    for (const ex of modules.get(path).exports) {
      if (ex.kind !== "named") continue;
      const publicHook = publicHooks.some(item => item.name === ex.name && item.sourcePath === path);
      if (publicHook) pendingHooks.delete(ex.name);
      (/^[A-Z]/.test(ex.name) || publicHook ? components : unexposed).push({ name: ex.name, sourcePath: path });
    }
  }
  if (pendingHooks.size) throw Error("Missing public hook export: " + [...pendingHooks].join(", "));
  unexposed.sort((a, b) => byteCompare(a.name, b.name) || byteCompare(a.sourcePath, b.sourcePath));

  const header = {
    format: 4,
    namespace,
    components,
    sourceHashes,
    inlinedExternals: [],
    unexposedExports: unexposed,
  };

  // ---- body ------------------------------------------------------------------
  const parts = [
    `/* @ds-bundle: ${JSON.stringify(header)} */`,
    "",
    "(() => {",
    "",
    `const __ds_ns = (window.${namespace} = window.${namespace} || {});`,
    "",
    "const __ds_scope = {};",
    "",
    "(__ds_ns.__errors = __ds_ns.__errors || []);",
    "",
  ];

  const sections = [];
  for (const path of order) {
    const { compiled, map, exports } = modules.get(path);
    const assigns = exports.map((ex) =>
      ex.kind === "default" ? `${defaultScopeName(path)}: ${ex.name}` : ex.name
    );
    parts.push(`// ${path}`);
    parts.push("try { (() => {");
    sections.push({offset: {line: parts.join("\n").split("\n").length, column: 0}, map});
    parts.push(compiled);
    if (assigns.length) parts.push(`Object.assign(__ds_scope, { ${assigns.join(", ")} });`);
    parts.push(
      `})(); } catch (e) { __ds_ns.__errors.push({ path: ${JSON.stringify(path)}, error: String((e && e.message) || e) }); }`
    );
    parts.push("");
  }

  for (const c of components) {
    parts.push(`__ds_ns.${c.name} = __ds_scope.${c.name};`);
    parts.push("");
  }
  parts.push("})();");

  // Chain import/export rewrites and JSX maps before whitespace compaction.
  // Identifiers, syntax choices and each module's error boundary stay intact.
  const indexedMap = {version: 3, sections};
  const input = parts.join("\n") + "\n//# sourceMappingURL=data:application/json;base64," + Buffer.from(JSON.stringify(indexedMap)).toString("base64");
  const compact = transformSync(input, {minifyWhitespace: true, minifyIdentifiers: false, minifySyntax: false, target: "es2020", charset: "utf8", legalComments: "inline", sourcemap: "external", sourcefile: "_ds_bundle.js", banner: `/* @ds-bundle: ${JSON.stringify(header)} */`});
  const map = JSON.parse(compact.map); map.file = "_ds_bundle.js";
  return {text: compact.code + "//# sourceMappingURL=_ds_bundle.js.map\n", mapText: JSON.stringify(map) + "\n", header};
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const { text, mapText, header } = buildBundle();
  writeFileSync(BUNDLE_MAP_PATH, mapText);
  writeFileSync(BUNDLE_PATH, text);
  console.log(
    `built _ds_bundle.js — ${Object.keys(header.sourceHashes).length} modules, ` +
      `${header.components.length} exposed exports, ${header.unexposedExports.length} unexposed, ` +
      `${(Buffer.byteLength(text) / 1024).toFixed(1)} KiB; ${Buffer.byteLength(mapText)} source-map bytes`
  );
}
